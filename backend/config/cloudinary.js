/**
 * Cloudinary Configuration
 * Initialises the Cloudinary SDK from environment variables.
 * Set these three vars in your Render (or local .env) dashboard:
 *   CLOUDINARY_CLOUD_NAME
 *   CLOUDINARY_API_KEY
 *   CLOUDINARY_API_SECRET
 */

const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure:     true, // always use https delivery URLs
});

module.exports = cloudinary;
