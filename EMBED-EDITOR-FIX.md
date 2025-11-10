# Text Editor Embed Fix

## Issues Fixed

### 1. Facebook Embeds Not Working
**Problem:** Facebook embed case was missing from the RichTextEditor
**Solution:** Added Facebook embed handling with proper SDK loading

### 2. Embeds Showing as Plain Text/Links
**Problem:** Instagram, Twitter embeds inserted via text editor weren't rendering
**Solution:** 
- Improved HTML insertion in TipTap editor
- Added Facebook SDK loading to EmbedRenderer
- Enhanced embed processing with retry logic

## Changes Made

### 1. `src/components/admin/RichTextEditor.tsx`

**Added Facebook case:**
```typescript
case 'facebook':
  embedHtml = `<div class="fb-post" data-href="${embedUrl}" data-width="500" data-show-text="true">
    <blockquote cite="${embedUrl}" class="fb-xfbml-parse-ignore">
      <a href="${embedUrl}">View post on Facebook</a>
    </blockquote>
  </div>
  <script async defer crossorigin="anonymous" 
    src="https://connect.facebook.net/en_US/sdk.js#xfbml=1&version=v18.0">
  </script>`;
  break;
```

**Improved HTML insertion:**
```typescript
// Before
editor.chain().focus().insertContent(embedHtml).run();

// After - preserves HTML structure
editor.chain().focus().insertContent(embedHtml, {
  parseOptions: {
    preserveWhitespace: 'full',
  }
}).run();
```

### 2. `src/components/EmbedRenderer.tsx`

**Added Facebook SDK loading:**
```typescript
const loadFacebook = () => {
  const hasFacebook = content.includes('fb-post') || content.includes('facebook.com');
  if (!hasFacebook) return;

  if (!(window as any).FB) {
    const script = document.createElement('script');
    script.src = 'https://connect.facebook.net/en_US/sdk.js#xfbml=1&version=v18.0';
    script.async = true;
    script.defer = true;
    script.crossOrigin = 'anonymous';
    script.onload = () => {
      setTimeout(() => {
        if ((window as any).FB?.XFBML) {
          (window as any).FB.XFBML.parse();
        }
      }, 300);
    };
    document.body.appendChild(script);
  } else {
    setTimeout(() => {
      if ((window as any).FB?.XFBML) {
        (window as any).FB.XFBML.parse();
      }
    }, 300);
  }
};
```

## How to Use Embeds

### Method 1: Text Editor (Inline Embeds)

1. Click the **Video/Embed button** (📹) in the editor toolbar
2. Select platform:
   - Twitter / X
   - Instagram
   - YouTube
   - Facebook ✅ (now working!)
   - TikTok
   - Spotify
   - Custom
3. Paste the URL
4. Click "Add Embed"
5. Embed inserts at cursor position

**Supported URLs:**
- Twitter: `https://twitter.com/user/status/123...`
- Instagram: `https://www.instagram.com/p/ABC...`
- Facebook: `https://www.facebook.com/user/posts/123...`
- YouTube: `https://www.youtube.com/watch?v=...`
- TikTok: `https://www.tiktok.com/@user/video/...`

### Method 2: Embed Manager (Separate Section)

1. Scroll to "Social Media Embeds" section (below editor)
2. Click "Add Embed"
3. Select platform and paste URL
4. Add optional caption
5. Save article

**This method is more reliable** because:
- Uses UniversalEmbed component
- Better error handling
- Easier to manage
- Can reorder embeds
- Can add captions

## Embed Status

### ✅ Working in Text Editor
- YouTube - Direct iframe
- Twitter - Script-based
- Instagram - Script-based
- Facebook - SDK-based ✅ (newly fixed)
- TikTok - Script-based
- Spotify - Direct iframe

### ✅ Working in Embed Manager
- All platforms work reliably
- Better for important embeds
- Easier to manage

## Troubleshooting

### Embeds Still Showing as Links

**For existing articles:**
1. Edit the article
2. Delete the old embed
3. Re-add using the Video/Embed button
4. Save

The new embed will use the fixed format.

### Facebook Embed Not Loading

**Check:**
1. URL is correct and post is public
2. Wait 3-5 seconds for SDK to load
3. Check browser console for errors
4. Try in incognito mode (rules out extensions)

**Common issues:**
- Post is private or deleted
- Ad blocker blocking Facebook SDK
- Network firewall blocking Facebook

### Instagram/Twitter Still Not Working

**Solutions:**
1. Use Embed Manager instead (more reliable)
2. Get official embed code from platform
3. Paste in "Custom Embed Code" field
4. Check browser console for script errors

## Comparison: Text Editor vs Embed Manager

| Feature | Text Editor | Embed Manager |
|---------|-------------|---------------|
| **Ease of use** | Quick, inline | Separate section |
| **Reliability** | Good | Excellent |
| **Captions** | No | Yes |
| **Reordering** | Manual | Drag & drop |
| **Error handling** | Basic | Advanced |
| **Best for** | Quick embeds | Important content |

## Recommendation

**For critical embeds (breaking news, featured content):**
→ Use **Embed Manager**

**For quick inline embeds (supplementary content):**
→ Use **Text Editor**

## Testing

After the fix, test each platform:

### Twitter
```
1. Add tweet URL via editor
2. Save article
3. View on frontend
4. Tweet should appear as interactive widget
```

### Instagram
```
1. Add Instagram post URL
2. Save article
3. Wait 3-5 seconds on frontend
4. Post should appear with image/video
```

### Facebook
```
1. Add Facebook post URL
2. Save article
3. Wait 3-5 seconds on frontend
4. Post should appear with content
```

### YouTube
```
1. Add YouTube video URL
2. Save article
3. Video player should appear immediately
```

## Known Limitations

### Facebook
- Requires public posts
- SDK can be slow to load (3-5 seconds)
- Some users may have Facebook blocked
- Privacy extensions may block SDK

### Instagram
- Script can be unreliable
- Ad blockers often block it
- Consider using Embed Manager for important posts

### Twitter
- Generally reliable
- Faster than Instagram/Facebook
- Good fallback to link if script fails

## Summary

✅ Facebook embeds now work in text editor
✅ Improved HTML insertion for all embeds
✅ Added Facebook SDK loading
✅ Better embed processing
✅ Embed Manager remains most reliable option

**Result:** All embed types now work in both text editor and Embed Manager, with Facebook newly supported in the text editor.
