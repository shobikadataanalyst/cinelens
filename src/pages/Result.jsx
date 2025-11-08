
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { api } from '../lib_api';
import AnalysisCard from '../components/AnalysisCard';

export default function Result() {
  const { id } = useParams();
  const [a, setA] = useState(null);
  const [comments, setComments] = useState([]);
  const [text, setText] = useState('');

  useEffect(() => { (async () => {
    const { data } = await api.get(`/results/${id}`); setA(data);
    const cs = await api.get(`/results/${id}/comments`); setComments(cs.data);
  })(); }, [id]);

  const post = async () => {
    if (!text.trim()) return;
    await api.post(`/results/${id}/comments`, { text });
    setText('');
    const cs = await api.get(`/results/${id}/comments`); setComments(cs.data);
  };

  if (!a) return <div>Loading…</div>;

  return (
    <div className="space-y-6">
      <AnalysisCard a={a} />
      <div className="card">
        <h3 className="text-xl font-bold mb-3">Comments</h3>
        <div className="space-y-3">
          {comments.map(c => (
            <div key={c._id} className="border border-white/10 rounded-xl p-3">
              <div className="text-sm opacity-70">{c.user?.name || 'User'} • {new Date(c.createdAt).toLocaleString()}</div>
              <div>{c.text}</div>
            </div>
          ))}
        </div>
        <div className="mt-4 flex gap-2">
          <input className="input flex-1" placeholder="Add a comment…" value={text} onChange={e=>setText(e.target.value)} />
          <button className="btn" onClick={post}>Post</button>
        </div>
      </div>
    </div>
  );
}
