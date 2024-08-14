//register
/**
 * @swagger
 * /register:
 *   post:
 *     summary: Register a new employee
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - password
 *               - role
 *               - phonenumber
 *               - email
 *             properties:
 *               name:
 *                 type: string
 *                 example: Saif Ahmed
 *               password:
 *                 type: string
 *                 example: Password123
 *               role:
 *                 type: string
 *                 example: Admin
 *               phonenumber:
 *                 type: string
 *                 example: "01023255440"
 *               email:
 *                 type: string
 *                 example: saifahmedsalah11@gmail.com
 *     responses:
 *       200:
 *         description: Employee registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: Employee registered successfully
 *                 data:
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
 *         description: Missing or invalid input
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Missing or invalid input
 *       409:
 *         description: Conflict - Email already exists
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
 *     summary: Login an employee
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
 *                 example: saifahmedsalah11@gmail.com
 *               password:
 *                 type: string
 *                 example: Password123
 *     responses:
 *       200:
 *         description: Successfully logged in
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Logged in successfully"
 *                 accessToken:
 *                   type: string
 *                   example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *       400:
 *         description: Missing or invalid inputs
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Missing or invalid inputs"
 *       401:
 *         description: Unauthorized - Incorrect email or password
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Incorrect email or password"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Internal server error"
 */
//userInfo
/**
 * @swagger
 * /userInfo:
 *   get:
 *     summary: Get user information
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - employeeId
 *             properties:
 *               employeeId:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       200:
 *         description: Successfully retrieved user information
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 avatar:
 *                   type: string
 *                   example: "avatarId123"
 *                 name:
 *                   type: string
 *                   example: "Saif Ahmed"
 *                 team:
 *                   type: string
 *                   example: "Engineering"
 *                 daysLeft:
 *                   type: integer
 *                   example: 10
 *       400:
 *         description: Invalid input or all vacation days are taken
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Invalid input"
 *       404:
 *         description: Employee not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Cannot find the employee"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Internal server error"
 */
//user/:avatarId
/**
 * @swagger
 * /user/:avatarId:
 *   put:
 *     summary: Update an employee's avatar
 *     parameters:
 *       - in: path
 *         name: avatarId
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the new avatar
 *       - in: body
 *         name: employeeId
 *         required: true
 *         description: The ID of the employee whose avatar is being updated
 *         schema:
 *           type: object
 *           required:
 *             - employeeId
 *           properties:
 *             employeeId:
 *               type: integer
 *               example: 1
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
 *                   example: "Avatar updated successfully"
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
 *                       example: 101
 *       400:
 *         description: Invalid input
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Invalid input"
 *       404:
 *         description: Employee not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Cannot find the employee"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Internal server error"
 */
//vacation/filter
/**
 * @swagger
 * /vacation/filter:
 *   get:
 *     summary: Filter vacation requests based on a specific key and value
 *     parameters:
 *       - in: query
 *         name: key
 *         required: true
 *         schema:
 *           type: string
 *         description: The key to filter the vacation requests by (e.g., status, employeeId)
 *       - in: query
 *         name: value
 *         required: true
 *         schema:
 *           type: string
 *         description: The value to filter the vacation requests by
 *     responses:
 *       200:
 *         description: Successfully retrieved filtered vacation requests
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
 *                     example: 2
 *                   dateFrom:
 *                     type: string
 *                     format: date-time
 *                     example: "2024-08-01T00:00:00Z"
 *                   dateTo:
 *                     type: string
 *                     format: date-time
 *                     example: "2024-08-05T00:00:00Z"
 *                   status:
 *                     type: string
 *                     example: "Pending"
 *       400:
 *         description: Key and value are required
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "key and value are required"
 *       500:
 *         description: Internal Server Error
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
//vacation/:requestId
/**
 * @swagger
 * /vacation/:requestId:
 *   get:
 *     summary: Get a single vacation request by ID
 *     description: Retrieves a specific vacation request using its ID.
 *     parameters:
 *       - in: path
 *         name: requestId
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the vacation request to retrieve.
 *     responses:
 *       200:
 *         description: Successfully retrieved the vacation request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Request fetched successfully"
 *                 request:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     dateFrom:
 *                       type: string
 *                       format: date-time
 *                       example: "2024-08-01T00:00:00Z"
 *                     dateTo:
 *                       type: string
 *                       format: date-time
 *                       example: "2024-08-07T00:00:00Z"
 *                     reason:
 *                       type: string
 *                       example: "Vacation for family trip"
 *                     status:
 *                       type: string
 *                       example: "Pending"
 *       400:
 *         description: Invalid Request ID provided
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Valid Request ID is required"
 *       404:
 *         description: Vacation request not found
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
 *                   example: "Error fetching request"
 */
//vacation
/**
 * @swagger
 * /vacation:
 *   post:
 *     summary: Create a new vacation request
 *     description: Creates a new vacation request for an employee. The employee ID, start date, end date, and reason are required.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - employeeId
 *               - dateFrom
 *               - dateTo
 *               - reason
 *             properties:
 *               employeeId:
 *                 type: integer
 *                 description: The ID of the employee making the request.
 *                 example: 1
 *               dateFrom:
 *                 type: string
 *                 format: date-time
 *                 description: The start date of the vacation request.
 *                 example: "2024-08-01T00:00:00Z"
 *               dateTo:
 *                 type: string
 *                 format: date-time
 *                 description: The end date of the vacation request.
 *                 example: "2024-08-07T00:00:00Z"
 *               reason:
 *                 type: string
 *                 description: The reason for the vacation request.
 *                 example: "Vacation for family trip"
 *     responses:
 *       '201':
 *         description: Vacation request created successfully.
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
 *                       description: The ID of the vacation request.
 *                       example: 1
 *                     employeeId:
 *                       type: integer
 *                       description: The ID of the employee.
 *                       example: 1
 *                     dateFrom:
 *                       type: string
 *                       format: date-time
 *                       description: The start date of the vacation request.
 *                       example: "2024-08-01T00:00:00Z"
 *                     dateTo:
 *                       type: string
 *                       format: date-time
 *                       description: The end date of the vacation request.
 *                       example: "2024-08-07T00:00:00Z"
 *                     reason:
 *                       type: string
 *                       description: The reason for the vacation request.
 *                       example: "Vacation for family trip"
 *                     status:
 *                       type: string
 *                       description: The status of the vacation request.
 *                       example: "Pending"  # Provide a single example value
 *       '400':
 *         description: Bad Request. Missing or invalid parameters.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Employee ID is required"
 *       '404':
 *         description: Not Found. Employee or status not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Employee not found"
 *       '500':
 *         description: Internal Server Error. An unexpected error occurred.
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
 *                   example: "Error creating vacation request"
 */
//vacation
/**
 * @swagger
 * /vacation:
 *   get:
 *     summary: Get all vacation requests for an employee
 *     description: Retrieves all vacation requests for a specific employee based on the provided employee ID.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - employeeId
 *             properties:
 *               employeeId:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       200:
 *         description: Successfully retrieved vacation requests for the employee
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
 *                   dateFrom:
 *                     type: string
 *                     format: date-time
 *                     example: "2024-08-01T00:00:00Z"
 *                   dateTo:
 *                     type: string
 *                     format: date-time
 *                     example: "2024-08-07T00:00:00Z"
 *                   reason:
 *                     type: string
 *                     example: "Vacation for family trip"
 *                   status:
 *                     type: string
 *                     example: "Pending"
 *       400:
 *         description: Missing Employee ID
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Employee ID is required"
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
 *                   example: "Error fetching requests"
 */
//vacation
/**
 * @swagger
 * /vacation/:requestId:
 *   put:
 *     summary: Update a vacation request
 *     description: Updates the details of a vacation request identified by the `requestId`.
 *     parameters:
 *       - in: path
 *         name: requestId
 *         required: true
 *         description: The ID of the vacation request to update.
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               reviewerId:
 *                 type: integer
 *                 description: The ID of the reviewer.
 *               dateFrom:
 *                 type: string
 *                 format: date
 *                 description: The start date of the vacation request.
 *               dateTo:
 *                 type: string
 *                 format: date
 *                 description: The end date of the vacation request.
 *               reason:
 *                 type: string
 *                 description: The reason for the vacation request.
 *               status:
 *                 type: string
 *                 description: The status of the vacation request. (e.g., Pending, Accepted, Rejected)
 *             required:
 *               - reviewerId
 *               - dateFrom
 *               - dateTo
 *               - reason
 *               - status
 *     responses:
 *       '200':
 *         description: Request updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Request updated successfully"
 *       '400':
 *         description: Bad Request. The request parameters or body are invalid.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "All fields are required"
 *       '404':
 *         description: Not Found. The request ID does not exist.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Request not found"
 *       '500':
 *         description: Internal Server Error. An unexpected error occurred.
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
 *                   example: "Error updating vacation request"
 */
//vacation
/**
 * @swagger
 * /vacation:
 *   delete:
 *     summary: Delete a vacation request
 *     description: Deletes a vacation request identified by the `requestId`.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               requestId:
 *                 type: integer
 *                 description: The ID of the vacation request to delete.
 *             required:
 *               - requestId
 *     responses:
 *       '200':
 *         description: Request deleted successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Request deleted successfully"
 *       '400':
 *         description: Bad Request. The request ID is invalid or missing.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Valid Request ID is required"
 *       '404':
 *         description: Not Found. The request ID does not exist.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Request not found"
 *       '500':
 *         description: Internal Server Error. An unexpected error occurred.
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
 *                   example: "Error deleting vacation request"
 */
//vacation/admin/:requestId/:status
/**
 * @swagger
 * /vacation/admin/:requestId/:status:
 *   put:
 *     summary: Update the status of a vacation request by admin
 *     description: Updates the status of a vacation request identified by the `requestId` and `status`.
 *     parameters:
 *       - in: path
 *         name: requestId
 *         schema:
 *           type: integer
 *         required: true
 *         description: The ID of the vacation request to update.
 *       - in: path
 *         name: status
 *         schema:
 *           type: string
 *         required: true
 *         description: The new status of the vacation request.
 *     responses:
 *       '200':
 *         description: Request updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   description: The ID of the vacation request.
 *                 status:
 *                   type: string
 *                   description: The updated status of the vacation request.
 *       '400':
 *         description: Bad Request. Invalid `requestId` or missing `status`.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Valid Request ID is required"
 *       '404':
 *         description: Not Found. The request ID or status does not exist.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Request not found"  # Provide specific examples, not combined
 *       '500':
 *         description: Internal Server Error. An unexpected error occurred.
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
 *                   example: "Error updating admin vacation request"
 */
//vacation/admin/:requestId
/**
 * @swagger
 * /vacation/admin/:requestId:
 *   put:
 *     summary: Update details of a vacation request by admin
 *     description: Updates the details of a vacation request identified by the `requestId`.
 *     parameters:
 *       - in: path
 *         name: requestId
 *         schema:
 *           type: integer
 *         required: true
 *         description: The ID of the vacation request to update.
 *       - in: body
 *         name: body
 *         description: The details to update in the vacation request.
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             reviewerId:
 *               type: integer
 *               description: The ID of the reviewer.
 *             dateFrom:
 *               type: string
 *               format: date
 *               description: The start date of the vacation.
 *             dateTo:
 *               type: string
 *               format: date
 *               description: The end date of the vacation.
 *             reason:
 *               type: string
 *               description: The reason for the vacation.
 *     responses:
 *       '200':
 *         description: Request updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   description: The ID of the vacation request.
 *                 reviewerId:
 *                   type: integer
 *                   description: The ID of the reviewer.
 *                 dateFrom:
 *                   type: string
 *                   format: date
 *                   description: The updated start date of the vacation.
 *                 dateTo:
 *                   type: string
 *                   format: date
 *                   description: The updated end date of the vacation.
 *                 reason:
 *                   type: string
 *                   description: The updated reason for the vacation.
 *       '400':
 *         description: Bad Request. Invalid or missing data.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Valid Request ID is required"  # Provide one example per response
 *       '404':
 *         description: Not Found. The request ID does not exist.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Request not found"
 *       '500':
 *         description: Internal Server Error. An unexpected error occurred.
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
 *                   example: "Error updating vacation request"
 */
