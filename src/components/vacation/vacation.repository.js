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
exports.findAllRequests = exports.fetchVacationsByTeam = exports.filterRequestsBySQL = exports.findEmployeeById = exports.deleteVacationRequest = exports.updateVacationRequest = exports.findVacationById = exports.saveVacationRequest = exports.findReasonByName = exports.createVacationRequest = exports.updateRequest = exports.findRequestById = exports.findRequestsByEmployeeIdWithSkip = exports.findRequestsByEmployeeId = exports.findVacationStatusByName = void 0;
var employee_1 = require("../../entities/employee");
var vacation_1 = require("../../entities/vacation");
var vacationStatus_1 = require("../../entities/vacationStatus");
var reason_1 = require("../../entities/reason");
var findVacationStatusByName = function (name) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, vacationStatus_1.VacationStatus.findOneBy({ name: name })];
            case 1: return [2 /*return*/, _a.sent()];
        }
    });
}); };
exports.findVacationStatusByName = findVacationStatusByName;
var findRequestsByEmployeeId = function (employeeId) { return __awaiter(void 0, void 0, void 0, function () {
    var requests;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, vacation_1.Vacation.find({
                    where: { employee: { id: employeeId } },
                    relations: ['employee', 'status', 'reason']
                })];
            case 1:
                requests = _a.sent();
                return [2 /*return*/, requests];
        }
    });
}); };
exports.findRequestsByEmployeeId = findRequestsByEmployeeId;
var findRequestsByEmployeeIdWithSkip = function (employeeId, skip, take, column, order) { return __awaiter(void 0, void 0, void 0, function () {
    var currentYear, startOfYear, endOfYear, queryBuilder, requests, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                currentYear = new Date().getFullYear();
                startOfYear = new Date(currentYear, 0, 1);
                endOfYear = new Date(currentYear, 11, 31, 23, 59, 59, 999);
                queryBuilder = vacation_1.Vacation.createQueryBuilder('vacation')
                    .where('vacation.employeeId = :employeeId', { employeeId: employeeId })
                    .andWhere('vacation.dateFrom BETWEEN :startOfYear AND :endOfYear', {
                    startOfYear: startOfYear,
                    endOfYear: endOfYear,
                })
                    .leftJoinAndSelect('vacation.employee', 'employee')
                    .leftJoinAndSelect('vacation.status', 'status')
                    .leftJoinAndSelect('vacation.reason', 'reason')
                    .leftJoinAndSelect('employee.role', 'role')
                    .leftJoinAndSelect('employee.team', 'team');
                // Apply pagination if both skip and take are provided
                if (typeof skip === 'number' && !isNaN(skip) && typeof take === 'number' && !isNaN(take)) {
                    queryBuilder.skip(skip);
                    queryBuilder.take(take);
                }
                // Apply sorting with default order by 'createdAt' descending
                if (column && order) {
                    queryBuilder.orderBy("vacation.".concat(column), order);
                }
                else {
                    queryBuilder.orderBy('vacation.createdAt', 'DESC');
                }
                return [4 /*yield*/, queryBuilder.getMany()];
            case 1:
                requests = _a.sent();
                return [2 /*return*/, { status: 200, response: requests }];
            case 2:
                error_1 = _a.sent();
                return [2 /*return*/, { status: 500, response: { message: "Error fetching requests", error: error_1.message } }];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.findRequestsByEmployeeIdWithSkip = findRequestsByEmployeeIdWithSkip;
var findRequestById = function (id) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, vacation_1.Vacation.findOne({ where: { id: id } })];
            case 1: return [2 /*return*/, _a.sent()];
        }
    });
}); };
exports.findRequestById = findRequestById;
var updateRequest = function (request, updateData) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                Object.assign(request, updateData);
                return [4 /*yield*/, request.save()];
            case 1: return [2 /*return*/, _a.sent()];
        }
    });
}); };
exports.updateRequest = updateRequest;
var createVacationRequest = function (dateFrom, dateTo, reason, employee, status) {
    return vacation_1.Vacation.create({ dateFrom: dateFrom, dateTo: dateTo, reason: reason, employee: employee, status: status });
};
exports.createVacationRequest = createVacationRequest;
var findReasonByName = function (reasonName) { return __awaiter(void 0, void 0, void 0, function () {
    var reason, error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, reason_1.Reason.findOne({ where: { name: reasonName } })];
            case 1:
                reason = _a.sent();
                return [2 /*return*/, reason || null];
            case 2:
                error_2 = _a.sent();
                console.error("Error finding reason by name:", error_2);
                throw new Error("Could not find reason");
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.findReasonByName = findReasonByName;
var saveVacationRequest = function (request) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, request.save()];
            case 1: return [2 /*return*/, _a.sent()];
        }
    });
}); };
exports.saveVacationRequest = saveVacationRequest;
var findVacationById = function (requestId) { return __awaiter(void 0, void 0, void 0, function () {
    var vacation, role;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0: return [4 /*yield*/, vacation_1.Vacation.findOne({
                    where: { id: requestId },
                    relations: ['employee', 'employee.role', 'status', 'reason']
                })];
            case 1:
                vacation = _b.sent();
                if (!vacation) {
                    throw new Error("Vacation with ID ".concat(requestId, " not found"));
                }
                role = (_a = vacation.employee) === null || _a === void 0 ? void 0 : _a.role;
                if (!role) {
                    throw new Error('Role information is missing for the employee');
                }
                return [2 /*return*/, { vacation: vacation, role: role }];
        }
    });
}); };
exports.findVacationById = findVacationById;
var updateVacationRequest = function (request, updateData) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                Object.assign(request, updateData);
                return [4 /*yield*/, request.save()];
            case 1: return [2 /*return*/, _a.sent()];
        }
    });
}); };
exports.updateVacationRequest = updateVacationRequest;
var deleteVacationRequest = function (request) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, request.remove()];
            case 1: return [2 /*return*/, _a.sent()];
        }
    });
}); };
exports.deleteVacationRequest = deleteVacationRequest;
var findEmployeeById = function (employeeId) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, employee_1.Employee.findOne({
                    where: { id: employeeId },
                    relations: ['role', 'team']
                })];
            case 1: return [2 /*return*/, _a.sent()];
        }
    });
}); };
exports.findEmployeeById = findEmployeeById;
var filterRequestsBySQL = function (sql, values, connection) { return __awaiter(void 0, void 0, void 0, function () {
    var result, err_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, connection.query(sql, values)];
            case 1:
                result = _a.sent();
                return [2 /*return*/, result];
            case 2:
                err_1 = _a.sent();
                console.error("Error in filterRequestsBySQL:", err_1);
                throw new Error("Error executing query: ".concat(err_1.message));
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.filterRequestsBySQL = filterRequestsBySQL;
var fetchVacationsByTeam = function (teamId, connection) { return __awaiter(void 0, void 0, void 0, function () {
    var vacations, error_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, connection
                        .getRepository(vacation_1.Vacation)
                        .createQueryBuilder('vacation')
                        .innerJoinAndSelect('vacation.employee', 'employee')
                        .innerJoinAndSelect('employee.team', 'team')
                        .where('team.id = :teamId', { teamId: teamId })
                        .getMany()];
            case 1:
                vacations = _a.sent();
                return [2 /*return*/, vacations];
            case 2:
                error_3 = _a.sent();
                console.error('Error fetching vacations by team:', error_3);
                throw new Error('Failed to fetch vacations by team');
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.fetchVacationsByTeam = fetchVacationsByTeam;
var findAllRequests = function (connection) { return __awaiter(void 0, void 0, void 0, function () {
    var requests, error_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, connection
                        .getRepository(vacation_1.Vacation)
                        .createQueryBuilder('vacation')
                        .innerJoinAndSelect('vacation.employee', 'employee')
                        .innerJoinAndSelect('vacation.status', 'status')
                        .innerJoinAndSelect('vacation.reason', 'reason')
                        .getMany()];
            case 1:
                requests = _a.sent();
                return [2 /*return*/, requests];
            case 2:
                error_4 = _a.sent();
                throw new Error('Failed to fetch all requests');
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.findAllRequests = findAllRequests;
