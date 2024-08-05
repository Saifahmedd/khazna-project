import { Entity, BaseEntity, Column, PrimaryGeneratedColumn, OneToMany } from "typeorm";
import { Employee } from "./employee";

export enum RoleTypes {
    Admin = 'admin',
    User = 'user'
}

@Entity('role')
export class Role extends BaseEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        type: "enum",
        enum: RoleTypes,
        default: RoleTypes.User
    })
    role: RoleTypes;

    @OneToMany(() => Employee, employee => employee.role)
    employees: Employee[];
}
