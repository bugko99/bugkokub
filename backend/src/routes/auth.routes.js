const express  = require('express');
const bcrypt   = require('bcrypt');
const jwt      = require('jsonwebtoken');
const { db }   = require('../config/db');

const router = express.Router();

// POST /api/auth/register
router.post('/register', async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ error: 'username, email and password are required' });
  }

  const existing = db.users.find(u => u.email === email || u.username === username);
  if (existing) {
    return res.status(400).json({ error: 'User already exists' });
  }

  const hashed = await bcrypt.hash(password, 10);
  const newUser = {
    id: db.users.length > 0 ? db.users[db.users.length - 1].id + 1 : 1,
    username,
    email,
    password: hashed,
    created_at: new Date().toISOString()
  };
  
  db.users.push(newUser);

  res.status(201).json({ message: 'User created', userId: newUser.id });
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  const { username, password } = req.body; // Changed from email to username/email field

  if (!username || !password) {
    return res.status(400).json({ error: 'username and password are required' });
  }

  const user = db.users.find(u => u.email === username || u.username === username);

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const token = jwt.sign(
    { id: user.id, username: user.username, email: user.email },
    process.env.JWT_SECRET || 'fallback_secret',
    { expiresIn: '7d' }
  );

  res.json({
    token,
    user: { id: user.id, username: user.username, email: user.email },
  });
});

module.exports = router;
