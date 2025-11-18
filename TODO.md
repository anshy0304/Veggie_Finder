# Authentication Fix - TODO List

## Completed Tasks ✅

### 1. User Model Updates
- [x] Added `otp` field (String, optional) to User schema
- [x] Added `otpExpires` field (Date, optional) to User schema

### 2. Auth Routes Implementation
- [x] Implemented complete `/login` route with password verification
- [x] Implemented complete `/resend-otp` route
- [x] Added proper error handling for all routes
- [x] Ensured password comparison using bcrypt

### 3. Email Utility Enhancement
- [x] Updated sendEmail.js to log OTPs to console when email is not configured
- [x] Added error handling for email sending failures
- [x] Created .env.example file with all required environment variables

## Remaining Tasks 📋

### 4. Environment Configuration
- [x] Copy .env.example to .env and configure values
- [x] Set JWT_SECRET (required)
- [x] Set MONGO_URI (required) - configured in Vercel
- [ ] Set email configuration (optional - OTPs will log to console if not set)

### 5. Testing
- [ ] Start backend server (npm run dev:backend)
- [ ] Test password-based login
- [ ] Test OTP-based signup flow
- [ ] Test OTP-based login flow
- [ ] Test resend OTP functionality
- [ ] Verify MongoDB connection and data persistence

### 6. Frontend Integration Testing
- [ ] Test Login.jsx with password mode
- [ ] Test Login.jsx with OTP mode
- [ ] Test Signup.jsx flow
- [ ] Test VerifyOtp.jsx page
- [ ] Verify token storage in localStorage
- [ ] Test protected routes access

## Notes

### Required Environment Variables
```
JWT_SECRET=your_jwt_secret_key_here
MONGO_URI=mongodb://localhost:27017/recipe_finder (or your MongoDB connection string)
PORT=5000

# Email Configuration (if using real email service)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
```

### Testing Checklist
1. **Signup Flow**:
   - User signs up with email/password
   - OTP is generated and saved to database
   - User receives OTP (check console logs if email not configured)
   - User verifies OTP on /verify-otp page
   - User is logged in and redirected to home

2. **Password Login**:
   - User enters email/password
   - Backend verifies credentials
   - JWT token is generated and returned
   - User is logged in and redirected to home

3. **OTP Login**:
   - User requests OTP via email
   - OTP is generated and saved
   - User enters OTP
   - User is logged in and redirected to home

### Common Issues to Check
- [ ] MongoDB is running and accessible
- [ ] JWT_SECRET is set in .env
- [ ] Email service is configured (or check console for OTP)
- [ ] CORS is properly configured
- [ ] Frontend API base URL matches backend port
