import { Employee } from '../entities/employee';

declare global {
  namespace Express {
    interface User extends Employee {
      token?: string; // Add this property to the User interface
    }
  }
}
