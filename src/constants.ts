import { Connection } from 'typeorm';
import { Role, RoleTypes } from './entities/role';
import { VacationStatus,  StatusTypes} from './entities/vacationStatus';
import { Team, TeamType } from './entities/team';
import { Reason, ReasonTypes } from './entities/reason';

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

    const reasonRepository = connection.getRepository(Reason);
    const existingReasons = await reasonRepository.find();
    if (existingReasons.length === 0) {
        await reasonRepository.save([
            { name: ReasonTypes.SICK_LEAVE },
            { name: ReasonTypes.PERSONAL },
            { name: ReasonTypes.EMERGENCY },
        ]);
    }
};
