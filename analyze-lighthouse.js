import fs from 'fs';

try {
  const report = JSON.parse(fs.readFileSync('./lighthouse-report.json', 'utf8'));
  
  console.log('🚀 LIGHTHOUSE PERFORMANCE ANALYSIS');
  console.log('=====================================\n');
  
  // Performance Score
  const perfScore = report.categories?.performance?.score;
  console.log(`📊 Performance Score: ${perfScore ? Math.round(perfScore * 100) : 'N/A'}/100`);
  
  // Core Web Vitals
  console.log('\n🎯 Core Web Vitals:');
  console.log(`   FCP (First Contentful Paint): ${report.audits?.['first-contentful-paint']?.displayValue || 'N/A'}`);
  console.log(`   LCP (Largest Contentful Paint): ${report.audits?.['largest-contentful-paint']?.displayValue || 'N/A'}`);
  console.log(`   CLS (Cumulative Layout Shift): ${report.audits?.['cumulative-layout-shift']?.displayValue || 'N/A'}`);
  console.log(`   Speed Index: ${report.audits?.['speed-index']?.displayValue || 'N/A'}`);
  console.log(`   Total Blocking Time: ${report.audits?.['total-blocking-time']?.displayValue || 'N/A'}`);
  
  // Other Scores
  console.log('\n📋 Other Scores:');
  console.log(`   Accessibility: ${report.categories?.accessibility?.score ? Math.round(report.categories.accessibility.score * 100) : 'N/A'}/100`);
  console.log(`   Best Practices: ${report.categories?.['best-practices']?.score ? Math.round(report.categories['best-practices'].score * 100) : 'N/A'}/100`);
  console.log(`   SEO: ${report.categories?.seo?.score ? Math.round(report.categories.seo.score * 100) : 'N/A'}/100`);
  
  // Key Opportunities
  console.log('\n💡 Key Opportunities:');
  const opportunities = report.audits || {};
  
  if (opportunities['unused-css-rules']?.score < 1) {
    console.log(`   ⚠️  Remove unused CSS: ${opportunities['unused-css-rules'].displayValue || 'Available'}`);
  }
  
  if (opportunities['render-blocking-resources']?.score < 1) {
    console.log(`   ⚠️  Eliminate render-blocking resources: ${opportunities['render-blocking-resources'].displayValue || 'Available'}`);
  }
  
  if (opportunities['unused-javascript']?.score < 1) {
    console.log(`   ⚠️  Remove unused JavaScript: ${opportunities['unused-javascript'].displayValue || 'Available'}`);
  }
  
  if (opportunities['modern-image-formats']?.score < 1) {
    console.log(`   ⚠️  Serve images in next-gen formats: ${opportunities['modern-image-formats'].displayValue || 'Available'}`);
  }
  
  if (opportunities['efficient-animated-content']?.score < 1) {
    console.log(`   ⚠️  Use video formats for animated content: ${opportunities['efficient-animated-content'].displayValue || 'Available'}`);
  }
  
  // Resource Summary
  console.log('\n📦 Resource Summary:');
  const resourceSummary = report.audits?.['resource-summary'];
  if (resourceSummary?.details?.items) {
    resourceSummary.details.items.forEach(item => {
      console.log(`   ${item.resourceType}: ${item.requestCount} requests, ${Math.round(item.size/1024)}KB`);
    });
  }
  
  console.log('\n=====================================');
  
} catch (error) {
  console.error('Error reading lighthouse report:', error.message);
}
