import express from 'express';
import * as userController from './user.controller';
import { checkSuperAdminRole } from '../../../middleware/checkSuperAdminRole';

const router = express.Router();

router.post('/register', userController.registerEmployee);

router.post('/login', userController.loginEmployee);

router.get('/user/:employeeId/info', userController.getUserInfo);

router.put('/user/:employeeId', userController.updateAvatar);

router.put('/user/:employeeId/role/:role' ,checkSuperAdminRole, userController.updateRole);

router.put('/user/:employeeId/changePass', userController.changePassword);

router.get('/user', checkSuperAdminRole, userController.getAllUsers);

export { router as userRoutes };
