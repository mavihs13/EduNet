const { execSync } = require('child_process');

console.log('Regenerating Prisma client...');

try {
  // Generate Prisma client
  execSync('npx prisma generate', { stdio: 'inherit' });
  console.log('✅ Prisma client generated successfully');
  
  // Push schema to database
  execSync('npx prisma db push', { stdio: 'inherit' });
  console.log('✅ Database schema updated successfully');
  
} catch (error) {
  console.error('❌ Error:', error.message);
}