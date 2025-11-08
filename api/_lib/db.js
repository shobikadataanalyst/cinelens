
import mongoose from 'mongoose';

let conn = global._mongooseConn;

export async function connectDB(uri) {
  if (conn) return conn;
  if (!uri) throw new Error('Missing MONGODB_URI');
  conn = mongoose.createConnection(uri);
  // Avoid recompiling models on hot paths
  global._mongooseConn = conn;
  return conn;
}
