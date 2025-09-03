@echo off
echo ========================================
echo    IntentLove Shop - Starting All Services
echo ========================================
echo.

echo Starting Backend Server...
start "Backend Server" cmd /k "cd creative-card-scribe-main\server && npm run dev"

echo Waiting 3 seconds for backend to initialize...
timeout /t 3 /nobreak > nul

echo Starting Main Frontend...
start "Main Frontend" cmd /k "cd site frontend && npm run dev"

echo Waiting 2 seconds for main frontend to initialize...
timeout /t 2 /nobreak > nul

echo Starting Creative Card Frontend...
start "Creative Card Frontend" cmd /k "cd creative-card-scribe-main\creative-card-scribe-main && npm run dev"

echo Waiting 2 seconds for creative card frontend to initialize...
timeout /t 2 /nobreak > nul

echo Starting Admin Dashboard...
start "Admin Dashboard" cmd /k "cd site frontend\admin-dashboard && npm run dev"

echo.
echo ========================================
echo    All services are starting...
echo ========================================
echo.
echo Services:
echo - Backend Server: http://localhost:3000 (or check terminal)
echo - Main Frontend: http://localhost:5176
echo - Creative Card Frontend: http://localhost:5174
echo - Admin Dashboard: http://localhost:5175
echo.
echo Press any key to close this window...
pause > nul
