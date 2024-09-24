import { Request, Response } from 'express';
import { fetchAllVacationRequestsServiceByPages, fetchUserRequestsServiceByPages ,getVacationsByTeam, filterRequests, createRequestService, updateUserRequestService, deleteUserRequestService, updateAdminRequestService } from './vacation.service';
import { StatusTypes, VacationStatus } from '../../entities/vacationStatus';
import { connection } from '../../main';

export const filterVacationRequests = async (req: Request, res: Response) => {
    const filters = req.query;

    if (!Object.keys(filters).length) {
        return res.status(400).json({ message: "At least one filter is required" });
    }

    try {
        // Handle the status filter
        if (filters.status) {
            const status = await VacationStatus.findOne({ where: { name: filters.status as StatusTypes } });
            if (!status) {
                return res.status(400).json({ message: "Invalid status" });
            }
            filters.statusId = status.id.toString();
            delete filters.status;
        }

        // Handle the date filter
        if (filters.date) {
            const [dateFrom, dateTo] = (filters.date as string).split(",").map(Number);

            if (dateFrom === undefined || dateTo === undefined) {
                return res.status(400).json({ message: "Both dateFrom and dateTo are required" });
            }

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

        const result = await filterRequests(filters, connection);
        return res.status(result.status).json(result.response);
    } catch (error) {
        const errorMessage = (error instanceof Error) ? error.message : "Unknown error";
        return res.status(500).json({ message: "Internal Server Error", error: errorMessage });
    }
};

function formatToLocalMySQL(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

export const getUserVacationRequests = async (req: Request, res: Response) => {
    const { employeeId, page, limit, column, order } = req.params;

    if (!employeeId) {
        return res.status(400).json({ message: "employeeId is required" });
    }
    if ((!(page==':page') && limit==':limit') || (page==':page' && !(limit==':limit'))) {
        return res.status(400).json({ message: "Both page and limit are required together" });
    }

    // Check if column or order is provided without the other
    if ((!(column==':column') && (order==':order')) || (column==':column' && !(order==':order'))) {
        return res.status(400).json({ message: "Both column and order are required together" });
    }

    try {
        const orderType = (order?.toUpperCase() === 'ASC' || order?.toUpperCase() === 'DESC') ? order.toUpperCase() as 'ASC' | 'DESC' : null;

        const result = await fetchUserRequestsServiceByPages(parseInt(employeeId), parseInt(page || '0'), parseInt(limit || '0'), column || '', orderType);
        
        return res.status(result.status).json(result.response);
    } catch (error) {
        const errorMessage = (error instanceof Error) ? error.message : "Unknown error";
        return res.status(500).json({ message: "Internal Server Error", error: errorMessage });
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
        const result = await updateUserRequestService(parseInt(requestId), reviewerId, formattedDateFrom, formattedDateTo, reason);
        return res.status(result.status).json(result.response);
    } catch (error) {
        const errorMessage = (error instanceof Error) ? error.message : "Unknown error";
        return res.status(500).json({ message: "Internal Server Error", error: errorMessage });
    }
};

export const deleteVacationRequest = async (req: Request, res: Response) => {
    const { requestId } = req.params;

    if (!requestId || isNaN(Number(requestId))) {
        return res.status(400).json({ message: "Valid Request ID is required" });
    }

    try {
        const result = await deleteUserRequestService(parseInt(requestId, 10));
        return res.status(result.status).json(result.response);
    } catch (error) {
        const errorMessage = (error instanceof Error) ? error.message : "Unknown error";
        return res.status(500).json({ message: "Internal Server Error", error: errorMessage });
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
        const errorMessage = (error instanceof Error) ? error.message : "Unknown error";
        return res.status(500).json({ message: "Internal Server Error", error: errorMessage });
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
        const errorMessage = (error instanceof Error) ? error.message : "Unknown error";
        return res.status(500).json({ message: "Internal Server Error", error: errorMessage });
    }
};

export const getAllVacationRequests = async (req: Request, res: Response) => {
    let { page, limit, column, order } = req.params;

    // Check if page or limit is provided without the other
    if ((!(page==':page') && limit==':limit') || (page==':page' && !(limit==':limit'))) {
        return res.status(400).json({ message: "Both page and limit are required together" });
    }

    // Check if column or order is provided without the other
    if ((!(column==':column') && (order==':order')) || (column==':column' && !(order==':order'))) {
        return res.status(400).json({ message: "Both column and order are required together" });
    }

    console.log("Column and order are: ", column, order);

    try {
        // If page or limit are null, set them to default values (e.g., page 1, limit 10)
        const currentPage = page ? parseInt(page) : 1;
        const currentLimit = limit ? parseInt(limit) : 10;

        // Check if order is valid (ASC or DESC)
        const orderType = (order?.toUpperCase() === 'ASC' || order?.toUpperCase() === 'DESC')
            ? order.toUpperCase() as 'ASC' | 'DESC'
            : null;

        // Fetch all vacation requests with pagination and sorting
        const result = await fetchAllVacationRequestsServiceByPages(currentPage, currentLimit, column || '', orderType);

        return res.status(result.status).json(result.response);
    } catch (error) {
        const errorMessage = (error instanceof Error) ? error.message : "Unknown error";
        return res.status(500).json({ message: "Internal Server Error", error: errorMessage });
    }
};

