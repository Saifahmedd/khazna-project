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
exports.Team = exports.TeamType = void 0;
const typeorm_1 = require("typeorm");
const employee_1 = require("./employee");
var TeamType;
(function (TeamType) {
    TeamType["FRONTEND"] = "frontend";
    TeamType["BACKEND"] = "backend";
    TeamType["TESTING"] = "testing";
    TeamType["PRODUCT"] = "product";
})(TeamType || (exports.TeamType = TeamType = {}));
let Team = class Team extends typeorm_1.BaseEntity {
};
exports.Team = Team;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Team.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: "enum",
        enum: TeamType,
        default: TeamType.FRONTEND
    }),
    __metadata("design:type", String)
], Team.prototype, "type", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => employee_1.Employee, employee => employee.team),
    __metadata("design:type", Array)
], Team.prototype, "employees", void 0);
exports.Team = Team = __decorate([
    (0, typeorm_1.Entity)('team')
], Team);
//# sourceMappingURL=team.js.map