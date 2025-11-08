export const config = { runtime: 'nodejs18.x' };

import 'dotenv/config';
import { connectDB } from './_lib/db.js';
import AnalysisModel from './_lib/Analysis.js';
import CommentModel from './_lib/Comment.js';
import { requireAuth } from './_lib/auth.js';

export default async function handler(req, res) {
  res.setHeader('Content-Type', 'application/json');
  const url = new URL(req.url, 'http://localhost');
  const parts = url.pathname.split('/');
  const last = parts.pop(); // 'results' or 'comments' or id

  const conn = await connectDB(process.env.MONGODB_URI);
  const Analysis = AnalysisModel(conn);
  const Comment = CommentModel(conn);

  // GET /api/results
  if (req.method === 'GET' && last === 'results') {
    const q = await Analysis.find().sort({ createdAt: -1 }).limit(100);
    return res.end(JSON.stringify(q));
  }

  // Dynamic by id
  const id = parts.pop();

  if (req.method === 'GET' && last === id) {
    const a = await Analysis.findById(id);
    return res.end(JSON.stringify(a));
  }

  if (req.method === 'GET' && last === 'comments') {
    const c = await Comment.find({ analysis: id }).populate('user', 'name');
    return res.end(JSON.stringify(c));
  }

  if (req.method === 'POST' && last === 'comments') {
    const user = requireAuth(req, res);
    if (!user) return;
    let body = '';
    for await (const chunk of req) body += chunk;
    const { text } = JSON.parse(body||'{}');
    const c = await Comment.create({ analysis: id, user: user.id, text });
    return res.end(JSON.stringify(c));
  }

  res.statusCode = 404;
  res.end(JSON.stringify({ message: 'Not found' }));
}
