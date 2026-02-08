@echo off
REM Raju Portfolio - Quick Start Script for Windows

echo.
echo ╔════════════════════════════════════════════════════════════╗
echo ║                                                            ║
echo ║    🎬 RAJU VIDEO PORTFOLIO - QUICK START                ║
echo ║                                                            ║
echo ╚════════════════════════════════════════════════════════════╝
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Node.js is not installed!
    echo.
    echo 📥 Please install Node.js from: https://nodejs.org/
    echo.
    pause
    exit /b 1
)

echo ✅ Node.js found: 
node --version
echo.

REM Check if npm is installed
where npm >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ npm is not installed!
    pause
    exit /b 1
)

echo ✅ npm found: 
npm --version
echo.

REM Check if node_modules exists
if not exist "node_modules" (
    echo 📦 Installing dependencies (this may take a minute)...
    call npm install
    if %ERRORLEVEL% NEQ 0 (
        echo ❌ Failed to install dependencies
        pause
        exit /b 1
    )
    echo ✅ Dependencies installed successfully
    echo.
) else (
    echo ✅ Dependencies already installed
    echo.
)

REM Start the server
echo 🚀 Starting Raju Portfolio Server...
echo.
echo 👉 Open your browser and go to: http://localhost:3000
echo.
echo 📊 Admin Panel: http://localhost:3000/admin
echo 👤 Email: admin@raju.com
echo 🔑 Password: admin123
echo.
echo Press CTRL+C to stop the server
echo.

call npm start

pause
