# AI Scribe Notes Management Tool

A clinical notes management tool that allows users to create AI-generated notes from text or audio input, associated with patients.

## Features

- Patient management with seeded mock data
- Create clinical notes via text input or audio upload
- Audio transcription using OpenAI Whisper
- SOAP note generation using GPT-4
- Note list view with patient info and previews
- Note detail view with patient sidebar

## Tech Stack

- **Backend**: Node.js, Express, TypeScript, Prisma
- **Frontend**: React, TypeScript, Vite, Tailwind CSS
- **Database**: PostgreSQL
- **Storage**: S3 (LocalStack for local development)
- **AI**: OpenAI (Whisper + GPT-4)

## Prerequisites

- Docker and Docker Compose
- (Optional) OpenAI API key for real transcription/summarization

## Quick Start

1. Clone the repository

2. Copy environment file:
   ```bash
   cp .env.example .env
   ```

3. (Optional) Add your OpenAI API key to `.env` and set `USE_MOCK_AI=false`

4. Start all services:
   ```bash
   docker-compose up --build
   ```

5. Open http://localhost:3000 in your browser

The database will be automatically seeded with 3 mock patients on first run.

## Development

### Running locally without Docker

**Backend:**
```bash
cd backend
cp .env.example .env
npm install
npx prisma generate
npx prisma db push
npm run db:seed
npm run dev
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```

Note: You'll need a PostgreSQL instance running and LocalStack for S3, or modify the configs to use real AWS.

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/patients | List all patients |
| GET | /api/patients/:id | Get patient by ID |
| POST | /api/notes | Create note (multipart form) |
| GET | /api/notes | List all notes |
| GET | /api/notes/:id | Get note details |

### Creating a Note

```bash
# Text note
curl -X POST http://localhost:3000/api/notes \
  -F "patientId=<patient-uuid>" \
  -F "text=Patient presents with symptoms..."

# Audio note
curl -X POST http://localhost:3000/api/notes \
  -F "patientId=<patient-uuid>" \
  -F "audio=@recording.mp3"
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| DATABASE_URL | PostgreSQL connection string | - |
| AWS_ACCESS_KEY_ID | AWS/LocalStack access key | test |
| AWS_SECRET_ACCESS_KEY | AWS/LocalStack secret key | test |
| AWS_REGION | AWS region | us-east-1 |
| AWS_S3_BUCKET | S3 bucket name | scribe-audio |
| S3_ENDPOINT | S3 endpoint (for LocalStack) | - |
| OPENAI_API_KEY | OpenAI API key | - |
| USE_MOCK_AI | Use mock AI responses | true |

## Architecture Decisions

- **Prisma ORM**: Type-safe database access with automatic migrations
- **LocalStack**: S3-compatible storage that runs locally, same code works with real AWS
- **Mock AI Mode**: Allows full testing without OpenAI API costs
- **Monorepo structure**: Separate backend/frontend for clear boundaries while keeping related code together
