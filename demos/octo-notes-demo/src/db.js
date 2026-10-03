// Octo Notes uses Node's built-in SQLite driver (node:sqlite) - no native
// dependencies, no install scripts.
const { DatabaseSync } = require('node:sqlite');

const db = new DatabaseSync(':memory:');

db.exec(`
  CREATE TABLE users (id INTEGER PRIMARY KEY, name TEXT, api_key TEXT);
  CREATE TABLE notes (id INTEGER PRIMARY KEY, owner_id INTEGER, title TEXT, body TEXT, private INTEGER);
  INSERT INTO users VALUES (1, 'mona', 'ghp_demo_mona_0000000000000000000000');
  INSERT INTO users VALUES (2, 'hubot', 'ghp_demo_hubot_000000000000000000000');
  INSERT INTO notes VALUES (1, 1, 'Grocery list', 'eggs, milk, octo-snacks', 0);
  INSERT INTO notes VALUES (2, 1, 'Release plan', 'ship v2 on Friday', 0);
  INSERT INTO notes VALUES (3, 2, 'Private: on-call secrets', 'pager PIN is 4242', 1);
`);

module.exports = db;
