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
            const dayFrom = request.dateFrom.getDate();
            const monthFrom = request.dateFrom.getMonth() + 1;

            const dayTo = request.dateTo.getDate();
            const monthTo = request.dateTo.getMonth() + 1;

            const daysDifference = getDaysDifference(dayFrom, monthFrom, dayTo, monthTo, vacationDates);

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
            emergencyDaysLeft: totalEmergencyDays - emergencyDaysTaken
        };

        return { 
            status: 200,
            data: { 
                employee,
                daysLeft 
            } 
        };
    } catch (error) {
        return { status: 500, message: "Internal server error" };
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