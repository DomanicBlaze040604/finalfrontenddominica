# 🧪 Test Integration Guide

Use this guide to test that your frontend is properly integrated with the backend.

---

## 🚀 Prerequisites

1. Backend is running on `http://localhost:5000`
2. Frontend is running on `http://localhost:5173`
3. You have admin credentials

---

## 📋 Test Checklist

### 1. Authentication Tests

#### Test Login
1. Navigate to `http://localhost:5173/admin/login`
2. Enter admin credentials
3. Click "Sign In"

**Expected Result:**
- ✅ Redirected to `/admin` dashboard
- ✅ Token stored in localStorage
- ✅ User data stored in localStorage
- ✅ No console errors

**Check:**
```javascript
// Open browser console
localStorage.getItem('token')  // Should return JWT token
localStorage.getItem('user')   // Should return user JSON
```

#### Test Logout
1. Click logout button in admin panel
2. Verify redirect to login page

**Expected Result:**
- ✅ Redirected to `/admin/login`
- ✅ Token removed from localStorage
- ✅ User data removed from localStorage

---

### 2. Articles Tests

#### Test View Articles
1. Navigate to `/admin/articles` or articles list
2. Verify articles load

**Expected Result:**
- ✅ Articles list displays
- ✅ No console errors
- ✅ Network tab shows successful API call to `/api/articles`

#### Test Create Article
1. Navigate to `/admin/new`
2. Fill in article details:
   - Title: "Test Article"
   - Content: "This is a test article"
   - Select author
   - Select category
3. Click "Publish Article"

**Expected Result:**
- ✅ Article created successfully
- ✅ Redirected to article page
- ✅ Success toast notification
- ✅ Network tab shows `POST /api/admin/articles`

#### Test Edit Article
1. Navigate to an existing article
2. Click "Edit" button
3. Modify title or content
4. Click "Update Article"

**Expected Result:**
- ✅ Article updated successfully
- ✅ Changes reflected immediately
- ✅ Success toast notification
- ✅ Network tab shows `PUT /api/admin/articles/:id`

#### Test Delete Article
1. Navigate to articles list
2. Click delete on an article
3. Confirm deletion

**Expected Result:**
- ✅ Article deleted successfully
- ✅ Article removed from list
- ✅ Success toast notification
- ✅ Network tab shows `DELETE /api/admin/articles/:id`

---

### 3. Image Upload Tests

#### Test Image Upload
1. Navigate to `/admin/new` (create article)
2. Drag and drop an image or click to upload
3. Wait for upload to complete

**Expected Result:**
- ✅ Image preview displays
- ✅ Success toast notification
- ✅ Network tab shows `POST /api/admin/images/upload`
- ✅ Response contains image URL

**Check Network Tab:**
```
Request URL: http://localhost:5000/api/admin/images/upload
Request Method: POST
Content-Type: multipart/form-data
Status: 200 OK

Response:
{
  "success": true,
  "data": {
    "url": "https://..."
  }
}
```

---

### 4. Categories Tests

#### Test View Categories
1. Navigate to `/admin/categories`
2. Verify categories load

**Expected Result:**
- ✅ Categories list displays
- ✅ Network tab shows `GET /api/categories`

#### Test Create Category
1. Click "Add Category"
2. Fill in details:
   - Name: "Test Category"
   - Slug: "test-category"
   - Color: "#FF0000"
3. Click "Save"

**Expected Result:**
- ✅ Category created successfully
- ✅ Network tab shows `POST /api/admin/categories`

---

### 5. Tags Tests

#### Test View Tags
1. Navigate to `/admin/tags`
2. Verify tags load

**Expected Result:**
- ✅ Tags list displays
- ✅ Network tab shows `GET /api/tags`

#### Test Create Tag
1. Click "Add Tag"
2. Fill in details:
   - Name: "Test Tag"
   - Color: "#00FF00"
3. Click "Save"

**Expected Result:**
- ✅ Tag created successfully
- ✅ Network tab shows `POST /api/admin/tags`

---

### 6. Pages Tests

#### Test View Pages
1. Navigate to `/admin/pages`
2. Verify pages load

**Expected Result:**
- ✅ Pages list displays
- ✅ Network tab shows `GET /api/pages`

#### Test Create Page
1. Click "Add Page"
2. Fill in details:
   - Title: "Test Page"
   - Content: "This is a test page"
3. Click "Publish"

**Expected Result:**
- ✅ Page created successfully
- ✅ Network tab shows `POST /api/admin/pages`

---

### 7. Breaking News Tests

#### Test View Breaking News
1. Navigate to `/admin/breaking-news`
2. Verify breaking news items load

**Expected Result:**
- ✅ Breaking news list displays
- ✅ Network tab shows `GET /api/breaking-news`

#### Test Create Breaking News
1. Click "Add Breaking News"
2. Fill in details:
   - Title: "Test Breaking News"
   - Priority: "High"
3. Click "Save"

**Expected Result:**
- ✅ Breaking news created successfully
- ✅ Network tab shows `POST /api/admin/breaking-news`

---

### 8. Settings Tests

#### Test View Settings
1. Navigate to `/admin/settings`
2. Verify settings load

**Expected Result:**
- ✅ Settings form displays
- ✅ Network tab shows `GET /api/settings`

#### Test Update Settings
1. Modify site name or description
2. Click "Save Settings"

**Expected Result:**
- ✅ Settings updated successfully
- ✅ Network tab shows `PUT /api/admin/settings`

---

## 🔍 Network Tab Inspection

For each test, check the Network tab in browser DevTools:

### Successful Request
```
Status: 200 OK
Response Headers:
  Content-Type: application/json
  Access-Control-Allow-Credentials: true
  
Response Body:
{
  "success": true,
  "data": { ... }
}
```

### Failed Request
```
Status: 401 Unauthorized (auth issue)
Status: 404 Not Found (endpoint issue)
Status: 500 Internal Server Error (backend issue)

Response Body:
{
  "success": false,
  "message": "Error description"
}
```

---

## 🐛 Common Issues & Solutions

### Issue: CORS Error
**Symptoms:**
- Network error in console
- Request blocked by CORS policy

**Solution:**
1. Check backend CORS configuration
2. Verify `withCredentials: true` in API client
3. Ensure backend allows your frontend URL

### Issue: 401 Unauthorized
**Symptoms:**
- All admin requests fail with 401
- Redirected to login page

**Solution:**
1. Clear localStorage and login again
2. Check token is being sent in Authorization header
3. Verify JWT_SECRET is set in backend

### Issue: 404 Not Found
**Symptoms:**
- Specific endpoint returns 404
- Other endpoints work fine

**Solution:**
1. Verify endpoint URL is correct
2. Check backend route exists
3. Ensure using correct HTTP method

### Issue: Image Upload Fails
**Symptoms:**
- Upload returns error
- Image doesn't appear

**Solution:**
1. Check file size (backend may have limit)
2. Verify backend upload directory exists
3. Check backend has write permissions
4. Verify endpoint is `/api/admin/images/upload`

---

## ✅ Success Criteria

All tests should pass with:
- ✅ No console errors
- ✅ Successful API responses (200 OK)
- ✅ Data persists after page refresh
- ✅ UI updates correctly
- ✅ Toast notifications appear
- ✅ Network requests show correct endpoints

---

## 📊 Test Results Template

Use this template to track your testing:

```
Date: ___________
Tester: ___________

Authentication:
[ ] Login - Pass/Fail
[ ] Logout - Pass/Fail

Articles:
[ ] View - Pass/Fail
[ ] Create - Pass/Fail
[ ] Edit - Pass/Fail
[ ] Delete - Pass/Fail

Images:
[ ] Upload - Pass/Fail

Categories:
[ ] View - Pass/Fail
[ ] Create - Pass/Fail

Tags:
[ ] View - Pass/Fail
[ ] Create - Pass/Fail

Pages:
[ ] View - Pass/Fail
[ ] Create - Pass/Fail

Breaking News:
[ ] View - Pass/Fail
[ ] Create - Pass/Fail

Settings:
[ ] View - Pass/Fail
[ ] Update - Pass/Fail

Overall Status: Pass/Fail
Notes: ___________
```

---

## 🎯 Quick Test Script

Run this in browser console to quickly test API:

```javascript
// Test API connection
fetch('http://localhost:5000/api/articles')
  .then(r => r.json())
  .then(d => console.log('✅ API Connected:', d))
  .catch(e => console.error('❌ API Error:', e));

// Test authentication
const token = localStorage.getItem('token');
console.log('Token:', token ? '✅ Present' : '❌ Missing');

const user = localStorage.getItem('user');
console.log('User:', user ? '✅ Present' : '❌ Missing');

// Test authenticated request
fetch('http://localhost:5000/api/admin/articles', {
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  credentials: 'include'
})
  .then(r => r.json())
  .then(d => console.log('✅ Auth Request:', d))
  .catch(e => console.error('❌ Auth Error:', e));
```

---

**Happy Testing! 🧪**
