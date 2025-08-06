/**
 * Performance Diagnostic Script
 * Analyzes page loading performance and identifies bottlenecks
 */

// Performance metrics collection
const performanceDiagnostic = {
  // Core Web Vitals
  vitals: {},
  
  // Resource timing
  resources: [],
  
  // Navigation timing
  navigation: {},
  
  // Memory usage
  memory: {},
  
  // Custom metrics
  custom: {},

  // Initialize diagnostic
  init() {
    console.log('🔍 Starting Performance Diagnostic...');
    
    // Wait for page to fully load
    if (document.readyState === 'complete') {
      this.runDiagnostic();
    } else {
      window.addEventListener('load', () => this.runDiagnostic());
    }
  },

  // Run complete diagnostic
  runDiagnostic() {
    setTimeout(() => {
      this.measureNavigationTiming();
      this.measureResourceTiming();
      this.measureMemoryUsage();
      this.measureCustomMetrics();
      this.trackWebVitals();
      this.generateReport();
    }, 1000); // Wait 1s after load for accurate measurements
  },

  // Measure navigation timing
  measureNavigationTiming() {
    const navigation = performance.getEntriesByType('navigation')[0];
    if (!navigation) return;

    this.navigation = {
      // DNS lookup time
      dnsLookup: navigation.domainLookupEnd - navigation.domainLookupStart,
      
      // TCP connection time
      tcpConnection: navigation.connectEnd - navigation.connectStart,
      
      // Time to First Byte
      ttfb: navigation.responseStart - navigation.requestStart,
      
      // Response download time
      responseTime: navigation.responseEnd - navigation.responseStart,
      
      // DOM processing time
      domProcessing: navigation.domComplete - navigation.domLoading,
      
      // DOM Interactive (when DOM is ready)
      domInteractive: navigation.domInteractive - navigation.navigationStart,
      
      // DOM Content Loaded
      domContentLoaded: navigation.domContentLoadedEventEnd - navigation.navigationStart,
      
      // Full page load
      pageLoad: navigation.loadEventEnd - navigation.navigationStart,
      
      // Total time
      total: navigation.loadEventEnd - navigation.navigationStart
    };
  },

  // Measure resource timing
  measureResourceTiming() {
    const resources = performance.getEntriesByType('resource');
    
    this.resources = resources.map(resource => ({
      name: resource.name.split('/').pop(),
      fullName: resource.name,
      type: this.getResourceType(resource.name),
      size: resource.transferSize || 0,
      duration: resource.duration,
      startTime: resource.startTime,
      isLarge: resource.duration > 1000 || (resource.transferSize > 500000),
      isSlow: resource.duration > 2000
    }));

    // Categorize resources
    this.resourceStats = {
      images: this.resources.filter(r => r.type === 'image'),
      videos: this.resources.filter(r => r.type === 'video'),
      scripts: this.resources.filter(r => r.type === 'script'),
      styles: this.resources.filter(r => r.type === 'style'),
      fonts: this.resources.filter(r => r.type === 'font'),
      other: this.resources.filter(r => r.type === 'other')
    };
  },

  // Get resource type
  getResourceType(url) {
    if (url.match(/\.(jpg|jpeg|png|gif|webp|avif|svg)$/i)) return 'image';
    if (url.match(/\.(mp4|webm|ogg|avi)$/i)) return 'video';
    if (url.match(/\.(js|mjs)$/i)) return 'script';
    if (url.match(/\.(css)$/i)) return 'style';
    if (url.match(/\.(woff|woff2|ttf|otf|eot)$/i)) return 'font';
    return 'other';
  },

  // Measure memory usage
  measureMemoryUsage() {
    if ('memory' in performance) {
      const memory = performance.memory;
      this.memory = {
        used: Math.round(memory.usedJSHeapSize / 1024 / 1024),
        total: Math.round(memory.totalJSHeapSize / 1024 / 1024),
        limit: Math.round(memory.jsHeapSizeLimit / 1024 / 1024),
        usage: Math.round((memory.usedJSHeapSize / memory.jsHeapSizeLimit) * 100)
      };
    }
  },

  // Measure custom metrics
  measureCustomMetrics() {
    // Count DOM elements
    this.custom.domElements = document.querySelectorAll('*').length;
    
    // Count images
    this.custom.totalImages = document.querySelectorAll('img').length;
    
    // Count videos
    this.custom.totalVideos = document.querySelectorAll('video').length;
    
    // Check for lazy loading
    this.custom.lazyImages = document.querySelectorAll('img[loading="lazy"]').length;
    
    // Bundle size estimation
    const scriptResources = this.resources.filter(r => r.type === 'script');
    this.custom.bundleSize = scriptResources.reduce((total, script) => total + (script.size || 0), 0);
    
    // CSS size
    const styleResources = this.resources.filter(r => r.type === 'style');
    this.custom.cssSize = styleResources.reduce((total, style) => total + (style.size || 0), 0);
  },

  // Track Web Vitals
  trackWebVitals() {
    // Largest Contentful Paint
    try {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        this.vitals.lcp = Math.round(lastEntry.startTime);
      });
      observer.observe({ entryTypes: ['largest-contentful-paint'] });
    } catch (e) {
      console.warn('LCP not supported');
    }

    // First Input Delay
    try {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          this.vitals.fid = Math.round(entry.processingStart - entry.startTime);
        }
      });
      observer.observe({ entryTypes: ['first-input'] });
    } catch (e) {
      console.warn('FID not supported');
    }

    // Cumulative Layout Shift
    let clsValue = 0;
    try {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (!entry.hadRecentInput) {
            clsValue += entry.value;
          }
        }
        this.vitals.cls = Math.round(clsValue * 1000) / 1000;
      });
      observer.observe({ entryTypes: ['layout-shift'] });
    } catch (e) {
      console.warn('CLS not supported');
    }
  },

  // Generate comprehensive report
  generateReport() {
    console.log('\n🚀 PERFORMANCE DIAGNOSTIC REPORT');
    console.log('=====================================\n');

    // Navigation Timing
    console.log('⏱️  NAVIGATION TIMING:');
    console.log(`   DNS Lookup: ${this.navigation.dnsLookup}ms`);
    console.log(`   TCP Connection: ${this.navigation.tcpConnection}ms`);
    console.log(`   Time to First Byte: ${this.navigation.ttfb}ms`);
    console.log(`   Response Time: ${this.navigation.responseTime}ms`);
    console.log(`   DOM Processing: ${this.navigation.domProcessing}ms`);
    console.log(`   DOM Interactive: ${this.navigation.domInteractive}ms`);
    console.log(`   DOM Content Loaded: ${this.navigation.domContentLoaded}ms`);
    console.log(`   Full Page Load: ${this.navigation.pageLoad}ms`);
    console.log(`   Total Time: ${this.navigation.total}ms\n`);

    // Resource Analysis
    console.log('📦 RESOURCE ANALYSIS:');
    console.log(`   Total Resources: ${this.resources.length}`);
    console.log(`   Images: ${this.resourceStats.images.length}`);
    console.log(`   Videos: ${this.resourceStats.videos.length}`);
    console.log(`   Scripts: ${this.resourceStats.scripts.length}`);
    console.log(`   Stylesheets: ${this.resourceStats.styles.length}\n`);

    // Large/Slow Resources
    const largeResources = this.resources.filter(r => r.isLarge);
    const slowResources = this.resources.filter(r => r.isSlow);
    
    if (largeResources.length > 0) {
      console.log('⚠️  LARGE RESOURCES (>500KB or >1s):');
      largeResources.forEach(resource => {
        console.log(`   ${resource.name}: ${Math.round(resource.size/1024)}KB, ${Math.round(resource.duration)}ms`);
      });
      console.log('');
    }

    if (slowResources.length > 0) {
      console.log('🐌 SLOW RESOURCES (>2s):');
      slowResources.forEach(resource => {
        console.log(`   ${resource.name}: ${Math.round(resource.duration)}ms`);
      });
      console.log('');
    }

    // Memory Usage
    if (Object.keys(this.memory).length > 0) {
      console.log('💾 MEMORY USAGE:');
      console.log(`   Used: ${this.memory.used}MB`);
      console.log(`   Total: ${this.memory.total}MB`);
      console.log(`   Limit: ${this.memory.limit}MB`);
      console.log(`   Usage: ${this.memory.usage}%\n`);
    }

    // Custom Metrics
    console.log('📊 CUSTOM METRICS:');
    console.log(`   DOM Elements: ${this.custom.domElements}`);
    console.log(`   Total Images: ${this.custom.totalImages}`);
    console.log(`   Lazy Images: ${this.custom.lazyImages}`);
    console.log(`   Total Videos: ${this.custom.totalVideos}`);
    console.log(`   Bundle Size: ${Math.round(this.custom.bundleSize/1024)}KB`);
    console.log(`   CSS Size: ${Math.round(this.custom.cssSize/1024)}KB\n`);

    // Web Vitals
    if (Object.keys(this.vitals).length > 0) {
      console.log('🎯 CORE WEB VITALS:');
      if (this.vitals.lcp) console.log(`   LCP: ${this.vitals.lcp}ms ${this.vitals.lcp < 2500 ? '✅' : '❌'}`);
      if (this.vitals.fid) console.log(`   FID: ${this.vitals.fid}ms ${this.vitals.fid < 100 ? '✅' : '❌'}`);
      if (this.vitals.cls) console.log(`   CLS: ${this.vitals.cls} ${this.vitals.cls < 0.1 ? '✅' : '❌'}`);
      console.log('');
    }

    // Recommendations
    this.generateRecommendations();
  },

  // Generate optimization recommendations
  generateRecommendations() {
    console.log('💡 OPTIMIZATION RECOMMENDATIONS:');
    
    const recommendations = [];

    // Check for large video
    const largeVideos = this.resourceStats.videos.filter(v => v.size > 10000000); // >10MB
    if (largeVideos.length > 0) {
      recommendations.push('🎬 Optimize video files: Consider compressing or using different formats');
    }

    // Check for large images
    const largeImages = this.resourceStats.images.filter(img => img.size > 500000); // >500KB
    if (largeImages.length > 0) {
      recommendations.push('🖼️  Optimize images: Use WebP/AVIF formats and responsive sizes');
    }

    // Check for non-lazy images
    if (this.custom.lazyImages < this.custom.totalImages) {
      recommendations.push('⚡ Implement lazy loading for all images');
    }

    // Check bundle size
    if (this.custom.bundleSize > 1000000) { // >1MB
      recommendations.push('📦 Reduce bundle size: Implement code splitting');
    }

    // Check memory usage
    if (this.memory.usage > 80) {
      recommendations.push('💾 High memory usage detected: Check for memory leaks');
    }

    // Check TTFB
    if (this.navigation.ttfb > 600) {
      recommendations.push('🚀 Improve server response time (TTFB > 600ms)');
    }

    // Check DOM size
    if (this.custom.domElements > 1500) {
      recommendations.push('🏗️  Reduce DOM complexity (>1500 elements)');
    }

    if (recommendations.length === 0) {
      console.log('   ✅ No major issues detected! Performance looks good.');
    } else {
      recommendations.forEach((rec, index) => {
        console.log(`   ${index + 1}. ${rec}`);
      });
    }

    console.log('\n=====================================');
    console.log('📈 Diagnostic Complete!');
  }
};

// Auto-run diagnostic
performanceDiagnostic.init();

// Make available globally for manual runs
window.performanceDiagnostic = performanceDiagnostic;
