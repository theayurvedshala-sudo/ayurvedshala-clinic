import multer from 'multer';

const allowed = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'text/csv',
  'application/csv',
  'text/plain',
]);

const isVercel = Boolean(process.env.VERCEL);
const regularFileLimit = isVercel ? 4 * 1024 * 1024 : 20 * 1024 * 1024;
const imageFileLimit = isVercel ? 4 * 1024 * 1024 : 8 * 1024 * 1024;

export const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: regularFileLimit,
    files: 30,
  },
  fileFilter(req, file, cb) {
    allowed.has(file.mimetype)
      ? cb(null, true)
      : cb(new Error(`Unsupported file type: ${file.mimetype}`));
  },
});

export const imageUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: imageFileLimit },
  fileFilter(req, file, cb) {
    /^image\/(jpeg|png|webp)$/.test(file.mimetype)
      ? cb(null, true)
      : cb(new Error('Only JPG, PNG and WEBP images are allowed'));
  },
});
