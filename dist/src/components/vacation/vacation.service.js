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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllVacations = exports.getVacationsByTeam = exports.filterRequests = exports.updateRequests = exports.updateAdminRequestService = exports.deleteUserRequestService = exports.updateUserRequestService = exports.createRequestService = exports.fetchSingleRequest = exports.fetchUserRequestsService = exports.fetchUserRequestsServiceByPages = void 0;
const vacation_repository_1 = require("./vacation.repository");
const vacationStatus_1 = require("../../entities/vacationStatus");
const requestRepository = __importStar(require("./vacation.repository"));
const role_1 = require("../../entities/role");
const fetchUserRequestsServiceByPages = (employeeId, page, limit, column, order) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const employee = yield (0, vacation_repository_1.findEmployeeById)(employeeId);
        if (!employee) {
            return { status: 404, response: { message: "Employee not found" } };
        }
        const skip = (page - 1) * limit;
        const { status, response } = yield (0, vacation_repository_1.findRequestsByEmployeeIdWithSkip)(employeeId, skip, limit, column, order);
        if (status !== 200 || !Array.isArray(response)) {
            return { status, response };
        }
        const requests = response;
        const finalRequests = requests.map((request) => {
            const adjustedDateFrom = new Date(request.dateFrom);
            const adjustedDateTo = new Date(request.dateTo);
            adjustedDateFrom.setHours(adjustedDateFrom.getHours() + 3);
            adjustedDateTo.setHours(adjustedDateTo.getHours() + 3);
            return Object.assign(Object.assign({}, request), { date: `${adjustedDateFrom.getTime()},${adjustedDateTo.getTime()}`, dateFrom: undefined, dateTo: undefined });
        });
        const cleanedRequests = finalRequests.map((_a) => {
            var { dateFrom, dateTo } = _a, rest = __rest(_a, ["dateFrom", "dateTo"]);
            return rest;
        });
        return { status: 200, response: cleanedRequests };
    }
    catch (error) {
        return { status: 500, response: { message: "Error fetching requests", error: error.message } };
    }
});
exports.fetchUserRequestsServiceByPages = fetchUserRequestsServiceByPages;
const fetchUserRequestsService = (employeeId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const employee = yield (0, vacation_repository_1.findEmployeeById)(employeeId);
        if (!employee) {
            return { status: 404, response: { message: "Employee not found" } };
        }
        let requests = yield (0, vacation_repository_1.findRequestsByEmployeeId)(employeeId);
        requests = requests.map(request => {
            if (request.dateFrom) {
                request.dateFrom = new Date(request.dateFrom.getTime());
            }
            if (request.dateTo) {
                request.dateTo = new Date(request.dateTo.getTime());
            }
            return request;
        });
        return { status: 200, response: requests };
    }
    catch (error) {
        return { status: 500, response: { message: "Error fetching requests", error: error.message } };
    }
});
exports.fetchUserRequestsService = fetchUserRequestsService;
const fetchSingleRequest = (requestId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const request = yield requestRepository.findRequestById(requestId);
        if (!request) {
            return { status: 404, response: { message: "Request not found" } };
        }
        return { status: 200, response: { message: "Request fetched successfully", request } };
    }
    catch (error) {
        return { status: 500, response: { message: "Error fetching request", error: error.message } };
    }
});
exports.fetchSingleRequest = fetchSingleRequest;
const createRequestService = (employeeId, dateFrom, dateTo, reason) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const employee = yield (0, vacation_repository_1.findEmployeeById)(employeeId);
        if (!employee) {
            return { status: 404, response: { message: "Employee not found" } };
        }
        let status;
        if (employee.role.role === role_1.RoleTypes.SuperAdmin) {
            status = yield (0, vacation_repository_1.findVacationStatusByName)(vacationStatus_1.StatusTypes.Accepted);
        }
        else {
            status = yield (0, vacation_repository_1.findVacationStatusByName)(vacationStatus_1.StatusTypes.Pending);
        }
        if (!status) {
            return { status: 404, response: { message: "Status not found" } };
        }
        const reasonEntity = yield (0, vacation_repository_1.findReasonByName)(reason);
        if (!reasonEntity) {
            return { status: 404, response: { message: "Reason not found" } };
        }
        const request = (0, vacation_repository_1.createVacationRequest)(dateFrom, dateTo, reasonEntity, employee, status);
        yield (0, vacation_repository_1.saveVacationRequest)(request);
        return { status: 201, response: { message: "Inserted a Request successfully", request } };
    }
    catch (error) {
        return { status: 500, response: { message: "Internal Server Error", error: error.message } };
    }
});
exports.createRequestService = createRequestService;
const updateUserRequestService = (requestId, reviewerId, dateFrom, dateTo, reason, status) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const updateData = {};
        if (dateFrom || dateTo) {
            const dateFromParsed = dateFrom ? new Date(dateFrom) : undefined;
            const dateToParsed = dateTo ? new Date(dateTo) : undefined;
            if ((dateFrom && !(dateFromParsed instanceof Date && !isNaN(dateFromParsed.getTime()))) ||
                (dateTo && !(dateToParsed instanceof Date && !isNaN(dateToParsed.getTime())))) {
                return { status: 400, response: { message: "Invalid date format" } };
            }
            if (dateFromParsed)
                updateData.dateFrom = dateFromParsed;
            if (dateToParsed)
                updateData.dateTo = dateToParsed;
        }
        if (reason) {
            const reasonEntity = yield (0, vacation_repository_1.findReasonByName)(reason);
            if (!reasonEntity) {
                return { status: 404, response: { message: "Reason not found" } };
            }
            updateData.reason = reasonEntity;
        }
        if (status) {
            updateData.status = status;
        }
        if (reviewerId !== undefined) {
            updateData.reviewerId = reviewerId;
        }
        const request = yield (0, vacation_repository_1.findVacationById)(requestId);
        if (!request) {
            return { status: 404, response: { message: "Request not found" } };
        }
        yield (0, vacation_repository_1.updateVacationRequest)(request, updateData);
        return { status: 200, response: { message: "Request updated successfully" } };
    }
    catch (error) {
        return { status: 500, response: { message: "Internal Server Error", error: error.message } };
    }
});
exports.updateUserRequestService = updateUserRequestService;
const deleteUserRequestService = (requestId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const request = yield (0, vacation_repository_1.findVacationById)(requestId);
        if (!request) {
            return { status: 404, response: { message: "Request not found" } };
        }
        if (request.employee.role.role != role_1.RoleTypes.SuperAdmin && request.status.name != vacationStatus_1.StatusTypes.Pending) {
            return { status: 403, response: { message: "Cannot delete this request" } };
        }
        yield (0, vacation_repository_1.deleteVacationRequest)(request);
        return { status: 200, response: { message: "Request deleted successfully" } };
    }
    catch (error) {
        return { status: 500, response: { message: "Internal Server Error", error: error.message } };
    }
});
exports.deleteUserRequestService = deleteUserRequestService;
const updateAdminRequestService = (requestId, status) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const request = yield (0, vacation_repository_1.findVacationById)(requestId);
        if (!request) {
            return { status: 404, response: { message: "Request not found" } };
        }
        const vacationStatus = yield (0, vacation_repository_1.findVacationStatusByName)(status);
        if (!vacationStatus) {
            return { status: 404, response: { message: "Status not found" } };
        }
        request.status = vacationStatus;
        const updatedRequest = yield (0, vacation_repository_1.saveVacationRequest)(request);
        return { status: 200, response: updatedRequest };
    }
    catch (error) {
        return { status: 500, response: { message: "Internal Server Error", error: error.message } };
    }
});
exports.updateAdminRequestService = updateAdminRequestService;
const updateRequests = (requestId, reviewerId, dateFrom, dateTo, reason) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const request = yield requestRepository.findRequestById(requestId);
        if (!request) {
            return { status: 404, response: { message: "Request not found" } };
        }
        const dateFromParsed = new Date(dateFrom);
        const dateToParsed = new Date(dateTo);
        if (isNaN(dateFromParsed.getTime()) || isNaN(dateToParsed.getTime())) {
            return { status: 400, response: { message: "Invalid date format" } };
        }
        if (reviewerId !== undefined)
            request.reviewerId = reviewerId;
        if (dateFromParsed !== undefined)
            request.dateFrom = dateFromParsed;
        if (dateToParsed !== undefined)
            request.dateTo = dateToParsed;
        if (reason) {
            const reasonEntity = yield (0, vacation_repository_1.findReasonByName)(reason);
            if (!reasonEntity) {
                return { status: 404, response: { message: "Reason not found" } };
            }
            request.reason = reasonEntity;
        }
        yield request.save();
        return { status: 200, response: request };
    }
    catch (error) {
        return { status: 500, response: { message: "Internal Server Error", error: error.message } };
    }
});
exports.updateRequests = updateRequests;
const filterRequests = (key, value, connection) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const sql = `SELECT * FROM Vacation WHERE ${key} = ?`;
        const requests = (0, vacation_repository_1.filterRequestsBySQL)(sql, connection);
        return { status: 200, response: requests };
    }
    catch (error) {
        console.error('Error executing filterRequests:', error);
        return { status: 500, response: { message: "Internal Server Error", error: error.message } };
    }
});
exports.filterRequests = filterRequests;
const getVacationsByTeam = (teamId, connection) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const vacations = yield (0, vacation_repository_1.fetchVacationsByTeam)(teamId, connection);
        if (vacations.length === 0) {
            return { status: 404, data: "No vacation requests found for the specified team" };
        }
        return { status: 200, data: vacations };
    }
    catch (error) {
        console.error('Error in getVacationsByTeam service:', error);
        return { status: 500, data: "Internal Server Error" };
    }
});
exports.getVacationsByTeam = getVacationsByTeam;
const getAllVacations = (connection) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const vacations = yield requestRepository.findAllRequests(connection);
        if (vacations.length === 0) {
            return { status: 404, data: "No vacation requests found" };
        }
        return { status: 200, data: vacations };
    }
    catch (error) {
        console.error('Error in getAllVacations service:', error);
        return { status: 500, data: "Internal Server Error" };
    }
});
exports.getAllVacations = getAllVacations;
//# sourceMappingURL=vacation.service.js.map