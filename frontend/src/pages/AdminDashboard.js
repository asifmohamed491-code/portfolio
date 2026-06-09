/**
 * Admin Dashboard - Full CRUD + Resume Management, emoji-free with icons
 */

import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import {
  ComputerDesktopIcon,
  StarIcon,
  EnvelopeIcon,
  BellIcon,
  ArrowTopRightOnSquareIcon,
  PencilSquareIcon,
  TrashIcon,
  PlusIcon,
  DocumentArrowUpIcon,
  DocumentArrowDownIcon,
  EyeIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  XMarkIcon,
  PhotoIcon,
  UserCircleIcon,
  ArrowRightOnRectangleIcon,
  HandRaisedIcon,
  DocumentTextIcon,
} from '@heroicons/react/24/outline';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';

// ─── Image URL Helper ────────────────────────────────────────────────────────
// All images are Cloudinary URLs (https://res.cloudinary.com/...).
// No local /uploads paths exist anymore.
const resolveImageUrl = (imagePath) => {
  if (!imagePath) return '';
  return imagePath; // Always a full Cloudinary https:// URL
};

// ─── Project Form Modal ───────────────────────────────────────────────────────
const ProjectModal = ({ project, onClose, onSave }) => {
  const isEdit = !!project?._id;
  const [form, setForm] = useState({
    title: project?.title || '',
    description: project?.description || '',
    shortDescription: project?.shortDescription || '',
    techStack: project?.techStack?.join(', ') || '',
    liveUrl: project?.liveUrl || '',
    githubUrl: project?.githubUrl || '',
    category: project?.category || 'fullstack',
    featured: project?.featured || false,
    image: project?.image || '',
  });
  const [saving, setSaving] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(() => resolveImageUrl(project?.image || ''));
  const fileRef = useRef();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
    const reader = new FileReader();
    reader.onload = () => setImagePreview(reader.result);
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.description.trim() || !form.techStack.trim()) {
      toast.error('Title, description, and tech stack are required.');
      return;
    }
    setSaving(true);
    try {
      const formData = new FormData();
      Object.entries(form).forEach(([key, val]) => formData.append(key, val));
      if (imageFile) formData.append('image', imageFile);
      let res;
      if (isEdit) {
        res = await api.put(`/projects/${project._id}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      } else {
        res = await api.post('/projects', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      }
      toast.success(res.data.message);
      onSave(res.data.data, isEdit);
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save project.');
    } finally {
      setSaving(false);
    }
  };

  const inputClass = 'w-full bg-dark-700/60 border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder-slate-500 font-body text-sm focus:outline-none focus:ring-2 focus:ring-accent-cyan/30 focus:border-accent-cyan/40 transition-all';
  const labelClass = 'text-slate-400 text-xs font-mono mb-1.5 block';

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4"
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        className="glass-card rounded-2xl border border-white/10 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
      >
        <div className="p-6 border-b border-white/10 flex items-center justify-between sticky top-0 bg-dark-800/90 backdrop-blur-xl z-10">
          <h2 className="font-display font-bold text-xl text-white flex items-center gap-2">
            {isEdit ? <PencilSquareIcon className="w-5 h-5 text-accent-cyan" /> : <PlusIcon className="w-5 h-5 text-accent-cyan" />}
            {isEdit ? 'Edit Project' : 'Add Project'}
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className={labelClass}>PROJECT TITLE *</label>
            <input name="title" value={form.title} onChange={handleChange} placeholder="My Awesome Project" className={inputClass} required />
          </div>
          <div>
            <label className={labelClass}>SHORT DESCRIPTION</label>
            <input name="shortDescription" value={form.shortDescription} onChange={handleChange} placeholder="Brief tagline (shown on card)" className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>FULL DESCRIPTION *</label>
            <textarea name="description" value={form.description} onChange={handleChange} rows={3} placeholder="Detailed project description..." className={`${inputClass} resize-none`} required />
          </div>
          <div>
            <label className={labelClass}>TECH STACK * (comma-separated)</label>
            <input name="techStack" value={form.techStack} onChange={handleChange} placeholder="React, Node.js, MongoDB, Express" className={inputClass} required />
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>LIVE URL</label>
              <input name="liveUrl" value={form.liveUrl} onChange={handleChange} placeholder="https://myapp.com" className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>GITHUB URL</label>
              <input name="githubUrl" value={form.githubUrl} onChange={handleChange} placeholder="https://github.com/..." className={inputClass} />
            </div>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>CATEGORY</label>
              <select name="category" value={form.category} onChange={handleChange} className={inputClass}>
                {['fullstack', 'web', 'backend', 'mobile', 'other'].map(c => (
                  <option key={c} value={c} className="bg-dark-800 capitalize">{c}</option>
                ))}
              </select>
            </div>
            <div className="flex items-center gap-3 pt-6">
              <input type="checkbox" id="featured" name="featured" checked={form.featured} onChange={handleChange} className="w-4 h-4 accent-accent-cyan rounded" />
              <label htmlFor="featured" className="text-slate-300 text-sm font-body">Mark as Featured</label>
            </div>
          </div>
          <div>
            <label className={labelClass}>PROJECT IMAGE</label>
            <div
              onClick={() => fileRef.current.click()}
              className="border border-dashed border-white/20 rounded-xl p-4 flex flex-col items-center gap-2 cursor-pointer hover:border-accent-cyan/40 transition-colors"
            >
              {imagePreview ? (
                <img src={imagePreview} alt="preview" className="w-full h-32 object-cover rounded-lg" />
              ) : (
                <>
                  <PhotoIcon className="w-8 h-8 text-slate-500" />
                  <span className="text-slate-400 text-sm font-body">Click to upload image</span>
                </>
              )}
            </div>
            <input ref={fileRef} type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 py-3 rounded-xl border border-white/15 text-slate-400 hover:text-white hover:border-white/30 font-display font-semibold text-sm transition-all">
              Cancel
            </button>
            <motion.button
              type="submit"
              disabled={saving}
              whileHover={!saving ? { scale: 1.02 } : {}}
              className={`flex-1 py-3 rounded-xl font-display font-bold text-sm transition-all flex items-center justify-center gap-2 ${saving ? 'bg-slate-700 text-slate-500 cursor-not-allowed' : 'btn-primary'}`}
            >
              {saving ? 'Saving...' : isEdit ? (
                <><CheckCircleIcon className="w-4 h-4" /> Update Project</>
              ) : (
                <><PlusIcon className="w-4 h-4" /> Add Project</>
              )}
            </motion.button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

// ─── Resume Manager Tab ───────────────────────────────────────────────────────
const ResumeManager = () => {
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const fileRef = useRef();

  const fetchStatus = async () => {
    try {
      const res = await api.get('/resume/status');
      setStatus(res.data);
    } catch {
      setStatus({ exists: false });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchStatus(); }, []);

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.type !== 'application/pdf') {
      toast.error('Only PDF files are allowed.');
      return;
    }
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('resume', file);
      await api.post('/resume/upload', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      toast.success('Resume uploaded successfully!');
      await fetchStatus();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Upload failed.');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Delete the current resume?')) return;
    setDeleting(true);
    try {
      await api.delete('/resume');
      toast.success('Resume deleted.');
      setStatus({ exists: false });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Delete failed.');
    } finally {
      setDeleting(false);
    }
  };

  const handlePreview = () => {
    if (!status?.url) { toast.error('No resume available.'); return; }
    window.open(status.url, '_blank');
  };

  const handleDownload = () => {
    if (!status?.url) { toast.error('No resume available.'); return; }
    const a = document.createElement('a');
    a.href = status.url;
    a.download = status?.originalName || 'resume.pdf';
    a.target = '_blank';
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  if (loading) return <div className="flex justify-center py-20"><div className="w-10 h-10 spinner" /></div>;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="flex items-center justify-between mb-2">
        <h2 className="font-display font-bold text-xl text-white flex items-center gap-2">
          <DocumentTextIcon className="w-6 h-6 text-accent-cyan" />
          Resume Management
        </h2>
      </div>

      {/* Status Card */}
      <div className={`glass-card rounded-2xl p-6 border ${status?.exists ? 'border-accent-green/20 bg-accent-green/3' : 'border-white/5'}`}>
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="flex items-center gap-4 flex-1">
            <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${status?.exists ? 'bg-accent-green/15' : 'bg-dark-700'}`}>
              <DocumentTextIcon className={`w-7 h-7 ${status?.exists ? 'text-accent-green' : 'text-slate-500'}`} />
            </div>
            <div>
              <div className="font-display font-bold text-white text-lg">
                {status?.exists ? status.originalName || 'resume.pdf' : 'No resume uploaded'}
              </div>
              {status?.exists && (
                <div className="text-slate-400 text-sm font-mono mt-0.5">
                  Uploaded: {new Date(status.uploadedAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                  {status.size && ` · ${(status.size / 1024).toFixed(1)} KB`}
                </div>
              )}
              {!status?.exists && (
                <div className="text-slate-500 text-sm font-body mt-0.5">
                  Upload a PDF resume to enable the download button on your portfolio.
                </div>
              )}
            </div>
          </div>

          {/* Status badge */}
          <div className={`px-3 py-1.5 rounded-full text-xs font-mono border flex items-center gap-1.5 self-start ${status?.exists
              ? 'bg-accent-green/15 text-accent-green border-accent-green/30'
              : 'bg-slate-500/15 text-slate-400 border-slate-500/30'
            }`}>
            <span className={`w-1.5 h-1.5 rounded-full ${status?.exists ? 'bg-accent-green animate-pulse' : 'bg-slate-500'}`} />
            {status?.exists ? 'Active' : 'No Resume'}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Upload */}
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => fileRef.current.click()}
          disabled={uploading}
          className="btn-primary py-3 flex items-center justify-center gap-2 text-sm font-display font-semibold disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {uploading ? (
            <><div className="w-4 h-4 spinner" /> Uploading...</>
          ) : (
            <><DocumentArrowUpIcon className="w-5 h-5" /> {status?.exists ? 'Replace Resume' : 'Upload Resume'}</>
          )}
        </motion.button>
        <input ref={fileRef} type="file" accept="application/pdf" onChange={handleUpload} className="hidden" />

        {/* Preview */}
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={handlePreview}
          disabled={!status?.exists}
          className="glass-card border border-white/10 text-slate-300 hover:text-accent-cyan hover:border-accent-cyan/30 py-3 rounded-xl flex items-center justify-center gap-2 text-sm font-display font-semibold transition-all disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <EyeIcon className="w-5 h-5" />
          Preview
        </motion.button>

        {/* Download */}
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={handleDownload}
          disabled={!status?.exists}
          className="glass-card border border-white/10 text-slate-300 hover:text-accent-cyan hover:border-accent-cyan/30 py-3 rounded-xl flex items-center justify-center gap-2 text-sm font-display font-semibold transition-all disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <DocumentArrowDownIcon className="w-5 h-5" />
          Download
        </motion.button>

        {/* Delete */}
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={handleDelete}
          disabled={!status?.exists || deleting}
          className="glass-card border border-red-400/20 text-red-400 hover:text-red-300 hover:border-red-400/40 py-3 rounded-xl flex items-center justify-center gap-2 text-sm font-display font-semibold transition-all disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {deleting ? (
            <><div className="w-4 h-4 spinner" /> Deleting...</>
          ) : (
            <><TrashIcon className="w-5 h-5" /> Delete</>
          )}
        </motion.button>
      </div>

      {/* Info Box */}
      <div className="glass-card rounded-xl p-5 border border-white/5 space-y-2">
        <h4 className="text-slate-300 text-sm font-display font-semibold mb-3">How it works</h4>
        <div className="space-y-1.5 text-slate-500 text-xs font-body">
          <p>• Upload a PDF — it's immediately available via the "Download Resume" button on your portfolio.</p>
          <p>• Replacing a resume automatically removes the old file; no code changes needed.</p>
          <p>• Deleting removes the file from the server and disables the download button.</p>
          <p>• Max file size: 10MB · PDF only.</p>
        </div>
      </div>
    </motion.div>
  );
};

// ─── Admin Dashboard Main ─────────────────────────────────────────────────────
const AboutPhotoManager = () => {
  const [photoUrl, setPhotoUrl] = useState(null);
  const [preview, setPreview] = useState(null);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const fileRef = useRef();

  const loadPhoto = async () => {
    try {
      const res = await api.get('/about/photo');
      // url is always a full Cloudinary https:// URL
      if (res.data.exists) setPhotoUrl(res.data.url || null);
      else setPhotoUrl(null);
    } catch (_) { setPhotoUrl(null); }
    finally { setLoading(false); }
  };

  useEffect(() => { loadPhoto(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleFile = (e) => {
    const f = e.target.files[0];
    if (!f) return;
    if (f.size > 5 * 1024 * 1024) { toast.error('File too large. Max 5MB.'); return; }
    const ok = /jpeg|jpg|png|webp/.test(f.type);
    if (!ok) { toast.error('Only jpg, jpeg, png, webp allowed.'); return; }
    setFile(f);
    const reader = new FileReader();
    reader.onload = () => setPreview(reader.result);
    reader.readAsDataURL(f);
  };

  const handleUpload = async () => {
    if (!file) { toast.error('Please select a photo first.'); return; }
    setUploading(true);
    try {
      const form = new FormData();
      form.append('photo', file);
      const res = await api.post('/about/photo', form, { headers: { 'Content-Type': 'multipart/form-data' } });
      toast.success('Photo uploaded successfully!');
      setFile(null);
      setPreview(null);
      // res.data.url is always a full Cloudinary https:// URL
      setPhotoUrl(res.data.url || null);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Upload failed.');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Delete the about photo?')) return;
    setDeleting(true);
    try {
      await api.delete('/about/photo');
      toast.success('Photo deleted.');
      setPhotoUrl(null);
      setPreview(null);
      setFile(null);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Delete failed.');
    } finally {
      setDeleting(false);
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center py-20">
      <div className="w-10 h-10 spinner" />
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-xl mx-auto py-8 px-4"
    >
      <h2 className="font-display font-bold text-2xl text-white mb-2 flex items-center gap-2">
        <UserCircleIcon className="w-6 h-6 text-accent-cyan" />
        About Me Photo
      </h2>
      <p className="text-slate-400 font-body text-sm mb-8">
        Upload a photo that appears in the About section of your portfolio. Max 5MB — jpg, jpeg, png, webp.
      </p>

      {/* Current / Preview */}
      <div className="glass-card rounded-2xl p-6 mb-6 flex flex-col items-center gap-4">
        {(preview || photoUrl) ? (
          <img
            src={preview || photoUrl}
            alt="About Me"
            className="w-48 h-48 rounded-2xl object-cover border-2 border-accent-cyan/30 shadow-xl"
          />
        ) : (
          <div className="w-48 h-48 rounded-2xl bg-dark-700 border-2 border-dashed border-white/20 flex flex-col items-center justify-center text-slate-500 gap-3">
            <PhotoIcon className="w-12 h-12" />
            <span className="text-sm font-body">No photo uploaded</span>
          </div>
        )}

        {preview && (
          <span className="text-xs text-accent-cyan font-mono bg-accent-cyan/10 px-3 py-1 rounded-full">
            Preview — not saved yet
          </span>
        )}
      </div>

      {/* Controls */}
      <div className="space-y-3">
        <input
          ref={fileRef}
          type="file"
          accept=".jpg,.jpeg,.png,.webp"
          onChange={handleFile}
          className="hidden"
        />

        <motion.button
          onClick={() => fileRef.current?.click()}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full py-3 rounded-xl border border-accent-cyan/30 text-accent-cyan font-body font-medium hover:bg-accent-cyan/5 transition-all flex items-center justify-center gap-2"
        >
          <PhotoIcon className="w-5 h-5" />
          {file ? 'Choose Different Photo' : 'Choose Photo'}
        </motion.button>

        {file && (
          <motion.button
            onClick={handleUpload}
            disabled={uploading}
            whileHover={!uploading ? { scale: 1.02 } : {}}
            whileTap={!uploading ? { scale: 0.98 } : {}}
            className={`w-full py-3 rounded-xl font-body font-bold transition-all flex items-center justify-center gap-2 ${uploading ? 'bg-slate-700 text-slate-500 cursor-not-allowed' : 'btn-primary'
              }`}
          >
            {uploading ? (
              <><div className="w-4 h-4 spinner" /> Uploading...</>
            ) : (
              <><DocumentArrowUpIcon className="w-5 h-5" /> Save Photo</>
            )}
          </motion.button>
        )}

        {photoUrl && !preview && (
          <motion.button
            onClick={handleDelete}
            disabled={deleting}
            whileHover={!deleting ? { scale: 1.02 } : {}}
            className="w-full py-3 rounded-xl border border-red-500/30 text-red-400 font-body font-medium hover:bg-red-500/5 transition-all flex items-center justify-center gap-2"
          >
            {deleting ? (
              <><div className="w-4 h-4 spinner" /> Deleting...</>
            ) : (
              <><TrashIcon className="w-5 h-5" /> Delete Photo</>
            )}
          </motion.button>
        )}
      </div>
    </motion.div>
  );
};

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('projects');
  const [projects, setProjects] = useState([]);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalProject, setModalProject] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      try {
        const [pRes, mRes] = await Promise.all([
          api.get('/projects'),
          api.get('/contact'),
        ]);
        setProjects(pRes.data.data);
        setMessages(mRes.data.data);
      } catch (err) {
        toast.error('Failed to load data');
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
    toast.success('Logged out successfully');
  };

  const handleSaveProject = (saved, isEdit) => {
    if (isEdit) {
      setProjects(prev => prev.map(p => p._id === saved._id ? saved : p));
    } else {
      setProjects(prev => [saved, ...prev]);
    }
  };

  const handleDelete = async (id) => {
    setDeleting(true);
    try {
      await api.delete(`/projects/${id}`);
      setProjects(prev => prev.filter(p => p._id !== id));
      toast.success('Project deleted');
      setDeleteId(null);
    } catch {
      toast.error('Failed to delete project');
    } finally {
      setDeleting(false);
    }
  };

  const handleMessageStatus = async (id, status) => {
    try {
      await api.put(`/contact/${id}`, { status });
      setMessages(prev => prev.map(m => m._id === id ? { ...m, status } : m));
      toast.success('Status updated');
    } catch {
      toast.error('Failed to update status');
    }
  };

  const handleDeleteMessage = async (id) => {
    try {
      await api.delete(`/contact/${id}`);
      setMessages(prev => prev.filter(m => m._id !== id));
      toast.success('Message deleted');
    } catch {
      toast.error('Failed to delete message');
    }
  };

  const unreadCount = messages.filter(m => m.status === 'new').length;

  const stats = [
    { label: 'Total Projects', value: projects.length, Icon: ComputerDesktopIcon, color: 'text-accent-cyan' },
    { label: 'Featured', value: projects.filter(p => p.featured).length, Icon: StarIcon, color: 'text-yellow-400' },
    { label: 'Messages', value: messages.length, Icon: EnvelopeIcon, color: 'text-accent-purple' },
    { label: 'Unread', value: unreadCount, Icon: BellIcon, color: 'text-accent-pink' },
  ];

  const TABS = [
    { key: 'projects', label: 'Projects', Icon: ComputerDesktopIcon, count: projects.length },
    { key: 'messages', label: 'Messages', Icon: EnvelopeIcon, count: unreadCount },
    { key: 'resume', label: 'Resume', Icon: DocumentTextIcon, count: 0 },
    { key: 'about', label: 'About Photo', Icon: UserCircleIcon, count: 0 },
  ];

  return (
    <div className="min-h-screen bg-dark-900">
      {/* Top Bar */}
      <header className="sticky top-0 z-40 border-b border-white/5 bg-dark-900/90 backdrop-blur-xl">
        <div className="admin-header-inner max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/" className="font-display font-bold text-lg">

              <span className="gradient-text">
                &lt; <span style={{
                  WebkitTextFillColor: "white"
                }}>
                  Asif
                </span>.Dev /&gt;
              </span>
            </Link>
            <span className="text-slate-600 hidden md:block">|</span>
            <span className="text-slate-400 font-mono text-sm hidden md:block">Admin Dashboard</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-slate-400 font-body text-sm hidden md:block flex items-center gap-1.5">
              <HandRaisedIcon className="w-4 h-4 inline-block mr-1" />
              {user?.name}
            </span>
            <motion.button
              whileHover={{ scale: 1.05 }}
              onClick={handleLogout}
              className="text-slate-400 hover:text-red-400 font-body text-sm border border-white/10 hover:border-red-400/30 px-4 py-2 rounded-lg transition-all flex items-center gap-1.5"
            >
              <ArrowRightOnRectangleIcon className="w-4 h-4" />
              Logout
            </motion.button>
          </div>
        </div>
      </header>

      <main className="admin-main-inner max-w-7xl mx-auto px-6 py-8 sm:py-10">
        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map(({ label, value, Icon, color }) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-card rounded-xl p-5"
            >
              <Icon className={`w-6 h-6 mb-2 ${color}`} />
              <div className={`font-display font-bold text-3xl ${color}`}>{value}</div>
              <div className="text-slate-500 text-sm font-body mt-1">{label}</div>
            </motion.div>
          ))}
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-2 mb-6 flex-wrap">
          {TABS.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`admin-tab-btn flex items-center gap-2 px-5 py-2.5 rounded-xl font-display font-semibold text-sm transition-all ${activeTab === tab.key
                  ? 'bg-accent-cyan text-dark-900'
                  : 'glass-card border border-white/10 text-slate-400 hover:text-white'
                }`}
            >
              <tab.Icon className="w-4 h-4" />
              {tab.label}
              {tab.count > 0 && (
                <span className={`text-xs px-2 py-0.5 rounded-full ${activeTab === tab.key ? 'bg-dark-900/30' : 'bg-accent-cyan/20 text-accent-cyan'}`}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* ── Projects Tab ─────────────────────────────────────────────────────── */}
        {activeTab === 'projects' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display font-bold text-xl text-white">Manage Projects</h2>
              <motion.button
                whileHover={{ scale: 1.05 }}
                onClick={() => setModalProject({})}
                className="btn-primary text-sm py-2.5 px-5 flex items-center gap-2"
              >
                <PlusIcon className="w-4 h-4" />
                Add Project
              </motion.button>
            </div>

            {loading ? (
              <div className="flex justify-center py-20"><div className="w-10 h-10 spinner" /></div>
            ) : projects.length === 0 ? (
              <div className="text-center py-20 text-slate-500 glass-card rounded-2xl">
                <ComputerDesktopIcon className="w-12 h-12 mx-auto mb-4 opacity-40" />
                <p className="font-body">No projects yet. Add your first one!</p>
              </div>
            ) : (
              <div className="space-y-3">
                {projects.map((project, i) => (
                  <motion.div
                    key={project._id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="glass-card rounded-xl p-5 flex flex-col sm:flex-row sm:items-center gap-4 border border-white/5 hover:border-white/10 transition-all"
                  >
                    {project.image ? (
                      <img src={resolveImageUrl(project.image)} alt={project.title} className="w-16 h-16 rounded-lg object-cover flex-shrink-0" />
                    ) : (
                      <div className="w-16 h-16 rounded-lg bg-dark-700 flex items-center justify-center flex-shrink-0">
                        <ComputerDesktopIcon className="w-7 h-7 text-slate-500" />
                      </div>
                    )}

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-display font-bold text-white">{project.title}</span>
                        {project.featured && <span className="text-xs bg-yellow-400/20 text-yellow-400 border border-yellow-400/30 px-2 py-0.5 rounded-full font-mono">Featured</span>}
                        <span className="text-xs bg-dark-700 text-slate-400 px-2 py-0.5 rounded-full font-mono capitalize">{project.category}</span>
                      </div>
                      <p className="text-slate-400 text-sm font-body mt-1 truncate">{project.shortDescription || project.description}</p>
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {project.techStack?.slice(0, 4).map(t => (
                          <span key={t} className="text-xs text-slate-500 bg-dark-700 px-2 py-0.5 rounded font-mono">{t}</span>
                        ))}
                        {project.techStack?.length > 4 && <span className="text-xs text-slate-600 font-mono">+{project.techStack.length - 4}</span>}
                      </div>
                    </div>

                    <div className="flex gap-2 flex-shrink-0">
                      {project.liveUrl && project.liveUrl !== '#' && (
                        <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="p-2 text-slate-400 hover:text-accent-cyan border border-white/10 hover:border-accent-cyan/30 rounded-lg transition-all">
                          <ArrowTopRightOnSquareIcon className="w-4 h-4" />
                        </a>
                      )}
                      <button
                        onClick={() => setModalProject(project)}
                        className="px-3 py-2 text-slate-300 hover:text-white border border-white/10 hover:border-white/30 rounded-lg transition-all text-sm font-body flex items-center gap-1.5"
                      >
                        <PencilSquareIcon className="w-4 h-4" />
                        Edit
                      </button>
                      <button
                        onClick={() => setDeleteId(project._id)}
                        className="p-2 text-red-400 hover:text-red-300 border border-red-400/20 hover:border-red-400/40 rounded-lg transition-all"
                      >
                        <TrashIcon className="w-4 h-4" />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {/* ── Messages Tab ─────────────────────────────────────────────────────── */}
        {activeTab === 'messages' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display font-bold text-xl text-white flex items-center gap-2">
                <EnvelopeIcon className="w-6 h-6 text-accent-cyan" />
                Contact Messages
                {unreadCount > 0 && (
                  <span className="ml-1 text-sm px-3 py-1 bg-accent-pink/20 text-accent-pink border border-accent-pink/30 rounded-full font-mono">
                    {unreadCount} new
                  </span>
                )}
              </h2>
            </div>

            {loading ? (
              <div className="flex justify-center py-20"><div className="w-10 h-10 spinner" /></div>
            ) : messages.length === 0 ? (
              <div className="text-center py-20 text-slate-500 glass-card rounded-2xl">
                <EnvelopeIcon className="w-12 h-12 mx-auto mb-4 opacity-40" />
                <p className="font-body">No messages yet</p>
              </div>
            ) : (
              <div className="space-y-3">
                {messages.map((msg, i) => (
                  <motion.div
                    key={msg._id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.04 }}
                    className={`glass-card rounded-xl p-5 border transition-all ${msg.status === 'new' ? 'border-accent-cyan/20' : 'border-white/5'
                      }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 flex-wrap mb-2">
                          <span className="font-display font-bold text-white">{msg.name}</span>
                          <span className="text-slate-500 text-sm font-mono">{msg.email}</span>
                          <span className={`text-xs px-2 py-0.5 rounded-full font-mono border ${msg.status === 'new' ? 'bg-accent-cyan/20 text-accent-cyan border-accent-cyan/30' :
                              msg.status === 'replied' ? 'bg-green-400/20 text-green-400 border-green-400/30' :
                                'bg-slate-500/20 text-slate-400 border-slate-500/30'
                            }`}>
                            {msg.status}
                          </span>
                        </div>
                        <div className="text-accent-cyan text-sm font-semibold mb-1">{msg.subject}</div>
                        <p className="text-slate-400 text-sm font-body leading-relaxed">{msg.message}</p>
                        <div className="text-slate-600 text-xs font-mono mt-2">
                          {new Date(msg.createdAt).toLocaleString()}
                        </div>
                      </div>

                      <div className="flex gap-2 flex-shrink-0">
                        <select
                          value={msg.status}
                          onChange={e => handleMessageStatus(msg._id, e.target.value)}
                          className="text-xs bg-dark-700 border border-white/10 text-slate-300 rounded-lg px-3 py-1.5 font-mono focus:outline-none focus:border-accent-cyan/40"
                        >
                          {['new', 'read', 'replied', 'archived'].map(s => (
                            <option key={s} value={s} className="bg-dark-800 capitalize">{s}</option>
                          ))}
                        </select>
                        <a
                          href={`mailto:${msg.email}?subject=Re: ${msg.subject}`}
                          className="p-2 text-slate-400 hover:text-accent-cyan border border-white/10 hover:border-accent-cyan/30 rounded-lg transition-all"
                        >
                          <EnvelopeIcon className="w-4 h-4" />
                        </a>
                        <button
                          onClick={() => handleDeleteMessage(msg._id)}
                          className="p-2 text-red-400 hover:text-red-300 border border-red-400/20 hover:border-red-400/40 rounded-lg transition-all"
                        >
                          <TrashIcon className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {/* ── Resume Tab ─────────────────────────────────────────────────────── */}
        {activeTab === 'resume' && <ResumeManager />}

        {/* ── About Photo Tab ─────────────────────────────────────────────── */}
        {activeTab === 'about' && <AboutPhotoManager />}
      </main>

      {/* Project Modal */}
      <AnimatePresence>
        {modalProject !== null && (
          <ProjectModal
            project={Object.keys(modalProject).length > 0 ? modalProject : null}
            onClose={() => setModalProject(null)}
            onSave={handleSaveProject}
          />
        )}
      </AnimatePresence>

      {/* Delete Confirm Modal */}
      <AnimatePresence>
        {deleteId && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4"
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="glass-card rounded-2xl p-8 max-w-sm w-full border border-red-500/20 text-center"
            >
              <div className="w-16 h-16 rounded-full bg-red-500/15 flex items-center justify-center mx-auto mb-4">
                <ExclamationTriangleIcon className="w-8 h-8 text-red-400" />
              </div>
              <h3 className="font-display font-bold text-xl text-white mb-2">Delete Project?</h3>
              <p className="text-slate-400 font-body text-sm mb-6">This action cannot be undone.</p>
              <div className="flex gap-3">
                <button onClick={() => setDeleteId(null)} className="flex-1 py-3 rounded-xl border border-white/15 text-slate-400 hover:text-white font-display font-semibold text-sm transition-all">
                  Cancel
                </button>
                <button
                  onClick={() => handleDelete(deleteId)}
                  disabled={deleting}
                  className="flex-1 py-3 rounded-xl bg-red-500 hover:bg-red-600 text-white font-display font-bold text-sm transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {deleting ? 'Deleting...' : <><TrashIcon className="w-4 h-4" /> Delete</>}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminDashboard;