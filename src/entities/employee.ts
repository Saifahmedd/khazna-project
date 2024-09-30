// src/entities/employee.ts
import { Entity, BaseEntity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { Role } from './role';
import { Vacation } from './vacation';
import { Team } from './team';

@Entity('employee')
export class Employee extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column({ unique: true })
    email: string;

    @Column({ nullable: true })
    password: string;

    @ManyToOne(() => Role, role => role.employees, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'roleId' })
    role: Role;

    @OneToMany(() => Vacation, vacation => vacation.employee, { cascade: true })
    requests: Vacation[];

    @ManyToOne(() => Team, team => team.employees, { nullable: true })
    @JoinColumn({ name: 'teamId' })
    team!: Team;

    // If you want to store the avatar URL or path
    @Column({ type: 'varchar', nullable: true })
    avatarSrc: string;  // Change the type to string
}
