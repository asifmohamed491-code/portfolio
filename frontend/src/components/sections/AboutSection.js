/**
 * About Section
 * RESPONSIVE FIXES:
 * - Avatar wrapper uses about-avatar-wrapper class: clamp(180px, 45vw, 256px)
 *   Prevents the 256px circle from nearly filling the 320px screen
 * - Grid gap reduced on mobile via about-grid class
 * - Stats cards: stat-value class for fluid font size
 * - Highlight items: flex-shrink-0 on icon prevents squish; text wraps cleanly
 * - "Let's Work Together" button: w-full on mobile, auto on larger screens
 * - lg:mx-0 on avatar: on mobile (single column), it stays centered
 */

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  BoltIcon,
  GlobeAltIcon,
  DevicePhoneMobileIcon,
  UserCircleIcon,
} from '@heroicons/react/24/outline';
import api from '../../utils/api';

const STATS = [
  { label: 'Projects Built', value: '8+' },
  { label: 'Technologies', value: '15+' },
  { label: 'GitHub Commits', value: '100+' },
  { label: 'Learning Mode', value: '∞' },
];

const HIGHLIGHTS = [
  { Icon: BoltIcon, text: 'Fast & responsive web development' },
  { Icon: UserCircleIcon, text: 'Clean UI with modern design' },
  { Icon: DevicePhoneMobileIcon, text: 'MERN stack project building' },
  { Icon: GlobeAltIcon, text: 'Always exploring and learning' },
];

const fadeInLeft  = { hidden: { opacity: 0, x: -40 }, visible: { opacity: 1, x: 0, transition: { duration: 0.7 } } };
const fadeInRight = { hidden: { opacity: 0, x:  40 }, visible: { opacity: 1, x: 0, transition: { duration: 0.7 } } };

const AboutSection = () => {
  const [photoUrl, setPhotoUrl] = useState(null);

  useEffect(() => {
    api.get('/about/photo')
      .then(res => {
        // url is always a full Cloudinary https:// URL
        if (res.data?.exists && res.data.url) setPhotoUrl(res.data.url);
      })
      .catch(() => {});
  }, []);

  return (
    <section id="about" className="section-padding bg-dark-800 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-accent-purple/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10 sm:mb-16"
        >
          <span className="font-mono text-accent-cyan text-sm tracking-widest">02. ABOUT</span>
          {/* FIX: fluid heading size — was text-4xl md:text-5xl, now uses clamp */}
          <h2
            className="font-display font-bold mt-2 text-white"
            style={{ fontSize: 'clamp(1.75rem, 5vw, 3rem)' }}
          >
            About <span className="gradient-text">Me</span>
          </h2>
        </motion.div>

        {/*
          FIX: Added about-grid class — CSS reduces gap from gap-16 (4rem)
          to 2.5rem on tablet and 2rem on mobile. Single column stacks
          naturally via lg:grid-cols-2.
        */}
        <div className="about-grid grid lg:grid-cols-2 gap-16 items-center">
          {/* Left: Photo + Stats */}
          <motion.div
            variants={fadeInLeft}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="space-y-6 sm:space-y-8"
          >
            {/*
              FIX: about-avatar-wrapper uses clamp() width/height so the
              circle scales down on narrow screens. On desktop it stays 256px.
              mx-auto centers it; lg:mx-0 left-aligns on desktop.
            */}
            <div className="about-avatar-wrapper mx-auto lg:mx-0">
              <div className="absolute inset-0 rounded-full border-2 border-accent-cyan/20 animate-spin-slow" />
              <div
                className="absolute rounded-full border border-accent-purple/30 animate-spin-slow"
                style={{ inset: '1rem', animationDirection: 'reverse', animationDuration: '15s' }}
              />
              <div className="absolute rounded-full overflow-hidden bg-gradient-to-br from-accent-cyan/20 via-accent-purple/20 to-accent-pink/20 flex items-center justify-center" style={{ inset: '2rem' }}>
                {photoUrl ? (
                  <img
                    src={photoUrl}
                    alt="Mohamed Asif"
                    className="w-full h-full object-cover"
                    onError={() => setPhotoUrl(null)}
                  />
                ) : (
                  <UserCircleIcon className="w-16 h-16 sm:w-24 sm:h-24 text-accent-cyan/60" />
                )}
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              {STATS.map(({ label, value }) => (
                <motion.div
                  key={label}
                  whileHover={{ scale: 1.05, y: -2 }}
                  className="glass-card rounded-xl p-3 sm:p-4 text-center transition-all duration-300 hover:border-accent-cyan/30"
                >
                  {/* FIX: stat-value class for fluid font size */}
                  <div className="stat-value font-display font-bold gradient-text">{value}</div>
                  {/* FIX: smaller label text on mobile */}
                  <div className="text-slate-400 text-xs sm:text-sm mt-1 font-body">{label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right: Bio */}
          <motion.div
            variants={fadeInRight}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="space-y-5 sm:space-y-6"
          >
            {/* FIX: Reduced text-lg to responsive sizing — text-base on mobile, text-lg on sm+ */}
            <div className="space-y-4 text-slate-300 font-body leading-relaxed text-base sm:text-lg">
              <p>
                Hey! I&apos;m{' '}
                <span className="text-accent-cyan font-semibold">
                  {'Mohamed Asif'}
                </span>
                , a passionate Full Stack Developer who loves building things for the web. I specialize in creating
                <span className="text-white font-medium"> scalable, performant applications</span> using modern technologies.
              </p>
              <p>
                With expertise in the <span className="gradient-text font-semibold">MERN stack</span>, I bridge the gap between elegant front-end design and robust back-end architecture. I believe great software is about solving real problems with clean, maintainable code.
              </p>
              <p>
                When I&apos;m not coding, you&apos;ll find me exploring new tech, contributing to open source, or leveling up my skills. I&apos;m always excited to tackle new challenges and build meaningful products.
              </p>
            </div>

            {/* Highlights */}
            <div className="space-y-3 pt-1 sm:pt-2">
              {HIGHLIGHTS.map(({ Icon, text }) => (
                <motion.div
                  key={text}
                  whileHover={{ x: 6 }}
                  className="flex items-start sm:items-center gap-3 text-slate-400 hover:text-slate-300 transition-colors"
                >
                  {/* FIX: flex-shrink-0 prevents icon from being squished when text wraps */}
                  <div className="w-8 h-8 rounded-lg bg-accent-cyan/10 border border-accent-cyan/20 flex items-center justify-center flex-shrink-0 mt-0.5 sm:mt-0">
                    <Icon className="w-4 h-4 text-accent-cyan" />
                  </div>
                  <span className="font-body text-sm leading-snug">{text}</span>
                </motion.div>
              ))}
            </div>

            {/*
              FIX: Button is w-full on mobile so it doesn't stick out past container.
              sm:w-auto restores auto width on larger screens.
            */}
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
              className="btn-primary mt-4 w-full sm:w-auto"
            >
              Let&apos;s Connect →
            </motion.button>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
