import sharp from 'sharp';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const svgPath = join(__dirname, '../public/og-image.svg');
const outputPath = join(__dirname, '../public/og-image.png');

const svgBuffer = readFileSync(svgPath);

sharp(svgBuffer)
  .png()
  .toFile(outputPath, (err, info) => {
    if (err) {
      console.error('Error generating image:', err);
      process.exit(1);
    }
    console.log('✓ og-image.png regenerated successfully');
    console.log(`  Size: ${Math.round(info.size / 1024)}kb`);
  });
