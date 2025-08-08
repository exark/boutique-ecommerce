#!/usr/bin/env node

import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import sharp from 'sharp';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const INPUT_DIR = path.join(__dirname, '../public/images');
const OUTPUT_DIR = path.join(__dirname, '../public/images/optimized');

// Image optimization settings
const FORMATS = {
  webp: { quality: 80, effort: 6 },
  avif: { quality: 70, effort: 4 },
  jpeg: { quality: 85, progressive: true },
  png: { compressionLevel: 9, progressive: true }
};

const SIZES = [400, 800, 1200, 1600];

async function ensureDir(dir) {
  try {
    await fs.access(dir);
  } catch {
    await fs.mkdir(dir, { recursive: true });
  }
}

async function optimizeImage(inputPath, outputDir, filename) {
  const baseName = path.parse(filename).name;
  const ext = path.parse(filename).ext.toLowerCase();
  
  if (!['.jpg', '.jpeg', '.png'].includes(ext)) {
    console.log(`Skipping ${filename} - not a supported image format`);
    return;
  }

  console.log(`Optimizing ${filename}...`);
  
  try {
    const image = sharp(inputPath);
    const metadata = await image.metadata();
    
    // Generate different sizes and formats
    for (const size of SIZES) {
      // Skip if original is smaller than target size
      if (metadata.width && metadata.width < size) continue;
      
      const resizedImage = image.clone().resize(size, null, {
        withoutEnlargement: true,
        fit: 'inside'
      });
      
      // Generate WebP
      await resizedImage
        .webp(FORMATS.webp)
        .toFile(path.join(outputDir, `${baseName}-${size}w.webp`));
      
      // Generate AVIF (more efficient but newer format)
      try {
        await resizedImage
          .avif(FORMATS.avif)
          .toFile(path.join(outputDir, `${baseName}-${size}w.avif`));
      } catch (avifError) {
        console.warn(`AVIF generation failed for ${filename} at ${size}w:`, avifError.message);
      }
      
      // Generate optimized JPEG/PNG
      if (ext === '.png') {
        await resizedImage
          .png(FORMATS.png)
          .toFile(path.join(outputDir, `${baseName}-${size}w.png`));
      } else {
        await resizedImage
          .jpeg(FORMATS.jpeg)
          .toFile(path.join(outputDir, `${baseName}-${size}w.jpg`));
      }
    }
    
    // Generate original format optimized version
    if (ext === '.png') {
      await image.png(FORMATS.png)
        .toFile(path.join(outputDir, `${baseName}-optimized.png`));
    } else {
      await image.jpeg(FORMATS.jpeg)
        .toFile(path.join(outputDir, `${baseName}-optimized.jpg`));
    }
    
    console.log(`✅ Optimized ${filename}`);
    
  } catch (error) {
    console.error(`❌ Failed to optimize ${filename}:`, error.message);
  }
}

async function generateImageManifest(outputDir) {
  const files = await fs.readdir(outputDir);
  const manifest = {};
  
  files.forEach(file => {
    const match = file.match(/^(.+)-(\d+)w\.(webp|avif|jpg|jpeg|png)$/);
    if (match) {
      const [, baseName, size, format] = match;
      if (!manifest[baseName]) {
        manifest[baseName] = {};
      }
      if (!manifest[baseName][format]) {
        manifest[baseName][format] = [];
      }
      manifest[baseName][format].push({
        size: parseInt(size),
        url: `/images/optimized/${file}`
      });
    }
  });
  
  // Sort by size
  Object.keys(manifest).forEach(baseName => {
    Object.keys(manifest[baseName]).forEach(format => {
      manifest[baseName][format].sort((a, b) => a.size - b.size);
    });
  });
  
  await fs.writeFile(
    path.join(outputDir, 'manifest.json'),
    JSON.stringify(manifest, null, 2)
  );
  
  console.log('📋 Generated image manifest');
}

async function main() {
  try {
    console.log('🚀 Starting image optimization...');
    
    await ensureDir(OUTPUT_DIR);
    
    const files = await fs.readdir(INPUT_DIR);
    const imageFiles = files.filter(file => 
      ['.jpg', '.jpeg', '.png'].includes(path.extname(file).toLowerCase())
    );
    
    console.log(`Found ${imageFiles.length} images to optimize`);
    
    // Process images in parallel (but limit concurrency)
    const BATCH_SIZE = 3;
    for (let i = 0; i < imageFiles.length; i += BATCH_SIZE) {
      const batch = imageFiles.slice(i, i + BATCH_SIZE);
      await Promise.all(
        batch.map(file => 
          optimizeImage(
            path.join(INPUT_DIR, file),
            OUTPUT_DIR,
            file
          )
        )
      );
    }
    
    await generateImageManifest(OUTPUT_DIR);
    
    console.log('✅ Image optimization complete!');
    
  } catch (error) {
    console.error('❌ Optimization failed:', error);
    process.exit(1);
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}
