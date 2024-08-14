import express from 'express';
import * as userController from './user.controller';

const router = express.Router();

router.post('/register', userController.registerEmployee);

router.post('/login', userController.loginEmployee);

router.get('/userInfo', userController.getUserInfo);

router.put('/user/avatarId', userController.updateAvatar);

export { router as userRoutes };
