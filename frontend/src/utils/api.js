/**
 * Axios API Instance
 * Fixed:
 *   1. baseURL always absolute (http://localhost:5000/api) — never proxy fallback
 *   2. withCredentials: true — required for CORS credentialed requests
 *   3. Token attached on every request via interceptor
 *   4. 401 auto-logout redirects only on protected admin pages
 */

import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  timeout: 15000,
  withCredentials: false,
  headers: { 'Content-Type': 'application/json' },
});

// ─── Request Interceptor: Attach JWT ─────────────────────────────────────────
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('portfolio_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ─── Response Interceptor: Handle 401 ────────────────────────────────────────
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('portfolio_token');
      delete api.defaults.headers.common['Authorization'];
      const path = window.location.pathname;
      if (path.startsWith('/admin') && path !== '/admin/login') {
        window.location.href = '/admin/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
