import { Request, Response } from 'express';
import * as employeeService from './user.service';
import { RoleTypes } from '../../entities/role';
import { TeamType } from '../../entities/team';
import crypto from 'crypto';
import nodemailer from 'nodemailer';

const checkPassword = (password: string): boolean => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z\d!@#$%^&*(),.?":{}|<>]{8,}$/;
    return passwordRegex.test(password);
};

const checkEmail = (email: string): boolean => {
    // Update regex to allow dots before the @khazna.app
    const emailRegex = /^[^\s@]+(\.[^\s@]+)*@khazna\.app$/;
    return emailRegex.test(email);
};

const checkPhone = (phone: string): boolean => {
    return phone.length === 11;
};

const checkName = (name: string): boolean => {
    // Update regex to allow letters and spaces
    const nameRegex = /^[A-Za-z\s]+$/;
    return nameRegex.test(name);
};

export const getAllUsers = async (req: Request, res: Response) => {
    const employees = await employeeService.getAllUsers();
    return res.status(200).json(employees);
};

function generatePassword(length: number) {
    const upperCase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lowerCase = 'abcdefghijklmnopqrstuvwxyz';
    const numbers = '0123456789';
    const specialChars = '!@#$%^&*()_+-=[]{}|;:,.<>?';
    
    // Ensure at least one character from each set
    const requiredCharacters = [
        upperCase[Math.floor(Math.random() * upperCase.length)],
        lowerCase[Math.floor(Math.random() * lowerCase.length)],
        numbers[Math.floor(Math.random() * numbers.length)],
        specialChars[Math.floor(Math.random() * specialChars.length)]
    ];

    // Create a pool of all characters
    const allChars = upperCase + lowerCase + numbers + specialChars;

    // Fill the rest of the password length with random characters from allChars
    for (let i = requiredCharacters.length; i < length; i++) {
        requiredCharacters.push(allChars[Math.floor(Math.random() * allChars.length)]);
    }

    // Shuffle the result to avoid predictable patterns
    const shuffledPassword = requiredCharacters.sort(() => 0.5 - Math.random()).join('');

    return shuffledPassword;
}

export const registerEmployee = async (req: Request, res: Response) => {
    const { name, team, email } = req.body;

    if (!name || !team || !email) {
        return res.status(400).json({ message: "Missing input" });
    }

    if (!checkName(name)) {
        return res.status(400).json({ message: "Invalid name" });
    }

    if (!checkEmail(email)) {
        return res.status(400).json({ message: "Invalid email" });
    }

    try {
        const teamType = TeamType[team.toUpperCase() as keyof typeof TeamType];
        const password = generatePassword(12);

        const result = await employeeService.registerEmployee(name, password, teamType, email);

        if (result.status == 200) {
            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: process.env.EMAIL_USER,
                    pass: process.env.EMAIL_PASSWORD
                }
            });
            
            const mailOptions = {
                from: process.env.EMAIL_USER,
                to: email,
                subject: 'Your Account Password',
                text: `Hello ${name},\n\nYour account has been created. Here is your password: ${password}\n\nPlease change it after logging in.\n\nLogin here: https://accounts.google.com\n\nBest regards,\n${process.env.SuperAdminName}`
            };
    
            await transporter.sendMail(mailOptions);
        }
        
        return res.status(result.status).json(result.message);
    } catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const loginEmployee = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: "Missing inputs" });
    }

    try {
        const result = await employeeService.loginEmployee(email, password);
        return res.status(result.status).json({
            message: result.message,
            employee: result.employee,
            accessToken: result.accessToken
        });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const getUserInfo = async (req: Request, res: Response) => {
    const { employeeId } = req.params;

    if (!employeeId) {
        return res.status(400).json({ message: "Invalid input" });
    }

    try {
        const result = await employeeService.getUserInfo(parseInt(employeeId));

        if (result.status === 200) {
            return res.status(200).json(result.data);
        } else {
            return res.status(result.status).json({ message: result.message });
        }
    } catch (error) {
        return res.status(500).json({ message: "Error fetching user info" });
    }
};

export const updateAvatar = async (req: Request, res: Response) => {
    const { employeeId } = req.body;
    const { avatarId } = req.params;

    if (!employeeId || !avatarId) {
        return res.status(400).json({ message: "Invalid input" });
    }

    try {
        const result = await employeeService.addingAvatar(parseInt(employeeId), parseInt(avatarId));

        if (result.status === 404) {
            return res.status(404).json({ message: result.message });
        }

        return res.status(200).json({ message: "Avatar updated successfully", employee: result.employee });
    } catch (error) {
        console.error("Error adding avatar:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const updateRole = async (req: Request, res: Response) => {
    const {employeeId, role} = req.params;
    
    if(!employeeId || !role){
        return res.status(400).json({ message: "Invalid input" });
    }
    try{
        const roleEnum = RoleTypes[role as keyof typeof RoleTypes];
        const result = await employeeService.updateRole(parseInt(employeeId), roleEnum);

        return res.status(result.status).json({message: result.message, employee: result.employee});
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const changePassword = async (req: Request, res: Response) => {
    const {employeeId} = req.params;
    const {oldPassword, newPassword} = req.body;

    if(!employeeId || !oldPassword || !newPassword){
        return res.status(400).json({ message: "Invalid input" });
    }
    
    if(!checkPassword(newPassword)){
        return res.status(400).json({ message: "Invalid Password" });
    }

    try{
        const result = await employeeService.changePassword(parseInt(employeeId), oldPassword, newPassword);
        return res.status(result.status).json({message: "Password changed successfully"});
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
}