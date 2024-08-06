import express from 'express';
import { fetchUserRequestsService,filterRequests ,fetchSingleRequest ,createRequestService, updateUserRequestService, deleteUserRequestService, updateAdminRequestService, updateRequests } from './vacation.service';
import { checkAdminRole } from "../../../middleware/checkAdminRole";
import { StatusTypes, VacationStatus } from '../../entities/vacationStatus';
import {connection} from '../../main';

const router = express.Router();
/**
 * @swagger
 * /vacation/filter:
 *   get:
 *     summary: Filter vacation requests by SQL query
 *     description: Execute a raw SQL query to filter vacation requests.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               sql:
 *                 type: string
 *                 description: The SQL query to execute.
 *                 example: "SELECT * FROM Vacation"
 *     responses:
 *       200:
 *         description: A successful response with filtered vacation requests.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   employeeId:
 *                     type: integer
 *                   startDate:
 *                     type: string
 *                     format: date
 *                   endDate:
 *                     type: string
 *                     format: date
 *                   status:
 *                     type: string
 *       400:
 *         description: SQL statement is required.
 *       500:
 *         description: Internal Server Error.
 */
router.get('/vacation/filter', async (req, res) => {
    const { sql } = req.body;

    if (!sql) {
        return res.status(400).json({ message: "SQL statement is required" });
    }

    try {
        const result = await filterRequests(sql, connection);
        if (result.status === 404) {
            return res.status(404).json(result.response);
        }
        return res.status(result.status).json(result.response);
    } catch (error) {
        return res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
});

/**
 * @swagger
 * /vacation/:requestId:
 *   get:
 *     summary: Fetching a single request of an employee
 *     description: Fetching a single request of an employee
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               requestId:
 *                 type: number
 *                 example: 1
 *     responses:
 *       200:
 *         description: Fetched a single request successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Fetched a single request successfully
 *       404:
 *         description: Cannot Fetch the Request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Cannot Fetch the Request
 */
router.get('/vacation/:requestId', async (req, res) => {
    const { requestId } = req.params;

    if (!requestId) {
        return res.status(400).json({ message: "Request ID is required" });
    }

    const result = await fetchSingleRequest(parseInt(requestId));
    return res.status(result.status).json(result.response);
});

/**
 * @swagger
 * /vacation:
 *   get:
 *     summary: Fetching all Requests of an employee
 *     description: Fetching all Requests of an employee
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               employeeIdInput:
 *                 type: number
 *                 example: 1
 *     responses:
 *       200:
 *         description: Fetched all Requests successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Fetched all Requests successfully
 *       404:
 *         description: Cannot Fetch the Requests
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Cannot Fetch the Requests
 */
router.get('/vacation', async (req, res) => {
    const { employeeId } = req.body;

    if (!employeeId) {
        return res.status(400).json({ message: "Employee ID is required" });
    }

    const result = await fetchUserRequestsService(parseInt(employeeId));
    return res.status(result.status).json(result.response);
});

/**
 * @swagger
 * /vacation:
 *   post:
 *     summary: Inserting a new Request
 *     description: Inserting a new Request for a specific employee
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               employeeIdInput:
 *                 type: number
 *                 example: 1
 *               dateFromInput:
 *                 type: string
 *                 example: 5/2/2024
 *               dateToInput:
 *                 type: string
 *                 example: 23/7/2024
 *               reasonInput:
 *                 type: string
 *                 example: Travel
 *     responses:
 *       201:
 *         description: Inserted a Request successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Inserted a Request successfully
 *                 request:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: number
 *                     dateFrom:
 *                       type: string
 *                     dateTo:
 *                       type: string
 *                     reason:
 *                       type: string
 *                     employee:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: number
 *                         name:
 *                           type: string
 *                     status:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: number
 *                         name:
 *                           type: string
 *       404:
 *         description: Employee not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Employee not found
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Internal Server Error
 *                 error:
 *                   type: string
 */
router.post('/vacation', async (req, res) => {
    const { employeeId, dateFrom, dateTo, reason } = req.body;

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

    const result = await createRequestService(employeeId, dateFrom, dateTo, reason);
    return res.status(result.status).json(result.response);
});

/**
 * @swagger
 * /vacation/:requestId:
 *   put:
 *     summary: Update an existing Request
 *     description: Update the details of an existing vacation request by ID
 *     parameters:
 *       - in: path
 *         name: requestId
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the request to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               reviewerId:
 *                 type: number
 *                 example: 2
 *               dateFrom:
 *                 type: string
 *                 format: date
 *                 example: 2024-07-23
 *               dateTo:
 *                 type: string
 *                 format: date
 *                 example: 2024-07-30
 *               reason:
 *                 type: string
 *                 example: Family vacation
 *               status:
 *                 type: string
 *                 example: accepted
 *     responses:
 *       200:
 *         description: Request updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: number
 *                 dateFrom:
 *                   type: string
 *                 dateTo:
 *                   type: string
 *                 reason:
 *                   type: string
 *                 employee:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: number
 *                     name:
 *                       type: string
 *                 status:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: number
 *                     name:
 *                       type: string
 *       400:
 *         description: Bad Request - Request ID is required
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Request ID is required
 *       404:
 *         description: Request not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Request not found
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Internal Server Error
 *                 error:
 *                   type: string
 */
router.put('/vacation/:requestId', async (req, res) => {
    const { reviewerId, dateFrom, dateTo, reason, status } = req.body;
    const { requestId } = req.params;
    
    if (!requestId) {
        return res.status(400).json({ message: "Request ID is required" });
    }

    const result = await updateUserRequestService(parseInt(requestId), reviewerId, dateFrom, dateTo, reason, status);
    return res.status(result.status).json(result.response);
});


/**
 * @swagger
 * /vacation:
 *   delete:
 *     summary: Deleting a Request
 *     description: Deleting a Request for a specific employee
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               requestIdInput:
 *                 type: number
 *                 example: 1
 *     responses:
 *       201:
 *         description: Deleted a Request successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Deleted a Request successfully
 *       404:
 *         description: Employee not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Employee not found
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Internal Server Error
 *                 error:
 *                   type: string
 */
router.delete('/vacation', async (req, res) => {
    const { requestId } = req.body;

    if (!requestId) {
        return res.status(400).json({ message: "Request ID is required" });
    }

    const result = await deleteUserRequestService(requestId);
    return res.status(result.status).json(result.response);
});

/**
 * @swagger
 * /vacation/admin/:requestId/:status:
 *   put:
 *     summary: Updating an existing request of a user by an admin
 *     description: Updating an existing Request as Admin
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               requestId:
 *                 type: number
 *                 example: 1
 *               status:
 *                 type: string
 *                 example: accepted
 *     responses:
 *       200:
 *         description: Request updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: number
 *                 status:
 *                   type: string
 *                 updatedAt:
 *                   type: string
 *                   example: 2024-07-22
 *       400:
 *         description: Bad Request - Request ID or status is required
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Request ID or status is required
 *       404:
 *         description: Request not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Request not found
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Internal Server Error
 *                 error:
 *                   type: string
 */
router.put('/vacation/admin/:requestId/:status', checkAdminRole, async (req, res) => {
    const { requestId, status } = req.params;

    if (!requestId) {
        res.status(400).json({ message: "Request ID is required" });
    }
    if (!status) {
        res.status(400).json({ message: "Status is required" });
    }

    const result = await updateAdminRequestService(parseInt(requestId), status as StatusTypes);
    res.status(result.status).json(result.response);
});

/**
 * @swagger
 * /vacation/admin/:requestId:
 *   put:
 *     summary: Admin is updating his request
 *     description: Allows an Admin to update a Request's details
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               requestId:
 *                 type: number
 *                 example: 1
 *               reviewerId:
 *                 type: number
 *                 example: 2
 *               dateFrom:
 *                 type: string
 *                 example: 2024-07-22
 *               dateTo:
 *                 type: string
 *                 example: 2024-07-29
 *               reason:
 *                 type: string
 *                 example: Business Trip
 *     responses:
 *       200:
 *         description: Request updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Request updated successfully
 *       400:
 *         description: Bad Request - Request ID is required
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Request ID is required
 *       404:
 *         description: Request not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Request not found
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Internal Server Error
 *                 error:
 *                   type: string
 */
router.put('/vacation/admin/:requestId', checkAdminRole, async (req, res) => {
    const { reviewerId, dateFrom, dateTo, reason } = req.body;
    const { requestId } = req.params;

    if (!requestId) {
        return res.status(400).json({ message: "Request ID is required" });
    }

    try {
        const result = await updateRequests(parseInt(requestId), reviewerId, dateFrom, dateTo, reason);

        if (result.status === 404) {
            return res.status(404).json(result.response);
        }

        return res.status(result.status).json(result.response);
    } catch (error) {
        return res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
});


export { router as vacationController };
