'use strict';

const express = require('express');
const { Pool } = require('pg');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '..', 'database', '.env') });

const app = express();
app.disable('x-powered-by');
app.use(express.json({ limit: '32kb' }));
const pool = new Pool({
  host: process.env.POSTGRES_HOST || '127.0.0.1',
  port: Number(process.env.POSTGRES_PORT || 5433),
  user: process.env.POSTGRES_USER || 'qa_user',
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB || 'qa_testing',
  connectionTimeoutMillis: 5000,
});

function validUser(body) {
  return body && typeof body.name === 'string' && body.name.trim().length > 0 &&
    body.name.trim().length <= 100 && typeof body.email === 'string' &&
    body.email.length <= 255 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email);
}
function getId(value) {
  const id = Number(value);
  return Number.isSafeInteger(id) && id > 0 ? id : null;
}
function handleDbError(error, res) {
  if (error.code === '23505') return res.status(409).json({ error: 'Email already exists' });
  console.error('Database operation failed:', error.message);
  return res.status(500).json({ error: 'Internal server error' });
}

app.get('/health', async (_req, res) => {
  try {
    await pool.query('SELECT 1');
    res.json({ status: 'ok' });
  } catch (_error) {
    res.status(503).json({ status: 'unavailable' });
  }
});

app.post('/users', async (req, res) => {
  if (!validUser(req.body)) return res.status(400).json({ error: 'Valid name and email are required' });
  try {
    const result = await pool.query(
      'INSERT INTO users (name, email) VALUES ($1, $2) RETURNING id, name, email, created_at',
      [req.body.name.trim(), req.body.email.trim().toLowerCase()]
    );
    return res.status(201).json(result.rows[0]);
  } catch (error) { return handleDbError(error, res); }
});

app.get('/users/:id', async (req, res) => {
  const id = getId(req.params.id);
  if (!id) return res.status(400).json({ error: 'Invalid user id' });
  try {
    const result = await pool.query('SELECT id, name, email, created_at FROM users WHERE id = $1', [id]);
    if (!result.rowCount) return res.status(404).json({ error: 'User not found' });
    return res.json(result.rows[0]);
  } catch (error) { return handleDbError(error, res); }
});

app.put('/users/:id', async (req, res) => {
  const id = getId(req.params.id);
  if (!id) return res.status(400).json({ error: 'Invalid user id' });
  if (!validUser(req.body)) return res.status(400).json({ error: 'Valid name and email are required' });
  try {
    const result = await pool.query(
      'UPDATE users SET name = $1, email = $2 WHERE id = $3 RETURNING id, name, email, created_at',
      [req.body.name.trim(), req.body.email.trim().toLowerCase(), id]
    );
    if (!result.rowCount) return res.status(404).json({ error: 'User not found' });
    return res.json(result.rows[0]);
  } catch (error) { return handleDbError(error, res); }
});

app.delete('/users/:id', async (req, res) => {
  const id = getId(req.params.id);
  if (!id) return res.status(400).json({ error: 'Invalid user id' });
  try {
    const result = await pool.query('DELETE FROM users WHERE id = $1 RETURNING id', [id]);
    if (!result.rowCount) return res.status(404).json({ error: 'User not found' });
    return res.status(204).send();
  } catch (error) { return handleDbError(error, res); }
});

const server = app.listen(Number(process.env.API_PORT || 3002), '127.0.0.1', () => {
  console.log(`QA integration API listening at http://127.0.0.1:${process.env.API_PORT || 3002}`);
});

async function shutdown() {
  server.close(async () => {
    await pool.end();
    process.exit(0);
  });
}
process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
