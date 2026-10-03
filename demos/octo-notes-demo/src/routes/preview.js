const express = require('express');

const router = express.Router();

// GET /preview?title=Hello
// VULNERABLE: reflected cross-site scripting (XSS).
router.get('/', (req, res) => {
  const title = req.query.title;
  res.send(`<html><body><h1>Preview: ${title}</h1></body></html>`);
});

module.exports = router;
