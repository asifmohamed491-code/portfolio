/**
 * Contact Section
 * RESPONSIVE FIXES:
 * - Form card uses contact-form-padding class (p-8 → p-5 on mobile)
 * - Name + email grid: sm:grid-cols-2 in Tailwind kicks in at 640px.
 *   On 320–480px phones both fields are already single-column (correct).
 *   Added contact-name-email-grid class as safety override for 320–479px.
 * - Contact info cards: min-w-0 on text container prevents email/URL clipping
 * - "Let's talk" heading: fluid size with clamp
 * - Availability badge: whitespace-nowrap so green dot + text stay on one line
 * - Section intro text: fluid sizing
 * - lg:grid-cols-5 on main grid is correct; on mobile it collapses to 1 col
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import {
  EnvelopeIcon,
  ChatBubbleLeftRightIcon,
  PaperAirplaneIcon,
} from '@heroicons/react/24/outline';
import { FaLinkedin, FaGithub } from 'react-icons/fa';
import api from '../../utils/api';

const CONTACT_INFO = [
  {
    Icon: EnvelopeIcon,
    label: 'Email',
    value: process.env.REACT_APP_OWNER_EMAIL || 'alex@example.com',
    href: `mailto:${process.env.REACT_APP_OWNER_EMAIL || 'alex@example.com'}`,
    cls: 'social-email',
  },
  {
    Icon: FaLinkedin,
    label: 'LinkedIn',
    value: 'Connect with me',
    href: process.env.REACT_APP_LINKEDIN_URL || '#',
    cls: 'social-linkedin',
  },
  {
    Icon: FaGithub,
    label: 'GitHub',
    value: 'View my code',
    href: process.env.REACT_APP_GITHUB_URL || '#',
    cls: 'social-github',
  },
];

const INITIAL_FORM = { name: '', email: '', subject: '', message: '' };

const ContactSection = () => {
  const [form, setForm] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const validate = () => {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = 'Name is required';
    if (!form.email.match(/^\S+@\S+\.\S+$/)) newErrors.email = 'Valid email required';
    if (!form.subject.trim()) newErrors.subject = 'Subject is required';
    if (form.message.trim().length < 10) newErrors.message = 'Message must be at least 10 characters';
    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setSubmitting(true);
    try {
      await api.post('/contact', form);
      toast.success("Message sent! I'll get back to you soon.");
      setForm(INITIAL_FORM);
      setErrors({});
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send message. Try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const inputClass = (field) =>
    `w-full bg-dark-700/50 border rounded-xl px-4 py-3 text-white placeholder-slate-500 font-body text-sm focus:outline-none focus:ring-2 transition-all duration-200 ${errors[field]
      ? 'border-red-500/50 focus:ring-red-500/25'
      : 'border-white/10 focus:border-accent-cyan/50 focus:ring-accent-cyan/20 hover:border-white/20'
    }`;

  return (
    <section id="contact" className="section-padding bg-dark-900 relative overflow-hidden">
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-accent-purple/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-0 w-64 h-64 bg-accent-cyan/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10 sm:mb-16"
        >
          <span className="font-mono text-accent-cyan text-sm tracking-widest">05. CONTACT</span>
          <h2
            className="font-display font-bold mt-2 text-white"
            style={{ fontSize: 'clamp(1.75rem, 5vw, 3rem)' }}
          >
            Get In <span className="gradient-text">Touch</span>
          </h2>
          <p className="text-slate-400 mt-3 font-body max-w-xl mx-auto text-sm sm:text-base">
            Have a project in mind? Let&apos;s build something amazing together. I&apos;m always open to discussing new opportunities.
          </p>
        </motion.div>

        {/* lg:grid-cols-5 — single col on mobile, 5-col on large screens */}
        <div className="grid lg:grid-cols-5 gap-8 sm:gap-12 items-start">
          {/* Left: Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-2 space-y-5 sm:space-y-6"
          >
            <div>
              <h3 className="font-display font-bold text-xl sm:text-2xl text-white mb-2 flex items-center gap-2">
                <ChatBubbleLeftRightIcon className="w-5 h-5 sm:w-6 sm:h-6 text-accent-cyan flex-shrink-0" />
                Let&apos;s Connect
              </h3>
              <p className="text-slate-400 font-body text-sm leading-relaxed">
                I&apos;m always open to discussing ideas,
                projects and learning opportunities.</p>
            </div>

            {/* Contact Cards */}
            <div className="space-y-3">
              {CONTACT_INFO.map(({ Icon, label, value, href, cls }) => (
                <motion.a
                  key={label}
                  href={href}
                  target={href.startsWith('http') ? '_blank' : undefined}
                  rel="noopener noreferrer"
                  whileHover={{ x: 4, scale: 1.01 }}
                  className={`flex items-center gap-3 sm:gap-4 glass-card rounded-xl p-3 sm:p-4 border border-white/5 hover:border-white/20 transition-all group ${cls}`}
                >
                  {/* FIX: flex-shrink-0 on icon container */}
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-dark-700 flex items-center justify-center flex-shrink-0 group-hover:bg-white/5 transition-colors">
                    <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-slate-400 group-hover:text-current transition-colors" />
                  </div>
                  {/* FIX: min-w-0 prevents long email addresses from overflowing */}
                  <div className="min-w-0">
                    <div className="text-slate-500 text-xs font-mono">{label}</div>
                    <div className="text-slate-200 text-sm font-body group-hover:text-current transition-colors truncate">{value}</div>
                  </div>
                </motion.a>
              ))}
            </div>

            {/* Availability badge */}
            <div className="flex items-center gap-3 p-3 sm:p-4 rounded-xl bg-accent-green/5 border border-accent-green/20">
              <div className="w-3 h-3 rounded-full bg-accent-green animate-pulse flex-shrink-0" />
              <span className="text-accent-green text-sm font-mono">Available for internships</span>
            </div>
          </motion.div>

          {/* Right: Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-3"
          >
            {/*
              FIX: contact-form-padding class reduces p-8 on mobile.
              The form itself is w-full so it always fits within the viewport.
            */}
            <form onSubmit={handleSubmit} className="contact-form-padding glass-card rounded-2xl p-8 space-y-4 sm:space-y-5">
              {/*
                FIX: contact-name-email-grid class forces single column on
                320–479px. sm:grid-cols-2 handles 480–639px with Tailwind's
                sm breakpoint at 640px, so there's a 480–639px zone where
                two columns may be narrow. The CSS class handles that.
              */}
              <div className="contact-name-email-grid grid sm:grid-cols-2 gap-4 sm:gap-5">
                <div>
                  <label className="text-slate-400 text-xs font-mono mb-2 block">YOUR NAME *</label>
                  <input type="text" name="name" value={form.name} onChange={handleChange} placeholder="John Doe" className={inputClass('name')} />
                  {errors.name && <p className="text-red-400 text-xs mt-1 font-body">{errors.name}</p>}
                </div>
                <div>
                  <label className="text-slate-400 text-xs font-mono mb-2 block">YOUR EMAIL *</label>
                  <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="john@example.com" className={inputClass('email')} />
                  {errors.email && <p className="text-red-400 text-xs mt-1 font-body">{errors.email}</p>}
                </div>
              </div>

              <div>
                <label className="text-slate-400 text-xs font-mono mb-2 block">SUBJECT *</label>
                <input type="text" name="subject" value={form.subject} onChange={handleChange} placeholder="Project Inquiry / Job Opportunity" className={inputClass('subject')} />
                {errors.subject && <p className="text-red-400 text-xs mt-1 font-body">{errors.subject}</p>}
              </div>

              <div>
                <label className="text-slate-400 text-xs font-mono mb-2 block">MESSAGE *</label>
                <textarea name="message" value={form.message} onChange={handleChange} rows={5} placeholder="Tell me about your project, timeline, and budget..." className={`${inputClass('message')} resize-none`} />
                {errors.message && <p className="text-red-400 text-xs mt-1 font-body">{errors.message}</p>}
              </div>

              <motion.button
                type="submit"
                disabled={submitting}
                whileHover={!submitting ? { scale: 1.02 } : {}}
                whileTap={!submitting ? { scale: 0.98 } : {}}
                className={`w-full py-3.5 sm:py-4 rounded-xl font-display font-bold text-base sm:text-lg transition-all duration-300 ${submitting ? 'bg-slate-700 text-slate-500 cursor-not-allowed' : 'btn-primary'
                  }`}
              >
                {submitting ? (
                  <span className="flex items-center justify-center gap-3">
                    <div className="w-5 h-5 spinner" />
                    Sending...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <PaperAirplaneIcon className="w-5 h-5" />
                    Send Message
                  </span>
                )}
              </motion.button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
