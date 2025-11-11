# 📅 Scheduled Articles - Current Status

## ⚠️ Current State: Partially Functional

### ✅ What Works (Frontend UI)

**1. Article Creation with Schedule**
- Location: `/admin/article/new` or `/admin/article/edit/:id`
- Status dropdown has "Schedule for Later" option
- Date/time picker appears when "scheduled" is selected
- Validation ensures date/time is provided
- Data is sent to backend with `scheduledAt` field

**2. Schedule Manager Page**
- Location: `/admin/schedule`
- Beautiful UI with calendar view
- Shows scheduled items
- Edit/delete functionality
- Status indicators (Scheduled, Due Soon, Published)
- **BUT: Uses mock data, not real articles**

### ❌ What Doesn't Work (Backend Required)

**1. Automatic Publishing**
- Articles with `status: 'scheduled'` are saved
- BUT: No automatic job to publish them at scheduled time
- **Needs:** Backend cron job or scheduler

**2. Schedule Manager Integration**
- Schedule Manager shows mock data
- NOT connected to real articles API
- **Needs:** Fetch scheduled articles from backend

**3. Status Updates**
- Scheduled articles don't automatically change to "published"
- **Needs:** Backend scheduler to update status

## 🔧 How It Currently Works

### Creating Scheduled Article:

```typescript
// User fills form in AdminPage
{
  title: "Weekly Weather Update",
  content: "...",
  status: "scheduled",  // ✅ This is set
  scheduledAt: "2024-11-15T08:00:00Z",  // ✅ This is set
  authorId: "...",
  categoryId: "..."
}

// Frontend sends to backend
POST /api/admin/articles
// Article is saved with status="scheduled"

// ❌ BUT: Nothing automatically publishes it later
```

### What Should Happen:

```typescript
// Backend should have a cron job:
// Every minute (or every 5 minutes):
1. Find articles where status="scheduled" AND scheduledAt <= NOW()
2. Update status to "published"
3. Set publishedAt to NOW()
4. Article becomes visible on frontend
```

## 🎯 What's Needed for Full Functionality

### Backend Requirements:

**1. Cron Job / Scheduler**

```javascript
// Using node-cron
const cron = require('node-cron');

// Run every minute
cron.schedule('* * * * *', async () => {
  try {
    const now = new Date();
    
    // Find scheduled articles that should be published
    const articlesToPublish = await db.query(`
      SELECT id FROM articles 
      WHERE status = 'scheduled' 
      AND scheduled_at <= ?
    `, [now]);
    
    // Update each article
    for (const article of articlesToPublish) {
      await db.query(`
        UPDATE articles 
        SET status = 'published', 
            published_at = ? 
        WHERE id = ?
      `, [now, article.id]);
      
      console.log(`✅ Published scheduled article: ${article.id}`);
    }
  } catch (error) {
    console.error('❌ Error publishing scheduled articles:', error);
  }
});
```

**2. API Endpoint for Scheduled Articles**

```javascript
// GET /api/admin/articles/scheduled
router.get('/admin/articles/scheduled', authenticate, async (req, res) => {
  try {
    const scheduledArticles = await db.query(`
      SELECT a.*, au.name as author_name, c.name as category_name
      FROM articles a
      LEFT JOIN authors au ON a.author_id = au.id
      LEFT JOIN categories c ON a.category_id = c.id
      WHERE a.status = 'scheduled'
      ORDER BY a.scheduled_at ASC
    `);
    
    res.json({
      success: true,
      data: scheduledArticles
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});
```

**3. Database Index**

```sql
-- Add index for faster queries
CREATE INDEX idx_articles_scheduled 
ON articles(status, scheduled_at) 
WHERE status = 'scheduled';
```

### Frontend Updates Needed:

**1. Connect Schedule Manager to Real API**

```typescript
// In ScheduleManager.tsx
const { data: scheduledArticles } = useQuery({
  queryKey: ['articles', 'scheduled'],
  queryFn: () => articlesApi.getAll({ status: 'scheduled' }),
  refetchInterval: 60000, // Refresh every minute
});
```

**2. Add API Method**

```typescript
// In src/lib/api/articles.ts
export const articlesApi = {
  // ... existing methods
  
  getScheduled: async () => {
    return apiClient.get('/admin/articles/scheduled') as Promise<ApiResponse<Article[]>>;
  },
};
```

## 📋 Implementation Checklist

### Backend (Required for Auto-Publishing):
- [ ] Install node-cron: `npm install node-cron`
- [ ] Create scheduler service
- [ ] Add cron job to check scheduled articles
- [ ] Add API endpoint for scheduled articles
- [ ] Add database index
- [ ] Test with sample scheduled article
- [ ] Deploy to production

### Frontend (Optional Enhancement):
- [ ] Update Schedule Manager to use real API
- [ ] Add refresh interval
- [ ] Show real article data
- [ ] Add link to edit article
- [ ] Add countdown timer

## 🎯 Quick Test

### Test if Scheduling Works:

**1. Create Scheduled Article:**
```
1. Go to /admin/article/new
2. Fill in title, content, etc.
3. Select "Schedule for Later"
4. Pick a date 2 minutes from now
5. Save article
```

**2. Check Database:**
```sql
SELECT id, title, status, scheduled_at 
FROM articles 
WHERE status = 'scheduled';
```

**3. Wait for Scheduled Time:**
```
- If backend has cron job: Article auto-publishes ✅
- If backend doesn't have cron job: Nothing happens ❌
```

**4. Manual Check:**
```sql
-- After scheduled time passes, check if status changed
SELECT id, title, status, published_at 
FROM articles 
WHERE id = 'your-article-id';

-- If status is still 'scheduled': Backend scheduler not working
-- If status is 'published': Backend scheduler working! ✅
```

## 💡 Workaround (Manual Publishing)

Until backend scheduler is implemented:

**Option 1: Manual Status Update**
```sql
-- Manually publish scheduled articles
UPDATE articles 
SET status = 'published', 
    published_at = NOW() 
WHERE status = 'scheduled' 
AND scheduled_at <= NOW();
```

**Option 2: Admin Dashboard Button**
Add a "Publish Scheduled" button in admin that calls:
```typescript
const publishScheduled = async () => {
  await articlesApi.publishScheduled();
  // Backend runs the query above
};
```

## 🎉 Summary

### Current Status:

| Feature | Status | Notes |
|---------|--------|-------|
| Schedule UI | ✅ Working | Date/time picker in article form |
| Save Scheduled | ✅ Working | Articles saved with scheduledAt |
| Schedule Manager | ⚠️ Partial | UI exists but uses mock data |
| Auto-Publishing | ❌ Not Working | Needs backend cron job |
| Status Updates | ❌ Not Working | Needs backend scheduler |

### To Make It Fully Functional:

**Backend (Critical):**
1. Add cron job to check scheduled articles every minute
2. Update status from 'scheduled' to 'published' when time arrives
3. Add API endpoint to fetch scheduled articles

**Frontend (Optional):**
1. Connect Schedule Manager to real API
2. Show real scheduled articles
3. Add auto-refresh

### Bottom Line:

✅ **Frontend is ready** - You can create scheduled articles
❌ **Backend scheduler missing** - Articles won't auto-publish
🔧 **Fix:** Add cron job to backend (code provided above)

Once the backend cron job is added, scheduled articles will automatically go live at the specified time! 🚀
