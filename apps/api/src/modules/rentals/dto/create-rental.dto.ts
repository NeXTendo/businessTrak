import { z } from 'zod';
import { RentalStatus } from '@chatowa/types';

export const createRentalSchema = z.object({
  customerId: z.string().uuid(),
  vehicleId: z.string().uuid(),
  startDate: z.string(), // ISO date string
  endDate: z.string(), // ISO date string
  status: z.nativeEnum(RentalStatus).default(RentalStatus.INQUIRY),
  totalAmount: z.number().nonnegative(),
  currency: z.string().length(3).default('ZMW'),
  depositAmount: z.number().nonnegative().optional(),
  balanceAmount: z.number().nonnegative().optional(),
  pickupLocation: z.string().optional(),
  dropoffLocation: z.string().optional(),
  driverIncluded: z.boolean().default(false),
  driverId: z.string().uuid().optional(),
  notes: z.string().optional(),
});

export type CreateRentalDto = z.infer<typeof createRentalSchema>;
