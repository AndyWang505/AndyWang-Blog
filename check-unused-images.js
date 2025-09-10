import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

// 獲取所有圖片檔案
const publicDir = './public';
const srcDir = './src';
const rootFiles = ['.', './README.md', './astro.config.mjs'];

const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'];
const allImages = [];

function findImages(dir, basePath = '') {
  const files = fs.readdirSync(dir);
  
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      findImages(fullPath, path.join(basePath, file));
    } else {
      const ext = path.extname(file).toLowerCase();
      if (imageExtensions.includes(ext)) {
        const relativePath = path.join(basePath, file);
        allImages.push(relativePath);
      }
    }
  }
}

findImages(publicDir);

console.log(`找到 ${allImages.length} 個圖片檔案:`);
allImages.forEach(img => console.log(`  ${img}`));

console.log('\n檢查使用情況...');

const unusedImages = [];

for (const image of allImages) {
  // 檢查不同的路徑格式
  const imageName = path.basename(image);
  const imageWithoutExt = path.basename(image, path.extname(image));
  const relativePath = image.replace(/\\/g, '/');
  
  let isUsed = false;
  
  // 檢查各種可能的引用格式
  const searchPatterns = [
    imageName,
    imageWithoutExt,
    relativePath,
    '/' + relativePath,
    '/public/' + relativePath,
    image.replace(/\\/g, '/')
  ];
  
  for (const pattern of searchPatterns) {
    try {
      // 在 src 目錄中搜索
      const srcResult = execSync(`grep -r "${pattern}" src/ --include="*.astro" --include="*.tsx" --include="*.ts" --include="*.js" --include="*.md" --include="*.css"`, { encoding: 'utf-8', stdio: 'pipe' });
      if (srcResult.trim()) {
        isUsed = true;
        break;
      }
    } catch (e) {
      // grep 沒找到結果時會拋出錯誤，這是正常的
    }
    
    try {
      // 在根目錄文件中搜索
      const rootResult = execSync(`grep -r "${pattern}" . --include="*.md" --include="*.mjs" --exclude-dir=node_modules --exclude-dir=.git --exclude-dir=dist --max-depth=1`, { encoding: 'utf-8', stdio: 'pipe' });
      if (rootResult.trim()) {
        isUsed = true;
        break;
      }
    } catch (e) {
      // grep 沒找到結果時會拋出錯誤，這是正常的
    }
  }
  
  if (!isUsed) {
    unusedImages.push(image);
  }
}

if (unusedImages.length > 0) {
  console.log(`\n發現 ${unusedImages.length} 個可能未使用的圖片:`);
  unusedImages.forEach(img => console.log(`  ❌ ${img}`));
  
  console.log('\n這些檔案可能可以刪除。建議手動確認後再刪除。');
} else {
  console.log('\n✅ 所有圖片都有被使用！');
}