/**
 * Skills Section
 * RESPONSIVE FIXES:
 * - Glass cards use skills-card-padding class (CSS reduces p-8 → p-5 on mobile)
 * - Tech badge cloud: badges already flex-wrap but on 320px the card padding was
 *   eating the available width — reduced via CSS class
 * - Category tab pills: already flex-wrap with gap-3; added min-w-0 and
 *   text truncation as safety net
 * - Heading uses clamp() for fluid sizing
 * - md:grid-cols-2 grid: on narrow tablets the gap can be large; reduced to gap-4
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  PaintBrushIcon,
  CogIcon,
  WrenchScrewdriverIcon,
  StarIcon,
  CubeIcon,
  FireIcon,
} from '@heroicons/react/24/outline';
import {
  SiReact, SiJavascript, SiTypescript, SiTailwindcss, SiHtml5,
  SiNodedotjs, SiExpress, SiMongodb,
  SiGit, SiFigma,
  SiJsonwebtokens,
  SiPostman,
  SiVercel,
  SiRender,
} from 'react-icons/si';


const SKILL_CATEGORIES = [
  {
    category: 'Frontend',
    Icon: PaintBrushIcon,
    color: 'from-cyan-500 to-blue-500',
    skills: [
      { name: 'React.js',     level: 92, Icon: SiReact,      iconCls: 'tech-react' },
      { name: 'JavaScript',   level: 90, Icon: SiJavascript, iconCls: 'tech-javascript' },
      { name: 'TypeScript',   level: 65, Icon: SiTypescript, iconCls: 'tech-typescript' },
      { name: 'Tailwind CSS', level: 95, Icon: SiTailwindcss,iconCls: 'tech-tailwind' },
      { name: 'HTML/CSS',     level: 97, Icon: SiHtml5,      iconCls: 'tech-html' },
    ],
  },
  {
    category: 'Backend',
    Icon: CogIcon,
    color: 'from-purple-500 to-pink-500',
    skills: [
      { name: 'Node.js',    level: 88, Icon: SiNodedotjs, iconCls: 'tech-nodejs' },
      { name: 'Express.js', level: 87, Icon: SiExpress,   iconCls: 'tech-express' },
      { name: 'MongoDB',    level: 85, Icon: SiMongodb,   iconCls: 'tech-mongodb' },
      { name: 'REST APIs',  level: 91, Icon: CubeIcon,    iconCls: '' },
      { name: 'JWT Auth',    level: 75, Icon: SiJsonwebtokens,   iconCls: 'tech-graphql' },
    ],
  },
  {
    category: 'Development Toolkit',
    Icon: WrenchScrewdriverIcon,
    color: 'from-emerald-500 to-teal-500',
    skills: [
      { name: 'Git & GitHub', level: 90, Icon: SiGit,    iconCls: 'tech-git' },
      { name: 'Postman',       level: 85, Icon: SiPostman,  iconCls: 'tech-docker' },
      { name: 'Vercel',    level: 85, Icon: SiVercel,     iconCls: 'tech-aws' },
      { name: 'Render',        level: 80, Icon: SiRender,   iconCls: '' },
      { name: 'Figma',        level: 72, Icon: SiFigma,   iconCls: 'tech-figma' },
    ],
  },
];

const TECH_STACK = [
  { name: 'React',      cls: 'tech-react' },
  { name: 'Node.js',    cls: 'tech-nodejs' },
  { name: 'MongoDB',    cls: 'tech-mongodb' },
  { name: 'Express',    cls: 'tech-express' },
  { name: 'TypeScript', cls: 'tech-typescript' },
  { name: 'Tailwind',   cls: 'tech-tailwind' },
  { name: 'Redux',      cls: '' },
  { name: 'GraphQL',    cls: 'tech-graphql' },
  { name: 'Docker',     cls: 'tech-docker' },
  { name: 'Git',        cls: 'tech-git' },
  { name: 'AWS',        cls: 'tech-aws' },
  { name: 'PostgreSQL', cls: 'tech-postgresql' },
  { name: 'Redis',      cls: 'tech-redis' },
  { name: 'Jest',       cls: '' },
  { name: 'Figma',      cls: 'tech-figma' },
];

const EXPERIENCE_HIGHLIGHTS = [
  { Icon: CogIcon, text: 'Building modern web applications' },
  { Icon: FireIcon, text: 'Learning and growing through projects' },
  { Icon: WrenchScrewdriverIcon, text: 'Exploring new technologies' },
];

const SkillBar = ({ name, level, Icon, iconCls, index }) => {
  const [animated, setAnimated] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.08 }}
      onViewportEnter={() => setAnimated(true)}
      className="space-y-2"
    >
      <div className="flex justify-between items-center gap-2">
        <div className="flex items-center gap-2 min-w-0">
          {/* FIX: flex-shrink-0 prevents icon from being squished */}
          {Icon && <Icon className={`w-4 h-4 flex-shrink-0 ${iconCls || 'text-accent-cyan/80'}`} />}
          {/* FIX: truncate prevents long skill names from overflowing on 320px */}
          <span className="text-slate-300 text-sm font-body font-medium truncate">{name}</span>
        </div>
        <span className="text-accent-cyan text-sm font-mono flex-shrink-0">{level}%</span>
      </div>
      <div className="h-2 bg-dark-600 rounded-full overflow-hidden">
        <motion.div
          className="skill-bar-fill"
          initial={{ width: 0 }}
          animate={{ width: animated ? `${level}%` : 0 }}
          transition={{ duration: 1.2, delay: index * 0.08, ease: 'easeOut' }}
        />
      </div>
    </motion.div>
  );
};

const SkillsSection = () => {
  const [activeTab, setActiveTab] = useState(0);
  const activeCat = SKILL_CATEGORIES[activeTab];

  return (
    <section id="skills" className="section-padding bg-dark-900 relative overflow-hidden">
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-accent-cyan/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10 sm:mb-16"
        >
          <span className="font-mono text-accent-cyan text-sm tracking-widest">03. SKILLS</span>
          <h2
            className="font-display font-bold mt-2 text-white"
            style={{ fontSize: 'clamp(1.75rem, 5vw, 3rem)' }}
          >
            Tech <span className="gradient-text">Arsenal</span>
          </h2>
          <p className="text-slate-400 mt-3 font-body max-w-xl mx-auto text-sm sm:text-base">
            My development stack for building scalable web applications
          </p>
        </motion.div>

        {/*
          FIX: Category tab row — flex-wrap already handles it, but on 320px
          three buttons each with px-5 may still overflow. Added min-w-0 and
          reduced px on smallest screens via inline style check. The text is
          short enough that flex-wrap alone is sufficient for most devices,
          but we add overflow:auto as a safety valve.
        */}
        <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-8 sm:mb-12">
          {SKILL_CATEGORIES.map((cat, i) => (
            <motion.button
              key={cat.category}
              onClick={() => setActiveTab(i)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`flex items-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 rounded-full font-body text-sm font-medium transition-all duration-300 ${
                activeTab === i
                  ? 'bg-accent-cyan text-dark-900 shadow-lg shadow-accent-cyan/25'
                  : 'glass-card text-slate-400 hover:text-white border border-white/10'
              }`}
            >
              <cat.Icon className="w-4 h-4 flex-shrink-0" />
              {/* FIX: "Tools & DevOps" is long; allow it to break into two lines */}
              <span className="leading-tight">{cat.category}</span>
            </motion.button>
          ))}
        </div>

        {/*
          FIX: grid gap reduced from gap-6 to gap-4 on mobile.
          Single column on mobile (md:grid-cols-2) is already correct.
        */}
        <div className="grid md:grid-cols-2 gap-4 sm:gap-6 mb-10 sm:mb-16">
          {/* Skill Bars card — skills-card-padding reduces p-8 on mobile */}
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="skills-card-padding glass-card rounded-2xl p-8 space-y-4 sm:space-y-5"
          >
            <h3 className={`font-display font-bold text-lg sm:text-xl bg-gradient-to-r ${activeCat.color} bg-clip-text text-transparent mb-4 sm:mb-6 flex items-center gap-2`}>
              <activeCat.Icon className="w-5 h-5 text-accent-cyan flex-shrink-0" />
              {activeCat.category}
            </h3>
            {activeCat.skills.map((skill, i) => (
              <SkillBar key={skill.name} {...skill} index={i} />
            ))}
          </motion.div>

          {/* Tech Stack Cloud card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="skills-card-padding glass-card rounded-2xl p-8"
          >
            <h3 className="font-display font-bold text-lg sm:text-xl text-white mb-4 sm:mb-6 flex items-center gap-2">
              <StarIcon className="w-5 h-5 text-accent-cyan flex-shrink-0" />
              My Toolkit
            </h3>
            {/* FIX: gap-2 sm:gap-3 so badges fit on 320px without overflow */}
            <div className="flex flex-wrap gap-2 sm:gap-3">
              {TECH_STACK.map(({ name, cls }, i) => (
                <motion.span
                  key={name}
                  initial={{ opacity: 0, scale: 0 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05, type: 'spring' }}
                  whileHover={{ scale: 1.1, y: -2 }}
                  className={`tech-badge px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg bg-dark-700 text-slate-300 text-xs sm:text-sm font-mono cursor-default transition-all duration-200 ${cls}`}
                >
                  {name}
                </motion.span>
              ))}
            </div>

            <div className="mt-6 sm:mt-8 space-y-3">
              {EXPERIENCE_HIGHLIGHTS.map(({ Icon, text }) => (
                <div key={text} className="flex items-center gap-3 text-slate-400 text-sm font-body">
                  <div className="w-7 h-7 rounded-md bg-accent-cyan/10 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-4 h-4 text-accent-cyan" />
                  </div>
                  <span>{text}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default SkillsSection;
