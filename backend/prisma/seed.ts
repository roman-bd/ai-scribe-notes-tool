import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const patients = [
  {
    name: 'John Martinez',
    birthDate: new Date('1985-03-15'),
  },
  {
    name: 'Sarah Johnson',
    birthDate: new Date('1972-08-22'),
  },
  {
    name: 'Michael Chen',
    birthDate: new Date('1990-11-08'),
  },
];

async function main() {
  console.log('Seeding database...');

  for (const patient of patients) {
    const existing = await prisma.patient.findFirst({
      where: { name: patient.name },
    });

    if (!existing) {
      await prisma.patient.create({ data: patient });
      console.log(`Created patient: ${patient.name}`);
    } else {
      console.log(`Patient ${patient.name} already exists`);
    }
  }

  console.log('Seeding complete');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
