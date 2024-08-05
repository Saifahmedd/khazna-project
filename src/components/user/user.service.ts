import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import * as employeeRepository from './user.repository';
import { Employee } from '../../entities/employee';
import {generateToken} from '../../../middleware/generateToken';
import dotenv from 'dotenv';
import { RoleTypes } from '../../entities/role';

dotenv.config();

export const registerEmployee = async (name: string, username: string, password: string, role: RoleTypes, phonenumber: string, email: string) => {
    const existingEmployee = await employeeRepository.findEmployeeByEmail(email);
    if (existingEmployee) {
        throw new Error("Email is already exists");
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const roleEntity = await employeeRepository.findRoleByRoleName(role);
    if (!roleEntity) {
        throw new Error("Invalid role");
    }

    const employee = Employee.create({
        name,
        username,
        password: hashedPassword,
        phoneNumber: phonenumber,
        email,
        role: roleEntity
    });

    await employeeRepository.saveEmployee(employee);

    const user = { 
        username,
        role: roleEntity.role,
        email
    };

    const accessToken = generateToken(user);

    return { message: "Registration is made successfully", user, accessToken };
};

export const loginEmployee = async (email: string, password: string) => {
    const employee = await employeeRepository.findEmployeeByEmail(email);

    if (!employee) {
        throw new Error("Cannot find this email");
    }

    const checkPassword = await bcrypt.compare(password, employee.password);
    if (!checkPassword) {
        throw new Error("Incorrect email or password");
    }

    return { message: "Logged in successfully"};
};

export const deleteEmployee = async (email: string) => {
    const employee = await employeeRepository.findEmployeeByEmail(email);

    if (!employee) {
        throw new Error("Employee not found");
    }

    await employeeRepository.deleteEmployee(employee);

    return "Employee deleted successfully";
};
