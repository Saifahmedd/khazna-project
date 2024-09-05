import { Connection } from 'typeorm';
import { Role, RoleTypes } from './entities/role';
import { VacationStatus,  StatusTypes} from './entities/vacationStatus';
import { Team, TeamType } from './entities/team';
import { Reason, ReasonTypes } from './entities/reason';
import { Employee } from './entities/employee';
import bcrypt from 'bcrypt';
import * as employeeRepository from '././components/user/user.repository';

export const initializeData = async (connection: Connection) => {
    const roleRepository = connection.getRepository(Role);
    const existingRoles = await roleRepository.find();
    if (existingRoles.length === 0) {
        await roleRepository.save([
            { role: RoleTypes.SuperAdmin},
            { role: RoleTypes.Admin },
            { role: RoleTypes.Employee }
        ]);
    }

    const vacationStatusRepository = connection.getRepository(VacationStatus);
    const existingStatus = await vacationStatusRepository.find();
    if (existingStatus.length === 0) {
        await vacationStatusRepository.save([
            { name: StatusTypes.Pending },
            { name: StatusTypes.Approved },
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
            { type: TeamType.PRODUCT },
        ]);
    }

    const reasonRepository = connection.getRepository(Reason);
    const existingReasons = await reasonRepository.find();
    if (existingReasons.length === 0) {
        await reasonRepository.save([
            { name: ReasonTypes.SICK_LEAVE },
            { name: ReasonTypes.PERSONAL },
            { name: ReasonTypes.EMERGENCY },
        ]);
    }

    const superAdminRole = await employeeRepository.findRoleByRoleName(RoleTypes.SuperAdmin)
    if (!superAdminRole) {
        console.error('SuperAdmin role not found. Please check your initialization data.');
        return;
    }

    const defaultSuperAdminEmail = 'superadmin@khazna.app';
    let superAdmin = await Employee.findOne({ where: { email: defaultSuperAdminEmail } });

    if (!superAdmin) {
        const hashedPassword = await bcrypt.hash('SuperAdminPassword123!', 10);

        superAdmin = Employee.create({
            name: 'SuperAdmin',
            email: defaultSuperAdminEmail,
            password: hashedPassword,
            phoneNumber: '01023255440',
            role: superAdminRole,
        });

        await Employee.save(superAdmin);
    }
};
