import { SaleType, SaleStatus, PaymentMethod, PaymentStatus } from './enums';

export interface ISale {
  id:                 string;
  saleNumber:         string;
  customerId:         string;
  vehicleId:          string;
  tradeInId:          string | null;
  saleType:           SaleType;
  saleStatus:         SaleStatus;
  askingPrice:        number;
  agreedPrice:        number;
  currency:           string;
  agreedPriceZmw:     number;
  tradeInValue:       number;
  topUpAmount:        number | null;
  downPayment:        number;
  installmentCount:   number | null;
  installmentAmount:  number | null;
  installmentInterval:string | null;
  nextPaymentDate:    string | null;
  totalPaid:          number;
  balanceDue:         number | null;
  completedAt:        string | null;
  createdAt:          string;
  updatedAt:          string;
}
export interface ITradeIn {
  id:               string;
  make:             string;
  model:            string;
  year:             number;
  registrationNo:   string | null;
  color:            string | null;
  mileage:          number | null;
  conditionNotes:   string | null;
  valuedAt:         number;
  valuationCurrency:string;
  valuedBy:         string | null;
  enteredFleet:     boolean;
  fleetVehicleId:   string | null;
  photoUrls:        string[];
  createdAt:        string;
}
export interface ISalePayment {
  id:            string;
  saleId:        string;
  amount:        number;
  currency:      string;
  amountZmw:     number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  paymentDate:   string;
  referenceNo:   string | null;
  isDownPayment: boolean;
  installmentNo: number | null;
  confirmedBy:   string | null;
  createdAt:     string;
}