#!/usr/bin/env node

import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Colors for console output
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m',
  bold: '\x1b[1m'
};

const log = {
  success: (msg) => console.log(`${colors.green}✅ ${msg}${colors.reset}`),
  error: (msg) => console.log(`${colors.red}❌ ${msg}${colors.reset}`),
  warning: (msg) => console.log(`${colors.yellow}⚠️  ${msg}${colors.reset}`),
  info: (msg) => console.log(`${colors.blue}ℹ️  ${msg}${colors.reset}`),
  title: (msg) => console.log(`${colors.bold}${colors.blue}🚀 ${msg}${colors.reset}\n`)
};

async function checkFileExists(filePath, description) {
  try {
    await fs.access(path.join(__dirname, '..', filePath));
    log.success(`${description} exists`);
    return true;
  } catch {
    log.error(`${description} missing: ${filePath}`);
    return false;
  }
}

async function validateViteConfig() {
  log.title('Validating Vite Configuration');
  
  const viteConfigPath = path.join(__dirname, '..', 'vite.config.js');
  try {
    const content = await fs.readFile(viteConfigPath, 'utf-8');
    
    const checks = [
      { pattern: /vite-plugin-pwa/, desc: 'PWA plugin imported' },
      { pattern: /imagetools/, desc: 'Image tools plugin imported' },
      { pattern: /assetFileNames.*hash/, desc: 'Asset hashing configured' },
      { pattern: /runtimeCaching/, desc: 'Runtime caching configured' },
      { pattern: /cleanupOutdatedCaches: true/, desc: 'Cache cleanup enabled' }
    ];
    
    checks.forEach(check => {
      if (check.pattern.test(content)) {
        log.success(check.desc);
      } else {
        log.warning(`${check.desc} - not found`);
      }
    });
    
  } catch (error) {
    log.error(`Failed to read vite.config.js: ${error.message}`);
  }
}

async function validateVercelConfig() {
  log.title('Validating Vercel Configuration');
  
  const vercelConfigPath = path.join(__dirname, '..', 'vercel.json');
  try {
    const content = await fs.readFile(vercelConfigPath, 'utf-8');
    const config = JSON.parse(content);
    
    const requiredHeaders = [
      '/assets/(.*)',
      '/assets/images/(.*)',
      '/(.*).webp',
      '/(.*).avif'
    ];
    
    const headerSources = config.headers?.map(h => h.source) || [];
    
    requiredHeaders.forEach(required => {
      if (headerSources.includes(required)) {
        log.success(`Cache headers for ${required}`);
      } else {
        log.warning(`Missing cache headers for ${required}`);
      }
    });
    
    // Check for immutable cache control
    const hasImmutableCache = config.headers?.some(h => 
      h.headers?.some(header => 
        header.key === 'Cache-Control' && 
        header.value.includes('immutable')
      )
    );
    
    if (hasImmutableCache) {
      log.success('Immutable cache control configured');
    } else {
      log.warning('Immutable cache control not found');
    }
    
  } catch (error) {
    log.error(`Failed to validate vercel.json: ${error.message}`);
  }
}

async function validatePackageJson() {
  log.title('Validating Package.json Scripts');
  
  const packagePath = path.join(__dirname, '..', 'package.json');
  try {
    const content = await fs.readFile(packagePath, 'utf-8');
    const pkg = JSON.parse(content);
    
    const requiredScripts = [
      'build:pwa',
      'lighthouse:ci',
      'cache:purge',
      'perf:audit'
    ];
    
    const requiredDevDeps = [
      'vite-plugin-pwa',
      '@lhci/cli',
      'sharp'
    ];
    
    requiredScripts.forEach(script => {
      if (pkg.scripts?.[script]) {
        log.success(`Script "${script}" configured`);
      } else {
        log.warning(`Script "${script}" missing`);
      }
    });
    
    requiredDevDeps.forEach(dep => {
      if (pkg.devDependencies?.[dep]) {
        log.success(`Dependency "${dep}" installed`);
      } else {
        log.warning(`Dependency "${dep}" missing`);
      }
    });
    
  } catch (error) {
    log.error(`Failed to validate package.json: ${error.message}`);
  }
}

async function validateOptimizedImageComponent() {
  log.title('Validating OptimizedImage Component');
  
  const componentPath = path.join(__dirname, '..', 'src/components/OptimizedImage.jsx');
  try {
    const content = await fs.readFile(componentPath, 'utf-8');
    
    const checks = [
      { pattern: /<picture>/, desc: 'Picture element for modern formats' },
      { pattern: /generateAvifSrcSet/, desc: 'AVIF format support' },
      { pattern: /generateModernSrcSet/, desc: 'WebP format support' },
      { pattern: /IntersectionObserver/, desc: 'Lazy loading with Intersection Observer' },
      { pattern: /loading={effectiveLoading}/, desc: 'Native lazy loading attribute' }
    ];
    
    checks.forEach(check => {
      if (check.pattern.test(content)) {
        log.success(check.desc);
      } else {
        log.warning(`${check.desc} - not implemented`);
      }
    });
    
  } catch (error) {
    log.error(`Failed to validate OptimizedImage component: ${error.message}`);
  }
}

async function validateImageCacheHook() {
  log.title('Validating Image Cache Hook');
  
  const hookPath = path.join(__dirname, '..', 'src/hooks/useImageCache.js');
  try {
    const content = await fs.readFile(hookPath, 'utf-8');
    
    const checks = [
      { pattern: /imageCache = new Map/, desc: 'In-memory cache implementation' },
      { pattern: /addCacheBuster/, desc: 'Cache busting for Imgur images' },
      { pattern: /preloadImage/, desc: 'Image preloading functionality' },
      { pattern: /fallbackSrc/, desc: 'Fallback image support' },
      { pattern: /useImagePreloader/, desc: 'Batch image preloading hook' }
    ];
    
    checks.forEach(check => {
      if (check.pattern.test(content)) {
        log.success(check.desc);
      } else {
        log.warning(`${check.desc} - not implemented`);
      }
    });
    
  } catch (error) {
    log.error(`Failed to validate useImageCache hook: ${error.message}`);
  }
}

async function validateIndexHtml() {
  log.title('Validating Index.html Preloads');
  
  const indexPath = path.join(__dirname, '..', 'index.html');
  try {
    const content = await fs.readFile(indexPath, 'utf-8');
    
    const checks = [
      { pattern: /rel="preconnect".*imgur/, desc: 'Preconnect to Imgur CDN' },
      { pattern: /rel="preload".*image/, desc: 'Critical image preloading' },
      { pattern: /rel="dns-prefetch"/, desc: 'DNS prefetching configured' },
      { pattern: /theme-color/, desc: 'Theme color for PWA' }
    ];
    
    checks.forEach(check => {
      if (check.pattern.test(content)) {
        log.success(check.desc);
      } else {
        log.warning(`${check.desc} - not configured`);
      }
    });
    
  } catch (error) {
    log.error(`Failed to validate index.html: ${error.message}`);
  }
}

async function generateCacheReport() {
  log.title('Cache Strategy Implementation Report');
  
  const files = [
    { path: 'vite.config.js', desc: 'Vite Configuration' },
    { path: 'vercel.json', desc: 'Vercel Headers' },
    { path: 'workbox-config.js', desc: 'Service Worker Config' },
    { path: 'lighthouserc.js', desc: 'Lighthouse CI Config' },
    { path: '.github/workflows/lighthouse-ci.yml', desc: 'GitHub Actions' },
    { path: 'src/components/OptimizedImage.jsx', desc: 'Image Component' },
    { path: 'src/hooks/useImageCache.js', desc: 'Cache Hook' },
    { path: 'scripts/optimize-images-modern.js', desc: 'Image Optimization' },
    { path: 'CACHING_STRATEGY.md', desc: 'Documentation' }
  ];
  
  let implementedCount = 0;
  
  for (const file of files) {
    const exists = await checkFileExists(file.path, file.desc);
    if (exists) implementedCount++;
  }
  
  const completionPercentage = Math.round((implementedCount / files.length) * 100);
  
  console.log('\n' + '='.repeat(50));
  log.info(`Implementation Status: ${implementedCount}/${files.length} files (${completionPercentage}%)`);
  
  if (completionPercentage >= 90) {
    log.success('Cache strategy implementation is COMPLETE! 🎉');
  } else if (completionPercentage >= 70) {
    log.warning('Cache strategy implementation is MOSTLY COMPLETE');
  } else {
    log.error('Cache strategy implementation is INCOMPLETE');
  }
  
  console.log('\n📋 Next Steps:');
  console.log('1. Run: npm run build:pwa');
  console.log('2. Test: npm run lighthouse:ci');
  console.log('3. Deploy and validate cache headers');
  console.log('4. Monitor Core Web Vitals');
  console.log('\n📚 Documentation: CACHING_STRATEGY.md');
}

async function main() {
  console.log(`${colors.bold}${colors.blue}🚀 Cache Strategy Validation${colors.reset}\n`);
  
  await validateViteConfig();
  await validateVercelConfig();
  await validatePackageJson();
  await validateOptimizedImageComponent();
  await validateImageCacheHook();
  await validateIndexHtml();
  await generateCacheReport();
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error);
}
