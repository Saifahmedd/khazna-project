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
import { RoleTypes, TeamType, StatusTypes } from './entities/constants';

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
            connectTimeout: 50000, // 30 seconds
        });
        

        console.log("Connected to MySQL database");

        const roleRepository = connection.getRepository(Role);
        const existingRoles = await roleRepository.find();
        if (existingRoles.length === 0) {
            await roleRepository.save([
                { role: RoleTypes.Admin },
                { role: RoleTypes.User },
            ]);
        }

        const vacationStatusRepository = connection.getRepository(VacationStatus);
        const existingStatus = await vacationStatusRepository.find();
        if (existingStatus.length === 0) {
            await vacationStatusRepository.save([
                { name: StatusTypes.Pending },
                { name: StatusTypes.Accepted },
                { name: StatusTypes.Rejected },
            ]);
        }

        const teamRepository = connection.getRepository(Team);
        const existingTeams = await teamRepository.find();
        if (existingTeams.length === 0) {
            await teamRepository.save([
                { type: TeamType.BACKEND },
                { type: TeamType.FRONTEND },
                { type: TeamType.TESTING },
            ]);
        }

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

// Export default Express app for Vercel
export default app;
