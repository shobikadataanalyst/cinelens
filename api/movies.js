export const config = { runtime: 'nodejs18.x' };

import 'dotenv/config';
import axios from 'axios';

export default async function handler(req, res) {
  res.setHeader('Content-Type', 'application/json');
  const url = new URL(req.url, 'http://localhost');
  const path = url.pathname.split('/').pop();

  if (req.method === 'GET' && path === 'search') {
    const q = url.searchParams.get('q') || '';
    if (!q) return res.end(JSON.stringify({ results: [] }));
    try {
      const TMDB_BASE = 'https://api.themoviedb.org/3';
      const { data } = await axios.get(`${TMDB_BASE}/search/movie`, {
        params: { api_key: process.env.TMDB_API_KEY, query: q, include_adult: false }
      });
      return res.end(JSON.stringify(data));
    } catch (e) {
      res.statusCode = 500;
      return res.end(JSON.stringify({ message: 'TMDb search error' }));
    }
  }

  res.statusCode = 404;
  res.end(JSON.stringify({ message: 'Not found' }));
}
