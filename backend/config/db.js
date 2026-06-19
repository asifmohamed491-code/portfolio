/**
 * Database configuration
 *
 * CHANGED (perf fix — connection reuse / cold-start resilience):
 * - Reuses a single cached connection across the process instead of
 *   letting server.js open its own ad-hoc connect() call. Prevents
 *   duplicate connections and lets us tune pooling/timeouts in one place.
 * - Added connection pool + timeout tuning so that after the Atlas/Render
 *   instance has been idle, the driver re-establishes a usable connection
 *   quickly instead of hanging on the default 30s server selection window.
 * - minPoolSize keeps at least one warm socket open instead of letting the
 *   pool drop to 0 connections during idle periods, which was the main
 *   cause of the "first request after inactivity is slow" symptom.
 * - Added connection event logging + auto-reconnect handling so transient
 *   drops (common on free-tier Atlas/Render) recover without needing a
 *   server restart or a page refresh.
 */

const mongoose = require('mongoose');

let isConnected = false;

const connectDB = async () => {
  // Reuse existing connection instead of opening a new one on every call
  if (isConnected || mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      // Keep a small pool of ready sockets instead of opening one lazily
      // on the first request after idle — this is the key fix for the
      // "slow after inactivity" issue.
      maxPoolSize: 10,
      minPoolSize: 2,

      // Fail fast and retry instead of hanging on a dead/idle socket
      serverSelectionTimeoutMS: 8000,
      socketTimeoutMS: 20000,
      connectTimeoutMS: 8000,

      // Send periodic pings so idle sockets aren't silently dropped by
      // the OS/load balancer before the driver notices
      heartbeatFrequencyMS: 10000,

      retryWrites: true,
      retryReads: true,
    });

    isConnected = true;
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    isConnected = false;
    console.error(`❌ Database Error: ${error.message}`);
    throw error;
  }

  return mongoose.connection;
};

// ─── Connection lifecycle logging + auto-recovery ───────────────────────────
mongoose.connection.on('disconnected', () => {
  isConnected = false;
  console.warn('⚠️  MongoDB disconnected — will reconnect on next request');
});

mongoose.connection.on('reconnected', () => {
  isConnected = true;
  console.log('✅ MongoDB reconnected');
});

mongoose.connection.on('error', (err) => {
  console.error('❌ MongoDB connection error:', err.message);
});

module.exports = connectDB;
