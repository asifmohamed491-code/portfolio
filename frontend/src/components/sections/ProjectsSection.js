/**
 * Projects Section - Emoji-free with heroicons
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
  ChevronDownIcon,
  ChevronUpIcon,
} from '@heroicons/react/24/outline';
import { cachedGet } from '../../utils/api';

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

/* ------------------------------------------------------------------ */
/*  Scalable automatic tech-stack color system                         */
/* ------------------------------------------------------------------ */

// Official / ecosystem-inspired accent colors for well-known technologies.
// Keys are normalized (lowercase, alphanumeric only) so "Node.js", "NODE.JS",
// "node" etc. all resolve to the same entry.
const KNOWN_TECH_HEX = {
  react: '#61DAFB',
  reactjs: '#61DAFB',
  reactnative: '#61DAFB',

  node: '#339933',
  nodejs: '#339933',

  mongodb: '#47A248',
  mongo: '#47A248',

  express: '#9CA3AF',
  expressjs: '#9CA3AF',

  next: '#FFFFFF',
  nextjs: '#FFFFFF',

  tailwind: '#06B6D4',
  tailwindcss: '#06B6D4',

  javascript: '#F7DF1E',
  js: '#F7DF1E',

  typescript: '#3178C6',
  ts: '#3178C6',

  python: '#3776AB',

  java: '#F89820',

  docker: '#2496ED',

  redis: '#DC382D',

  postgresql: '#4169E1',
  postgres: '#4169E1',

  firebase: '#FFA000',

  openai: '#10A37F',

  figma: '#F24E1E',

  git: '#F05032',
  github: '#E5E7EB',

  aws: '#FF9900',

  redux: '#764ABC',

  graphql: '#E10098',

  stripe: '#635BFF',

  socketio: '#9CA3AF',

  jest: '#C21325',

  vue: '#42B883',
  vuejs: '#42B883',

  angular: '#DD0031',

  sass: '#CC6699',
  scss: '#CC6699',

  css: '#1572B6',
  css3: '#1572B6',

  html: '#E34F26',
  html5: '#E34F26',

  mysql: '#4479A1',

  django: '#092E20',

  flask: '#9CA3AF',

  kubernetes: '#326CE5',

  graphite: '#F46800',

  vite: '#646CFF',

  webpack: '#8DD6F9',

  npm: '#CB3837',

  linux: '#FCC624',

  vscode: '#007ACC',

  postman: '#FF6C37',
};

const normalizeTechKey = (tech = '') =>
  tech.toString().toLowerCase().replace(/[^a-z0-9]/g, '');

// Convert a hex color into an rgba() string with the given alpha.
const hexToRgba = (hex, alpha) => {
  let h = hex.replace('#', '');
  if (h.length === 3) {
    h = h.split('').map(c => c + c).join('');
  }
  const r = parseInt(h.substring(0, 2), 16);
  const g = parseInt(h.substring(2, 4), 16);
  const b = parseInt(h.substring(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

// Deterministic string hash (djb2) - same input always produces same output.
const hashString = (str = '') => {
  let hash = 5381;
  for (let i = 0; i < str.length; i++) {
    hash = (hash * 33) ^ str.charCodeAt(i);
  }
  return Math.abs(hash);
};

/**
 * getTechStackColor(tech)
 * Returns a style object { color, backgroundColor, borderColor } for a tag.
 * - Known technologies map to their official ecosystem-inspired colors.
 * - Unknown technologies get a deterministic, visually balanced color
 *   generated via hashing, so the same tech always renders the same color
 *   and new/admin-added tech stacks "just work" without code changes.
 */
const getTechStackColor = (tech) => {
  if (!tech) {
    return {
      color: '#94A3B8',
      backgroundColor: 'rgba(148, 163, 184, 0.1)',
      borderColor: 'rgba(148, 163, 184, 0.2)',
    };
  }

  const key = normalizeTechKey(tech);
  const knownHex = KNOWN_TECH_HEX[key];

  if (knownHex) {
    return {
      color: knownHex,
      backgroundColor: hexToRgba(knownHex, 0.1),
      borderColor: hexToRgba(knownHex, 0.25),
    };
  }

  // Fallback: deterministic hash -> hue, tuned for dark-theme contrast.
  const hue = hashString(key) % 360;
  const saturation = 70;
  const lightness = 65; // bright enough to read on dark backgrounds

  return {
    color: `hsl(${hue}, ${saturation}%, ${lightness}%)`,
    backgroundColor: `hsla(${hue}, ${saturation}%, ${lightness}%, 0.1)`,
    borderColor: `hsla(${hue}, ${saturation}%, ${lightness}%, 0.25)`,
  };
};

/* ------------------------------------------------------------------ */

const getCategoryIcon = (category) => {
  switch (category) {
    case 'mobile': return <DevicePhoneMobileIcon className="w-10 h-10 text-accent-cyan/40" />;
    case 'backend': return <ServerIcon className="w-10 h-10 text-accent-cyan/40" />;
    default: return <ComputerDesktopIcon className="w-10 h-10 text-accent-cyan/40" />;
  }
};

const TechTag = ({ tech }) => {
  const { color, backgroundColor, borderColor } = getTechStackColor(tech);
  return (
    <span
      style={{ color, backgroundColor, borderColor }}
      className="text-xs px-2 py-1 rounded border font-mono transition-all duration-200 hover:scale-105 hover:shadow-sm"
    >
      {tech}
    </span>
  );
};

const ProjectCard = ({ project, index }) => {
  const [expanded, setExpanded] = useState(false);

  const imageUrl = project.image
    ? project.image.startsWith('http') ? project.image : `${process.env.REACT_APP_API_URL?.replace('/api', '') || ''}/uploads/${project.image.split('/').pop()}`
    : null;

  const techStack = project.techStack || [];
  const visibleTech = techStack.slice(0, 5);
  const hiddenTech = techStack.slice(5);
  const hasOverflow = hiddenTech.length > 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="animated-border glass-card rounded-2xl overflow-hidden glass-card-hover group"
    >
      {/* Project Image */}
      <div className="relative h-48 overflow-hidden bg-gradient-to-br from-dark-700 to-dark-600">
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

      {/* Content */}
      <div className="p-6 space-y-4">
        <h3 className="font-display font-bold text-xl text-white group-hover:text-accent-cyan transition-colors">
          {project.title}
        </h3>

        <p className="text-slate-400 text-sm font-body leading-relaxed line-clamp-2">
          {project.shortDescription || project.description}
        </p>

        {/* Tech Stack Tags */}
        <div className="flex flex-wrap gap-2">
          {visibleTech.map(tech => (
            <TechTag key={tech} tech={tech} />
          ))}

          <AnimatePresence initial={false}>
            {expanded && hasOverflow && hiddenTech.map(tech => (
              <motion.span
                key={tech}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.2 }}
              >
                <TechTag tech={tech} />
              </motion.span>
            ))}
          </AnimatePresence>

          {hasOverflow && (
            <motion.button
              type="button"
              onClick={() => setExpanded(prev => !prev)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="text-xs px-2 py-1 rounded border text-slate-500 bg-slate-500/10 border-slate-500/20 font-mono transition-all duration-200 hover:scale-105 hover:shadow-sm flex items-center gap-1"
            >
              {expanded ? (
                <>
                  <ChevronUpIcon className="w-3 h-3" />
                  Show Less
                </>
              ) : (
                <>
                  +{hiddenTech.length}
                  <ChevronDownIcon className="w-3 h-3" />
                </>
              )}
            </motion.button>
          )}
        </div>

        {/* Links */}
        <div className="flex gap-3 pt-2">
          {project.liveUrl && project.liveUrl !== '#' && (
            <motion.a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.05 }}
              className="flex-1 text-center py-2 rounded-lg bg-accent-cyan text-dark-900 text-sm font-semibold font-display transition-all hover:shadow-lg hover:shadow-accent-cyan/25 flex items-center justify-center gap-1.5"
            >
              <ArrowTopRightOnSquareIcon className="w-4 h-4" />
              Live Demo
            </motion.a>
          )}
          {project.githubUrl && project.githubUrl !== '#' && (
            <motion.a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.05 }}
              className="flex-1 text-center py-2 rounded-lg border border-white/15 text-slate-300 text-sm font-semibold font-display hover:border-white/30 hover:text-white transition-all flex items-center justify-center gap-1.5"
            >
              <CodeBracketIcon className="w-4 h-4" />
              GitHub
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
    let cancelled = false;

    // CHANGED (perf fix): cachedGet returns cached data instantly on repeat
    // visits within the same tab session (no skeleton, no wait), while
    // silently revalidating in the background. On a true cold load it falls
    // through to a normal request with built-in retry/backoff, so a slow or
    // just-woken-up backend doesn't surface as an empty/error state — it
    // either shows the cached projects or the sample fallback, never a
    // dead-end requiring a manual refresh.
    const applyData = (rawData) => {
      if (cancelled) return;
      const data = rawData?.data || [];
      setProjects(data.length > 0 ? data : SAMPLE_PROJECTS);
    };

    const fetchProjects = async () => {
      try {
        const data = await cachedGet('/projects', {
          ttl: 60000,
          retries: 2,
          onUpdate: applyData,
        });
        applyData(data);
      } catch (err) {
        console.warn('Could not fetch projects, using samples:', err.message);
        if (!cancelled) setProjects(SAMPLE_PROJECTS);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    fetchProjects();

    return () => {
      cancelled = true;
    };
  }, []);

  const filtered = filter === 'All' ? projects : projects.filter(p => p.category === filter);

  return (
    <section id="projects" className="section-padding bg-dark-800 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-accent-pink/5 rounded-full blur-3xl" />

      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="font-mono text-accent-cyan text-sm tracking-widest">04. WORK</span>
          <h2 className="font-display font-bold text-4xl md:text-5xl mt-2 text-white">
            Featured <span className="gradient-text">Projects</span>
          </h2>
          <p className="text-slate-400 mt-4 font-body max-w-xl mx-auto">
            A selection of projects that showcase my skills and problem-solving approach
          </p>
        </motion.div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {CATEGORY_FILTERS.map(cat => (
            <motion.button
              key={cat}
              onClick={() => setFilter(cat)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`px-4 py-2 rounded-full text-sm font-mono capitalize transition-all ${
                filter === cat
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
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {filtered.length === 0 ? (
                <div className="col-span-3 text-center py-16 text-slate-500 font-body">
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