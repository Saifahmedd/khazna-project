import { Request, Response } from 'express';
import * as employeeService from './user.service';

export const registerEmployee = async (req: Request, res: Response) => {
    const { name, password, role, phonenumber, email } = req.body;
    if (!name || !password || !role || !phonenumber || !email) {
        res.status(401).json({ message: "Invalid input" });
        return;
    }
    try {
        const result = await employeeService.registerEmployee(name, password, role, phonenumber, email);
        res.status(200).json(result);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const loginEmployee = async (req: Request, res: Response) => {
    const { email, password } = req.body;
    if (!email || !password) {
        res.status(401).json({ message: "Invalid input" });
        return;
    }
    try {
        const result = employeeService.loginEmployee(email, password);
        res.status(200).json({employee: (await result).employee  ,message: "Logged in successfully"});
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const getUserInfo = async (req: Request, res: Response) => {
    const { employeeId } = req.body;
    if (!employeeId) {
        res.status(401).json({ message: "Invalid input" });
        return;
    }

    try {
        const result = await employeeService.getUserInfo(parseInt(employeeId));

        if (result.status === 200) {
            res.status(200).json(result.data);
        } else {
            res.status(result.status).json({ message: result.message });
        }
    } catch (error) {
        console.error("Error fetching user requests:", error.message);
        res.status(500).json({ message: "Error fetching user requests" });
    }
};

export const updateAvatar = async (req: Request, res: Response) => {
    const { employeeId } = req.body;
    const { avatarId } = req.params

    if (!employeeId || !avatarId) {
        return res.status(401).json({ message: "Invalid input" });
    }

    try {
        const result = await employeeService.addingAvatar(parseInt(employeeId), parseInt(avatarId));

        if (result.status === 404) {
            return res.status(404).json({ message: result.message });
        }

        return res.status(200).json({ message: "Avatar updated successfully", employee: result.employee });
    } catch (error) {
        console.error("Error adding avatar:", error.message);
        return res.status(500).json({ message: "Internal server error" });
    }
};
