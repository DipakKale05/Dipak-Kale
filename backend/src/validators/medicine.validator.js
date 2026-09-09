import { z } from 'zod';

export const medicineQuerySchema = z.object({
  q: z.string().trim().optional(),
  search: z.string().trim().optional(),
  category: z.string().trim().optional(),
});

export const medicineIdParamSchema = z.object({
  id: z.string().trim().min(1, 'Medicine ID is required'),
});
