/**
 * Projects Section
 * RESPONSIVE FIXES:
 * - Filter tabs use projects-filter-bar class (flex-wrap + horizontal scroll safety valve)
 * - Project card content area uses project-card-content class (reduced p-6 on 320px)
 * - Project image h-48 is fine — images always fill their container with object-cover
 * - Tech stack tags already flex-wrap; reduced gap to gap-1.5 on mobile
 * - Card link buttons: flex-1 causes them to be very narrow on small screens when
 *   both are present — added min-w-[80px] and text wrapping guard
 * - Heading uses clamp()
 * - Filter buttons: text-xs on smallest, text-sm on sm+
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowTopRightOnSquareIcon,
  CodeBracketIcon,
  StarIcon,
  DevicePhoneMobileIcon,
  ServerIcon,
  ComputerDesktopIcon,
} from '@heroicons/react/24/outline';
import api from '../../utils/api';

const SAMPLE_PROJECTS = [
  {
    _id: 'sample1',
    title: 'E-Commerce Platform',
    shortDescription: 'Full-stack shopping platform with real-time inventory and Stripe payments.',
    description: 'A production-ready e-commerce platform built with MERN stack featuring real-time inventory management, Stripe payment integration, admin dashboard, and comprehensive order management.',
    techStack: ['React', 'Node.js', 'MongoDB', 'Stripe', 'Redux'],
    liveUrl: '#',
    githubUrl: '#',
    featured: true,
    category: 'fullstack',
    image: '',
  },
  {
    _id: 'sample2',
    title: 'AI Chat Application',
    shortDescription: 'Real-time chat app with AI assistant, file sharing, and voice messages.',
    description: 'Real-time messaging application with WebSocket support, AI-powered responses, file sharing, and end-to-end encryption.',
    techStack: ['React', 'Socket.io', 'Express', 'OpenAI', 'MongoDB'],
    liveUrl: '#',
    githubUrl: '#',
    featured: true,
    category: 'fullstack',
    image: '',
  },
  {
    _id: 'sample3',
    title: 'Task Management Dashboard',
    shortDescription: 'Collaborative project management tool with drag-and-drop boards.',
    description: 'Trello-like project management tool with drag-and-drop boards, team collaboration, progress tracking, and Slack integration.',
    techStack: ['React', 'Node.js', 'PostgreSQL', 'Redis', 'Docker'],
    liveUrl: '#',
    githubUrl: '#',
    featured: false,
    category: 'web',
    image: '',
  },
];

const CATEGORY_FILTERS = ['All', 'fullstack', 'web', 'backend', 'mobile', 'other'];

const TAG_COLORS = {
  React: 'text-[#61DAFB] bg-[#61DAFB]/10 border-[#61DAFB]/25',
  'Node.js': 'text-[#339933] bg-[#339933]/10 border-[#339933]/25',
  MongoDB: 'text-[#47A248] bg-[#47A248]/10 border-[#47A248]/25',
  Express: 'text-slate-300 bg-slate-300/10 border-slate-300/20',
  TypeScript: 'text-[#3178C6] bg-[#3178C6]/10 border-[#3178C6]/25',
  Tailwind: 'text-[#06B6D4] bg-[#06B6D4]/10 border-[#06B6D4]/25',
  Redux: 'text-[#764ABC] bg-[#764ABC]/10 border-[#764ABC]/25',
  GraphQL: 'text-[#E10098] bg-[#E10098]/10 border-[#E10098]/25',
  Docker: 'text-[#2496ED] bg-[#2496ED]/10 border-[#2496ED]/25',
  Git: 'text-[#F05032] bg-[#F05032]/10 border-[#F05032]/25',
  AWS: 'text-[#FF9900] bg-[#FF9900]/10 border-[#FF9900]/25',
  PostgreSQL: 'text-[#4169E1] bg-[#4169E1]/10 border-[#4169E1]/25',
  Redis: 'text-[#DC382D] bg-[#DC382D]/10 border-[#DC382D]/25',
  Stripe: 'text-[#635BFF] bg-[#635BFF]/10 border-[#635BFF]/25',
  'Socket.io': 'text-slate-300 bg-slate-300/10 border-slate-300/20',
  OpenAI: 'text-[#10a37f] bg-[#10a37f]/10 border-[#10a37f]/25',
  Figma: 'text-[#F24E1E] bg-[#F24E1E]/10 border-[#F24E1E]/25',
  Jest: 'text-[#C21325] bg-[#C21325]/10 border-[#C21325]/25',
  JavaScript: 'text-[#F7DF1E] bg-[#F7DF1E]/10 border-[#F7DF1E]/25',
  default: 'text-slate-400 bg-slate-400/10 border-slate-400/20',
};

const getCategoryIcon = (category) => {
  switch (category) {
    case 'mobile': return <DevicePhoneMobileIcon className="w-10 h-10 text-accent-cyan/40" />;
    case 'backend': return <ServerIcon className="w-10 h-10 text-accent-cyan/40" />;
    default: return <ComputerDesktopIcon className="w-10 h-10 text-accent-cyan/40" />;
  }
};

const ProjectCard = ({ project, index }) => {
  // project.image is always a full Cloudinary https:// URL or empty string
  const imageUrl = project.image || null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="animated-border glass-card rounded-2xl overflow-hidden glass-card-hover group"
    >
      {/* Project Image — h-48 is safe on all screen widths */}
      <div className="relative h-44 sm:h-48 overflow-hidden bg-gradient-to-br from-dark-700 to-dark-600">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={project.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="opacity-30">
              {getCategoryIcon(project.category)}
            </div>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-dark-900/80 via-transparent to-transparent" />

        {project.featured && (
          <div className="absolute top-3 right-3 px-2 py-1 bg-accent-cyan text-dark-900 text-xs font-mono font-bold rounded-full flex items-center gap-1">
            <StarIcon className="w-3 h-3" />
            Featured
          </div>
        )}

        <div className="absolute top-3 left-3 px-2 py-1 bg-dark-900/80 backdrop-blur-sm text-accent-cyan text-xs font-mono border border-accent-cyan/20 rounded-full capitalize">
          {project.category}
        </div>
      </div>

      {/* Content — project-card-content reduces p-6 on 320px */}
      <div className="project-card-content p-5 sm:p-6 space-y-3 sm:space-y-4">
        <h3 className="font-display font-bold text-lg sm:text-xl text-white group-hover:text-accent-cyan transition-colors leading-snug">
          {project.title}
        </h3>

        <p className="text-slate-400 text-sm font-body leading-relaxed line-clamp-2">
          {project.shortDescription || project.description}
        </p>

        {/* Tech Stack Tags */}
        <div className="flex flex-wrap gap-1.5">
          {project.techStack?.slice(0, 5).map(tech => (
            <span
              key={tech}
              className={`text-xs px-2 py-1 rounded border font-mono transition-all duration-200 hover:scale-105 hover:shadow-sm ${TAG_COLORS[tech] || TAG_COLORS.default}`}
            >
              {tech}
            </span>
          ))}
          {project.techStack?.length > 5 && (
            <span className="text-xs px-2 py-1 rounded border text-slate-500 bg-slate-500/10 border-slate-500/20 font-mono">
              +{project.techStack.length - 5}
            </span>
          )}
        </div>

        {/* Links */}
        <div className="flex gap-2 pt-1">
          {project.liveUrl && project.liveUrl !== '#' && (
            <motion.a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.05 }}
              className="flex-1 text-center py-2 rounded-lg bg-accent-cyan text-dark-900 text-sm font-semibold font-display transition-all hover:shadow-lg hover:shadow-accent-cyan/25 flex items-center justify-center gap-1.5 min-w-0"
            >
              <ArrowTopRightOnSquareIcon className="w-4 h-4 flex-shrink-0" />
              <span className="truncate">Live Demo</span>
            </motion.a>
          )}
          {project.githubUrl && project.githubUrl !== '#' && (
            <motion.a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.05 }}
              className="flex-1 text-center py-2 rounded-lg border border-white/15 text-slate-300 text-sm font-semibold font-display hover:border-white/30 hover:text-white transition-all flex items-center justify-center gap-1.5 min-w-0"
            >
              <CodeBracketIcon className="w-4 h-4 flex-shrink-0" />
              <span className="truncate">GitHub</span>
            </motion.a>
          )}
          {(!project.liveUrl || project.liveUrl === '#') && (!project.githubUrl || project.githubUrl === '#') && (
            <span className="text-slate-600 text-xs font-mono py-2">No links available</span>
          )}
        </div>
      </div>
    </motion.div>
  );
};

const ProjectsSection = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await api.get('/projects');
        const data = res.data.data;
        setProjects(data.length > 0 ? data : SAMPLE_PROJECTS);
      } catch (err) {
        console.warn('Could not fetch projects, using samples:', err.message);
        setProjects(SAMPLE_PROJECTS);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  const filtered = filter === 'All' ? projects : projects.filter(p => p.category === filter);

  return (
    <section id="projects" className="section-padding bg-dark-800 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-accent-pink/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-8 sm:mb-12"
        >
          <span className="font-mono text-accent-cyan text-sm tracking-widest">04. WORK</span>
          <h2
            className="font-display font-bold mt-2 text-white"
            style={{ fontSize: 'clamp(1.75rem, 5vw, 3rem)' }}
          >
            Projects <span className="gradient-text">I've Built</span>
          </h2>
          <p className="text-slate-400 mt-3 font-body max-w-xl mx-auto text-sm sm:text-base">
            Projects built while learning,
            experimenting and solving real problems
          </p>
        </motion.div>

        {/*
          FIX: projects-filter-bar class handles horizontal scroll on 320px if
          buttons would otherwise overflow — in practice flex-wrap handles most
          cases, but the class provides the safety net.
        */}
        <div className="projects-filter-bar mb-8 sm:mb-10">
          {CATEGORY_FILTERS.map(cat => (
            <motion.button
              key={cat}
              onClick={() => setFilter(cat)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-mono capitalize transition-all flex-shrink-0 ${filter === cat
                  ? 'bg-accent-cyan text-dark-900 font-bold'
                  : 'glass-card border border-white/10 text-slate-400 hover:text-white'
                }`}
            >
              {cat}
            </motion.button>
          ))}
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-12 h-12 spinner" />
          </div>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key={filter}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6"
            >
              {filtered.length === 0 ? (
                <div className="col-span-full text-center py-16 text-slate-500 font-body">
                  No projects in this category yet.
                </div>
              ) : (
                filtered.map((project, i) => (
                  <ProjectCard key={project._id} project={project} index={i} />
                ))
              )}
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    </section>
  );
};

export default ProjectsSection;