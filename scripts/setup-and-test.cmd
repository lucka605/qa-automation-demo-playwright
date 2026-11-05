@echo off
setlocal
cd /d "%~dp0.."
echo [1/4] Installing required npm dependencies...
call npm install express pg dotenv
if errorlevel 1 exit /b 1
call npm install -D @types/pg
if errorlevel 1 exit /b 1
if not exist "database\.env" (
  echo ERROR: database\.env is missing. Create it with POSTGRES_PASSWORD=your-local-password
  exit /b 1
)
echo [2/4] Checking PostgreSQL container...
docker ps --filter "name=qa-postgres"
echo [3/4] Ensuring database schema exists...
node scripts/setup-db.cjs
if errorlevel 1 exit /b 1
echo [4/4] Running API and database integration tests...
call npx playwright test --config=playwright.integration.config.ts
exit /b %errorlevel%
