/**
 * Project Routes
 * GET    /api/projects         - Get all projects (public)
 * GET    /api/projects/:id     - Get single project (public)
 * POST   /api/projects         - Create project (admin only)
 * PUT    /api/projects/:id     - Update project (admin only)
 * DELETE /api/projects/:id     - Delete project (admin only)
 *
 * CHANGED: multer now uses memoryStorage; image bytes are uploaded
 * directly to Cloudinary (portfolio/projects folder) instead of disk.
 */

const express = require('express');
const { body } = require('express-validator');
const multer  = require('multer');
const path    = require('path');
const { getProjects, getProject, createProject, updateProject, deleteProject } = require('../controllers/projectController');
const { protect, adminOnly } = require('../middleware/auth');

const router = express.Router();

// ─── Multer – memory storage (no disk write) ──────────────────────────────────
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname  = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    if (extname && mimetype) return cb(null, true);
    cb(new Error('Only image files are allowed'));
  },
});

// Validation
const projectValidation = [
  body('title').trim().notEmpty().withMessage('Project title is required'),
  body('description').trim().notEmpty().withMessage('Description is required'),
  body('techStack').notEmpty().withMessage('Tech stack is required'),
];

// Public routes
router.get('/',    getProjects);
router.get('/:id', getProject);

// Protected admin routes
router.post('/',    protect, adminOnly, upload.single('image'), projectValidation, createProject);
router.put('/:id',  protect, adminOnly, upload.single('image'), updateProject);
router.delete('/:id', protect, adminOnly, deleteProject);

module.exports = router;
