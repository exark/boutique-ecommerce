module.exports = {
  ci: {
    collect: {
      url: ['http://localhost:4173/'],
      startServerCommand: 'npm run preview',
      startServerReadyPattern: 'Local:',
      startServerReadyTimeout: 30000,
      numberOfRuns: 3,
    },
    assert: {
      assertions: {
        'categories:performance': ['warn', { minScore: 0.7 }], // Relaxed for development
        'categories:accessibility': ['error', { minScore: 0.9 }],
        'categories:best-practices': ['error', { minScore: 0.9 }],
        'categories:seo': ['warn', { minScore: 0.8 }], // Relaxed for development
        'categories:pwa': ['error', { minScore: 0.8 }],
        
        // Core Web Vitals
        'first-contentful-paint': ['warn', { maxNumericValue: 3000 }],
        'largest-contentful-paint': ['warn', { maxNumericValue: 4000 }],
        'cumulative-layout-shift': ['error', { maxNumericValue: 0.1 }],
        'total-blocking-time': ['error', { maxNumericValue: 300 }],
        
        // Performance budgets
        'total-byte-weight': ['warn', { maxNumericValue: 4 * 1024 * 1024 }], // 4MB
        'unused-javascript': ['warn', { maxNumericValue: 20000 }],
        'unused-css-rules': ['warn', { maxNumericValue: 20000 }],
        'uses-responsive-images': ['warn', { minScore: 0.5 }],
        'modern-image-formats': ['warn', { minScore: 0.5 }],
        'efficient-animated-content': 'error',
        'offscreen-images': 'error',
        'render-blocking-resources': ['warn', { minScore: 0.5 }],
        'unminified-css': 'error',
        'unminified-javascript': 'error',
        'uses-text-compression': 'error',
        'properly-size-images': 'error',
      },
    },
    upload: {
      target: 'temporary-public-storage',
    },
  },
};
