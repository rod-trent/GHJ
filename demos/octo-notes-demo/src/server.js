const express = require('express');

const app = express();

app.use('/api/notes', require('./routes/notes'));
app.use('/api/attachments', require('./routes/attachments'));
app.use('/preview', require('./routes/preview'));

app.get('/', (req, res) => {
  res.type('text/plain').send(
    'Octo Notes (intentionally vulnerable demo)\n' +
    '  GET /api/notes/search?q=grocery\n' +
    '  GET /api/notes/by-owner?owner=mona\n' +
    '  GET /api/notes/1\n' +
    '  GET /api/attachments?file=welcome.txt\n' +
    '  GET /preview?title=Hello\n'
  );
});

const port = process.env.PORT || 3000;
app.listen(port, '127.0.0.1', () => {
  console.log(`Octo Notes listening on http://127.0.0.1:${port}`);
});
