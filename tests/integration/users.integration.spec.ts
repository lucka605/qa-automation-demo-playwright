import { test, expect } from '@playwright/test';
import { Pool } from 'pg';
import { randomUUID } from 'node:crypto';
import path from 'node:path';
import dotenv from 'dotenv';

dotenv.config({ path: path.resolve(process.cwd(), 'database', '.env') });

const BASE_URL = 'http://127.0.0.1:3002';
const db = new Pool({
  host: process.env.POSTGRES_HOST ?? '127.0.0.1',
  port: Number(process.env.POSTGRES_PORT ?? 5433),
  user: process.env.POSTGRES_USER ?? 'qa_user',
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB ?? 'qa_testing',
  connectionTimeoutMillis: 5000,
});

// Playwright tests run without launching a browser: HTTP request fixture + SQL assertions.
test.afterAll(async () => { await db.end(); });

function uniqueEmail() { return `qa-${randomUUID()}@example.test`; }

test('API create -> DB verify -> API read/update/delete -> DB verify', async ({ request }) => {
  const email = uniqueEmail();
  let id: number | undefined;
  try {
    await test.step('POST creates a user and writes the correct database row', async () => {
      const response = await request.post(`${BASE_URL}/users`, { data: { name: 'Integration QA', email } });
      expect(response.status()).toBe(201);
      const created = await response.json();
      id = created.id;
      expect(id).toEqual(expect.any(Number));
      expect(created).toMatchObject({ name: 'Integration QA', email });

      const row = await db.query('SELECT name, email FROM users WHERE id = $1', [id]);
      expect(row.rows).toHaveLength(1);
      expect(row.rows[0]).toMatchObject({ name: 'Integration QA', email });
    });

    await test.step('GET returns the same user', async () => {
      const response = await request.get(`${BASE_URL}/users/${id}`);
      expect(response.status()).toBe(200);
      expect(await response.json()).toMatchObject({ id, email });
    });

    await test.step('PUT updates persisted data', async () => {
      const response = await request.put(`${BASE_URL}/users/${id}`, {
        data: { name: 'Updated QA', email },
      });
      expect(response.status()).toBe(200);
      const row = await db.query('SELECT name FROM users WHERE id = $1', [id]);
      expect(row.rows[0].name).toBe('Updated QA');
    });

    await test.step('DELETE removes the user from the database', async () => {
      const response = await request.delete(`${BASE_URL}/users/${id}`);
      expect(response.status()).toBe(204);
      const row = await db.query('SELECT id FROM users WHERE id = $1', [id]);
      expect(row.rows).toHaveLength(0);
      const getAfterDelete = await request.get(`${BASE_URL}/users/${id}`);
      expect(getAfterDelete.status()).toBe(404);
    });
  } finally {
    if (id !== undefined) await db.query('DELETE FROM users WHERE id = $1', [id]);
  }
});

test('POST rejects missing required fields with 400', async ({ request }) => {
  const response = await request.post(`${BASE_URL}/users`, { data: { name: '' } });
  expect(response.status()).toBe(400);
  expect(await response.json()).toMatchObject({ error: 'Valid name and email are required' });
});

test('POST rejects duplicate email with 409', async ({ request }) => {
  const email = uniqueEmail();
  let id: number | undefined;
  try {
    const first = await request.post(`${BASE_URL}/users`, { data: { name: 'First', email } });
    expect(first.status()).toBe(201);
    id = (await first.json()).id;
    const duplicate = await request.post(`${BASE_URL}/users`, { data: { name: 'Second', email } });
    expect(duplicate.status()).toBe(409);
    const result = await db.query('SELECT COUNT(*)::int AS count FROM users WHERE email = $1', [email]);
    expect(result.rows[0].count).toBe(1);
  } finally {
    if (id !== undefined) await db.query('DELETE FROM users WHERE id = $1', [id]);
  }
});

test('GET returns 404 for nonexistent user', async ({ request }) => {
  const response = await request.get(`${BASE_URL}/users/2147483647`);
  expect(response.status()).toBe(404);
  expect(await response.json()).toMatchObject({ error: 'User not found' });
});
