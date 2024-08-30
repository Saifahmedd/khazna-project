import express from 'express';
import { checkAdminRole } from "../../../middleware/checkAdminRole";
import * as vacationController from './vacation.controller';
import { checkSuperAdminRole } from '../../../middleware/checkSuperAdminRole';

const router = express.Router();

router.get('/vacation/filter', vacationController.filterVacationRequests);

router.get('/vacation/:requestId', vacationController.getVacationRequestById);

router.get('/vacation', checkSuperAdminRole, vacationController.getUserVacationRequests);

router.post('/vacation', vacationController.createVacationRequest);

router.put('/vacation/:requestId', vacationController.updateUserVacationRequest);

router.delete('/vacation', vacationController.deleteVacationRequest);

router.put('/vacation/:requestId/admin/:status', checkAdminRole, vacationController.updateAdminVacationRequest);

router.put('/vacation/:requestId/admin', checkAdminRole, vacationController.updateAdminVacationRequestDetails);

router.get('/vacation/admin/team/:teamId', checkAdminRole, vacationController.getVacationRequestsByTeam);

export { router as vacationRoutes };
