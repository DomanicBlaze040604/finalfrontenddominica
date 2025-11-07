# 🚀 Startup Checklist

Use this checklist every time you start development or deploy to production.

---

## 📋 Development Startup

### 1. Backend Setup
```bash
# Navigate to backend directory
cd backend

# Install dependencies (first time only)
npm install

# Create .env file (first time only)
cp .env.example .env

# Edit .env with your MongoDB URI and JWT secret
# MONGODB_URI=mongodb://...
# JWT_SECRET=your-secret-key
# PORT=5000

# Start backend server
npm run dev
```

**✅ Verify:** Backend should be running on `http://localhost:5000`

### 2. Frontend Setup
```bash
# Navigate to frontend directory (project root)
cd ..

# Install dependencies (first time only)
npm install

# Verify .env file exists
cat .env

# Should contain:
# VITE_API_URL=http://localhost:5000

# Start frontend server
npm run dev
```

**✅ Verify:** Frontend should be running on `http://localhost:5173`

### 3. Test Connection
1. Open browser to `http://localhost:5173`
2. Navigate to `/admin/login`
3. Try logging in with admin credentials
4. Check browser console for any errors

---

## 🌐 Production Deployment

### 1. Backend Deployment

```bash
# Build backend
npm run build

# Set environment variables on hosting platform:
# - MONGODB_URI (production database)
# - JWT_SECRET (strong secret key)
# - NODE_ENV=production
# - PORT=5000 (or your hosting port)

# Deploy to hosting service
# (Railway, Heroku, DigitalOcean, etc.)
```

**✅ Verify:** Backend is accessible at your production URL

### 2. Frontend Deployment

```bash
# Update .env.production
echo "VITE_API_URL=https://your-backend-domain.com" > .env.production

# Build frontend
npm run build

# Deploy dist folder to hosting service
# (Netlify, Vercel, GitHub Pages, etc.)
```

**✅ Verify:** Frontend is accessible at your production URL

### 3. Backend CORS Configuration

Update backend CORS to include production domain:
```javascript
corsOptions: {
  origin: [
    'https://your-frontend-domain.com',
    'http://localhost:5173'
  ],
  credentials: true
}
```

---

## 🔍 Quick Health Check

### Backend Health
```bash
# Test backend is running
curl http://localhost:5000/

# Test login endpoint
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"password"}'

# Test articles endpoint
curl http://localhost:5000/api/articles
```

### Frontend Health
1. Open `http://localhost:5173`
2. Check browser console for errors
3. Navigate to `/admin/login`
4. Try logging in
5. Check Network tab for API calls

---

## 🐛 Common Issues

### Backend Won't Start
- ✅ Check MongoDB is running
- ✅ Verify `.env` file exists
- ✅ Check port 5000 is not in use
- ✅ Run `npm install` again

### Frontend Won't Start
- ✅ Check Node.js version (16+)
- ✅ Run `npm install` again
- ✅ Clear `node_modules` and reinstall
- ✅ Check port 5173 is not in use

### CORS Errors
- ✅ Verify backend CORS includes frontend URL
- ✅ Check `withCredentials: true` in API client
- ✅ Ensure backend is running
- ✅ Clear browser cache

### 401 Unauthorized
- ✅ Clear localStorage and login again
- ✅ Check JWT_SECRET is set in backend
- ✅ Verify token is being sent in headers
- ✅ Check token hasn't expired

### 404 Not Found
- ✅ Verify API URL in `.env`
- ✅ Check endpoint path is correct
- ✅ Ensure backend route exists
- ✅ Check for typos in URL

---

## 📊 Environment Variables

### Backend (.env)
```env
MONGODB_URI=mongodb://localhost:27017/dominicanews
JWT_SECRET=your-super-secret-key-change-this
PORT=5000
NODE_ENV=development
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:5000
VITE_ADMIN_EMAIL=admin@dominicanews.com
VITE_ADMIN_PASSWORD=Pass@12345
```

### Frontend (.env.production)
```env
VITE_API_URL=https://your-backend-domain.com
```

---

## ✅ Pre-Launch Checklist

Before going live:

### Security
- [ ] Change default admin password
- [ ] Use strong JWT_SECRET
- [ ] Enable HTTPS on production
- [ ] Configure proper CORS
- [ ] Set secure cookie options
- [ ] Review API rate limits

### Testing
- [ ] Test login/logout
- [ ] Test article CRUD operations
- [ ] Test image uploads
- [ ] Test all admin features
- [ ] Test on mobile devices
- [ ] Test different browsers

### Performance
- [ ] Enable gzip compression
- [ ] Optimize images
- [ ] Enable caching
- [ ] Test load times
- [ ] Monitor API response times

### Monitoring
- [ ] Set up error logging
- [ ] Configure analytics
- [ ] Set up uptime monitoring
- [ ] Configure backup system
- [ ] Set up alerts

---

## 🎯 Daily Development Workflow

1. **Start Backend:** `cd backend && npm run dev`
2. **Start Frontend:** `npm run dev`
3. **Open Browser:** `http://localhost:5173`
4. **Start Coding!** 🚀

---

## 📞 Need Help?

- **Documentation:** See `FRONTEND-BACKEND-INTEGRATION.md`
- **API Reference:** See `API-QUICK-REFERENCE.md`
- **Migration:** See `MIGRATION-GUIDE.md`
- **Console Logs:** Check browser console and backend logs

---

**Happy Coding! 🎉**
