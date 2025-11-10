# Test Twitter Embeds - Quick Guide

## 🚀 Ready to Test!

Twitter embeds now use **iframe method** - much more reliable!

## ⚡ Quick Test (2 minutes)

### Step 1: Get a Test Tweet
Use this example tweet URL:
```
https://twitter.com/Twitter/status/1445078208190291973
```

Or find any public tweet and copy its URL.

### Step 2: Add to Article
1. Go to **Admin Panel**
2. Click **"Create Article"** (or edit existing)
3. Fill in basic info (title, excerpt, etc.)
4. Scroll to **"Social Media Embeds"** section
5. Click **"Add Embed"**
6. Select **"Twitter / X"** from dropdown
7. Paste the tweet URL
8. Click **"Save Draft"**

### Step 3: View Result
1. Click **"Preview"** or save and view article
2. Scroll to bottom of article
3. You should see the tweet embedded with:
   - Full tweet text
   - Author name and avatar
   - Timestamp
   - Any images/videos
   - Engagement buttons

## ✅ What You Should See

```
┌─────────────────────────────────┐
│  @username                      │
│  Tweet text goes here...        │
│  [Image if present]             │
│  12:34 PM · Jan 1, 2024         │
└─────────────────────────────────┘
```

## 🎯 Test Different Tweet Types

### Test 1: Text-only Tweet
```
https://twitter.com/[any-user]/status/[tweet-id]
```
Should show: Clean text card

### Test 2: Tweet with Image
Find a tweet with a photo
Should show: Tweet + embedded image

### Test 3: Tweet with Video
Find a tweet with a video
Should show: Tweet + playable video

## 🔍 Troubleshooting

### "Invalid Twitter URL" Error?
✅ **Fix:** Make sure URL has this format:
```
https://twitter.com/username/status/1234567890
                              ↑
                    Must have /status/
```

### Embed Not Showing?
✅ **Try:**
1. Wait 2-3 seconds for iframe to load
2. Refresh the page
3. Check if tweet is public (open URL in browser)
4. Try a different tweet

### Still Having Issues?
✅ **Alternative Method:**
1. Go to tweet on Twitter.com
2. Click "..." menu on tweet
3. Select "Embed Tweet"
4. Copy the embed code
5. In Embed Manager, paste code in "Custom Embed Code" field

## 📊 Platform Status

| Platform | Status | Method |
|----------|--------|--------|
| Instagram | ✅ Working | Widget Script |
| Facebook | ✅ Working | SDK |
| Twitter | ✅ **FIXED** | **iframe** |
| YouTube | ✅ Working | iframe |
| TikTok | ✅ Working | Widget Script |

## 💡 Pro Tips

1. **Always use full URL** - Copy from browser address bar
2. **Test in preview** - Before publishing
3. **Public tweets only** - Private accounts won't embed
4. **Add captions** - Help readers understand context
5. **Mix platforms** - Use variety of social media

## 🎉 Success!

If you see the tweet embedded properly, you're all set! 

Twitter embeds now work reliably using iframe method.

## 📝 Example Article Structure

```
Article Title
─────────────
Featured Image
─────────────
Article content here...

More content...

[Twitter Embed appears here]
Caption: "Official announcement from..."

[Instagram Embed]
Caption: "Behind the scenes..."

Related Articles
```

## 🔗 Need More Help?

Check these guides:
- `TWITTER-EMBED-FIX-FINAL.md` - Detailed Twitter guide
- `EMBED-MANAGER-QUICK-GUIDE.md` - All platforms guide
- `HOMEPAGE-ORDERING-AND-EMBEDS-FIX.md` - Technical details

## ✨ Remember

The iframe method is **more reliable** than the old widget script method. It loads instantly and works across all browsers!
