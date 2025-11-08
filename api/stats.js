export const config = { runtime: 'nodejs18.x' };

import 'dotenv/config';
import { connectDB } from './_lib/db.js';
import AnalysisModel from './_lib/Analysis.js';

export default async function handler(req, res) {
  res.setHeader('Content-Type', 'application/json');
  const url = new URL(req.url, 'http://localhost');
  const last = url.pathname.split('/').pop();

  if (req.method === 'GET' && last === 'yearly') {
    const conn = await connectDB(process.env.MONGODB_URI);
    const Analysis = AnalysisModel(conn);
    const agg = await Analysis.aggregate([
      { $group: { _id: '$year', total: { $sum: 1 }, pass: { $sum: { $cond: ['$result.pass', 1, 0] } } } },
      { $sort: { _id: 1 } }
    ]);
    const formatted = agg.map(r => ({ year: r._id, total: r.total, pass: r.pass, passRate: r.total ? Math.round((r.pass / r.total)*100) : 0 }));
    return res.end(JSON.stringify(formatted));
  }

  res.statusCode = 404;
  res.end(JSON.stringify({ message: 'Not found' }));
}
