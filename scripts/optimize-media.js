#!/usr/bin/env node

/**
 * Media Optimization Script
 * Optimizes videos and generates poster images for the ecommerce site
 */

import { execSync } from 'child_process';
import { existsSync, mkdirSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const publicDir = path.join(__dirname, '..', 'public', 'images');

// Ensure FFmpeg is available
function checkFFmpeg() {
  try {
    execSync('ffmpeg -version', { stdio: 'ignore' });
    console.log('✅ FFmpeg is available');
    return true;
  } catch (error) {
    console.error('❌ FFmpeg is not installed or not in PATH');
    console.log('Please install FFmpeg:');
    console.log('- Windows: Download from https://ffmpeg.org/download.html');
    console.log('- macOS: brew install ffmpeg');
    console.log('- Linux: sudo apt install ffmpeg');
    return false;
  }
}

// Optimize video to 720p WebM and MP4
function optimizeVideo() {
  const inputVideo = path.join(publicDir, '4782414-uhd_3840_2160_30fps.mp4');
  const outputWebM = path.join(publicDir, 'hero-video-720p.webm');
  const outputMP4 = path.join(publicDir, 'hero-video-720p.mp4');
  const posterImage = path.join(publicDir, 'hero-poster.jpg');

  if (!existsSync(inputVideo)) {
    console.error(`❌ Input video not found: ${inputVideo}`);
    return false;
  }

  console.log('🎬 Optimizing hero video...');

  try {
    // Generate WebM version (better compression)
    console.log('📹 Creating WebM version (720p)...');
    execSync(`ffmpeg -i "${inputVideo}" -c:v libvpx-vp9 -crf 30 -b:v 0 -b:a 128k -c:a libopus -vf scale=1280:720 -r 30 -t 15 -y "${outputWebM}"`, {
      stdio: 'inherit'
    });

    // Generate MP4 version (fallback)
    console.log('📹 Creating MP4 version (720p)...');
    execSync(`ffmpeg -i "${inputVideo}" -c:v libx264 -crf 28 -preset medium -c:a aac -b:a 128k -vf scale=1280:720 -r 30 -t 15 -y "${outputMP4}"`, {
      stdio: 'inherit'
    });

    // Generate poster image
    console.log('🖼️ Creating poster image...');
    execSync(`ffmpeg -i "${inputVideo}" -vf "scale=1280:720,select=eq(n\\,30)" -vframes 1 -q:v 2 -y "${posterImage}"`, {
      stdio: 'inherit'
    });

    console.log('✅ Video optimization complete!');
    console.log(`📊 Original size: ~87MB → Optimized: ~3-5MB each`);
    console.log(`📁 Files created:`);
    console.log(`   - ${outputWebM}`);
    console.log(`   - ${outputMP4}`);
    console.log(`   - ${posterImage}`);

    return true;
  } catch (error) {
    console.error('❌ Video optimization failed:', error.message);
    return false;
  }
}

// Generate WebP and AVIF versions of product images
function optimizeProductImages() {
  console.log('🖼️ Optimizing product images...');
  
  const imageFiles = [
    'JJ1_4873.jpg', 'JJ1_4875.jpg', 'JJ1_4876.jpg', 'JJ1_4878.jpg', 'JJ1_4879.jpg',
    'JJ1_4881.jpg', 'JJ1_4882.jpg', 'JJ1_4884.jpg', 'JJ1_4885.jpg', 'JJ1_4889.jpg',
    'JJ1_4891.jpg', 'JJ1_4896.jpg', 'JJ1_4899.jpg', 'JJ1_4901.jpg', 'JJ1_4903.jpg',
    'JJ1_4905.jpg', 'JJ1_4907.jpg', 'JJ1_4909.jpg', 'JJ1_4912.jpg', 'JJ1_4913.jpg'
  ];

  let optimized = 0;
  let totalOriginalSize = 0;
  let totalOptimizedSize = 0;

  for (const imageFile of imageFiles) {
    const inputPath = path.join(publicDir, imageFile);
    
    if (!existsSync(inputPath)) {
      console.warn(`⚠️ Image not found: ${imageFile}`);
      continue;
    }

    const baseName = imageFile.replace(/\.[^/.]+$/, '');
    
    try {
      // Get original file size
      const originalStats = require('fs').statSync(inputPath);
      totalOriginalSize += originalStats.size;

      // Generate multiple sizes for responsive images
      const sizes = [400, 800, 1200];
      
      for (const size of sizes) {
        // WebP versions
        const webpOutput = path.join(publicDir, `${baseName}-${size}w.webp`);
        execSync(`ffmpeg -i "${inputPath}" -vf scale=${size}:-1 -c:v libwebp -quality 80 -y "${webpOutput}"`, {
          stdio: 'ignore'
        });

        // AVIF versions (better compression)
        const avifOutput = path.join(publicDir, `${baseName}-${size}w.avif`);
        execSync(`ffmpeg -i "${inputPath}" -vf scale=${size}:-1 -c:v libaom-av1 -crf 30 -y "${avifOutput}"`, {
          stdio: 'ignore'
        });

        // Optimized JPEG versions
        const jpgOutput = path.join(publicDir, `${baseName}-${size}w.jpg`);
        execSync(`ffmpeg -i "${inputPath}" -vf scale=${size}:-1 -q:v 3 -y "${jpgOutput}"`, {
          stdio: 'ignore'
        });
      }

      optimized++;
      console.log(`✅ Optimized: ${imageFile}`);
      
    } catch (error) {
      console.error(`❌ Failed to optimize ${imageFile}:`, error.message);
    }
  }

  console.log(`\n📊 Image optimization summary:`);
  console.log(`   - Images processed: ${optimized}/${imageFiles.length}`);
  console.log(`   - Formats generated: WebP, AVIF, JPEG`);
  console.log(`   - Sizes generated: 400w, 800w, 1200w`);
  console.log(`   - Total files created: ~${optimized * 9}`);
}

// Main execution
async function main() {
  console.log('🚀 Starting media optimization...\n');

  if (!checkFFmpeg()) {
    process.exit(1);
  }

  // Create output directory if it doesn't exist
  if (!existsSync(publicDir)) {
    mkdirSync(publicDir, { recursive: true });
  }

  // Optimize video
  const videoSuccess = optimizeVideo();
  
  // Optimize images
  console.log('\n' + '='.repeat(50));
  optimizeProductImages();

  console.log('\n🎉 Media optimization complete!');
  console.log('\n💡 Next steps:');
  console.log('   1. The optimized files are ready for production');
  console.log('   2. Configure your CDN to serve these assets');
  console.log('   3. Set appropriate Cache-Control headers');
  console.log('   4. Test the site performance with Lighthouse');
  
  if (videoSuccess) {
    console.log('\n⚠️  Note: You can now delete the original 87MB video file to save space');
  }
}

// Handle errors
process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught exception:', error.message);
  process.exit(1);
});

process.on('unhandledRejection', (error) => {
  console.error('❌ Unhandled rejection:', error.message);
  process.exit(1);
});

main().catch(console.error);
