import { z } from 'zod';

export const createCustomerSchema = z.object({
  fullName: z.string().min(1, 'Full name is required'),
  email: z.string().email().optional(),
  phone: z.string().min(1, 'Phone number is required'),
  address: z.string().optional(),
  nrcNumber: z.string().optional(),
  passportNumber: z.string().optional(),
  driversLicenseNumber: z.string().optional(),
  driversLicenseExpiry: z.string().optional(),
  companyName: z.string().optional(),
  tpinNumber: z.string().optional(),
  isCorporate: z.boolean().default(false),
  isBlacklisted: z.boolean().default(false),
  blacklistReason: z.string().optional(),
  notes: z.string().optional(),
});

export type CreateCustomerDto = z.infer<typeof createCustomerSchema>;
