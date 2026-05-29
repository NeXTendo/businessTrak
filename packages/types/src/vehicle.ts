import { FuelType, TransmissionType, VehicleStatus } from './enums';

export interface IVehicle {
  id:                string;
  registrationNo:    string;
  vin:               string | null;
  engineNumber:      string | null;
  chassisNumber:     string | null;
  make:              string;
  model:             string;
  year:              number;
  color:             string | null;
  fuelType:          FuelType;
  transmission:      TransmissionType;
  mileage:           number;
  seatCapacity:      number | null;
  purchasePrice:     number | null;
  purchaseCurrency:  string;
  sellingPrice:      number | null;
  sellingCurrency:   string;
  rentalRateDaily:   number | null;
  rentalRateWeekly:  number | null;
  rentalRateMonthly: number | null;
  rentalCurrency:    string;
  driverRateDaily:   number | null;
  status:            VehicleStatus;
  isPublished:       boolean;
  hasDriverOption:   boolean;
  insuranceExpiry:   string | null;
  roadTaxExpiry:     string | null;
  description:       string | null;
  features:          string[];
  acquiredAt:        string | null;
  createdAt:         string;
  updatedAt:         string;
  images?:           IVehicleImage[];
  primaryImageUrl?:  string | null;
}
export interface IVehicleImage {
  id:          string;
  vehicleId:   string;
  url:         string;
  storagePath: string;
  isPrimary:   boolean;
  sortOrder:   number;
}
export interface IVehicleMaintenance {
  id:                 string;
  vehicleId:          string;
  serviceType:        string;
  description:        string | null;
  serviceDate:        string;
  mileageAtService:   number | null;
  cost:               number | null;
  currency:           string;
  serviceProvider:    string | null;
  nextServiceDate:    string | null;
  nextServiceMileage: number | null;
  receiptUrl:         string | null;
  createdAt:          string;
}
export interface IVehicleTimelineEntry {
  id:            string;
  vehicleId:     string;
  event:         string;
  description:   string | null;
  referenceId:   string | null;
  referenceType: string | null;
  mileage:       number | null;
  performedBy:   string | null;
  createdAt:     string;
}