import { Request, Response } from 'express';
import * as employeeService from './user.service';

const checkPassword = (password: string): boolean => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{7,17}$/;
    return passwordRegex.test(password);
};

const checkEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

const checkPhone = (phone: string): boolean => {
    return phone.length === 11;
}

export const registerEmployee = async (req: Request, res: Response) => {
    const { name, password, role, phonenumber, email } = req.body;

    if (!name || !password || !role || !phonenumber || !email) {
        return res.status(400).json({ message: "Missing input" });
    }

    if (!checkPassword(password)) {
        return res.status(400).json({ message: "Invalid password" });
    }

    if (!checkEmail(email)) {
        return res.status(400).json({ message: "Invalid email" });
    }

    if (!checkPhone(phonenumber)) {
        return res.status(400).json({ message: "Invalid phone number" });
    }

    try {
        const result = await employeeService.registerEmployee(name, password, role, phonenumber, email);
        return res.status(result.status).json(result);
    } catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const loginEmployee = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: "Missing inputs" });
    }

    if (!checkPassword(password)) {
        return res.status(400).json({ message: "Invalid password" });
    }

    if (!checkEmail(email)) {
        return res.status(400).json({ message: "Invalid email" });
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
    const { employeeId } = req.body;

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
