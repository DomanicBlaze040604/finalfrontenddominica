# Migration Guide - Backend Integration Update

## 🔄 What Changed?

Your frontend has been updated to work with the new backend API structure. Here's what changed:

### Token Storage
- **Old:** `auth_token` and `auth_user`
- **New:** `token` and `user`

### API Endpoints
All admin operations now use `/api/admin/*` prefix instead of direct `/api/*` endpoints.

### Authentication
- Added `withCredentials: true` for cookie-based authentication
- Updated default API URL to `http://localhost:5000`

---

## 🚀 Migration Steps

### 1. Clear Old Authentication Data
Users will need to log in again. The old tokens won't work with the new system.

```javascript
// Clear old data (optional - will happen automatically on first login)
localStorage.removeItem('auth_token');
localStorage.removeItem('auth_user');
```

### 2. Update Environment Variables

**Development (.env):**
```env
VITE_API_URL=http://localhost:5000
```

**Production (.env.production):**
```env
VITE_API_URL=https://your-backend-domain.com
```

### 3. Start Backend Server
Make sure your backend is running:
```bash
cd backend
npm run dev
```

### 4. Test the Integration

1. **Test Login:**
   - Go to `/admin/login`
   - Login with your credentials
   - Check browser console for successful authentication

2. **Test Article Creation:**
   - Go to `/admin/new`
   - Create a test article
   - Verify it saves correctly

3. **Test Image Upload:**
   - Upload an image in article editor
   - Verify it uploads to backend

---

## 🔍 Troubleshooting

### Issue: "Network Error" or CORS Error
**Solution:** 
- Verify backend is running on `http://localhost:5000`
- Check backend CORS configuration includes your frontend URL
- Ensure `withCredentials: true` is set in API client

### Issue: "401 Unauthorized"
**Solution:**
- Clear browser localStorage and login again
- Check that token is being sent in Authorization header
- Verify backend JWT secret is configured

### Issue: "404 Not Found" on Admin Endpoints
**Solution:**
- Verify you're using the correct endpoint (e.g., `/api/admin/articles` not `/api/articles`)
- Check backend routes are properly configured
- Ensure you're logged in with admin credentials

### Issue: Image Upload Fails
**Solution:**
- Check backend has image upload endpoint: `POST /api/admin/images/upload`
- Verify file size is under backend limit
- Check backend has write permissions for upload directory

---

## 📋 Checklist

Before deploying to production:

- [ ] Backend is deployed and accessible
- [ ] Environment variables are updated
- [ ] CORS is configured for production domain
- [ ] Test login functionality
- [ ] Test article CRUD operations
- [ ] Test image uploads
- [ ] Test all admin features
- [ ] Clear any cached data
- [ ] Update documentation

---

## 🆘 Need Help?

If you encounter issues:

1. Check browser console for errors
2. Check backend logs
3. Verify environment variables
4. Review `FRONTEND-BACKEND-INTEGRATION.md` for detailed API documentation

---

## ✅ Benefits of This Update

- ✅ Proper authentication with JWT tokens
- ✅ Cookie-based sessions for better security
- ✅ Organized admin endpoints
- ✅ Better error handling
- ✅ Type-safe API calls
- ✅ React hooks for common operations
- ✅ Improved developer experience

Your frontend is now fully integrated with the backend! 🎉
