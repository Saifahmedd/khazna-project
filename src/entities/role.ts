import { Entity, BaseEntity, Column, PrimaryGeneratedColumn, OneToMany } from "typeorm";
import { Employee } from "./employee";
import { RoleTypes } from "./constants";

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
