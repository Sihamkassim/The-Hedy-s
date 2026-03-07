
const fs = require('fs');
const glob = require('fs/promises');
const path = require('path');

const colorMaps = {
  '#F7F4EF': 'var(--base-bg)',
  '#E8EDE0': 'color-mix(in srgb, var(--base-bg) 80%, var(--primary) 20%)',
  '#e8ede0': 'color-mix(in srgb, var(--base-bg) 80%, var(--primary) 20%)',
  'white': 'var(--base-bg)',
  '#FFFFFF': 'var(--base-bg)',
  '#ffffff': 'var(--base-bg)',
  '#2C3E1E': 'var(--base-text)',
  '#2c3e1e': 'var(--base-text)',
  '#4A5E3A': 'var(--primary)',
  '#4a5e3a': 'var(--primary)',
  '#6B7F5E': 'var(--primary)',
  '#6b7f5e': 'var(--primary)',
  '#8A9E6C': 'var(--secondary)',
  '#8a9e6c': 'var(--secondary)',
  '#A3C17A': 'var(--accent)',
  '#a3c17a': 'var(--accent)',
  '#C17A55': 'var(--accent)',
  '#c17a55': 'var(--accent)'
};

function fixFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let original = content;

  // Replace colors that appear in strings like style={{ color: '#F7F4EF' }}
  for (const [hex, cssVar] of Object.entries(colorMaps)) {
    // Specifically target occurrences inside quotes inside styled components or normal strings
    // E.g., '#F7F4EF' or '#4A5E3A'
    content = content.replace(new RegExp(hex, 'gi'), cssVar);
  }

  // Handle transparent RGBA mapping roughly
  content = content.replace(/rgba\(255,\\s*255,\\s*255,\\s*0\.(\d+)\)/gi, 'color-mix(in srgb, var(--base-bg) %, transparent)');

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

walkDir('../client/src/components');

