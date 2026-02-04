#!/usr/bin/env bun
/**
 * Image Optimization Script using Sharp
 * Converts images to WebP and AVIF formats with optimal quality settings
 */
import sharp from 'sharp';

const conversions = [
  // hero-ship.png
  {
    input: 'src/assets/hero-ship.png',
    outputs: [
      { path: 'src/assets/hero-ship.webp', format: 'webp', quality: 80, width: 671, height: 480 },
      { path: 'src/assets/hero-ship.avif', format: 'avif', quality: 70, width: 671, height: 480 },
    ],
  },
  // about-what-wedo.jpg - responsive sizes
  {
    input: 'src/assets/about-what-wedo.jpg',
    outputs: [
      { path: 'src/assets/about-what-wedo-476.webp', format: 'webp', quality: 75, width: 476 },
      { path: 'src/assets/about-what-wedo-800.webp', format: 'webp', quality: 75, width: 800 },
      { path: 'src/assets/about-what-wedo-476.avif', format: 'avif', quality: 65, width: 476 },
      { path: 'src/assets/about-what-wedo-800.avif', format: 'avif', quality: 65, width: 800 },
    ],
  },
  // hero.png
  {
    input: 'src/assets/hero.png',
    outputs: [
      { path: 'src/assets/hero.webp', format: 'webp', quality: 80 },
      { path: 'src/assets/hero.avif', format: 'avif', quality: 70 },
    ],
  },
  // hero-alt.png
  {
    input: 'src/assets/hero-alt.png',
    outputs: [
      { path: 'src/assets/hero-alt.webp', format: 'webp', quality: 80 },
      { path: 'src/assets/hero-alt.avif', format: 'avif', quality: 70 },
    ],
  },
];

async function optimizeImages() {
  console.log('🖼️  Starting image optimization...\n');

  for (const { input, outputs } of conversions) {
    console.log(`📥 Processing: ${input}`);

    for (const { path, format, quality, width, height } of outputs) {
      try {
        let pipeline = sharp(input);

        // Apply resize if dimensions specified
        if (width || height) {
          pipeline = pipeline.resize({ width, height });
        }

        // Apply format-specific options
        if (format === 'webp') {
          await pipeline.webp({ quality }).toFile(path);
        } else if (format === 'avif') {
          await pipeline.avif({ quality }).toFile(path);
        }

        const fileStats = await Bun.file(path);
        const stats = fileStats.size;
        console.log(`  ✅ ${path} (${Math.round(stats / 1024)}KB)`);
      } catch (error) {
        console.error(`  ❌ Failed to convert ${path}:`, error.message);
      }
    }

    console.log('');
  }

  console.log('✨ Image optimization complete!');
}

// Run optimization
optimizeImages().catch(console.error);
