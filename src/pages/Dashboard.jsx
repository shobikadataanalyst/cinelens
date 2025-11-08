
import { useEffect, useState } from 'react';
import { api } from '../lib_api';
import AnalysisCard from '../components/AnalysisCard';

export default function Dashboard() {
  const [items, setItems] = useState([]);
  useEffect(() => { (async () => {
    const { data } = await api.get('/results'); setItems(data);
  })(); }, []);
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Recent Analyses</h2>
      <div className="grid md:grid-cols-2 gap-4">
        {items.map(a => <AnalysisCard key={a._id} a={a} />)}
      </div>
    </div>
  );
}
