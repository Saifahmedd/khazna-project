import { Entity, BaseEntity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany, JoinColumn } from "typeorm";
import { Role } from "./role";
import { Vacation } from "./vacation";
import { Team } from "./team";

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

    @Column({ nullable: true })
    phoneNumber: string;

    @Column({ unique: true, nullable: true })
    googleId: string;

    @ManyToOne(() => Role, role => role.employees, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'roleId' })
    role: Role;

    @OneToMany(() => Vacation, vacation => vacation.employee, { cascade: true })
    requests: Vacation[];

    @ManyToOne(() => Team, team => team.employees)
    @JoinColumn({ name: 'teamId' })
    team: Team;

    @Column({ nullable: true })
    avatarId: number
}
