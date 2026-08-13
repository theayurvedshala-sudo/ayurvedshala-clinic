import mongoose from 'mongoose';

const globalCache = globalThis.__ayurvedshalaMongo || {
  connection: null,
  promise: null,
};
globalThis.__ayurvedshalaMongo = globalCache;

function resolveMongoUri() {
  const isVercel = Boolean(process.env.VERCEL);
  const mode = String(process.env.DB_MODE || (isVercel ? 'cloud' : 'local')).toLowerCase();

  if (isVercel || mode === 'cloud') {
    const uri = process.env.MONGODB_URI_CLOUD || process.env.MONGODB_URI;
    if (!uri) {
      throw new Error('MongoDB Atlas URI is missing. Set MONGODB_URI_CLOUD (or MONGODB_URI) in Vercel Environment Variables.');
    }
    return { uri, mode: 'cloud' };
  }

  return {
    uri: process.env.MONGODB_URI_LOCAL || process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/ayurvedic_clinic',
    mode: 'local',
  };
}

export async function connectDB() {
  if (mongoose.connection.readyState === 1) return mongoose;
  if (globalCache.connection) return globalCache.connection;

  const { uri, mode } = resolveMongoUri();

  if (!globalCache.promise) {
    globalCache.promise = mongoose.connect(uri, {
      serverSelectionTimeoutMS: 10000,
      maxPoolSize: 10,
      minPoolSize: 0,
      maxIdleTimeMS: 30000,
    }).then((conn) => {
      console.log(`[db] ${mode.toUpperCase()} -> ${conn.connection.host}/${conn.connection.name}`);
      return conn;
    }).catch((error) => {
      globalCache.promise = null;
      throw error;
    });
  }

  globalCache.connection = await globalCache.promise;
  return globalCache.connection;
}

export default connectDB;
