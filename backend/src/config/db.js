const bcrypt = require('bcrypt');

// In-memory mock database
const db = {
  users: [],
  jobs: []
};

// Seed a demo user
(async () => {
  const hashed = await bcrypt.hash('demo1234', 10);
  db.users.push({
    id: 1,
    username: 'demo',
    email: 'demo@example.com',
    password: hashed,
    created_at: new Date().toISOString()
  });
})();

async function testConnection() {
  console.log('✅ In-memory mock DB initialized successfully (No MySQL)');
}

module.exports = { db, testConnection };
