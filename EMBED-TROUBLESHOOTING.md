# Instagram & Twitter Embed Troubleshooting Guide

## Current Status
I've updated the embed system to be more robust. However, **existing articles with embeds need to be re-saved** to use the new format.

## Why Embeds Show as Links

Instagram and Twitter embeds work by:
1. You paste a URL in the editor
2. The editor converts it to a `<blockquote>` with special attributes
3. When the page loads, Instagram/Twitter's JavaScript finds these blockquotes
4. The JavaScript replaces them with the actual embedded post

**The problem:** The old blockquotes were missing required attributes, so the scripts couldn't process them properly.

## What I Fixed

### 1. RichTextEditor (for new embeds)
- Instagram embeds now include ALL required attributes and styling
- Twitter embeds now include proper data attributes
- Both now generate the exact HTML that Instagram/Twitter expect

### 2. EmbedRenderer (for displaying embeds)
- Strips duplicate script tags
- Loads embed scripts with proper timing
- Retries processing 3 times (at 1s, 2s, and 3s delays)
- Better error handling

### 3. UniversalEmbed (for Embed Manager)
- Enhanced Instagram blockquote with full styling
- Enhanced Twitter blockquote with data attributes
- Retry logic with cleanup

## How to Fix Existing Articles

### Method 1: Re-save the Article (Easiest)
1. Go to Admin Panel → Articles
2. Click "Edit" on the article with broken embeds
3. Scroll to the embed in the rich text editor
4. **Delete the old embed**
5. Click the Video/Embed button (📹) in the toolbar
6. Select the platform (Instagram or Twitter)
7. Paste the URL again
8. Click "Add Embed"
9. Save the article

### Method 2: Use Embed Manager (Most Reliable)
Instead of adding embeds in the rich text content:
1. Edit the article
2. Scroll down to "Social Media Embeds" section
3. Click "Add Embed"
4. Select platform and paste URL
5. Save

This method is more reliable because it uses the UniversalEmbed component which has better handling.

### Method 3: Use Official Embed Code
Get the embed code directly from the platform:

**For Instagram:**
1. Open the post on Instagram website
2. Click ••• (three dots)
3. Click "Embed"
4. Copy the embed code
5. In article editor, click Video/Embed button
6. Select "Instagram"
7. Paste in "Custom Embed Code" field

**For Twitter:**
1. Open the tweet
2. Click share icon
3. Click "Embed Tweet"
4. Copy the code
5. In article editor, click Video/Embed button
6. Select "Twitter"
7. Paste in "Custom Embed Code" field

## Testing Embeds

After saving an article with embeds:
1. View the article on frontend
2. **Wait 3-5 seconds** - embeds take time to load
3. Open browser console (F12) to check for errors
4. If you see errors about CORS or blocked scripts, it might be:
   - Ad blocker
   - Privacy extension
   - Browser security settings

## Common Issues

### "View this post on Instagram" link appears
**Cause:** Instagram's script didn't process the blockquote
**Solutions:**
- Wait longer (sometimes takes 5-10 seconds)
- Refresh the page
- Check browser console for errors
- Try in incognito mode (to rule out extensions)
- Re-save the article using Method 1 above

### Twitter embed shows as link
**Cause:** Twitter's script didn't load or process
**Solutions:**
- Same as Instagram above
- Check if you're using an ad blocker
- Try different browser

### Embed works in editor preview but not on frontend
**Cause:** Scripts might be blocked or timing issue
**Solution:** Use the Embed Manager method instead

## Browser Console Errors

If you see these errors, here's what they mean:

- **"Refused to load script"** → Ad blocker or privacy extension
- **"CORS policy"** → Browser security blocking the embed
- **"instgrm is not defined"** → Instagram script didn't load
- **"twttr is not defined"** → Twitter script didn't load

## Best Practices

1. **Use Embed Manager** for important embeds (more reliable)
2. **Test in incognito mode** to rule out extension issues
3. **Wait 5 seconds** after page load before concluding embed is broken
4. **Use official embed codes** when possible (Method 3)
5. **Keep URLs clean** - remove tracking parameters

## Alternative: Direct Links

If embeds continue to fail, you can:
1. Just paste the URL as a regular link
2. Add text like "View this post on Instagram: [link]"
3. Users can click to view on the platform

This is actually more privacy-friendly and loads faster!

## Technical Notes

- Instagram's embed.js is notoriously unreliable
- It often fails due to privacy/security restrictions
- The script needs specific HTML structure to work
- Timing is critical - scripts must load before processing
- Some users' browsers block social media embeds entirely

## Need Help?

If embeds still don't work after trying all methods:
1. Check browser console for specific errors
2. Test in different browsers
3. Verify the URL is correct and post is public
4. Consider using the Embed Manager method
5. As last resort, use direct links instead
