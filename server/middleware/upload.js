import multer from 'multer';

const allowed = new Set([
  'image/jpeg','image/png','image/webp','application/pdf','application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document','text/csv','application/csv','text/plain'
]);
export const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 20 * 1024 * 1024, files: 30 },
  fileFilter(req, file, cb) { allowed.has(file.mimetype) ? cb(null, true) : cb(new Error(`Unsupported file type: ${file.mimetype}`)); }
});
export const imageUpload = multer({
  storage: multer.memoryStorage(), limits: { fileSize: 8 * 1024 * 1024 },
  fileFilter(req, file, cb) { /^image\/(jpeg|png|webp)$/.test(file.mimetype) ? cb(null, true) : cb(new Error('Only JPG, PNG and WEBP images are allowed')); }
});
