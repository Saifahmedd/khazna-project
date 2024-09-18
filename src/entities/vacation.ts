import { Entity, BaseEntity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, CreateDateColumn } from "typeorm";
import { Employee } from "./employee";
import { VacationStatus } from "./vacationStatus";
import { Reason } from "./reason";

@Entity('vacation')
export class Vacation extends BaseEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Employee, employee => employee.requests, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'employeeId' })
    employee: Employee;

    @Column({ type: 'int', nullable: true, default: null })
    reviewerId: number | null;

    @ManyToOne(() => VacationStatus, status => status.requests, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'statusId' })
    status: VacationStatus;

    @ManyToOne(() => Reason, reason => reason.vacations, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'reasonId' })
    reason: Reason;

    // Use 'timestamp' to ensure it's handled as a date in SQL
    @Column({ type: 'timestamp' })
    dateFrom: Date;

    @Column({ type: 'timestamp' })
    dateTo: Date;

    @CreateDateColumn()
    createdAt: Date;
}
