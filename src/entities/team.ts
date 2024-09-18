import { Entity, BaseEntity, Column, PrimaryGeneratedColumn, OneToMany } from "typeorm";
import { Employee } from "./employee";

export enum TeamType {
    FRONTEND = "frontend",
    BACKEND = "backend",
    TESTING = "testing",
    PRODUCT = "product"
}

@Entity('team')
export class Team extends BaseEntity {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column({
        type: "enum",
        enum: TeamType,
        default: TeamType.FRONTEND
    })
    type!: TeamType;

    @OneToMany(() => Employee, employee => employee.team)
    employees!: Employee[];
}
