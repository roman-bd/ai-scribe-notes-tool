import { z } from 'zod';

export const createNoteSchema = z.object({
  patientId: z.string().uuid('Invalid patient ID'),
  text: z.string().min(1, 'Text cannot be empty').optional(),
});

export const idParamSchema = z.object({
  id: z.string().uuid('Invalid ID format'),
});

const ALLOWED_AUDIO_TYPES = [
  'audio/mpeg',
  'audio/wav',
  'audio/mp4',
  'audio/webm',
  'audio/ogg',
  'audio/x-m4a',
];

const MAX_FILE_SIZE = 25 * 1024 * 1024; // 25MB

export const audioFileSchema = z.object({
  mimetype: z.string().refine(
    (type) => ALLOWED_AUDIO_TYPES.includes(type),
    { message: 'Invalid file type. Allowed: MP3, WAV, M4A, WebM, OGG' }
  ),
  size: z.number().max(MAX_FILE_SIZE, 'File too large. Maximum size allowed is 25MB'),
});

export type CreateNoteInput = z.infer<typeof createNoteSchema>;
