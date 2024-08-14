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
import { initializeData } from './constants';
import cors from "cors"
dotenv.config({ path: 'C:/Users/hp/Desktop/khazna-project/src/.env' });

const app = express();
let connection: Connection;

app.use(cors());

const main = async () => {
    try {
        connection = await createConnection({
            type: 'mysql',
            host: process.env.DB_HOST as string || 'localhost',
            port: parseInt(process.env.DB_PORT as string, 10) || 3306,
            username: process.env.DB_USERNAME as string || 'root',
            password: process.env.DB_PASSWORD as string || 'root123',
            database: process.env.DB_DATABASE as string || 'khazna-db',
            entities: [Employee, Role, Vacation, VacationStatus, Team],
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
                        url: process.env.SWAGGER_SERVER_URL as string || 'http://localhost:8080/',
                    },
                ],
            },
            apis: ['./src/swagger.ts'],
        };

        const swaggerSpec = swaggerJSDoc(swaggerOptions);

        // Middleware
        app.use(express.json());
        app.use(session({
            secret: process.env.SESSION_SECRET as string || 'secret',
            resave: false,
            saveUninitialized: false,
        }));
        app.use(passport.initialize());
        app.use(passport.session());

        // Swagger docs
        app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

        app.get('/', (req, res) => {
            res.send('<a href="/auth/google">Login with Google</a>');
        });

        app.get('/test', (req, res) => {
            res.send('Server is running');
        });        

        app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

        app.get('/auth/google/callback',
            passport.authenticate('google', { failureRedirect: '/' }),
            (req: express.Request & { user?: Express.User }, res: express.Response) => {
                if (req.user && (req.user as any).token) {
                    res.redirect(`/token?jwt=${encodeURIComponent((req.user as any).token)}`);
                } else {
                    res.redirect('/');
                }
            }
        );

        app.get('/token', (req, res) => {
            const token = req.query.jwt as string;
            console.log(token);
            if (token) {
                res.send("Hello");
            } else {
                res.status(400).json({ error: 'No token provided' });
            }
        });

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
