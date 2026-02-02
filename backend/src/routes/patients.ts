import { Router, Request, Response } from 'express';
import { prisma } from '../lib/db';
import { idParamSchema } from '../lib/validation';

const router = Router();

router.get('/', async (req: Request, res: Response) => {
  const patients = await prisma.patient.findMany({
    orderBy: { name: 'asc' },
  });
  res.json(patients);
});

router.get('/:id', async (req: Request, res: Response) => {
  const parsed = idParamSchema.safeParse({ id: req.params.id });

  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.issues[0].message });
    return;
  }

  const patient = await prisma.patient.findUnique({
    where: { id: parsed.data.id },
    include: { notes: { orderBy: { createdAt: 'desc' } } },
  });

  if (!patient) {
    res.status(404).json({ error: 'Patient not found' });
    return;
  }

  res.json(patient);
});

export default router;
