import { Request, Response, NextFunction } from 'express';
import { Employee } from '../src/entities/employee';
import { RoleTypes } from '../src/entities/role';

interface AuthenticatedRequest extends Request {
    user?: any;
}

const checkSuperAdminRole = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        const email = req.user.email;
        const user = await Employee.findOne({
            where: { email: email },
            relations: ['role']
        });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (user.role.role != RoleTypes.SuperAdmin) {
            return res.status(403).json({ message: "Access denied. Super Admins only." });
        }

        next();
        return;
    } catch (error) {
        return res.status(500).json({ message: "Internal Server Error", error: (error as Error).message });
    }
};

export { checkSuperAdminRole };
