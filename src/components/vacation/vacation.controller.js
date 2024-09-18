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
exports.getAllVacationRequests = exports.getVacationRequestsByTeam = exports.updateAdminVacationRequest = exports.deleteVacationRequest = exports.updateUserVacationRequest = exports.createVacationRequest = exports.getUserVacationRequests = exports.filterVacationRequests = void 0;
const vacation_service_1 = require("./vacation.service");
const vacationStatus_1 = require("../../entities/vacationStatus");
const main_1 = require("../../main");
const filterVacationRequests = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const filters = req.query;
    if (!Object.keys(filters).length) {
        return res.status(400).json({ message: "At least one filter is required" });
    }
    try {
        // Handle the status filter
        if (filters.status) {
            const status = yield vacationStatus_1.VacationStatus.findOne({ where: { name: filters.status } });
            if (!status) {
                return res.status(400).json({ message: "Invalid status" });
            }
            filters.statusId = status.id.toString();
            delete filters.status;
        }
        // Handle the date filter
        if (filters.date) {
            const [dateFrom, dateTo] = filters.date.split(",").map(Number);
            const dateFromObj = new Date(dateFrom);
            const dateToObj = new Date(dateTo);
            if (isNaN(dateFromObj.getTime()) || isNaN(dateToObj.getTime())) {
                return res.status(400).json({ message: "Invalid date format" });
            }
            const formattedDateFrom = formatToLocalMySQL(dateFromObj);
            const formattedDateTo = formatToLocalMySQL(dateToObj);
            filters.dateFrom = formattedDateFrom;
            filters.dateTo = formattedDateTo;
            delete filters.date;
        }
        const result = yield (0, vacation_service_1.filterRequests)(filters, main_1.connection);
        return res.status(result.status).json(result.response);
    }
    catch (error) {
        return res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
});
exports.filterVacationRequests = filterVacationRequests;
function formatToLocalMySQL(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}
const getUserVacationRequests = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { employeeId, page, limit, column, order } = req.params;
    if (!employeeId) {
        return res.status(400).json({ message: "employeeId is required" });
    }
    if ((!page && limit) || (page && !limit)) {
        return res.status(400).json({ message: "page, limit are required" });
    }
    if ((!column && order) || (column && !order)) {
        return res.status(400).json({ message: "column, order are required" });
    }
    try {
        const orderType = ((order === null || order === void 0 ? void 0 : order.toUpperCase()) === 'ASC' || (order === null || order === void 0 ? void 0 : order.toUpperCase()) === 'DESC') ? order.toUpperCase() : null;
        const result = yield (0, vacation_service_1.fetchUserRequestsServiceByPages)(parseInt(employeeId), parseInt(page), parseInt(limit), column, orderType);
        return res.status(result.status).json(result.response);
    }
    catch (error) {
        return res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
});
exports.getUserVacationRequests = getUserVacationRequests;
const createVacationRequest = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { employeeId, date, reason } = req.body;
    const [dateFrom, dateTo] = date.split(",").map(Number);
    if (!employeeId) {
        return res.status(400).json({ message: "Employee ID is required" });
    }
    if (!dateFrom) {
        return res.status(400).json({ message: "dateFrom is required" });
    }
    if (!dateTo) {
        return res.status(400).json({ message: "dateTo is required" });
    }
    if (!reason) {
        return res.status(400).json({ message: "Reason is required" });
    }
    const dateFromObj = new Date(dateFrom);
    const dateToObj = new Date(dateTo);
    const result = yield (0, vacation_service_1.createRequestService)(employeeId, dateFromObj, dateToObj, reason);
    return res.status(result.status).json(result.response);
});
exports.createVacationRequest = createVacationRequest;
const updateUserVacationRequest = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { reviewerId, date, reason } = req.body;
    const { requestId } = req.params;
    const [dateFrom, dateTo] = date.split(",").map(Number);
    const dateFromObj = new Date(dateFrom);
    const dateToObj = new Date(dateTo);
    if (isNaN(dateFromObj.getTime()) || isNaN(dateToObj.getTime())) {
        return res.status(400).json({ message: "Invalid date format" });
    }
    const formattedDateFrom = formatToLocalMySQL(dateFromObj);
    const formattedDateTo = formatToLocalMySQL(dateToObj);
    if (!requestId) {
        return res.status(400).json({ message: "Request ID is required" });
    }
    try {
        const result = yield (0, vacation_service_1.updateUserRequestService)(parseInt(requestId), reviewerId, formattedDateFrom, formattedDateTo, reason);
        return res.status(result.status).json(result.response);
    }
    catch (error) {
        return res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
});
exports.updateUserVacationRequest = updateUserVacationRequest;
const deleteVacationRequest = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { requestId } = req.params;
    if (!requestId || isNaN(Number(requestId))) {
        return res.status(400).json({ message: "Valid Request ID is required" });
    }
    try {
        const result = yield (0, vacation_service_1.deleteUserRequestService)(parseInt(requestId, 10));
        return res.status(result.status).json(result.response);
    }
    catch (error) {
        return res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
});
exports.deleteVacationRequest = deleteVacationRequest;
const updateAdminVacationRequest = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { requestId, status } = req.params;
    if (!requestId || isNaN(Number(requestId))) {
        return res.status(400).json({ message: "Valid Request ID is required" });
    }
    if (!status) {
        return res.status(400).json({ message: "Status is required" });
    }
    try {
        const result = yield (0, vacation_service_1.updateAdminRequestService)(parseInt(requestId, 10), status);
        return res.status(result.status).json(result.response);
    }
    catch (error) {
        return res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
});
exports.updateAdminVacationRequest = updateAdminVacationRequest;
const getVacationRequestsByTeam = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { teamId } = req.params;
    if (!teamId) {
        return res.status(400).json({ message: "teamId is required" });
    }
    try {
        const result = yield (0, vacation_service_1.getVacationsByTeam)(parseInt(teamId), main_1.connection);
        return res.status(result.status).json(result.data);
    }
    catch (error) {
        return res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
});
exports.getVacationRequestsByTeam = getVacationRequestsByTeam;
const getAllVacationRequests = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield (0, vacation_service_1.getAllVacations)(main_1.connection);
        return res.status(result.status).json(result.data);
    }
    catch (error) {
        return res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
});
exports.getAllVacationRequests = getAllVacationRequests;
