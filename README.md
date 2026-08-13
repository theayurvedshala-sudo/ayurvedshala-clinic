# Ayurvedshala Clinical ERP — Vercel + MERN + Cloudinary

This edition is prepared to run as one Vercel project with a React/Vite frontend and an Express API.

## Production architecture

- React + Vite frontend
- Express API through `api/index.js` as a Vercel Function
- MongoDB Atlas database
- Cloudinary durable media storage
- JWT authentication
- Relative browser API base: `/api`
- React Router SPA fallback through `vercel.json`

No production URL, `localhost`, LAN IP, database password or Cloudinary secret is hard-coded in the frontend.

## Deploy to Vercel

Read `VERCEL-DEPLOYMENT-GUIDE.md`.

Required Vercel environment variables:

```env
DB_MODE=cloud
MONGODB_URI_CLOUD=mongodb+srv://...
JWT_SECRET=your_long_random_secret
JWT_EXPIRES_IN=30m
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
CLOUDINARY_FOLDER=ayurvedshala-clinic
CLOUDINARY_PATIENT_MEDIA_TYPE=upload
ALLOW_LAN=false
```

After deployment, test:

```text
https://YOUR-PROJECT.vercel.app/api/health
```

Then open the main deployment URL and sign in.

## Seed MongoDB Atlas once

Set a local `.env` to the Atlas database and run:

```bash
npm install
npm run seed
```

Default seed administrator:

```text
admin@clinic.com
admin123
```

Change the password immediately after first production login.

## Local / same-Wi-Fi development

Copy `.env.local.example` to `.env`, configure a strong `JWT_SECRET`, then:

```bash
npm install
npm run seed
npm run dev
```

PC:

```text
http://localhost:5173
```

Phone/tablet on the same Wi-Fi: use the `Network:` URL printed by Vite.

The frontend always calls relative `/api/...` routes. Vite proxies them to the local Express process, so no fixed LAN IP is required in React.

Media upload features use Cloudinary in both hosted and local development. Add Cloudinary credentials to local `.env` if you need those features locally.

## Vercel upload-size constraint

Vercel Functions currently limit request and response payloads to 4.5 MB. The hosted UI/server therefore enforce a safe upload threshold around 4 MB. For larger documents, use a direct-to-storage upload architecture rather than sending the file through the Vercel Function.

## Validation

```bash
npm run check
npm run build
```

or:

```bash
npm run deploy:check
```

## Privacy/security

This software can store sensitive clinical information. Before real clinical use, review MongoDB Atlas access, Cloudinary access/delivery settings, user roles, password policy, backups, audit logs, retention and applicable healthcare/privacy requirements.
