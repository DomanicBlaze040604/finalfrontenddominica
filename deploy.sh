#!/bin/bash

# Dominica News - Production Deployment Script

echo "🚀 Starting Dominica News deployment..."

# Clean previous build
echo "🧹 Cleaning previous build..."
rm -rf dist

# Install dependencies
echo "📦 Installing dependencies..."
npm ci

# Type check
echo "🔍 Running type check..."
npm run type-check

# Build for production
echo "🏗️ Building for production..."
npm run build

# Verify build output
echo "✅ Verifying build output..."
if [ -d "dist" ]; then
    echo "✅ Build successful!"
    echo "📊 Build size:"
    du -sh dist/
    echo "📁 Asset structure:"
    ls -la dist/assets/
else
    echo "❌ Build failed!"
    exit 1
fi

# Deploy to Vercel
echo "🌐 Deploying to Vercel..."
if command -v vercel &> /dev/null; then
    vercel --prod --force
    echo "✅ Deployment complete!"
else
    echo "⚠️ Vercel CLI not found. Please install with: npm i -g vercel"
    echo "📋 Manual deployment: Upload dist/ folder to your hosting provider"
fi

echo "🎉 Dominica News deployment finished!"
echo "🔗 Your site should be live at your custom domain"