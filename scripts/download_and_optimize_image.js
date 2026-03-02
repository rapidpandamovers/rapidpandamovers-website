#!/usr/bin/env node
/**
 * Download and optimize images for blog posts
 * Usage: node scripts/download_and_optimize_image.js <url> <output_path> [width]
 */

const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const [,, url, outputPath, widthArg] = process.argv;
const width = parseInt(widthArg) || 1200;

if (!url || !outputPath) {
  console.error('Usage: node download_and_optimize_image.js <url> <output_path> [width]');
  process.exit(1);
}

// Create directory if it doesn't exist
const dir = path.dirname(outputPath);
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir, { recursive: true });
}

// Download image
const protocol = url.startsWith('https') ? https : http;
const tempPath = outputPath + '.tmp';

const download = (downloadUrl, redirectCount = 0) => {
  if (redirectCount > 5) {
    console.error('Too many redirects');
    process.exit(1);
  }

  protocol.get(downloadUrl, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
    }
  }, (response) => {
    // Handle redirects
    if (response.statusCode >= 300 && response.statusCode < 400 && response.headers.location) {
      download(response.headers.location, redirectCount + 1);
      return;
    }

    if (response.statusCode !== 200) {
      console.error(`HTTP ${response.statusCode}`);
      process.exit(1);
    }

    const file = fs.createWriteStream(tempPath);
    response.pipe(file);

    file.on('finish', async () => {
      file.close();

      try {
        // Get file extension from output path
        const ext = path.extname(outputPath).toLowerCase();

        // Process with sharp
        let sharpInstance = sharp(tempPath)
          .resize(width, null, { withoutEnlargement: true });

        if (ext === '.webp') {
          await sharpInstance.webp({ quality: 80 }).toFile(outputPath);
        } else if (ext === '.png') {
          await sharpInstance.png({ compressionLevel: 9 }).toFile(outputPath);
        } else {
          // Default to JPEG
          await sharpInstance.jpeg({ quality: 80, progressive: true }).toFile(outputPath);
        }

        // Clean up temp file
        fs.unlinkSync(tempPath);

        const stats = fs.statSync(outputPath);
        console.log(`Saved: ${outputPath} (${Math.round(stats.size / 1024)}KB)`);
      } catch (err) {
        console.error('Processing error:', err.message);
        // Clean up
        if (fs.existsSync(tempPath)) fs.unlinkSync(tempPath);
        process.exit(1);
      }
    });
  }).on('error', (err) => {
    console.error('Download error:', err.message);
    process.exit(1);
  });
};

download(url);
