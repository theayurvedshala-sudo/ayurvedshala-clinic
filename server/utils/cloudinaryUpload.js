import { cloudinary, cloudinaryConfigured } from '../config/cloudinary.js';

export function uploadBuffer(buffer, options = {}) {
  if (!cloudinaryConfigured()) throw new Error('Cloudinary is not configured. Add CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY and CLOUDINARY_API_SECRET to .env.');
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream({ resource_type: 'auto', ...options }, (error, result) => {
      if (error) reject(error); else resolve(result);
    });
    stream.end(buffer);
  });
}

export async function deleteCloudinaryAsset(publicId, resourceType = 'image', deliveryType = 'upload') {
  if (!publicId || !cloudinaryConfigured()) return;
  try {
    await cloudinary.uploader.destroy(publicId, { resource_type: resourceType || 'image', type: deliveryType || 'upload', invalidate: true });
  } catch (error) {
    console.warn('[cloudinary] delete failed:', error.message);
  }
}
