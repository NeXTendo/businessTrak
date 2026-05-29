import { PaymentMethod } from './enums';

export interface IInvoice {
  id:            string;
  invoiceNumber: string;
  rentalId:      string | null;
  saleId:        string | null;
  customerId:    string;
  subtotal:      number;
  discount:      number;
  taxAmount:     number;
  totalAmount:   number;
  currency:      string;
  totalZmw:      number;
  isPaid:        boolean;
  paidAt:        string | null;
  dueDate:       string | null;
  pdfUrl:        string | null;
  generatedBy:   string | null;
  createdAt:     string;
}
export interface IReceipt {
  id:            string;
  receiptNumber: string;
  invoiceId:     string | null;
  rentalId:      string | null;
  saleId:        string | null;
  customerId:    string;
  amountPaid:    number;
  currency:      string;
  amountZmw:     number;
  paymentMethod: PaymentMethod;
  referenceNo:   string | null;
  pdfUrl:        string | null;
  issuedBy:      string | null;
  createdAt:     string;
}
export interface IExpense {
  id:            string;
  category:      string;
  description:   string;
  amount:        number;
  currency:      string;
  amountZmw:     number;
  expenseDate:   string;
  vehicleId:     string | null;
  employeeId:    string | null;
  paymentMethod: PaymentMethod | null;
  referenceNo:   string | null;
  receiptUrl:    string | null;
  recordedBy:    string | null;
  createdAt:     string;
}