import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { protect } from '../middleware/auth.js';
import { logActivity } from '../utils/logActivity.js';

const r = Router();

r.post('/login', async (req, res) => {
  const email = String(req.body?.email || '').trim().toLowerCase();
  const password = String(req.body?.password || '');

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  if (!process.env.JWT_SECRET) {
    console.error('[auth] JWT_SECRET is not configured');
    return res.status(500).json({ message: 'Server authentication is not configured' });
  }

  const user = await User.findOne({ email }).select('+password');
  const validPassword = user
    ? await bcrypt.compare(password, user.password)
    : false;

  if (!user || !user.isActive || !validPassword) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  user.lastLoginAt = new Date();
  await user.save();

  const token = jwt.sign(
    { id: user._id },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '30m' }
  );

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

r.get('/me', protect, (req, res) => res.json(req.user));

export default r;
