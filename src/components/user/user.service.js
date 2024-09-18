"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.changePassword = exports.updateRole = exports.addingAvatar = exports.getUserInfo = exports.loginEmployee = exports.registerEmployee = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const employeeRepository = __importStar(require("./user.repository"));
const employee_1 = require("../../entities/employee");
const generateToken_1 = require("../../../middleware/generateToken");
const dotenv_1 = __importDefault(require("dotenv"));
const role_1 = require("../../entities/role");
const vacationService = __importStar(require("../vacation/vacation.service"));
const vacationStatus_1 = require("../../entities/vacationStatus");
dotenv_1.default.config();
const registerEmployee = (name, password, team, phonenumber, email) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const existingEmployee = yield employeeRepository.findEmployeeByEmail(email);
        if (existingEmployee) {
            return { status: 409, message: "Email already exists" };
        }
        const hashedPassword = yield bcrypt_1.default.hash(password, 10);
        const teamEntity = yield employeeRepository.findTeamByTeamType(team);
        if (!teamEntity) {
            return { status: 404, message: "Invalid team" };
        }
        const role = yield employeeRepository.findRoleByRoleName(role_1.RoleTypes.Employee);
        if (!role) {
            return { status: 404, message: "Invalid role" };
        }
        const employee = employee_1.Employee.create({
            name,
            password: hashedPassword,
            phoneNumber: phonenumber,
            email,
            role,
            team: teamEntity
        });
        yield employeeRepository.saveEmployee(employee);
        return { status: 200, message: "Registration is made successful" };
    }
    catch (error) {
        return { status: 500, message: "Internal server error" };
    }
});
exports.registerEmployee = registerEmployee;
const loginEmployee = (email, password) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const employee = yield employeeRepository.findEmployeeByEmail(email);
        if (!employee) {
            return { status: 401, message: "Invalid Credentials" };
        }
        const isPasswordValid = yield bcrypt_1.default.compare(password, employee.password);
        if (!isPasswordValid) {
            return { status: 401, message: "Invalid Credentials" };
        }
        const user = {
            employeeId: employee.id,
            email,
            role: employee.role
        };
        const accessToken = (0, generateToken_1.generateToken)(user);
        return {
            status: 200,
            employee,
            message: "Logged in successfully",
            accessToken: "Bearer " + accessToken
        };
    }
    catch (error) {
        return { status: 500, message: "Internal server error" };
    }
});
exports.loginEmployee = loginEmployee;
const getUserInfo = (employeeId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const vacationDates = getVacationDates();
        const employee = yield employeeRepository.findEmployeeById(employeeId);
        if (!employee) {
            return { status: 404, message: "Cannot find the employee" };
        }
        const result = yield vacationService.fetchUserRequestsService(employeeId);
        if (result.status !== 200 || !Array.isArray(result.response)) {
            return { status: 500, message: "Unexpected response format or status" };
        }
        const requests = result.response;
        let totalDaysTaken = 0;
        requests.forEach(request => {
            if (request.status.name === vacationStatus_1.StatusTypes.Rejected) {
                return;
            }
            const daysDifference = getDaysDifference(request.dateFrom, request.dateTo, vacationDates);
            totalDaysTaken += daysDifference;
        });
        const daysLeft = 21 - totalDaysTaken;
        return {
            status: 200,
            data: {
                employee,
                daysLeft
            }
        };
    }
    catch (error) {
        console.error("Error:", error); // Debugging log
        return { status: 500, message: "Internal server error" };
    }
});
exports.getUserInfo = getUserInfo;
function getDaysDifference(startDate, endDate, vacationDates) {
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
const getVacationDates = () => {
    const dateStrings = ["4/8/2024", "6/8/2024"];
    return dateStrings.map(dateString => new Date(dateString));
};
const addingAvatar = (employeeId, avatarId) => __awaiter(void 0, void 0, void 0, function* () {
    const employee = yield employeeRepository.findEmployeeById(employeeId);
    if (!employee) {
        return { status: 404, message: "Cannot find the employee" };
    }
    employee.avatarId = avatarId;
    yield employeeRepository.saveEmployee(employee);
    return { status: 200, employee };
});
exports.addingAvatar = addingAvatar;
const updateRole = (employeeId, role) => __awaiter(void 0, void 0, void 0, function* () {
    const employee = yield employeeRepository.findEmployeeById(employeeId);
    if (!employee) {
        return { status: 404, message: "Cannot find the employee" };
    }
    const roleEntity = yield employeeRepository.findRoleByRoleName(role);
    if (!roleEntity) {
        return { status: 404, message: "Invalid role" };
    }
    employee.role = roleEntity;
    yield employeeRepository.saveEmployee(employee);
    return { status: 200, employee };
});
exports.updateRole = updateRole;
const changePassword = (employeeId, oldPassword, newPassword) => __awaiter(void 0, void 0, void 0, function* () {
    const employee = yield employeeRepository.findEmployeeById(employeeId);
    if (!employee) {
        return { status: 404, message: "Cannot find the employee" };
    }
    if (!(yield bcrypt_1.default.compare(oldPassword, employee.password))) {
        return { status: 401, message: "Incorrect old password" };
    }
    const hashedPassword = yield bcrypt_1.default.hash(newPassword, 10);
    employee.password = hashedPassword;
    yield employeeRepository.saveEmployee(employee);
    return { status: 200, employee };
});
exports.changePassword = changePassword;
