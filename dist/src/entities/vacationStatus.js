"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VacationStatus = exports.StatusTypes = void 0;
const typeorm_1 = require("typeorm");
const vacation_1 = require("./vacation");
var StatusTypes;
(function (StatusTypes) {
    StatusTypes["Pending"] = "pending";
    StatusTypes["Accepted"] = "accepted";
    StatusTypes["Rejected"] = "rejected";
})(StatusTypes || (exports.StatusTypes = StatusTypes = {}));
let VacationStatus = class VacationStatus extends typeorm_1.BaseEntity {
};
exports.VacationStatus = VacationStatus;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], VacationStatus.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: StatusTypes,
        default: StatusTypes.Pending
    }),
    __metadata("design:type", String)
], VacationStatus.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => vacation_1.Vacation, vacation => vacation.status),
    __metadata("design:type", Array)
], VacationStatus.prototype, "requests", void 0);
exports.VacationStatus = VacationStatus = __decorate([
    (0, typeorm_1.Entity)('vacation_status')
], VacationStatus);
//# sourceMappingURL=vacationStatus.js.map