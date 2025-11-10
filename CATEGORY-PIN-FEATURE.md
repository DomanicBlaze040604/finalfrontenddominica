# Category Pin/Unpin Feature

## Overview
Added the ability to pin/unpin categories in the admin panel. Pinned categories appear in the header navigation, unpinned ones don't.

## Changes Made

### 1. Updated Category Type
**File:** `src/lib/api/types.ts`

Added `isPinned` field:
```typescript
export interface Category {
  // ... existing fields
  isPinned?: boolean;  // ✅ NEW
  // ... rest
}
```

### 2. Updated Categories Manager
**File:** `src/pages/admin/CategoriesManager.tsx`

**Added:**
- Pin/PinOff icons import
- `togglePinMutation` to handle pin/unpin
- Pin/Unpin button in category card

**Features:**
- Click pin button to pin/unpin category
- Pinned categories show filled pin icon
- Unpinned categories show outline pin icon
- Toast notifications on pin/unpin

### 3. Updated Header
**File:** `src/components/Header.tsx`

**Changed:**
- Filters categories to show only pinned ones
- `pinnedCategories = categories.filter(cat => cat.isPinned)`

## How to Use

### In Admin Panel

1. **Go to Categories Manager**
   - Navigate to Admin → Categories

2. **Pin a Category**
   - Hover over a category card
   - Click the Pin button (📌)
   - Category is now pinned
   - Button turns solid/filled

3. **Unpin a Category**
   - Hover over a pinned category
   - Click the Pin button again
   - Category is unpinned
   - Button returns to outline

### Result

**Pinned categories:**
- ✅ Appear in header navigation
- ✅ Visible to all users
- ✅ Show in navigation bar

**Unpinned categories:**
- ❌ Don't appear in header
- ✅ Still accessible via direct URL
- ✅ Still work for articles

## Visual Indicators

### In Categories Manager

**Pinned Category:**
```
┌─────────────────────────────────┐
│ [Icon] Category Name            │
│ Description                     │
│ /slug  #color  X articles       │
│                    [📌] [📄] [✏️] [🗑️] │
└─────────────────────────────────┘
```

**Unpinned Category:**
```
┌─────────────────────────────────┐
│ [Icon] Category Name            │
│ Description                     │
│ /slug  #color  X articles       │
│                    [📍] [📄] [✏️] [🗑️] │
└─────────────────────────────────┘
```

## Use Cases

### 1. Featured Categories
Pin important categories:
- News
- Breaking News
- Local News

### 2. Seasonal Categories
Pin/unpin based on season:
- Pin "Hurricane Season" during hurricane season
- Unpin when season ends

### 3. Navigation Management
Control header navigation:
- Pin most popular categories
- Keep header clean and focused
- Unpin less important categories

## Example Workflow

### Initial Setup
1. Create categories: News, Sports, Weather, Entertainment, Business, Politics
2. Pin only: News, Sports, Weather
3. Header shows: Home | News | Sports | Weather

### Later Updates
1. Unpin Sports
2. Pin Politics
3. Header now shows: Home | News | Weather | Politics

## Backend Requirements

The backend needs to:
1. **Store `isPinned` field** in category model
2. **Accept `isPinned` in update endpoint**
3. **Return `isPinned` in category responses**

### Backend Model (Example)
```javascript
const categorySchema = new Schema({
  name: String,
  slug: String,
  description: String,
  color: String,
  icon: String,
  isPinned: { type: Boolean, default: false },  // ✅ Add this
  // ... other fields
});
```

### Backend Update Endpoint
```javascript
router.put('/api/categories/:id', async (req, res) => {
  const { isPinned, ...otherFields } = req.body;
  
  const category = await Category.findByIdAndUpdate(
    req.params.id,
    { isPinned, ...otherFields },  // ✅ Include isPinned
    { new: true }
  );
  
  res.json({ success: true, data: category });
});
```

## Benefits

✅ **Control navigation** - Choose which categories appear in header
✅ **Clean header** - Don't clutter with all categories
✅ **Flexible** - Easy to pin/unpin as needed
✅ **User-friendly** - Simple one-click toggle
✅ **Visual feedback** - Clear indication of pinned status

## Notes

- All categories still work (pinned or not)
- Unpinned categories accessible via direct URL
- Articles in unpinned categories still visible
- Only affects header navigation display

## Testing

1. **Create categories** in admin panel
2. **Pin some categories** using pin button
3. **Check header** - should show only pinned
4. **Unpin a category** - should disappear from header
5. **Visit unpinned category URL** - should still work

## Summary

The pin/unpin feature gives you complete control over which categories appear in the header navigation. Pin important categories, unpin less important ones, and keep your header clean and focused!
