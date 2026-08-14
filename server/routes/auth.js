import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { protect } from '../middleware/auth.js';
import { logActivity } from '../utils/logActivity.js';

const r = Router();
const COOKIE_NAME = process.env.AUTH_COOKIE_NAME || 'clinic_session';

function isSecureRuntime() {
  return Boolean(process.env.VERCEL) ||
    process.env.NODE_ENV === 'production' ||
    process.env.VERCEL_ENV === 'production' ||
    process.env.VERCEL_ENV === 'preview';
}

function cookieOptions() {
  return {
    httpOnly: true,
    secure: isSecureRuntime(),
    sameSite: 'lax',
    path: '/',
    maxAge: Number(process.env.AUTH_COOKIE_MAX_AGE_MS || 30 * 60 * 1000),
  };
}

r.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!process.env.JWT_SECRET) {
    console.error('[auth] JWT_SECRET is missing at runtime');
    return res.status(500).json({ message: 'Server authentication is not configured' });
  }

  const user = await User.findOne({ email: String(email || '').toLowerCase() }).select('+password');
  if (!user || user.isActive === false || !(await bcrypt.compare(String(password || ''), user.password))) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  user.lastLoginAt = new Date();
  await user.save();

  const token = jwt.sign(
    { id: user._id },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '30m' }
  );

  res.cookie(COOKIE_NAME, token, cookieOptions());

  req.user = user;
  await logActivity(req, 'Login', 'user', user._id, 'Successful login');

  return res.json({
    token,
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone,
    },
  });
});

r.get('/me', protect, (req, res) => {
  res.setHeader('Cache-Control', 'no-store');
  return res.json(req.user);
});

r.get('/session-check', protect, (req, res) => {
  res.setHeader('Cache-Control', 'no-store');
  return res.json({
    ok: true,
    authSource: req.authSource || 'unknown',
    user: { _id: req.user._id, name: req.user.name, email: req.user.email, role: req.user.role },
  });
});

r.post('/logout', async (req, res) => {
  res.clearCookie(COOKIE_NAME, {
    httpOnly: true,
    secure: isSecureRuntime(),
    sameSite: 'lax',
    path: '/',
  });
  return res.json({ ok: true });
});

export default r;
