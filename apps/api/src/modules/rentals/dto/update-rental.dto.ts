import { z } from 'zod';
import { createRentalSchema } from './create-rental.dto';

export const updateRentalSchema = createRentalSchema.partial();

export type UpdateRentalDto = z.infer<typeof updateRentalSchema>;
