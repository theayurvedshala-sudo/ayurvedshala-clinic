@echo off
setlocal
title Ayurvedshala Clinical ERP
cd /d "%~dp0"

echo ============================================
echo       AYURVEDSHALA CLINICAL ERP
echo ============================================
echo.

where node >nul 2>nul
if errorlevel 1 (
  echo ERROR: Node.js is not installed or not available in PATH.
  echo Install Node.js 20.19 or newer, then run this file again.
  pause
  exit /b 1
)

where npm >nul 2>nul
if errorlevel 1 (
  echo ERROR: npm is not available in PATH.
  pause
  exit /b 1
)

if not exist ".env" (
  echo Creating local .env from .env.local.example...
  copy /Y ".env.local.example" ".env" >nul
  echo.
  echo IMPORTANT: edit .env and add a strong JWT_SECRET.
  echo Add Cloudinary credentials if you need photo/document uploads.
  echo.
)

if not exist "node_modules" (
  echo Installing project packages...
  call npm install
  if errorlevel 1 goto :failed
)

if not exist ".local-setup-complete" (
  echo Initializing local MongoDB data...
  echo Make sure MongoDB is running on this computer.
  call npm run seed
  if errorlevel 1 goto :failed
  type nul > ".local-setup-complete"
)

echo.
echo Starting frontend and backend...
echo PC: http://localhost:5173
echo Phone/tablet: use the Network URL printed by Vite.
echo.
call npm run dev
exit /b %errorlevel%

:failed
echo.
echo Setup failed. Read the error shown above.
pause
exit /b 1
