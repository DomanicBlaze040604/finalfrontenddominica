# API Quick Reference

## 🔗 Base URL
```
Development: http://localhost:5000
Production: https://your-backend.com
```

## 🔐 Authentication

### Login
```typescript
import { authService } from '@/lib/api/auth';

await authService.login({ 
  email: 'admin@example.com', 
  password: 'password' 
});
```

### Check Auth Status
```typescript
const isLoggedIn = authService.isAuthenticated();
const isAdmin = authService.isAdmin();
const user = authService.getUser();
```

### Logout
```typescript
await authService.logout();
```

---

## 📰 Articles

### Get All Articles
```typescript
import { articlesApi } from '@/lib/api/articles';

const response = await articlesApi.getAll({ 
  limit: 10, 
  page: 1 
});
```

### Get Single Article
```typescript
const response = await articlesApi.getBySlug('article-slug');
// or
const response = await articlesApi.getById('article-id');
```

### Create Article (Admin)
```typescript
const response = await articlesApi.create({
  title: 'Article Title',
  content: 'Article content...',
  authorId: 'author-id',
  categoryId: 'category-id',
  status: 'published'
});
```

### Update Article (Admin)
```typescript
const response = await articlesApi.update('article-id', {
  title: 'Updated Title'
});
```

### Delete Article (Admin)
```typescript
await articlesApi.delete('article-id');
```

---

## 📁 Categories

### Get All Categories
```typescript
import { categoriesApi } from '@/lib/api/categories';

const response = await categoriesApi.getAll();
```

### Create Category (Admin)
```typescript
const response = await categoriesApi.create({
  name: 'Politics',
  slug: 'politics',
  description: 'Political news',
  color: '#FF0000'
});
```

---

## 🏷️ Tags

### Get All Tags
```typescript
import { tagsApi } from '@/lib/api/tags';

const response = await tagsApi.getAll();
```

### Create Tag (Admin)
```typescript
const response = await tagsApi.create({
  name: 'Breaking',
  color: '#FF0000'
});
```

---

## 📸 Image Upload

### Upload Image (Admin)
```typescript
import { uploadsApi } from '@/lib/api/uploads';

const file = /* File object */;
const response = await uploadsApi.uploadImage(file);
const imageUrl = response.data.url;
```

---

## 📄 Static Pages

### Get All Pages
```typescript
import { pagesApi } from '@/lib/api/pages';

const response = await pagesApi.getAll();
```

### Get Page by Slug
```typescript
const response = await pagesApi.getBySlug('about');
```

### Create Page (Admin)
```typescript
const response = await pagesApi.create({
  title: 'About Us',
  content: 'Page content...',
  isPublished: true
});
```

---

## 🚨 Breaking News

### Get Active Breaking News
```typescript
import { breakingNewsApi } from '@/lib/api/breakingNews';

const response = await breakingNewsApi.getActive();
```

### Create Breaking News (Admin)
```typescript
const response = await breakingNewsApi.create({
  title: 'Breaking: Major Event',
  link: '/article/major-event',
  isActive: true,
  priority: 'high'
});
```

---

## ⚙️ Settings

### Get Settings
```typescript
import { settingsApi } from '@/lib/api/settings';

const response = await settingsApi.get();
```

### Update Settings (Admin)
```typescript
const response = await settingsApi.update({
  siteName: 'Dominica News',
  contactEmail: 'contact@example.com'
});
```

---

## 🎣 React Hooks

### useAuth Hook
```typescript
import { useAuth } from '@/hooks/useAuth';

function Component() {
  const { user, loading, login, logout, isAuthenticated, isAdmin } = useAuth();
  
  if (loading) return <div>Loading...</div>;
  if (!isAuthenticated) return <div>Please login</div>;
  
  return <div>Welcome {user?.name}</div>;
}
```

### useArticles Hook
```typescript
import { useArticles } from '@/hooks/useArticles';

function Component() {
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

---

## 📊 Response Format

### Success
```json
{
  "success": true,
  "data": { /* your data */ }
}
```

### Error
```json
{
  "success": false,
  "message": "Error description"
}
```

### Paginated
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

## 🔑 Common Headers

All requests automatically include:
```
Content-Type: application/json
Authorization: Bearer <token>  // if logged in
```

For file uploads:
```
Content-Type: multipart/form-data
Authorization: Bearer <token>
```

---

## 🚀 Quick Start

1. Start backend: `npm run dev` (in backend folder)
2. Update `.env`: `VITE_API_URL=http://localhost:5000`
3. Start frontend: `npm run dev`
4. Login at `/admin/login`
5. Start building! 🎉
