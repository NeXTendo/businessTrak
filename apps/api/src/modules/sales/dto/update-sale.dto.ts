import { z } from 'zod';
import { createSaleSchema } from './create-sale.dto';

export const updateSaleSchema = createSaleSchema.partial();

export type UpdateSaleDto = z.infer<typeof updateSaleSchema>;
