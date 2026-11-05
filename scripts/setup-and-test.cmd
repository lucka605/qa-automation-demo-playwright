@echo off
setlocal
cd /d "%~dp0.."
if not exist "database\.env" (
  echo ERROR: database\.env is missing. Add POSTGRES_PASSWORD to it.
  exit /b 1
)
echo [1/3] Ensuring PostgreSQL schema...
node scripts/setup-db.cjs
if errorlevel 1 exit /b 1
echo [2/3] Running Playwright API + DB integration suite...
call npx playwright test --config=playwright.integration.config.ts
if errorlevel 1 exit /b 1
echo [3/3] All integration tests passed.
exit /b 0
