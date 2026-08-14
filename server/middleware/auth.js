import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const COOKIE_NAME = process.env.AUTH_COOKIE_NAME || 'clinic_session';

function getCookie(req, name) {
  const raw = req.headers.cookie || '';
  for (const part of raw.split(';')) {
    const item = part.trim();
    if (!item) continue;
    const eq = item.indexOf('=');
    const key = eq >= 0 ? item.slice(0, eq) : item;
    if (key !== name) continue;
    const value = eq >= 0 ? item.slice(eq + 1) : '';
    try { return decodeURIComponent(value); } catch { return value; }
  }
  return null;
}

export async function protect(req, res, next) {
  try {
    const authorization = req.headers.authorization || '';
    const bearerToken = authorization.startsWith('Bearer ')
      ? authorization.slice(7).trim()
      : null;
    const cookieToken = getCookie(req, COOKIE_NAME);
    const token = bearerToken || cookieToken;

    if (!token) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    if (!process.env.JWT_SECRET) {
      console.error('[auth] JWT_SECRET is missing at runtime');
      return res.status(500).json({ message: 'Server authentication is not configured' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');

    if (!user || user.isActive === false) {
      return res.status(401).json({ message: 'Account unavailable' });
    }

    req.user = user;
    req.authSource = bearerToken ? 'bearer' : 'cookie';
    next();
  } catch (error) {
    console.error('[auth] token verification failed:', error?.name || error?.message || error);
    return res.status(401).json({ message: 'Invalid or expired session' });
  }
}

export const allow = (...roles) => (req, res, next) =>
  roles.includes(req.user.role)
    ? next()
    : res.status(403).json({ message: 'You do not have permission for this action' });
