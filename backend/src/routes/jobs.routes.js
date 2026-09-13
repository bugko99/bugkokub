const express           = require('express');
const path              = require('path');
const fs                = require('fs');
const { db }            = require('../config/db');
const upload            = require('../middleware/upload');
const { authMiddleware} = require('../middleware/auth');
const { convertFile }   = require('../utils/converter');

const router = express.Router();

const CONVERTED_DIR = path.join(__dirname, '..', '..', 'converted');
const UPLOADS_DIR   = path.join(__dirname, '..', '..', 'uploads');
if (!fs.existsSync(CONVERTED_DIR)) fs.mkdirSync(CONVERTED_DIR, { recursive: true });

// GET /api/jobs  – list all jobs for the current user
router.get('/', authMiddleware, (req, res) => {
  const userJobs = db.jobs
    .filter(j => j.user_id === req.user.id)
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  res.json(userJobs);
});

// POST /api/jobs – upload & create a new conversion job
router.post('/', authMiddleware, upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  // Multer typically messes up UTF-8 filenames, decode it back:
  const originalNameUtf8 = Buffer.from(req.file.originalname, 'latin1').toString('utf8');

  const { target_format } = req.body;
  if (!target_format) {
    return res.status(400).json({ error: 'target_format is required' });
  }

  const sourceExt = path.extname(originalNameUtf8).replace('.', '').toLowerCase();

  const newJob = {
    id: db.jobs.length > 0 ? db.jobs[db.jobs.length - 1].id + 1 : 1,
    user_id: req.user.id,
    original_name: originalNameUtf8,
    original_path: req.file.filename,
    source_format: sourceExt,
    target_format: target_format,
    status: 'pending',
    file_size: req.file.size,
    created_at: new Date().toISOString()
  };

  db.jobs.push(newJob);

  // Run conversion asynchronously
  runConversion(newJob.id, req.file.filename, sourceExt, target_format, originalNameUtf8);

  res.status(201).json({ message: 'Job created', jobId: newJob.id });
});

// GET /api/jobs/:id – get single job status
router.get('/:id', authMiddleware, (req, res) => {
  const job = db.jobs.find(j => j.id === parseInt(req.params.id) && j.user_id === req.user.id);
  if (!job) return res.status(404).json({ error: 'Job not found' });
  res.json(job);
});

// DELETE /api/jobs/:id – delete a job and its files
router.delete('/:id', authMiddleware, (req, res) => {
  const jobIndex = db.jobs.findIndex(j => j.id === parseInt(req.params.id) && j.user_id === req.user.id);
  if (jobIndex === -1) return res.status(404).json({ error: 'Job not found' });

  const job = db.jobs[jobIndex];

  // Remove files if they exist
  const uploadPath    = path.join(UPLOADS_DIR, job.original_path);
  const convertedPath = job.converted_path
    ? path.join(CONVERTED_DIR, job.converted_path)
    : null;

  if (fs.existsSync(uploadPath))              fs.unlinkSync(uploadPath);
  if (convertedPath && fs.existsSync(convertedPath)) fs.unlinkSync(convertedPath);

  db.jobs.splice(jobIndex, 1);
  res.json({ message: 'Job deleted' });
});

// ─── Real conversion ───────────────
async function runConversion(jobId, filename, sourceFormat, targetFormat, originalName) {
  const job = db.jobs.find(j => j.id === jobId);
  if (!job) return;
  
  job.status = 'processing';

  try {
    const inputPath = path.join(UPLOADS_DIR, filename);
    const convertedName = `${path.parse(filename).name}.${targetFormat}`;
    const outputPath = path.join(CONVERTED_DIR, convertedName);

    // Call the new real converter
    await convertFile(inputPath, outputPath, sourceFormat, targetFormat, originalName);

    job.status = 'completed';
    job.converted_path = convertedName;
  } catch (err) {
    console.error('Conversion failed:', err);
    job.status = 'failed';
    job.error_message = err.message;
  }
}

module.exports = router;
