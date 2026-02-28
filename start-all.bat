@echo off
echo ========================================
echo   IAP-MG Using GenAI - Starting All Services
echo ========================================

echo.
echo [1/4] Starting Backend (Port 5000)...
start "Backend" cmd /k "cd /d %~dp0backend && npm start"

timeout /t 3 /nobreak > nul

echo [2/4] Starting Frontend (Port 3000)...
start "Frontend" cmd /k "cd /d %~dp0frontend && npm start"

timeout /t 3 /nobreak > nul

echo [3/4] Starting PDF Service (Port 5001)...
start "PDF Service" cmd /k "cd /d %~dp0python-services\pdf_service && pip install -r requirements.txt -q && python app.py"

timeout /t 2 /nobreak > nul

echo [4/4] Starting SMS Service (Port 5002)...
start "SMS Service" cmd /k "cd /d %~dp0python-services\sms_service && pip install -r requirements.txt -q && python app.py"

echo.
echo ========================================
echo   All 4 services started!
echo   Frontend: http://localhost:3000
echo   Backend:  http://localhost:5000
echo ========================================
echo.
pause