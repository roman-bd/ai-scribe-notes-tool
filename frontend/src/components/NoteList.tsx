import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Note } from '../types';
import { getNotes } from '../api/client';

export default function NoteList() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getNotes()
      .then(setNotes)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    });
  };

  const getPreview = (note: Note) => {
    const content = note.summary || note.transcription || note.rawText || '';
    return content.slice(0, 150) + (content.length > 150 ? '...' : '');
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Clinical Notes</h1>
        <Link
          to="/notes/new"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          New Note
        </Link>
      </div>

      {notes.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <p>No notes yet.</p>
          <Link to="/notes/new" className="text-blue-600 hover:underline mt-2 inline-block">
            Create your first note
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {notes.map((note) => (
            <Link
              key={note.id}
              to={`/notes/${note.id}`}
              className="block bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start mb-2">
                <div>
                  <span className="font-medium text-gray-900">
                    {note.patient.name}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`text-xs px-2 py-1 rounded ${
                      note.inputType === 'audio'
                        ? 'bg-purple-100 text-purple-700'
                        : 'bg-green-100 text-green-700'
                    }`}
                  >
                    {note.inputType === 'audio' ? 'Audio' : 'Text'}
                  </span>
                  <span className="text-sm text-gray-500">
                    {formatDate(note.createdAt)}
                  </span>
                </div>
              </div>
              <p className="text-gray-600 text-sm">{getPreview(note)}</p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
