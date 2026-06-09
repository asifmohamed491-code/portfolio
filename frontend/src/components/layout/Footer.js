/**
 * Footer
 * RESPONSIVE FIXES:
 * - Added footer-inner class so CSS can adjust gap and text-align on 320–480px
 * - Social icon gap: gap-5 → gap-4 sm:gap-5 (saves 4px/icon on small screens)
 * - Tagline row: whitespace-nowrap prevents "CODE • CREATE • ELEVATE" from
 *   wrapping mid-bullet which looks broken
 * - Brand text: wraps naturally but gradient text won't clip thanks to
 *   overflow:visible on the span
 */

import React from 'react';
import { motion } from 'framer-motion';
import { HeartIcon } from '@heroicons/react/24/solid';
import { FaGithub, FaLinkedin, FaInstagram, FaEnvelope } from 'react-icons/fa';

const SOCIALS = [
  { Icon: FaGithub,    cls: 'social-github',    href: process.env.REACT_APP_GITHUB_URL   || '#', label: 'GitHub' },
  { Icon: FaLinkedin,  cls: 'social-linkedin',   href: process.env.REACT_APP_LINKEDIN_URL || '#', label: 'LinkedIn' },
  { Icon: FaInstagram, cls: 'social-instagram',  href: '#', label: 'Instagram' },
  { Icon: FaEnvelope,  cls: 'social-email',      href: `mailto:${process.env.REACT_APP_OWNER_EMAIL || '#'}`, label: 'Email' },
];

const Footer = () => {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-white/5 py-8 sm:py-10 px-4 sm:px-6">
      {/*
        FIX: footer-inner class — on 320–480px, gap is tightened and items
        are centered. flex-col md:flex-row is already correct for the layout.
      */}
      <div className="footer-inner max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3 sm:gap-4">

        {/* Brand */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="flex items-center gap-2 text-center md:text-left"
        >
          <span className="text-slate-500 text-xs sm:text-sm font-body">
            © {year}{' '}
            <span className="gradient-text font-semibold">
              {process.env.REACT_APP_OWNER_NAME || 'Mohamed Asif'}
            </span>
            {' '}· All rights reserved
          </span>
        </motion.div>

        {/* Social Icons */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="flex items-center gap-4 sm:gap-5"
        >
          {SOCIALS.map(({ Icon, cls, href, label }) => (
            <a
              key={label}
              href={href}
              target={href.startsWith('http') ? '_blank' : undefined}
              rel="noopener noreferrer"
              aria-label={label}
              className={`text-slate-500 transition-all duration-200 ${cls}`}
            >
              <Icon className="w-5 h-5" />
            </a>
          ))}
        </motion.div>

        {/* Tagline — whitespace-nowrap keeps it on one line */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="text-slate-600 text-xs font-mono flex items-center gap-1.5 whitespace-nowrap"
        >
          CODE &bull; CREATE &bull; ELEVATE
          <HeartIcon className="w-3 h-3 text-red-400 ml-1 flex-shrink-0" />
        </motion.p>
      </div>
    </footer>
  );
};

export default Footer;
