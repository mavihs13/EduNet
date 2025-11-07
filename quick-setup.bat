@echo off
echo Setting up EduNet database...
echo.

echo Generating Prisma client...
npx prisma generate

echo.
echo Creating database...
npx prisma db push --force-reset

echo.
echo ✅ Setup complete! You can now run: npm run dev
pause