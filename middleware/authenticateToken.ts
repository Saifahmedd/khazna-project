import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config({ path: 'C:/Users/hp/Desktop/khazna-project/src/.env' });
console.log("ACCESS_TOKEN_SECRET:", process.env.ACCESS_TOKEN_SECRET);

interface AuthenticatedRequest extends Request {
    user?: any;
}

export const authenticateToken = (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    if (req.path === '/register' || req.path === '/') {
        return next();
    }
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) {
        console.log("No token provided");
        res.sendStatus(401);
        return;
    }

    const secret = process.env.ACCESS_TOKEN_SECRET;
    if (!secret) {
        console.error("ACCESS_TOKEN_SECRET is not defined");
        throw new Error("ACCESS_TOKEN_SECRET is not defined");
    }

    jwt.verify(token, secret, (err, user) => {
        if (err) {
            console.error("Token verification failed:", err.message);
            res.sendStatus(403);
            return;
        }
        req.user = user;
        next();
    });
};
