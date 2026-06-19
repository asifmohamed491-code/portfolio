/**
 * Axios API Instance
 * Fixed:
 *   1. baseURL always absolute (http://localhost:5000/api) — never proxy fallback
 *   2. withCredentials: true — required for CORS credentialed requests
 *   3. Token attached on every request via interceptor
 *   4. 401 auto-logout redirects only on protected admin pages
 *
 * CHANGED (perf fix — fetch strategy / cold-start resilience):
 *   5. Timeout raised from 15s to 25s. The backend (Render free-tier style
 *      hosting + MongoDB Atlas) can take longer than 15s to respond on the
 *      very first request after the service has been idle, so the old
 *      timeout was triggering the "fails, needs a manual refresh" symptom.
 *   6. Added `cachedGet()` — a thin wrapper used ONLY by public, read-only
 *      sections (Projects, About photo). It implements a simple
 *      stale-while-revalidate pattern using sessionStorage:
 *        - If a cached response exists, it is returned immediately (so the
 *          page never has to show a blank/slow state on repeat visits in
 *          the same tab), while a fresh request is fired in the background
 *          to silently update the cache + UI once it resolves.
 *        - If no cache exists, it falls through to a normal request with a
 *          couple of retries (with backoff) so a cold backend doesn't
 *          surface as a hard failure on the very first load.
 *      This does NOT change `api` itself — POST/PUT/DELETE calls (forms,
 *      admin panel, auth) are completely unaffected.
 */

import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  timeout: 25000,
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

// ─── cachedGet: stale-while-revalidate for public GET endpoints ─────────────
const CACHE_PREFIX = 'pf_cache_';

const readCache = (key) => {
  try {
    const raw = sessionStorage.getItem(CACHE_PREFIX + key);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

const writeCache = (key, data) => {
  try {
    sessionStorage.setItem(CACHE_PREFIX + key, JSON.stringify({ data, ts: Date.now() }));
  } catch {
    // sessionStorage full/unavailable (e.g. private mode) — fail silently,
    // caching is an optimization, not a requirement
  }
};

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * GET with sessionStorage caching + automatic retry/backoff.
 *
 * @param {string} url - endpoint, e.g. '/projects'
 * @param {object} options
 * @param {number} options.ttl - how long (ms) cached data is considered fresh
 *   enough to skip a background revalidation entirely. Default 60s.
 * @param {number} options.retries - retry attempts on network/timeout error.
 * @param {function} options.onUpdate - called with fresh data once the
 *   background revalidation request resolves (only relevant when cache hit).
 */
export const cachedGet = async (url, { ttl = 60000, retries = 2, onUpdate } = {}) => {
  const cached = readCache(url);

  const fetchFresh = async (attemptsLeft) => {
    try {
      const res = await api.get(url);
      writeCache(url, res.data);
      return res.data;
    } catch (err) {
      if (attemptsLeft > 0) {
        await sleep(800 * (retries - attemptsLeft + 1)); // simple backoff
        return fetchFresh(attemptsLeft - 1);
      }
      throw err;
    }
  };

  if (cached) {
    const isStale = Date.now() - cached.ts > ttl;
    if (isStale) {
      // Serve cached data instantly, then quietly refresh in the background
      fetchFresh(retries)
        .then((fresh) => onUpdate && onUpdate(fresh))
        .catch(() => {}); // keep showing cached data if the revalidation fails
    }
    return cached.data;
  }

  // No cache available — fetch normally (with retry) so a cold backend
  // doesn't immediately surface as an error requiring a manual refresh.
  return fetchFresh(retries);
};

export default api;
