const fs = require('fs');
const path = require('path');
const dir = path.join(__dirname, '..', 'backend', 'src', 'services', 'crypto');
const files = fs.readdirSync(dir).filter(f => f.endsWith('.ts') && f !== 'nativeCrypto.ts');
let total = 0;

for (const file of files) {
  const fp = path.join(dir, file);
  let c = fs.readFileSync(fp, 'utf8');
  const orig = c;

  // Remove @noble/hashes imports
  c = c.replace(/import\s*\{[^}]*\}\s*from\s*'@noble\/hashes\/sha256';\n?/g, '');
  c = c.replace(/import\s*\{[^}]*\}\s*from\s*'@noble\/hashes\/sha512';\n?/g, '');
  c = c.replace(/import\s*\{[^}]*\}\s*from\s*'@noble\/hashes\/utils';\n?/g, '');

  if (c !== orig && !c.includes('nativeCrypto')) {
    // Add nativeCrypto import after the last remaining import
    const lines = c.split('\n');
    let lastImportIdx = -1;
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].startsWith('import ')) lastImportIdx = i;
    }
    if (lastImportIdx >= 0) {
      lines.splice(lastImportIdx + 1, 0,
        "import { sha256, sha512, bytesToHex, hexToBytes, utf8ToBytes, concatBytes } from './nativeCrypto.js';"
      );
      c = lines.join('\n');
    }
  }

  if (c !== orig) {
    fs.writeFileSync(fp, c, 'utf8');
    total++;
    console.log(file + ': fixed');
  }
}
console.log('Total files fixed: ' + total);
