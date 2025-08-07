/**
 * Performance Diagnostic Script for Node.js
 * Analyzes project files and identifies performance bottlenecks
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

// Performance diagnostic for Node.js
const performanceDiagnostic = {
  results: {
    totalSize: 0,
    largeFiles: [],
    imageFiles: [],
    jsFiles: [],
    cssFiles: [],
    recommendations: []
  },

  // Initialize diagnostic
  async init() {
    console.log('🔍 Starting Performance Diagnostic...\n');
    
    try {
      await this.analyzeProject();
      this.generateRecommendations();
      this.generateReport();
    } catch (error) {
      console.error('❌ Error during diagnostic:', error.message);
    }
  },

  // Analyze project files
  async analyzeProject() {
    console.log('📁 Analyzing project files...');
    
    // Analyze different directories
    await this.analyzeDirectory(path.join(projectRoot, 'src'), 'Source files');
    await this.analyzeDirectory(path.join(projectRoot, 'public'), 'Public assets');
    await this.analyzeDirectory(path.join(projectRoot, 'dist'), 'Build output', true);
  },

  // Analyze a directory
  async analyzeDirectory(dirPath, label, optional = false) {
    if (!fs.existsSync(dirPath)) {
      if (!optional) {
        console.log(`⚠️  ${label} directory not found: ${dirPath}`);
      }
      return;
    }

    console.log(`\n📂 Analyzing ${label}...`);
    
    const files = this.getAllFiles(dirPath);
    
    for (const file of files) {
      const stats = fs.statSync(file);
      const size = stats.size;
      const ext = path.extname(file).toLowerCase();
      const relativePath = path.relative(projectRoot, file);
      
      this.results.totalSize += size;
      
      // Categorize files
      if (size > 1024 * 1024) { // Files > 1MB
        this.results.largeFiles.push({
          path: relativePath,
          size: this.formatSize(size),
          sizeBytes: size
        });
      }
      
      if (['.jpg', '.jpeg', '.png', '.gif', '.webp', '.avif'].includes(ext)) {
        this.results.imageFiles.push({
          path: relativePath,
          size: this.formatSize(size),
          sizeBytes: size
        });
      }
      
      if (['.js', '.jsx', '.ts', '.tsx'].includes(ext)) {
        this.results.jsFiles.push({
          path: relativePath,
          size: this.formatSize(size),
          sizeBytes: size
        });
      }
      
      if (['.css', '.scss', '.sass'].includes(ext)) {
        this.results.cssFiles.push({
          path: relativePath,
          size: this.formatSize(size),
          sizeBytes: size
        });
      }
    }
  },

  // Get all files recursively
  getAllFiles(dirPath) {
    let files = [];
    
    const items = fs.readdirSync(dirPath);
    
    for (const item of items) {
      const fullPath = path.join(dirPath, item);
      const stats = fs.statSync(fullPath);
      
      if (stats.isDirectory()) {
        // Skip node_modules and .git
        if (!['node_modules', '.git', '.next', 'dist'].includes(item)) {
          files = files.concat(this.getAllFiles(fullPath));
        }
      } else {
        files.push(fullPath);
      }
    }
    
    return files;
  },

  // Generate recommendations
  generateRecommendations() {
    console.log('\n🔍 Generating recommendations...');
    
    // Large files recommendations
    if (this.results.largeFiles.length > 0) {
      this.results.recommendations.push({
        type: 'Large Files',
        priority: 'High',
        message: `Found ${this.results.largeFiles.length} files larger than 1MB`,
        action: 'Consider optimizing or lazy loading these files'
      });
    }
    
    // Image optimization recommendations
    const largeImages = this.results.imageFiles.filter(img => img.sizeBytes > 500 * 1024);
    if (largeImages.length > 0) {
      this.results.recommendations.push({
        type: 'Image Optimization',
        priority: 'High',
        message: `Found ${largeImages.length} images larger than 500KB`,
        action: 'Convert to WebP/AVIF and use responsive images'
      });
    }
    
    // JavaScript bundle recommendations
    const largeJsFiles = this.results.jsFiles.filter(js => js.sizeBytes > 100 * 1024);
    if (largeJsFiles.length > 0) {
      this.results.recommendations.push({
        type: 'JavaScript Bundle',
        priority: 'Medium',
        message: `Found ${largeJsFiles.length} JS files larger than 100KB`,
        action: 'Consider code splitting and tree shaking'
      });
    }
    
    // Total size recommendation
    if (this.results.totalSize > 50 * 1024 * 1024) {
      this.results.recommendations.push({
        type: 'Total Size',
        priority: 'Medium',
        message: `Total project size: ${this.formatSize(this.results.totalSize)}`,
        action: 'Consider using CDN and asset optimization'
      });
    }
  },

  // Generate final report
  generateReport() {
    console.log('\n' + '='.repeat(60));
    console.log('📊 PERFORMANCE DIAGNOSTIC REPORT');
    console.log('='.repeat(60));
    
    // Summary
    console.log('\n📈 SUMMARY:');
    console.log(`Total project size: ${this.formatSize(this.results.totalSize)}`);
    console.log(`Large files (>1MB): ${this.results.largeFiles.length}`);
    console.log(`Image files: ${this.results.imageFiles.length}`);
    console.log(`JavaScript files: ${this.results.jsFiles.length}`);
    console.log(`CSS files: ${this.results.cssFiles.length}`);
    
    // Large files
    if (this.results.largeFiles.length > 0) {
      console.log('\n🚨 LARGE FILES (>1MB):');
      this.results.largeFiles
        .sort((a, b) => b.sizeBytes - a.sizeBytes)
        .slice(0, 10)
        .forEach(file => {
          console.log(`  ${file.size.padStart(8)} - ${file.path}`);
        });
    }
    
    // Large images
    const largeImages = this.results.imageFiles.filter(img => img.sizeBytes > 500 * 1024);
    if (largeImages.length > 0) {
      console.log('\n🖼️  LARGE IMAGES (>500KB):');
      largeImages
        .sort((a, b) => b.sizeBytes - a.sizeBytes)
        .slice(0, 10)
        .forEach(img => {
          console.log(`  ${img.size.padStart(8)} - ${img.path}`);
        });
    }
    
    // Recommendations
    console.log('\n💡 RECOMMENDATIONS:');
    if (this.results.recommendations.length === 0) {
      console.log('  ✅ No major performance issues detected!');
    } else {
      this.results.recommendations.forEach((rec, index) => {
        const priority = rec.priority === 'High' ? '🔴' : rec.priority === 'Medium' ? '🟡' : '🟢';
        console.log(`  ${priority} ${rec.type}:`);
        console.log(`     ${rec.message}`);
        console.log(`     Action: ${rec.action}\n`);
      });
    }
    
    // Next steps
    console.log('\n🚀 NEXT STEPS:');
    console.log('  1. Run "npm run optimize-media" to optimize images');
    console.log('  2. Use "npm run build" to create optimized production build');
    console.log('  3. Consider implementing lazy loading for large assets');
    console.log('  4. Use CDN for static assets in production');
    
    console.log('\n' + '='.repeat(60));
    console.log('✅ Diagnostic complete!');
  },

  // Format file size
  formatSize(bytes) {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  }
};

// Run diagnostic
performanceDiagnostic.init();
