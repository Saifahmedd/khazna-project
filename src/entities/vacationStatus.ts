import { Entity, BaseEntity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Vacation } from './vacation';

export enum StatusTypes {
    Pending = 'pending',
    Accepted = 'accepted',
    Rejected = 'rejected'
}

@Entity('vacation_status')
export class VacationStatus extends BaseEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        type: 'enum',
        enum: StatusTypes,
        default: StatusTypes.Pending
    })
    name: StatusTypes;

    @OneToMany(() => Vacation, vacation => vacation.status)
    requests: Vacation[];
    StatusTypes: string;
}
