import bcrypt from 'bcrypt';
import * as employeeRepository from './user.repository';
import { Employee } from '../../entities/employee';
import {generateToken} from '../../../middleware/generateToken';
import dotenv from 'dotenv';
import { RoleTypes } from '../../entities/role';
import { Vacation } from '../../entities/vacation';
import * as vacationService from '../vacation/vacation.service';
import { ReasonTypes } from '../../entities/reason';
import { TeamType } from '../../entities/team';

dotenv.config();

export const registerEmployee = async (name: string, password: string, team: TeamType, phonenumber: string, email: string) => {
    try {
        const existingEmployee = await employeeRepository.findEmployeeByEmail(email);
        if (existingEmployee) {
            return { status: 409, message: "Email already exists" };
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const teamEntity = await employeeRepository.findTeamByTeamType(team);
        if (!teamEntity) {
            return { status: 404, message: "Invalid team" };
        }

        const employee = Employee.create({
            name,
            password: hashedPassword,
            phoneNumber: phonenumber,
            email,
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
            return { status: 401, message: "Incorrect email or password" };
        }

        const isPasswordValid = await bcrypt.compare(password, employee.password);
        if (!isPasswordValid) {
            return { status: 401, message: "Incorrect email or password" };
        }

        const user = {
            email,
            role: employee.role
        };

        const accessToken = generateToken(user);

        return {
            status: 200,
            employee,
            message: "Logged in successfully",
            accessToken
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
        let sickLeaveDaysTaken = 0;
        let emergencyDaysTaken = 0;

        requests.forEach(request => {
            if (!request.reason) {
                return;
            }
            const daysDifference = getDaysDifference(request.dateFrom, request.dateTo, vacationDates);
            if (request.reason.name === ReasonTypes.SICK_LEAVE) {
                sickLeaveDaysTaken += daysDifference;
            } else if (request.reason.name === ReasonTypes.EMERGENCY) {
                emergencyDaysTaken += daysDifference;
            }
        });

        const totalSickLeaveDays = 30;
        const totalEmergencyDays = 20;

        const daysLeft = {
            sickLeaveDaysLeft: totalSickLeaveDays - sickLeaveDaysTaken,
            emergencyDaysLeft: totalEmergencyDays - emergencyDaysTaken,
        };

        return { 
            status: 200,
            data: { 
                employee,
                daysLeft 
            } 
        };
    } catch (error) {
        console.error("Error:", error); // Debugging log
        return { status: 500, message: "Internal server error" };
    }
};


function getDaysDifference(startDate: Date, endDate: Date, vacationDates: Date[]): number {
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    const differenceInTime = end.getTime() - start.getTime();
    
    const differenceInDays = Math.ceil(differenceInTime / (1000 * 3600 * 24));
    
    const filteredDays = vacationDates.reduce((acc, vacDate) => {
        const vacTime = vacDate.getTime();
        if (vacTime >= start.getTime() && vacTime <= end.getTime()) {
            acc += 1;
        }
        return acc;
    }, 0);
    
    return differenceInDays - filteredDays;
}

const getVacationDates = (): Date[] => {
    const dateStrings = ["4/8/2024", "6/8/2024"];
    return dateStrings.map(dateString => new Date(dateString));
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