
import { test, expect } from '@playwright/test';
import { db } from '../utils/db';

test('Verify user exists in PostgreSQL database', async () => {
  try {
    const result = await db.query(
      'SELECT id, name, email FROM users WHERE email = $1',
      ['test@example.com']
    );

    expect(result.rows).toHaveLength(1);
    expect(result.rows[0].name).toBe('Test User');
    expect(result.rows[0].email).toBe('test@example.com');

  } catch (error) {
    console.error('Database error:', error);

    if (error instanceof AggregateError) {
      for (const cause of error.errors) {
        console.error('Connection cause:', cause);
      }
    }

    throw error;
  }
});
