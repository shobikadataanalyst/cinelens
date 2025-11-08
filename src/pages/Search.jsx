
import { useState } from 'react';
import { api } from '../lib_api';
import MovieCard from '../components/MovieCard';

export default function Search() {
  const [q, setQ] = useState('');
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  const search = async () => {
    setLoading(true);
    const { data } = await api.get('/movies/search', { params: { q } });
    setItems(data.results || []);
    setLoading(false);
  };

  const analyze = async (m) => {
    const year = (m.release_date || '').slice(0,4);
    const payload = { title: m.title, year: year ? Number(year) : undefined, plot: m.overview };
    const { data } = await api.post('/analyze/tmdb', payload);
    window.location.href = `/result/${data._id}`;
  };

  return (
    <div className="space-y-4">
      <div className="card flex gap-3">
        <input className="input" value={q} onChange={e=>setQ(e.target.value)} placeholder="Search a movie title…" />
        <button className="btn" onClick={search} disabled={loading}>{loading? 'Searching…' : 'Search'}</button>
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        {items.map(m => <MovieCard key={m.id} m={m} onAnalyze={analyze} />)}
      </div>
    </div>
  );
}
