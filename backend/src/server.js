const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });
require('express-async-errors');

const express = require('express');
const cors    = require('cors');

const { testConnection }   = require('./config/db');
const authRoutes           = require('./routes/auth.routes');
const jobRoutes            = require('./routes/jobs.routes');
const dashboardRoutes      = require('./routes/dashboard.routes');
const { errorHandler }     = require('./middleware/errorHandler');

const app  = express();
const PORT = process.env.PORT || 5001;

// ─── Middleware ───────────────────────────────────────
app.use(cors({ origin: '*' }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded / converted files statically
app.use('/uploads',   express.static(path.join(__dirname, '..', 'uploads')));
app.use('/converted', express.static(path.join(__dirname, '..', 'converted')));

// ─── Routes ──────────────────────────────────────────
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use('/api/auth',      authRoutes);
app.use('/api/jobs',      jobRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/reports',   dashboardRoutes); // รวม export endpoint ไว้ใน router เดียวกัน

// ─── Global Error Handler ─────────────────────────────
app.use(errorHandler);

// ─── Start ────────────────────────────────────────────
(async () => {
  await testConnection();
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Backend running on http://0.0.0.0:${PORT}`);
  });
})();
