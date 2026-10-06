import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadsDir = path.join(__dirname, '..', 'uploads');

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Check if Cloudinary is fully configured with non-empty credentials
const isCloudinaryConfigured = Boolean(
  process.env.CLOUDINARY_CLOUD_NAME &&
  process.env.CLOUDINARY_CLOUD_NAME.trim() !== '' &&
  process.env.CLOUDINARY_API_KEY &&
  process.env.CLOUDINARY_API_KEY.trim() !== '' &&
  process.env.CLOUDINARY_API_SECRET &&
  process.env.CLOUDINARY_API_SECRET.trim() !== ''
);

if (isCloudinaryConfigured) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME.trim(),
    api_key: process.env.CLOUDINARY_API_KEY.trim(),
    api_secret: process.env.CLOUDINARY_API_SECRET.trim()
  });
}

/**
 * Upload single or multiple images
 * Handles Cloudinary when credentials exist, with automatic graceful local disk fallback
 */
export const uploadImage = async (req, res) => {
  try {
    const rawFiles = req.files && req.files.length > 0 
      ? req.files 
      : (req.file ? [req.file] : []);

    if (rawFiles.length === 0) {
      return res.status(400).json({ success: false, message: 'No image provided' });
    }

    const uploadedUrls = [];

    for (const file of rawFiles) {
      let uploadedUrl = null;

      // 1. Try Cloudinary if configured
      if (isCloudinaryConfigured) {
        try {
          const b64 = Buffer.from(file.buffer).toString('base64');
          const dataURI = `data:${file.mimetype || 'image/jpeg'};base64,${b64}`;
          const result = await cloudinary.uploader.upload(dataURI, {
            folder: 'avrora-dazzle'
          });
          if (result && result.secure_url) {
            uploadedUrl = result.secure_url;
          }
        } catch (cloudErr) {
          console.warn('Cloudinary upload error, falling back to local storage:', cloudErr.message);
        }
      }

      // 2. Fallback to local server storage
      if (!uploadedUrl) {
        const ext = path.extname(file.originalname) || (file.mimetype ? `.${file.mimetype.split('/')[1]}` : '.jpg');
        const rawBase = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9_-]/g, '_');
        const uniqueFilename = `${Date.now()}-${Math.round(Math.random() * 1e9)}-${rawBase}${ext}`;
        const targetPath = path.join(uploadsDir, uniqueFilename);

        await fs.promises.writeFile(targetPath, file.buffer);

        const protocol = req.headers['x-forwarded-proto'] || req.protocol || 'http';
        const host = req.get('host') || 'localhost:3000';
        uploadedUrl = `${protocol}://${host}/uploads/${uniqueFilename}`;
      }

      uploadedUrls.push(uploadedUrl);
    }

    return res.status(200).json({
      success: true,
      message: uploadedUrls.length > 1 
        ? `${uploadedUrls.length} images uploaded successfully` 
        : 'Image uploaded successfully',
      url: uploadedUrls[0],
      urls: uploadedUrls
    });
  } catch (error) {
    console.error('Error during image upload:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Failed to upload image', 
      error: error.message 
    });
  }
};
