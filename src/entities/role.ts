import { Entity, BaseEntity, Column, PrimaryGeneratedColumn, OneToMany } from "typeorm";
import { Employee } from "./employee";

export enum RoleTypes {
    SuperAdmin = 'superadmin',
    Admin = 'admin',
    Employee = 'employee'
}

@Entity('role')
export class Role extends BaseEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        type: "enum",
        enum: RoleTypes,
        default: RoleTypes.Employee
    })
    role: RoleTypes;

    @OneToMany(() => Employee, employee => employee.role)
    employees: Employee[];
}
