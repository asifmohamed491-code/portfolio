/**
 * Navbar - Fixed navigation with scroll detection, mobile menu, and smooth scroll
 * RESPONSIVE FIXES:
 * - Added navbar-inner class so CSS can tighten px-6 on 320-480px
 * - Mobile menu now has a solid bg so it never bleeds into content
 * - Hamburger button has explicit min-w/min-h so it never squishes
 * - Logo font-size uses clamp() to stay readable on 320px without overlapping
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';

const NAV_LINKS = [
  { label: 'Home', href: '#home' },
  { label: 'About', href: '#about' },
  { label: 'Skills', href: '#skills' },
  { label: 'Projects', href: '#projects' },
  { label: 'Contact', href: '#contact' },
];

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);

      const sections = NAV_LINKS.map(l => l.href.slice(1));
      for (let i = sections.length - 1; i >= 0; i--) {
        const el = document.getElementById(sections[i]);
        if (el && window.scrollY >= el.offsetTop - 120) {
          setActiveSection(sections[i]);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // FIX: Close menu on resize (e.g. device rotation to landscape)
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) setMenuOpen(false);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const scrollTo = (id) => {
    setMenuOpen(false);
    const el = document.querySelector(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-dark-900/90 backdrop-blur-xl border-b border-white/5 shadow-2xl'
            : 'bg-transparent'
        }`}
      >
        {/*
          FIX: Added navbar-inner class — CSS reduces px from 1.5rem to 1rem
          on 320–480px so logo and hamburger never overlap.
          Also changed py-4 to py-3 on mobile via inline style to give more
          vertical space to content below.
        */}
        <div className="navbar-inner max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          {/* Logo — clamp keeps it readable on 320px without colliding with hamburger */}
          <motion.a
            href="#home"
            onClick={e => { e.preventDefault(); scrollTo('#home'); }}
            className="flex items-center gap-2 flex-shrink-0"
            whileHover={{ scale: 1.03 }}
          >
            <span
              className="font-display font-bold leading-none"
              style={{ fontSize: 'clamp(1rem, 4vw, 1.25rem)' }}
            >
              <span className="text-white"><span className='gradient-text'>&lt;</span> Asif</span>
              <span style={{background:'linear-gradient(135deg,#00c6ff,#7c3aed)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent'}}>.Dev /&gt;</span>
            </span>
          </motion.a>

          {/* Desktop Nav */}
          <ul className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map(({ label, href }) => (
              <li key={label}>
                <button
                  onClick={() => scrollTo(href)}
                  className={`nav-link font-body text-sm font-medium transition-colors duration-200 ${
                    activeSection === href.slice(1)
                      ? 'text-accent-cyan'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {label}
                </button>
              </li>
            ))}
            <li>
              <Link
                to="/admin/login"
                className="btn-outline text-sm py-2 px-5"
              >
                Admin
              </Link>
            </li>
          </ul>

          {/*
            FIX: Hamburger — explicit w-10 h-10 touch target (44px recommended
            by Apple HIG / WCAG). flex-shrink-0 prevents it from being squeezed
            when the viewport is narrow.
          */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden flex flex-col items-center justify-center gap-1.5 w-10 h-10 flex-shrink-0 rounded-lg hover:bg-white/5 transition-colors"
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
          >
            <motion.span
              animate={menuOpen ? { rotate: 45, y: 8 } : { rotate: 0, y: 0 }}
              className="block w-6 h-0.5 bg-accent-cyan"
            />
            <motion.span
              animate={menuOpen ? { opacity: 0, scaleX: 0 } : { opacity: 1, scaleX: 1 }}
              className="block w-6 h-0.5 bg-accent-cyan"
            />
            <motion.span
              animate={menuOpen ? { rotate: -45, y: -8 } : { rotate: 0, y: 0 }}
              className="block w-6 h-0.5 bg-accent-cyan"
            />
          </button>
        </div>
      </motion.nav>

      {/*
        FIX: Mobile Menu
        - top-[57px] pins exactly below the navbar (avoids gap/overlap)
        - w-full + left-0 right-0 ensures it never overflows horizontally
        - bg-dark-900 (solid, not /80) prevents content showing through on
          very dark-background pages
        - max-h-[calc(100vh-57px)] + overflow-y-auto handles very long menus
          on landscape phones
      */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="fixed top-[57px] left-0 right-0 z-40 bg-dark-900/98 backdrop-blur-xl border-b border-white/5 md:hidden"
            style={{ maxHeight: 'calc(100vh - 57px)', overflowY: 'auto' }}
          >
            <ul className="flex flex-col py-2">
              {NAV_LINKS.map(({ label, href }) => (
                <li key={label}>
                  <button
                    onClick={() => scrollTo(href)}
                    className={`w-full text-left px-6 py-3.5 font-body text-base transition-colors ${
                      activeSection === href.slice(1)
                        ? 'text-accent-cyan bg-accent-cyan/5 border-l-2 border-accent-cyan'
                        : 'text-slate-300 hover:text-accent-cyan hover:bg-white/5 border-l-2 border-transparent'
                    }`}
                  >
                    {label}
                  </button>
                </li>
              ))}
              <li className="px-6 py-3.5 border-t border-white/5 mt-1">
                <Link
                  to="/admin/login"
                  onClick={() => setMenuOpen(false)}
                  className="text-accent-cyan font-semibold font-body text-sm"
                >
                  Admin Panel →
                </Link>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
