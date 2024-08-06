import express from 'express';
import * as employeeService from './user.service';
import * as vacationService from '../vacation/vacation.service';
import { Vacation } from '../../entities/vacation';
import { RoleTypes } from '../../entities/role';

const router = express.Router();

/**
 * @swagger
 *  /register:
 *    post:
 *      summary: Register a new employee
 *      description: This API registers a new employee and associates them with a role.
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                name:
 *                  type: string
 *                  example: Saif Ahmed
 *                password:
 *                  type: string
 *                  example: saifPassword
 *                role:
 *                  type: string
 *                  example: admin
 *                phonenumber:
 *                  type: string
 *                  example: 01023255440
 *                email:
 *                  type: string
 *                  example: saifahmedsalah11@gmail.com
 *      responses:
 *        200:
 *          description: Registration is made successfully
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  message:
 *                    type: string
 *                    example: Registration is made successfully
 *                  accessToken:
 *                    type: string
 *                    example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *        400:
 *          description: Bad request
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  message:
 *                    type: string
 *                    example: Username already exists or invalid input
 *        401:
 *          description: Invalid input
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  message:
 *                    type: string
 *                    example: Invalid input
 *        500:
 *          description: Internal server error
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  message:
 *                    type: string
 *                    example: Internal server error
 */
router.post('/register', async (req, res) => {
    const { name, password, role, phonenumber, email } = req.body;
    if (!name || !password || !role || !phonenumber || !email) {
        res.status(401).json({message: "Invalid input"});
    }
    try {
        const result = await employeeService.registerEmployee(name, password, role, phonenumber, email);
        res.status(200).json(result);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

/**
 * @swagger
 * /login:
 *  post:
 *    summary: Login as an employee
 *    description: This API is used to login
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              email:
 *                type: string
 *                example: saifahmedsalah11@gmail.com
 *              password:
 *                type: string
 *                example: saifPassword
 *    responses:
 *      200:
 *        description: Logged In successfully
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                message:
 *                  type: string
 *                  example: Logged in successfully
 *                accessToken:
 *                  type: string
 *                  example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *      401:
 *        description: Invalid inputs
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                message:
 *                  type: string
 *                  example: Invalid inputs
 *      404:
 *        description: Incorrect password or cannot find this username
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                message:
 *                  type: string
 *                  example: Incorrect password
 */
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    if(!email || !password){
        res.status(401).json({message: "Invalid inputs"});
        return;
    }
    try {
        const loginResult = await employeeService.loginEmployee(email, password);
        if (loginResult && loginResult.employee) {
            const employeeId = loginResult.employee.id;
            const role = loginResult.employee.role.role;

            const vacationResult = await vacationService.fetchUserRequestsService(employeeId);

            if (vacationResult.status === 200 && Array.isArray(vacationResult.response)) {
                const requests: Vacation[] = vacationResult.response;
                const differencesInDays: number[] = requests.map(request => {
                    const dayFrom = request.dateFrom.getDate();
                    const monthFrom = request.dateFrom.getMonth() + 1;
                    const dayTo = request.dateTo.getDate();
                    const monthTo = request.dateTo.getMonth() + 1;
                    return getDaysDifference(dayFrom, monthFrom, dayTo, monthTo);
                });

                const daysTaken = differencesInDays.reduce((total, days) => total + days, 0);
                const totalDays = role === RoleTypes.Admin ? 20 : 10;
                const daysLeft = totalDays - daysTaken;

                res.status(200).json({
                    message: "Logged in successfully",
                    daysLeft: daysLeft
                });
            } else {
                res.status(500).json({ message: "Unexpected response format or status" });
            }
        } else {
            res.status(404).json({ message: "Incorrect password or cannot find this username" });
        }
    } catch (error) {
        res.status(500).json({ message: "Error logging in" });
    }
});

const calculateDayOfYear = (day: number, month: number): number => {
    const daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

    let dayOfYear = day;
    for (let i = 0; i < month - 1; i++) {
        dayOfYear += daysInMonth[i];
    }
    return dayOfYear;
};

const getDaysDifference = (dayFrom: number, monthFrom: number, dayTo: number, monthTo: number): number => {
    const dayOfYearFrom = calculateDayOfYear(dayFrom, monthFrom);
    const dayOfYearTo = calculateDayOfYear(dayTo, monthTo);

    return dayOfYearTo - dayOfYearFrom;
};

/**
 * @swagger
 * /userInfo:
 *   get:
 *     summary: Retrieve the number of vacation days left for a user.
 *     description: Fetches vacation requests for a specific employee and calculates the remaining vacation days based on the role.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               employeeId:
 *                 type: number
 *                 description: The ID of the employee whose vacation requests are being retrieved.
 *               role:
 *                 type: string
 *                 description: The role of the employee to determine the total number of vacation days available.
 *                 enum: [Admin, User]
 *     responses:
 *       '200':
 *         description: Successfully retrieved the number of vacation days left.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 daysLeft:
 *                   type: integer
 *                   example: 10
 *       '401':
 *         description: Invalid input, employee ID is required.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Invalid input
 *       '500':
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Error fetching user requests
 */
router.get('/userInfo', async (req, res) => {
    const { employeeId, role } = req.body;
    if (!employeeId) {
        res.status(401).json({ message: "Invalid input" });
        return;
    }
    try {
        const result = await vacationService.fetchUserRequestsService(parseInt(employeeId));

        if (result.status === 200 && Array.isArray(result.response)) {
            const requests: Vacation[] = result.response;
            const differencesInDays: number[] = [];

            requests.forEach(request => {
                const dayFrom = request.dateFrom.getDate();
                const monthFrom = request.dateFrom.getMonth() + 1;

                const dayTo = request.dateTo.getDate();
                const monthTo = request.dateTo.getMonth() + 1;

                const differenceInDays = getDaysDifference(dayFrom, monthFrom, dayTo, monthTo);
                differencesInDays.push(differenceInDays);
            });

            let totaldays = 0;
            let daysTaken = 0;

            for (let i = 0; i < differencesInDays.length; i++) {
                daysTaken = daysTaken + differencesInDays[i];
            }

            if (role === 'Admin') {
                totaldays = 20;
            } else {
                totaldays = 10;
            }

            let daysLeft = totaldays - daysTaken;

            res.status(200).json({ daysLeft: daysLeft });
        } else {
            console.error("Unexpected response format or status:", result);
            res.status(500).json({ message: "Unexpected response format or status" });
        }
    } catch (error) {
        console.error("Error fetching user requests:", error.message);
        res.status(500).json({ message: "Error fetching user requests" });
    }
});


export { router as userController };
