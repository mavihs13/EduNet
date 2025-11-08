# EduNet Troubleshooting Guide

## Common Issues and Solutions

### 1. Environment Variables Not Set

**Error**: `JWT secrets not configured` or similar authentication errors

**Solution**:
```bash
npm run setup:env
```
This will generate a `.env.local` file with secure random secrets.

### 2. Database Connection Issues

**Error**: `PrismaClientInitializationError`

**Solutions**:
```bash
# Reset and regenerate database
npm run db:push
npm run db:generate

# If using PostgreSQL, ensure the database exists
# If using SQLite (default), ensure write permissions
```

### 3. Redis Connection Errors

**Error**: `Redis Client Error`

**Solutions**:
- For development: Redis is optional, the app will work without it
- For production: Install and start Redis server
- Update `REDIS_URL` in `.env.local` if using custom Redis setup

### 4. NextAuth Configuration Issues

**Error**: `[next-auth][error][CLIENT_FETCH_ERROR]`

**Solutions**:
- Ensure `NEXTAUTH_SECRET` is set in `.env.local`
- Verify `NEXTAUTH_URL` matches your domain
- For GitHub OAuth, set `GITHUB_CLIENT_ID` and `GITHUB_CLIENT_SECRET`

### 5. File Upload Issues

**Error**: File upload fails or security errors

**Solutions**:
- Ensure `public/uploads` directory exists and is writable
- Check file size limits (default: 5MB)
- Verify file types are allowed (images only by default)

### 6. Socket.IO Connection Issues

**Error**: WebSocket connection fails

**Solutions**:
- Ensure server is running: `npm run dev`
- Check CORS configuration in `server.js`
- Verify port 3000 is available

### 7. TypeScript Errors

**Error**: Type errors during build

**Solutions**:
```bash
# Install missing dependencies
npm install

# Regenerate Prisma client
npm run db:generate

# Check TypeScript configuration
npx tsc --noEmit
```

### 8. Performance Issues

**Symptoms**: Slow loading, high memory usage

**Solutions**:
- Enable database indexing for frequently queried fields
- Implement pagination for large datasets
- Optimize image sizes
- Use Redis for caching in production

### 9. Security Warnings

**Issue**: Security vulnerabilities in dependencies

**Solutions**:
```bash
# Audit and fix vulnerabilities
npm audit fix

# Update dependencies
npm update
```

### 10. Build Errors

**Error**: Build fails in production

**Solutions**:
```bash
# Clear Next.js cache
rm -rf .next

# Rebuild
npm run build

# Check for environment-specific issues
NODE_ENV=production npm run build
```

## Development Setup Checklist

- [ ] Node.js 18+ installed
- [ ] Dependencies installed (`npm install`)
- [ ] Environment variables configured (`.env.local`)
- [ ] Database initialized (`npm run db:push`)
- [ ] Prisma client generated (`npm run db:generate`)
- [ ] Development server running (`npm run dev`)

## Production Deployment Checklist

- [ ] Environment variables set on hosting platform
- [ ] Database URL configured for production
- [ ] Redis configured (recommended)
- [ ] File upload storage configured (AWS S3 recommended)
- [ ] CORS origins updated for production domain
- [ ] SSL certificate configured
- [ ] Security headers enabled

## Getting Help

1. Check this troubleshooting guide
2. Review the main README.md
3. Check the GitHub issues
4. Ensure you're using the latest version

## Reporting Issues

When reporting issues, please include:
- Node.js version (`node --version`)
- npm version (`npm --version`)
- Operating system
- Error messages (full stack trace)
- Steps to reproduce
- Environment configuration (without secrets)