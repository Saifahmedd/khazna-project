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
exports.Employee = void 0;
const typeorm_1 = require("typeorm");
const role_1 = require("./role");
const vacation_1 = require("./vacation");
const team_1 = require("./team");
let Employee = (() => {
    let _classDecorators = [(0, typeorm_1.Entity)('employee')];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = typeorm_1.BaseEntity;
    let _id_decorators;
    let _id_initializers = [];
    let _id_extraInitializers = [];
    let _name_decorators;
    let _name_initializers = [];
    let _name_extraInitializers = [];
    let _email_decorators;
    let _email_initializers = [];
    let _email_extraInitializers = [];
    let _password_decorators;
    let _password_initializers = [];
    let _password_extraInitializers = [];
    let _phoneNumber_decorators;
    let _phoneNumber_initializers = [];
    let _phoneNumber_extraInitializers = [];
    let _role_decorators;
    let _role_initializers = [];
    let _role_extraInitializers = [];
    let _requests_decorators;
    let _requests_initializers = [];
    let _requests_extraInitializers = [];
    let _team_decorators;
    let _team_initializers = [];
    let _team_extraInitializers = [];
    let _avatarId_decorators;
    let _avatarId_initializers = [];
    let _avatarId_extraInitializers = [];
    var Employee = _classThis = class extends _classSuper {
        constructor() {
            super(...arguments);
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.name = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _name_initializers, void 0));
            this.email = (__runInitializers(this, _name_extraInitializers), __runInitializers(this, _email_initializers, void 0));
            this.password = (__runInitializers(this, _email_extraInitializers), __runInitializers(this, _password_initializers, void 0));
            this.phoneNumber = (__runInitializers(this, _password_extraInitializers), __runInitializers(this, _phoneNumber_initializers, void 0));
            this.role = (__runInitializers(this, _phoneNumber_extraInitializers), __runInitializers(this, _role_initializers, void 0));
            this.requests = (__runInitializers(this, _role_extraInitializers), __runInitializers(this, _requests_initializers, void 0));
            this.team = (__runInitializers(this, _requests_extraInitializers), __runInitializers(this, _team_initializers, void 0));
            this.avatarId = (__runInitializers(this, _team_extraInitializers), __runInitializers(this, _avatarId_initializers, void 0));
            __runInitializers(this, _avatarId_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "Employee");
    (() => {
        var _a;
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create((_a = _classSuper[Symbol.metadata]) !== null && _a !== void 0 ? _a : null) : void 0;
        _id_decorators = [(0, typeorm_1.PrimaryGeneratedColumn)()];
        _name_decorators = [(0, typeorm_1.Column)()];
        _email_decorators = [(0, typeorm_1.Column)({ unique: true })];
        _password_decorators = [(0, typeorm_1.Column)({ nullable: true })];
        _phoneNumber_decorators = [(0, typeorm_1.Column)({ nullable: true })];
        _role_decorators = [(0, typeorm_1.ManyToOne)(() => role_1.Role, role => role.employees, { onDelete: 'CASCADE' }), (0, typeorm_1.JoinColumn)({ name: 'roleId' })];
        _requests_decorators = [(0, typeorm_1.OneToMany)(() => vacation_1.Vacation, vacation => vacation.employee, { cascade: true })];
        _team_decorators = [(0, typeorm_1.ManyToOne)(() => team_1.Team, team => team.employees, { nullable: true }), (0, typeorm_1.JoinColumn)({ name: 'teamId' })];
        _avatarId_decorators = [(0, typeorm_1.Column)({ nullable: true })];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _name_decorators, { kind: "field", name: "name", static: false, private: false, access: { has: obj => "name" in obj, get: obj => obj.name, set: (obj, value) => { obj.name = value; } }, metadata: _metadata }, _name_initializers, _name_extraInitializers);
        __esDecorate(null, null, _email_decorators, { kind: "field", name: "email", static: false, private: false, access: { has: obj => "email" in obj, get: obj => obj.email, set: (obj, value) => { obj.email = value; } }, metadata: _metadata }, _email_initializers, _email_extraInitializers);
        __esDecorate(null, null, _password_decorators, { kind: "field", name: "password", static: false, private: false, access: { has: obj => "password" in obj, get: obj => obj.password, set: (obj, value) => { obj.password = value; } }, metadata: _metadata }, _password_initializers, _password_extraInitializers);
        __esDecorate(null, null, _phoneNumber_decorators, { kind: "field", name: "phoneNumber", static: false, private: false, access: { has: obj => "phoneNumber" in obj, get: obj => obj.phoneNumber, set: (obj, value) => { obj.phoneNumber = value; } }, metadata: _metadata }, _phoneNumber_initializers, _phoneNumber_extraInitializers);
        __esDecorate(null, null, _role_decorators, { kind: "field", name: "role", static: false, private: false, access: { has: obj => "role" in obj, get: obj => obj.role, set: (obj, value) => { obj.role = value; } }, metadata: _metadata }, _role_initializers, _role_extraInitializers);
        __esDecorate(null, null, _requests_decorators, { kind: "field", name: "requests", static: false, private: false, access: { has: obj => "requests" in obj, get: obj => obj.requests, set: (obj, value) => { obj.requests = value; } }, metadata: _metadata }, _requests_initializers, _requests_extraInitializers);
        __esDecorate(null, null, _team_decorators, { kind: "field", name: "team", static: false, private: false, access: { has: obj => "team" in obj, get: obj => obj.team, set: (obj, value) => { obj.team = value; } }, metadata: _metadata }, _team_initializers, _team_extraInitializers);
        __esDecorate(null, null, _avatarId_decorators, { kind: "field", name: "avatarId", static: false, private: false, access: { has: obj => "avatarId" in obj, get: obj => obj.avatarId, set: (obj, value) => { obj.avatarId = value; } }, metadata: _metadata }, _avatarId_initializers, _avatarId_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        Employee = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return Employee = _classThis;
})();
exports.Employee = Employee;
