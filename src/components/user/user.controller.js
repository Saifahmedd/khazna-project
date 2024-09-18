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
exports.changePassword = exports.updateRole = exports.updateAvatar = exports.getUserInfo = exports.loginEmployee = exports.registerEmployee = void 0;
var employeeService = require("./user.service");
var role_1 = require("../../entities/role");
var team_1 = require("../../entities/team");
var crypto_1 = require("crypto");
var nodemailer_1 = require("nodemailer");
var checkPassword = function (password) {
    var passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z\d!@#$%^&*(),.?":{}|<>]{8,}$/;
    return passwordRegex.test(password);
};
var checkEmail = function (email) {
    var emailRegex = /^[^\s@]+@khazna\.app$/;
    return emailRegex.test(email);
};
var checkPhone = function (phone) {
    return phone.length === 11;
};
var checkName = function (name) {
    var nameRegex = /^[A-Za-z]+$/;
    return nameRegex.test(name);
};
var registerEmployee = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, name, team, phonenumber, email, teamType, password, transporter, mailOptions, result, error_1;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = req.body, name = _a.name, team = _a.team, phonenumber = _a.phonenumber, email = _a.email;
                if (!name || !team || !phonenumber || !email) {
                    return [2 /*return*/, res.status(400).json({ message: "Missing input" })];
                }
                if (!checkName(name)) {
                    return [2 /*return*/, res.status(400).json({ message: "Invalid name" })];
                }
                // if (!checkEmail(email)) {
                //     return res.status(400).json({ message: "Invalid email" });
                // }
                if (!checkPhone(phonenumber)) {
                    return [2 /*return*/, res.status(400).json({ message: "Invalid phone number" })];
                }
                _b.label = 1;
            case 1:
                _b.trys.push([1, 4, , 5]);
                teamType = team_1.TeamType[team.toUpperCase()];
                password = crypto_1.default.randomBytes(8).toString('hex');
                transporter = nodemailer_1.default.createTransport({
                    service: 'gmail',
                    auth: {
                        user: process.env.EMAIL_USER,
                        pass: process.env.EMAIL_PASSWORD
                    }
                });
                mailOptions = {
                    from: process.env.EMAIL_USER,
                    to: email,
                    subject: 'Your Account Password',
                    text: "Hello ".concat(name, ",\n\nYour account has been created. Here is your password: ").concat(password, "\n\nPlease change it after logging in.\n\nLogin here: https://accounts.google.com\n\nBest regards,\n").concat(process.env.SuperAdminName)
                };
                return [4 /*yield*/, transporter.sendMail(mailOptions)];
            case 2:
                _b.sent();
                return [4 /*yield*/, employeeService.registerEmployee(name, password, teamType, phonenumber, email)];
            case 3:
                result = _b.sent();
                return [2 /*return*/, res.status(result.status).json(result.message)];
            case 4:
                error_1 = _b.sent();
                return [2 /*return*/, res.status(500).json({ message: "Internal server error" })];
            case 5: return [2 /*return*/];
        }
    });
}); };
exports.registerEmployee = registerEmployee;
var loginEmployee = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, email, password, result, error_2;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = req.body, email = _a.email, password = _a.password;
                if (!email || !password) {
                    return [2 /*return*/, res.status(400).json({ message: "Missing inputs" })];
                }
                _b.label = 1;
            case 1:
                _b.trys.push([1, 3, , 4]);
                return [4 /*yield*/, employeeService.loginEmployee(email, password)];
            case 2:
                result = _b.sent();
                return [2 /*return*/, res.status(result.status).json({
                        message: result.message,
                        employee: result.employee,
                        accessToken: result.accessToken
                    })];
            case 3:
                error_2 = _b.sent();
                return [2 /*return*/, res.status(500).json({ message: "Internal server error" })];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.loginEmployee = loginEmployee;
var getUserInfo = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var employeeId, result, error_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                employeeId = req.params.employeeId;
                if (!employeeId) {
                    return [2 /*return*/, res.status(400).json({ message: "Invalid input" })];
                }
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, employeeService.getUserInfo(parseInt(employeeId))];
            case 2:
                result = _a.sent();
                if (result.status === 200) {
                    return [2 /*return*/, res.status(200).json(result.data)];
                }
                else {
                    return [2 /*return*/, res.status(result.status).json({ message: result.message })];
                }
                return [3 /*break*/, 4];
            case 3:
                error_3 = _a.sent();
                return [2 /*return*/, res.status(500).json({ message: "Error fetching user info" })];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.getUserInfo = getUserInfo;
var updateAvatar = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var employeeId, avatarId, result, error_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                employeeId = req.body.employeeId;
                avatarId = req.params.avatarId;
                if (!employeeId || !avatarId) {
                    return [2 /*return*/, res.status(400).json({ message: "Invalid input" })];
                }
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, employeeService.addingAvatar(parseInt(employeeId), parseInt(avatarId))];
            case 2:
                result = _a.sent();
                if (result.status === 404) {
                    return [2 /*return*/, res.status(404).json({ message: result.message })];
                }
                return [2 /*return*/, res.status(200).json({ message: "Avatar updated successfully", employee: result.employee })];
            case 3:
                error_4 = _a.sent();
                console.error("Error adding avatar:", error_4);
                return [2 /*return*/, res.status(500).json({ message: "Internal server error" })];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.updateAvatar = updateAvatar;
var updateRole = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, employeeId, role, roleEnum, result, error_5;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = req.params, employeeId = _a.employeeId, role = _a.role;
                if (!employeeId || !role) {
                    return [2 /*return*/, res.status(400).json({ message: "Invalid input" })];
                }
                _b.label = 1;
            case 1:
                _b.trys.push([1, 3, , 4]);
                roleEnum = role_1.RoleTypes[role];
                return [4 /*yield*/, employeeService.updateRole(parseInt(employeeId), roleEnum)];
            case 2:
                result = _b.sent();
                return [2 /*return*/, res.status(result.status).json({ message: result.message, employee: result.employee })];
            case 3:
                error_5 = _b.sent();
                console.error(error_5);
                return [2 /*return*/, res.status(500).json({ message: "Internal server error" })];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.updateRole = updateRole;
var changePassword = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var employeeId, _a, oldPassword, newPassword, result, error_6;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                employeeId = req.params.employeeId;
                _a = req.body, oldPassword = _a.oldPassword, newPassword = _a.newPassword;
                if (!employeeId || !oldPassword || !newPassword) {
                    return [2 /*return*/, res.status(400).json({ message: "Invalid input" })];
                }
                if (!checkPassword(newPassword)) {
                    return [2 /*return*/, res.status(400).json({ message: "Invalid Password" })];
                }
                _b.label = 1;
            case 1:
                _b.trys.push([1, 3, , 4]);
                return [4 /*yield*/, employeeService.changePassword(parseInt(employeeId), oldPassword, newPassword)];
            case 2:
                result = _b.sent();
                return [2 /*return*/, res.status(result.status).json({ message: "Password changed successfully" })];
            case 3:
                error_6 = _b.sent();
                console.error(error_6);
                return [2 /*return*/, res.status(500).json({ message: "Internal server error" })];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.changePassword = changePassword;
