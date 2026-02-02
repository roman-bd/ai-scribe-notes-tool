import { Router, Request, Response } from 'express';
import fs from 'fs';
import { prisma } from '../lib/db';
import { createNoteSchema, idParamSchema, audioFileSchema } from '../lib/validation';
import { upload } from '../middleware/upload';
import { uploadAudio, getAudioUrl } from '../services/s3';
import { transcribeAudio, generateSoapNote } from '../services/ai';

const router = Router();

router.get('/', async (req: Request, res: Response) => {
  const notes = await prisma.note.findMany({
    include: {
      patient: { select: { id: true, name: true } },
    },
    orderBy: { createdAt: 'desc' },
  });
  res.json(notes);
});

router.get('/:id', async (req: Request, res: Response) => {
  const parsed = idParamSchema.safeParse({ id: req.params.id });

  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.issues[0].message });
    return;
  }

  const note = await prisma.note.findUnique({
    where: { id: parsed.data.id },
    include: { patient: true },
  });

  if (!note) {
    res.status(404).json({ error: 'Note not found' });
    return;
  }

  let audioPlaybackUrl = null;
  if (note.audioUrl) {
    const key = note.audioUrl.replace(`s3://${process.env.AWS_S3_BUCKET || 'scribe-audio'}/`, '');
    audioPlaybackUrl = await getAudioUrl(key);
  }

  res.json({ ...note, audioPlaybackUrl });
});

router.post('/', upload.single('audio'), async (req: Request, res: Response) => {
  try {
    const file = req.file;
    const parsed = createNoteSchema.safeParse(req.body);

    if (!parsed.success) {
      res.status(400).json({ error: parsed.error.issues[0].message });
      return;
    }

    const { patientId, text } = parsed.data;

    if (!text && !file) {
      res.status(400).json({ error: 'Either text or audio file is required' });
      return;
    }

    const patient = await prisma.patient.findUnique({ where: { id: patientId } });
    if (!patient) {
      res.status(404).json({ error: 'Patient not found' });
      return;
    }

    let inputType = 'text';
    let rawText = text || null;
    let audioUrl = null;
    let transcription = null;

    if (file) {
      const fileValidation = audioFileSchema.safeParse({
        mimetype: file.mimetype,
        size: file.size,
      });

      if (!fileValidation.success) {
        fs.unlinkSync(file.path);
        res.status(400).json({ error: fileValidation.error.issues[0].message });
        return;
      }

      inputType = 'audio';

      const fileBuffer = fs.readFileSync(file.path);
      const s3Key = `${patientId}/${file.filename}`;
      audioUrl = await uploadAudio(s3Key, fileBuffer, file.mimetype);

      transcription = await transcribeAudio(file.path);
      rawText = transcription;

      fs.unlinkSync(file.path);
    }

    const summary = await generateSoapNote(rawText!);

    const note = await prisma.note.create({
      data: {
        patientId,
        inputType,
        rawText,
        audioUrl,
        transcription,
        summary,
      },
      include: { patient: true },
    });

    res.status(201).json(note);
  } catch (error) {
    console.error('Error creating note:', error);
    res.status(500).json({ error: 'Failed to create note' });
  }
});

export default router;
