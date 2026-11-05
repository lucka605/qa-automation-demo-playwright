import { test, expect } from '@playwright/test';
import { db } from '../utils/db';
import dotenv from 'dotenv';
import path from 'node:path';

dotenv.config({ path: path.resolve(process.cwd(), 'database', '.env') });

test('Seeded test user exists in local PostgreSQL database', async () => {
  const result = await db.query(
    'SELECT id, name, email FROM users WHERE email = $1',
    ['test@example.com'],
  );
  expect(result.rows).toHaveLength(1);
  expect(result.rows[0]).toMatchObject({ name: 'Test User', email: 'test@example.com' });
});
test.afterAll(async () => { await db.end(); });
