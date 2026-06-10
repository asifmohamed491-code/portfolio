/**
 * Database Seeder
 * Run: node seed.js
 * Creates default admin user and sample projects
 */

require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Project = require('./models/Project');

const ADMIN = {
  name: 'Admin',
  email: process.env.ADMIN_EMAIL || 'admin@portfolio.com',
  password: process.env.ADMIN_PASSWORD || 'Admin@123',
  role: 'admin',
};

const SAMPLE_PROJECTS = [
  {
    title: 'E-Commerce Platform',
    description: 'A full-featured e-commerce platform with product management, cart, and Stripe payment integration. Includes real-time inventory tracking and comprehensive admin dashboard.',
    shortDescription: 'Full-stack shopping platform with Stripe payments.',
    techStack: ['React', 'Node.js', 'MongoDB', 'Stripe', 'Redux', 'Tailwind'],
    liveUrl: 'https://example.com',
    githubUrl: 'https://github.com',
    featured: true,
    category: 'fullstack',
    order: 1,
  },
  {
    title: 'AI Chat Application',
    description: 'Real-time messaging app with WebSocket support, AI-powered responses using OpenAI API, file sharing, and end-to-end messaging.',
    shortDescription: 'Real-time chat with AI assistant integration.',
    techStack: ['React', 'Socket.io', 'Express', 'OpenAI', 'MongoDB'],
    liveUrl: 'https://example.com',
    githubUrl: 'https://github.com',
    featured: true,
    category: 'fullstack',
    order: 2,
  },
  {
    title: 'Task Management Dashboard',
    description: 'Collaborative project management tool with drag-and-drop Kanban boards, team collaboration features, progress tracking, and notifications.',
    shortDescription: 'Trello-like PM tool with drag-and-drop boards.',
    techStack: ['React', 'Node.js', 'PostgreSQL', 'Redis', 'Docker'],
    liveUrl: '',
    githubUrl: 'https://github.com',
    featured: false,
    category: 'web',
    order: 3,
  },
  {
    title: 'DevOps Monitoring Tool',
    description: 'Infrastructure monitoring dashboard that tracks server metrics, alerts, and logs in real-time with Grafana-like visualizations.',
    shortDescription: 'Real-time server monitoring and alerting dashboard.',
    techStack: ['Node.js', 'Express', 'InfluxDB', 'WebSockets', 'Chart.js'],
    liveUrl: '',
    githubUrl: 'https://github.com',
    featured: false,
    category: 'backend',
    order: 4,
  },
];

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/portfolio');
    console.log('✅ Connected to MongoDB');

    // ─── SAFETY GUARD: Never overwrite existing data ──────────────────────────
    // If any users or projects already exist, abort immediately.
    // To force a reseed, manually drop the collections in MongoDB first.
    const existingUsers    = await User.countDocuments();
    const existingProjects = await Project.countDocuments();

    if (existingUsers > 0 || existingProjects > 0) {
      console.log('⚠️  Database already contains data — seed aborted to protect real data.');
      console.log(`   Users: ${existingUsers}, Projects: ${existingProjects}`);
      console.log('   To force a reseed, manually drop the collections in MongoDB Atlas first.');
      process.exit(0);
    }
    // ──────────────────────────────────────────────────────────────────────────

    // Create admin (only runs on a completely empty DB)
    const admin = await User.create(ADMIN);
    console.log(`👤 Admin created: ${admin.email}`);

    // Create sample projects (only runs on a completely empty DB)
    await Project.insertMany(SAMPLE_PROJECTS);
    console.log(`📦 Created ${SAMPLE_PROJECTS.length} sample projects`);

    console.log('\n✨ Database seeded successfully!');
    console.log(`📧 Admin Email: ${ADMIN.email}`);
    console.log(`🔑 Admin Password: ${ADMIN.password}`);
    console.log('\n⚠️  Change the password in production!');

    process.exit(0);
  } catch (err) {
    console.error('❌ Seeding failed:', err.message);
    process.exit(1);
  }
};

seed();
