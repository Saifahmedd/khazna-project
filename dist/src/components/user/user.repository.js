"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findTeamByTeamType = exports.findRoleByRoleName = exports.deleteEmployee = exports.saveEmployee = exports.findEmployeeById = exports.findEmployeeByEmail = void 0;
const employee_1 = require("../../entities/employee");
const role_1 = require("../../entities/role");
const team_1 = require("../../entities/team");
const findEmployeeByEmail = (email) => {
    return employee_1.Employee.findOne({ where: { email }, relations: ['role'] });
};
exports.findEmployeeByEmail = findEmployeeByEmail;
const findEmployeeById = (employeeId) => {
    return employee_1.Employee.findOne({ where: { id: employeeId }, relations: ['role', 'team'] });
};
exports.findEmployeeById = findEmployeeById;
const saveEmployee = (employee) => {
    return employee_1.Employee.save(employee);
};
exports.saveEmployee = saveEmployee;
const deleteEmployee = (employee) => {
    return employee_1.Employee.remove(employee);
};
exports.deleteEmployee = deleteEmployee;
const findRoleByRoleName = (role) => {
    return role_1.Role.findOneBy({ role });
};
exports.findRoleByRoleName = findRoleByRoleName;
const findTeamByTeamType = (team) => {
    return team_1.Team.findOneBy({ type: team });
};
exports.findTeamByTeamType = findTeamByTeamType;
//# sourceMappingURL=user.repository.js.map