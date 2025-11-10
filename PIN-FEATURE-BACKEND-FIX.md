# Pin Feature Backend Fix - 400 Error

## Error
"Failed to update category" with status code 400

## Cause
The backend is rejecting the `isPinned` field. This could be because:
1. The field isn't in the backend model
2. The field isn't allowed in the update validation
3. The field type is wrong

## Backend Fixes Needed

### 1. Update Category Model/Schema

**MongoDB/Mongoose:**
```javascript
const categorySchema = new Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  description: String,
  color: String,
  icon: String,
  displayOrder: Number,
  isPinned: { type: Boolean, default: false },  // ✅ ADD THIS
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});
```

**SQL/Prisma:**
```prisma
model Category {
  id          String   @id @default(cuid())
  name        String
  slug        String   @unique
  description String?
  color       String?
  icon        String?
  displayOrder Int?
  isPinned    Boolean  @default(false)  // ✅ ADD THIS
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

### 2. Update Validation Schema

If you're using validation (Joi, Yup, Zod), add `isPinned`:

**Joi:**
```javascript
const categoryUpdateSchema = Joi.object({
  name: Joi.string(),
  slug: Joi.string(),
  description: Joi.string().allow(''),
  color: Joi.string(),
  icon: Joi.string(),
  displayOrder: Joi.number(),
  isPinned: Joi.boolean(),  // ✅ ADD THIS
});
```

**Zod:**
```typescript
const categoryUpdateSchema = z.object({
  name: z.string().optional(),
  slug: z.string().optional(),
  description: z.string().optional(),
  color: z.string().optional(),
  icon: z.string().optional(),
  displayOrder: z.number().optional(),
  isPinned: z.boolean().optional(),  // ✅ ADD THIS
});
```

### 3. Update Controller/Route

Make sure the update endpoint accepts `isPinned`:

```javascript
router.put('/api/admin/categories/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { 
      name, 
      slug, 
      description, 
      color, 
      icon, 
      displayOrder,
      isPinned  // ✅ ADD THIS
    } = req.body;
    
    const category = await Category.findByIdAndUpdate(
      id,
      { 
        name, 
        slug, 
        description, 
        color, 
        icon, 
        displayOrder,
        isPinned,  // ✅ ADD THIS
        updatedAt: new Date()
      },
      { new: true, runValidators: true }
    );
    
    if (!category) {
      return res.status(404).json({ 
        success: false, 
        message: 'Category not found' 
      });
    }
    
    res.json({ success: true, data: category });
  } catch (error) {
    console.error('Category update error:', error);
    res.status(400).json({ 
      success: false, 
      message: error.message 
    });
  }
});
```

### 4. Database Migration (if needed)

If you already have categories in the database, add the field:

**MongoDB:**
```javascript
// Run this in MongoDB shell or migration script
db.categories.updateMany(
  { isPinned: { $exists: false } },
  { $set: { isPinned: false } }
);
```

**SQL:**
```sql
-- Add column if it doesn't exist
ALTER TABLE categories 
ADD COLUMN is_pinned BOOLEAN DEFAULT FALSE;

-- Update existing rows
UPDATE categories 
SET is_pinned = FALSE 
WHERE is_pinned IS NULL;
```

## Testing the Fix

### 1. Check Backend Logs
Look for the actual error message in your backend console.

### 2. Test with curl
```bash
curl -X PUT http://localhost:3000/api/admin/categories/CATEGORY_ID \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"isPinned": true}'
```

### 3. Check Response
Should return:
```json
{
  "success": true,
  "data": {
    "id": "...",
    "name": "Politics",
    "isPinned": true,
    ...
  }
}
```

## Common Issues

### Issue 1: Field Not in Model
**Error:** "isPinned is not a valid field"
**Fix:** Add `isPinned` to your model/schema

### Issue 2: Validation Fails
**Error:** "Validation failed"
**Fix:** Add `isPinned` to validation schema

### Issue 3: Field Not Allowed
**Error:** "Field not allowed"
**Fix:** Add `isPinned` to allowed fields in controller

### Issue 4: Type Mismatch
**Error:** "Expected boolean, got string"
**Fix:** Ensure frontend sends boolean, not string

## Debugging Steps

### 1. Check Backend Console
Look for the actual error message when you click pin/unpin.

### 2. Check Request Payload
In browser DevTools → Network tab:
- Find the PUT request to `/api/admin/categories/:id`
- Check Request Payload
- Should see: `{"isPinned": true}` or `{"isPinned": false}`

### 3. Check Response
- Status should be 200, not 400
- Response should include updated category with `isPinned` field

### 4. Verify Database
After successful update, check database:
```javascript
// MongoDB
db.categories.findOne({ _id: ObjectId("CATEGORY_ID") })

// Should show: isPinned: true
```

## Quick Fix Checklist

- [ ] Added `isPinned` field to model/schema
- [ ] Added `isPinned` to validation schema (if using)
- [ ] Updated controller to accept `isPinned`
- [ ] Ran database migration (if needed)
- [ ] Restarted backend server
- [ ] Tested pin/unpin in admin panel
- [ ] Verified in database
- [ ] Checked header shows/hides category

## Alternative: Temporary Workaround

If you can't update the backend immediately, you can use a different field:

**Option 1: Use existing field**
```typescript
// In CategoriesManager.tsx
// Use displayOrder to indicate pinned (e.g., displayOrder < 100 = pinned)
categoriesApi.update(id, { displayOrder: isPinned ? 1 : 999 })
```

**Option 2: Use description**
```typescript
// Store pin status in description (not recommended)
categoriesApi.update(id, { 
  description: isPinned ? '[PINNED]' + description : description.replace('[PINNED]', '')
})
```

## Summary

The 400 error means the backend doesn't accept the `isPinned` field. Follow the steps above to:
1. Add field to model
2. Add to validation
3. Update controller
4. Migrate database
5. Test

Once done, the pin/unpin feature will work perfectly!
