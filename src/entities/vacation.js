"use strict";
var __esDecorate = (this && this.__esDecorate) || function (ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
    var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
    var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
    var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
    var _, done = false;
    for (var i = decorators.length - 1; i >= 0; i--) {
        var context = {};
        for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
        for (var p in contextIn.access) context.access[p] = contextIn.access[p];
        context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
        var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
        if (kind === "accessor") {
            if (result === void 0) continue;
            if (result === null || typeof result !== "object") throw new TypeError("Object expected");
            if (_ = accept(result.get)) descriptor.get = _;
            if (_ = accept(result.set)) descriptor.set = _;
            if (_ = accept(result.init)) initializers.unshift(_);
        }
        else if (_ = accept(result)) {
            if (kind === "field") initializers.unshift(_);
            else descriptor[key] = _;
        }
    }
    if (target) Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
};
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Vacation = void 0;
const typeorm_1 = require("typeorm");
const employee_1 = require("./employee");
const vacationStatus_1 = require("./vacationStatus");
const reason_1 = require("./reason");
let Vacation = (() => {
    let _classDecorators = [(0, typeorm_1.Entity)('vacation')];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = typeorm_1.BaseEntity;
    let _id_decorators;
    let _id_initializers = [];
    let _id_extraInitializers = [];
    let _employee_decorators;
    let _employee_initializers = [];
    let _employee_extraInitializers = [];
    let _reviewerId_decorators;
    let _reviewerId_initializers = [];
    let _reviewerId_extraInitializers = [];
    let _status_decorators;
    let _status_initializers = [];
    let _status_extraInitializers = [];
    let _reason_decorators;
    let _reason_initializers = [];
    let _reason_extraInitializers = [];
    let _dateFrom_decorators;
    let _dateFrom_initializers = [];
    let _dateFrom_extraInitializers = [];
    let _dateTo_decorators;
    let _dateTo_initializers = [];
    let _dateTo_extraInitializers = [];
    let _createdAt_decorators;
    let _createdAt_initializers = [];
    let _createdAt_extraInitializers = [];
    var Vacation = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.employee = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _employee_initializers, void 0));
            this.reviewerId = (__runInitializers(this, _employee_extraInitializers), __runInitializers(this, _reviewerId_initializers, void 0));
            this.status = (__runInitializers(this, _reviewerId_extraInitializers), __runInitializers(this, _status_initializers, void 0));
            this.reason = (__runInitializers(this, _status_extraInitializers), __runInitializers(this, _reason_initializers, void 0));
            // Use 'timestamp' to ensure it's handled as a date in SQL
            this.dateFrom = (__runInitializers(this, _reason_extraInitializers), __runInitializers(this, _dateFrom_initializers, void 0));
            this.dateTo = (__runInitializers(this, _dateFrom_extraInitializers), __runInitializers(this, _dateTo_initializers, void 0));
            this.createdAt = (__runInitializers(this, _dateTo_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            __runInitializers(this, _createdAt_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "Vacation");
    (() => {
        var _a;
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create((_a = _classSuper[Symbol.metadata]) !== null && _a !== void 0 ? _a : null) : void 0;
        _id_decorators = [(0, typeorm_1.PrimaryGeneratedColumn)()];
        _employee_decorators = [(0, typeorm_1.ManyToOne)(() => employee_1.Employee, employee => employee.requests, { onDelete: 'CASCADE' }), (0, typeorm_1.JoinColumn)({ name: 'employeeId' })];
        _reviewerId_decorators = [(0, typeorm_1.Column)({ type: 'int', nullable: true, default: null })];
        _status_decorators = [(0, typeorm_1.ManyToOne)(() => vacationStatus_1.VacationStatus, status => status.requests, { onDelete: 'CASCADE' }), (0, typeorm_1.JoinColumn)({ name: 'statusId' })];
        _reason_decorators = [(0, typeorm_1.ManyToOne)(() => reason_1.Reason, reason => reason.vacations, { onDelete: 'CASCADE' }), (0, typeorm_1.JoinColumn)({ name: 'reasonId' })];
        _dateFrom_decorators = [(0, typeorm_1.Column)({ type: 'timestamp' })];
        _dateTo_decorators = [(0, typeorm_1.Column)({ type: 'timestamp' })];
        _createdAt_decorators = [(0, typeorm_1.CreateDateColumn)()];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _employee_decorators, { kind: "field", name: "employee", static: false, private: false, access: { has: obj => "employee" in obj, get: obj => obj.employee, set: (obj, value) => { obj.employee = value; } }, metadata: _metadata }, _employee_initializers, _employee_extraInitializers);
        __esDecorate(null, null, _reviewerId_decorators, { kind: "field", name: "reviewerId", static: false, private: false, access: { has: obj => "reviewerId" in obj, get: obj => obj.reviewerId, set: (obj, value) => { obj.reviewerId = value; } }, metadata: _metadata }, _reviewerId_initializers, _reviewerId_extraInitializers);
        __esDecorate(null, null, _status_decorators, { kind: "field", name: "status", static: false, private: false, access: { has: obj => "status" in obj, get: obj => obj.status, set: (obj, value) => { obj.status = value; } }, metadata: _metadata }, _status_initializers, _status_extraInitializers);
        __esDecorate(null, null, _reason_decorators, { kind: "field", name: "reason", static: false, private: false, access: { has: obj => "reason" in obj, get: obj => obj.reason, set: (obj, value) => { obj.reason = value; } }, metadata: _metadata }, _reason_initializers, _reason_extraInitializers);
        __esDecorate(null, null, _dateFrom_decorators, { kind: "field", name: "dateFrom", static: false, private: false, access: { has: obj => "dateFrom" in obj, get: obj => obj.dateFrom, set: (obj, value) => { obj.dateFrom = value; } }, metadata: _metadata }, _dateFrom_initializers, _dateFrom_extraInitializers);
        __esDecorate(null, null, _dateTo_decorators, { kind: "field", name: "dateTo", static: false, private: false, access: { has: obj => "dateTo" in obj, get: obj => obj.dateTo, set: (obj, value) => { obj.dateTo = value; } }, metadata: _metadata }, _dateTo_initializers, _dateTo_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: obj => "createdAt" in obj, get: obj => obj.createdAt, set: (obj, value) => { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        Vacation = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return Vacation = _classThis;
})();
exports.Vacation = Vacation;
