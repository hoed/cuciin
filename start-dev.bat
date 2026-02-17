@echo off
echo ========================================
echo   CUCIIN PLATFORM - DEVELOPMENT MODE
echo ========================================
echo.

echo [1/3] Starting Backend Server...
start "Cuciin Backend" cmd /k "cd backend && npm run dev"
timeout /t 3 /nobreak >nul

echo [2/3] Starting Frontend Dev Server...
start "Cuciin Frontend" cmd /k "cd frontend && npm run dev"
timeout /t 2 /nobreak >nul

echo [3/3] Opening Browser...
timeout /t 5 /nobreak >nul
start http://localhost:5173

echo.
echo ========================================
echo   ALL SERVICES STARTED!
echo ========================================
echo.
echo Backend:  http://localhost:5000
echo Frontend: http://localhost:5173
echo.
echo Press any key to stop all services...
pause >nul

taskkill /FI "WindowTitle eq Cuciin Backend*" /T /F
taskkill /FI "WindowTitle eq Cuciin Frontend*" /T /F
