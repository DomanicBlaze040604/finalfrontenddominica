# 🔧 Backend CORS Configuration Fix

## 🚨 Problem
Your Railway backend is not allowing requests from `https://www.dominicanews.dm` due to CORS policy restrictions.

## ✅ Solution
You need to update your Railway backend to allow your custom domain.

## 🛠 Backend Configuration Needed

### For Express.js Backend
Add this to your backend server configuration:

```javascript
const cors = require('cors');

// CORS configuration
const corsOptions = {
  origin: [
    'http://localhost:3000',
    'http://localhost:5173',
    'http://localhost:8080',
    'http://localhost:8081',
    'https://your-project.vercel.app',
    'https://www.dominicanews.dm',
    'https://dominicanews.dm'
  ],
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: [
    'Origin',
    'X-Requested-With', 
    'Content-Type', 
    'Accept', 
    'Authorization',
    'Cache-Control'
  ]
};

app.use(cors(corsOptions));

// Handle preflight requests
app.options('*', cors(corsOptions));
```

### For Other Backend Frameworks

#### FastAPI (Python)
```python
from fastapi.middleware.cors import CORSMiddleware

origins = [
    "http://localhost:3000",
    "http://localhost:5173", 
    "http://localhost:8080",
    "http://localhost:8081",
    "https://your-project.vercel.app",
    "https://www.dominicanews.dm",
    "https://dominicanews.dm"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

#### Django (Python)
```python
# settings.py
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "http://localhost:5173",
    "http://localhost:8080", 
    "http://localhost:8081",
    "https://your-project.vercel.app",
    "https://www.dominicanews.dm",
    "https://dominicanews.dm",
]

CORS_ALLOW_CREDENTIALS = True
CORS_ALLOW_ALL_ORIGINS = False  # Set to True only for development
```

## 🚀 Quick Fix (Temporary)

If you need immediate access, you can temporarily allow all origins (NOT recommended for production):

```javascript
// Express.js - TEMPORARY FIX ONLY
app.use(cors({
  origin: '*',
  credentials: false,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Authorization']
}));
```

## 🔍 How to Apply the Fix

### 1. **Access Your Railway Backend**
- Go to your Railway dashboard
- Open your backend project
- Access the code or deployment settings

### 2. **Update CORS Configuration**
- Add your domain `https://www.dominicanews.dm` to allowed origins
- Ensure all necessary headers are allowed
- Include both `www` and non-`www` versions of your domain

### 3. **Redeploy Backend**
- After updating the CORS configuration
- Redeploy your Railway backend
- Wait for deployment to complete

### 4. **Test the Fix**
- Try logging in from your custom domain
- Check browser console for CORS errors
- Verify API calls are working

## 📋 Environment Variables

You might want to set these as environment variables in Railway:

```env
FRONTEND_URL=https://www.dominicanews.dm
ALLOWED_ORIGINS=https://www.dominicanews.dm,https://dominicanews.dm,https://your-project.vercel.app
```

Then use them in your CORS configuration:

```javascript
const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'];

const corsOptions = {
  origin: allowedOrigins,
  credentials: true,
  // ... other options
};
```

## ✅ Verification Steps

After updating your backend:

1. **Check Network Tab**: No CORS errors in browser console
2. **Test Login**: Admin login should work from custom domain  
3. **Test API Calls**: Articles should load on homepage
4. **Test All Features**: Registration, admin panel, etc.

## 🆘 If Still Not Working

1. **Check Railway Logs**: Look for CORS-related errors in backend logs
2. **Verify Domain**: Ensure you're using the exact domain in CORS config
3. **Check Headers**: Use browser dev tools to inspect request/response headers
4. **Test with curl**: 
   ```bash
   curl -H "Origin: https://www.dominicanews.dm" \
        -H "Access-Control-Request-Method: POST" \
        -H "Access-Control-Request-Headers: Content-Type" \
        -X OPTIONS \
        https://web-production-af44.up.railway.app/api/auth/login
   ```

The backend should return proper CORS headers in the response.

---

**Once you update your Railway backend with the correct CORS configuration, your custom domain will work perfectly!** 🎉