import dotenv from 'dotenv';
import { createConnection, Connection } from 'typeorm';
import { Employee } from './entities/employee';
import { Role } from './entities/role';
import { Vacation } from './entities/vacation';
import { Team } from './entities/team';
import { VacationStatus } from './entities/vacationStatus';
import express from 'express';
import session from 'express-session';
import { vacationRoutes } from './components/vacation/vacation.routes';
import { userRoutes } from './components/user/user.routes';
import { authenticateToken } from '../middleware/authenticateToken';
import passport from './auth';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { initializeData } from './constants'; // Import the new file

dotenv.config();

const app = express();
let connection: Connection;

const main = async () => {
    try {
        connection = await createConnection({
            type: 'mysql',
            host: process.env.DB_HOST as string || '127.0.0.1',
            port: parseInt(process.env.DB_PORT as string, 10) || 3300,
            username: process.env.DB_USERNAME as string || 'root',
            password: process.env.DB_PASSWORD as string || 'root123',
            database: process.env.DB_DATABASE as string || 'khazna',
            entities: [Employee, Role, Vacation, VacationStatus, Team],
            synchronize: true,
        });       

        console.log("Connected to MySQL database");

        // Initialize data
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
                        url: process.env.SWAGGER_SERVER_URL as string || 'http://localhost:8080/',
                    },
                ],
            },
            apis: ['./src/components/**/*.ts'],
        };

        const swaggerSpec = swaggerJSDoc(swaggerOptions);

        // Swagger docs
        app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

        app.get('/', (req, res) => {
            res.send('<a href="/auth/google">Login with Google</a>');
        });

        app.get('/test', (req, res) => {
            res.send('Server is running');
        });

        //app.use(authenticateToken); // Middleware Token
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

export default app;
