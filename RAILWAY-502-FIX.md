# 🚨 Railway 502 Error - Application Not Responding

## Problem Identified

Railway shows **"Deployment successful"** and **"ACTIVE"** but returns:
```json
{
  "status": "error",
  "code": 502,
  "message": "Application failed to respond"
}
```

This means your app deployed but **crashed immediately** or **isn't listening properly**.

---

## 🔍 Root Causes

### 1. Not Listening on Railway's PORT
Railway assigns a dynamic PORT. Your app MUST use `process.env.PORT`:

```javascript
// ❌ WRONG
app.listen(5000);

// ✅ CORRECT
const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});
```

### 2. MongoDB Connection Failing
If MongoDB fails to connect, the app crashes:

```javascript
// Add error handling
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => {
    console.error('❌ MongoDB connection failed:', err);
    // Don't exit - let Railway restart
  });
```

### 3. Missing Environment Variables
Check Railway has these set:
- `MONGODB_URI`
- `JWT_SECRET`
- `NODE_ENV=production`
- `FRONTEND_URL`

---

## ✅ Quick Fixes

### Fix 1: Update Server Listen Code

In your `server.js` or `app.js`:

```javascript
const PORT = process.env.PORT || 5000;
const HOST = '0.0.0.0'; // Important for Railway!

app.listen(PORT, HOST, () => {
  console.log(`✅ Server running on ${HOST}:${PORT}`);
  console.log(`✅ Environment: ${process.env.NODE_ENV}`);
  console.log(`✅ MongoDB: ${process.env.MONGODB_URI ? 'Configured' : 'Missing'}`);
});
```

### Fix 2: Add Startup Logging

Add this at the top of your main file:

```javascript
console.log('🚀 Starting application...');
console.log('📍 PORT:', process.env.PORT);
console.log('📍 NODE_ENV:', process.env.NODE_ENV);
console.log('📍 MONGODB_URI:', process.env.MONGODB_URI ? 'Set' : 'Missing');

// Your app code...
```

### Fix 3: Add Health Check Endpoint

```javascript
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    mongodb: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});
```

### Fix 4: Graceful Error Handling

```javascript
// Handle uncaught errors
process.on('uncaughtException', (err) => {
  console.error('❌ Uncaught Exception:', err);
});

process.on('unhandledRejection', (err) => {
  console.error('❌ Unhandled Rejection:', err);
});
```

---

## 🔧 Railway Dashboard Steps

### 1. Check Logs
1. Go to Railway dashboard
2. Click your service
3. Click "View Logs"
4. Look for:
   - Startup messages
   - Error messages
   - MongoDB connection status
   - Port binding messages

### 2. Verify Environment Variables
1. Click "Variables" tab
2. Ensure these exist:
   ```
   MONGODB_URI=mongodb+srv://...
   JWT_SECRET=your-secret
   NODE_ENV=production
   PORT=(leave empty - Railway sets this)
   ```

### 3. Check MongoDB Atlas
1. Go to MongoDB Atlas
2. Network Access → IP Whitelist
3. Add `0.0.0.0/0` (allow all)
4. Database Access → Verify user exists

### 4. Restart Service
1. Click "Settings" tab
2. Scroll to "Danger Zone"
3. Click "Restart"
4. Wait 30 seconds
5. Test: `curl https://web-production-af44.up.railway.app/api/health`

---

## 🧪 Test Backend Locally First

Before deploying, test locally:

```bash
# Set environment variables
export PORT=5000
export MONGODB_URI="your-mongodb-uri"
export JWT_SECRET="your-secret"

# Start server
npm start

# Test in another terminal
curl http://localhost:5000/api/health
curl http://localhost:5000/api/articles
```

If it works locally but not on Railway, it's an environment issue.

---

## 📋 Complete Backend Checklist

```javascript
// server.js or app.js
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';

const app = express();

// 1. CORS Configuration
app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://dominicanews.dm',
    'https://www.dominicanews.dm'
  ],
  credentials: true
}));

// 2. Body Parser
app.use(express.json());

// 3. Health Check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok',
    mongodb: mongoose.connection.readyState === 1
  });
});

// 4. MongoDB Connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('❌ MongoDB error:', err));

// 5. Your Routes
// ... your API routes here

// 6. Error Handler
app.use((err, req, res, next) => {
  console.error('❌ Error:', err);
  res.status(500).json({ error: err.message });
});

// 7. Start Server (IMPORTANT!)
const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Server running on port ${PORT}`);
});
```

---

## 🎯 Most Common Issue

**99% of the time it's this:**

```javascript
// ❌ WRONG - Hardcoded port
app.listen(5000);

// ✅ CORRECT - Use Railway's PORT
app.listen(process.env.PORT || 5000, '0.0.0.0');
```

---

## 🆘 If Still Not Working

### Option 1: Share Backend Code
Share your `server.js` or `app.js` file so I can identify the exact issue.

### Option 2: Check Railway Logs
Copy the error from Railway logs and share it.

### Option 3: Alternative Backend URL
If you have another backend URL that works, update `.env`:
```env
VITE_API_URL=https://your-working-backend.com
```

---

## ✅ Success Indicators

After fixing, you should see:

**In Railway Logs:**
```
✅ Server running on port 8080
✅ MongoDB connected
✅ Environment: production
```

**Testing:**
```bash
curl https://web-production-af44.up.railway.app/api/health
# Returns: {"status":"ok","mongodb":true}

curl https://web-production-af44.up.railway.app/api/articles
# Returns: [array of articles]
```

**In Frontend:**
- No network errors
- Articles load
- Login works

---

**The backend is deployed but not running. Fix the PORT binding and MongoDB connection!**
