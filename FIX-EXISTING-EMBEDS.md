# Fix Existing Instagram/Twitter Embeds

## The Problem
Existing articles have Instagram/Twitter embeds that were saved with the old format and aren't rendering properly. They show as "View this post on Instagram" links instead of the actual embedded posts.

## Why This Happens
The embed scripts (Instagram and Twitter) need the proper HTML structure to work. When you paste a URL in the editor, it creates a blockquote, but the scripts need to process these blockquotes to turn them into actual embeds.

## Solution: Re-save Existing Articles

To fix existing articles with broken embeds, you need to:

### Option 1: Re-save in Admin Panel (Recommended)
1. Go to the Admin Panel
2. Open the article with broken embeds
3. Click "Edit Article"
4. **Don't change anything** - just click "Update Article"
5. The embeds will be re-processed and should work correctly

### Option 2: Use the Embed Manager
Instead of pasting Instagram/Twitter URLs directly in the rich text editor, use the **Embed Manager** section:

1. In the article editor, scroll down to "Social Media Embeds"
2. Click "Add Embed"
3. Select the platform (Instagram/Twitter)
4. Paste the post URL
5. Save the article

This method stores embeds separately and renders them using the UniversalEmbed component, which has better reliability.

### Option 3: Get the Proper Embed Code
For Instagram:
1. Go to the Instagram post in your browser
2. Click the three dots (•••) on the post
3. Select "Embed"
4. Copy the embed code
5. In the article editor, click the Video/Embed button
6. Select "Instagram" as type
7. Paste the embed code in "Custom Embed Code"

For Twitter/X:
1. Go to the tweet
2. Click the share icon
3. Select "Embed Tweet"
4. Copy the embed code
5. In the article editor, click the Video/Embed button
6. Select "Twitter" as type
7. Paste the embed code in "Custom Embed Code"

## Technical Details

The new system works as follows:
- **EmbedRenderer**: Processes embeds in article content, loads scripts, and retries multiple times
- **UniversalEmbed**: Handles embeds added via the Embed Manager
- Both components now properly load and process Instagram/Twitter scripts

## Testing
After re-saving an article:
1. View the article on the frontend
2. Wait 2-3 seconds for embeds to load
3. The Instagram/Twitter posts should appear as interactive widgets
4. If not, check the browser console for errors

## Note
The embed scripts from Instagram and Twitter can sometimes be slow or fail to load due to:
- Network issues
- Ad blockers
- Privacy extensions
- CORS restrictions

If embeds still don't work after re-saving, try:
1. Disabling browser extensions
2. Clearing browser cache
3. Testing in an incognito/private window
4. Using the Embed Manager method instead
