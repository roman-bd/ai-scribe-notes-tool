import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import NoteList from './components/NoteList';
import NoteForm from './components/NoteForm';
import NoteDetail from './components/NoteDetail';

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-100">
        <nav className="bg-white border-b border-gray-200">
          <div className="max-w-6xl mx-auto px-4 py-4">
            <Link to="/" className="text-xl font-semibold text-gray-900">
              AI Scribe
            </Link>
          </div>
        </nav>

        <main className="max-w-6xl mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<NoteList />} />
            <Route path="/notes/new" element={<NoteForm />} />
            <Route path="/notes/:id" element={<NoteDetail />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
