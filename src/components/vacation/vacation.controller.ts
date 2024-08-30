import { Request, Response } from 'express';
import { fetchUserRequestsServiceByPages ,getVacationsByTeam, fetchUserRequestsService, filterRequests, fetchSingleRequest, createRequestService, updateUserRequestService, deleteUserRequestService, updateAdminRequestService, updateRequests } from './vacation.service';
import { StatusTypes } from '../../entities/vacationStatus';
import { connection } from '../../main';

export const filterVacationRequests = async (req: Request, res: Response) => {
    const { key, value } = req.body;
    if (!key || !value) {
        return res.status(400).json({ message: "Key and value are required" });
    }

    try {
        const result = await filterRequests(key, value, connection);
        return res.status(result.status).json(result.response);
    } catch (error) {
        return res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};

export const getVacationRequestById = async (req: Request, res: Response) => {
    const { requestId } = req.params;

    if (!requestId || isNaN(Number(requestId))) {
        return res.status(400).json({ message: "Valid Request ID is required" });
    }

    try {
        const result = await fetchSingleRequest(parseInt(requestId));
        return res.status(result.status).json(result.response);
    } catch (error) {
        return res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};

export const getUserVacationRequests = async (req: Request, res: Response) => {
    const { employeeId, page, limit, column, order} = req.body;

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
        const result = await fetchUserRequestsServiceByPages(parseInt(employeeId), parseInt(page), parseInt(limit), column, order);
        
        return res.status(result.status).json(result.response);
    } catch (error) {
        return res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};

export const createVacationRequest = async (req: Request, res: Response) => {
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

    const result = await createRequestService(employeeId, dateFromObj, dateToObj, reason);
    return res.status(result.status).json(result.response);
};

export const updateUserVacationRequest = async (req: Request, res: Response) => {
    const { reviewerId, dateFrom, dateTo, reason, status } = req.body;
    const { requestId } = req.params;

    if (!requestId) {
        return res.status(400).json({ message: "Request ID is required" });
    }

    try {
        const result = await updateUserRequestService(parseInt(requestId), reviewerId, dateFrom, dateTo, reason, status);
        return res.status(result.status).json(result.response);
    } catch (error) {
        return res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};

export const deleteVacationRequest = async (req: Request, res: Response) => {
    const { requestId } = req.body;

    if (!requestId || isNaN(Number(requestId))) {
        return res.status(400).json({ message: "Valid Request ID is required" });
    }

    try {
        const result = await deleteUserRequestService(parseInt(requestId, 10));
        return res.status(result.status).json(result.response);
    } catch (error) {
        return res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};

export const updateAdminVacationRequest = async (req: Request, res: Response) => {
    const { requestId, status } = req.params;

    if (!requestId || isNaN(Number(requestId))) {
        return res.status(400).json({ message: "Valid Request ID is required" });
    }
    if (!status) {
        return res.status(400).json({ message: "Status is required" });
    }

    try {
        const result = await updateAdminRequestService(parseInt(requestId, 10), status as StatusTypes);
        return res.status(result.status).json(result.response);
    } catch (error) {
        return res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};

export const updateAdminVacationRequestDetails = async (req: Request, res: Response) => {
    const { reviewerId, dateFrom, dateTo, reason } = req.body;
    const { requestId } = req.params;

    if (!requestId || isNaN(Number(requestId))) {
        return res.status(400).json({ message: "Valid Request ID is required" });
    }

    if (!reviewerId || !dateFrom || !dateTo || !reason) {
        return res.status(400).json({ message: "All fields are required" });
    }

    try {
        const result = await updateRequests(parseInt(requestId, 10), reviewerId, dateFrom, dateTo, reason);

        return res.status(result.status).json(result.response);
    } catch (error) {
        return res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};

export const getVacationRequestsByTeam = async (req: Request, res: Response) => {
    const { teamId } = req.params;

    if (!teamId) {
        return res.status(400).json({ message: "teamId is required" });
    }

    try {
        const result = await getVacationsByTeam(parseInt(teamId), connection);

        return res.status(result.status).json(result.data);
    } catch (error) {
        return res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};