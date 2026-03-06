/**
 * fix-console-to-logger.cjs
 * Bulk replaces console.log/warn/error with structured logger in backend route files.
 * Run: node scripts/fix-console-to-logger.cjs
 */
const fs = require('fs');
const path = require('path');

const ROUTES_DIR = path.resolve(__dirname, '..', 'backend', 'src', 'routes');
const LOGGER_IMPORT = "import { logger } from '../utils/logger.js';";

let totalReplaced = 0;
let filesModified = 0;

const files = fs.readdirSync(ROUTES_DIR).filter(f => f.endsWith('.ts'));

for (const file of files) {
  const fp = path.join(ROUTES_DIR, file);
  let content = fs.readFileSync(fp, 'utf8');
  const original = content;

  let count = 0;
  content = content.replace(/console\.log\(/g, () => { count++; return 'logger.info('; });
  content = content.replace(/console\.warn\(/g, () => { count++; return 'logger.warn('; });
  content = content.replace(/console\.error\(/g, () => { count++; return 'logger.error('; });

  if (count > 0) {
    // Add logger import if not already present
    if (!content.includes("from '../utils/logger")) {
      // Insert after the first import statement
      const firstImportEnd = content.search(/^import .+;[\r\n]/m);
      if (firstImportEnd !== -1) {
        const lineEnd = content.indexOf('\n', firstImportEnd) + 1;
        content = content.slice(0, lineEnd) + LOGGER_IMPORT + '\n' + content.slice(lineEnd);
      }
    }

    fs.writeFileSync(fp, content, 'utf8');
    totalReplaced += count;
    filesModified++;
    console.log(`  ${file}: ${count} replacements`);
  }
}

console.log(`\nDone: ${totalReplaced} console calls replaced across ${filesModified} route files.`);
