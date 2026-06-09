/**
 * Migration Script: Fix stale /uploads/... paths in MongoDB
 *
 * Problem:  Old documents have { image: "/uploads/project-xxxxx.png" }
 * Solution: Clears the image field to '' so the dashboard shows a placeholder
 *           instead of a broken path. Re-upload images via the Admin UI.
 *
 * Run ONCE after deploying the Cloudinary fix:
 *   cd backend && node scripts/migrate-uploads-to-cloudinary.js
 */

require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const mongoose = require('mongoose');
const Project  = require('../models/Project');

async function migrate() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('✅ Connected to MongoDB');

  const stale = await Project.find({ image: /^\/uploads\// });
  console.log(`Found ${stale.length} project(s) with stale /uploads/ paths`);

  if (stale.length === 0) {
    console.log('Nothing to migrate — all good!');
    process.exit(0);
  }

  for (const p of stale) {
    console.log(`  Clearing image for: "${p.title}"  (was: ${p.image})`);
    await Project.findByIdAndUpdate(p._id, { image: '', imagePublicId: '' });
  }

  console.log('\n✅ Migration complete.');
  console.log('Now re-upload images for these projects via the Admin Dashboard.');
  process.exit(0);
}

migrate().catch(err => {
  console.error('Migration failed:', err.message);
  process.exit(1);
});
