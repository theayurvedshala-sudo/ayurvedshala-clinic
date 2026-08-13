import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import connectDB from './config/db.js';
import { cloudinaryConfigured } from './config/cloudinary.js';
import auth from './routes/auth.js';
import users from './routes/users.js';
import patients from './routes/patients.js';
import inventory from './routes/inventory.js';
import appointments from './routes/appointments.js';
import masterData from './routes/masterData.js';
import settings from './routes/settings.js';
import activity from './routes/activity.js';
import dashboard from './routes/dashboard.js';
import billing from './routes/billing.js';
import cases from './routes/cases.js';
import investigations from './routes/investigations.js';
import search from './routes/search.js';
import analytics from './routes/analytics.js';

await connectDB();

const app = express();
app.set('trust proxy', 1);

const configuredOrigins = String(process.env.CLIENT_URL || '')
  .split(',')
  .map((value) => value.trim().replace(/\/$/, ''))
  .filter(Boolean);

const vercelOrigins = [
  process.env.VERCEL_URL,
  process.env.VERCEL_PROJECT_PRODUCTION_URL,
  process.env.VERCEL_BRANCH_URL,
]
  .filter(Boolean)
  .map((host) => `https://${host}`);

const allowedOrigins = new Set([
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  ...configuredOrigins,
  ...vercelOrigins,
]);

const allowLan = String(process.env.ALLOW_LAN || 'false').toLowerCase() === 'true';

function isPrivateLanOrigin(origin = '') {
  try {
    const { hostname } = new URL(origin);
    return hostname === 'localhost'
      || hostname === '127.0.0.1'
      || /^10\./.test(hostname)
      || /^192\.168\./.test(hostname)
      || /^172\.(1[6-9]|2\d|3[01])\./.test(hostname);
  } catch {
    return false;
  }
}

app.use((req, res, next) => {
  const requestHost = req.get('host');
  const sameOrigin = requestHost ? `${req.protocol}://${requestHost}` : '';

  return cors({
    origin(origin, callback) {
      const normalized = String(origin || '').replace(/\/$/, '');
      const allowed = !origin
        || normalized === sameOrigin
        || allowedOrigins.has(normalized)
        || configuredOrigins.includes('*')
        || (allowLan && isPrivateLanOrigin(normalized));

      return allowed
        ? callback(null, true)
        : callback(new Error(`CORS blocked for origin: ${normalized}`));
    },
    credentials: true,
  })(req, res, next);
});

app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true }));

app.get('/api/health', (req, res) => {
  const cloudinary = cloudinaryConfigured();
  res.json({
    ok: true,
    database: true,
    storage: 'cloudinary',
    cloudinary,
    uploadsReady: cloudinary,
    environment: process.env.VERCEL ? 'vercel' : 'local',
    time: new Date().toISOString(),
  });
});

app.use('/api/auth', auth);
app.use('/api/users', users);
app.use('/api/patients', patients);
app.use('/api/inventory', inventory);
app.use('/api/appointments', appointments);
app.use('/api/master-data', masterData);
app.use('/api/settings', settings);
app.use('/api/activity', activity);
app.use('/api/dashboard', dashboard);
app.use('/api/billing', billing);
app.use('/api/cases', cases);
app.use('/api/investigations', investigations);
app.use('/api/search', search);
app.use('/api/analytics', analytics);

app.use((req, res, next) => {
  if (req.path.startsWith('/api/')) {
    return res.status(404).json({ message: `API route not found: ${req.method} ${req.path}` });
  }
  return next();
});

app.use((err, req, res, next) => {
  console.error(err);
  const isMulterLimit = err?.code === 'LIMIT_FILE_SIZE' || err?.code === 'LIMIT_FILE_COUNT';
  res.status(isMulterLimit ? 413 : (err.status || 400)).json({
    message: isMulterLimit
      ? 'Upload is too large for this deployment. On Vercel keep each request below 4 MB.'
      : (err.message || 'Request failed'),
  });
});

export default app;
