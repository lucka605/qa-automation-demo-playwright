import { Pool } from 'pg';

export const db = new Pool({
  host: '127.0.0.1',
  port: 5433,
  user: 'qa_user',
  password: process.env.POSTGRES_PASSWORD,
  database: 'qa_testing',
  max: 5,
  connectionTimeoutMillis: 5000,
});