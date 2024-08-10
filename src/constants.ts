// src/utils/initializeData.ts

import { Connection } from 'typeorm';
import { Role } from './entities/role';
import { VacationStatus } from './entities/vacationStatus';
import { Team } from './entities/team';
import { RoleTypes, TeamType, StatusTypes } from './entities/constants';

export const initializeData = async (connection: Connection) => {
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
};
