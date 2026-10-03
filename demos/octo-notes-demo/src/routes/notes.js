const express = require('express');
const db = require('../db');

const router = express.Router();

// GET /api/notes/search?q=grocery
// VULNERABLE: user input is concatenated into the SQL string (SQL injection).
router.get('/search', (req, res) => {
  const q = req.query.q || '';
  const sql = `SELECT id, title FROM notes WHERE private = 0 AND title LIKE '%${q}%'`;
  const rows = db.prepare(sql).all();
  res.json(rows);
});

// GET /api/notes/by-owner?owner=mona
// VULNERABLE: a second, easy-to-miss variant of the same bug class.
router.get('/by-owner', (req, res) => {
  const owner = req.query.owner;
  const rows = db
    .prepare('SELECT n.id, n.title FROM notes n JOIN users u ON u.id = n.owner_id ' +
             "WHERE n.private = 0 AND u.name = '" + owner + "'")
    .all();
  res.json(rows);
});

// GET /api/notes/:id
// SAFE: parameterized query - the pattern we want everywhere.
router.get('/:id', (req, res) => {
  const row = db.prepare('SELECT id, title, body FROM notes WHERE id = ? AND private = 0').get(req.params.id);
  if (!row) return res.status(404).json({ error: 'not found' });
  res.json(row);
});

module.exports = router;
