import app from '../server/app.js';

function rebuildApiUrl(req) {
  const parsed = new URL(req.url || '/', 'http://internal.local');
  const queryObject = req.query && typeof req.query === 'object' ? req.query : {};
  const rawPath = queryObject.__api_path ?? parsed.searchParams.get('__api_path');

  if (rawPath === undefined || rawPath === null) return;

  const path = Array.isArray(rawPath)
    ? rawPath.join('/')
    : String(rawPath || '');

  const query = new URLSearchParams();

  // Prefer the actual URL query string because it is always present after a Vercel rewrite.
  for (const [key, value] of parsed.searchParams.entries()) {
    if (key !== '__api_path') query.append(key, value);
  }

  // Some Vercel runtimes expose merged query values on req.query. Add any that are missing.
  for (const [key, value] of Object.entries(queryObject)) {
    if (key === '__api_path' || query.has(key)) continue;
    if (Array.isArray(value)) {
      value.forEach((item) => query.append(key, String(item)));
    } else if (value !== undefined && value !== null) {
      query.append(key, String(value));
    }
  }

  const suffix = query.toString();
  req.url = `/api${path ? `/${path}` : ''}${suffix ? `?${suffix}` : ''}`;
}

export default function handler(req, res) {
  rebuildApiUrl(req);
  return app(req, res);
}
