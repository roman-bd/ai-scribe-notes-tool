export interface Patient {
  id: string;
  name: string;
  birthDate: string;
  createdAt: string;
}

export interface Note {
  id: string;
  patientId: string;
  patient: Patient;
  inputType: 'audio' | 'text';
  rawText: string | null;
  audioUrl: string | null;
  transcription: string | null;
  summary: string | null;
  createdAt: string;
  audioPlaybackUrl?: string;
}
