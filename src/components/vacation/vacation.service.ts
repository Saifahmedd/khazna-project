import { findEmployeeById, findVacationStatusByName, findRequestsByEmployeeId, createVacationRequest, findVacationById, saveVacationRequest, updateVacationRequest, deleteVacationRequest, findReasonByName } from './vacation.repository';
import { VacationStatus, StatusTypes } from '../../entities/vacationStatus';
import * as requestRepository from './vacation.repository';
import { RoleTypes } from '../../entities/role';
import { ReasonTypes } from '../../entities/reason';
import { Connection } from 'typeorm';
import { Vacation } from '../../entities/vacation';

export const fetchUserRequestsService = async (employeeId: number) => {
    try {
        const employee = await findEmployeeById(employeeId);

        if (!employee) {
            return { status: 404, response: { message: "Employee not found" } };
        }

        let requests = await findRequestsByEmployeeId(employeeId);
        requests = requests.map(request => {
            request.dateFrom = new Date(request.dateFrom.getTime() + 86400000);
            request.dateTo = new Date(request.dateTo.getTime() + 86400000);
            return request;
        });

        return { status: 200, response: requests };
    } catch (error) {
        return { status: 500, response: { message: "Error fetching requests", error: error.message } };
    }
};

export const fetchSingleRequest = async (requestId: number) => {
    try {
        const request = await requestRepository.findRequestById(requestId);
        if (!request) {
            return { status: 404, response: { message: "Request not found" } };
        }

        return { status: 200, response: { message: "Request fetched successfully", request } };
    } catch (error) {
        return { status: 500, response: { message: "Error fetching request", error: error.message } };
    }
};

export const createRequestService = async (employeeId: number, dateFrom: Date, dateTo: Date, reason: ReasonTypes) => {
    try {
        const employee = await findEmployeeById(employeeId);

        if (!employee) {
            return { status: 404, response: { message: "Employee not found" } };
        }

        let status;
        if (employee.role.role === RoleTypes.Admin) {
            status = await findVacationStatusByName(StatusTypes.Accepted);
        } else {
            status = await findVacationStatusByName(StatusTypes.Pending);
        }

        if (!status) {
            return { status: 404, response: { message: "Status not found" } };
        }

        const reasonEntity = await findReasonByName(reason);
        if (!reasonEntity) {
            return { status: 404, response: { message: "Reason not found" } };
        }
        const request = createVacationRequest(dateFrom, dateTo, reasonEntity, employee, status);
        await saveVacationRequest(request);

        return { status: 201, response: { message: "Inserted a Request successfully", request } };
    } catch (error) {
        return { status: 500, response: { message: "Internal Server Error", error: error.message } };
    }
};

export const updateUserRequestService = async (requestId: number, reviewerId: number, dateFrom: string, dateTo: string, reason: ReasonTypes, status: VacationStatus) => {
    try {
        const dateFromParsed = new Date(dateFrom);
        const dateToParsed = new Date(dateTo);

        if (isNaN(dateFromParsed.getTime()) || isNaN(dateToParsed.getTime())) {
            return { status: 400, response: { message: "Invalid date format" } };
        }

        const request = await findVacationById(requestId);

        if (!request) {
            return { status: 404, response: { message: "Request not found" } };
        }

        const reasonEntity = await findReasonByName(reason);
        if (!reasonEntity) {
            return { status: 404, response: { message: "Reason not found" } };
        }

        await updateVacationRequest(request, {
            reviewerId,
            dateFrom: dateFromParsed,
            dateTo: dateToParsed,
            reason: reasonEntity,
            status
        });

        return { status: 200, response: { message: "Request updated successfully" } };
    } catch (error) {
        return { status: 500, response: { message: "Internal Server Error", error: error.message } };
    }
};

export const deleteUserRequestService = async (requestId: number) => {
    try {
        const request = await findVacationById(requestId);

        if (!request) {
            return { status: 404, response: { message: "Request not found" } };
        }

        await deleteVacationRequest(request);

        return { status: 200, response: { message: "Request deleted successfully" } };
    } catch (error) {
        return { status: 500, response: { message: "Internal Server Error", error: error.message } };
    }
};

export const updateAdminRequestService = async (requestId: number, status: StatusTypes) => {
    try {
        const request = await findVacationById(requestId);
        if (!request) {
            return { status: 404, response: { message: "Request not found" } };
        }

        const vacationStatus = await findVacationStatusByName(status);
        if (!vacationStatus) {
            return { status: 404, response: { message: "Status not found" } };
        }

        request.status = vacationStatus;
        const updatedRequest = await saveVacationRequest(request);

        return { status: 200, response: updatedRequest };
    } catch (error) {
        return { status: 500, response: { message: "Internal Server Error", error: error.message } };
    }
};

export const updateRequests = async (requestId: number, reviewerId: number, dateFrom: string, dateTo: string, reason: ReasonTypes) => {
    try {
        const request = await requestRepository.findRequestById(requestId);

        if (!request) {
            return { status: 404, response: { message: "Request not found" } };
        }

        const dateFromParsed = new Date(dateFrom);
        const dateToParsed = new Date(dateTo);

        if (isNaN(dateFromParsed.getTime()) || isNaN(dateToParsed.getTime())) {
            return { status: 400, response: { message: "Invalid date format" } };
        }

        if (reviewerId !== undefined) request.reviewerId = reviewerId;
        if (dateFromParsed !== undefined) request.dateFrom = dateFromParsed;
        if (dateToParsed !== undefined) request.dateTo = dateToParsed;
        if (reason) {
            const reasonEntity = await findReasonByName(reason);
            if (!reasonEntity) {
                return { status: 404, response: { message: "Reason not found" } };
            }
            request.reason = reasonEntity;
        }
        await request.save();
        return { status: 200, response: request };
    } catch (error) {
        return { status: 500, response: { message: "Internal Server Error", error: error.message } };
    }
};


export const filterRequests = async (key: string, value: string, connection: Connection) => {
    try {
        
        const sql = `SELECT * FROM Vacation WHERE ${key} = ?`;
        const requests = await Vacation.query(sql, [value]);

        return { status: 200, response: requests };
    } catch (error) {
        console.error('Error executing filterRequests:', error);
        return { status: 500, response: { message: "Internal Server Error", error: error.message } };
    }
};