@echo off
echo ========================================
echo EduNet - Fix and Run
echo ========================================
echo.

echo [1/3] Cleaning cache...
rmdir /s /q .next 2>nul
echo ✓ Cache cleared
echo.

echo [2/3] Installing dependencies...
call npm install
if %errorlevel% neq 0 (
    echo ERROR: npm install failed!
    pause
    exit /b 1
)
echo ✓ Dependencies installed
echo.

echo [3/3] Starting development server...
echo.
echo ========================================
echo ✓ Server starting...
echo ========================================
echo.
call npm run dev
