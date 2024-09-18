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
exports.changePassword = exports.updateRole = exports.updateAvatar = exports.getUserInfo = exports.loginEmployee = exports.registerEmployee = void 0;
const employeeService = __importStar(require("./user.service"));
const role_1 = require("../../entities/role");
const team_1 = require("../../entities/team");
const crypto_1 = __importDefault(require("crypto"));
const nodemailer_1 = __importDefault(require("nodemailer"));
const checkPassword = (password) => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z\d!@#$%^&*(),.?":{}|<>]{8,}$/;
    return passwordRegex.test(password);
};
const checkEmail = (email) => {
    const emailRegex = /^[^\s@]+@khazna\.app$/;
    return emailRegex.test(email);
};
const checkPhone = (phone) => {
    return phone.length === 11;
};
const checkName = (name) => {
    const nameRegex = /^[A-Za-z]+$/;
    return nameRegex.test(name);
};
const registerEmployee = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, team, phonenumber, email } = req.body;
    if (!name || !team || !phonenumber || !email) {
        return res.status(400).json({ message: "Missing input" });
    }
    if (!checkName(name)) {
        return res.status(400).json({ message: "Invalid name" });
    }
    // if (!checkEmail(email)) {
    //     return res.status(400).json({ message: "Invalid email" });
    // }
    if (!checkPhone(phonenumber)) {
        return res.status(400).json({ message: "Invalid phone number" });
    }
    try {
        const teamType = team_1.TeamType[team.toUpperCase()];
        const password = crypto_1.default.randomBytes(8).toString('hex');
        const transporter = nodemailer_1.default.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASSWORD
            }
        });
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Your Account Password',
            text: `Hello ${name},\n\nYour account has been created. Here is your password: ${password}\n\nPlease change it after logging in.\n\nLogin here: https://accounts.google.com\n\nBest regards,\n${process.env.SuperAdminName}`
        };
        yield transporter.sendMail(mailOptions);
        const result = yield employeeService.registerEmployee(name, password, teamType, phonenumber, email);
        return res.status(result.status).json(result.message);
    }
    catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
});
exports.registerEmployee = registerEmployee;
const loginEmployee = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ message: "Missing inputs" });
    }
    try {
        const result = yield employeeService.loginEmployee(email, password);
        return res.status(result.status).json({
            message: result.message,
            employee: result.employee,
            accessToken: result.accessToken
        });
    }
    catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
});
exports.loginEmployee = loginEmployee;
const getUserInfo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { employeeId } = req.params;
    if (!employeeId) {
        return res.status(400).json({ message: "Invalid input" });
    }
    try {
        const result = yield employeeService.getUserInfo(parseInt(employeeId));
        if (result.status === 200) {
            return res.status(200).json(result.data);
        }
        else {
            return res.status(result.status).json({ message: result.message });
        }
    }
    catch (error) {
        return res.status(500).json({ message: "Error fetching user info" });
    }
});
exports.getUserInfo = getUserInfo;
const updateAvatar = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { employeeId } = req.body;
    const { avatarId } = req.params;
    if (!employeeId || !avatarId) {
        return res.status(400).json({ message: "Invalid input" });
    }
    try {
        const result = yield employeeService.addingAvatar(parseInt(employeeId), parseInt(avatarId));
        if (result.status === 404) {
            return res.status(404).json({ message: result.message });
        }
        return res.status(200).json({ message: "Avatar updated successfully", employee: result.employee });
    }
    catch (error) {
        console.error("Error adding avatar:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
});
exports.updateAvatar = updateAvatar;
const updateRole = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { employeeId, role } = req.params;
    if (!employeeId || !role) {
        return res.status(400).json({ message: "Invalid input" });
    }
    try {
        const roleEnum = role_1.RoleTypes[role];
        const result = yield employeeService.updateRole(parseInt(employeeId), roleEnum);
        return res.status(result.status).json({ message: result.message, employee: result.employee });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
});
exports.updateRole = updateRole;
const changePassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { employeeId } = req.params;
    const { oldPassword, newPassword } = req.body;
    if (!employeeId || !oldPassword || !newPassword) {
        return res.status(400).json({ message: "Invalid input" });
    }
    if (!checkPassword(newPassword)) {
        return res.status(400).json({ message: "Invalid Password" });
    }
    try {
        const result = yield employeeService.changePassword(parseInt(employeeId), oldPassword, newPassword);
        return res.status(result.status).json({ message: "Password changed successfully" });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
});
exports.changePassword = changePassword;
