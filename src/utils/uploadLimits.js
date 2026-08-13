export const SERVERLESS_SAFE_UPLOAD_BYTES = 4 * 1024 * 1024;

export function uploadSizeError(files) {
  if (!import.meta.env.PROD) return '';

  const list = Array.from(files || []).filter(Boolean);
  const total = list.reduce((sum, file) => sum + Number(file.size || 0), 0);

  if (total > SERVERLESS_SAFE_UPLOAD_BYTES) {
    return 'Upload is too large for the hosted version. Keep the complete upload request under 4 MB.';
  }

  return '';
}
