@echo off
cls
echo ========================================
echo    EduNet - Starting Development Server
echo ========================================
echo.
echo Cleaning cache and starting...
echo.

REM Clean the .next directory
if exist .next (
    rmdir /s /q .next
    echo ✓ Cache cleared
) else (
    echo ✓ No cache to clear
)

echo.
echo Starting server...
echo.
echo ========================================
echo   Open: http://localhost:3000
echo ========================================
echo.

npm run dev
