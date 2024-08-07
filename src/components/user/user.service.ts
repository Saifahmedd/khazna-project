import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import * as employeeRepository from './user.repository';
import { Employee } from '../../entities/employee';
import {generateToken} from '../../../middleware/generateToken';
import dotenv from 'dotenv';
import { RoleTypes } from '../../entities/constants';
import { Vacation } from '../../entities/vacation';
import * as vacationService from '../vacation/vacation.service';

dotenv.config();

export const registerEmployee = async (name: string, password: string, role: RoleTypes, phonenumber: string, email: string) => {
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
        password: hashedPassword,
        phoneNumber: phonenumber,
        email,
        role: roleEntity
    });

    await employeeRepository.saveEmployee(employee);

    const user = { 
        email,
        role: roleEntity.role
    };

    const accessToken = generateToken(user);

    return { message: "Registration is made successfully", user, accessToken };
};

export const loginEmployee = async (email: string, password: string) => {
    const employee = await employeeRepository.findEmployeeByEmail(email);
    if(employee){
        const checkPassword = await bcrypt.compare(password, employee.password);
        if (!employee || !checkPassword) {
            throw new Error("Incorrect email or password");
        }
    
        return {employee, message: "Logged in successfully"};
    }
    else{
        return {employee, message: "Incorrect email or password"}
    }

};

export const getUserInfo = async (employeeId: number) => {
    const vacationDates = getVacationDates();

    const employee = await employeeRepository.findEmployeeById(employeeId);
    if (!employee) {
        return { status: 404, message: "Cannot find the employee" };
    }

    const result = await vacationService.fetchUserRequestsService(employeeId);

    if (result.status === 200 && Array.isArray(result.response)) {
        const requests: Vacation[] = result.response;
        const differencesInDays: number[] = [];

        requests.forEach(request => {
            const dayFrom = request.dateFrom.getDate();
            const monthFrom = request.dateFrom.getMonth() + 1;

            const dayTo = request.dateTo.getDate();
            const monthTo = request.dateTo.getMonth() + 1;

            const differenceInDays = getDaysDifference(dayFrom, monthFrom, dayTo, monthTo, vacationDates);
            differencesInDays.push(differenceInDays);
        });

        let totalDays = employee.role.role === RoleTypes.Admin ? 20 : 10;
        let daysTaken = differencesInDays.reduce((acc, curr) => acc + curr, 0);
        let daysLeft = totalDays - daysTaken;

        if (daysLeft >= 0) {
            return { 
                status: 200,
                data: { 
                    avatar: employee.avatarId, 
                    name: employee.name, 
                    team: employee.team, 
                    daysLeft 
                } 
            };
        } else {
            return {status: 400, message: "All vacation days are taken!" };
        }

    } else {
        return { status: 500, message: "Unexpected response format or status" };
    }
};

const getDaysDifference = (dayFrom: number, monthFrom: number, dayTo: number, monthTo: number, vacationDates: string[]): number => {
    const startDate = new Date(new Date().getFullYear(), monthFrom - 1, dayFrom);
    const endDate = new Date(new Date().getFullYear(), monthTo - 1, dayTo);

    let daysDifference = 0;

    for (let currentDate = new Date(startDate); currentDate <= endDate; currentDate.setDate(currentDate.getDate() + 1)) {
        const dayOfWeek = currentDate.getDay();
        const formattedDate = `${currentDate.getDate()}/${currentDate.getMonth() + 1}/${currentDate.getFullYear()}`;

        if (dayOfWeek !== 5 && dayOfWeek !== 6 && !vacationDates.includes(formattedDate)) {
            daysDifference++;
        }
    }

    return daysDifference;
};
const getVacationDates = () => {
    return ["4/8/2024", "6/8/2024"];
};

export const addingAvatar = async (employeeId: number, avatarId: number) => {
    const employee = await employeeRepository.findEmployeeById(employeeId);

    if (!employee) {
        return { status: 404, message: "Cannot find the employee" };
    }

    employee.avatarId = avatarId;
    await employeeRepository.saveEmployee(employee);

    return { status: 200, employee };
};
