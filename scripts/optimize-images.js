/**
 * Image Optimization Script
 * Analyzes and provides recommendations for image optimization
 * 
 * Run: node scripts/optimize-images.js
 * 
 * For actual optimization, install sharp:
 * npm install sharp --save-dev
 */

const fs = require('fs');
const path = require('path');

const publicDir = path.join(process.cwd(), 'public');
const assetsDir = path.join(publicDir, 'assets');

// Image extensions to check
const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'];

// Size thresholds (in bytes)
const SIZE_WARNING = 100 * 1024;  // 100KB
const SIZE_ERROR = 500 * 1024;    // 500KB

function formatBytes(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function scanDirectory(dir, results = { total: 0, totalSize: 0, large: [], recommendations: [] }) {
  if (!fs.existsSync(dir)) return results;
  
  const items = fs.readdirSync(dir);
  
  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      scanDirectory(fullPath, results);
    } else {
      const ext = path.extname(item).toLowerCase();
      if (imageExtensions.includes(ext)) {
        results.total++;
        results.totalSize += stat.size;
        
        const relativePath = path.relative(publicDir, fullPath);
        
        if (stat.size > SIZE_ERROR) {
          results.large.push({
            path: relativePath,
            size: stat.size,
            status: 'error',
          });
        } else if (stat.size > SIZE_WARNING) {
          results.large.push({
            path: relativePath,
            size: stat.size,
            status: 'warning',
          });
        }
        
        // Check for non-optimized formats
        if (ext === '.png' && stat.size > 50 * 1024) {
          results.recommendations.push({
            path: relativePath,
            message: 'Consider converting to WebP or JPEG for smaller size',
          });
        }
        
        if ((ext === '.jpg' || ext === '.jpeg') && stat.size > SIZE_WARNING) {
          results.recommendations.push({
            path: relativePath,
            message: 'Consider compressing or resizing this image',
          });
        }
      }
    }
  }
  
  return results;
}

function analyzeImages() {
  console.log('\n🖼️  Image Optimization Analysis\n');
  console.log('='.repeat(50));
  
  const results = scanDirectory(assetsDir);
  
  // Summary
  console.log('\n📊 Summary:');
  console.log(`   Total images: ${results.total}`);
  console.log(`   Total size: ${formatBytes(results.totalSize)}`);
  console.log(`   Average size: ${formatBytes(results.totalSize / results.total || 0)}`);
  
  // Large files
  if (results.large.length > 0) {
    console.log('\n⚠️  Large Images (need optimization):');
    results.large
      .sort((a, b) => b.size - a.size)
      .slice(0, 20)
      .forEach(img => {
        const icon = img.status === 'error' ? '🔴' : '🟡';
        console.log(`   ${icon} ${formatBytes(img.size).padStart(10)} - ${img.path}`);
      });
    
    if (results.large.length > 20) {
      console.log(`   ... and ${results.large.length - 20} more`);
    }
  }
  
  // Recommendations
  if (results.recommendations.length > 0) {
    console.log('\n💡 Recommendations:');
    const uniqueRecs = [...new Set(results.recommendations.map(r => r.message))];
    uniqueRecs.forEach(rec => {
      const count = results.recommendations.filter(r => r.message === rec).length;
      console.log(`   • ${rec} (${count} images)`);
    });
  }
  
  // Optimization tips
  console.log('\n🚀 Optimization Tips:');
  console.log('   1. Use WebP format for better compression (30-50% smaller)');
  console.log('   2. Resize images to their display dimensions');
  console.log('   3. Use responsive images with srcset');
  console.log('   4. Lazy load images below the fold');
  console.log('   5. Consider using a CDN for images');
  
  console.log('\n📦 To optimize images automatically, you can:');
  console.log('   • Use https://squoosh.app for manual optimization');
  console.log('   • Install sharp: npm install sharp --save-dev');
  console.log('   • Use an image CDN like Cloudinary or imgix');
  
  console.log('\n' + '='.repeat(50) + '\n');
  
  return results;
}

analyzeImages();

