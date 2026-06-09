  /**
   * Login Page
   * Admin authentication with login/signup toggle
   */

  import React, { useState, useEffect } from 'react';
  import { useNavigate, Link } from 'react-router-dom';
  import { motion, AnimatePresence } from 'framer-motion';
  import toast from 'react-hot-toast';
  import { useAuth } from '../context/AuthContext';

  const LoginPage = () => {
    const { login, register, user } = useAuth();
    const navigate = useNavigate();
    const [isLogin, setIsLogin] = useState(true);
    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
    const [errors, setErrors] = useState({});

    // Redirect if already logged in
    useEffect(() => {
      if (user) navigate('/admin');
    }, [user, navigate]);

    const validate = () => {
      const newErrors = {};
      if (!isLogin && !form.name.trim()) newErrors.name = 'Name is required';
      if (!form.email.match(/^\S+@\S+\.\S+$/)) newErrors.email = 'Valid email required';
      if (form.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
      if (!isLogin && form.password !== form.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
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

      setLoading(true);
      try {
        if (isLogin) {
          await login(form.email, form.password);
          toast.success('Welcome back, Admin!');
        } else {
          await register(form.name, form.email, form.password);
          toast.success('Account created! Welcome');
        }
        navigate('/admin');
      } catch (err) {
        toast.error(err.response?.data?.message || 'Authentication failed.');
      } finally {
        setLoading(false);
      }
    };

    const inputClass = (field) =>
      `w-full bg-dark-700/60 border rounded-xl px-4 py-3 text-white placeholder-slate-500 font-body text-sm focus:outline-none focus:ring-2 transition-all ${
        errors[field]
          ? 'border-red-500/50 focus:ring-red-500/25'
          : 'border-white/10 focus:border-accent-cyan/50 focus:ring-accent-cyan/20'
      }`;

    return (
      <div className="min-h-screen bg-dark-900 flex items-center justify-center px-6 relative overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-grid opacity-30" />
        <div className="absolute top-1/4 -left-40 w-96 h-96 bg-accent-cyan/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -right-40 w-96 h-96 bg-accent-purple/10 rounded-full blur-3xl" />

        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="relative z-10 w-full max-w-md"
        >
          {/* Header */}
          <div className="text-center mb-8">
            <Link to="/" className="inline-block mb-6">
              <span className="font-display font-bold text-2xl">
                <span className="gradient-text">&lt;</span>
                <span className="text-white"> Asif</span>
                <span className="gradient-text">.Dev /&gt;</span>
              </span>
            </Link>
            <h1 className="font-display font-bold text-3xl text-white">
              {isLogin ? 'Admin Login' : 'Create Account'}
            </h1>
            <p className="text-slate-400 font-body text-sm mt-2">
              {isLogin ? 'Access your admin dashboard' : 'Set up your admin account'}
            </p>
          </div>

          {/* Card */}
          <div className="login-card-padding glass-card rounded-2xl p-8 border border-white/8">
            {/* Tab Toggle */}
            <div className="flex rounded-xl overflow-hidden bg-dark-700/60 p-1 mb-6">
              {['Login', 'Register'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => { setIsLogin(tab === 'Login'); setErrors({}); }}
                  className={`flex-1 py-2.5 text-sm font-display font-semibold rounded-lg transition-all ${
                    (tab === 'Login') === isLogin
                      ? 'bg-accent-cyan text-dark-900 shadow-lg'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <AnimatePresence>
                {!isLogin && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <label className="text-slate-400 text-xs font-mono mb-1.5 block">NAME</label>
                    <input
                      type="text"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      placeholder="Your full name"
                      className={inputClass('name')}
                    />
                    {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
                  </motion.div>
                )}
              </AnimatePresence>

              <div>
                <label className="text-slate-400 text-xs font-mono mb-1.5 block">EMAIL</label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="admin@portfolio.com"
                  className={inputClass('email')}
                />
                {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
              </div>

              <div>
                <label className="text-slate-400 text-xs font-mono mb-1.5 block">PASSWORD</label>
                <input
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className={inputClass('password')}
                />
                {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password}</p>}
              </div>

              <AnimatePresence>
                {!isLogin && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                  >
                    <label className="text-slate-400 text-xs font-mono mb-1.5 block">CONFIRM PASSWORD</label>
                    <input
                      type="password"
                      name="confirmPassword"
                      value={form.confirmPassword}
                      onChange={handleChange}
                      placeholder="••••••••"
                      className={inputClass('confirmPassword')}
                    />
                    {errors.confirmPassword && <p className="text-red-400 text-xs mt-1">{errors.confirmPassword}</p>}
                  </motion.div>
                )}
              </AnimatePresence>

              <motion.button
                type="submit"
                disabled={loading}
                whileHover={!loading ? { scale: 1.02 } : {}}
                whileTap={!loading ? { scale: 0.98 } : {}}
                className={`w-full py-3.5 rounded-xl font-display font-bold text-base mt-2 transition-all ${
                  loading ? 'bg-slate-700 text-slate-500 cursor-not-allowed' : 'btn-primary'
                }`}
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 spinner" />
                    {isLogin ? 'Signing in...' : 'Creating account...'}
                  </span>
                ) : (
                  isLogin ? 'Sign In' : 'Create Account'
                )}
              </motion.button>
            </form>
          </div>

          <p className="text-center text-slate-600 text-sm mt-6 font-body">
            <Link to="/" className="text-accent-cyan hover:underline">← Back to Portfolio</Link>
          </p>
        </motion.div>
      </div>
    );
  };

  export default LoginPage;
