# 🚀 Deployment Checklist

## Pre-Deployment

### ✅ Code Quality
- [x] TypeScript compilation successful
- [x] No console errors
- [x] Build successful (`npm run build`)
- [x] All features tested locally
- [x] No diagnostic errors

### ✅ Features Verified
- [x] Article creation works
- [x] Article editing works (by ID)
- [x] Excerpt field with counter
- [x] Scheduling system
- [x] Embed manager (10+ platforms)
- [x] Publishing options (Pin/Featured/Breaking)
- [x] Category display

### ✅ Backend Ready
- [x] Backend deployed at: `https://web-production-af44.up.railway.app`
- [x] All API endpoints working
- [x] CORS configured correctly
- [x] Scheduled publishing cron running

---

## Deployment Steps

### Option 1: Netlify (Recommended)

#### Step 1: Install Netlify CLI
```bash
npm install -g netlify-cli
```

#### Step 2: Build
```bash
npm run build
```

#### Step 3: Deploy
```bash
netlify deploy --prod
```

#### Step 4: Configure
- Set environment variables in Netlify dashboard
- Configure redirects (already in `netlify.toml`)
- Set custom domain if needed

---

### Option 2: Vercel

#### Step 1: Install Vercel CLI
```bash
npm install -g vercel
```

#### Step 2: Deploy
```bash
vercel --prod
```

#### Step 3: Configure
- Set environment variables in Vercel dashboard
- Configure domain settings

---

### Option 3: Manual Deployment

#### Step 1: Build
```bash
npm run build
```

#### Step 2: Upload
- Upload contents of `dist/` folder to your web host
- Ensure server is configured to serve `index.html` for all routes

#### Step 3: Configure Server
For Apache (`.htaccess` already included):
```apache
RewriteEngine On
RewriteBase /
RewriteRule ^index\.html$ - [L]
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule . /index.html [L]
```

For Nginx:
```nginx
location / {
  try_files $uri $uri/ /index.html;
}
```

---

## Post-Deployment

### ✅ Verification Tests

#### 1. Homepage
- [ ] Visit homepage
- [ ] Check featured stories load
- [ ] Check latest news loads
- [ ] Check categories display

#### 2. Article Creation
- [ ] Login to admin panel
- [ ] Create new article with:
  - [ ] Title and excerpt
  - [ ] Content
  - [ ] Featured image
  - [ ] 2-3 embeds (Instagram, YouTube, Spotify)
  - [ ] Schedule for 5 minutes from now
  - [ ] Toggle "Featured Story"
- [ ] Save article
- [ ] Verify it appears in admin list

#### 3. Article Editing
- [ ] Click edit on existing article
- [ ] Verify all fields load
- [ ] Modify excerpt
- [ ] Add/remove embeds
- [ ] Save changes
- [ ] Verify changes appear

#### 4. Article Display
- [ ] View published article
- [ ] Check excerpt displays
- [ ] Check embeds load and work:
  - [ ] Instagram posts display
  - [ ] YouTube videos play
  - [ ] Spotify player works
- [ ] Check captions show

#### 5. Scheduling
- [ ] Wait for scheduled article time
- [ ] Refresh admin panel
- [ ] Verify status changed to "published"
- [ ] Check article appears on public site

#### 6. Mobile Testing
- [ ] Test on mobile device
- [ ] Check responsive design
- [ ] Test embeds on mobile
- [ ] Test admin panel on mobile

---

## Environment Variables

### Required Variables
```env
VITE_API_URL=https://web-production-af44.up.railway.app
VITE_SITE_NAME=Dominica News
VITE_SITE_URL=https://your-domain.com
```

### Optional Variables
```env
VITE_ADMIN_EMAIL=admin@dominicanews.com
VITE_ADMIN_PASSWORD=Pass@12345
VITE_ENABLE_COMMENTS=true
VITE_ENABLE_NEWSLETTER=true
VITE_ENABLE_DARK_MODE=true
```

---

## Performance Optimization

### ✅ Already Optimized
- [x] Code splitting enabled
- [x] Lazy loading for routes
- [x] Image optimization
- [x] Minified CSS/JS
- [x] Gzip compression

### Additional Optimizations (Optional)
- [ ] Enable CDN for static assets
- [ ] Configure caching headers
- [ ] Add service worker for offline support
- [ ] Implement image lazy loading
- [ ] Add analytics tracking

---

## Security Checklist

### ✅ Already Implemented
- [x] HTTPS enabled
- [x] JWT authentication
- [x] Protected admin routes
- [x] Input validation
- [x] XSS protection
- [x] CORS configured

### Additional Security (Recommended)
- [ ] Enable rate limiting
- [ ] Add CSP headers
- [ ] Configure security headers
- [ ] Regular security audits
- [ ] Keep dependencies updated

---

## Monitoring

### What to Monitor

#### 1. Backend Health
- Check Railway dashboard
- Monitor API response times
- Check error logs
- Verify cron jobs running

#### 2. Frontend Performance
- Page load times
- Bundle size
- Error tracking
- User analytics

#### 3. Scheduled Publishing
- Check articles publish on time
- Monitor cron job logs
- Verify scheduled articles list

#### 4. Embeds
- Check embed scripts load
- Monitor embed errors
- Test different platforms

---

## Troubleshooting

### Issue: Articles not loading
**Check**:
- Backend is running
- API URL is correct
- CORS is configured
- Network tab in browser

### Issue: Embeds not displaying
**Check**:
- URL format is correct
- Platform scripts loading
- Ad blockers disabled
- Browser console for errors

### Issue: Scheduled articles not publishing
**Check**:
- Backend cron is running
- Scheduled time is in future
- Article status is "scheduled"
- Backend logs for errors

### Issue: Can't edit articles
**Check**:
- Authentication token valid
- Article has valid ID
- API endpoint correct
- Browser console for errors

---

## Rollback Plan

### If Issues Occur

#### Step 1: Identify Issue
- Check error logs
- Review recent changes
- Test specific features

#### Step 2: Quick Fix
- Revert to previous deployment
- Fix critical bugs
- Deploy hotfix

#### Step 3: Full Rollback
```bash
# Netlify
netlify rollback

# Vercel
vercel rollback

# Manual
# Restore previous dist/ folder
```

---

## Success Criteria

### ✅ Deployment Successful When:
- [ ] Homepage loads without errors
- [ ] Can login to admin panel
- [ ] Can create articles with embeds
- [ ] Can edit existing articles
- [ ] Can schedule articles
- [ ] Embeds display correctly
- [ ] Mobile version works
- [ ] All features functional

---

## Post-Launch Tasks

### Immediate (Day 1)
- [ ] Monitor error logs
- [ ] Test all features in production
- [ ] Verify scheduled publishing works
- [ ] Check mobile experience
- [ ] Test embed platforms

### Short-term (Week 1)
- [ ] Gather user feedback
- [ ] Monitor performance metrics
- [ ] Check scheduled articles publishing
- [ ] Review analytics
- [ ] Fix any reported bugs

### Long-term (Month 1)
- [ ] Analyze usage patterns
- [ ] Optimize based on data
- [ ] Plan new features
- [ ] Update documentation
- [ ] Security audit

---

## Support Resources

### Documentation
- `IMPLEMENTATION-COMPLETE.md` - Feature documentation
- `QUICK-START.md` - Getting started guide
- `TEST-FEATURES.md` - Testing procedures
- `BEFORE-AFTER-COMPARISON.md` - Visual guide

### Backend
- Railway Dashboard: https://railway.app
- API URL: https://web-production-af44.up.railway.app
- Backend logs available in Railway

### Frontend
- Build logs in hosting dashboard
- Browser console for client errors
- Network tab for API issues

---

## Contact & Support

### For Technical Issues
1. Check documentation files
2. Review browser console
3. Check backend logs
4. Test in incognito mode
5. Clear cache and retry

### For Feature Requests
- Document in GitHub issues
- Prioritize based on user needs
- Plan implementation timeline

---

## 🎉 Ready to Deploy!

All checks passed! Your Dominica News platform is ready for production.

**Final Steps**:
1. Run `npm run build`
2. Deploy to your hosting
3. Run post-deployment tests
4. Monitor for 24 hours
5. Celebrate! 🎊

**Good luck with your launch!** 🚀
