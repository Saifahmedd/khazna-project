"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateToken = void 0;
var jsonwebtoken_1 = require("jsonwebtoken");
var generateToken = function (user) {
    var secret = process.env.ACCESS_TOKEN_SECRET || 'default_secret';
    return jsonwebtoken_1.default.sign(user, secret, { expiresIn: '1d' });
};
exports.generateToken = generateToken;
