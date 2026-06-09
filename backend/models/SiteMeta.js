/**
 * SiteMeta Model
 * Stores singleton metadata for About photo and Resume — both of which
 * have only one active record at a time. Using MongoDB means this data
 * survives Render filesystem resets (no more meta.json on disk).
 *
 * key examples: "about_photo" | "resume"
 */

const mongoose = require('mongoose');

const siteMetaSchema = new mongoose.Schema(
  {
    key: {
      type:     String,
      required: true,
      unique:   true,   // one document per key
      trim:     true,
    },
    publicId: {
      type:    String,
      default: '',
    },
    url: {
      type:    String,
      default: '',
    },
    originalName: {
      type:    String,
      default: '',
    },
    size: {
      type:    Number,
      default: 0,
    },
    uploadedAt: {
      type:    Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('SiteMeta', siteMetaSchema);
