/**
 * count-any-casts.cjs
 * Counts 'as any' casts across the codebase and reports a baseline.
 * Run: node scripts/count-any-casts.cjs
 * Use in CI to track type safety improvements over time.
 */
const fs = require('fs');
const path = require('path');

const BACKEND_SRC = path.resolve(__dirname, '..', 'backend', 'src');
const FRONTEND_SRC = path.resolve(__dirname, '..', 'src');

function countInDir(dir, ext) {
  let total = 0;
  const byFile = [];
  
  function scan(d) {
    if (!fs.existsSync(d)) return;
    for (const entry of fs.readdirSync(d, { withFileTypes: true })) {
      const fp = path.join(d, entry.name);
      if (entry.isDirectory() && entry.name !== 'node_modules') scan(fp);
      else if (entry.isFile() && entry.name.endsWith(ext)) {
        const content = fs.readFileSync(fp, 'utf8');
        const matches = (content.match(/as any/g) || []).length;
        if (matches > 0) {
          total += matches;
          byFile.push({ file: path.relative(dir, fp), count: matches });
        }
      }
    }
  }
  scan(dir);
  return { total, byFile: byFile.sort((a, b) => b.count - a.count) };
}

const backend = countInDir(BACKEND_SRC, '.ts');
const frontend = countInDir(FRONTEND_SRC, '.tsx');
const frontendTs = countInDir(FRONTEND_SRC, '.ts');

const grandTotal = backend.total + frontend.total + frontendTs.total;

console.log(`=== 'as any' Cast Baseline ===`);
console.log(`  Backend (.ts):  ${backend.total}`);
console.log(`  Frontend (.tsx): ${frontend.total}`);
console.log(`  Frontend (.ts):  ${frontendTs.total}`);
console.log(`  TOTAL:           ${grandTotal}`);
console.log(`\nTop 10 worst files (backend):`);
for (const f of backend.byFile.slice(0, 10)) {
  console.log(`  ${f.count.toString().padStart(4)} | ${f.file}`);
}
console.log(`\nTop 10 worst files (frontend):`);
for (const f of [...frontend.byFile, ...frontendTs.byFile].sort((a,b) => b.count - a.count).slice(0, 10)) {
  console.log(`  ${f.count.toString().padStart(4)} | ${f.file}`);
}

// Write baseline JSON
const baseline = {
  date: new Date().toISOString().split('T')[0],
  backend: backend.total,
  frontend: frontend.total + frontendTs.total,
  total: grandTotal,
  topBackendFiles: backend.byFile.slice(0, 20),
  topFrontendFiles: [...frontend.byFile, ...frontendTs.byFile].sort((a,b) => b.count - a.count).slice(0, 20),
};
fs.writeFileSync(
  path.resolve(__dirname, '..', 'docs', 'as-any-baseline.json'),
  JSON.stringify(baseline, null, 2),
  'utf8'
);
console.log(`\nBaseline written to docs/as-any-baseline.json`);
