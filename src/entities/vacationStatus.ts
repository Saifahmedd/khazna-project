import { Entity, BaseEntity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Vacation } from './vacation';
import { StatusTypes } from './constants';

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
