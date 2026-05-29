import { RentalStatus, PaymentMethod, PaymentStatus, FuelLevel } from './enums';

export interface IRental {
  id:               string;
  rentalNumber:     string;
  customerId:       string;
  vehicleId:        string;
  assignedDriverId: string | null;
  startDate:        string;
  endDate:          string;
  actualReturnDate: string | null;
  withDriver:       boolean;
  status:           RentalStatus;
  rateType:         string;
  rateAmount:       number;
  currency:         string;
  rateZmw:          number;
  depositAmount:    number;
  depositPaid:      boolean;
  depositReturned:  boolean;
  driverRate:       number;
  totalAmount:      number | null;
  lateFeeAmount:    number;
  amountPaid:       number;
  balanceDue:       number | null;
  pickupLocation:   string | null;
  returnLocation:   string | null;
  specialNotes:     string | null;
  createdAt:        string;
  updatedAt:        string;
}
export interface IRentalPayment {
  id:            string;
  rentalId:      string;
  amount:        number;
  currency:      string;
  amountZmw:     number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  paymentDate:   string;
  referenceNo:   string | null;
  isDeposit:     boolean;
  confirmedBy:   string | null;
  createdAt:     string;
}
export interface IRentalInspection {
  id:                   string;
  rentalId:             string;
  inspectionType:       string;
  mileage:              number;
  fuelLevel:            FuelLevel;
  damageNoted:          boolean;
  damageNotes:          string | null;
  photoUrls:            string[];
  performedBy:          string;
  customerAcknowledged: boolean;
  performedAt:          string;
}
export interface IRentalContract {
  id:                string;
  rentalId:          string;
  pdfUrl:            string | null;
  signatureMethod:   string | null;
  isSigned:          boolean;
  signedAt:          string | null;
  signatureImageUrl: string | null;
  signedByName:      string | null;
  generatedAt:       string;
}