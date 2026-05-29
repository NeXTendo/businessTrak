import { UserRole } from './enums';

export interface IEmployee {
  id:                    string;
  userId:                string | null;
  fullName:              string;
  email:                 string | null;
  phone:                 string;
  role:                  UserRole;
  department:            string | null;
  hireDate:              string;
  endDate:               string | null;
  isActive:              boolean;
  salaryAmount:          number | null;
  salaryCurrency:        string;
  nationalId:            string | null;
  address:               string | null;
  emergencyContactName:  string | null;
  emergencyContactPhone: string | null;
  createdAt:             string;
  updatedAt:             string;
}