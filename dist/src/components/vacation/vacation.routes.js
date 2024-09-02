"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.vacationRoutes = void 0;
const express_1 = __importDefault(require("express"));
const checkAdminRole_1 = require("../../../middleware/checkAdminRole");
const vacationController = __importStar(require("./vacation.controller"));
const checkSuperAdminRole_1 = require("../../../middleware/checkSuperAdminRole");
const router = express_1.default.Router();
exports.vacationRoutes = router;
router.get('/vacation/filter/:key/:value', vacationController.filterVacationRequests);
router.get('/vacation/:requestId', vacationController.getVacationRequestById);
router.get('/vacation/:employeeId/:page/:limit/:column/:order', vacationController.getUserVacationRequests);
router.get('/vacation/allVacations', checkSuperAdminRole_1.checkSuperAdminRole, vacationController.getAllVacationRequests);
router.post('/vacation', vacationController.createVacationRequest);
router.put('/vacation/:requestId', vacationController.updateUserVacationRequest);
router.delete('/vacation', vacationController.deleteVacationRequest);
router.put('/vacation/:requestId/admin/:status', checkAdminRole_1.checkAdminRole, vacationController.updateAdminVacationRequest);
router.put('/vacation/:requestId/admin', checkAdminRole_1.checkAdminRole, vacationController.updateAdminVacationRequestDetails);
router.get('/vacation/admin/team/:teamId', checkAdminRole_1.checkAdminRole, vacationController.getVacationRequestsByTeam);
//# sourceMappingURL=vacation.routes.js.map