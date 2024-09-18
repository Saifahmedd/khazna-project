"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.changePassword = exports.updateRole = exports.addingAvatar = exports.getUserInfo = exports.loginEmployee = exports.registerEmployee = void 0;
var bcrypt_1 = require("bcrypt");
var employeeRepository = require("./user.repository");
var employee_1 = require("../../entities/employee");
var generateToken_1 = require("../../../middleware/generateToken");
var dotenv_1 = require("dotenv");
var role_1 = require("../../entities/role");
var vacationService = require("../vacation/vacation.service");
var vacationStatus_1 = require("../../entities/vacationStatus");
dotenv_1.default.config();
var registerEmployee = function (name, password, team, phonenumber, email) { return __awaiter(void 0, void 0, void 0, function () {
    var existingEmployee, hashedPassword, teamEntity, role, employee, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 6, , 7]);
                return [4 /*yield*/, employeeRepository.findEmployeeByEmail(email)];
            case 1:
                existingEmployee = _a.sent();
                if (existingEmployee) {
                    return [2 /*return*/, { status: 409, message: "Email already exists" }];
                }
                return [4 /*yield*/, bcrypt_1.default.hash(password, 10)];
            case 2:
                hashedPassword = _a.sent();
                return [4 /*yield*/, employeeRepository.findTeamByTeamType(team)];
            case 3:
                teamEntity = _a.sent();
                if (!teamEntity) {
                    return [2 /*return*/, { status: 404, message: "Invalid team" }];
                }
                return [4 /*yield*/, employeeRepository.findRoleByRoleName(role_1.RoleTypes.Employee)];
            case 4:
                role = _a.sent();
                if (!role) {
                    return [2 /*return*/, { status: 404, message: "Invalid role" }];
                }
                employee = employee_1.Employee.create({
                    name: name,
                    password: hashedPassword,
                    phoneNumber: phonenumber,
                    email: email,
                    role: role,
                    team: teamEntity
                });
                return [4 /*yield*/, employeeRepository.saveEmployee(employee)];
            case 5:
                _a.sent();
                return [2 /*return*/, { status: 200, message: "Registration is made successful" }];
            case 6:
                error_1 = _a.sent();
                return [2 /*return*/, { status: 500, message: "Internal server error" }];
            case 7: return [2 /*return*/];
        }
    });
}); };
exports.registerEmployee = registerEmployee;
var loginEmployee = function (email, password) { return __awaiter(void 0, void 0, void 0, function () {
    var employee, isPasswordValid, user, accessToken, error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                return [4 /*yield*/, employeeRepository.findEmployeeByEmail(email)];
            case 1:
                employee = _a.sent();
                if (!employee) {
                    return [2 /*return*/, { status: 401, message: "Invalid Credentials" }];
                }
                return [4 /*yield*/, bcrypt_1.default.compare(password, employee.password)];
            case 2:
                isPasswordValid = _a.sent();
                if (!isPasswordValid) {
                    return [2 /*return*/, { status: 401, message: "Invalid Credentials" }];
                }
                user = {
                    employeeId: employee.id,
                    email: email,
                    role: employee.role
                };
                accessToken = (0, generateToken_1.generateToken)(user);
                return [2 /*return*/, {
                        status: 200,
                        employee: employee,
                        message: "Logged in successfully",
                        accessToken: "Bearer " + accessToken
                    }];
            case 3:
                error_2 = _a.sent();
                return [2 /*return*/, { status: 500, message: "Internal server error" }];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.loginEmployee = loginEmployee;
var getUserInfo = function (employeeId) { return __awaiter(void 0, void 0, void 0, function () {
    var vacationDates_1, employee, result, requests, totalDaysTaken_1, daysLeft, error_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                vacationDates_1 = getVacationDates();
                return [4 /*yield*/, employeeRepository.findEmployeeById(employeeId)];
            case 1:
                employee = _a.sent();
                if (!employee) {
                    return [2 /*return*/, { status: 404, message: "Cannot find the employee" }];
                }
                return [4 /*yield*/, vacationService.fetchUserRequestsService(employeeId)];
            case 2:
                result = _a.sent();
                if (result.status !== 200 || !Array.isArray(result.response)) {
                    return [2 /*return*/, { status: 500, message: "Unexpected response format or status" }];
                }
                requests = result.response;
                totalDaysTaken_1 = 0;
                requests.forEach(function (request) {
                    if (request.status.name === vacationStatus_1.StatusTypes.Rejected) {
                        return;
                    }
                    var daysDifference = getDaysDifference(request.dateFrom, request.dateTo, vacationDates_1);
                    totalDaysTaken_1 += daysDifference;
                });
                daysLeft = 21 - totalDaysTaken_1;
                return [2 /*return*/, {
                        status: 200,
                        data: {
                            employee: employee,
                            daysLeft: daysLeft
                        }
                    }];
            case 3:
                error_3 = _a.sent();
                console.error("Error:", error_3); // Debugging log
                return [2 /*return*/, { status: 500, message: "Internal server error" }];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.getUserInfo = getUserInfo;
function getDaysDifference(startDate, endDate, vacationDates) {
    var currentYear = new Date().getFullYear();
    var start = new Date(startDate);
    if (start.getFullYear() < currentYear) {
        start = new Date(currentYear, 0, 1);
    }
    var end = new Date(endDate);
    var yearEnd = new Date(currentYear, 11, 31, 23, 59, 59, 999);
    if (end > yearEnd) {
        end = yearEnd;
    }
    if (end < start) {
        return 0;
    }
    var filteredDays = new Set(vacationDates.map(function (date) { return date.toDateString(); }));
    var totalDays = 0;
    for (var currentDate = new Date(start); currentDate <= end; currentDate.setDate(currentDate.getDate() + 1)) {
        var dayOfWeek = currentDate.getDay();
        var isWeekend = dayOfWeek === 5 || dayOfWeek === 6; // 5 = Friday, 6 = Saturday
        var isVacationDate = filteredDays.has(currentDate.toDateString());
        if (!isWeekend && !isVacationDate) {
            console.log("Current date:", currentDate.toDateString());
            totalDays += 1;
        }
    }
    return totalDays;
}
var getVacationDates = function () {
    var dateStrings = ["4/8/2024", "6/8/2024"];
    return dateStrings.map(function (dateString) { return new Date(dateString); });
};
var addingAvatar = function (employeeId, avatarId) { return __awaiter(void 0, void 0, void 0, function () {
    var employee;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, employeeRepository.findEmployeeById(employeeId)];
            case 1:
                employee = _a.sent();
                if (!employee) {
                    return [2 /*return*/, { status: 404, message: "Cannot find the employee" }];
                }
                employee.avatarId = avatarId;
                return [4 /*yield*/, employeeRepository.saveEmployee(employee)];
            case 2:
                _a.sent();
                return [2 /*return*/, { status: 200, employee: employee }];
        }
    });
}); };
exports.addingAvatar = addingAvatar;
var updateRole = function (employeeId, role) { return __awaiter(void 0, void 0, void 0, function () {
    var employee, roleEntity;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, employeeRepository.findEmployeeById(employeeId)];
            case 1:
                employee = _a.sent();
                if (!employee) {
                    return [2 /*return*/, { status: 404, message: "Cannot find the employee" }];
                }
                return [4 /*yield*/, employeeRepository.findRoleByRoleName(role)];
            case 2:
                roleEntity = _a.sent();
                if (!roleEntity) {
                    return [2 /*return*/, { status: 404, message: "Invalid role" }];
                }
                employee.role = roleEntity;
                return [4 /*yield*/, employeeRepository.saveEmployee(employee)];
            case 3:
                _a.sent();
                return [2 /*return*/, { status: 200, employee: employee }];
        }
    });
}); };
exports.updateRole = updateRole;
var changePassword = function (employeeId, oldPassword, newPassword) { return __awaiter(void 0, void 0, void 0, function () {
    var employee, hashedPassword;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, employeeRepository.findEmployeeById(employeeId)];
            case 1:
                employee = _a.sent();
                if (!employee) {
                    return [2 /*return*/, { status: 404, message: "Cannot find the employee" }];
                }
                return [4 /*yield*/, bcrypt_1.default.compare(oldPassword, employee.password)];
            case 2:
                if (!(_a.sent())) {
                    return [2 /*return*/, { status: 401, message: "Incorrect old password" }];
                }
                return [4 /*yield*/, bcrypt_1.default.hash(newPassword, 10)];
            case 3:
                hashedPassword = _a.sent();
                employee.password = hashedPassword;
                return [4 /*yield*/, employeeRepository.saveEmployee(employee)];
            case 4:
                _a.sent();
                return [2 /*return*/, { status: 200, employee: employee }];
        }
    });
}); };
exports.changePassword = changePassword;
