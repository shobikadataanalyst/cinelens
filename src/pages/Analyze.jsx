
import { useState } from 'react';
import { api } from '../lib_api';

export default function Analyze() {
  const [title, setTitle] = useState('');
  const [year, setYear] = useState('');
  const [text, setText] = useState('');
  const [file, setFile] = useState(null);

  const submitText = async () => {
    const { data } = await api.post('/analyze/text', { title, year: year? Number(year) : undefined, text });
    window.location.href = `/result/${data._id}`;
  };

  const submitFile = async () => {
    const form = new FormData();
    form.append('title', title);
    if (year) form.append('year', Number(year));
    form.append('file', file);
    const { data } = await api.post('/analyze/upload', form, { headers: { 'Content-Type': 'multipart/form-data' } });
    window.location.href = `/result/${data._id}`;
  };

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <div className="card space-y-3">
        <h2 className="text-2xl font-bold">Paste Script / Plot</h2>
        <input className="input" placeholder="Title" value={title} onChange={e=>setTitle(e.target.value)} />
        <input className="input" placeholder="Year (optional)" value={year} onChange={e=>setYear(e.target.value)} />
        <textarea className="input h-60" placeholder="Paste script or plot…" value={text} onChange={e=>setText(e.target.value)} />
        <button className="btn" onClick={submitText} disabled={!title || !text}>Analyze Text</button>
      </div>
      <div className="card space-y-3">
        <h2 className="text-2xl font-bold">Upload .txt Script</h2>
        <input type="file" accept=".txt" onChange={e=>setFile(e.target.files?.[0])} className="input" />
        <button className="btn" onClick={submitFile} disabled={!title || !file}>Analyze File</button>
      </div>
    </div>
  );
}
