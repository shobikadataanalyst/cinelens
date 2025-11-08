export const config = { runtime: 'nodejs18.x' };

import 'dotenv/config';
import { connectDB } from './_lib/db.js';
import UserModel from './_lib/User.js';
import { signToken } from './_lib/auth.js';

export default async function handler(req, res) {
  res.setHeader('Content-Type', 'application/json');
  const url = new URL(req.url, 'http://localhost');
  const path = url.pathname.split('/').pop(); // signup or login

  const conn = await connectDB(process.env.MONGODB_URI);
  const User = UserModel(conn);

  if (req.method === 'POST' && path === 'signup') {
    let body = '';
    for await (const chunk of req) body += chunk;
    const { name, email, password } = JSON.parse(body||'{}');
    const exists = await User.findOne({ email });
    if (exists) { res.statusCode=400; return res.end(JSON.stringify({ message: 'Email already registered' })); }
    const user = await User.create({ name, email, password });
    const token = signToken(user._id.toString());
    return res.end(JSON.stringify({ token, user: { id: user._id, name: user.name, email: user.email } }));
  }

  if (req.method === 'POST' && path === 'login') {
    let body = '';
    for await (const chunk of req) body += chunk;
    const { email, password } = JSON.parse(body||'{}');
    const user = await User.findOne({ email });
    if (!user) { res.statusCode=400; return res.end(JSON.stringify({ message: 'Invalid credentials' })); }
    const ok = await user.comparePassword(password);
    if (!ok) { res.statusCode=400; return res.end(JSON.stringify({ message: 'Invalid credentials' })); }
    const token = signToken(user._id.toString());
    return res.end(JSON.stringify({ token, user: { id: user._id, name: user.name, email: user.email } }));
  }

  res.statusCode = 404;
  res.end(JSON.stringify({ message: 'Not found' }));
}
