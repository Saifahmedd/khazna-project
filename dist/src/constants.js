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
exports.initializeData = void 0;
const role_1 = require("./entities/role");
const vacationStatus_1 = require("./entities/vacationStatus");
const team_1 = require("./entities/team");
const reason_1 = require("./entities/reason");
const employee_1 = require("./entities/employee");
const bcrypt_1 = __importDefault(require("bcrypt"));
const employeeRepository = __importStar(require("././components/user/user.repository"));
const initializeData = (connection) => __awaiter(void 0, void 0, void 0, function* () {
    const roleRepository = connection.getRepository(role_1.Role);
    const existingRoles = yield roleRepository.find();
    if (existingRoles.length === 0) {
        yield roleRepository.save([
            { role: role_1.RoleTypes.SuperAdmin },
            { role: role_1.RoleTypes.Admin },
            { role: role_1.RoleTypes.User }
        ]);
    }
    const vacationStatusRepository = connection.getRepository(vacationStatus_1.VacationStatus);
    const existingStatus = yield vacationStatusRepository.find();
    if (existingStatus.length === 0) {
        yield vacationStatusRepository.save([
            { name: vacationStatus_1.StatusTypes.Pending },
            { name: vacationStatus_1.StatusTypes.Accepted },
            { name: vacationStatus_1.StatusTypes.Rejected },
        ]);
    }
    const teamRepository = connection.getRepository(team_1.Team);
    const existingTeams = yield teamRepository.find();
    if (existingTeams.length === 0) {
        yield teamRepository.save([
            { type: team_1.TeamType.BACKEND },
            { type: team_1.TeamType.FRONTEND },
            { type: team_1.TeamType.TESTING },
            { type: team_1.TeamType.PRODUCT },
        ]);
    }
    const reasonRepository = connection.getRepository(reason_1.Reason);
    const existingReasons = yield reasonRepository.find();
    if (existingReasons.length === 0) {
        yield reasonRepository.save([
            { name: reason_1.ReasonTypes.SICK_LEAVE },
            { name: reason_1.ReasonTypes.PERSONAL },
            { name: reason_1.ReasonTypes.EMERGENCY },
        ]);
    }
    const superAdminRole = yield employeeRepository.findRoleByRoleName(role_1.RoleTypes.SuperAdmin);
    if (!superAdminRole) {
        console.error('SuperAdmin role not found. Please check your initialization data.');
        return;
    }
    const defaultSuperAdminEmail = 'superadmin@khazna.com';
    let superAdmin = yield employee_1.Employee.findOne({ where: { email: defaultSuperAdminEmail } });
    if (!superAdmin) {
        const hashedPassword = yield bcrypt_1.default.hash('SuperAdminPassword123!', 10);
        superAdmin = employee_1.Employee.create({
            name: 'SuperAdmin',
            email: defaultSuperAdminEmail,
            password: hashedPassword,
            phoneNumber: '01023255440',
            role: superAdminRole,
        });
        yield employee_1.Employee.save(superAdmin);
    }
});
exports.initializeData = initializeData;
//# sourceMappingURL=constants.js.map