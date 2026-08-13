# Existing Local Data → Vercel Migration Notes

A Vercel deployment cannot connect to the MongoDB process running only on your clinic PC (`127.0.0.1`) and cannot persist your old local `uploads/` directory.

## MongoDB records

If this is a fresh deployment, configure MongoDB Atlas and run `npm run seed` once.

If you already have real local records, migrate your local `ayurvedic_clinic` database to MongoDB Atlas before production use. The safest standard approach is to use MongoDB Database Tools (`mongodump` and `mongorestore`) or MongoDB Compass export/import, then verify record counts and relationships before switching users to the hosted system.

Do not run a destructive import over a production database without a backup.

## Existing local uploaded files

The previous LAN/local-storage edition stored media in `uploads/` and database fields could contain `/api/uploads/...` URLs. Those URLs are not valid durable production storage on Vercel.

For old patient photos, documents, investigation reports, medicine images and the clinic logo, either:

1. re-upload them through the Vercel-hosted application after Cloudinary is configured, or
2. perform a controlled migration that uploads the files to Cloudinary and updates the corresponding MongoDB records with the returned Cloudinary URLs/public IDs.

Keep your old local database and `uploads/` backup until every migrated patient/document/media record has been verified.
