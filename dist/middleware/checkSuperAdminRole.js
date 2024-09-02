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
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkSuperAdminRole = void 0;
const employee_1 = require("../src/entities/employee");
const role_1 = require("../src/entities/role");
const checkSuperAdminRole = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const email = req.user.email;
        const user = yield employee_1.Employee.findOne({
            where: { email: email },
            relations: ['role']
        });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        if (user.role.role != role_1.RoleTypes.SuperAdmin) {
            return res.status(403).json({ message: "Access denied. Super Admins only." });
        }
        next();
        return;
    }
    catch (error) {
        return res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
});
exports.checkSuperAdminRole = checkSuperAdminRole;
//# sourceMappingURL=checkSuperAdminRole.js.map