const express = require('express');
const fs = require('node:fs');
const path = require('node:path');

const router = express.Router();
const UPLOAD_DIR = path.join(__dirname, '..', '..', 'uploads');

// GET /api/attachments?file=welcome.txt
// VULNERABLE: path traversal - "?file=../package.json" escapes the uploads folder.
router.get('/', (req, res) => {
  const filePath = path.join(UPLOAD_DIR, req.query.file);
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) return res.status(404).send('not found');
    res.type('text/plain').send(data);
  });
});

module.exports = router;
