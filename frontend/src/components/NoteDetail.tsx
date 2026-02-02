import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Note } from '../types';
import { getNote } from '../api/client';
import PatientSidebar from './PatientSidebar';

export default function NoteDetail() {
  const { id } = useParams<{ id: string }>();
  const [note, setNote] = useState<Note | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'summary' | 'transcription' | 'raw'>('summary');

  useEffect(() => {
    if (id) {
      getNote(id)
        .then(setNote)
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!note) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Note not found</p>
        <Link to="/" className="text-blue-600 hover:underline mt-2 inline-block">
          Back to notes
        </Link>
      </div>
    );
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    });
  };

  const tabs = [
    { id: 'summary', label: 'SOAP Summary', content: note.summary },
    { id: 'transcription', label: 'Transcription', content: note.transcription },
    { id: 'raw', label: 'Raw Input', content: note.rawText },
  ].filter((tab) => tab.content);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      <div className="lg:col-span-3">
        <div className="mb-4">
          <Link to="/" className="text-blue-600 hover:underline text-sm">
            &larr; Back to notes
          </Link>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg">
          <div className="p-4 border-b border-gray-200">
            <div className="flex justify-between items-start">
              <h1 className="text-xl font-semibold">Clinical Note</h1>
              <span
                className={`text-xs px-2 py-1 rounded ${
                  note.inputType === 'audio'
                    ? 'bg-purple-100 text-purple-700'
                    : 'bg-green-100 text-green-700'
                }`}
              >
                {note.inputType === 'audio' ? 'Audio Input' : 'Text Input'}
              </span>
            </div>
            <p className="text-sm text-gray-500 mt-1">{formatDate(note.createdAt)}</p>
          </div>

          {note.audioPlaybackUrl && (
            <div className="p-4 border-b border-gray-200 bg-gray-50">
              <p className="text-sm text-gray-600 mb-2">Audio Recording</p>
              <audio controls className="w-full">
                <source src={note.audioPlaybackUrl} />
                Your browser does not support audio playback.
              </audio>
            </div>
          )}

          {tabs.length > 1 && (
            <div className="border-b border-gray-200">
              <div className="flex">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as typeof activeTab)}
                    className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                      activeTab === tab.id
                        ? 'border-blue-600 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="p-6">
            <div className="prose max-w-none whitespace-pre-wrap">
              {tabs.find((t) => t.id === activeTab)?.content ||
                note.summary ||
                note.transcription ||
                note.rawText}
            </div>
          </div>
        </div>
      </div>

      <div className="lg:col-span-1">
        <PatientSidebar patient={note.patient} />
      </div>
    </div>
  );
}
