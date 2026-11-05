# Quality Engineering Portfolio — Playwright + PostgreSQL

This repository combines **two independent automated test suites**:

1. **Web UI / E2E tests** for the public [Automation Exercise](https://automationexercise.com/) training website, implemented with Playwright and TypeScript.
2. **API + PostgreSQL integration tests** against a **local sample Express REST API** and a Dockerized PostgreSQL database. These tests do **not** access the database behind Automation Exercise.

## Architecture

```text
UI suite (opt-in)                  Integration suite (CI)
tests/test_case*.spec.ts           tests/integration/users.integration.spec.ts
  |                                |           |
  +-- fixtures/ui-test.ts          |           +-- pg / SQL assertions
  +-- pages/{Account,Products,     +-- Playwright request fixture
       Checkout}Page.ts                         |
  |                                            v
  v                                    server/index.cjs (Express)
Automation Exercise (external)                  |
                                              PostgreSQL (Docker / CI service)
```

## Technologies

**TypeScript · Playwright Test · Page Object Model · Fixtures · REST API · Node.js/Express · PostgreSQL · Docker · GitHub Actions.**

## Test coverage

| Suite | Scenarios | Execution |
| --- | --- | --- |
| Public-site UI | Register + cleanup, login, category/brand navigation, checkout, API catalog + UI checkout | Manual / opt-in |
| Local integration | POST→SQL, GET, PUT→SQL, DELETE→SQL, invalid fields 400, duplicate 409, missing user 404 | CI + local |
| DB seed verification | Check expected seed row | Local only |

Integration tests generate unique emails and clean up test-created rows. The CI workflow launches disposable PostgreSQL and runs the integration suite independently of public-site availability.

## Quick start

Node.js 22 recommended.

```bash
npm ci
npx playwright install chromium
```

### API + database tests (recommended first)

Start Docker Desktop, create `database/.env` (not committed):

```dotenv
POSTGRES_PASSWORD=YOUR_LOCAL_PASSWORD
```

Then from the project root on Windows CMD:

```cmd
cd database

docker compose up -d
cd ..
scripts\setup-and-test.cmd
```

Or after DB setup: `npm run test:integration`.

The local API is started by the Playwright integration configuration automatically.

### Public-site UI tests (opt-in)

These tests interact with a **third-party demonstration website** and must not be used for load testing. For login / checkout cases, provide a disposable demo account. Do not commit credentials.

**Windows CMD:**

```cmd
set "RUN_PUBLIC_UI=1"
set "AE_TEST_EMAIL=your-demo-user@example.com"
set "AE_TEST_PASSWORD=your-demo-password"
set "AE_TEST_NAME=Your Demo Display Name"
npm run test:ui
```

Without `RUN_PUBLIC_UI=1`, the public-site UI tests are **skipped**. Missing account variables cause login and checkout tests to be **skipped**; account registration uses a new random address and attempts account deletion at the end. The site may change over time, requiring locator maintenance.

`HEADED=1` runs locally with visible browser; default is headless.

### CI workflows

- `.github/workflows/integration-db.yml`: API/PostgreSQL integration on push and PR, with disposable CI database. This integration workflow has been observed succeeding on GitHub Actions.
- `.github/workflows/playwright.yml`: **manual only**, requires explicitly confirming use of the external demo site. Optional secrets: `AE_TEST_EMAIL`, `AE_TEST_PASSWORD`, `AE_TEST_NAME`.

UI tests are kept separate from the database integration pipeline to avoid public-site reliability affecting the core CI quality gate.

## Reports and debugging

```bash
npx playwright show-report playwright-report
npx playwright show-report playwright-integration-report
```

Failures retain screenshots/videos and first-retry traces where configured. CI uploads reports as artifacts.

## Security and maintenance

- Secrets and local `.env` files are ignored by Git.
- Example payment details are **dummy training data only**, never use real card information.
- PostgreSQL is bound to `127.0.0.1` locally; the example Express API is not a production service.
- Run `npm audit` and `npm run typecheck` after dependency changes.
- External UI flows and selectors must be verified against the current training website.

## Demo

[Original demonstration video](https://drive.google.com/file/d/1W1dZ9hOe2UV9CsRonF6VvQFpzM3Clo0_/view?usp=drive_link)

## Author

Luqman Deeb — QA Automation / SDET portfolio project.
