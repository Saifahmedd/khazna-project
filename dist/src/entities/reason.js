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
exports.Reason = exports.ReasonTypes = void 0;
const typeorm_1 = require("typeorm");
const vacation_1 = require("./vacation");
var ReasonTypes;
(function (ReasonTypes) {
    ReasonTypes["SICK_LEAVE"] = "sick_leave";
    ReasonTypes["PERSONAL"] = "personal";
    ReasonTypes["EMERGENCY"] = "emergency";
})(ReasonTypes || (exports.ReasonTypes = ReasonTypes = {}));
let Reason = class Reason extends typeorm_1.BaseEntity {
};
exports.Reason = Reason;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Reason.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: "enum",
        enum: ReasonTypes
    }),
    __metadata("design:type", String)
], Reason.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => vacation_1.Vacation, vacation => vacation.reason),
    __metadata("design:type", Array)
], Reason.prototype, "vacations", void 0);
exports.Reason = Reason = __decorate([
    (0, typeorm_1.Entity)('reason')
], Reason);
//# sourceMappingURL=reason.js.map