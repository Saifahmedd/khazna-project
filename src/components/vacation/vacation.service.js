"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
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
exports.getAllVacations = exports.getVacationsByTeam = exports.filterRequests = exports.updateAdminRequestService = exports.deleteUserRequestService = exports.updateUserRequestService = exports.createRequestService = exports.fetchUserRequestsService = exports.fetchUserRequestsServiceByPages = void 0;
var vacation_repository_1 = require("./vacation.repository");
var vacationStatus_1 = require("../../entities/vacationStatus");
var requestRepository = require("./vacation.repository");
var role_1 = require("../../entities/role");
var fetchUserRequestsServiceByPages = function (employeeId, page, limit, column, order) { return __awaiter(void 0, void 0, void 0, function () {
    var employee, skip, _a, status_1, response_1, requests, finalRequests, error_1;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 3, , 4]);
                return [4 /*yield*/, (0, vacation_repository_1.findEmployeeById)(employeeId)];
            case 1:
                employee = _b.sent();
                if (!employee) {
                    return [2 /*return*/, { status: 404, response: { message: "Employee not found" } }];
                }
                skip = (page - 1) * limit;
                return [4 /*yield*/, (0, vacation_repository_1.findRequestsByEmployeeIdWithSkip)(employeeId, skip, limit, column, order)];
            case 2:
                _a = _b.sent(), status_1 = _a.status, response_1 = _a.response;
                if (status_1 !== 200 || !Array.isArray(response_1)) {
                    return [2 /*return*/, { status: status_1, response: response_1 }];
                }
                requests = response_1;
                finalRequests = requests.map(function (request) {
                    var adjustedDateFrom = new Date(request.dateFrom);
                    var adjustedDateTo = new Date(request.dateTo);
                    return __assign(__assign({}, request), { date: "".concat(adjustedDateFrom.getTime(), ",").concat(adjustedDateTo.getTime()), dateFrom: undefined, dateTo: undefined });
                });
                return [2 /*return*/, { status: 200, response: { data: finalRequests, count: response_1.length } }];
            case 3:
                error_1 = _b.sent();
                return [2 /*return*/, { status: 500, response: { message: "Error fetching requests", error: error_1.message } }];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.fetchUserRequestsServiceByPages = fetchUserRequestsServiceByPages;
var fetchUserRequestsService = function (employeeId) { return __awaiter(void 0, void 0, void 0, function () {
    var employee, requests, error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                return [4 /*yield*/, (0, vacation_repository_1.findEmployeeById)(employeeId)];
            case 1:
                employee = _a.sent();
                if (!employee) {
                    return [2 /*return*/, { status: 404, response: { message: "Employee not found" } }];
                }
                return [4 /*yield*/, (0, vacation_repository_1.findRequestsByEmployeeId)(employeeId)];
            case 2:
                requests = _a.sent();
                requests = requests.map(function (request) {
                    if (request.dateFrom) {
                        request.dateFrom = new Date(request.dateFrom.getTime());
                    }
                    if (request.dateTo) {
                        request.dateTo = new Date(request.dateTo.getTime());
                    }
                    return request;
                });
                return [2 /*return*/, { status: 200, response: requests }];
            case 3:
                error_2 = _a.sent();
                return [2 /*return*/, { status: 500, response: { message: "Error fetching requests", error: error_2.message } }];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.fetchUserRequestsService = fetchUserRequestsService;
var createRequestService = function (employeeId, dateFrom, dateTo, reason) { return __awaiter(void 0, void 0, void 0, function () {
    var employee, status_2, reasonEntity, request, error_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 8, , 9]);
                return [4 /*yield*/, (0, vacation_repository_1.findEmployeeById)(employeeId)];
            case 1:
                employee = _a.sent();
                if (!employee) {
                    return [2 /*return*/, { status: 404, response: { message: "Employee not found" } }];
                }
                if (!(employee.role && employee.role.role === role_1.RoleTypes.SuperAdmin)) return [3 /*break*/, 3];
                return [4 /*yield*/, (0, vacation_repository_1.findVacationStatusByName)(vacationStatus_1.StatusTypes.Approved)];
            case 2:
                status_2 = _a.sent();
                return [3 /*break*/, 5];
            case 3: return [4 /*yield*/, (0, vacation_repository_1.findVacationStatusByName)(vacationStatus_1.StatusTypes.Pending)];
            case 4:
                status_2 = _a.sent();
                _a.label = 5;
            case 5:
                if (!status_2) {
                    return [2 /*return*/, { status: 404, response: { message: "Status not found" } }];
                }
                return [4 /*yield*/, (0, vacation_repository_1.findReasonByName)(reason)];
            case 6:
                reasonEntity = _a.sent();
                if (!reasonEntity) {
                    return [2 /*return*/, { status: 404, response: { message: "Reason not found" } }];
                }
                request = (0, vacation_repository_1.createVacationRequest)(dateFrom, dateTo, reasonEntity, employee, status_2);
                return [4 /*yield*/, (0, vacation_repository_1.saveVacationRequest)(request)];
            case 7:
                _a.sent();
                return [2 /*return*/, { status: 201, response: { message: "Inserted a Request successfully" } }];
            case 8:
                error_3 = _a.sent();
                return [2 /*return*/, { status: 500, response: { message: "Internal Server Error", error: error_3.message } }];
            case 9: return [2 /*return*/];
        }
    });
}); };
exports.createRequestService = createRequestService;
var updateUserRequestService = function (requestId, reviewerId, dateFrom, dateTo, reason) { return __awaiter(void 0, void 0, void 0, function () {
    var updateData, dateFromParsed, dateToParsed, reasonEntity, request, error_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 5, , 6]);
                updateData = {};
                if (dateFrom || dateTo) {
                    dateFromParsed = dateFrom ? new Date(dateFrom) : undefined;
                    dateToParsed = dateTo ? new Date(dateTo) : undefined;
                    if ((dateFrom && !(dateFromParsed instanceof Date && !isNaN(dateFromParsed.getTime()))) ||
                        (dateTo && !(dateToParsed instanceof Date && !isNaN(dateToParsed.getTime())))) {
                        return [2 /*return*/, { status: 400, response: { message: "Invalid date format" } }];
                    }
                    if (dateFromParsed)
                        updateData.dateFrom = dateFromParsed;
                    if (dateToParsed)
                        updateData.dateTo = dateToParsed;
                }
                if (!reason) return [3 /*break*/, 2];
                return [4 /*yield*/, (0, vacation_repository_1.findReasonByName)(reason)];
            case 1:
                reasonEntity = _a.sent();
                if (!reasonEntity) {
                    return [2 /*return*/, { status: 404, response: { message: "Reason not found" } }];
                }
                updateData.reason = reasonEntity;
                _a.label = 2;
            case 2:
                if (reviewerId !== undefined) {
                    updateData.reviewerId = reviewerId;
                }
                return [4 /*yield*/, (0, vacation_repository_1.findVacationById)(requestId)];
            case 3:
                request = _a.sent();
                if (!request) {
                    return [2 /*return*/, { status: 404, response: { message: "Request not found" } }];
                }
                if (request.role.role == role_1.RoleTypes.SuperAdmin) {
                    request.vacation.status.name = vacationStatus_1.StatusTypes.Approved;
                }
                if (request.vacation.status.name != vacationStatus_1.StatusTypes.Pending) {
                    return [2 /*return*/, { status: 403, response: { message: "Cannot update this request" } }];
                }
                return [4 /*yield*/, (0, vacation_repository_1.updateVacationRequest)(request.vacation, updateData)];
            case 4:
                _a.sent();
                return [2 /*return*/, { status: 200, response: { message: "Request updated successfully" } }];
            case 5:
                error_4 = _a.sent();
                return [2 /*return*/, { status: 500, response: { message: "Internal Server Error", error: error_4.message } }];
            case 6: return [2 /*return*/];
        }
    });
}); };
exports.updateUserRequestService = updateUserRequestService;
var deleteUserRequestService = function (requestId) { return __awaiter(void 0, void 0, void 0, function () {
    var request, error_5;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                return [4 /*yield*/, (0, vacation_repository_1.findVacationById)(requestId)];
            case 1:
                request = _a.sent();
                if (!request) {
                    return [2 /*return*/, { status: 404, response: { message: "Request not found" } }];
                }
                if (request.role.role != role_1.RoleTypes.SuperAdmin && request.vacation.status.name != vacationStatus_1.StatusTypes.Pending) {
                    return [2 /*return*/, { status: 403, response: { message: "Cannot delete this request" } }];
                }
                return [4 /*yield*/, (0, vacation_repository_1.deleteVacationRequest)(request.vacation)];
            case 2:
                _a.sent();
                return [2 /*return*/, { status: 200, response: { message: "Request deleted successfully" } }];
            case 3:
                error_5 = _a.sent();
                return [2 /*return*/, { status: 500, response: { message: "Internal Server Error", error: error_5.message } }];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.deleteUserRequestService = deleteUserRequestService;
var updateAdminRequestService = function (requestId, status) { return __awaiter(void 0, void 0, void 0, function () {
    var request, vacationStatus, error_6;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 4, , 5]);
                return [4 /*yield*/, (0, vacation_repository_1.findVacationById)(requestId)];
            case 1:
                request = _a.sent();
                if (!request) {
                    return [2 /*return*/, { status: 404, response: { message: "Request not found" } }];
                }
                return [4 /*yield*/, (0, vacation_repository_1.findVacationStatusByName)(status)];
            case 2:
                vacationStatus = _a.sent();
                if (!vacationStatus) {
                    return [2 /*return*/, { status: 404, response: { message: "Status not found" } }];
                }
                request.vacation.status = vacationStatus;
                return [4 /*yield*/, (0, vacation_repository_1.saveVacationRequest)(request.vacation)];
            case 3:
                _a.sent();
                return [2 /*return*/, { status: 200, response: { message: "Request updated successfully" } }];
            case 4:
                error_6 = _a.sent();
                return [2 /*return*/, { status: 500, response: { message: "Internal Server Error", error: error_6.message } }];
            case 5: return [2 /*return*/];
        }
    });
}); };
exports.updateAdminRequestService = updateAdminRequestService;
var filterRequests = function (filters, connection) { return __awaiter(void 0, void 0, void 0, function () {
    var sql, filterKeys, filterValues, requests, finalRequests, error_7;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                sql = "SELECT * FROM Vacation WHERE ";
                filterKeys = Object.keys(filters);
                filterValues = Object.values(filters);
                sql += filterKeys.map(function (key) { return "".concat(key, " = ?"); }).join(' AND ');
                return [4 /*yield*/, (0, vacation_repository_1.filterRequestsBySQL)(sql, filterValues, connection)];
            case 1:
                requests = _a.sent();
                finalRequests = requests.map(function (request) {
                    var adjustedDateFrom = new Date(request.dateFrom);
                    var adjustedDateTo = new Date(request.dateTo);
                    return __assign(__assign({}, request), { date: "".concat(adjustedDateFrom.getTime(), ",").concat(adjustedDateTo.getTime()), dateFrom: undefined, dateTo: undefined });
                });
                return [2 /*return*/, { status: 200, response: { data: finalRequests, count: requests.length } }];
            case 2:
                error_7 = _a.sent();
                console.error("Error in filterRequests:", error_7);
                return [2 /*return*/, { status: 500, response: { message: "Internal Server Error", error: error_7.message } }];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.filterRequests = filterRequests;
var getVacationsByTeam = function (teamId, connection) { return __awaiter(void 0, void 0, void 0, function () {
    var vacations, finalRequests, error_8;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, (0, vacation_repository_1.fetchVacationsByTeam)(teamId, connection)];
            case 1:
                vacations = _a.sent();
                if (vacations.length === 0) {
                    return [2 /*return*/, { status: 404, data: "No vacation requests found for the specified team" }];
                }
                finalRequests = vacations.map(function (request) {
                    var adjustedDateFrom = new Date(request.dateFrom);
                    var adjustedDateTo = new Date(request.dateTo);
                    return __assign(__assign({}, request), { date: "".concat(adjustedDateFrom.getTime(), ",").concat(adjustedDateTo.getTime()), dateFrom: undefined, dateTo: undefined });
                });
                return [2 /*return*/, { status: 200, data: finalRequests }];
            case 2:
                error_8 = _a.sent();
                console.error('Error in getVacationsByTeam service:', error_8);
                return [2 /*return*/, { status: 500, data: "Internal Server Error" }];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.getVacationsByTeam = getVacationsByTeam;
var getAllVacations = function (connection) { return __awaiter(void 0, void 0, void 0, function () {
    var requests, finalRequests, error_9;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, requestRepository.findAllRequests(connection)];
            case 1:
                requests = _a.sent();
                if (requests.length === 0) {
                    return [2 /*return*/, { status: 404, data: "No vacation requests found" }];
                }
                finalRequests = requests.map(function (request) {
                    var adjustedDateFrom = new Date(request.dateFrom);
                    var adjustedDateTo = new Date(request.dateTo);
                    return __assign(__assign({}, request), { date: "".concat(adjustedDateFrom.getTime(), ",").concat(adjustedDateTo.getTime()), dateFrom: undefined, dateTo: undefined });
                });
                return [2 /*return*/, { status: 200, data: finalRequests }];
            case 2:
                error_9 = _a.sent();
                console.error('Error in getAllVacations service:', error_9);
                return [2 /*return*/, { status: 500, data: "Internal Server Error" }];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.getAllVacations = getAllVacations;
