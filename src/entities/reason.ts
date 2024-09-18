import { Entity, BaseEntity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Vacation } from "./vacation";

export enum ReasonTypes {
    SICK_LEAVE = "sick_leave",
    PERSONAL = "personal",
    EMERGENCY = "emergency"
}

@Entity('reason')
export class Reason extends BaseEntity {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({
        type: "enum",
        enum: ReasonTypes
    })
    name!: ReasonTypes;

    @OneToMany(() => Vacation, vacation => vacation.reason)
    vacations!: Vacation[];
}
