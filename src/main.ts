import dotenv from 'dotenv';
import { createConnection, Connection } from 'typeorm';
import { Employee } from './entities/employee';
import { Role } from './entities/role';
import { Vacation } from './entities/vacation';
import { Team } from './entities/team';
import { VacationStatus } from './entities/vacationStatus';
import express from 'express';
import { vacationRoutes } from './components/vacation/vacation.routes';
import { userRoutes } from './components/user/user.routes';
import { authenticateToken } from '../middleware/authenticateToken';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { initializeData } from './constants';
import cors from "cors"
import { Reason } from './entities/reason';

console.log("App is starting...");

const app = express();
let connection: Connection;
app.use(cors({ origin: '*' })); // Allow all origins for testing

const main = async () => {
    try {
        console.log("Loading .env");
        const envResult = dotenv.config({ path: 'C:/Users/hp/Desktop/khazna-project/src/.env' });
        console.log("dotenv result:", envResult);

        console.log({
            host: process.env.DB_HOST,
            port: process.env.DB_PORT,
            username: process.env.DB_USERNAME,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_DATABASE
        });

        connection = await createConnection({
            type: 'mysql',
            host: process.env.DB_HOST  || '34.176.41.161',
            port: Number(process.env.DB_PORT) || 3306,
            username: process.env.DB_USERNAME || 'khazna-sql',
            password: process.env.DB_PASSWORD || 'Khazna2024',
            database: process.env.DB_DATABASE || 'khazna-db',
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
                        url: 'http://localhost:3000/',
                    },
                ],
            },
            apis: ['./src/swagger/*.ts'],
        };

        const swaggerSpec = swaggerJSDoc(swaggerOptions);
        app.get('/', (req, res) => {
            console.log("Hello World");
            res.send('Hello World!');
        });

        app.use(express.json());
        app.use(authenticateToken); // Middleware Token
        app.use(userRoutes); // User Endpoints
        app.use(vacationRoutes); // Vacation Endpoints
        
        app.listen(3000, () => {
            console.log(`Server running on http://localhost:3000`);
        });
    } catch (error) {
        console.error("Error connecting to database:", error);
    }
};

main();

export { connection };

export default app;
