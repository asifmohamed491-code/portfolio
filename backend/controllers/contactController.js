/**
 * Contact Controller
 * Handles contact form submissions and message management
 */

const Contact = require('../models/Contact');
const { validationResult } = require('express-validator');

// ─── Submit Contact Form (Public) ─────────────────────────────────────────────
const submitContact = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: errors.array()[0].msg,
      });
    }

    const { name, email, subject, message } = req.body;

    const contact = await Contact.create({ name, email, subject, message });

    res.status(201).json({
      success: true,
      message: "Thanks for reaching out! I'll get back to you soon. 🚀",
      data: { id: contact._id },
    });
  } catch (error) {
    console.error('Contact Submit Error:', error);
    res.status(500).json({ success: false, message: 'Failed to send message. Please try again.' });
  }
};

// ─── Get All Messages (Admin) ─────────────────────────────────────────────────
const getMessages = async (req, res) => {
  try {
    const messages = await Contact.find().sort({ createdAt: -1 });
    res.json({
      success: true,
      count: messages.length,
      unread: messages.filter(m => m.status === 'new').length,
      data: messages,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch messages.' });
  }
};

// ─── Update Message Status (Admin) ───────────────────────────────────────────
const updateMessageStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const message = await Contact.findByIdAndUpdate(
      req.params.id,
      { status, isRead: true },
      { new: true }
    );
    if (!message) {
      return res.status(404).json({ success: false, message: 'Message not found.' });
    }
    res.json({ success: true, message: 'Status updated.', data: message });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update message.' });
  }
};

// ─── Delete Message (Admin) ───────────────────────────────────────────────────
const deleteMessage = async (req, res) => {
  try {
    const message = await Contact.findByIdAndDelete(req.params.id);
    if (!message) {
      return res.status(404).json({ success: false, message: 'Message not found.' });
    }
    res.json({ success: true, message: 'Message deleted.' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete message.' });
  }
};

module.exports = { submitContact, getMessages, updateMessageStatus, deleteMessage };
