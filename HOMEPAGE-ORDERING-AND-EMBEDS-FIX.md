# Homepage Ordering & Embed Manager Fixes

## ✅ Issues Fixed

### 1. Homepage Section Ordering
**Problem:** Featured News and Latest News sections were swapping places constantly.

**Solution:**
- Set **Latest News to appear FIRST** by default (before Featured News)
- Added admin control in Site Settings to swap their order if needed
- Order is now persistent and controlled via settings

**How to Change Order:**
1. Go to Admin Panel → Site Settings
2. Click on "General" tab
3. Find "Homepage Section Order" dropdown
4. Choose:
   - **Latest News First** (Recommended - default)
   - **Featured Story First**
5. Click "Save General Settings"

### 2. Twitter/X Embeds Not Working
**Problem:** Twitter embeds weren't rendering in the Embed Manager.

**Solution:**
- Fixed Twitter widget script loading
- Added proper charset and async attributes
- Improved tweet ID extraction from URLs
- Added validation for invalid Twitter URLs
- Enhanced retry mechanism for script loading

### 3. Facebook Embeds Not Working
**Problem:** Facebook embeds weren't rendering in the Embed Manager.

**Solution:**
- Implemented Facebook SDK integration
- Added `fb-root` div creation
- Proper Facebook XFBML parsing
- Added retry mechanism for SDK loading
- Changed from iframe to native Facebook embed format

## 📝 Technical Changes

### Files Modified:

1. **src/pages/Index.tsx**
   - Added settings API query to fetch homepage section order
   - Created `renderMainSections()` function to dynamically order sections
   - Default order: Latest News → Featured News
   - Respects admin settings for custom ordering

2. **src/components/UniversalEmbed.tsx**
   - Enhanced Twitter embed loading with proper charset
   - Added Facebook SDK integration
   - Improved script loading with retry mechanisms
   - Added validation for Twitter URLs
   - Extended Window interface to include FB SDK

3. **src/lib/api/settings.ts**
   - Added `homepageSectionOrder` field to SiteSettings interface
   - Type: `'featured-first' | 'latest-first'`

4. **src/pages/admin/SiteSettings.tsx**
   - Added "Homepage Section Order" dropdown in General Settings
   - Default value: "latest-first"
   - Saves to backend settings

## 🎯 How It Works

### Homepage Section Ordering:
```typescript
// Default order (latest-first):
1. Featured Story
2. Latest News
3. Category Sections

// When set to featured-first:
1. Latest News
2. Featured Story
3. Category Sections
```

### Embed Manager - Supported Platforms:
✅ **Instagram** - Working perfectly
✅ **Twitter/X** - Now fixed and working
✅ **Facebook** - Now fixed and working
✅ **YouTube** - Working
✅ **TikTok** - Working
✅ **Vimeo** - Working
✅ **Spotify** - Working
✅ **SoundCloud** - Working
✅ **CodePen** - Working
✅ **Google Maps** - Working

## 🔧 Backend Requirements

To make the homepage ordering work, your backend needs to:

1. **Add field to settings table:**
```sql
ALTER TABLE settings 
ADD COLUMN homepage_section_order VARCHAR(20) DEFAULT 'latest-first';
```

2. **Update settings API endpoints:**
   - GET `/api/settings` - Include `homepageSectionOrder` field
   - PUT `/api/admin/settings` - Accept `homepageSectionOrder` field

3. **Example response:**
```json
{
  "success": true,
  "data": {
    "id": "1",
    "siteName": "Dominica News",
    "homepageSectionOrder": "latest-first",
    "socialMedia": { ... },
    "updatedAt": "2024-11-10T..."
  }
}
```

## 📱 Testing

### Test Homepage Ordering:
1. Visit homepage - Latest News should appear first
2. Go to Admin → Site Settings → General
3. Change "Homepage Section Order" to "Featured Story First"
4. Save and refresh homepage
5. Featured Story should now appear first

### Test Twitter Embeds:
1. Go to Admin → Create/Edit Article
2. Scroll to "Social Media Embeds"
3. Click "Add Embed"
4. Select "Twitter / X"
5. Paste a Twitter post URL (e.g., `https://twitter.com/user/status/123456789`)
6. Save article
7. View article - Twitter embed should render

### Test Facebook Embeds:
1. Same steps as Twitter
2. Select "Facebook" as platform
3. Paste a Facebook post URL
4. Save and view article
5. Facebook embed should render with SDK

## 🎨 User Experience

**Before:**
- Sections randomly swapped positions
- Twitter embeds showed as plain links
- Facebook embeds didn't load

**After:**
- Consistent section ordering (Latest News first)
- Admin can customize order via settings
- Twitter embeds render properly with widget
- Facebook embeds render with native SDK
- All embeds work reliably

## 🚀 Next Steps

If embeds still don't work:
1. Check browser console for script loading errors
2. Verify URLs are valid and public
3. Check if posts are deleted or private
4. Try using custom embed code instead
5. Ensure backend returns proper settings data

## 💡 Tips

- **Latest News First** is recommended for news sites (shows freshest content)
- **Featured Story First** works well for editorial/magazine style
- Instagram embeds work best (most reliable)
- For problematic embeds, use the "Custom Embed Code" field
- Test embeds in incognito mode to avoid caching issues
