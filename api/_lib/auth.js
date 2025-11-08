
import jwt from 'jsonwebtoken';

export function signToken(id) {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });
}

export function requireAuth(req, res) {
  const h = req.headers.authorization || '';
  const token = h.startsWith('Bearer ') ? h.slice(7) : null;
  if (!token) {
    res.statusCode = 401;
    res.end(JSON.stringify({ message: 'Unauthorized' }));
    return null;
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return { id: decoded.id };
  } catch {
    res.statusCode = 401;
    res.end(JSON.stringify({ message: 'Invalid token' }));
    return null;
  }
}
