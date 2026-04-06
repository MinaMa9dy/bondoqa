import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import sharp from 'sharp';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PUBLIC_DIR = path.resolve(__dirname, '../public/images');
const WIDTHS = [320, 640, 1024];

function getFiles(dir, files = []) {
  if (!fs.existsSync(dir)) return files;
  
  const list = fs.readdirSync(dir);
  for (const file of list) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      getFiles(fullPath, files);
    } else {
      // Only process png and jpeg
      if (/\.(png|jpe?g)$/i.test(file)) {
        files.push(fullPath);
      }
    }
  }
  return files;
}

const originalImages = getFiles(PUBLIC_DIR);

const optimize = async () => {
    console.log(`Found ${originalImages.length} images to optimize.`);
    for (const imgPath of originalImages) {
        const parsed = path.parse(imgPath);
        
        try {
            const image = sharp(imgPath);
            const metadata = await image.metadata();
            
            // Check if vertical and needs rotation to horizontal
            let pipeline = image;
            const isBanner = parsed.dir.toLowerCase().includes('banner');
            
            if (metadata.height > metadata.width && !isBanner) {
                console.log(`Rotating vertical image to horizontal: ${parsed.base}`);
                pipeline = pipeline.rotate(90);
            }

            for (const width of WIDTHS) {
                const webpName = `${parsed.name}-${width}.webp`;
                const webpPath = path.join(parsed.dir, webpName);
                
                // Always regenerate if we changed rotation logic or just to be safe
                console.log(`Generating: ${webpName}`);
                await pipeline
                    .clone() // Clone to use same rotation for different widths
                    .resize(width)
                    .webp({ quality: 75 })
                    .toFile(webpPath);
            }
        } catch (e) {
            console.error(`Error processing ${imgPath}:`, e.message);
        }
    }
    console.log("Image optimization and rotation complete! 🚀");
};

optimize().catch(console.error);
