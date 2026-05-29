import { z } from 'zod';
import { SaleStatus, SaleType } from '@chatowa/types';

export const createSaleSchema = z.object({
  customerId: z.string().uuid(),
  vehicleId: z.string().uuid(),
  type: z.nativeEnum(SaleType).default(SaleType.CASH),
  status: z.nativeEnum(SaleStatus).default(SaleStatus.PENDING),
  totalAmount: z.number().nonnegative(),
  currency: z.string().length(3).default('ZMW'),
  depositAmount: z.number().nonnegative().optional(),
  balanceAmount: z.number().nonnegative().optional(),
  installmentMonths: z.number().int().positive().optional(),
  interestRate: z.number().nonnegative().optional(),
  tradeInVehicleId: z.string().uuid().optional(),
  tradeInValue: z.number().nonnegative().optional(),
  notes: z.string().optional(),
});

export type CreateSaleDto = z.infer<typeof createSaleSchema>;
