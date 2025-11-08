
import { useEffect, useState } from 'react';
import { api } from '../lib_api';
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts';

export default function Stats() {
  const [data, setData] = useState([]);
  useEffect(() => { (async () => {
    const { data } = await api.get('/stats/yearly'); setData(data);
  })(); }, []);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Yearly Bechdel Pass Rate</h2>
      <div className="card">
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 20, right: 20, bottom: 20, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="year" />
              <YAxis domain={[0, 100]} tickFormatter={(v)=>v+"%"} />
              <Tooltip formatter={(v, n)=> n==='passRate' ? v+"%" : v} />
              <Line type="monotone" dataKey="passRate" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
