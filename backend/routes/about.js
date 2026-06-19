/**
 * About Routes – Profile Photo Upload/Delete for Admin
 * GET    /api/about/photo   – Get current photo URL (public)
 * POST   /api/about/photo   – Upload new photo (admin)
 * DELETE /api/about/photo   – Delete photo (admin)
 *
 * Storage : Cloudinary → portfolio/profile
 * Metadata: MongoDB SiteMeta (key = "about_photo") — survives Render restarts
 */

const express    = require('express');
const multer     = require('multer');
const cloudinary = require('../config/cloudinary');
const SiteMeta   = require('../models/SiteMeta');
const { protect, adminOnly } = require('../middleware/auth');

const router = express.Router();

// ─── Multer — memory only, nothing touches disk ───────────────────────────────
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },                  // 5 MB
  fileFilter: (req, file, cb) => {
    const ok = /^image\/(jpeg|jpg|png|webp)$/i.test(file.mimetype);
    cb(ok ? null : new Error('Only jpg, jpeg, png, webp allowed'), ok);
  },
});

// ─── Helper: stream buffer → Cloudinary portfolio/profile ────────────────────
const uploadToCloudinary = (buffer) =>
  new Promise((resolve, reject) => {
    cloudinary.uploader.upload_stream(
      {
        folder:          'portfolio/profile',
        use_filename:    false,
        unique_filename: true,
        transformation:  [{ quality: 'auto', fetch_format: 'auto' }],
      },
      (err, result) => (err ? reject(err) : resolve(result))
    ).end(buffer);
  });

// ─── GET /api/about/photo (public) ───────────────────────────────────────────
// CHANGED: short cache window — same rationale as /api/projects.
router.get('/photo', async (req, res) => {
  try {
    const meta = await SiteMeta.findOne({ key: 'about_photo' });
    res.set('Cache-Control', 'public, max-age=120, stale-while-revalidate=600');
    if (!meta || !meta.url) return res.json({ success: true, exists: false, url: null });
    res.json({ success: true, exists: true, url: meta.url, uploadedAt: meta.uploadedAt });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ─── POST /api/about/photo (admin) ───────────────────────────────────────────
router.post('/photo', protect, adminOnly, upload.single('photo'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, message: 'No file uploaded.' });

    // Delete previous Cloudinary asset if it exists
    const existing = await SiteMeta.findOne({ key: 'about_photo' });
    if (existing?.publicId) {
      await cloudinary.uploader.destroy(existing.publicId).catch(() => {});
    }

    // Upload new image
    const result = await uploadToCloudinary(req.file.buffer);

    // Upsert metadata in MongoDB (no disk file)
    await SiteMeta.findOneAndUpdate(
      { key: 'about_photo' },
      {
        key:          'about_photo',
        publicId:     result.public_id,
        url:          result.secure_url,
        originalName: req.file.originalname,
        size:         req.file.size,
        uploadedAt:   new Date(),
      },
      { upsert: true, new: true }
    );

    res.json({ success: true, message: 'Photo uploaded successfully.', url: result.secure_url });
  } catch (err) {
    console.error('About photo upload error:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// ─── DELETE /api/about/photo (admin) ─────────────────────────────────────────
router.delete('/photo', protect, adminOnly, async (req, res) => {
  try {
    const meta = await SiteMeta.findOne({ key: 'about_photo' });
    if (!meta?.publicId) return res.status(404).json({ success: false, message: 'No photo to delete.' });

    await cloudinary.uploader.destroy(meta.publicId).catch(() => {});
    await SiteMeta.deleteOne({ key: 'about_photo' });

    res.json({ success: true, message: 'Photo deleted.' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
