import { z } from 'zod';
import { FuelType, TransmissionType, VehicleStatus } from '@chatowa/types';

export const createVehicleSchema = z.object({
  registrationNo: z.string().min(1, 'Registration number is required'),
  vin: z.string().optional(),
  engineNumber: z.string().optional(),
  chassisNumber: z.string().optional(),
  make: z.string().min(1, 'Make is required'),
  model: z.string().min(1, 'Model is required'),
  year: z.number().int().min(1900).max(new Date().getFullYear() + 1),
  color: z.string().optional(),
  fuelType: z.nativeEnum(FuelType),
  transmission: z.nativeEnum(TransmissionType),
  mileage: z.number().nonnegative(),
  seatCapacity: z.number().int().positive().optional(),
  purchasePrice: z.number().nonnegative().optional(),
  purchaseCurrency: z.string().length(3).default('ZMW'),
  rentalRateDaily: z.number().nonnegative().optional(),
  rentalRateWeekly: z.number().nonnegative().optional(),
  rentalRateMonthly: z.number().nonnegative().optional(),
  rentalCurrency: z.string().length(3).default('ZMW'),
  driverRateDaily: z.number().nonnegative().optional(),
  status: z.nativeEnum(VehicleStatus).default(VehicleStatus.AVAILABLE),
  isPublished: z.boolean().default(true),
  hasDriverOption: z.boolean().default(true),
  insuranceExpiry: z.string().optional(), // ISO date string
  roadTaxExpiry: z.string().optional(), // ISO date string
  description: z.string().optional(),
  features: z.array(z.string()).optional(),
  acquiredAt: z.string().optional(), // ISO date string
});

export type CreateVehicleDto = z.infer<typeof createVehicleSchema>;
