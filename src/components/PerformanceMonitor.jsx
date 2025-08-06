import { useEffect } from 'react';

/**
 * Performance monitoring component that tracks Core Web Vitals
 * and reports performance metrics
 */
const PerformanceMonitor = () => {
  useEffect(() => {
    // Only run in production
    if (process.env.NODE_ENV !== 'production') return;

    // Track Core Web Vitals
    const trackWebVitals = () => {
      // Largest Contentful Paint (LCP)
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.entryType === 'largest-contentful-paint') {
            console.log('LCP:', entry.startTime);
            // Send to analytics
            if (window.gtag) {
              window.gtag('event', 'web_vitals', {
                name: 'LCP',
                value: Math.round(entry.startTime),
                event_category: 'Performance'
              });
            }
          }
        }
      });
      
      try {
        observer.observe({ entryTypes: ['largest-contentful-paint'] });
      } catch (e) {
        // Browser doesn't support this metric
      }

      // First Input Delay (FID)
      const fidObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.entryType === 'first-input') {
            const fid = entry.processingStart - entry.startTime;
            console.log('FID:', fid);
            if (window.gtag) {
              window.gtag('event', 'web_vitals', {
                name: 'FID',
                value: Math.round(fid),
                event_category: 'Performance'
              });
            }
          }
        }
      });

      try {
        fidObserver.observe({ entryTypes: ['first-input'] });
      } catch (e) {
        // Browser doesn't support this metric
      }

      // Cumulative Layout Shift (CLS)
      let clsValue = 0;
      let clsEntries = [];

      const clsObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (!entry.hadRecentInput) {
            clsEntries.push(entry);
            clsValue += entry.value;
          }
        }
      });

      try {
        clsObserver.observe({ entryTypes: ['layout-shift'] });
      } catch (e) {
        // Browser doesn't support this metric
      }

      // Report CLS when page is hidden
      const reportCLS = () => {
        console.log('CLS:', clsValue);
        if (window.gtag) {
          window.gtag('event', 'web_vitals', {
            name: 'CLS',
            value: Math.round(clsValue * 1000),
            event_category: 'Performance'
          });
        }
      };

      document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'hidden') {
          reportCLS();
        }
      });

      // Report on page unload
      window.addEventListener('beforeunload', reportCLS);
    };

    // Track resource loading performance
    const trackResourceTiming = () => {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          // Track slow loading resources
          if (entry.duration > 1000) {
            console.warn('Slow resource:', entry.name, entry.duration + 'ms');
            
            if (window.gtag) {
              window.gtag('event', 'slow_resource', {
                resource_name: entry.name,
                duration: Math.round(entry.duration),
                event_category: 'Performance'
              });
            }
          }

          // Track image loading specifically
          if (entry.name.includes('.webp') || entry.name.includes('.avif') || entry.name.includes('.jpg')) {
            console.log('Image loaded:', entry.name, entry.duration + 'ms');
          }

          // Track video loading
          if (entry.name.includes('.webm') || entry.name.includes('.mp4')) {
            console.log('Video loaded:', entry.name, entry.duration + 'ms');
          }
        }
      });

      try {
        observer.observe({ entryTypes: ['resource'] });
      } catch (e) {
        // Browser doesn't support this
      }
    };

    // Track navigation timing
    const trackNavigationTiming = () => {
      window.addEventListener('load', () => {
        const navigation = performance.getEntriesByType('navigation')[0];
        if (navigation) {
          const metrics = {
            dns: navigation.domainLookupEnd - navigation.domainLookupStart,
            tcp: navigation.connectEnd - navigation.connectStart,
            ttfb: navigation.responseStart - navigation.requestStart,
            download: navigation.responseEnd - navigation.responseStart,
            domInteractive: navigation.domInteractive - navigation.navigationStart,
            domComplete: navigation.domComplete - navigation.navigationStart,
            loadComplete: navigation.loadEventEnd - navigation.navigationStart
          };

          console.log('Navigation metrics:', metrics);

          // Send key metrics to analytics
          if (window.gtag) {
            window.gtag('event', 'navigation_timing', {
              ttfb: Math.round(metrics.ttfb),
              dom_interactive: Math.round(metrics.domInteractive),
              load_complete: Math.round(metrics.loadComplete),
              event_category: 'Performance'
            });
          }
        }
      });
    };

    // Track memory usage (if available)
    const trackMemoryUsage = () => {
      if ('memory' in performance) {
        const memory = performance.memory;
        console.log('Memory usage:', {
          used: Math.round(memory.usedJSHeapSize / 1024 / 1024) + 'MB',
          total: Math.round(memory.totalJSHeapSize / 1024 / 1024) + 'MB',
          limit: Math.round(memory.jsHeapSizeLimit / 1024 / 1024) + 'MB'
        });

        // Warn if memory usage is high
        if (memory.usedJSHeapSize / memory.jsHeapSizeLimit > 0.8) {
          console.warn('High memory usage detected');
          if (window.gtag) {
            window.gtag('event', 'high_memory_usage', {
              used_mb: Math.round(memory.usedJSHeapSize / 1024 / 1024),
              event_category: 'Performance'
            });
          }
        }
      }
    };

    // Initialize all tracking
    trackWebVitals();
    trackResourceTiming();
    trackNavigationTiming();
    
    // Track memory usage every 30 seconds
    const memoryInterval = setInterval(trackMemoryUsage, 30000);

    // Cleanup
    return () => {
      clearInterval(memoryInterval);
    };
  }, []);

  return null; // This component doesn't render anything
};

export default PerformanceMonitor;
