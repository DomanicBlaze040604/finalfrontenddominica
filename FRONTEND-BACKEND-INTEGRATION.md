# Frontend-Backend Integration Guide

## ✅ Changes Implemented

### 1. API Client Updates (`src/lib/api/client.ts`)
- ✅ Changed `withCredentials` to `true` for cookie-based authentication
- ✅ Updated default API URL to `http://localhost:5000`
- ✅ Changed token storage key from `auth_token` to `token`
- ✅ Updated user storage key from `auth_user` to `user`

### 2. Authentication Service (`src/lib/api/auth.ts`)
- ✅ Updated token and user storage keys to match backend
- ✅ Maintained backward compatibility with response handling

### 3. API Endpoints Updated
All admin operations now use `/api/admin/*` endpoints:

#### Articles (`src/lib/api/articles.ts`)
- ✅ Create: `POST /api/admin/articles`
- ✅ Update: `PUT /api/admin/articles/:id`
- ✅ Delete: `DELETE /api/admin/articles/:id`

#### Categories (`src/lib/api/categories.ts`)
- ✅ Create: `POST /api/admin/categories`
- ✅ Update: `PUT /api/admin/categories/:id`
- ✅ Delete: `DELETE /api/admin/categories/:id`

#### Tags (`src/lib/api/tags.ts`)
- ✅ Create: `POST /api/admin/tags`
- ✅ Update: `PUT /api/admin/tags/:id`
- ✅ Delete: `DELETE /api/admin/tags/:id`

#### Pages (`src/lib/api/pages.ts`)
- ✅ Create: `POST /api/admin/pages`
- ✅ Update: `PUT /api/admin/pages/:id`
- ✅ Delete: `DELETE /api/admin/pages/:id`

#### Breaking News (`src/lib/api/breakingNews.ts`)
- ✅ Create: `POST /api/admin/breaking-news`
- ✅ Update: `PUT /api/admin/breaking-news/:id`
- ✅ Delete: `DELETE /api/admin/breaking-news/:id`
- ✅ Toggle: `PATCH /api/admin/breaking-news/:id/toggle`

#### Settings (`src/lib/api/settings.ts`)
- ✅ Update: `PUT /api/admin/settings`
- ✅ Update Social Media: `PUT /api/admin/settings/social-media`

#### Media/Uploads (`src/lib/api/media.ts`, `src/lib/api/uploads.ts`)
- ✅ Upload Image: `POST /api/admin/images/upload`
- ✅ Get All: `GET /api/admin/media`
- ✅ Update: `PUT /api/admin/media/:id`
- ✅ Delete: `DELETE /api/admin/media/:id`

### 4. React Hooks Created
- ✅ `useAuth` hook (`src/hooks/useAuth.ts`) - Authentication management
- ✅ `useArticles` hook (`src/hooks/useArticles.ts`) - Articles fetching

### 5. Environment Configuration
- ✅ Updated `.env` with correct backend URL
- ✅ Updated `.env.example` with documentation

---

## 🚀 Getting Started

### 1. Start Backend
```bash
cd backend
npm run dev
# Backend should be running on http://localhost:5000
```

### 2. Update Frontend Environment
Make sure your `.env` file has:
```env
VITE_API_URL=http://localhost:5000
```

### 3. Start Frontend
```bash
npm run dev
```

---

## 🔐 Authentication Flow

### Login Example
```typescript
import { useAuth } from '@/hooks/useAuth';

function LoginComponent() {
  const { login, loading } = useAuth();

  const handleLogin = async () => {
    try {
      await login('admin@dominicanews.dm', 'your-password');
      // User is now logged in, token stored automatically
    } catch (error) {
      console.error('Login failed:', error);
    }
  };
}
```

### Protected Routes
```typescript
import { useAuth } from '@/hooks/useAuth';
import { Navigate } from 'react-router-dom';

function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) return <div>Loading...</div>;
  if (!isAuthenticated) return <Navigate to="/admin/login" />;
  
  return children;
}
```

---

## 📝 Usage Examples

### Fetch Articles
```typescript
import { useArticles } from '@/hooks/useArticles';

function ArticlesList() {
  const { articles, loading, error } = useArticles({ limit: 10 });

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      {articles.map(article => (
        <div key={article.id}>{article.title}</div>
      ))}
    </div>
  );
}
```

### Create Article
```typescript
import { articlesApi } from '@/lib/api/articles';

async function createArticle() {
  const response = await articlesApi.create({
    title: 'New Article',
    content: 'Article content...',
    authorId: 'author-id',
    status: 'published'
  });
  
  if (response.success) {
    console.log('Article created:', response.data);
  }
}
```

### Upload Image
```typescript
import { uploadsApi } from '@/lib/api/uploads';

async function uploadImage(file: File) {
  const response = await uploadsApi.uploadImage(file);
  
  if (response.success) {
    const imageUrl = response.data.url;
    console.log('Image uploaded:', imageUrl);
  }
}
```

---

## 🔧 Backend Response Format

All API responses follow this structure:

### Success Response
```json
{
  "success": true,
  "data": { /* your data */ }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error description"
}
```

### Paginated Response
```json
{
  "success": true,
  "data": [ /* items */ ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 10,
    "totalItems": 100
  }
}
```

---

## 🐛 Troubleshooting

### CORS Errors
If you see CORS errors:
1. Make sure backend is running on `http://localhost:5000`
2. Check that `withCredentials: true` is set in API client
3. Verify backend CORS configuration includes your frontend URL

### 401 Unauthorized
1. Check if token is stored: `localStorage.getItem('token')`
2. Verify token is being sent in Authorization header
3. Try logging in again

### 404 Not Found
1. Verify endpoint URL includes `/api/` prefix
2. Check if using correct admin endpoint (`/api/admin/*`)
3. Confirm backend route exists

### Connection Refused
1. Make sure backend is running: `npm run dev`
2. Check backend is on correct port (5000)
3. Verify `VITE_API_URL` in `.env`

---

## 📚 API Endpoints Reference

### Public Endpoints
- `GET /api/articles` - Get all articles
- `GET /api/articles/:slug` - Get article by slug
- `GET /api/categories` - Get all categories
- `GET /api/settings` - Get site settings
- `GET /api/breaking-news/active` - Get active breaking news
- `POST /api/auth/login` - Login

### Admin Endpoints (Require Authentication)
- `POST /api/admin/articles` - Create article
- `PUT /api/admin/articles/:id` - Update article
- `DELETE /api/admin/articles/:id` - Delete article
- `POST /api/admin/images/upload` - Upload image
- `POST /api/admin/categories` - Create category
- `PUT /api/admin/settings` - Update settings

---

## ✅ Next Steps

1. Test login functionality
2. Test article creation/editing
3. Test image uploads
4. Verify all admin features work
5. Update production environment variables when deploying

---

## 🎯 Key Features Enabled

- ✅ JWT authentication with automatic token management
- ✅ Cookie-based sessions with credentials
- ✅ Proper error handling and logging
- ✅ Admin-only endpoints protection
- ✅ File upload support
- ✅ React hooks for common operations
- ✅ TypeScript type safety throughout

Everything is ready to use! 🎉
