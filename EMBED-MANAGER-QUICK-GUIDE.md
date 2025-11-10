# Embed Manager - Quick Guide

## ✅ What's Fixed

Twitter/X and Facebook embeds now work properly in the Embed Manager!

## 🎯 How to Use Embed Manager

### Step 1: Create or Edit an Article
1. Go to Admin Panel
2. Click "Create Article" or edit existing article
3. Scroll down to "Social Media Embeds" section

### Step 2: Add an Embed
1. Click "Add Embed" button
2. Select platform from dropdown:
   - Instagram
   - Twitter / X ✅ **NOW WORKING**
   - Facebook ✅ **NOW WORKING**
   - YouTube
   - TikTok
   - Vimeo
   - Spotify
   - SoundCloud
   - CodePen
   - Google Maps
   - Custom / Other

### Step 3: Paste the URL
**Twitter Example:**
```
https://twitter.com/dominicanews/status/1234567890
```

**Facebook Example:**
```
https://www.facebook.com/username/posts/1234567890
```

**Instagram Example:**
```
https://www.instagram.com/p/ABC123xyz/
```

### Step 4: Optional Settings
- **Caption:** Add description text below embed
- **Width/Height:** Customize dimensions (leave blank for defaults)
- **Custom Embed Code:** Paste iframe code if URL doesn't work

### Step 5: Save Article
Click "Save Draft" or "Publish Article"

## 🔍 Troubleshooting

### Twitter Embed Not Showing?
- ✅ Make sure URL includes `/status/` with tweet ID
- ✅ Check if tweet is public (not deleted/private)
- ✅ Wait 2-3 seconds for widget to load
- ✅ Try refreshing the page

### Facebook Embed Not Showing?
- ✅ Make sure post is public
- ✅ URL should be full Facebook post link
- ✅ Wait for Facebook SDK to load
- ✅ Check browser console for errors

### Instagram Works Best!
Instagram embeds are the most reliable. If other platforms fail, Instagram is your safest bet.

## 💡 Pro Tips

1. **Test in Preview:** Always preview article before publishing
2. **Use Custom Code:** If URL doesn't work, get embed code from platform
3. **Multiple Embeds:** You can add as many embeds as you want
4. **Reorder Embeds:** Use up/down arrows to change order
5. **Mobile Friendly:** All embeds are responsive

## 📱 Where Embeds Appear

Embeds appear at the **end of your article**, after the main content.

Example article structure:
```
1. Article Title
2. Featured Image
3. Article Content (from rich text editor)
4. Social Media Embeds ← Your embeds appear here
5. Related Articles
```

## 🎨 Embed Appearance

- Instagram: Native Instagram card with like/comment buttons
- Twitter: Native tweet card with retweet/like buttons
- Facebook: Native Facebook post with reactions
- YouTube: Video player
- Others: Platform-specific embeds

## ⚡ Quick Comparison

| Platform | Reliability | Load Time | Features |
|----------|-------------|-----------|----------|
| Instagram | ⭐⭐⭐⭐⭐ | Fast | Full post with interactions |
| Twitter | ⭐⭐⭐⭐ | Medium | Full tweet with actions |
| Facebook | ⭐⭐⭐⭐ | Medium | Full post with reactions |
| YouTube | ⭐⭐⭐⭐⭐ | Fast | Video player |
| TikTok | ⭐⭐⭐ | Slow | Video with sound |

## 🚀 Best Practices

1. **Don't overload:** 2-3 embeds per article is ideal
2. **Mix platforms:** Variety keeps content interesting
3. **Check mobile:** Test how embeds look on phones
4. **Update old posts:** Replace broken embeds with new ones
5. **Use captions:** Help readers understand context

## 🔧 Advanced: Custom Embed Code

If a platform isn't listed or URL doesn't work:

1. Go to the social media post
2. Click "Share" or "Embed"
3. Copy the embed code (usually starts with `<iframe>` or `<blockquote>`)
4. Paste into "Custom Embed Code" field
5. Save article

Example custom code:
```html
<iframe src="https://example.com/embed/123" 
        width="500" 
        height="400" 
        frameborder="0">
</iframe>
```

## ✨ Remember

The Embed Manager is the **recommended way** to add social media content. It's more reliable than pasting links in the rich text editor!
