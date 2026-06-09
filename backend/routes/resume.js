/**
 * Resume Routes
 * GET    /api/resume/status    – Check if resume exists + get metadata (public)
 * POST   /api/resume/upload    – Upload / replace resume (admin only)
 * DELETE /api/resume           – Delete resume (admin only)
 *
 * NOTE: /api/resume/download is intentionally REMOVED.
 * The frontend now redirects directly to the Cloudinary URL returned by /status.
 * PDFs stored in Cloudinary portfolio/resume with resource_type "raw".
 *
 * Storage : Cloudinary → portfolio/resume  (resource_type: raw)
 * Metadata: MongoDB SiteMeta (key = "resume") — survives Render restarts
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
  limits: { fileSize: 10 * 1024 * 1024 },                 // 10 MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') return cb(null, true);
    cb(new Error('Only PDF files are allowed'));
  },
});

// ─── Helper: stream PDF buffer → Cloudinary portfolio/resume ─────────────────
const uploadResumeToCloudinary = (buffer, originalName) =>
  new Promise((resolve, reject) => {
    // resource_type "raw" is required for non-image files (PDF, DOCX, etc.)
    cloudinary.uploader.upload_stream(
      {
        folder:          'portfolio/resume',
        resource_type:   'raw',
        use_filename:    true,
        unique_filename: true,
        public_id:       `resume_${Date.now()}`,
      },
      (err, result) => (err ? reject(err) : resolve(result))
    ).end(buffer);
  });

// ─── GET /api/resume/status (public) ─────────────────────────────────────────
router.get('/status', async (req, res) => {
  try {
    const meta = await SiteMeta.findOne({ key: 'resume' });
    if (!meta || !meta.url) return res.json({ success: true, exists: false });
    res.json({
      success:      true,
      exists:       true,
      url:          meta.url,           // ← Cloudinary secure_url (frontend uses this directly)
      uploadedAt:   meta.uploadedAt,
      originalName: meta.originalName,
      size:         meta.size,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ─── POST /api/resume/upload (admin) ─────────────────────────────────────────
router.post('/upload', protect, adminOnly, upload.single('resume'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, message: 'No file uploaded.' });

    // Delete old Cloudinary asset if it exists
    const existing = await SiteMeta.findOne({ key: 'resume' });
    if (existing?.publicId) {
      await cloudinary.uploader.destroy(existing.publicId, { resource_type: 'raw' }).catch(() => {});
    }

    // Upload new PDF
    const result = await uploadResumeToCloudinary(req.file.buffer, req.file.originalname);

    // Upsert metadata in MongoDB
    const meta = await SiteMeta.findOneAndUpdate(
      { key: 'resume' },
      {
        key:          'resume',
        publicId:     result.public_id,
        url:          result.secure_url,
        originalName: req.file.originalname,
        size:         req.file.size,
        uploadedAt:   new Date(),
      },
      { upsert: true, new: true }
    );

    res.json({
      success:  true,
      message:  'Resume uploaded successfully.',
      data: {
        originalName: meta.originalName,
        uploadedAt:   meta.uploadedAt,
        size:         meta.size,
        url:          meta.url,
      },
    });
  } catch (err) {
    console.error('Resume upload error:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// ─── DELETE /api/resume (admin) ───────────────────────────────────────────────
router.delete('/', protect, adminOnly, async (req, res) => {
  try {
    const meta = await SiteMeta.findOne({ key: 'resume' });
    if (!meta?.publicId) return res.status(404).json({ success: false, message: 'No resume to delete.' });

    await cloudinary.uploader.destroy(meta.publicId, { resource_type: 'raw' }).catch(() => {});
    await SiteMeta.deleteOne({ key: 'resume' });

    res.json({ success: true, message: 'Resume deleted.' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
