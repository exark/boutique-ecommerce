# Performance Optimization Guide

This guide documents the comprehensive performance optimizations implemented for the boutique ecommerce site.

## 🚀 Optimizations Implemented

### 1. Modern Image Formats & Responsive Images
- **OptimizedImage Component**: Automatically serves WebP/AVIF with JPEG fallback
- **Responsive Srcsets**: Generates 400w, 800w, 1200w versions for each image
- **Lazy Loading**: Images load only when entering viewport (IntersectionObserver)
- **Priority Loading**: First 4 product images load immediately
- **Aspect Ratio**: Prevents layout shift during image loading

### 2. Video Optimization
- **Lazy Video Loading**: Hero video loads only when section enters viewport
- **Multiple Formats**: WebM (primary) + MP4 (fallback)
- **Compressed Size**: 87MB → ~3-5MB (720p, 15s loop)
- **Poster Image**: Lightweight fallback while video loads
- **Metadata Preload**: Efficient loading strategy

### 3. Code Splitting
- **React.lazy**: All route components are lazy-loaded
- **Manual Chunks**: Vendor, UI, and animation libraries separated
- **Dynamic Imports**: Components load only when needed
- **Suspense Fallback**: Loading spinner during code loading

### 4. Build Optimizations
- **Vite Image Tools**: Automatic image processing at build time
- **Hashed Filenames**: Optimal browser caching
- **Tree Shaking**: Removes unused code
- **Minification**: Terser with console removal
- **Asset Organization**: Images, JS, CSS in separate folders

### 5. CDN & Caching
- **Vercel Edge Network**: Global CDN distribution
- **Cache Headers**: 1-year caching for static assets
- **Immutable Assets**: Hashed filenames enable aggressive caching
- **Security Headers**: XSS protection, content sniffing prevention

### 6. Performance Monitoring
- **Core Web Vitals**: LCP, FID, CLS tracking
- **Resource Timing**: Slow resource detection
- **Memory Monitoring**: Memory usage tracking
- **Analytics Integration**: Performance metrics to Google Analytics

## 📊 Expected Performance Improvements

### Before Optimization
- **First Contentful Paint**: ~3-4s
- **Largest Contentful Paint**: ~5-6s
- **Total Bundle Size**: ~2MB
- **Image Payload**: ~42MB
- **Video Payload**: 87MB

### After Optimization
- **First Contentful Paint**: ~0.8-1.2s
- **Largest Contentful Paint**: ~1.5-2s
- **Total Bundle Size**: ~800KB (initial)
- **Image Payload**: ~60% reduction with modern formats
- **Video Payload**: ~95% reduction (3-5MB)

## 🛠️ Usage Instructions

### 1. Media Optimization
```bash
# Optimize all media files (requires FFmpeg)
npm run optimize-media

# Build with optimized media
npm run build:optimized
```

### 2. Performance Analysis
```bash
# Analyze bundle size
npm run analyze

# Run Lighthouse audit
npm run lighthouse
```

### 3. Development
```bash
# Standard development
npm run dev

# Development with auto product updates
npm run dev-auto
```

## 📋 Prerequisites

### FFmpeg Installation
The media optimization script requires FFmpeg:

**Windows:**
```bash
# Download from https://ffmpeg.org/download.html
# Add to PATH environment variable
```

**macOS:**
```bash
brew install ffmpeg
```

**Linux:**
```bash
sudo apt install ffmpeg
```

### Vite Image Tools
Already configured in `vite.config.js` with:
- WebP/AVIF generation
- Multiple size variants
- Quality optimization
- Automatic hashing

## 🎯 Performance Targets

### Core Web Vitals
- **LCP**: < 2.5s (Good)
- **FID**: < 100ms (Good)
- **CLS**: < 0.1 (Good)

### Lighthouse Scores
- **Performance**: > 95
- **Accessibility**: > 95
- **Best Practices**: > 95
- **SEO**: > 95

## 🔧 Configuration Files

### Vite Configuration (`vite.config.js`)
- Image processing with vite-imagetools
- Code splitting configuration
- Build optimizations
- Asset organization

### Vercel Configuration (`vercel.json`)
- CDN caching headers
- Security headers
- Regional deployment
- Framework optimization

### Package Scripts (`package.json`)
- Media optimization pipeline
- Build variations
- Performance analysis tools

## 📈 Monitoring & Analytics

### Performance Monitor Component
Automatically tracks:
- Core Web Vitals
- Resource loading times
- Memory usage
- Navigation timing

### Vercel Speed Insights
Real user monitoring:
- Page load times
- User interactions
- Geographic performance
- Device-specific metrics

## 🚀 Deployment Checklist

1. **Pre-deployment:**
   - [ ] Run `npm run optimize-media`
   - [ ] Test optimized build locally
   - [ ] Verify image formats are working
   - [ ] Check video loading behavior

2. **Post-deployment:**
   - [ ] Run Lighthouse audit
   - [ ] Verify CDN caching headers
   - [ ] Test on different devices/networks
   - [ ] Monitor Core Web Vitals

3. **Ongoing monitoring:**
   - [ ] Weekly Lighthouse audits
   - [ ] Monitor bundle size growth
   - [ ] Track performance metrics
   - [ ] Update dependencies regularly

## 🔍 Troubleshooting

### Common Issues

**Images not loading:**
- Check image paths in `produits.js`
- Verify optimized images exist in `/public/images/`
- Ensure vite-imagetools is processing correctly

**Video not playing:**
- Verify optimized video files exist
- Check browser autoplay policies
- Ensure poster image is available

**Slow loading:**
- Check network throttling
- Verify CDN headers are applied
- Monitor resource timing in DevTools

### Debug Commands
```bash
# Check optimized files
ls -la public/images/

# Verify build output
npm run build && ls -la dist/assets/

# Test production build locally
npm run preview
```

## 📚 Additional Resources

- [Web.dev Performance](https://web.dev/performance/)
- [Vite Performance Guide](https://vitejs.dev/guide/performance.html)
- [Vercel Edge Network](https://vercel.com/docs/edge-network/overview)
- [Core Web Vitals](https://web.dev/vitals/)

---

**Note**: This optimization guide represents a comprehensive approach to modern web performance. Regular monitoring and updates are recommended to maintain optimal performance.
