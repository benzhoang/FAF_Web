import fs from 'fs';
import path from 'path';

const walkSync = (dir, filelist = []) => {
  fs.readdirSync(dir).forEach(file => {
    const dirFile = path.join(dir, file);
    try {
      filelist = walkSync(dirFile, filelist);
    } catch (err) {
      if (err.code === 'ENOTDIR' || err.code === 'EBADF') filelist.push(dirFile);
    }
  });
  return filelist;
};

const files = walkSync('src/pages').concat(walkSync('src/components'));

let totalReplaced = 0;

files.forEach(file => {
  if (!file.endsWith('.jsx')) return;
  let content = fs.readFileSync(file, 'utf8');
  const original = content;

  // 1. Remove background colors that obscure global background
  content = content.replace(/bg-\[#020617\]/g, 'bg-transparent');
  content = content.replace(/style=\{\{\s*background:\s*['"]#020617['"]\s*\}\}/g, '');
  content = content.replace(/style=\{\{\s*background:\s*['"]#020617['"],\s*([^}]+)\}\}/g, 'style={{ $1 }}');

  // 2. Remove scanlines (self closing)
  content = content.replace(/\s*\{\/\*.*?\*\/\}\s*<div className="fixed inset-0 pointer-events-none z-0"[^>]+repeating-linear-gradient[^>]+\/>/g, '');
  content = content.replace(/\s*<div className="fixed inset-0 pointer-events-none z-0"[^>]+repeating-linear-gradient[^>]+\/>/g, '');

  // 3. Remove glow orbs (with inner self-closing divs)
  content = content.replace(/\s*\{\/\*.*?\*\/\}\s*<div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">[\s\S]*?<\/div>/g, '');
  content = content.replace(/\s*<div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">[\s\S]*?<\/div>/g, '');

  // 4. Remove MatrixCanvas and ParticleNet from HomePage (will be globalized)
  if (file.includes('HomePage.jsx')) {
     content = content.replace(/<MatrixCanvas \/>/g, '');
     content = content.replace(/<ParticleNet \/>/g, '');
  }

  if (content !== original) {
    fs.writeFileSync(file, content, 'utf8');
    console.log('Modified:', file);
    totalReplaced++;
  }
});

console.log('Total files modified:', totalReplaced);
