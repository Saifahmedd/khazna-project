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

export const findRequestsByEmployeeIdWithSkip = async (employeeId: number,skip: number | null,take: number | null,column: string | null,order: 'ASC' | 'DESC' | null) => {
    try {
        const queryBuilder = (Vacation).createQueryBuilder('vacation')
            .where('vacation.employeeId = :employeeId', { employeeId })
            .leftJoinAndSelect('vacation.employee', 'employee')
            .leftJoinAndSelect('vacation.status', 'status')
            .leftJoinAndSelect('vacation.reason', 'reason')
            .leftJoinAndSelect('employee.role', 'role')
            .leftJoinAndSelect('employee.team', 'team')

        if (column && order) {
            queryBuilder.orderBy(`vacation.${column}`, order);
        }

        if (skip && take) {
            queryBuilder.skip(skip);
            queryBuilder.take(take);
        }

        const requests = await queryBuilder.getMany();

        return { status: 200, response: requests };
    } catch (error) {
        return { status: 500, response: { message: "Error fetching requests", error: error.message } };
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
        console.error("Error finding reason by name:", error);
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
        console.error("Error in filterRequestsBySQL:", err);
        throw new Error(`Error executing query: ${err.message}`);
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
        console.error('Error fetching vacations by team:', error);
        throw new Error('Failed to fetch vacations by team');
    }
};

export const findAllRequests = async (connection: Connection) => {
    try {
        const requests = await connection
            .getRepository(Vacation)
            .createQueryBuilder('vacation')
            .innerJoinAndSelect('vacation.employee', 'employee')
            .innerJoinAndSelect('vacation.status', 'status')
            .innerJoinAndSelect('vacation.reason', 'reason')
            .getMany();

        return requests;
    } catch (error) {
        throw new Error('Failed to fetch all requests');
    }
};