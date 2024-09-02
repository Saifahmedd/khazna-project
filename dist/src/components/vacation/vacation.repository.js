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
exports.findAllRequests = exports.fetchVacationsByTeam = exports.filterRequestsBySQL = exports.findEmployeeById = exports.deleteVacationRequest = exports.updateVacationRequest = exports.findVacationById = exports.saveVacationRequest = exports.findReasonByName = exports.createVacationRequest = exports.updateRequest = exports.findRequestById = exports.findRequestsByEmployeeIdWithSkip = exports.findRequestsByEmployeeId = exports.findVacationStatusByName = void 0;
const employee_1 = require("../../entities/employee");
const vacation_1 = require("../../entities/vacation");
const vacationStatus_1 = require("../../entities/vacationStatus");
const reason_1 = require("../../entities/reason");
const findVacationStatusByName = (name) => __awaiter(void 0, void 0, void 0, function* () {
    return yield vacationStatus_1.VacationStatus.findOneBy({ name });
});
exports.findVacationStatusByName = findVacationStatusByName;
const findRequestsByEmployeeId = (employeeId) => __awaiter(void 0, void 0, void 0, function* () {
    const requests = yield vacation_1.Vacation.find({
        where: { employee: { id: employeeId } },
        relations: ['employee', 'status', 'reason']
    });
    return requests;
});
exports.findRequestsByEmployeeId = findRequestsByEmployeeId;
const findRequestsByEmployeeIdWithSkip = (employeeId, skip, take, column, order) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const queryBuilder = (vacation_1.Vacation).createQueryBuilder('vacation')
            .where('vacation.employeeId = :employeeId', { employeeId })
            .leftJoinAndSelect('vacation.employee', 'employee')
            .leftJoinAndSelect('vacation.status', 'status')
            .leftJoinAndSelect('vacation.reason', 'reason');
        if (column && order) {
            queryBuilder.orderBy(`vacation.${column}`, order);
        }
        if (skip && take) {
            queryBuilder.skip(skip);
            queryBuilder.take(take);
        }
        const requests = yield queryBuilder.getMany();
        return { status: 200, response: requests };
    }
    catch (error) {
        return { status: 500, response: { message: "Error fetching requests", error: error.message } };
    }
});
exports.findRequestsByEmployeeIdWithSkip = findRequestsByEmployeeIdWithSkip;
const findRequestById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return yield vacation_1.Vacation.findOne({ where: { id } });
});
exports.findRequestById = findRequestById;
const updateRequest = (request, updateData) => __awaiter(void 0, void 0, void 0, function* () {
    Object.assign(request, updateData);
    return yield request.save();
});
exports.updateRequest = updateRequest;
const createVacationRequest = (dateFrom, dateTo, reason, employee, status) => {
    return vacation_1.Vacation.create({ dateFrom, dateTo, reason, employee, status });
};
exports.createVacationRequest = createVacationRequest;
const findReasonByName = (reasonName) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const reason = yield reason_1.Reason.findOne({ where: { name: reasonName } });
        return reason || null;
    }
    catch (error) {
        console.error("Error finding reason by name:", error);
        throw new Error("Could not find reason");
    }
});
exports.findReasonByName = findReasonByName;
const saveVacationRequest = (request) => __awaiter(void 0, void 0, void 0, function* () {
    return yield request.save();
});
exports.saveVacationRequest = saveVacationRequest;
const findVacationById = (requestId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield vacation_1.Vacation.findOne({ where: { id: requestId } });
});
exports.findVacationById = findVacationById;
const updateVacationRequest = (request, updateData) => __awaiter(void 0, void 0, void 0, function* () {
    Object.assign(request, updateData);
    return yield request.save();
});
exports.updateVacationRequest = updateVacationRequest;
const deleteVacationRequest = (request) => __awaiter(void 0, void 0, void 0, function* () {
    return yield request.remove();
});
exports.deleteVacationRequest = deleteVacationRequest;
const findEmployeeById = (employeeId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield employee_1.Employee.findOne({
        where: { id: employeeId },
        relations: ['role', 'team']
    });
});
exports.findEmployeeById = findEmployeeById;
const filterRequestsBySQL = (sql, connection) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield connection.query(sql);
        return result;
    }
    catch (err) {
        throw new Error(`Error executing query: ${err.message}`);
    }
});
exports.filterRequestsBySQL = filterRequestsBySQL;
const fetchVacationsByTeam = (teamId, connection) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const vacations = yield connection
            .getRepository(vacation_1.Vacation)
            .createQueryBuilder('vacation')
            .innerJoinAndSelect('vacation.employee', 'employee')
            .innerJoinAndSelect('employee.team', 'team')
            .where('team.id = :teamId', { teamId })
            .getMany();
        return vacations;
    }
    catch (error) {
        console.error('Error fetching vacations by team:', error);
        throw new Error('Failed to fetch vacations by team');
    }
});
exports.fetchVacationsByTeam = fetchVacationsByTeam;
const findAllRequests = (connection) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const requests = yield connection
            .getRepository(vacation_1.Vacation)
            .createQueryBuilder('vacation')
            .innerJoinAndSelect('vacation.employee', 'employee')
            .innerJoinAndSelect('vacation.status', 'status')
            .innerJoinAndSelect('vacation.reason', 'reason')
            .getMany();
        return requests;
    }
    catch (error) {
        throw new Error('Failed to fetch all requests');
    }
});
exports.findAllRequests = findAllRequests;
//# sourceMappingURL=vacation.repository.js.map