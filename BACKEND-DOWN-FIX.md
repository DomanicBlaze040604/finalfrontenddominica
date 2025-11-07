
# 🚨 Backend Server Down - Fix Guide

## Problem

Your Railway backend at `https://web-production-af44.up.railway.app` is returning **502 Bad Gateway** error.

This means:
- The server is down or crashed
- Railway deployment failed
- MongoDB connection issues
- Backend service needs restart

---

## ✅ Solution 1: Fix Railway Backend (Recommended)

### Step 1: Check Railway Dashboard

1. Go to [Railway Dashboard](https://railway.app)
2. Find your `dominica-news` backend project
3. Check the deployment status

### Step 2: Check Logs

Look for errors in Railway logs:
- MongoDB connection errors
- Port binding issues
- Environment variable problems
- Crash logs

### Step 3: Common Fixes

**If MongoDB connection failed:**
```
Check MONGODB_URI environment variable in Railway
Verify MongoDB Atlas is accessible
Check IP whitelist in MongoDB Atlas (allow 0.0.0.0/0)
```

**If deployment failed:**
```
Check package.json start script
Verify all dependencies are installed
Check Node.js version compatibility
```

**If server crashed:**
```
Click "Restart" in Railway dashboard
Check for memory/resource limits
Review error logs for crash reason
```

### Step 4: Verify Environment Variables

Make sure these are set in Railway:
```
MONGODB_URI=mongodb+srv://...
PORT=5000
JWT_SECRET=your-secret-key
NODE_ENV=production
FRONTEND_URL=https://your-frontend-domain.com
```

### Step 5: Restart Service

1. In Railway dashboard, click your backend service
2. Click "Restart" button
3. Wait for deployment to complete
4. Test the URL: `https://web-production-af44.up.railway.app/api/health`

---

## ✅ Solution 2: Use Local Backend (Quick Alternative)

While fixing Railway, run backend locally:

### Step 1: Update Frontend Environment

Edit `.env` file:
```env
VITE_API_URL=http://localhost:5000
```

### Step 2: Start Local Backend

```bash
# Navigate to backend directory
cd backend

# Install dependencies (if needed)
npm install

# Start backend
npm run dev
```

Backend should start on `http://localhost:5000`

### Step 3: Restart Frontend

```bash
# Stop frontend (Ctrl+C)
# Start again
npm run dev
```

Your site should now work with local backend!

---

## ✅ Solution 3: Deploy to Alternative Service

If Railway continues to have issues, consider:

### Render.com
- Free tier available
- Easy deployment
- Good for Node.js apps

### Heroku
- Reliable platform
- Easy MongoDB integration
- Free tier available

### Vercel (for serverless)
- Deploy as serverless functions
- Good for API routes
- Free tier generous

---

## 🔍 Verification Steps

After fixing, verify:

1. **Test Backend URL:**
   ```bash
   curl https://web-production-af44.up.railway.app/api/health
   ```
   Should return 200 OK

2. **Check Frontend:**
   - Open browser console (F12)
   - Look for: `✅ API Response: /api/articles`
   - No CORS errors

3. **Test Login:**
   - Go to `/admin/login`
   - Try logging in
   - Should work without errors

---

## 🐛 Debugging Tips

### Check Backend Logs
```bash
# In Railway dashboard
View Logs → Look for errors
```

### Test API Endpoints
```bash
# Health check
curl https://web-production-af44.up.railway.app/api/health

# Articles
curl https://web-production-af44.up.railway.app/api/articles

# Categories
curl https://web-production-af44.up.railway.app/api/categories
```

### Check MongoDB Connection
```bash
# In backend code, add logging
mongoose.connection.on('connected', () => {
  console.log('✅ MongoDB connected');
});

mongoose.connection.on('error', (err) => {
  console.error('❌ MongoDB error:', err);
});
```

---

## 📋 Quick Checklist

- [ ] Checked Railway dashboard
- [ ] Reviewed deployment logs
- [ ] Verified environment variables
- [ ] Checked MongoDB connection
- [ ] Restarted Railway service
- [ ] Tested backend URL
- [ ] Frontend can connect
- [ ] Login works
- [ ] Articles load

---

## 🆘 Still Not Working?

### Option A: Share Backend Code
If you share your backend repository, I can help identify the issue.

### Option B: Use Mock Data
I can set up the frontend to work with mock data temporarily.

### Option C: Fresh Deployment
Deploy a fresh backend instance with verified configuration.

---

## 📞 Common Railway Issues

### Issue: "Application failed to respond"
**Fix:** Check if your app listens on `process.env.PORT`
```javascript
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

### Issue: "Build failed"
**Fix:** Check package.json scripts
```json
{
  "scripts": {
    "start": "node server.js",
    "build": "npm install"
  }
}
```

### Issue: "MongoDB connection timeout"
**Fix:** Check MongoDB Atlas IP whitelist
- Go to MongoDB Atlas
- Network Access → Add IP Address
- Allow access from anywhere: `0.0.0.0/0`

---

## 🎯 Next Steps

1. **Immediate:** Use local backend (Solution 2)
2. **Short-term:** Fix Railway deployment (Solution 1)
3. **Long-term:** Set up monitoring and alerts

---

**Last Updated:** November 7, 2025
**Status:** Backend Down - Needs Fix
