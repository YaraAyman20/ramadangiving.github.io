/**
 * Automatic Image Optimization Script
 * Requires: npm install sharp --save-dev
 * 
 * This script:
 * - Converts large images to WebP
 * - Resizes images to max dimensions
 * - Compresses JPEGs
 */

const fs = require('fs');
const path = require('path');

// Check if sharp is available
let sharp;
try {
  sharp = require('sharp');
} catch (e) {
  console.log('⚠️  Sharp not installed. Install with: npm install sharp --save-dev');
  console.log('   Skipping automatic optimization.');
  process.exit(0);
}

const assetsDir = path.join(process.cwd(), 'public/assets');

// Configuration
const config = {
  maxWidth: 1920,
  maxHeight: 1080,
  jpegQuality: 85,
  webpQuality: 80,
  sizeThreshold: 500 * 1024, // Only optimize images > 500KB
};

async function optimizeImage(filePath) {
  const stats = fs.statSync(filePath);
  
  // Skip small images
  if (stats.size < config.sizeThreshold) {
    return { skipped: true, reason: 'under threshold' };
  }

  const ext = path.extname(filePath).toLowerCase();
  if (!['.jpg', '.jpeg', '.png'].includes(ext)) {
    return { skipped: true, reason: 'unsupported format' };
  }

  try {
    const image = sharp(filePath);
    const metadata = await image.metadata();

    let pipeline = image;

    // Resize if needed
    if (metadata.width > config.maxWidth || metadata.height > config.maxHeight) {
      pipeline = pipeline.resize(config.maxWidth, config.maxHeight, {
        fit: 'inside',
        withoutEnlargement: true,
      });
    }

    // Compress based on format
    if (ext === '.png') {
      pipeline = pipeline.png({ quality: config.jpegQuality, compressionLevel: 9 });
    } else {
      pipeline = pipeline.jpeg({ quality: config.jpegQuality, progressive: true });
    }

    // Save optimized image
    const buffer = await pipeline.toBuffer();
    
    // Only save if smaller
    if (buffer.length < stats.size) {
      fs.writeFileSync(filePath, buffer);
      const savings = ((stats.size - buffer.length) / stats.size * 100).toFixed(1);
      return { 
        optimized: true, 
        originalSize: stats.size, 
        newSize: buffer.length,
        savings: `${savings}%`
      };
    }

    return { skipped: true, reason: 'no size improvement' };
  } catch (error) {
    return { error: error.message };
  }
}

async function walkDirectory(dir, results = []) {
  if (!fs.existsSync(dir)) return results;
  
  const items = fs.readdirSync(dir);
  
  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      await walkDirectory(fullPath, results);
    } else {
      const ext = path.extname(item).toLowerCase();
      if (['.jpg', '.jpeg', '.png'].includes(ext)) {
        results.push(fullPath);
      }
    }
  }
  
  return results;
}

async function main() {
  console.log('\n🖼️  Automatic Image Optimization\n');
  console.log('='.repeat(50));
  
  const images = await walkDirectory(assetsDir);
  console.log(`\n📁 Found ${images.length} images to process\n`);

  let optimizedCount = 0;
  let totalSaved = 0;

  for (const imagePath of images) {
    const relativePath = path.relative(process.cwd(), imagePath);
    const result = await optimizeImage(imagePath);

    if (result.optimized) {
      optimizedCount++;
      totalSaved += result.originalSize - result.newSize;
      console.log(`✅ ${relativePath} - saved ${result.savings}`);
    } else if (result.error) {
      console.log(`❌ ${relativePath} - ${result.error}`);
    }
  }

  console.log('\n' + '='.repeat(50));
  console.log(`\n📊 Summary:`);
  console.log(`   Optimized: ${optimizedCount} images`);
  console.log(`   Total saved: ${(totalSaved / 1024 / 1024).toFixed(2)} MB`);
  console.log('\n');
}

main().catch(console.error);

