# 🚀 Dominica News - Deployment Guide

This guide covers deploying the Dominica News platform to various hosting providers.

## 📋 Pre-deployment Checklist

### 1. Environment Variables
Ensure all required environment variables are set:

```env
VITE_API_URL=https://web-production-af44.up.railway.app
VITE_SITE_NAME=Dominica News
VITE_SITE_URL=https://your-domain.com
VITE_ADMIN_EMAIL=admin@dominicanews.com
VITE_ADMIN_PASSWORD=Pass@12345
```

### 2. Build Test
```bash
npm run build
npm run preview
```

### 3. Type Check
```bash
npm run type-check
```

### 4. Lint Check
```bash
npm run lint
```

## 🌐 Deployment Options

### Option 1: Vercel (Recommended)

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Deploy**
   ```bash
   vercel --prod
   ```

3. **Environment Variables**
   Set in Vercel dashboard or via CLI:
   ```bash
   vercel env add VITE_API_URL
   vercel env add VITE_SITE_URL
   ```

### Option 2: Netlify

1. **Build Command**: `npm run build`
2. **Publish Directory**: `dist`
3. **Environment Variables**: Set in Netlify dashboard

### Option 3: Railway

1. **Connect GitHub Repository**
2. **Set Build Command**: `npm run build`
3. **Set Start Command**: `npm run preview`
4. **Environment Variables**: Configure in Railway dashboard

### Option 4: AWS S3 + CloudFront

1. **Build the project**
   ```bash
   npm run build
   ```

2. **Upload to S3**
   ```bash
   aws s3 sync dist/ s3://your-bucket-name --delete
   ```

3. **Invalidate CloudFront**
   ```bash
   aws cloudfront create-invalidation --distribution-id YOUR_DISTRIBUTION_ID --paths "/*"
   ```

## 🔧 Production Optimizations

### Performance
- ✅ Code splitting implemented
- ✅ Bundle optimization configured
- ✅ Image optimization ready
- ✅ Lazy loading implemented
- ✅ Caching headers configured

### Security
- ✅ CORS properly configured
- ✅ Environment variables secured
- ✅ Authentication implemented
- ✅ Input validation in place

### SEO
- ✅ Meta tags configured
- ✅ Structured data ready
- ✅ Sitemap generation ready
- ✅ Social media tags included

## 📊 Monitoring & Analytics

### Error Tracking
Consider adding:
- Sentry for error tracking
- LogRocket for session replay
- Google Analytics for usage tracking

### Performance Monitoring
- Lighthouse CI for performance monitoring
- Web Vitals tracking
- Bundle analyzer for optimization

## 🔄 CI/CD Pipeline

### GitHub Actions Example
```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run type-check
      - run: npm run lint
      - run: npm run build
      - uses: vercel/action@v1
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
          vercel-args: '--prod'
```

## 🌍 Domain Configuration

### Custom Domain Setup
1. **DNS Configuration**
   ```
   Type: CNAME
   Name: www
   Value: your-deployment-url.vercel.app
   ```

2. **SSL Certificate**
   - Automatically handled by Vercel/Netlify
   - For custom setups, use Let's Encrypt

### Subdomain for Admin
Consider setting up:
- `admin.dominicanews.com` → Admin panel
- `api.dominicanews.com` → API endpoint

## 🔐 Security Considerations

### Production Security
- Remove console logs in production
- Implement rate limiting
- Add security headers
- Regular dependency updates
- Backup strategy

### Admin Access
- Change default admin credentials
- Implement 2FA if needed
- Regular password rotation
- Access logging

## 📱 Mobile & PWA

### Progressive Web App
The app is PWA-ready. To enable:
1. Add service worker
2. Configure manifest.json
3. Implement offline functionality

### Mobile Optimization
- ✅ Responsive design implemented
- ✅ Touch-friendly interactions
- ✅ Fast loading on mobile networks

## 🚨 Troubleshooting

### Common Issues

1. **CORS Errors**
   - Check API_URL environment variable
   - Verify backend CORS configuration

2. **Build Failures**
   - Run `npm run type-check`
   - Check for TypeScript errors

3. **Runtime Errors**
   - Check browser console
   - Verify environment variables

4. **Performance Issues**
   - Run Lighthouse audit
   - Check bundle size with `npm run build`

### Support Contacts
- Technical Issues: Create GitHub issue
- Deployment Iss
ues: Contact development team

## 📈 Post-Deployment

### Health Checks
- [ ] Homepage loads correctly
- [ ] Admin login works with credentials
- [ ] Article creation/editing functions
- [ ] Category management works
- [ ] Breaking news alerts display
- [ ] Mobile responsiveness verified
- [ ] Performance metrics acceptable

### Go-Live Checklist
- [ ] Domain configured
- [ ] SSL certificate active
- [ ] Analytics tracking enabled
- [ ] Error monitoring setup
- [ ] Backup procedures in place
- [ ] Admin credentials secured
- [ ] Team access configured

## 🎯 Success Metrics

### Performance Targets
- First Contentful Paint: < 1.5s
- Largest Contentful Paint: < 2.5s
- Cumulative Layout Shift: < 0.1
- Time to Interactive: < 3s

### Availability Targets
- Uptime: 99.9%
- Response Time: < 500ms
- Error Rate: < 0.1%

---

**🎉 Congratulations! Your Dominica News platform is now live and ready to serve the community!**