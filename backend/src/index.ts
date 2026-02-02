import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { prisma } from './lib/db';
import patientRoutes from './routes/patients';
import noteRoutes from './routes/notes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.use('/api/patients', patientRoutes);
app.use('/api/notes', noteRoutes);

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

async function main() {
  try {
    await prisma.$connect();
    console.log('Database connected');

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

main();
