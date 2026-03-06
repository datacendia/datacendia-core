/**
 * generate-trust-facts.cjs
 * Scans the datacendia-core codebase and generates verified counts/facts
 * for trust center, marketing, and documentation use.
 *
 * Run: node scripts/generate-trust-facts.cjs
 * Output: docs/TRUST-FACTS.json
 *
 * Intended for CI: run on every merge to main, commit output if changed.
 * Marketing and trust center should reference these numbers instead of
 * hand-maintaining exact counts.
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const OUTPUT = path.resolve(ROOT, 'docs', 'TRUST-FACTS.json');

// ── Count files matching pattern ─────────────────────────────────────────────

function countFiles(dir, pattern, recursive = true) {
  let count = 0;
  try {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory() && recursive) {
        count += countFiles(fullPath, pattern, recursive);
      } else if (entry.isFile() && pattern.test(entry.name)) {
        count++;
      }
    }
  } catch { /* directory doesn't exist */ }
  return count;
}

// ── Count lines in files ─────────────────────────────────────────────────────

function countLines(dir, pattern, recursive = true) {
  let lines = 0;
  try {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory() && recursive) {
        lines += countLines(fullPath, pattern, recursive);
      } else if (entry.isFile() && pattern.test(entry.name)) {
        const content = fs.readFileSync(fullPath, 'utf8');
        lines += content.split('\n').length;
      }
    }
  } catch { /* directory doesn't exist */ }
  return lines;
}

// ── Scan ─────────────────────────────────────────────────────────────────────

const backendSrc = path.join(ROOT, 'backend', 'src');
const frontendSrc = path.join(ROOT, 'src');
const testsDir = path.join(ROOT, 'tests');

const facts = {
  generated: new Date().toISOString(),
  generator: 'scripts/generate-trust-facts.cjs',
  repo: 'datacendia-core',

  // Route files
  routeFiles: countFiles(path.join(backendSrc, 'routes'), /\.ts$/),

  // Service files
  serviceFiles: countFiles(path.join(backendSrc, 'services'), /\.ts$/),

  // Middleware files
  middlewareFiles: countFiles(path.join(backendSrc, 'middleware'), /\.ts$/),

  // Security modules
  securityFiles: countFiles(path.join(backendSrc, 'security'), /\.ts$/),

  // Frontend components
  componentFiles: countFiles(path.join(frontendSrc, 'components'), /\.(tsx|ts)$/),

  // Frontend pages
  pageFiles: countFiles(path.join(frontendSrc, 'pages'), /\.(tsx|ts)$/),

  // Frontend services
  frontendServiceFiles: countFiles(path.join(frontendSrc, 'services'), /\.(tsx|ts)$/),

  // Test files
  testFiles: countFiles(testsDir, /\.(test|spec)\.(ts|tsx|js)$/),

  // Prisma schema
  prismaSchemaExists: fs.existsSync(path.join(ROOT, 'backend', 'prisma', 'schema.prisma')),

  // Docker compose files
  composeFiles: countFiles(ROOT, /docker-compose.*\.(yml|yaml)$/, false),

  // Backend TypeScript lines of code (approximate)
  backendLinesOfCode: countLines(backendSrc, /\.ts$/, true),

  // Frontend TypeScript/React lines of code (approximate)
  frontendLinesOfCode: countLines(frontendSrc, /\.(tsx|ts)$/, true),

  // Total lines of code
  totalLinesOfCode: 0, // computed below

  // Vertical modules
  verticalDirs: (() => {
    const verticalsDir = path.join(backendSrc, 'services', 'verticals');
    try {
      return fs.readdirSync(verticalsDir, { withFileTypes: true })
        .filter(e => e.isDirectory())
        .map(e => e.name);
    } catch { return []; }
  })(),
  verticalCount: 0, // computed below

  // Domain routers
  domainRouters: (() => {
    const domainsDir = path.join(backendSrc, 'routes', 'domains');
    try {
      return countFiles(domainsDir, /\.ts$/, false);
    } catch { return 0; }
  })(),

  // Key infrastructure files
  infrastructure: {
    dockerfile: fs.existsSync(path.join(ROOT, 'Dockerfile')),
    backendDockerfile: fs.existsSync(path.join(ROOT, 'backend', 'Dockerfile')),
    securityMd: fs.existsSync(path.join(ROOT, 'SECURITY.md')),
    communityMd: fs.existsSync(path.join(ROOT, 'COMMUNITY.md')),
    architectureMd: fs.existsSync(path.join(ROOT, 'ARCHITECTURE.md')),
    license: fs.existsSync(path.join(ROOT, 'LICENSE')),
  },
};

// Computed fields
facts.totalLinesOfCode = facts.backendLinesOfCode + facts.frontendLinesOfCode;
facts.verticalCount = facts.verticalDirs.length;

// ── Validate SBOM if present ─────────────────────────────────────────────────

const sbomPath = path.join(ROOT, '..', 'datacendia-marketing', 'trust', 'sbom.json');
if (fs.existsSync(sbomPath)) {
  try {
    const sbom = JSON.parse(fs.readFileSync(sbomPath, 'utf8'));
    facts.sbom = {
      format: sbom.bomFormat,
      specVersion: sbom.specVersion,
      componentCount: sbom.components?.length || 0,
      targetName: sbom.metadata?.component?.name || 'unknown',
      timestamp: sbom.metadata?.timestamp || 'unknown',
    };
  } catch (e) {
    facts.sbom = { error: 'Failed to parse SBOM: ' + e.message };
  }
} else {
  facts.sbom = { error: 'SBOM not found at expected path' };
}

// ── Write output ─────────────────────────────────────────────────────────────

fs.mkdirSync(path.dirname(OUTPUT), { recursive: true });
fs.writeFileSync(OUTPUT, JSON.stringify(facts, null, 2), 'utf8');

console.log('Trust facts generated:');
console.log(`  Route files: ${facts.routeFiles}`);
console.log(`  Service files: ${facts.serviceFiles}`);
console.log(`  Security modules: ${facts.securityFiles}`);
console.log(`  Components: ${facts.componentFiles}`);
console.log(`  Pages: ${facts.pageFiles}`);
console.log(`  Test files: ${facts.testFiles}`);
console.log(`  Verticals: ${facts.verticalCount} (${facts.verticalDirs.join(', ')})`);
console.log(`  Domain routers: ${facts.domainRouters}`);
console.log(`  Backend LoC: ${facts.backendLinesOfCode.toLocaleString()}`);
console.log(`  Frontend LoC: ${facts.frontendLinesOfCode.toLocaleString()}`);
console.log(`  Total LoC: ${facts.totalLinesOfCode.toLocaleString()}`);
console.log(`  SBOM: ${facts.sbom.componentCount ? facts.sbom.componentCount + ' components' : facts.sbom.error}`);
console.log(`  Output: docs/TRUST-FACTS.json`);
