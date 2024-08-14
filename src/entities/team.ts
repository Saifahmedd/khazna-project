import { Entity, BaseEntity, Column, PrimaryGeneratedColumn, OneToMany } from "typeorm";
import { Employee } from "./employee";
import { TeamType } from "./constants/constants";

@Entity('team')
export class Team extends BaseEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        type: "enum",
        enum: TeamType,
        default: TeamType.FRONTEND
    })
    type: TeamType;

    @OneToMany(() => Employee, employee => employee.team)
    employees: Employee[];
}
