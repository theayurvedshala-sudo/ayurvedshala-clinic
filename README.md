# Ayurvedshala Clinical ERP — MERN + Cloudinary

This project is a React/Express/MongoDB recreation of the supplied `index.php` Ayurvedic clinic ERP. The PHP application is treated as the workflow reference: dark ERP navigation, dashboard, patient directory/profile, NABH case paper, single and combination prescriptions, OPD/appointments, investigation worklist, inventory, billing/payments, reports, staff, master data, activity logs, settings, NABH print and invoice print.

Media storage is moved from PHP's local `uploads/` folders to **Cloudinary** so patient photos, patient documents, investigation reports, medicine images and clinic branding persist when the app is deployed to Vercel.

## Main modules

- Login + JWT authentication with role-based access
- Dashboard with operational metrics, revenue trend, low-stock and follow-ups
- Patient registration and full patient profile
- Patient photo, document and investigation uploads through Cloudinary
- NABH/Ayurvedic case paper fields from the PHP system
- Single medicine prescriptions
- Combination prescriptions
- Keyboard-first medicine entry
- Unknown medicine auto-create in Master Inventory at quantity `0`
- Medicine inventory, batches, expiry, purchase/selling price, low-stock threshold and image
- Appointments and Today's OPD
- Investigation worklist and review statuses
- Billing, paid/partial/pending status and additional payments
- A4 NABH case-paper print
- Invoice print
- Reports and analytics
- Staff/user management
- Master-data values and CSV import
- Activity log
- Clinic settings and Cloudinary clinic logo
- Local MongoDB or MongoDB Atlas
- Vercel-ready API structure

## Requirements

- Node.js 20.19+ or a current Node.js LTS/current release
- npm
- MongoDB Community for local database **or** MongoDB Atlas
- Cloudinary account for media uploads

## 1. Install

```bash
npm install
```

Copy the example environment file:

Windows CMD:

```bat
copy .env.example .env
```

PowerShell:

```powershell
Copy-Item .env.example .env
```

## 2. Database configuration

### Local MongoDB

```env
DB_MODE=local
MONGODB_URI_LOCAL=mongodb://127.0.0.1:27017/ayurvedic_clinic
```

### MongoDB Atlas

```env
DB_MODE=cloud
MONGODB_URI_CLOUD=mongodb+srv://DB_USER:DB_PASSWORD@YOUR_CLUSTER.mongodb.net/ayurvedic_clinic
```

If Atlas `mongodb+srv://` DNS is blocked on your network, use the standard `mongodb://` URI supplied by Atlas instead.

## 3. JWT secret

Generate a random secret:

```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

Put it in `.env`:

```env
JWT_SECRET=PASTE_THE_GENERATED_VALUE_HERE
JWT_EXPIRES_IN=30m
```

Never put `JWT_SECRET` in a `VITE_` variable or frontend source code.

## 4. Cloudinary configuration

In Cloudinary, copy the **Cloud name**, **API Key**, and **API Secret** from your account/product environment configuration and put them only in the server environment:

```env
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
CLOUDINARY_FOLDER=ayurvedshala-clinic
CLOUDINARY_PATIENT_MEDIA_TYPE=upload
```

`CLOUDINARY_API_SECRET` must never be exposed to React or committed to Git.

The app stores Cloudinary `secure_url`, `public_id`, resource type and delivery type in MongoDB. When supported media records are deleted/replaced in the ERP, the backend also calls Cloudinary to remove the cloud asset.

### Media folders

Uploads are organized under the base folder, for example:

```text
ayurvedshala-clinic/
  branding/
  patients/<patient-id>/photo/
  patients/<patient-id>/documents/
  patients/<patient-id>/investigations/
  medicines/
```

The default `CLOUDINARY_PATIENT_MEDIA_TYPE=upload` gives the closest behavior to the original PHP application's directly accessible upload URLs. For sensitive real clinical data, review your Cloudinary access controls, signed/private delivery requirements, retention policy and applicable privacy/regulatory obligations before production use.

## 5. Seed the database

```bash
npm run seed
```

Default development login:

```text
Email: admin@clinic.com
Password: admin123
```

Change this password before real use.

The seed includes the broader Ayurvedic master-data values from the PHP system: Prakriti, Vikriti, Nadi, Agni, Mala, Mutra, Jivha, Shabda, Sparsha, Druk, Akruti, Sara, Samhanana, Pramana, Satmya, Sattva, Vyayama Shakti, dosage, duration and diagnostic values.

## 6. Run locally

```bash
npm run dev
```

Open:

```text
http://localhost:5173
```

### Same-Wi-Fi / LAN access

Keep `ALLOW_LAN=true` in the local `.env`, then run:

```bash
npm run dev:lan
```

Vite will print a **Network** URL such as `http://192.168.1.25:5173`. Open that URL on phones/tablets connected to the same Wi-Fi. Allow Node.js through Windows Defender Firewall on Private networks if Windows asks.

API:

```text
http://localhost:5000/api
```

Health endpoint after login:

```text
/api/health
```

## Prescription keyboard workflow

Normal medicines:

1. Type a medicine name.
2. Press **Enter**.
3. Existing medicine is selected, or an unknown medicine is created in inventory with stock `0`.
4. The next medicine row is created/focused automatically.

Combinations:

1. Choose **Combination** / add a combination.
2. Type the first ingredient and press **Enter**.
3. The next ingredient row opens automatically.
4. On an empty ingredient field, press **Enter twice** to finish the combination and return to normal medicine entry.

Out-of-stock medicines remain writable/prescribable. Inventory stock is clamped at zero rather than becoming negative. Received quantity can later be updated from Inventory.

## Production / Vercel

Push the project to GitHub and import it into Vercel. Add these environment variables in **Vercel → Project → Settings → Environment Variables**:

```env
DB_MODE=cloud
MONGODB_URI_CLOUD=your_atlas_uri
JWT_SECRET=your_production_jwt_secret
JWT_EXPIRES_IN=30m
CLIENT_URL=https://your-domain.vercel.app
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
CLOUDINARY_FOLDER=ayurvedshala-clinic
CLOUDINARY_PATIENT_MEDIA_TYPE=upload
```

Do not add `MONGODB_URI_LOCAL` for Vercel.

## Validation commands

```bash
npm run check
npm run build
```

`npm run check` syntax-checks the Node/API source. `npm run build` compiles the React app with Vite.

## Project structure

```text
src/                 React UI
src/pages/           PHP-parity screens
src/components/      ERP shell and reusable UI
server/              Express application
server/routes/       API routes
server/models/       Mongoose models
server/config/       MongoDB + Cloudinary configuration
server/middleware/   Auth + in-memory upload validation
server/utils/        Cloudinary upload/delete + activity logging
api/index.js         Vercel serverless entry
```

## Important production note

This is clinic-management software and can contain health information. The code provides application authentication and cloud-media wiring, but production compliance depends on your hosting, Cloudinary plan/configuration, MongoDB configuration, access policies, backups, audit controls, data-processing agreements and the laws/regulations that apply to your clinic. Perform a security/privacy review before storing real patient data.
