import axios from 'axios';
import { Patient, Note } from '../types';

const api = axios.create({
  baseURL: '/api',
});

export async function getPatients(): Promise<Patient[]> {
  const { data } = await api.get('/patients');
  return data;
}

export async function getPatient(id: string): Promise<Patient> {
  const { data } = await api.get(`/patients/${id}`);
  return data;
}

export async function getNotes(): Promise<Note[]> {
  const { data } = await api.get('/notes');
  return data;
}

export async function getNote(id: string): Promise<Note> {
  const { data } = await api.get(`/notes/${id}`);
  return data;
}

export async function createNote(patientId: string, text?: string, audio?: File): Promise<Note> {
  const formData = new FormData();
  formData.append('patientId', patientId);

  if (text) {
    formData.append('text', text);
  }

  if (audio) {
    formData.append('audio', audio);
  }

  const { data } = await api.post('/notes', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data;
}
