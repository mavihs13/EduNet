const { execSync } = require('child_process');

console.log('🔄 Setting up database...');

try {
  // Generate Prisma client
  console.log('📦 Generating Prisma client...');
  execSync('npx prisma generate', { stdio: 'inherit' });
  
  // Push database schema
  console.log('🗄️ Creating database schema...');
  execSync('npx prisma db push', { stdio: 'inherit' });
  
  console.log('✅ Database setup complete!');
  console.log('🚀 You can now run: npm run dev');
} catch (error) {
  console.error('❌ Database setup failed:', error.message);
  process.exit(1);
}