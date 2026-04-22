@echo off
echo ========================================
echo   AI Client Build Script for Windows
echo ========================================
echo.

:: Check Node.js
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Node.js is not installed!
    echo Please install from https://nodejs.org
    pause
    exit /b 1
)

:: Check Rust
where cargo >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Rust is not installed!
    echo Please install from https://rustup.rs
    pause
    exit /b 1
)

echo [OK] Environment check passed
echo.

:: Install pnpm if not exists
where pnpm >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo Installing pnpm...
    npm install -g pnpm
)

:: Install dependencies
echo Installing dependencies...
call pnpm install
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Failed to install dependencies
    pause
    exit /b 1
)

:: Build
echo Building application...
call pnpm tauri build
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Build failed
    pause
    exit /b 1
)

echo.
echo ========================================
echo   Build completed successfully!
echo ========================================
echo.
echo Output: src-tauri\target\release\bundle\
echo.
pause
