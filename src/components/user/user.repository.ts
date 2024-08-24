import { TeamType } from "../../entities/team";
import { Employee } from "../../entities/employee";
import { Role, RoleTypes } from "../../entities/role";
import { Team } from "../../entities/team";

export const findEmployeeByEmail = (email: string) => {
    return Employee.findOne({ where: { email }, relations: ['role'] });
};

export const findEmployeeById = (employeeId: number)=>{
    return Employee.findOne({where: {id: employeeId}, relations: ['role', 'team']});
}

export const saveEmployee = (employee: Employee) => {
    return Employee.save(employee);
};

export const deleteEmployee = (employee: Employee) => {
    return Employee.remove(employee);
};

export const findRoleByRoleName = (role: RoleTypes) => {
    return Role.findOneBy({ role });
};

export const findTeamByTeamType = (team: TeamType) => {
    return Team.findOneBy({ type: team }); // Make sure to use 'type' instead of 'team'
};


