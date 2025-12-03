@echo off
echo ========================================
echo EduNet - Database Setup
echo ========================================
echo.

echo [1/3] Generating Prisma Client...
call npx prisma generate
if %errorlevel% neq 0 (
    echo ERROR: Prisma generate failed!
    pause
    exit /b 1
)
echo ✓ Prisma client generated
echo.

echo [2/3] Creating database and tables...
call npx prisma db push --accept-data-loss
if %errorlevel% neq 0 (
    echo ERROR: Database push failed!
    pause
    exit /b 1
)
echo ✓ Database created
echo.

echo [3/3] Seeding database with sample data...
call node seed-database.js
if %errorlevel% neq 0 (
    echo WARNING: Seeding failed (optional)
)
echo.

echo ========================================
echo ✓ Database setup complete!
echo ========================================
echo.
echo Your database is ready to use.
echo Run: npm run dev
echo.
pause
