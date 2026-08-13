# Ayurvedshala Clinical ERP — Vercel Deployment

This edition is prepared for a single Vercel project containing the Vite/React frontend and Express API.

## Architecture

- Frontend: React + Vite, built to `dist/`
- API: Express exported from `api/index.js` as a Vercel Function
- Database: MongoDB Atlas
- Media: Cloudinary (patient photos/documents/reports, medicine images, clinic logo)
- Browser API base: `/api` (same origin; no localhost/IP hard-coding)

## 1. MongoDB Atlas

Create an Atlas cluster and database user. Copy the Atlas connection string. For Vercel Functions, configure Atlas network access so the deployment can connect. If you do not use a fixed egress solution, the common simple setup is Atlas Network Access `0.0.0.0/0` together with a strong database username/password and least-privilege database user.

## 2. Cloudinary

Create a Cloudinary product environment and copy Cloud name, API key, and API secret.

## 3. Push this project to GitHub

Push the folder that directly contains `package.json`, `vercel.json`, `api/`, `server/`, and `src/`.

Do not commit a real `.env` file.

## 4. Import into Vercel

In Vercel, create a new project from that GitHub repository. The project root must be the directory containing both `src/` and `api/`.

Framework preset: Vite (auto-detection is fine)

Build command: `npm run build`

Output directory: `dist`

The included `vercel.json` already contains the API and SPA rewrites.

## 5. Add Vercel Environment Variables

Add these for Production and Preview as appropriate:

```env
DB_MODE=cloud
MONGODB_URI_CLOUD=mongodb+srv://...
JWT_SECRET=YOUR_LONG_RANDOM_SECRET
JWT_EXPIRES_IN=30m
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
CLOUDINARY_FOLDER=ayurvedshala-clinic
CLOUDINARY_PATIENT_MEDIA_TYPE=upload
ALLOW_LAN=false
```

`CLIENT_URL` is optional when frontend and API are in this same Vercel project. If you later use a separate frontend/custom origin, add its full `https://` URL.

## 6. Seed Atlas once

On your computer, create a temporary local `.env` using the production Atlas values, especially `DB_MODE=cloud`, `MONGODB_URI_CLOUD`, and `JWT_SECRET`, then run:

```bash
npm install
npm run seed
```

Default development account created by the seed:

- Email: `admin@clinic.com`
- Password: `admin123`

Change the password immediately after the first production login.

Do not repeatedly run seed against a live database unless you understand the script behavior.

## 7. Validate before deployment

```bash
npm install
npm run deploy:check
```

## 8. Validate after deployment

Open:

```text
https://YOUR-PROJECT.vercel.app/api/health
```

Expected key values:

```json
{
  "ok": true,
  "database": true,
  "storage": "cloudinary",
  "cloudinary": true,
  "uploadsReady": true,
  "environment": "vercel"
}
```

Then open the root site URL and test login, patients, billing, inventory, settings, and uploads.

## Upload limit on Vercel

Vercel Functions have a 4.5 MB request/response payload limit. This edition caps individual multipart uploads at 4 MB in Vercel. Keep an entire multi-file upload request below that limit as well. For larger clinical documents, use a direct-to-storage upload flow rather than proxying the file through the Vercel Function.

## Important privacy note

This application can contain patient health information. Before using real patient data, review access control, MongoDB Atlas security, Cloudinary delivery/access settings, backups, audit requirements, data retention, and applicable healthcare/privacy laws. Public Cloudinary delivery is convenient but may be inappropriate for sensitive clinical documents; use an authenticated/private media design where required.
