/**
 * One-off script: generate stub .ts files for all missing service modules.
 * Parses tsc TS2307 errors, reads the importing file to extract export names,
 * and creates minimal stub files.
 */
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

const ROOT = path.resolve(import.meta.dirname, '..');

// 1. Run tsc and collect TS2307 errors
let raw = '';
try {
  raw = execSync('npx tsc --noEmit 2>&1', { cwd: ROOT, encoding: 'utf-8', maxBuffer: 10_000_000 }).toString();
} catch (e) {
  raw = e.stdout || e.output?.join('') || '';
}

const errorLines = raw.split('\n').filter(l => l.includes('TS2307'));

// Parse: src/file.ts(line,col): error TS2307: ... 'module-specifier' ...
const pairs = [];
for (const line of errorLines) {
  const m = line.match(/^(src\/[^(]+)\((\d+),/);
  const m2 = line.match(/'([^']+)'/);
  if (m && m2) {
    pairs.push({ sourceFile: path.join(ROOT, m[1]), line: parseInt(m[2]), moduleSpec: m2[1] });
  }
}

// Deduplicate by resolved target path
const seen = new Set();
const tasks = [];

for (const { sourceFile, line, moduleSpec } of pairs) {
  // Resolve the module specifier relative to the source file
  const sourceDir = path.dirname(sourceFile);
  let targetTs = path.resolve(sourceDir, moduleSpec.replace(/\.js$/, '.ts'));
  
  // For specifiers without .js extension, try .ts
  if (!moduleSpec.endsWith('.js')) {
    // Could be a directory index or extensionless
    const asTs = path.resolve(sourceDir, moduleSpec + '.ts');
    const asIndex = path.resolve(sourceDir, moduleSpec, 'index.ts');
    if (fs.existsSync(asTs) || fs.existsSync(asIndex)) continue; // already exists
    // Try to determine: if specifier looks like a directory (ends with no ext and has no dot in last segment)
    const lastSeg = moduleSpec.split('/').pop();
    if (lastSeg && !lastSeg.includes('.')) {
      targetTs = asIndex; // treat as directory/index.ts
    } else {
      targetTs = asTs;
    }
  }

  if (fs.existsSync(targetTs)) continue; // already exists
  if (seen.has(targetTs)) continue;
  seen.add(targetTs);

  // Read the source file and extract import names from the line
  let exportNames = [];
  let isDefault = false;
  try {
    const src = fs.readFileSync(sourceFile, 'utf-8');
    const lines = src.split('\n');
    
    // Look at the import line and a few surrounding lines (multi-line imports)
    const startIdx = Math.max(0, line - 2);
    const endIdx = Math.min(lines.length, line + 5);
    const importBlock = lines.slice(startIdx, endIdx).join('\n');
    
    // Match named imports: import { foo, bar } from '...'
    // Need to find the import that references our module
    const importRegex = new RegExp(`import\\s*\\{([^}]+)\\}\\s*from\\s*['"]${moduleSpec.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}['"]`, 's');
    const namedMatch = importBlock.match(importRegex);
    if (namedMatch) {
      exportNames = namedMatch[1].split(',').map(n => {
        const parts = n.trim().split(/\s+as\s+/);
        return parts[0].trim();
      }).filter(Boolean);
    }
    
    // Match default import: import foo from '...'
    const defaultRegex = new RegExp(`import\\s+([a-zA-Z_$][a-zA-Z0-9_$]*)\\s+from\\s*['"]${moduleSpec.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}['"]`);
    const defaultMatch = importBlock.match(defaultRegex);
    if (defaultMatch) {
      isDefault = true;
      exportNames.push(defaultMatch[1]);
    }

    // Match: import type { ... }
    const typeRegex = new RegExp(`import\\s+type\\s*\\{([^}]+)\\}\\s*from\\s*['"]${moduleSpec.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}['"]`, 's');
    const typeMatch = importBlock.match(typeRegex);
    if (typeMatch) {
      const typeNames = typeMatch[1].split(',').map(n => n.trim().split(/\s+as\s+/)[0].trim()).filter(Boolean);
      exportNames.push(...typeNames);
    }
  } catch {}

  // Also search ALL files that import this module for additional export names
  try {
    const modBasename = moduleSpec.replace(/\.js$/, '');
    const allFiles = execSync(`git grep -l "${path.basename(modBasename)}" -- "*.ts"`, { cwd: ROOT, encoding: 'utf-8' }).trim().split('\n');
    for (const f of allFiles) {
      if (!f.trim()) continue;
      try {
        const content = fs.readFileSync(path.join(ROOT, f), 'utf-8');
        // Named imports
        const re = new RegExp(`import\\s*\\{([^}]+)\\}\\s*from\\s*['"][^'"]*${path.basename(modBasename).replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(?:\\.js)?['"]`, 'gs');
        let match;
        while ((match = re.exec(content)) !== null) {
          const names = match[1].split(',').map(n => n.trim().split(/\s+as\s+/)[0].trim()).filter(Boolean);
          exportNames.push(...names);
        }
        // Default import
        const defRe = new RegExp(`import\\s+([a-zA-Z_$][a-zA-Z0-9_$]*)\\s+from\\s*['"][^'"]*${path.basename(modBasename).replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(?:\\.js)?['"]`, 'g');
        while ((match = defRe.exec(content)) !== null) {
          isDefault = true;
          exportNames.push(match[1]);
        }
        // Type imports
        const typeRe = new RegExp(`import\\s+type\\s*\\{([^}]+)\\}\\s*from\\s*['"][^'"]*${path.basename(modBasename).replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(?:\\.js)?['"]`, 'gs');
        while ((match = typeRe.exec(content)) !== null) {
          const names = match[1].split(',').map(n => n.trim().split(/\s+as\s+/)[0].trim()).filter(Boolean);
          exportNames.push(...names);
        }
      } catch {}
    }
  } catch {}

  // Deduplicate export names
  exportNames = [...new Set(exportNames)].filter(Boolean);

  tasks.push({ targetTs, exportNames, isDefault, moduleSpec });
}

console.log(`Found ${tasks.length} missing modules to generate.\n`);

// 2. Generate stub files
for (const { targetTs, exportNames, isDefault } of tasks) {
  const dir = path.dirname(targetTs);
  fs.mkdirSync(dir, { recursive: true });

  const lines = [
    '// Copyright (c) 2024-2026 Datacendia, LLC. Licensed under Apache 2.0.',
    '// See LICENSE file for details.',
    '',
    '// Auto-generated stub — implement as needed',
    '',
  ];

  const typeLikeNames = new Set();
  const valueLikeNames = new Set();

  for (const name of exportNames) {
    // Heuristic: PascalCase starting with uppercase and containing "Type", "Config", "Options", "Props", "Params" → type
    // Or if name starts with uppercase and ends with specific suffixes
    if (/^[A-Z]/.test(name) && /(Type|Config|Options|Props|Params|Result|Response|Request|Data|Info|Event|State|Context|Mode|Status)$/.test(name)) {
      typeLikeNames.add(name);
    } else {
      valueLikeNames.add(name);
    }
  }

  for (const name of typeLikeNames) {
    lines.push(`export interface ${name} { [key: string]: any; }`);
    lines.push('');
  }

  for (const name of valueLikeNames) {
    // Is it a class-like service (starts with uppercase)?
    if (/^[A-Z]/.test(name) && !name.includes('_')) {
      // Likely a class
      lines.push(`export class ${name} { [key: string]: any; }`);
    } else {
      // Likely a singleton/object — create a Proxy that returns no-op functions
      lines.push(`export const ${name}: any = new Proxy({}, {`);
      lines.push(`  get: (_t: any, prop: string) => {`);
      lines.push(`    if (prop === 'then') return undefined;`);
      lines.push(`    return (..._args: any[]) => Promise.resolve({});`);
      lines.push(`  },`);
      lines.push(`});`);
    }
    lines.push('');
  }

  if (isDefault) {
    const defaultName = exportNames[0] || 'stub';
    if (!valueLikeNames.has(defaultName) && !typeLikeNames.has(defaultName)) {
      lines.push(`const ${defaultName}: any = new Proxy({}, {`);
      lines.push(`  get: (_t: any, prop: string) => {`);
      lines.push(`    if (prop === 'then') return undefined;`);
      lines.push(`    return (..._args: any[]) => Promise.resolve({});`);
      lines.push(`  },`);
      lines.push(`});`);
      lines.push('');
    }
    lines.push(`export default ${valueLikeNames.size > 0 ? [...valueLikeNames][0] : defaultName};`);
    lines.push('');
  }

  // If no exports found, create a generic stub
  if (exportNames.length === 0) {
    const baseName = path.basename(targetTs, '.ts');
    const isIndex = baseName === 'index';
    if (isIndex) {
      lines.push(`// Add exports here as needed`);
    } else {
      const camelName = baseName.charAt(0).toLowerCase() + baseName.slice(1);
      lines.push(`export const ${camelName}: any = new Proxy({}, {`);
      lines.push(`  get: (_t: any, prop: string) => {`);
      lines.push(`    if (prop === 'then') return undefined;`);
      lines.push(`    return (..._args: any[]) => Promise.resolve({});`);
      lines.push(`  },`);
      lines.push(`});`);
    }
    lines.push('');
  }

  fs.writeFileSync(targetTs, lines.join('\n'));
  const relPath = path.relative(ROOT, targetTs);
  console.log(`  ✓ ${relPath} (exports: ${exportNames.join(', ') || '<generic>'})`);
}

console.log(`\nDone. Generated ${tasks.length} stub files.`);
