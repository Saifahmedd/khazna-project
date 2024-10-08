import { findAllRequestsWithSkip,findRequestsByEmployeeIdWithSkip ,findEmployeeById, findVacationStatusByName, findRequestsByEmployeeId, createVacationRequest, findVacationById, saveVacationRequest, updateVacationRequest, deleteVacationRequest, fetchVacationsByTeam, findReasonByName, filterRequestsBySQL } from './vacation.repository';
import { StatusTypes } from '../../entities/vacationStatus';
import * as requestRepository from './vacation.repository';
import { RoleTypes } from '../../entities/role';
import { ReasonTypes } from '../../entities/reason';
import { Connection } from 'typeorm';
import { Vacation } from '../../entities/vacation';

export const fetchUserRequestsServiceByPages = async (employeeId: number,page: number,limit: number,column: string | null,order: 'ASC' | 'DESC' | null) => {
    try {
        const employee = await findEmployeeById(employeeId);

        if (!employee) {
            return { status: 404, response: { message: "Employee not found" } };
        }

        const skip = (page - 1) * limit;

        const { status, response } = await findRequestsByEmployeeIdWithSkip(employeeId, skip, limit, column, order);

        if (status !== 200 || !Array.isArray(response)) {
            return { status, response };
        }

        const requests: Vacation[] = response;

        const finalRequests = requests.map((request: Vacation) => {
            const adjustedDateFrom = new Date(request.dateFrom);
            const adjustedDateTo = new Date(request.dateTo);
        
            return {
                ...request,
                date: `${adjustedDateFrom.getTime()},${adjustedDateTo.getTime()}`,
                dateFrom: undefined,
                dateTo: undefined,
            };
        });        
        
        return { status: 200, response: {data: finalRequests, count: response.length} };
        
    } catch (error) {
        return { status: 500, response: { message: "Error fetching requests", error: (error as Error).message } };
    }
};

export const fetchAllVacationRequestsServiceByPages = async (
    page: number,
    limit: number,
    column: string | null,
    order: 'ASC' | 'DESC' | null
) => {
    try {
        const skip = (page - 1) * limit;

        const { status, response } = await findAllRequestsWithSkip(skip, limit, column, order);

        if (status !== 200 || !Array.isArray(response)) {
            return { status, response };
        }

        const finalRequests = response.map((request: Vacation) => {
            const adjustedDateFrom = new Date(request.dateFrom);
            const adjustedDateTo = new Date(request.dateTo);
        
            return {
                id: request.id,
                name: request.employee.name,
                team: request.employee.team.type,
                date: `${adjustedDateFrom.getTime()},${adjustedDateTo.getTime()}`,
                reason: request.reason.name,
                status: request.status.name
            };
        });

        return { status: 200, response: { data: finalRequests, count: response.length } };
    } catch (error) {
        return { status: 500, response: { message: "Error fetching requests", error: (error as Error).message } };
    }
};


export const fetchUserRequestsService = async (employeeId: number) => {
    try {
        const employee = await findEmployeeById(employeeId);

        if (!employee) {
            return { status: 404, response: { message: "Employee not found" } };
        }

        let requests = await findRequestsByEmployeeId(employeeId);

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
    } catch (error) {
        return { status: 500, response: { message: "Error fetching requests", error: (error as Error).message } };
    }
};

export const createRequestService = async (
    employeeId: number, 
    dateFrom: Date, 
    dateTo: Date, 
    reason: ReasonTypes
) => {
    try {
        const employee = await findEmployeeById(employeeId);

        if (!employee) {
            return { status: 404, response: { message: "Employee not found" } };
        }

        let status;
        if (employee.role && employee.role.role === RoleTypes.SuperAdmin) {
            status = await findVacationStatusByName(StatusTypes.Approved);
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

        // Create and save the request
        const request = createVacationRequest(dateFrom, dateTo, reasonEntity, employee, status);
        await saveVacationRequest(request);

        // Return a success response including all the details of the request
        return {
            status: 200,
            response: {
                message: "Inserted a Request successfully",
                request: {
                    id: request.id,
                    name: employee.name,
                    employee: {
                        id: employee.id,
                        role: employee.role.role
                    },
                    date: `${dateFrom.getTime()},${dateTo.getTime()}`,
                    reason: reasonEntity.name,
                    status: status.name,
                    team: employee.team.type
                }
            }
        };
    } catch (error) {
        return {
            status: 500,
            response: { message: "Internal Server Error", error: (error as Error).message }
        };
    }
};

export const updateUserRequestService = async (
    requestId: number,
    employeeId?: number,
    dateFrom?: string,
    dateTo?: string,
    reason?: ReasonTypes
) => {
    try {
        const updateData: Partial<Vacation> = {};

        // Validate and update dates
        if (dateFrom || dateTo) {
            const dateFromParsed = dateFrom ? new Date(dateFrom) : undefined;
            const dateToParsed = dateTo ? new Date(dateTo) : undefined;

            if (
                (dateFrom && !(dateFromParsed instanceof Date && !isNaN(dateFromParsed.getTime()))) ||
                (dateTo && !(dateToParsed instanceof Date && !isNaN(dateToParsed.getTime())))
            ) {
                return { status: 400, response: { message: "Invalid date format" } };
            }

            if (dateFromParsed) updateData.dateFrom = dateFromParsed;
            if (dateToParsed) updateData.dateTo = dateToParsed;
        }

        // Validate and update reason
        if (reason) {
            const reasonEntity = await findReasonByName(reason);
            if (!reasonEntity) {
                return { status: 404, response: { message: "Reason not found" } };
            }
            updateData.reason = reasonEntity;
        }

        // Fetch the vacation request
        const request = await findVacationById(requestId);

        if (!request) {
            return { status: 404, response: { message: "Request not found" } };
        }

        // Validate role and status
        if (request.vacation.employee.role.role === RoleTypes.SuperAdmin) {
            request.vacation.status.name = StatusTypes.Approved;
        } else {
            request.vacation.status.name = StatusTypes.Pending;
        }

        // Save the updated request
        await updateVacationRequest(request.vacation, updateData);

        // Return the updated request details
        return {
            status: 200,
            response: {
                message: "Request updated successfully",
                updatedRequest: {
                    requestId: request.vacation.id,
                    employeeId: request.vacation.employee.id,
                    employeeName: request.vacation.employee.name,
                    date: `${request.vacation.dateFrom.getTime()},${request.vacation.dateTo.getTime()}`,
                    reason: request.vacation.reason ? request.vacation.reason.name : null,
                    status: request.vacation.status.name,
                    teamName: request.vacation.employee.team ? request.vacation.employee.team.type : null
                }
            }
        };
    } catch (error) {
        return { status: 500, response: { message: "Internal Server Error", error: (error as Error).message } };
    }
};



export const deleteUserRequestService = async (requestId: number) => {
    try {
        const request = await findVacationById(requestId);

        if (!request) {
            return { status: 404, response: { message: "Request not found" } };
        }

        if(request.role.role != RoleTypes.SuperAdmin  && request.vacation.status.name != StatusTypes.Pending){
            return { status: 403, response: { message: "Cannot delete this request" } };
        }

        await deleteVacationRequest(request.vacation);

        return { status: 200, response: { message: "Request deleted successfully" } };
    } catch (error) {
        return { status: 500, response: { message: "Internal Server Error", error: (error as Error).message } };
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

        request.vacation.status = vacationStatus;
        await saveVacationRequest(request.vacation);
          
        return { status: 200, response: {message: "Request updated successfully"} };
    } catch (error) {
        return { status: 500, response: { message: "Internal Server Error", error: (error as Error).message } };
    }
};

export const filterRequests = async (filters: any, connection: Connection) => {
    try {
        let sql = `SELECT vacation.id, employee.name, vacation.dateFrom, vacation.dateTo, 
        reason.name as reasonName, vacation_status.name as statusName,
        team.type as teamType -- Retrieve team type
        FROM vacation 
        JOIN employee ON vacation.employeeId = employee.id 
        LEFT JOIN reason ON vacation.reasonId = reason.id 
        LEFT JOIN vacation_status ON vacation.statusId = vacation_status.id 
        LEFT JOIN team ON employee.teamId = team.id -- Join with team
        WHERE 1=1`;

        const filterValues: any[] = [];

        // Dynamically build the query by appending filters
        Object.keys(filters).forEach((key) => {
            if (filters[key] !== undefined) {
                if (key === 'employeeName') {
                    sql += ` AND employee.name LIKE ?`; // Filter by employee name
                    filterValues.push(`%${filters[key]}%`); // Wildcard search for partial matches
                } else if (key === 'reasonId') {
                    sql += ` AND vacation.reasonId = ?`; // Filter by reason
                    filterValues.push(filters[key]);
                } else if (key === 'teamType') {
                    sql += ` AND team.type = ?`; // Filter by team type
                    filterValues.push(filters[key]);
                } else {
                    sql += ` AND ${key} = ?`; // Add dynamic filtering for other keys
                    filterValues.push(filters[key]);
                }
            }
        });

        // Execute the SQL query with dynamic filters
        const requests = await filterRequestsBySQL(sql, filterValues, connection);

        // Map and format the results before returning
        const finalRequests = requests.map((request: any) => {
            const adjustedDateFrom = new Date(request.dateFrom);
            const adjustedDateTo = new Date(request.dateTo);
        
            return {
                id: request.id,
                name: request.name,
                date: `${adjustedDateFrom.getTime()}, ${adjustedDateTo.getTime()}`, // Duration in date format
                reason: request.reasonName,
                status: request.statusName,
                team: request.teamType // Include team type in the response
            };
        });
        

        return { status: 200, response: { data: finalRequests, count: requests.length } };
    } catch (error) {
        return { status: 500, response: { message: "Internal Server Error", error: (error as Error).message } };
    }
};

export const getVacationsByTeam = async (teamId: number, connection: Connection) => {
    try {
        const vacations = await fetchVacationsByTeam(teamId, connection);

        if (vacations.length === 0) {
            return { status: 404, data: "No vacation requests found for the specified team" };
        }

        const finalRequests = vacations.map((request: Vacation) => {
            const adjustedDateFrom = new Date(request.dateFrom);
            const adjustedDateTo = new Date(request.dateTo);
        
            return {
                ...request,
                date: `${adjustedDateFrom.getTime()},${adjustedDateTo.getTime()}`,
                dateFrom: undefined,
                dateTo: undefined,
            };
        });  

        return { status: 200, data: finalRequests };
    } catch (error) {
        return { status: 500, data: "Internal Server Error" };
    }
};