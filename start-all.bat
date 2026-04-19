@echo off
echo ========================================
echo   IAP-MG Using GenAI - Starting All Services
echo ========================================

echo.
echo [1/3] Starting PDF Service (Port 5001)...
start "PDF Service" cmd /k "cd /d %~dp0python-services\pdf_service && python app.py"

timeout /t 3 /nobreak > nul
echo [2/3] Starting Backend (Port 5000)...
start "Backend" cmd /k "cd /d %~dp0backend && npm start"


timeout /t 3 /nobreak > nul
echo [3/3] Starting Frontend (Port 3000)...
start "Frontend" cmd /k "cd /d %~dp0frontend && npm start"

echo.
echo ========================================
echo   All 3 services started!
echo   Frontend: http://localhost:3000
echo   Backend:  http://localhost:5000
echo ========================================
echo.
pause