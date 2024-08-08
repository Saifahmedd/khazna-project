import express from 'express';
import { checkAdminRole } from "../../../middleware/checkAdminRole";
import * as vacationController from './vacation.controller';

const router = express.Router();

/**
 * @swagger
 * /vacation/filter:
 *   get:
 *     summary: Filter vacation requests by a specific field
 *     description: Filter vacation requests by specifying a field and value to match.
 *     parameters:
 *       - in: query
 *         name: key
 *         required: true
 *         schema:
 *           type: string
 *           description: The field name to filter by (e.g., reason, employeeId).
 *         example: reason
 *       - in: query
 *         name: value
 *         required: true
 *         schema:
 *           type: string
 *           description: The value to filter by (e.g., Tired, 1).
 *         example: Tired
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
 *         description: Invalid request parameters.
 *       500:
 *         description: Internal Server Error.
 */
router.get('/vacation/filter', vacationController.filterVacationRequests);

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
router.get('/vacation/:requestId', vacationController.getVacationRequestById);

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
router.get('/vacation', vacationController.getUserVacationRequests);

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
router.post('/vacation', vacationController.createVacationRequest);

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
router.put('/vacation/:requestId', vacationController.updateUserVacationRequest);

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
router.delete('/vacation', vacationController.deleteVacationRequest);

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
router.put('/vacation/admin/:requestId/:status', checkAdminRole, vacationController.updateAdminVacationRequest);

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
router.put('/vacation/admin/:requestId', checkAdminRole, vacationController.updateAdminVacationRequestDetails);

export { router as vacationRoutes };
