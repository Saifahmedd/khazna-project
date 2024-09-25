import dotenv from 'dotenv';
dotenv.config({ path: 'C:\\Users\\hp\\OneDrive\\Desktop\\khazna-project\\src\\.env' });
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
import cors from 'cors';
import { Reason } from './entities/reason';
import path from 'path';
import fs from 'fs';

console.log("App is starting...");
const app = express();
let connection: Connection;
app.use(cors({ origin: '*' })); // Allow all origins for testing

const main = async () => {
    try {
        const connection = await createConnection({
            type: 'mysql',
            host: process.env.DB_HOST || '34.89.121.129',
            port: Number(process.env.DB_PORT || 3306),
            username: process.env.DB_USERNAME || 'khazna-username',
            password: process.env.DB_PASSWORD || 'Khazna123',
            database: process.env.DB_DATABASE || 'khazna-database',
            entities: [Employee, Role, Vacation, VacationStatus, Team, Reason],
            synchronize: true,
            logging: true
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
                        url: `http://localhost:${process.env.PORT || 3000}/`,
                    },
                ],
            },
            apis: ['./src/swagger/*.ts'],
        };

        const swaggerSpec = swaggerJSDoc(swaggerOptions);
        
        app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
        const swaggerFilePath = path.resolve(__dirname, './swagger.json');  // Define where swagger.json will be saved
        fs.writeFileSync(swaggerFilePath, JSON.stringify(swaggerSpec, null, 2));  // Write the swaggerSpec to swagger.json
        
        app.use(express.json());
        
        // Apply middleware after public routes
        app.use(authenticateToken); // Middleware Token
        app.use(userRoutes); // User Endpoints
        app.use(vacationRoutes); // Vacation Endpoints
        app.listen(process.env.PORT || 3000, () => {
            console.log(`Server running on port ${process.env.PORT || 3000}`);
        });
    } catch (error) {
        console.error("Error connecting to database:", error);
    }
};

main().catch((err) => {
    console.error("App failed to start:", err);
});

export { connection };

export default app;
