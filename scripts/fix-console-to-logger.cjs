/**
 * fix-console-to-logger.cjs
 * Bulk replaces console.log/warn/error with structured logger in backend source files.
 * Run: node scripts/fix-console-to-logger.cjs
 */
const fs = require('fs');
const path = require('path');

const BACKEND_SRC = path.resolve(__dirname, '..', 'backend', 'src');

// Directories to process
const DIRS = [
  'routes',
  'services',
  'security',
  'middleware',
  'core',
  'connectors',
  'features',
  'adapters',
  'startup',
  'telemetry',
  'websocket',
];

let totalReplaced = 0;
let filesModified = 0;

function getLoggerImport(filePath) {
  // Calculate relative path from file to utils/logger.js
  const fileDir = path.dirname(filePath);
  let rel = path.relative(fileDir, path.join(BACKEND_SRC, 'utils', 'logger.js')).replace(/\\/g, '/');
  if (!rel.startsWith('.')) rel = './' + rel;
  return `import { logger } from '${rel}';`;
}

function processDir(dir) {
  if (!fs.existsSync(dir)) return;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      processDir(fullPath);
    } else if (entry.isFile() && entry.name.endsWith('.ts')) {
      processFile(fullPath);
    }
  }
}

function processFile(fp) {
  let content = fs.readFileSync(fp, 'utf8');

  let count = 0;
  content = content.replace(/console\.log\(/g, () => { count++; return 'logger.info('; });
  content = content.replace(/console\.warn\(/g, () => { count++; return 'logger.warn('; });
  content = content.replace(/console\.error\(/g, () => { count++; return 'logger.error('; });

  if (count > 0) {
    // Add logger import if not already present
    if (!content.includes("from '") || !content.match(/from ['"].*logger/)) {
      const loggerImport = getLoggerImport(fp);
      if (!content.includes(loggerImport.split("from")[0].trim())) {
        const firstImportEnd = content.search(/^import .+;[\r\n]/m);
        if (firstImportEnd !== -1) {
          const lineEnd = content.indexOf('\n', firstImportEnd) + 1;
          content = content.slice(0, lineEnd) + loggerImport + '\n' + content.slice(lineEnd);
        }
      }
    }

    fs.writeFileSync(fp, content, 'utf8');
    totalReplaced += count;
    filesModified++;
    const relPath = path.relative(BACKEND_SRC, fp);
    console.log(`  ${relPath}: ${count} replacements`);
  }
}

for (const dir of DIRS) {
  processDir(path.join(BACKEND_SRC, dir));
}

console.log(`\nDone: ${totalReplaced} console calls replaced across ${filesModified} files.`);
