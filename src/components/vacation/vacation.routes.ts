import express from 'express';
import { checkAdminRole } from "../../../middleware/checkAdminRole";
import * as vacationController from './vacation.controller';
import { checkSuperAdminRole } from '../../../middleware/checkSuperAdminRole';

const router = express.Router();

router.get('/vacation/filter', vacationController.filterVacationRequests);

router.get('/vacation/:employeeId/:page/:limit/:sortField/:sortDirection', vacationController.getUserVacationRequests);

router.get('/vacation/superAdmin/allVacations/:page/:limit/:sortField/:sortDirection', checkSuperAdminRole, vacationController.getAllVacationRequests);

router.post('/vacation', vacationController.createVacationRequest);

router.put('/vacation/:requestId', vacationController.updateUserVacationRequest);

router.delete('/vacation/:requestId', vacationController.deleteVacationRequest);

router.put('/vacation/:requestId/admin/:status', checkAdminRole, vacationController.updateAdminVacationRequest);

router.get('/vacation/admin/team/:teamId', checkAdminRole, vacationController.getVacationRequestsByTeam);

export { router as vacationRoutes };
