# Immediate Fix for Broken Embeds

## The Problem
Your existing article has Instagram/Twitter embeds showing as links instead of the actual posts.

## Why This Happens
The article was saved with an old/incomplete embed format that the scripts can't process properly.

## The Solution (Takes 2 Minutes)

### Step 1: Open the Article in Admin
1. Go to your admin panel
2. Find the article with broken embeds
3. Click "Edit Article"

### Step 2: Delete Old Embeds
1. Scroll through the article content
2. Find each Instagram/Twitter embed (they'll show as links or blockquotes)
3. Select and delete them

### Step 3: Re-add Embeds with New Format
For each embed you deleted:

1. Click the **Video/Embed button** (📹) in the toolbar
2. Select the platform:
   - "Instagram" for Instagram posts
   - "Twitter / X" for tweets
3. Paste the URL of the post/tweet
4. Click "Add Embed"

### Step 4: Save
Click "Update Article" to save

### Step 5: Test
1. View the article on the frontend
2. Wait 5-10 seconds
3. The embeds should now appear as actual posts

## Alternative Method (More Reliable)

Instead of adding embeds in the rich text content, use the **Embed Manager**:

1. Edit the article
2. Scroll down to "Social Media Embeds" section (below the main editor)
3. Click "Add Embed"
4. Select platform and paste URL
5. Add optional caption
6. Save article

This method is more reliable because it uses a different rendering system.

## New Feature: Reload Button

I've added a "Reload Embeds" button that appears after 5 seconds if embeds haven't loaded. If you see it, click it to force embeds to reload.

## What I've Improved

1. **More aggressive retry logic** - Now tries to load embeds 9 times over 10 seconds
2. **Reload button** - Manual reload option if embeds don't load
3. **Better timing** - Improved delays between retry attempts
4. **Loading animation** - Visual feedback while embeds are processing

## Important Notes

- **Existing articles MUST be re-saved** with the new format
- The code improvements only help NEW embeds or re-saved articles
- Old embeds in the database won't magically fix themselves
- This is a one-time fix per article

## Quick Test

After re-saving an article:
1. Open it in a private/incognito window
2. Wait 10 seconds
3. If still showing as links, click the "Reload Embeds" button
4. If still not working, check browser console (F12) for errors

## Still Not Working?

If embeds still show as links after re-saving:

1. **Check the URL** - Make sure the post/tweet is public
2. **Try incognito mode** - Rules out browser extensions
3. **Check console** - Press F12 and look for errors
4. **Use Embed Manager** - More reliable than inline embeds
5. **Get official code** - Copy embed code directly from Instagram/Twitter

## Why Re-saving is Necessary

The old embeds in your database look like this:
```html
<blockquote class="twitter-tweet">
  <a href="URL">View Tweet</a>
</blockquote>
```

The new format includes required attributes:
```html
<blockquote class="twitter-tweet" data-dnt="true" data-theme="light">
  <p lang="en" dir="ltr">
    <a href="URL">View this post on Twitter</a>
  </p>
</blockquote>
```

The scripts need these attributes to work properly.

## Summary

✅ Code is fixed and improved
✅ New embeds will work correctly
⚠️ Old embeds need to be re-saved
⏱️ Takes 2 minutes per article

**Action Required:** Re-save your articles with embeds using the steps above.
