import express from 'express';
import * as userController from './user.controller';

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
router.post('/register', userController.registerEmployee);

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
router.post('/login', userController.loginEmployee);

/**
 * @swagger
 * /userInfo:
 *   post:
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
 *                 avatar:
 *                   type: string
 *                   description: The avatar ID of the employee.
 *                 name:
 *                   type: string
 *                   description: The name of the employee.
 *                 team:
 *                   type: string
 *                   description: The team the employee is part of.
 *                 daysLeft:
 *                   type: integer
 *                   description: The number of vacation days left for the employee.
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
 *       '404':
 *         description: Employee not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Cannot find the employee
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
router.get('/userInfo', userController.getUserInfo);

/**
 * @swagger
 * /user/avatarId:
 *   put:
 *     summary: Update an employee's avatar
 *     description: This endpoint allows an employee to add or update their avatar by providing their employee ID and the avatar ID.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               employeeId:
 *                 type: number
 *                 description: The ID of the employee.
 *                 example: 1
 *               avatarId:
 *                 type: number
 *                 description: The ID of the avatar.
 *                 example: 101
 *     responses:
 *       '200':
 *         description: Avatar updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Avatar updated successfully
 *                 employee:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: number
 *                       example: 1
 *                     name:
 *                       type: string
 *                       example: John Doe
 *                     avatarId:
 *                       type: number
 *                       example: 101
 *       '401':
 *         description: Invalid input, employee ID and avatar ID are required.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Invalid input
 *       '404':
 *         description: Employee not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Cannot find the employee
 *       '500':
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Internal server error
 */
router.put('/user/avatarId', userController.updateAvatar);

export { router as userRoutes };
