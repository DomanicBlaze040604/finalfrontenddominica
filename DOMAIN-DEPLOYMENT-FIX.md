# 🔧 Custom Domain Deployment Fix Guide

## 🚨 Problem
Your app works on Vercel's domain but fails on your custom domain with MIME type errors:
```
Failed to load module script: Expected a JavaScript module script but the server responded with a MIME type of "text/html"
```

## 🎯 Root Cause
Your custom domain server is returning HTML (404 pages) instead of JavaScript files when the browser requests assets. This happens because:

1. **SPA Routing**: Single Page Apps need all routes to serve `index.html`
2. **Asset Serving**: JavaScript files must be served with correct MIME types
3. **Server Configuration**: Your hosting provider needs proper SPA configuration

## ✅ Solutions Applied

### 1. Updated Vercel Configuration (`vercel.json`)
- ✅ Added proper MIME type headers for JavaScript files
- ✅ Added asset caching headers
- ✅ Ensured SPA routing works correctly

### 2. Created Universal Redirect Files
- ✅ `public/_redirects` - For Netlify and similar platforms
- ✅ `public/.htaccess` - For Apache servers
- ✅ Proper MIME type configuration

### 3. Enhanced Vite Build Configuration
- ✅ Organized assets into proper directories
- ✅ Consistent file naming for better caching
- ✅ Optimized chunk splitting

## 🚀 Deployment Steps

### For Vercel (Recommended)
1. **Redeploy with new configuration**:
   ```bash
   vercel --prod
   ```

2. **Check domain settings in Vercel dashboard**:
   - Go to your project settings
   - Verify custom domain is properly configured
   - Ensure SSL certificate is active

### For Other Hosting Providers

#### Netlify
1. The `_redirects` file will handle SPA routing automatically
2. Redeploy your site

#### Apache/cPanel Hosting
1. The `.htaccess` file will configure proper routing
2. Upload the `dist` folder contents to your domain root
3. Ensure `.htaccess` is in the root directory

#### Nginx
Add this to your Nginx configuration:
```nginx
location / {
    try_files $uri $uri/ /index.html;
}

location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
}

location ~* \.js$ {
    add_header Content-Type "application/javascript";
}
```

## 🔍 Troubleshooting Steps

### 1. Check Asset URLs
Open browser dev tools and verify:
- Assets are loading from correct URLs
- No 404 errors in Network tab
- JavaScript files have `application/javascript` MIME type

### 2. Test SPA Routing
- Navigate to `/admin` directly in browser
- Should load the app, not show 404
- All routes should work when accessed directly

### 3. Verify CORS
- Check if API calls work from your custom domain
- Ensure backend allows your custom domain origin

### 4. DNS Configuration
Ensure your domain DNS is properly configured:
```
Type: CNAME
Name: www (or @)
Value: your-vercel-deployment.vercel.app
```

## 🛠 Quick Fixes

### If Still Not Working:

1. **Clear Browser Cache**:
   ```
   Ctrl+Shift+R (Hard refresh)
   Clear all browser data for your domain
   ```

2. **Check Vercel Domain Settings**:
   - Remove and re-add your custom domain
   - Verify SSL certificate status
   - Check deployment logs

3. **Test with Different Browsers**:
   - Try incognito/private mode
   - Test on mobile devices

4. **Verify Build Output**:
   ```bash
   npm run build
   # Check that dist/assets/ contains .js files
   # Verify index.html references correct asset paths
   ```

## 📞 Emergency Fixes

### Option 1: Force Redeploy
```bash
# Clear cache and redeploy
rm -rf dist node_modules
npm install
npm run build
vercel --prod --force
```

### Option 2: Use Vercel CLI Domain Commands
```bash
# Remove domain
vercel domains rm yourdomain.com

# Re-add domain
vercel domains add yourdomain.com
```

### Option 3: Check Vercel Project Settings
1. Go to Vercel Dashboard
2. Project Settings → Domains
3. Verify domain configuration
4. Check SSL certificate status
5. Review deployment logs

## 🎯 Expected Results

After applying these fixes:
- ✅ Your custom domain loads the app correctly
- ✅ All JavaScript assets load with proper MIME types
- ✅ SPA routing works (direct URL access)
- ✅ Admin panel accessible at yourdomain.com/admin
- ✅ All API calls work properly

## 📋 Verification Checklist

- [ ] Custom domain loads homepage
- [ ] JavaScript console shows no MIME type errors
- [ ] Direct navigation to `/admin` works
- [ ] All routes accessible via direct URL
- [ ] API calls successful from custom domain
- [ ] Admin login functions properly
- [ ] Static pages load correctly

## 🆘 Still Having Issues?

If problems persist:

1. **Check Vercel Deployment Logs**
2. **Verify DNS propagation** (can take up to 48 hours)
3. **Test with `curl` commands** to verify server responses
4. **Contact your domain registrar** if DNS issues persist

---

**Your Dominica News platform should now work perfectly on your custom domain!** 🎉