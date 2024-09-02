"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connection = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const typeorm_1 = require("typeorm");
const employee_1 = require("./entities/employee");
const role_1 = require("./entities/role");
const vacation_1 = require("./entities/vacation");
const team_1 = require("./entities/team");
const vacationStatus_1 = require("./entities/vacationStatus");
const express_1 = __importDefault(require("express"));
const vacation_routes_1 = require("./components/vacation/vacation.routes");
const user_routes_1 = require("./components/user/user.routes");
const authenticateToken_1 = require("../middleware/authenticateToken");
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const constants_1 = require("./constants");
const cors_1 = __importDefault(require("cors"));
const reason_1 = require("./entities/reason");
dotenv_1.default.config({ path: 'C:/Users/hp/Desktop/khazna-project/src/.env' });
const app = (0, express_1.default)();
let connection;
app.use((0, cors_1.default)());
const main = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        exports.connection = connection = yield (0, typeorm_1.createConnection)({
            type: 'mysql',
            host: process.env.DB_HOST,
            port: parseInt(process.env.DB_PORT, 10),
            username: process.env.DB_USERNAME,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_DATABASE,
            entities: [employee_1.Employee, role_1.Role, vacation_1.Vacation, vacationStatus_1.VacationStatus, team_1.Team, reason_1.Reason],
            synchronize: true,
        });
        console.log("Connected to MySQL database");
        yield (0, constants_1.initializeData)(connection);
        const swaggerOptions = {
            definition: {
                openapi: '3.0.0',
                info: {
                    title: 'Khazna API Project',
                    version: '1.0.0',
                },
                servers: [
                    {
                        url: 'http://localhost:8080/',
                    },
                ],
            },
            apis: ['./src/swagger/*.ts'],
        };
        const swaggerSpec = (0, swagger_jsdoc_1.default)(swaggerOptions);
        app.use('/api/docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swaggerSpec));
        app.use(express_1.default.json());
        app.use(authenticateToken_1.authenticateToken);
        app.use(user_routes_1.userRoutes);
        app.use(vacation_routes_1.vacationRoutes);
        app.listen(8080, () => {
            console.log(`Server running on http://localhost:8080`);
        });
    }
    catch (error) {
        console.error("Error connecting to database:", error);
    }
});
main();
exports.default = app;
//# sourceMappingURL=main.js.map