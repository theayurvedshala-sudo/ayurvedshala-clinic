import mongoose from 'mongoose';

export async function connectDB() {
  const mode = String(process.env.DB_MODE || 'local').toLowerCase();
  const uri = mode === 'cloud'
    ? (process.env.MONGODB_URI_CLOUD || process.env.MONGODB_URI)
    : (process.env.MONGODB_URI_LOCAL || process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/ayurvedic_clinic');
  if (!uri) throw new Error(`MongoDB URI is missing for DB_MODE=${mode}`);
  const conn = await mongoose.connect(uri, { serverSelectionTimeoutMS: 10000 });
  console.log(`[db] ${mode.toUpperCase()} -> ${conn.connection.host}/${conn.connection.name}`);
  return conn;
}
export default connectDB;
