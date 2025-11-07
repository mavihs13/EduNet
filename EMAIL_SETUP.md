# Email Setup for Password Reset

## Quick Development (No Email Setup)
The system works without email configuration and shows reset links in:
- Browser console (for development)
- Forgot password page (clickable link)

## Gmail Setup (Production)

### 1. Enable 2-Factor Authentication
1. Go to [Google Account Settings](https://myaccount.google.com/)
2. Security → 2-Step Verification → Turn On

### 2. Generate App Password
1. Google Account → Security → App passwords
2. Select app: "Mail"
3. Select device: "Other" → Enter "EduNet"
4. Copy the 16-character password

### 3. Update Environment Variables
```env
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="your-actual-email@gmail.com"
SMTP_PASS="your-16-char-app-password"
```

### 4. Test Email
- Restart server: `npm run dev`
- Try forgot password with real email
- Check console for success/error messages

## Alternative Email Providers

### Outlook/Hotmail
```env
SMTP_HOST="smtp-mail.outlook.com"
SMTP_PORT="587"
SMTP_USER="your-email@outlook.com"
SMTP_PASS="your-password"
```

### Yahoo
```env
SMTP_HOST="smtp.mail.yahoo.com"
SMTP_PORT="587"
SMTP_USER="your-email@yahoo.com"
SMTP_PASS="your-app-password"
```

## Troubleshooting
- **"Authentication failed"** → Check app password
- **"Connection timeout"** → Check SMTP host/port
- **"Less secure apps"** → Use app password instead
- **Development mode** → Reset link shown in console/page