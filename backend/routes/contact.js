/**
 * Contact Routes
 * POST   /api/contact           - Submit contact form (public)
 * GET    /api/contact           - Get all messages (admin only)
 * PUT    /api/contact/:id       - Update message status (admin only)
 * DELETE /api/contact/:id       - Delete message (admin only)
 */

const express = require('express');
const { body } = require('express-validator');
const { submitContact, getMessages, updateMessageStatus, deleteMessage } = require('../controllers/contactController');
const { protect, adminOnly } = require('../middleware/auth');

const router = express.Router();

const contactValidation = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('subject').trim().notEmpty().withMessage('Subject is required'),
  body('message').trim().isLength({ min: 10 }).withMessage('Message must be at least 10 characters'),
];

// Public
router.post('/', contactValidation, submitContact);

// Admin protected
router.get('/', protect, adminOnly, getMessages);
router.put('/:id', protect, adminOnly, updateMessageStatus);
router.delete('/:id', protect, adminOnly, deleteMessage);

module.exports = router;
