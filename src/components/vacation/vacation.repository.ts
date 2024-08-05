import { Connection } from "typeorm";
import { Employee } from "../../entities/employee";
 import { Vacation } from "../../entities/vacation";
import { VacationStatus, StatusTypes } from "../../entities/vacationStatus";

export const findVacationStatusByName = async (name: StatusTypes) => {
    return await VacationStatus.findOneBy({ name });
};

export const findRequestsByEmployeeId = async (employeeId: number) => {
    const requests = await Vacation.find({
        where: { employee: { id: employeeId } },
        relations: ['employee', 'status'],
    });

    // Print the dateFrom column for each vacation request
    requests.forEach((request) => {
        console.log(request.dateTo);
    });

    return requests;
}; 


export const findRequestById = async (id: number) => {
    return await Vacation.findOne({ where: { id } });
};

export const updateRequest = async (request: Vacation, updateData: Partial<Vacation>) => {
    Object.assign(request, updateData);
    return await request.save();
};

export const createVacationRequest = (dateFrom: Date, dateTo: Date, reason: string, employee: Employee, status: VacationStatus) => {
    return Vacation.create({ dateFrom, dateTo, reason, employee, status });
};

export const saveVacationRequest = async (request: Vacation) => {
    return await request.save();
};

export const findVacationById = async (requestId: number) => {
    return await Vacation.findOne({ where: { id: requestId } });
};

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
export const filterRequestsBySQL = async (sql: string, connection: Connection) => {
    try {
        const result = await connection.query(sql);
        return result;
    } catch (err) {
        throw new Error(`Error executing query: ${err.message}`);
    }
};