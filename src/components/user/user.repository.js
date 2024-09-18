"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findTeamByTeamType = exports.findRoleByRoleName = exports.deleteEmployee = exports.saveEmployee = exports.findEmployeeById = exports.findEmployeeByEmail = void 0;
var employee_1 = require("../../entities/employee");
var role_1 = require("../../entities/role");
var team_1 = require("../../entities/team");
var findEmployeeByEmail = function (email) {
    return employee_1.Employee.findOne({ where: { email: email }, relations: ['role'] });
};
exports.findEmployeeByEmail = findEmployeeByEmail;
var findEmployeeById = function (employeeId) {
    return employee_1.Employee.findOne({ where: { id: employeeId }, relations: ['role', 'team'] });
};
exports.findEmployeeById = findEmployeeById;
var saveEmployee = function (employee) {
    return employee_1.Employee.save(employee);
};
exports.saveEmployee = saveEmployee;
var deleteEmployee = function (employee) {
    return employee_1.Employee.remove(employee);
};
exports.deleteEmployee = deleteEmployee;
var findRoleByRoleName = function (role) {
    return role_1.Role.findOneBy({ role: role });
};
exports.findRoleByRoleName = findRoleByRoleName;
var findTeamByTeamType = function (team) {
    return team_1.Team.findOneBy({ type: team });
};
exports.findTeamByTeamType = findTeamByTeamType;
