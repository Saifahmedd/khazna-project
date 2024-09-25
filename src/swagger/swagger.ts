//register
/**
 * @swagger
 * /register:
 *   post:
 *     summary: Register a new employee
 *     tags: [Employees]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - team
 *               - email
 *             properties:
 *               name:
 *                 type: string
 *                 description: Employee's name
 *                 example: Saif Ahmed
 *               team:
 *                 type: string
 *                 description: The team type the employee belongs to
 *                 example: Backend
 *               email:
 *                 type: string
 *                 description: Employee's email address
 *                 example: saif.ahmed@khazna.app
 *     responses:
 *       200:
 *         description: Registration successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Registration is made successful
 *       400:
 *         description: Missing or invalid input
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Missing input
 *       404:
 *         description: Team or role not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Invalid team or role
 *       409:
 *         description: Email already exists
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Email already exists
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Internal server error
 */
//login
/**
 * @swagger
 * /login:
 *   post:
 *     summary: Log in an employee
 *     tags: [Employees]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 description: Employee's email address
 *                 example: saif.ahmed@khazna.app
 *               password:
 *                 type: string
 *                 description: Employee's password
 *                 example: saifPassword7!
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Logged in successfully
 *                 employee:
 *                   type: object
 *                   description: Employee information
 *                   properties:
 *                     id:
 *                       type: number
 *                       example: 1
 *                     name:
 *                       type: string
 *                       example: Saif Ahmed
 *                     email:
 *                       type: string
 *                       example: saif.ahmed@khazna.app
 *                     role:
 *                       type: string
 *                       example: Employee
 *                 accessToken:
 *                   type: string
 *                   description: JWT access token
 *                   example: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *       400:
 *         description: Missing inputs
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Missing inputs
 *       401:
 *         description: Invalid Credentials
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Invalid Credentials
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Internal server error
 */
//user/:employeeId/info
/**
 * @swagger
 * /user/{employeeId}/info:
 *   get:
 *     summary: Get user information
 *     tags: [Employees]
 *     parameters:
 *       - in: path
 *         name: employeeId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the employee to retrieve information for
 *         example: 1
 *     responses:
 *       200:
 *         description: User information retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 employee:
 *                   type: object
 *                   description: Employee information
 *                   properties:
 *                     id:
 *                       type: number
 *                       example: 1
 *                     name:
 *                       type: string
 *                       example: John Doe
 *                     email:
 *                       type: string
 *                       example: johndoe@example.com
 *                     phoneNumber:
 *                       type: string
 *                       example: +1234567890
 *                     role:
 *                       type: string
 *                       example: Employee
 *                     team:
 *                       type: string
 *                       example: Engineering
 *                 daysLeft:
 *                   type: integer
 *                   description: Number of vacation days remaining
 *                   example: 15
 *       400:
 *         description: Invalid input, employeeId is required
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Invalid input
 *       404:
 *         description: Employee not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Cannot find the employee
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Error fetching user info
 */
//user/{avatarId}
/**
 * @swagger
 * /user/{avatarId}:
 *   put:
 *     summary: Update employee's avatar
 *     tags: [Employees]
 *     parameters:
 *       - in: path
 *         name: avatarId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the avatar to be added
 *         example: 5
 *       - in: query
 *         name: employeeId
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the employee whose avatar is being updated
 *         example: 1
 *     responses:
 *       200:
 *         description: Avatar updated successfully
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
 *                       type: integer
 *                       example: 1
 *                     name:
 *                       type: string
 *                       example: Saif Ahmed
 *                     avatarId:
 *                       type: integer
 *                       example: 5
 *       400:
 *         description: Invalid input, missing employeeId or avatarId
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Invalid input
 *       404:
 *         description: Employee not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Cannot find the employee
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Internal server error
 */
//user/:employeeId/role/:role
/**
 * @swagger
 * /user/{employeeId}/role/{role}:
 *   put:
 *     summary: Update an employee's role
 *     tags: [Employees]
 *     parameters:
 *       - in: path
 *         name: employeeId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the employee whose role is being updated
 *         example: 1
 *       - in: path
 *         name: role
 *         required: true
 *         schema:
 *           type: string
 *           enum: [Admin, Employee, SuperAdmin]
 *         description: New role for the employee
 *         example: Admin
 *     responses:
 *       200:
 *         description: Role updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Role updated successfully
 *                 employee:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     name:
 *                       type: string
 *                       example: Saif Ahmed
 *                     role:
 *                       type: string
 *                       example: Admin
 *       400:
 *         description: Invalid input, missing employeeId or role
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Invalid input
 *       404:
 *         description: Employee or role not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Cannot find the employee or Invalid role
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Internal server error
 */
//user/:employeeId/changePass
/**
 * @swagger
 * /user/{employeeId}/changePass:
 *   put:
 *     summary: Change an employee's password
 *     tags: [Employees]
 *     parameters:
 *       - in: path
 *         name: employeeId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the employee whose password is being changed
 *         example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               oldPassword:
 *                 type: string
 *                 description: Current password of the employee
 *                 example: oldPass123
 *               newPassword:
 *                 type: string
 *                 description: New password for the employee
 *                 example: newPass123
 *     responses:
 *       200:
 *         description: Password changed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Password changed successfully
 *       400:
 *         description: Invalid input or password format
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Invalid input or Invalid Password
 *       401:
 *         description: Incorrect old password
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Incorrect old password
 *       404:
 *         description: Employee not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Cannot find the employee
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Internal server error
 */
//vacation/filter
/**
 * @swagger
 * /vacation/filter:
 *   get:
 *     summary: Filter vacation requests
 *     tags: [Vacation]
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [pending, approved, rejected]
 *         description: Filter by vacation status
 *         example: pending
 *       - in: query
 *         name: date
 *         schema:
 *           type: string
 *           description: Comma-separated date range for filtering (e.g., "startTimestamp,endTimestamp")
 *           example: "1627849200000,1627935600000"
 *         description: Filter by date range (timestamp format)
 *       - in: query
 *         name: employeeId
 *         schema:
 *           type: integer
 *         description: Filter by employee ID
 *         example: 1
 *       - in: query
 *         name: reviewerId
 *         schema:
 *           type: integer
 *         description: Filter by reviewer ID
 *         example: 2
 *     responses:
 *       200:
 *         description: List of filtered vacation requests
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         example: 1
 *                       employeeId:
 *                         type: integer
 *                         example: 1
 *                       status:
 *                         type: string
 *                         example: approved
 *                       date:
 *                         type: string
 *                         example: "1627849200000,1627935600000"
 *                       reason:
 *                         type: string
 *                         example: Vacation
 *                 count:
 *                   type: integer
 *                   example: 10
 *       400:
 *         description: Invalid input, such as missing or incorrectly formatted filters
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "At least one filter is required"
 *       500:
 *         description: Internal server error
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
 *                   example: Error message
 */
//vacation/:employeeId/:page/:limit/:sortField/:sortDirection
/**
 * @swagger
 * /vacation/{employeeId}/{page}/{limit}/{sortField}/{sortDirection}:
 *   get:
 *     summary: Retrieve vacation requests for a specific employee with pagination, sorting, and ordering
 *     tags: [Vacation]
 *     parameters:
 *       - in: path
 *         name: employeeId
 *         schema:
 *           type: integer
 *         required: true
 *         description: The ID of the employee whose vacation requests are to be retrieved
 *         example: 1
 *       - in: path
 *         name: page
 *         schema:
 *           type: integer
 *         required: true
 *         description: The page number to retrieve
 *         example: 1
 *       - in: path
 *         name: limit
 *         schema:
 *           type: integer
 *         required: true
 *         description: The number of records to retrieve per page
 *         example: 10
 *       - in: path
 *         name: sortField
 *         schema:
 *           type: string
 *         required: true
 *         description: The column to sort the results by
 *         example: "status"
 *       - in: path
 *         name: sortDirection
 *         schema:
 *           type: string
 *           enum: [ASC, DESC]
 *         required: true
 *         description: The order of sorting (ASC for ascending, DESC for descending)
 *         example: "ASC"
 *     responses:
 *       200:
 *         description: List of vacation requests for the specified employee
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         example: 1
 *                       employeeId:
 *                         type: integer
 *                         example: 1
 *                       status:
 *                         type: string
 *                         example: accepted
 *                       date:
 *                         type: string
 *                         description: Timestamp range for vacation
 *                         example: "1627849200000,1627935600000"
 *                       reason:
 *                         type: string
 *                         example: Vacation
 *                 count:
 *                   type: integer
 *                   example: 3
 *       400:
 *         description: Invalid input, such as missing required parameters
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "page, limit are required"
 *       404:
 *         description: Employee not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Employee not found"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Internal Server Error"
 *                 error:
 *                   type: string
 *                   example: "Error message"
 */
//vacation/allVacations/:page/:limit/:sortField/:sortDirection
/**
 * @swagger
 * /vacation/superAdmin/allVacations/{page}/{limit}/{sortField}/{sortDirection}:
 *   get:
 *     summary: Retrieve all vacation requests with pagination and sorting
 *     description: This endpoint allows a super admin to retrieve all vacation requests, optionally paginated and sorted by a specified field and direction.
 *     tags:
 *       - Vacation
 *     parameters:
 *       - in: path
 *         name: page
 *         required: true
 *         schema:
 *           type: integer
 *           example: 1
 *         description: Page number to retrieve
 *       - in: path
 *         name: limit
 *         required: true
 *         schema:
 *           type: integer
 *           example: 10
 *         description: Number of records to retrieve per page
 *       - in: path
 *         name: sortField
 *         required: true
 *         schema:
 *           type: string
 *           example: "createdAt"
 *         description: Field to sort the results by. Default is 'createdAt'
 *       - in: path
 *         name: sortDirection
 *         required: true
 *         schema:
 *           type: string
 *           enum: [ASC, DESC]
 *           example: "DESC"
 *         description: Direction of sorting, either ascending ('ASC') or descending ('DESC'). Default is 'DESC'.
 *     responses:
 *       200:
 *         description: List of vacation requests
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         example: 1
 *                       employee:
 *                         type: object
 *                         properties:
 *                           name:
 *                             type: string
 *                             example: "John Doe"
 *                           role:
 *                             type: string
 *                             example: "Admin"
 *                       date:
 *                         type: string
 *                         example: "1692355200000,1692921600000"
 *                       status:
 *                         type: string
 *                         example: "Pending"
 *                 count:
 *                   type: integer
 *                   example: 2
 *       400:
 *         description: Bad request due to missing or invalid pagination/sorting parameters
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Both page and limit are required together"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Internal Server Error"
 *                 error:
 *                   type: string
 *                   example: "Error fetching requests"
 */
//vacation
/**
 * @swagger
 * /vacation:
 *   post:
 *     summary: Create a new vacation request
 *     tags: [Vacation]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               employeeId:
 *                 type: integer
 *                 example: 1
 *                 description: ID of the employee requesting the vacation
 *               date:
 *                 type: string
 *                 example: "1627849200000,1627935600000"
 *                 description: Comma-separated timestamps for the start and end dates of the vacation
 *               reason:
 *                 type: string
 *                 example: "Vacation"
 *                 description: Reason for the vacation
 *     responses:
 *       201:
 *         description: Vacation request created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Inserted a Request successfully"
 *                 request:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     employeeId:
 *                       type: integer
 *                       example: 1
 *                     status:
 *                       type: string
 *                       example: "pending"
 *                     date:
 *                       type: string
 *                       example: "1627849200000,1627935600000"
 *                     reason:
 *                       type: string
 *                       example: "Vacation"
 *       400:
 *         description: Bad Request (missing or invalid parameters)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Employee ID is required"
 *       404:
 *         description: Employee, status, or reason not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Employee not found"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Internal Server Error"
 *                 error:
 *                   type: string
 *                   example: Error message
 */
//vacation/:requestId
/**
 * @swagger
 * /vacation/{requestId}:
 *   put:
 *     summary: Update a vacation request
 *     tags: [Vacation]
 *     parameters:
 *       - in: path
 *         name: requestId
 *         required: true
 *         description: ID of the vacation request to update
 *         schema:
 *           type: integer
 *           example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               reviewerId:
 *                 type: integer
 *                 example: 2
 *                 description: ID of the reviewer for the vacation request
 *               date:
 *                 type: string
 *                 example: "1627849200000,1627935600000"
 *                 description: Comma-separated timestamps for the start and end dates of the vacation
 *               reason:
 *                 type: string
 *                 example: "Sick Leave"
 *                 description: Reason for the vacation
 *               status:
 *                 type: string
 *                 example: "Approved"
 *                 description: Status of the vacation request
 *     responses:
 *       200:
 *         description: Vacation request updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Request updated successfully"
 *       400:
 *         description: Bad Request (invalid date format or missing request ID)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Invalid date format"
 *       403:
 *         description: Forbidden (request cannot be updated)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Cannot update this request"
 *       404:
 *         description: Not Found (request, reason, or status not found)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Request not found"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Internal Server Error"
 *                 error:
 *                   type: string
 *                   example: Error message
 */
//vacation/:requestId
/**
 * @swagger
 * /vacation/{requestId}:
 *   delete:
 *     summary: Delete a vacation request
 *     tags: [Vacation]
 *     parameters:
 *       - in: path
 *         name: requestId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the vacation request to delete
 *         example: 1
 *     responses:
 *       200:
 *         description: Vacation request deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Request deleted successfully"
 *       400:
 *         description: Bad Request (invalid or missing request ID)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Valid Request ID is required"
 *       403:
 *         description: Forbidden (request cannot be deleted)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Cannot delete this request"
 *       404:
 *         description: Not Found (request not found)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Request not found"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Internal Server Error"
 *                 error:
 *                   type: string
 *                   example: Error message
 */
//vacation/:requestId/admin/:status
/**
 * @swagger
 * /vacation/{requestId}/admin/{status}:
 *   put:
 *     summary: Update a vacation request status by an admin
 *     tags: [Vacation]
 *     parameters:
 *       - in: path
 *         name: requestId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the vacation request to update
 *       - in: path
 *         name: status
 *         required: true
 *         schema:
 *           type: string
 *           enum: [Approved, Rejected, Pending]
 *         description: New status to set for the vacation request
 *     responses:
 *       200:
 *         description: Vacation request status updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Request updated successfully"
 *       400:
 *         description: Bad Request (invalid or missing request ID or status)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Valid Request ID is required"
 *       404:
 *         description: Not Found (request or status not found)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Request not found"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Internal Server Error"
 *                 error:
 *                   type: string
 *                   example: Error message
 */
//vacation/admin/team/{teamId}
/**
 * @swagger
 * /vacation/admin/team/{teamId}:
 *   get:
 *     summary: Retrieve vacation requests for a specific team
 *     tags: [Vacation]
 *     parameters:
 *       - in: path
 *         name: teamId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the team to fetch vacation requests for
 *     responses:
 *       200:
 *         description: Successfully retrieved vacation requests for the specified team
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     example: 1
 *                   employeeId:
 *                     type: integer
 *                     example: 123
 *                   date:
 *                     type: string
 *                     example: "1698835200000,1699344000000"
 *                   reason:
 *                     type: string
 *                     example: "Personal"
 *                   status:
 *                     type: string
 *                     example: "Pending"
 *       400:
 *         description: Bad Request (missing or invalid teamId)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "teamId is required"
 *       404:
 *         description: Not Found (no vacation requests found for the specified team)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: string
 *                   example: "No vacation requests found for the specified team"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Internal Server Error"
 *                 error:
 *                   type: string
 *                   example: Error message
 */
//user
/**
 * @swagger
 * /user:
 *   get:
 *     summary: Get all users
 *     description: Retrieves a list of all employees. Only accessible by Super Admin.
 *     tags: [Employees]
 *     responses:
 *       200:
 *         description: A list of all employees.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: number
 *                     description: The employee ID.
 *                   name:
 *                     type: string
 *                     description: The employee's name.
 *                   email:
 *                     type: string
 *                     description: The employee's email.
 *                   role:
 *                     type: string
 *                     description: The employee's role (e.g., Admin, User).
 *       401:
 *         description: Unauthorized, the user is not authenticated or lacks permission.
 *       500:
 *         description: Internal server error.
 */