# API + PostgreSQL Integration Tests (Playwright / TypeScript)

This add-on **preserves the existing Automation Exercise UI tests**. It adds a separate local CRUD API backed by a PostgreSQL database, plus Playwright tests verifying HTTP responses **and persisted SQL state**.

## Architecture

```text
Playwright HTTP request fixture -> Express REST API -> PostgreSQL (Docker)
                           \---------- SQL verification (pg) ---------^
```

## Preconditions

- Node.js 20+ and npm; existing Playwright project with `@playwright/test`
- Docker Desktop running
- Existing `database/compose.yaml`, `database/.env`, and PostgreSQL on `127.0.0.1:5433`
- The existing `database/.env` must contain `POSTGRES_PASSWORD=...` (the password for `qa_user`)
- Add `.env` and `playwright-integration-report/` to the root `.gitignore` (DO NOT commit secrets)

## Installation: extract this ZIP into the existing project root

Your project root contains `package.json`, `playwright.config.ts`, `tests/`, and `database/`. Merge folders; **do not delete your existing test files**. This ZIP does not replace your existing `package.json`, `playwright.config.ts`, `database/compose.yaml`, or `database/init.sql`.

Run in CMD from project root:

```cmd
scripts\setup-and-test.cmd
```

Or run manually:

```cmd
npm install express pg dotenv
npm install -D @types/pg
node scripts/setup-db.cjs
npx playwright test --config=playwright.integration.config.ts
```

No manual API server launch is needed: Playwright `webServer` starts the local server automatically on `127.0.0.1:3002` and stops it when tests finish.

### Docker database not running?

```cmd
cd database
docker compose up -d
cd ..
```

## Tests included

1. `POST /users` -> HTTP 201 -> persisted row; `GET` -> HTTP 200; `PUT` -> updated SQL row; `DELETE` -> SQL row absent and GET 404.
2. Required fields invalid -> HTTP 400.
3. Duplicate email -> HTTP 409 and exactly one SQL row.
4. Missing user -> HTTP 404.

Tests generate unique email addresses and clean up created records. The `setup-db.cjs` script ensures the expected `users` table exists.

## Local example

```cmd
npx playwright test --config=playwright.integration.config.ts --reporter=list
```

Playwright HTML report is saved in `playwright-integration-report/` (when using default reporter).

## CI

`.github/workflows/integration-db.yml` runs tests with an ephemeral PostgreSQL service on GitHub Actions. The CI-only password in that workflow is for a disposable test service; do not reuse real credentials. The job executes the independent integration suite, not your older UI test suite.

## Security / scope

This is **your own local sample API**, not the database of automationexercise.com. The API binds only to `127.0.0.1` and is not a production-ready authentication service. No real user information or payment data should be stored.
