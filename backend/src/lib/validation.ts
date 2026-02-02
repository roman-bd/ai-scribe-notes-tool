import { z } from 'zod';

export const createNoteSchema = z.object({
  patientId: z.string().uuid('Invalid patient ID'),
  text: z.string().min(1, 'Text cannot be empty').optional(),
});

export const idParamSchema = z.object({
  id: z.string().uuid('Invalid ID format'),
});

export type CreateNoteInput = z.infer<typeof createNoteSchema>;
