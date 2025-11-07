# 🔧 Environment Configuration Guide

## 📝 Overview

Your application can work with different backend environments. Here's how to configure them.

---

## 🌐 Available Backends

### 1. Production (Railway) - **Currently Active**
```env
VITE_API_URL=https://web-production-af44.up.railway.app
```
- ✅ Live production backend
- ✅ Deployed on Railway
- ✅ Always available
- ✅ Use for production/testing

### 2. Local Development
```env
VITE_API_URL=http://localhost:5000
```
- 🔧 Local backend server
- 🔧 Requires backend running locally
- 🔧 Use for development
- 🔧 Faster for testing changes

---

## 🚀 Quick Switch

### Switch to Railway Backend (Production)
```bash
# Edit .env file
VITE_API_URL=https://web-production-af44.up.railway.app
```

### Switch to Local Backend (Development)
```bash
# Edit .env file
VITE_API_URL=http://localhost:5000

# Make sure backend is running
cd backend
npm run dev
```

---

## 📁 Environment Files

### `.env` (Active Configuration)
Your current active environment configuration.
```env
VITE_API_URL=https://web-production-af44.up.railway.app
```

### `.env.example` (Template)
Template for new developers to copy.
```bash
# Copy to create your own .env
cp .env.example .env
```

### `.env.production` (Production Build)
Used when building for production.
```env
VITE_API_URL=https://web-production-af44.up.railway.app
```

---

## 🔍 Current Configuration

**Active Backend:** Railway Production
```
URL: https://web-production-af44.up.railway.app
Status: ✅ Live
Environment: Production
```

**Fallback:** If `VITE_API_URL` is not set, the app will use Railway backend by default.

---

## 🛠️ Setup Instructions

### First Time Setup

1. **Copy Environment File:**
   ```bash
   cp .env.example .env
   ```

2. **Verify Configuration:**
   ```bash
   cat .env | grep VITE_API_URL
   ```
   Should show: `VITE_API_URL=https://web-production-af44.up.railway.app`

3. **Start Frontend:**
   ```bash
   npm run dev
   ```

4. **Check Connection:**
   - Open browser console
   - Look for: `🔗 API Base URL: https://web-production-af44.up.railway.app`
   - Try logging in at `/admin/login`

---

## 🔄 Switching Environments

### Method 1: Edit .env File
```bash
# Open .env in your editor
nano .env

# Change VITE_API_URL to desired backend
VITE_API_URL=http://localhost:5000  # or Railway URL

# Save and restart dev server
npm run dev
```

### Method 2: Environment Variable
```bash
# Temporary override (Linux/Mac)
VITE_API_URL=http://localhost:5000 npm run dev

# Temporary override (Windows PowerShell)
$env:VITE_API_URL="http://localhost:5000"; npm run dev

# Temporary override (Windows CMD)
set VITE_API_URL=http://localhost:5000 && npm run dev
```

---

## 🧪 Testing Different Backends

### Test Railway Backend
```bash
# Set Railway URL
echo "VITE_API_URL=https://web-production-af44.up.railway.app" > .env

# Start frontend
npm run dev

# Test in browser
# Should connect to Railway backend
```

### Test Local Backend
```bash
# Start backend first
cd backend
npm run dev

# In another terminal, set local URL
cd ..
echo "VITE_API_URL=http://localhost:5000" > .env

# Start frontend
npm run dev

# Test in browser
# Should connect to local backend
```

---

## 🐛 Troubleshooting

### Issue: "Network Error" or CORS Error

**Solution 1: Check Backend URL**
```bash
# Verify URL in .env
cat .env | grep VITE_API_URL

# Make sure it matches your backend
```

**Solution 2: Check Backend is Running**
```bash
# For Railway backend
curl https://web-production-af44.up.railway.app/api/articles

# For local backend
curl http://localhost:5000/api/articles
```

**Solution 3: Check CORS Configuration**
- Backend must allow your frontend URL
- Check backend CORS settings
- Ensure `withCredentials: true` is set (already done)

### Issue: "401 Unauthorized"

**Solution:**
```bash
# Clear browser storage
# Open browser console and run:
localStorage.clear()

# Login again
```

### Issue: Changes Not Reflecting

**Solution:**
```bash
# Restart dev server
# Press Ctrl+C to stop
npm run dev

# Or hard refresh browser
# Ctrl+Shift+R (Windows/Linux)
# Cmd+Shift+R (Mac)
```

---

## 📊 Environment Variables Reference

### Required Variables
```env
VITE_API_URL=https://web-production-af44.up.railway.app
```

### Optional Variables
```env
# Admin Credentials (for demo)
VITE_ADMIN_EMAIL=admin@dominicanews.com
VITE_ADMIN_PASSWORD=Pass@12345

# Site Configuration
VITE_SITE_NAME=Dominica News
VITE_SITE_URL=https://dominicanews.com
VITE_SITE_DESCRIPTION=Your trusted source for news

# Social Media
VITE_FACEBOOK_URL=https://facebook.com/dominicanews
VITE_TWITTER_URL=https://twitter.com/dominicanews
VITE_INSTAGRAM_URL=https://instagram.com/dominicanews
VITE_YOUTUBE_URL=https://youtube.com/dominicanews

# Features
VITE_ENABLE_COMMENTS=true
VITE_ENABLE_NEWSLETTER=true
VITE_ENABLE_DARK_MODE=true
```

---

## 🚀 Deployment

### Netlify/Vercel
Set environment variable in dashboard:
```
VITE_API_URL=https://web-production-af44.up.railway.app
```

### Build Command
```bash
npm run build
```

### Environment Variables in Build
The build process will use `.env.production` if it exists, otherwise `.env`.

---

## ✅ Verification Checklist

After changing environment:

- [ ] Updated `VITE_API_URL` in `.env`
- [ ] Restarted dev server
- [ ] Checked browser console for API URL log
- [ ] Tested login functionality
- [ ] Verified API calls in Network tab
- [ ] No CORS errors in console

---

## 📞 Quick Reference

| Environment | URL | Use Case |
|-------------|-----|----------|
| **Production (Railway)** | `https://web-production-af44.up.railway.app` | Live site, testing |
| **Local Development** | `http://localhost:5000` | Development, debugging |

**Current Active:** Railway Production ✅

---

## 🎯 Best Practices

1. **Development:**
   - Use local backend when developing new features
   - Faster iteration and debugging

2. **Testing:**
   - Use Railway backend to test with production data
   - Verify features work with live backend

3. **Production:**
   - Always use Railway backend URL
   - Never commit `.env` file to git
   - Use environment variables in deployment platform

4. **Team Collaboration:**
   - Share `.env.example` with team
   - Document any new environment variables
   - Keep Railway URL updated if it changes

---

**Last Updated:** $(date)
**Current Backend:** Railway Production
**Status:** ✅ Configured and Ready
