import { findEmployeeById, findVacationStatusByName, findRequestsByEmployeeId, createVacationRequest, findVacationById, saveVacationRequest, updateVacationRequest, deleteVacationRequest } from './vacation.repository';
import { VacationStatus } from '../../entities/vacationStatus';
import * as requestRepository from './vacation.repository';
import { RoleTypes, StatusTypes } from '../../entities/constants';
import { response } from 'express';
import { Connection } from 'typeorm';

export const fetchUserRequestsService = async (employeeId: number) => {
    try {
        const employee = await findEmployeeById(employeeId);

        if (!employee) {
            return { status: 404, response: { message: "Employee not found" } };
        }

        let requests = await findRequestsByEmployeeId(employeeId);
        requests = requests.map(request => {
        // Increment by 1, 86400000 => 1 day bas in milliseconds
        request.dateFrom = new Date(request.dateFrom.getTime() + 86400000);
        request.dateTo = new Date(request.dateTo.getTime() + 86400000);

        return request;
        });

        return { status: 200, response: requests };
    } catch (error) {
        return { status: 500, response: { message: "Error fetching requests", error: error.message } };
    }
};

export const fetchSingleRequest = async (requestId: number)=>{
    try {
        const request = await requestRepository.findRequestById(requestId);
        if(!request){
            return { status: 404, response: { message: "Request is not found" } };
        }

        return { status: 200, response: {message: "Request is fetched successfully", request}};
    } catch(error){
        return { status: 500, response: { message: "Error fetching requests", error: error.message } };
    }
};

export const createRequestService = async (employeeId: number, dateFrom: string, dateTo: string, reason: string) => {
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

        const request = createVacationRequest(dateFrom, dateTo, reason, employee, status);
        await saveVacationRequest(request);

        return { status: 201, response: { message: "Inserted a Request successfully", request } };
    } catch (error) {
        return { status: 500, response: { message: "Internal Server Error", error: error.message } };
    }
};

export const updateUserRequestService = async (requestId: number, reviewerId: number, dateFrom: Date, dateTo: Date, reason: string, status: VacationStatus) => {
    try {
        const request = await findVacationById(requestId);

        if (!request) {
            return { status: 404, response: { message: "Request not found" } };
        }

        await updateVacationRequest(request, { reviewerId, dateFrom, dateTo, reason, status });

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
        return { status: 500, response: { message: "Internal Server Error dddd", error: error.message } };
    }
};

export const updateRequests = async ( requestId: number, reviewerId: number, dateFrom: Date, dateTo: Date, reason: string) => {
    try {
        const request = await requestRepository.findRequestById(requestId);

        if (!request) {
            return { status: 404, response: { message: "Request not found" } }}

        if (reviewerId !== undefined) request.reviewerId = reviewerId;
        if (dateFrom !== undefined) request.dateFrom = dateFrom;
        if (dateTo !== undefined) request.dateTo = dateTo;
        if (reason !== undefined) request.reason = reason;
        request.save();
        return { status: 200, response: request };
    } catch (error) {
        return { status: 500, response: { message: "Internal Server Error", error: error.message } };
    }
};

// export const filterRequests = async (key: string, value: string, connection: Connection) => {
//     try {
//         const sql = `SELECT * FROM Vacation WHERE ${key} = '${value}'`;
//         const requests = await requestRepository.filterRequestsBySQL(sql, connection);
//         return { status: 200, response: requests };
//     } catch (error) {
//         return { status: 500, response: { message: "Internal Server Error", error: error.message } };
//     }
// };