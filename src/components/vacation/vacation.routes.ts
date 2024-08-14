import express from 'express';
import { checkAdminRole } from "../../../middleware/checkAdminRole";
import * as vacationController from './vacation.controller';

const router = express.Router();

 router.get('/vacation/filter', vacationController.filterVacationRequests);

router.get('/vacation/:requestId', vacationController.getVacationRequestById);

router.get('/vacation', vacationController.getUserVacationRequests);

router.post('/vacation', vacationController.createVacationRequest);

router.put('/vacation/:requestId', vacationController.updateUserVacationRequest);

router.delete('/vacation', vacationController.deleteVacationRequest);

router.put('/vacation/admin/:requestId/:status', checkAdminRole, vacationController.updateAdminVacationRequest);

router.put('/vacation/admin/:requestId', checkAdminRole, vacationController.updateAdminVacationRequestDetails);

export { router as vacationRoutes };
