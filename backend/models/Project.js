/**
 * Project Model
 * Stores portfolio project data including tech stack, links, and images.
 *
 * CHANGED: added `imagePublicId` field to store Cloudinary public_id
 * so old images can be deleted from Cloudinary on update/delete.
 */

const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema(
  {
    title: {
      type:      String,
      required:  [true, 'Project title is required'],
      trim:      true,
      maxlength: [100, 'Title cannot exceed 100 characters'],
    },
    description: {
      type:      String,
      required:  [true, 'Project description is required'],
      trim:      true,
      maxlength: [1000, 'Description cannot exceed 1000 characters'],
    },
    shortDescription: {
      type:      String,
      trim:      true,
      maxlength: [200, 'Short description cannot exceed 200 characters'],
    },
    image: {
      type:    String,
      default: '',
    },
    // Cloudinary public_id — used to delete the old image on update/delete
    imagePublicId: {
      type:    String,
      default: '',
    },
    techStack: {
      type:     [String],
      required: [true, 'Tech stack is required'],
      validate: {
        validator: (arr) => arr.length > 0,
        message:   'At least one technology is required',
      },
    },
    liveUrl: {
      type:    String,
      trim:    true,
      default: '',
    },
    githubUrl: {
      type:    String,
      trim:    true,
      default: '',
    },
    featured: {
      type:    Boolean,
      default: false,
    },
    order: {
      type:    Number,
      default: 0,
    },
    category: {
      type:    String,
      enum:    ['web', 'mobile', 'backend', 'fullstack', 'other'],
      default: 'fullstack',
    },
  },
  { timestamps: true }
);

// Index for faster queries
projectSchema.index({ featured: -1, order: 1, createdAt: -1 });

module.exports = mongoose.model('Project', projectSchema);
