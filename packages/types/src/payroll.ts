export interface IPayroll {
  id:            string;
  employeeId:    string;
  periodMonth:   number;
  periodYear:    number;
  grossSalary:   number;
  deductions:    number;
  netSalary:     number;
  currency:      string;
  netZmw:        number;
  paymentMethod: string | null;
  paymentDate:   string | null;
  isPaid:        boolean;
  paidAt:        string | null;
  referenceNo:   string | null;
  payslipUrl:    string | null;
  processedBy:   string | null;
  createdAt:     string;
}