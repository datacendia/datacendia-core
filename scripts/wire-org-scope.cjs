/**
 * wire-org-scope.cjs
 * Adds requireOrgScope middleware import and usage to routes that need tenant isolation.
 * Run: node scripts/wire-org-scope.cjs
 */
const fs = require('fs');
const path = require('path');

const ROUTES_DIR = path.resolve(__dirname, '..', 'backend', 'src', 'routes');

const ROUTES_TO_SCOPE = [
  'energy.ts',
  'fhir.ts',
  'financial.ts',
  'forecasting.ts',
  'healthcare.ts',
  'industrial-services.ts',
  'insurance.ts',
  'mesh.ts',
  'rag.ts',
];

const IMPORT_LINE = "import { requireOrgScope } from '../middleware/tenantIsolation.js';";

let modified = 0;

for (const file of ROUTES_TO_SCOPE) {
  const fp = path.join(ROUTES_DIR, file);
  if (!fs.existsSync(fp)) {
    console.log(`  SKIP ${file} — file not found`);
    continue;
  }

  let content = fs.readFileSync(fp, 'utf8');

  if (content.includes('requireOrgScope')) {
    console.log(`  SKIP ${file} — already has requireOrgScope`);
    continue;
  }

  // Add import after the devAuth import line
  if (content.includes("from '../middleware/auth")) {
    content = content.replace(
      /(import\s*\{[^}]*\}\s*from\s*'\.\.\/middleware\/auth[^']*';)/,
      `$1\n${IMPORT_LINE}`
    );
  } else {
    // Fallback: add after first import
    const firstImportEnd = content.search(/^import .+;[\r\n]/m);
    if (firstImportEnd !== -1) {
      const lineEnd = content.indexOf('\n', firstImportEnd) + 1;
      content = content.slice(0, lineEnd) + IMPORT_LINE + '\n' + content.slice(lineEnd);
    }
  }

  // Add requireOrgScope after devAuth middleware
  content = content.replace(
    /router\.use\(devAuth\);/,
    'router.use(devAuth);\nrouter.use(requireOrgScope);'
  );

  fs.writeFileSync(fp, content, 'utf8');
  modified++;
  console.log(`  WIRED ${file}`);
}

console.log(`\nDone: ${modified} routes wired with requireOrgScope.`);
