# VeggieFinder Setup Guide

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Copy the example environment file and configure it:

```bash
# On Windows (Command Prompt)
copy .env.example .env

# On Windows (PowerShell)
Copy-Item .env.example .env

# On Mac/Linux
cp .env.example .env
```

Then edit `.env` file with your configuration:

**Minimum Required Configuration:**
```env
MONGO_URI=mongodb://localhost:27017/recipe_finder
JWT_SECRET=your_super_secret_jwt_key_change_this
PORT=5000
```

**Optional Email Configuration** (OTPs will be logged to console if not configured):
```env
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_gmail_app_password
```

### 3. Start MongoDB

Make sure MongoDB is running on your system:

**Windows:**
```bash
# If MongoDB is installed as a service, it should already be running
# Otherwise, start it manually:
mongod
```

**Mac (with Homebrew):**
```bash
brew services start mongodb-community
```

**Linux:**
```bash
sudo systemctl start mongod
```

### 4. Start the Application

**Terminal 1 - Backend Server:**
```bash
npm run dev:backend
```

**Terminal 2 - Frontend Development Server:**
```bash
npm run dev
```

The application will be available at:
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000

## Authentication Flow

### Signup Process

1. User navigates to `/signup`
2. User enters email and password (minimum 6 characters)
3. Backend creates user account with `isVerified: false`
4. Backend generates 6-digit OTP and saves to database
5. OTP is sent via email (or logged to console if email not configured)
6. User is redirected to `/verify-otp` page
7. User enters OTP received
8. Backend verifies OTP and marks account as verified
9. User is logged in and redirected to home page

### Login Process (Password)

1. User navigates to `/login`
2. User selects "Password" tab
3. User enters email and password
4. Backend verifies credentials
5. If account is not verified, user is prompted to verify
6. If credentials are valid, JWT token is generated
7. User is logged in and redirected to home page

### Login Process (OTP)

1. User navigates to `/login`
2. User selects "OTP" tab
3. User enters email and clicks "Send OTP"
4. Backend generates OTP and sends to email
5. User enters received OTP
6. Backend verifies OTP
7. User is logged in and redirected to home page

## Troubleshooting

### Issue: "OTP not matching"

**Solution:**
- Check the backend console for the OTP (it will be logged if email is not configured)
- Make sure you're entering the OTP within 10 minutes (it expires)
- Ensure MongoDB is running and the OTP was saved to the database

### Issue: "Cannot login with password"

**Solution:**
- Verify your account first if you just signed up
- Check that MongoDB is running
- Ensure the password is at least 6 characters
- Check backend console for any error messages

### Issue: "MongoDB connection failed"

**Solution:**
- Make sure MongoDB is installed and running
- Verify the MONGO_URI in your .env file
- Check if the database name is correct
- Try connecting with: `mongodb://localhost:27017/recipe_finder`

### Issue: "JWT_SECRET not defined"

**Solution:**
- Make sure you have a .env file in the root directory
- Add `JWT_SECRET=your_secret_key_here` to the .env file
- Restart the backend server

### Issue: "Email not sending"

**Solution:**
- This is expected if email is not configured
- Check the backend console - OTPs will be logged there
- To configure email:
  - For Gmail: Enable 2FA and create an App Password
  - Add EMAIL_HOST, EMAIL_PORT, EMAIL_USER, EMAIL_PASS to .env
  - Restart the backend server

## Development Tips

### Viewing OTPs During Development

When email is not configured, OTPs are logged to the backend console in this format:

```
========================================
📧 EMAIL NOT CONFIGURED - LOGGING TO CONSOLE
========================================
To: user@example.com
Subject: Your VeggieFinder Verification Code
Message: Your one-time password (OTP) is: 123456
This code will expire in 10 minutes.
========================================
```

### Testing Authentication

1. **Create a test account:**
   - Email: test@example.com
   - Password: test123

2. **Check backend console for OTP**

3. **Verify the account using the OTP**

4. **Try logging in with password**

### Database Management

**View all users:**
```bash
mongosh
use recipe_finder
db.users.find()
```

**Clear all users (for testing):**
```bash
mongosh
use recipe_finder
db.users.deleteMany({})
```

**Check a specific user:**
```bash
mongosh
use recipe_finder
db.users.findOne({ email: "test@example.com" })
```

## Production Deployment

Before deploying to production:

1. ✅ Set a strong JWT_SECRET (use a random string generator)
2. ✅ Configure a production MongoDB database (MongoDB Atlas recommended)
3. ✅ Set up email service (required for production)
4. ✅ Update CORS settings in server.js if needed
5. ✅ Set NODE_ENV=production
6. ✅ Build the frontend: `npm run build`
7. ✅ Use a process manager like PM2 for the backend

## Support

If you encounter any issues not covered here:
1. Check the backend console for error messages
2. Check the browser console for frontend errors
3. Verify all environment variables are set correctly
4. Ensure MongoDB is running and accessible
5. Review the TODO.md file for implementation status
