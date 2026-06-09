/**
 * Projects Controller
 * Full CRUD operations for portfolio projects.
 *
 * CHANGED: image upload/delete now goes through Cloudinary
 * (portfolio/projects folder) instead of local disk.
 */

const Project    = require('../models/Project');
const cloudinary = require('../config/cloudinary');
const { validationResult } = require('express-validator');

// ─── Helper: upload buffer to Cloudinary ─────────────────────────────────────
const uploadImageToCloudinary = (buffer) =>
  new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder:          'portfolio/projects',
        use_filename:    false,
        unique_filename: true,
        transformation:  [{ quality: 'auto', fetch_format: 'auto' }],
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );
    stream.end(buffer);
  });

// ─── Helper: delete image from Cloudinary by public_id ───────────────────────
const deleteImageFromCloudinary = async (publicId) => {
  if (!publicId) return;
  await cloudinary.uploader.destroy(publicId).catch(() => {});
};

// ─── Get All Projects (Public) ────────────────────────────────────────────────
const getProjects = async (req, res) => {
  try {
    const { category, featured } = req.query;
    const filter = {};

    if (category) filter.category = category;
    if (featured === 'true') filter.featured = true;

    const projects = await Project.find(filter).sort({ featured: -1, order: 1, createdAt: -1 });

    res.json({
      success: true,
      count:   projects.length,
      data:    projects,
    });
  } catch (error) {
    console.error('Get Projects Error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch projects.' });
  }
};

// ─── Get Single Project (Public) ──────────────────────────────────────────────
const getProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found.' });
    }
    res.json({ success: true, data: project });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch project.' });
  }
};

// ─── Create Project (Admin) ───────────────────────────────────────────────────
const createProject = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: errors.array()[0].msg,
      });
    }

    const {
      title, description, shortDescription,
      techStack, liveUrl, githubUrl,
      featured, order, category, image,
    } = req.body;

    // Use uploaded file → Cloudinary; else fall back to URL string in body
    let imageUrl      = image || '';
    let imagePublicId = '';

    if (req.file) {
      const result  = await uploadImageToCloudinary(req.file.buffer);
      imageUrl      = result.secure_url;
      imagePublicId = result.public_id;
    }

    const project = await Project.create({
      title,
      description,
      shortDescription,
      techStack:    Array.isArray(techStack) ? techStack : techStack.split(',').map(t => t.trim()),
      liveUrl,
      githubUrl,
      featured:     featured === 'true' || featured === true,
      order:        order || 0,
      category:     category || 'fullstack',
      image:        imageUrl,
      imagePublicId,          // stored so we can delete from Cloudinary later
    });

    res.status(201).json({
      success: true,
      message: 'Project created successfully!',
      data:    project,
    });
  } catch (error) {
    console.error('Create Project Error:', error);
    res.status(500).json({ success: false, message: 'Failed to create project.' });
  }
};

// ─── Update Project (Admin) ───────────────────────────────────────────────────
const updateProject = async (req, res) => {
  try {
    let project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found.' });
    }

    const updateData = { ...req.body };

    // Handle tech stack string or array
    if (updateData.techStack && typeof updateData.techStack === 'string') {
      updateData.techStack = updateData.techStack.split(',').map(t => t.trim());
    }

    // If a new image file was uploaded → delete old one and upload new
    if (req.file) {
      await deleteImageFromCloudinary(project.imagePublicId);
      const result             = await uploadImageToCloudinary(req.file.buffer);
      updateData.image         = result.secure_url;
      updateData.imagePublicId = result.public_id;
    }

    // Parse boolean fields
    if (updateData.featured !== undefined) {
      updateData.featured = updateData.featured === 'true' || updateData.featured === true;
    }

    project = await Project.findByIdAndUpdate(req.params.id, updateData, {
      new:            true,
      runValidators:  true,
    });

    res.json({
      success: true,
      message: 'Project updated successfully!',
      data:    project,
    });
  } catch (error) {
    console.error('Update Project Error:', error);
    res.status(500).json({ success: false, message: 'Failed to update project.' });
  }
};

// ─── Delete Project (Admin) ───────────────────────────────────────────────────
const deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found.' });
    }

    // Delete image from Cloudinary before removing DB record
    await deleteImageFromCloudinary(project.imagePublicId);

    await project.deleteOne();

    res.json({
      success: true,
      message: 'Project deleted successfully!',
    });
  } catch (error) {
    console.error('Delete Project Error:', error);
    res.status(500).json({ success: false, message: 'Failed to delete project.' });
  }
};

module.exports = { getProjects, getProject, createProject, updateProject, deleteProject };
