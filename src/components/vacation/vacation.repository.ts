import { Connection } from "typeorm";
import { Employee } from "../../entities/employee";
import { Vacation } from "../../entities/vacation";
import { VacationStatus, StatusTypes } from "../../entities/vacationStatus";
import { Reason, ReasonTypes } from "../../entities/reason";

export const findVacationStatusByName = async (name: StatusTypes) => {
    return await VacationStatus.findOneBy({ name });
};

export const findRequestsByEmployeeId = async (employeeId: number) => {
    const requests = await Vacation.find({
        where: { employee: { id: employeeId } },
        relations: ['employee', 'status', 'reason']
    });

    return requests;
};

export const findRequestsByEmployeeIdWithSkip = async (
    employeeId: number,
    skip: number | null,
    take: number | null,
    column: string | null,
    order: 'ASC' | 'DESC' | null
) => {
    try {
        const currentYear = new Date().getFullYear();
        const startOfYear = new Date(currentYear, 0, 1);
        const endOfYear = new Date(currentYear, 11, 31, 23, 59, 59, 999);

        const queryBuilder = Vacation.createQueryBuilder('vacation')
            .where('vacation.employeeId = :employeeId', { employeeId })
            .andWhere('vacation.dateFrom BETWEEN :startOfYear AND :endOfYear', {
                startOfYear,
                endOfYear,
            })
            .leftJoinAndSelect('vacation.employee', 'employee')
            .leftJoinAndSelect('vacation.status', 'status')
            .leftJoinAndSelect('vacation.reason', 'reason')
            .leftJoinAndSelect('employee.role', 'role')
            .leftJoinAndSelect('employee.team', 'team');

        // Apply pagination if both skip and take are provided
        if (typeof skip === 'number' && !isNaN(skip) && typeof take === 'number' && !isNaN(take)) {
            queryBuilder.skip(skip);
            queryBuilder.take(take);
        }

        // Apply sorting with default order by 'createdAt' descending
        if (column && order) {
            queryBuilder.orderBy(`vacation.${column}`, order);
        } else {
            queryBuilder.orderBy('vacation.createdAt', 'DESC');
        }

        const requests = await queryBuilder.getMany();

        return { status: 200, response: requests };
    } catch (error) {
        const errorMessage = (error instanceof Error) ? error.message : "Unknown error";
        return { status: 500, response: { message: "Error fetching requests", error: errorMessage } };
    }
};

export const findAllRequestsWithSkip = async (
    skip: number | null,
    take: number | null,
    column: string | null,
    order: 'ASC' | 'DESC' | null
) => {
    try {
        const currentYear = new Date().getFullYear();
        const startOfYear = new Date(currentYear, 0, 1);
        const endOfYear = new Date(currentYear, 11, 31, 23, 59, 59, 999);

        const queryBuilder = Vacation.createQueryBuilder('vacation')
            .andWhere('vacation.dateFrom BETWEEN :startOfYear AND :endOfYear', {
                startOfYear,
                endOfYear,
            })
            .leftJoinAndSelect('vacation.employee', 'employee')
            .leftJoinAndSelect('vacation.status', 'status')
            .leftJoinAndSelect('vacation.reason', 'reason')
            .leftJoinAndSelect('employee.team', 'team');

        // Apply pagination if both skip and take are provided
        if (typeof skip === 'number' && !isNaN(skip) && typeof take === 'number' && !isNaN(take)) {
            queryBuilder.skip(skip);
            queryBuilder.take(take);
        }

        // Apply sorting with default order by 'createdAt' descending
        if (column && order) {
            queryBuilder.orderBy(`vacation.${column}`, order);
        } else {
            queryBuilder.orderBy('vacation.createdAt', 'DESC');
        }

        const requests = await queryBuilder.getMany();

        return { status: 200, response: requests };
    } catch (error) {
        const errorMessage = (error instanceof Error) ? error.message : "Unknown error";
        return { status: 500, response: { message: "Error fetching requests", error: errorMessage } };
    }
};

export const findRequestById = async (id: number) => {
    return await Vacation.findOne({ where: { id } });
};

export const updateRequest = async (request: Vacation, updateData: Partial<Vacation>) => {
    Object.assign(request, updateData);
    return await request.save();
};

export const createVacationRequest = (dateFrom: Date, dateTo: Date, reason: Reason, employee: Employee, status: VacationStatus) => {
    return Vacation.create({ dateFrom, dateTo, reason, employee, status });
};

export const findReasonByName = async (reasonName: ReasonTypes): Promise<Reason | null> => {
    try {
        const reason = await Reason.findOne({ where: { name: reasonName } });
        return reason || null;
    } catch (error) {
        throw new Error("Could not find reason");
    }
};

export const saveVacationRequest = async (request: Vacation) => {
    return await request.save();
};

export const findVacationById = async (requestId: number) => {
    const vacation = await Vacation.findOne({
        where: { id: requestId },
        relations: ['employee', 'employee.role', 'status', 'reason']
    })
    if (!vacation) {
        throw new Error(`Vacation with ID ${requestId} not found`);
    }

    const role = vacation.employee?.role;
    if (!role) {
        throw new Error('Role information is missing for the employee');
    }

    return { vacation, role };

    ;};

export const updateVacationRequest = async (request: Vacation, updateData: Partial<Vacation>) => {
    Object.assign(request, updateData);
    return await request.save();
};

export const deleteVacationRequest = async (request: Vacation) => {
    return await request.remove();
};

export const findEmployeeById = async (employeeId: number) => {
    return await Employee.findOne({
        where: { id: employeeId },
        relations: ['role', 'team']
    });
};

export const filterRequestsBySQL = async (sql: string, values: any[], connection: Connection) => {
    try {
        const result = await connection.query(sql, values);
        return result;
    } catch (err) {
        const errorMessage = (err instanceof Error) ? err.message : "Unknown error";
        throw new Error(`Error executing query: ${errorMessage}`);
    }
};

export const fetchVacationsByTeam = async (teamId: number, connection: Connection) => {
    try {
        // Fetch vacation requests for employees belonging to the specified team
        const vacations = await connection
            .getRepository(Vacation)
            .createQueryBuilder('vacation')
            .innerJoinAndSelect('vacation.employee', 'employee')
            .innerJoinAndSelect('employee.team', 'team')
            .where('team.id = :teamId', { teamId })
            .getMany();

        return vacations;
    } catch (error) {
        throw new Error('Failed to fetch vacations by team');
    }
};

export const findAllVacations = async (
    connection: Connection, 
    skip: number, 
    limit: number, 
    column: string, 
    order: 'ASC' | 'DESC'
) => {
    try {
        // Using getManyAndCount to fetch both results and total count
        const [requests, total] = await connection
            .getRepository(Vacation)
            .createQueryBuilder('vacation')
            .innerJoinAndSelect('vacation.employee', 'employee')
            .innerJoinAndSelect('vacation.status', 'status')
            .innerJoinAndSelect('vacation.reason', 'reason')
            .orderBy(column, order)
            .skip(skip)  // Pagination
            .take(limit) // Limit
            .getManyAndCount(); // Returns both data and count

        return { requests, total };
    } catch (error) {
        throw new Error('Failed to fetch vacation requests');
    }
};