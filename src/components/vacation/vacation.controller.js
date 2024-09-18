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
exports.getAllVacationRequests = exports.getVacationRequestsByTeam = exports.updateAdminVacationRequest = exports.deleteVacationRequest = exports.updateUserVacationRequest = exports.createVacationRequest = exports.getUserVacationRequests = exports.filterVacationRequests = void 0;
var vacation_service_1 = require("./vacation.service");
var vacationStatus_1 = require("../../entities/vacationStatus");
var main_1 = require("../../main");
var filterVacationRequests = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var filters, status_1, _a, dateFrom, dateTo, dateFromObj, dateToObj, formattedDateFrom, formattedDateTo, result, error_1;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                filters = req.query;
                if (!Object.keys(filters).length) {
                    return [2 /*return*/, res.status(400).json({ message: "At least one filter is required" })];
                }
                _b.label = 1;
            case 1:
                _b.trys.push([1, 5, , 6]);
                if (!filters.status) return [3 /*break*/, 3];
                return [4 /*yield*/, vacationStatus_1.VacationStatus.findOne({ where: { name: filters.status } })];
            case 2:
                status_1 = _b.sent();
                if (!status_1) {
                    return [2 /*return*/, res.status(400).json({ message: "Invalid status" })];
                }
                filters.statusId = status_1.id.toString();
                delete filters.status;
                _b.label = 3;
            case 3:
                // Handle the date filter
                if (filters.date) {
                    _a = filters.date.split(",").map(Number), dateFrom = _a[0], dateTo = _a[1];
                    dateFromObj = new Date(dateFrom);
                    dateToObj = new Date(dateTo);
                    if (isNaN(dateFromObj.getTime()) || isNaN(dateToObj.getTime())) {
                        return [2 /*return*/, res.status(400).json({ message: "Invalid date format" })];
                    }
                    formattedDateFrom = formatToLocalMySQL(dateFromObj);
                    formattedDateTo = formatToLocalMySQL(dateToObj);
                    filters.dateFrom = formattedDateFrom;
                    filters.dateTo = formattedDateTo;
                    delete filters.date;
                }
                return [4 /*yield*/, (0, vacation_service_1.filterRequests)(filters, main_1.connection)];
            case 4:
                result = _b.sent();
                return [2 /*return*/, res.status(result.status).json(result.response)];
            case 5:
                error_1 = _b.sent();
                return [2 /*return*/, res.status(500).json({ message: "Internal Server Error", error: error_1.message })];
            case 6: return [2 /*return*/];
        }
    });
}); };
exports.filterVacationRequests = filterVacationRequests;
function formatToLocalMySQL(date) {
    var year = date.getFullYear();
    var month = String(date.getMonth() + 1).padStart(2, '0');
    var day = String(date.getDate()).padStart(2, '0');
    var hours = String(date.getHours()).padStart(2, '0');
    var minutes = String(date.getMinutes()).padStart(2, '0');
    var seconds = String(date.getSeconds()).padStart(2, '0');
    return "".concat(year, "-").concat(month, "-").concat(day, " ").concat(hours, ":").concat(minutes, ":").concat(seconds);
}
var getUserVacationRequests = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, employeeId, page, limit, column, order, orderType, result, error_2;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = req.params, employeeId = _a.employeeId, page = _a.page, limit = _a.limit, column = _a.column, order = _a.order;
                if (!employeeId) {
                    return [2 /*return*/, res.status(400).json({ message: "employeeId is required" })];
                }
                if ((!page && limit) || (page && !limit)) {
                    return [2 /*return*/, res.status(400).json({ message: "page, limit are required" })];
                }
                if ((!column && order) || (column && !order)) {
                    return [2 /*return*/, res.status(400).json({ message: "column, order are required" })];
                }
                _b.label = 1;
            case 1:
                _b.trys.push([1, 3, , 4]);
                orderType = ((order === null || order === void 0 ? void 0 : order.toUpperCase()) === 'ASC' || (order === null || order === void 0 ? void 0 : order.toUpperCase()) === 'DESC') ? order.toUpperCase() : null;
                return [4 /*yield*/, (0, vacation_service_1.fetchUserRequestsServiceByPages)(parseInt(employeeId), parseInt(page), parseInt(limit), column, orderType)];
            case 2:
                result = _b.sent();
                return [2 /*return*/, res.status(result.status).json(result.response)];
            case 3:
                error_2 = _b.sent();
                return [2 /*return*/, res.status(500).json({ message: "Internal Server Error", error: error_2.message })];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.getUserVacationRequests = getUserVacationRequests;
var createVacationRequest = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, employeeId, date, reason, _b, dateFrom, dateTo, dateFromObj, dateToObj, result;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _a = req.body, employeeId = _a.employeeId, date = _a.date, reason = _a.reason;
                _b = date.split(",").map(Number), dateFrom = _b[0], dateTo = _b[1];
                if (!employeeId) {
                    return [2 /*return*/, res.status(400).json({ message: "Employee ID is required" })];
                }
                if (!dateFrom) {
                    return [2 /*return*/, res.status(400).json({ message: "dateFrom is required" })];
                }
                if (!dateTo) {
                    return [2 /*return*/, res.status(400).json({ message: "dateTo is required" })];
                }
                if (!reason) {
                    return [2 /*return*/, res.status(400).json({ message: "Reason is required" })];
                }
                dateFromObj = new Date(dateFrom);
                dateToObj = new Date(dateTo);
                return [4 /*yield*/, (0, vacation_service_1.createRequestService)(employeeId, dateFromObj, dateToObj, reason)];
            case 1:
                result = _c.sent();
                return [2 /*return*/, res.status(result.status).json(result.response)];
        }
    });
}); };
exports.createVacationRequest = createVacationRequest;
var updateUserVacationRequest = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, reviewerId, date, reason, requestId, _b, dateFrom, dateTo, dateFromObj, dateToObj, formattedDateFrom, formattedDateTo, result, error_3;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _a = req.body, reviewerId = _a.reviewerId, date = _a.date, reason = _a.reason;
                requestId = req.params.requestId;
                _b = date.split(",").map(Number), dateFrom = _b[0], dateTo = _b[1];
                dateFromObj = new Date(dateFrom);
                dateToObj = new Date(dateTo);
                if (isNaN(dateFromObj.getTime()) || isNaN(dateToObj.getTime())) {
                    return [2 /*return*/, res.status(400).json({ message: "Invalid date format" })];
                }
                formattedDateFrom = formatToLocalMySQL(dateFromObj);
                formattedDateTo = formatToLocalMySQL(dateToObj);
                if (!requestId) {
                    return [2 /*return*/, res.status(400).json({ message: "Request ID is required" })];
                }
                _c.label = 1;
            case 1:
                _c.trys.push([1, 3, , 4]);
                return [4 /*yield*/, (0, vacation_service_1.updateUserRequestService)(parseInt(requestId), reviewerId, formattedDateFrom, formattedDateTo, reason)];
            case 2:
                result = _c.sent();
                return [2 /*return*/, res.status(result.status).json(result.response)];
            case 3:
                error_3 = _c.sent();
                return [2 /*return*/, res.status(500).json({ message: "Internal Server Error", error: error_3.message })];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.updateUserVacationRequest = updateUserVacationRequest;
var deleteVacationRequest = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var requestId, result, error_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                requestId = req.params.requestId;
                if (!requestId || isNaN(Number(requestId))) {
                    return [2 /*return*/, res.status(400).json({ message: "Valid Request ID is required" })];
                }
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, (0, vacation_service_1.deleteUserRequestService)(parseInt(requestId, 10))];
            case 2:
                result = _a.sent();
                return [2 /*return*/, res.status(result.status).json(result.response)];
            case 3:
                error_4 = _a.sent();
                return [2 /*return*/, res.status(500).json({ message: "Internal Server Error", error: error_4.message })];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.deleteVacationRequest = deleteVacationRequest;
var updateAdminVacationRequest = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, requestId, status, result, error_5;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = req.params, requestId = _a.requestId, status = _a.status;
                if (!requestId || isNaN(Number(requestId))) {
                    return [2 /*return*/, res.status(400).json({ message: "Valid Request ID is required" })];
                }
                if (!status) {
                    return [2 /*return*/, res.status(400).json({ message: "Status is required" })];
                }
                _b.label = 1;
            case 1:
                _b.trys.push([1, 3, , 4]);
                return [4 /*yield*/, (0, vacation_service_1.updateAdminRequestService)(parseInt(requestId, 10), status)];
            case 2:
                result = _b.sent();
                return [2 /*return*/, res.status(result.status).json(result.response)];
            case 3:
                error_5 = _b.sent();
                return [2 /*return*/, res.status(500).json({ message: "Internal Server Error", error: error_5.message })];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.updateAdminVacationRequest = updateAdminVacationRequest;
var getVacationRequestsByTeam = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var teamId, result, error_6;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                teamId = req.params.teamId;
                if (!teamId) {
                    return [2 /*return*/, res.status(400).json({ message: "teamId is required" })];
                }
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, (0, vacation_service_1.getVacationsByTeam)(parseInt(teamId), main_1.connection)];
            case 2:
                result = _a.sent();
                return [2 /*return*/, res.status(result.status).json(result.data)];
            case 3:
                error_6 = _a.sent();
                return [2 /*return*/, res.status(500).json({ message: "Internal Server Error", error: error_6.message })];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.getVacationRequestsByTeam = getVacationRequestsByTeam;
var getAllVacationRequests = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var result, error_7;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, (0, vacation_service_1.getAllVacations)(main_1.connection)];
            case 1:
                result = _a.sent();
                return [2 /*return*/, res.status(result.status).json(result.data)];
            case 2:
                error_7 = _a.sent();
                return [2 /*return*/, res.status(500).json({ message: "Internal Server Error", error: error_7.message })];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.getAllVacationRequests = getAllVacationRequests;
