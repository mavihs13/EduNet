@echo off
echo ========================================
echo EduNet - Quick Fix Script
echo ========================================
echo.

echo [1/3] Generating Prisma Client...
call npx prisma generate
if %errorlevel% neq 0 (
    echo ERROR: Prisma generate failed!
    pause
    exit /b 1
)
echo ✓ Prisma client generated successfully
echo.

echo [2/3] Pushing database schema...
call npx prisma db push
if %errorlevel% neq 0 (
    echo ERROR: Database push failed!
    pause
    exit /b 1
)
echo ✓ Database schema updated successfully
echo.

echo [3/3] Installing dependencies (if needed)...
call npm install
if %errorlevel% neq 0 (
    echo ERROR: npm install failed!
    pause
    exit /b 1
)
echo ✓ Dependencies installed successfully
echo.

echo ========================================
echo ✓ All fixes applied successfully!
echo ========================================
echo.
echo You can now run: npm run dev
echo.
pause
