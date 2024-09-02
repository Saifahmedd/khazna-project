import dotenv from 'dotenv';
import { createConnection, Connection } from 'typeorm';
import { Employee } from './entities/employee';
import { Role, RoleTypes } from './entities/role';
import { Vacation } from './entities/vacation';
import { Team } from './entities/team';
import { VacationStatus } from './entities/vacationStatus';
import express from 'express';
import { vacationRoutes } from './components/vacation/vacation.routes';
import { userRoutes } from './components/user/user.routes';
import { authenticateToken } from '../middleware/authenticateToken';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import path from 'path';
import fs from 'fs';
import { initializeData } from './constants';
import cors from "cors"
import { Reason } from './entities/reason';
dotenv.config({ path: 'C:/Users/hp/Desktop/khazna-project/src/.env' });

const app = express();
let connection: Connection;

app.use(cors());

const main = async () => {
    try {
        connection = await createConnection({
            type: 'mysql',
            host: process.env.DB_HOST as string,
            port: parseInt(process.env.DB_PORT as string, 10),
            username: process.env.DB_USERNAME as string,
            password: process.env.DB_PASSWORD as string,
            database: process.env.DB_DATABASE as string,
            entities: [Employee, Role, Vacation, VacationStatus, Team, Reason],
            synchronize: true,
        });

        console.log("Connected to MySQL database");

        await initializeData(connection);

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

        const swaggerSpec = swaggerJSDoc(swaggerOptions);

        // Swagger docs
        app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

        // const outputFile = path.resolve(__dirname, 'swagger.json');
        // fs.writeFileSync(outputFile, JSON.stringify(swaggerSpec, null, 2));

        app.use(express.json());
        app.use(authenticateToken); // Middleware Token
        app.use(userRoutes); // User Endpoints
        app.use(vacationRoutes); // Vacation Endpoints
        
        app.listen(8080, () => {
            console.log(`Server running on http://localhost:8080`);
        });
    } catch (error) {
        console.error("Error connecting to database:", error);
    }
};

main();

export { connection };

export default app;
