import { Employee } from "../../entities/employee";
import { Role } from "../../entities/role";
import { RoleTypes } from "../../entities/constants"

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

