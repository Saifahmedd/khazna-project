"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const generateToken = (user) => {
    const secret = process.env.ACCESS_TOKEN_SECRET || 'default_secret';
    return jsonwebtoken_1.default.sign(user, secret, { expiresIn: '1d' });
};
exports.generateToken = generateToken;
