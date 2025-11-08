export const config = { runtime: 'nodejs18.x' };

import 'dotenv/config';
import crypto from 'crypto';
import formidable from 'formidable';
import fs from 'fs';
import { OpenAI } from 'openai';
import { connectDB } from './_lib/db.js';
import AnalysisModel from './_lib/Analysis.js';
import { requireAuth } from './_lib/auth.js';
import { bechdelSystem, bechdelUser } from './_lib/bechdelPrompt.js';

export const config = { api: { bodyParser: false } };

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

async function analyzeText(text) {
  const hash = crypto.createHash('sha256').update(text).digest('hex');
  const resp = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      { role: 'system', content: bechdelSystem },
      { role: 'user', content: bechdelUser(text) }
    ],
    response_format: { type: 'json_object' }
  });
  const json = JSON.parse(resp.choices[0].message.content);
  return { json, hash };
}

export default async function handler(req, res) {
  res.setHeader('Content-Type', 'application/json');
  const url = new URL(req.url, 'http://localhost');
  const path = url.pathname.split('/').pop();

  const user = requireAuth(req, res);
  if (!user) return;

  const conn = await connectDB(process.env.MONGODB_URI);
  const Analysis = AnalysisModel(conn);

  if (req.method === 'POST' && path === 'text') {
    let body = '';
    for await (const chunk of req) body += chunk;
    const { title, year, text } = JSON.parse(body||'{}');
    if (!title || !text) { res.statusCode=400; return res.end(JSON.stringify({ message: 'title and text required' })); }
    try {
      const { json, hash } = await analyzeText(text);
      const doc = await Analysis.create({
        user: user.id, title, year, inputType: 'text', textHash: hash,
        result: { pass: !!json.pass, explanation: json.explanation, criteria: json.criteria || {} }
      });
      return res.end(JSON.stringify(doc));
    } catch (e) {
      res.statusCode=500; return res.end(JSON.stringify({ message: 'Analysis failed' }));
    }
  }

  if (req.method === 'POST' && path === 'upload') {
    const form = formidable({ maxFileSize: 5 * 1024 * 1024, multiples: false });
    form.parse(req, async (err, fields, files) => {
      if (err) { res.statusCode=400; return res.end(JSON.stringify({ message: 'Upload parse error' })); }
      const title = (fields.title && fields.title.toString()) || 'Uploaded Script';
      const year = fields.year ? Number(fields.year) : undefined;
      const file = files.file;
      if (!file) { res.statusCode=400; return res.end(JSON.stringify({ message: 'No file' })); }
      try {
        const buffer = await fs.promises.readFile(file.filepath);
        const text = buffer.toString('utf8');
        const { json, hash } = await analyzeText(text);
        const doc = await Analysis.create({
          user: user.id, title, year, inputType: 'upload', textHash: hash,
          result: { pass: !!json.pass, explanation: json.explanation, criteria: json.criteria || {} }
        });
        return res.end(JSON.stringify(doc));
      } catch (e) {
        res.statusCode=500; return res.end(JSON.stringify({ message: 'Upload analysis failed' }));
      }
    });
    return;
  }

  if (req.method === 'POST' && path === 'tmdb') {
    let body = '';
    for await (const chunk of req) body += chunk;
    const { title, year, plot } = JSON.parse(body||'{}');
    if (!title || !plot) { res.statusCode=400; return res.end(JSON.stringify({ message: 'title and plot required' })); }
    try {
      const { json, hash } = await analyzeText(plot);
      const doc = await Analysis.create({
        user: user.id, title, year, inputType: 'tmdb', textHash: hash,
        result: { pass: !!json.pass, explanation: json.explanation, criteria: json.criteria || {} }
      });
      return res.end(JSON.stringify(doc));
    } catch (e) {
      res.statusCode=500; return res.end(JSON.stringify({ message: 'TMDb analysis failed' }));
    }
  }

  res.statusCode = 404;
  res.end(JSON.stringify({ message: 'Not found' }));
}
