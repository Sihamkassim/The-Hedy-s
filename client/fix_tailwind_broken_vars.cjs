
const fs = require('fs');
const glob = require('fs');
const path = require('path');

function fixFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let original = content;

  // fix broken tailwind classes
  content = content.replace(/text-var\(--base-bg\)/g, 'text-primary-inverse');
  content = content.replace(/bg-var\(--base-bg\)/g, 'bg-base-bg');
  
  // fix bad gradients which cause unreadable headers
  // we want primary headers so they contrast with primary-inverse
  content = content.replace(/linear-gradient\([^,]+,\s*var\(--base-text\),\s*var\(--primary\)\)/g, 'linear-gradient(135deg, var(--primary), var(--secondary))');

  // Fix other instances of text-var(--base-bg)/XX using a style or standard tailwind
  content = content.replace(/text-primary-inverse\/(\d+)/g, (match, p1) => {
     let percent = parseInt(p1);
     if(percent === 50) return 'text-primary-inverse opacity-50';
     if(percent === 60) return 'text-primary-inverse opacity-60';
     if(percent === 70) return 'text-primary-inverse opacity-70';
     if(percent === 80) return 'text-primary-inverse opacity-80';
     return 'text-primary-inverse opacity-' + percent;
  });

  if (content !== original) {
    fs.writeFileSync(filePath, content);
    console.log('Fixed ' + filePath);
  }
}

function walkDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      walkDir(fullPath);
    } else if (fullPath.endsWith('.jsx')) {
      fixFile(fullPath);
    }
  }
}

walkDir('./src/pages');
walkDir('./src/components');

