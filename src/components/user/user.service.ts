import bcrypt from 'bcrypt';
import * as employeeRepository from './user.repository';
import { Employee } from '../../entities/employee';
import {generateToken} from '../../../middleware/generateToken';
import dotenv from 'dotenv';
import { RoleTypes } from '../../entities/role';
import { Vacation } from '../../entities/vacation';
import * as vacationService from '../vacation/vacation.service';
import { TeamType } from '../../entities/team';
import { StatusTypes } from '../../entities/vacationStatus';
import axios from 'axios';

dotenv.config();

export const getAllUsers = async () => {
    try {
        const employees = await employeeRepository.findAllEmployees();
        return employees;
    } catch (error) {
        throw new Error("Error retrieving employees");
    }
};
export const registerEmployee = async (name: string, password: string, team: TeamType, email: string) => {
    try {
        const existingEmployee = await employeeRepository.findEmployeeByEmail(email);
        if (existingEmployee) {
            return { status: 409, message: "Email already exists" };
        }
    //     const emailCheck = await axios.get(`https://emailvalidator.io/api/verify?email=${email}`)
    //     .then((res: { data: any; }) => res.data)
    //     .catch((_: any) => ({ valid: false }));

    // if (!emailCheck.valid) {
    //     return { status: 400, message: "Email does not exist" };
    // }

        const hashedPassword = await bcrypt.hash(password, 10);

        const teamEntity = await employeeRepository.findTeamByTeamType(team);
        if (!teamEntity) {
            return { status: 404, message: "Invalid team" };
        }

        const role = await employeeRepository.findRoleByRoleName(RoleTypes.Employee);
        if (!role) {
            return { status: 404, message: "Invalid role" };
        }

        const employee = Employee.create({
            name,
            password: hashedPassword,
            email,
            role,
            team: teamEntity
        });

        await employeeRepository.saveEmployee(employee);

        return { status: 200, message: "Registration is made successful" };
    } catch (error) {
        return { status: 500, message: "Internal server error" };
    }
};

export const loginEmployee = async (email: string, password: string) => {
    try {
        const employee = await employeeRepository.findEmployeeByEmail(email);
        if (!employee) {
            return { status: 401, message: "Invalid Credentials" };
        }

        const isPasswordValid = await bcrypt.compare(password, employee.password);
        if (!isPasswordValid) {
            return { status: 401, message: "Invalid Credentials" };
        }

        const user = {
            name: employee.name,
            employeeId: employee.id,
            email,
            role: employee.role,
            team: employee.team
        };

        console.log(user);


        const accessToken = generateToken(user);

        return {
            status: 200,
            employee,
            message: "Logged in successfully",
            accessToken: "Bearer " + accessToken
        };
    } catch (error) {
        return { status: 500, message: "Internal server error" };
    }
};

export const getUserInfo = async (employeeId: number) => {
    try {
        const vacationDates = getVacationDates();

        const employee = await employeeRepository.findEmployeeById(employeeId);
        if (!employee) {
            return { status: 404, message: "Cannot find the employee" };
        }

        const result = await vacationService.fetchUserRequestsService(employeeId);

        if (result.status !== 200 || !Array.isArray(result.response)) {
            return { status: 500, message: "Unexpected response format or status" };
        }

        const requests: Vacation[] = result.response;
        let totalDaysTaken = 0;

        requests.forEach(request => {
            if (request.status.name === StatusTypes.Rejected) {
                return;
            }
            const daysDifference = getDaysDifference(request.dateFrom, request.dateTo, vacationDates);
            totalDaysTaken += daysDifference;
        });

        const daysLeft = 21 - totalDaysTaken;

        return { 
            status: 200,
            data: { 
                employee: employee,
                daysLeft: daysLeft 
            } 
        };
    } catch (error) {
        return { status: 500, message: "Internal server error" };
    }
};

function getDaysDifference(startDate: Date, endDate: Date, vacationDates: Date[]): number {
    const currentYear = new Date().getFullYear();

    let start = new Date(startDate);
    if (start.getFullYear() < currentYear) {
        start = new Date(currentYear, 0, 1);
    }

    let end = new Date(endDate);

    const yearEnd = new Date(currentYear, 11, 31, 23, 59, 59, 999);
    if (end > yearEnd) {
        end = yearEnd;
    }

    if (end < start) {
        return 0;
    }

    const filteredDays = new Set(vacationDates.map(date => date.toDateString()));

    let totalDays = 0;

    for (let currentDate = new Date(start); currentDate <= end; currentDate.setDate(currentDate.getDate() + 1)) {
        const dayOfWeek = currentDate.getDay();
        const isWeekend = dayOfWeek === 5 || dayOfWeek === 6; // 5 = Friday, 6 = Saturday
        const isVacationDate = filteredDays.has(currentDate.toDateString());

        if (!isWeekend && !isVacationDate) {
            console.log("Current date:", currentDate.toDateString());
            totalDays += 1;
        }
    }

    return totalDays;
}

const getVacationDates = (): Date[] => {
    const dateStrings = ["4/8/2024", "6/8/2024"];
    return dateStrings.map(dateString => new Date(dateString));
};

export const addingAvatar = async (employeeId: number, avatarSrc: string) => {
    const employee = await employeeRepository.findEmployeeById(employeeId);

    if (!employee) {
        return { status: 404, message: "Cannot find the employee" };
    }

    employee.avatarSrc = avatarSrc;
    await employeeRepository.saveEmployee(employee);

    return { status: 200, employee };
};

export const updateRole = async (employeeId: number, role: RoleTypes) => {
    const employee = await employeeRepository.findEmployeeById(employeeId);

    if(!employee){
        return { status: 404, message: "Cannot find the employee" };
    }
    const roleEntity = await employeeRepository.findRoleByRoleName(role);
    if (!roleEntity) {
        return { status: 404, message: "Invalid role" };
    }
    employee.role = roleEntity
    await employeeRepository.saveEmployee(employee);

    return { status: 200, employee };
};

export const changePassword = async(employeeId:number, oldPassword:string, newPassword:string) => {
    const employee = await employeeRepository.findEmployeeById(employeeId);
    if(!employee){
        return { status: 404, message: "Cannot find the employee" };
    }

    if(!await bcrypt.compare(oldPassword, employee.password)){
        return { status: 401, message: "Incorrect old password" };
    }
    

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    employee.password = hashedPassword
    await employeeRepository.saveEmployee(employee);

    return { status: 200, employee};
};