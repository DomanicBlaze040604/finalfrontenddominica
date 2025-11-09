# 🧪 Quick Category Test

## 5-Minute Test to Verify Categories Work

### Step 1: Start Dev Server
```bash
npm run dev
```

### Step 2: Login to Admin
1. Go to `http://localhost:8080/admin/login`
2. Login with credentials from `.env`

### Step 3: Create Test Article
1. Go to Articles → Create Article
2. Fill in:
   - **Title**: "Test Politics Article"
   - **Excerpt**: "This is a test article for the Politics category"
   - **Content**: "Some test content here..."
   - **Author**: Select any author
   - **Category**: Click "Politics" badge ✅
3. Set status to "Published"
4. Click "Publish Article"

### Step 4: Verify in Admin List
1. Go to Articles list
2. Find your test article
3. **Check**: Does it show "Politics" badge? ✅

### Step 5: View Category Page
1. Go to homepage
2. Click "Politics" in navigation or category section
3. **Check**: Does your test article appear? ✅

### Step 6: Verify Exclusivity
1. Go to another category (e.g., "Sports")
2. **Check**: Your test article should NOT appear ✅

### Step 7: Test Category Change
1. Edit your test article
2. Change category from "Politics" to "Sports"
3. Save changes
4. Go to Politics category page
5. **Check**: Article should NOT appear ✅
6. Go to Sports category page
7. **Check**: Article should NOW appear ✅

---

## ✅ Expected Results

If everything works correctly:

1. ✅ Article shows in selected category
2. ✅ Article does NOT show in other categories
3. ✅ Changing category moves article to new category
4. ✅ Category badge shows in admin list
5. ✅ Category badge shows on article page

---

## 🐛 If Something Doesn't Work

### Article doesn't show in category page

**Check Browser Console:**
```javascript
// Should see successful API call:
GET /api/categories/politics/articles?status=published&limit=20
Status: 200 OK
```

**Check Network Tab:**
- Look for the API request
- Check if it returns articles
- Verify response has your article

**Check Backend:**
- Is backend running?
- Check backend logs
- Verify category endpoint works

### Article shows in wrong category

**Check Admin Panel:**
- When editing article, which category is selected?
- Save and verify category ID is sent

**Check API Request:**
```javascript
// In Network tab, check PUT request:
PUT /api/articles/{id}
{
  "categoryId": "correct-category-id" // Should match selected category
}
```

---

## 📊 Quick Debug Commands

### Check if article has category
Open browser console on article page:
```javascript
// Should show category object
console.log(article.category)
// Output: { id: "...", name: "Politics", slug: "politics" }
```

### Check category page data
Open browser console on category page:
```javascript
// Should show articles array
console.log(articlesData)
// Output: { success: true, data: [...articles...] }
```

---

## ✅ Success Criteria

Test passes if:
- [x] Can create article with category
- [x] Article appears in correct category page
- [x] Article does NOT appear in other categories
- [x] Can change article category
- [x] Category badge displays correctly

---

## 🎉 Result

Based on code review, **categories are implemented correctly**!

The frontend:
- ✅ Sends `categoryId` when creating/editing articles
- ✅ Fetches articles by category slug
- ✅ Displays category throughout the app

If the test passes, you're good to go! 🚀
