/**
 * Hero Section
 * RESPONSIVE FIXES:
 * - Hero title uses clamp() via hero-title class: 1.8rem on 320px → 5rem on 1440px
 * - TypeAnimation container uses hero-typewriter class (auto height, no clip)
 * - Subtitle uses hero-subtitle class for fluid sizing
 * - CTA buttons use hero-cta-group (flex-wrap, full-width on very small screens)
 * - Social icons use hero-socials (wrap + clamp gap)
 * - px-6 → px-4 sm:px-6 to give more room on 320px
 * - Removed fixed h-12 on typewriter row — caused text clip on small screens
 * - Decorative blobs use pointer-events-none and won't affect layout (overflow-hidden on section)
 */

import React from 'react';
import { motion } from 'framer-motion';
import { TypeAnimation } from 'react-type-animation';
import {
  RocketLaunchIcon,
  DocumentArrowDownIcon,
} from '@heroicons/react/24/outline';
import { SiGithub } from 'react-icons/si';
import { FaLinkedin } from 'react-icons/fa';
import { HiOutlineMail } from 'react-icons/hi';

const OWNER_NAME = process.env.REACT_APP_OWNER_NAME || 'Mohamed Asif';

const Particle = ({ style }) => (
  <motion.div
    className="absolute w-1 h-1 rounded-full bg-accent-cyan/60"
    style={style}
    animate={{ y: [0, -30, 0], opacity: [0.6, 1, 0.6] }}
    transition={{ duration: 3 + Math.random() * 2, repeat: Infinity, ease: 'easeInOut', delay: Math.random() * 2 }}
  />
);

const HeroSection = () => {
  const scrollToContact = () => {
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleResumeDownload = async () => {
    try {
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
      const response = await fetch(`${apiUrl}/resume/status`);
      const data = await response.json();
      if (!data.exists || !data.url) throw new Error('Resume not available');
      const a = document.createElement('a');
      a.href = data.url;
      a.download = data.originalName || 'resume.pdf';
      a.target = '_blank';
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (err) {
      alert('Resume is not available yet. Please check back later.');
    }
  };

  // FIX: Reduce particle count on mobile via a small helper
  const particleCount = typeof window !== 'undefined' && window.innerWidth < 480 ? 8 : 20;
  const particles = Array.from({ length: particleCount }, (_, i) => ({
    id: i,
    style: { left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%` },
  }));

  const socials = [
    { label: 'GitHub', url: process.env.REACT_APP_GITHUB_URL || '#', Icon: SiGithub, cls: 'social-github' },
    { label: 'LinkedIn', url: process.env.REACT_APP_LINKEDIN_URL || '#', Icon: FaLinkedin, cls: 'social-linkedin' },
    { label: 'Email', url: `mailto:${process.env.REACT_APP_OWNER_EMAIL || '#'}`, Icon: HiOutlineMail, cls: 'social-email' },
  ];

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-dark-900"
    >
      <div className="absolute inset-0 bg-grid opacity-40" />

      {/* FIX: Decorative blobs — kept outside content flow, clamped to viewport */}
      <div className="absolute top-1/4 -left-40 w-96 h-96 bg-accent-cyan/10 rounded-full blur-3xl animate-pulse-slow pointer-events-none" />
      <div className="absolute bottom-1/4 -right-40 w-96 h-96 bg-accent-purple/10 rounded-full blur-3xl animate-pulse-slow pointer-events-none" style={{ animationDelay: '2s' }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent-pink/5 rounded-full blur-3xl pointer-events-none" />

      {particles.map(p => <Particle key={p.id} style={p.style} />)}

      {/*
        FIX: Changed px-6 to px-4 sm:px-6 — on 320px, px-6 (24px each side)
        leaves only 272px of usable width. px-4 (16px each side) gives 288px.
        max-w-5xl with mx-auto keeps it contained on large screens.
      */}
      <div className="relative z-10 text-center px-4 sm:px-6 w-full max-w-5xl mx-auto">

        {/* Available badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-accent-cyan/30 bg-accent-cyan/5 mb-6 sm:mb-8"
        >
          <span className="w-2 h-2 rounded-full bg-accent-cyan animate-pulse flex-shrink-0" />
          {/* FIX: text-xs on 320px, text-sm on 480px+ */}
          <span className="text-accent-cyan text-xs sm:text-sm font-mono whitespace-nowrap">Available for hire</span>
        </motion.div>

        {/*
          FIX: Removed fixed text-5xl md:text-7xl lg:text-8xl.
          Using hero-title class (defined in index.css) with clamp() for
          truly fluid scaling across ALL viewport widths.
          overflow-wrap: break-word is set in CSS — "Mohamed Asif" will never
          be cut off or trigger horizontal scroll.
        */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="hero-title font-display font-bold mb-4"
        >
          Hi, I&apos;m{' '}
          <span className="gradient-text text-glow">{OWNER_NAME}</span>
        </motion.h1>

        {/*
          FIX: Removed fixed h-12 — it was clipping the TypeAnimation text on
          small screens at larger font sizes. Changed to hero-typewriter class
          which sets min-height and auto height.
        */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="hero-typewriter font-display text-slate-300 mb-6"
        >
          <TypeAnimation
            sequence={[
              'Full Stack Developer', 2000,
              'MERN Stack Expert', 2000,
              'UI/UX Enthusiast', 2000,
              'Problem Solver', 2000,
              'Open Source Contributor', 2000,
            ]}
            wrapper="span"
            speed={50}
            repeat={Infinity}
            className="text-accent-cyan"
          />
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="hero-subtitle text-slate-400 max-w-2xl mx-auto mb-8 sm:mb-10 font-body leading-relaxed"
        >
          I build fast, responsive and modern <br/>
          web applications with React,
          Next.js and Node.js.
        </motion.p>

        {/*
          FIX: Replaced flex-col sm:flex-row with hero-cta-group class.
          On 320–479px: buttons stack vertically, each takes full width (max 280px).
          On 480px+: buttons sit side by side as before.
        */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5 }}
          className="hero-cta-group"
        >
          <motion.button
            onClick={scrollToContact}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="btn-primary font-display inline-flex items-center justify-center gap-2"
          >
            <RocketLaunchIcon className="w-5 h-5 flex-shrink-0" />
            Hire Me
          </motion.button>
          <motion.button
            onClick={handleResumeDownload}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="btn-outline font-display inline-flex items-center justify-center gap-2"
          >
            <div className='flex items-center justify-center gap-2'>
              <DocumentArrowDownIcon className="w-5 h-5 shrink-0" />
              Download Resume
            </div>
          </motion.button>
        </motion.div>

        {/*
          FIX: Replaced gap-6 with hero-socials class — uses clamp() for gap
          and flex-wrap so icons stack to a second row on 320px instead of
          overflowing.
        */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.7 }}
          className="hero-socials mt-10 sm:mt-12"
        >
          {socials.map(({ label, url, Icon, cls }) => (
            <motion.a
              key={label}
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ y: -3 }}
              className={`flex items-center gap-2 text-slate-500 transition-colors text-sm font-mono ${cls}`}
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              <span>{label}</span>
            </motion.a>
          ))}
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="text-slate-600 text-xs font-mono">scroll</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="w-0.5 h-8 bg-gradient-to-b from-accent-cyan to-transparent rounded-full"
        />
      </motion.div>
    </section>
  );
};

export default HeroSection;
