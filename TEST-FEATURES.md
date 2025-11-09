# Testing Guide for New Features

## ✅ Features Implemented

### 1. Article Editing by ID
- **Location**: `src/lib/api/articles.ts`
- **Change**: Updated `getById` to use `/api/articles/id/${id}` endpoint
- **Test**: Edit an existing article from the admin panel

### 2. Excerpt Field
- **Location**: `src/pages/AdminPage.tsx`
- **Features**:
  - Required field with 300 character limit
  - Character counter
  - Displays in article listings
- **Test**: Create/edit article and add excerpt

### 3. Schedule Publishing
- **Location**: `src/pages/AdminPage.tsx`
- **Features**:
  - Radio button options: Draft, Publish Now, Schedule for Later
  - Date/time picker for scheduled articles
  - Shows scheduled date in article list
  - Backend auto-publishes at scheduled time
- **Test**: Schedule an article for 5 minutes from now

### 4. Universal Embed System
- **Components**:
  - `src/components/UniversalEmbed.tsx` - Display component
  - `src/components/admin/EmbedManager.tsx` - Admin management
- **Supported Platforms**:
  - Instagram
  - Twitter/X
  - YouTube
  - Facebook
  - TikTok
  - Vimeo
  - Spotify
  - SoundCloud
  - CodePen
  - Google Maps
  - Custom (any iframe/embed code)
- **Features**:
  - URL or custom embed code
  - Optional caption
  - Custom width/height
  - Drag to reorder
- **Test**: Add Instagram, YouTube, and Spotify embeds to an article

### 5. Enhanced Publishing Options
- **Location**: `src/pages/AdminPage.tsx`
- **Features**:
  - Pin Article
  - Featured Story
  - Breaking News
- **Test**: Toggle these options and verify badges appear

## 🧪 Testing Checklist

### Basic Article Creation
- [ ] Create new article with all required fields
- [ ] Excerpt shows character count (0/300)
- [ ] Slug auto-generates from title
- [ ] Category selection works
- [ ] Author selection works
- [ ] Cover image upload works

### Excerpt Feature
- [ ] Excerpt field is required
- [ ] Character counter updates as you type
- [ ] Cannot exceed 300 characters
- [ ] Excerpt displays in article list
- [ ] Excerpt displays in article cards

### Scheduling Feature
- [ ] Can select "Schedule for Later" option
- [ ] Date/time picker appears when scheduled
- [ ] Cannot select past dates
- [ ] Scheduled badge shows in article list
- [ ] Scheduled date displays in article list
- [ ] Article auto-publishes at scheduled time (wait for cron)

### Embed System
- [ ] Can add multiple embeds
- [ ] Can select platform type (Instagram, YouTube, etc.)
- [ ] Can enter URL
- [ ] Can paste custom embed code
- [ ] Can add caption
- [ ] Can set custom width/height
- [ ] Can reorder embeds (up/down buttons)
- [ ] Can remove embeds
- [ ] Embeds display correctly in published article
- [ ] Instagram embed loads properly
- [ ] YouTube video plays
- [ ] Spotify player works

### Article Editing
- [ ] Can click edit button on existing article
- [ ] Article loads by ID (not slug)
- [ ] All fields populate correctly
- [ ] Excerpt field shows existing excerpt
- [ ] Scheduled date shows if article is scheduled
- [ ] Embeds load in embed manager
- [ ] Can update and save changes
- [ ] Changes reflect immediately

### Publishing Options
- [ ] Pin toggle works
- [ ] Featured toggle works
- [ ] Breaking toggle works
- [ ] Badges display correctly in article list
- [ ] Status badges show correct colors

### Article Display
- [ ] Excerpt shows in article cards
- [ ] Embeds display in article view
- [ ] Embed captions show below embeds
- [ ] Scheduled articles don't show publicly until published
- [ ] Breaking news badge shows on article

## 🔍 API Endpoints Used

```
GET    /api/articles/id/:id       - Get article by ID for editing
POST   /api/articles              - Create new article
PUT    /api/articles/:id          - Update article
DELETE /api/articles/:id          - Delete article
GET    /api/articles/:slug        - Get article by slug (public view)
```

## 📝 Sample Article Data

```json
{
  "title": "Test Article with All Features",
  "excerpt": "This is a test article demonstrating all new features including embeds and scheduling.",
  "content": "<p>Article content here...</p>",
  "featuredImage": "https://example.com/image.jpg",
  "featuredImageAlt": "Test image",
  "authorId": "author-id-here",
  "categoryId": "category-id-here",
  "status": "scheduled",
  "scheduledAt": "2024-12-01T15:00:00.000Z",
  "isPinned": false,
  "isFeatured": true,
  "isBreaking": false,
  "embeds": [
    {
      "type": "instagram",
      "url": "https://www.instagram.com/p/ABC123/",
      "caption": "Check out this Instagram post!"
    },
    {
      "type": "youtube",
      "url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      "width": "100%",
      "height": "400px"
    },
    {
      "type": "spotify",
      "url": "https://open.spotify.com/track/ABC123",
      "caption": "Listen to this track"
    }
  ]
}
```

## 🐛 Known Issues / Notes

1. **Scheduled Publishing**: Backend cron runs every minute. Articles will publish within 1 minute of scheduled time.
2. **Embed Scripts**: Instagram, Twitter, and TikTok embeds require external scripts to load. First load may be slower.
3. **Image Upload**: If upload fails, base64 preview is used as fallback.
4. **Category**: Currently only supports one category per article (uses first selected).

## 🚀 Next Steps

After testing, you can:
1. Deploy frontend changes
2. Test in production environment
3. Monitor scheduled publishing
4. Add more embed platform support if needed
5. Enhance embed preview in admin panel
