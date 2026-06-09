/**
 * Auth Context
 * Fixed:
 *   1. Token set on api.defaults BEFORE making /auth/me call so interceptor
 *      doesn't race with default header setup
 *   2. Clear token on any /auth/me failure (expired / invalid)
 *   3. login / register both set default header immediately after storing token
 *   4. logout removes header + token atomically
 */

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../utils/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser]       = useState(null);
  const [loading, setLoading] = useState(true);

  // ─── On mount: restore session from stored token ──────────────────────────
  useEffect(() => {
    const token = localStorage.getItem('portfolio_token');
    if (!token) {
      setLoading(false);
      return;
    }

    // Set default header FIRST so the request interceptor and this call both use it
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

    api.get('/auth/me')
      .then((res) => {
        if (res.data?.user) {
          setUser(res.data.user);
        } else {
          // Unexpected response shape — clear session
          _clearSession();
        }
      })
      .catch(() => _clearSession())
      .finally(() => setLoading(false));
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ─── Helper: clear token + default header ────────────────────────────────
  const _clearSession = () => {
    localStorage.removeItem('portfolio_token');
    delete api.defaults.headers.common['Authorization'];
    setUser(null);
  };

  // ─── Login ────────────────────────────────────────────────────────────────
  const login = useCallback(async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    const { token, user: loggedInUser } = res.data;

    if (!token || !loggedInUser) {
      throw new Error('Invalid response from server');
    }

    localStorage.setItem('portfolio_token', token);
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    setUser(loggedInUser);
    return res.data;
  }, []);

  // ─── Register ─────────────────────────────────────────────────────────────
  const register = useCallback(async (name, email, password) => {
    const res = await api.post('/auth/register', { name, email, password });
    const { token, user: newUser } = res.data;

    if (!token || !newUser) {
      throw new Error('Invalid response from server');
    }

    localStorage.setItem('portfolio_token', token);
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    setUser(newUser);
    return res.data;
  }, []);

  // ─── Logout ───────────────────────────────────────────────────────────────
  const logout = useCallback(() => {
    _clearSession();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
