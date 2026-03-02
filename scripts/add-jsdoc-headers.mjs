#!/usr/bin/env node
/**
 * Batch JSDoc Header Generator for Datacendia Core
 *
 * Analyzes each .ts/.tsx file's path, name, and exported symbols to generate
 * contextual module-level JSDoc documentation headers. Inserts after the
 * copyright line if present, or at the top of the file.
 *
 * Usage: node scripts/add-jsdoc-headers.mjs
 */

import { readFileSync, writeFileSync, readdirSync, statSync } from 'fs';
import { join, relative, basename, dirname, extname } from 'path';

const ROOT = process.cwd();

// Category descriptions based on directory path
const CATEGORY_MAP = {
  // Backend
  'backend/src/routes/domains': { prefix: 'Domain Router', desc: 'Aggregated route group that mounts related API endpoints under a single domain prefix.' },
  'backend/src/routes': { prefix: 'API Routes', desc: 'Express route handler defining REST endpoints.' },
  'backend/src/middleware': { prefix: 'Middleware', desc: 'Express middleware for request processing pipeline.' },
  'backend/src/security': { prefix: 'Security', desc: 'Security hardening module for attack prevention and threat detection.' },
  'backend/src/config': { prefix: 'Configuration', desc: 'Application configuration and service initialization.' },
  'backend/src/services': { prefix: 'Service', desc: 'Business logic service implementing platform capabilities.' },
  'backend/src/connectors': { prefix: 'Connector', desc: 'External system connector for third-party integrations.' },
  'backend/src/adapters': { prefix: 'Data Adapter', desc: 'Data transformation adapter between internal and external formats.' },
  'backend/src/core': { prefix: 'Core', desc: 'Core platform infrastructure and shared utilities.' },
  'backend/src/types': { prefix: 'Type Definitions', desc: 'TypeScript type definitions and interfaces.' },
  'backend/src/utils': { prefix: 'Utility', desc: 'Shared utility functions and helpers.' },
  'backend/src/features': { prefix: 'Feature', desc: 'Feature module implementing a specific platform capability.' },
  'backend/src/database': { prefix: 'Database', desc: 'Database access layer and query utilities.' },
  'backend/src/data': { prefix: 'Data', desc: 'Static data, seed scripts, and reference datasets.' },
  'backend/src/startup': { prefix: 'Startup', desc: 'Application startup and initialization tasks.' },
  'backend/src/websocket': { prefix: 'WebSocket', desc: 'Real-time WebSocket communication for live updates.' },
  'backend/src/telemetry': { prefix: 'Telemetry', desc: 'Observability, tracing, and monitoring instrumentation.' },
  'backend/src/lib': { prefix: 'Library', desc: 'Shared library module.' },
  // Frontend
  'src/pages': { prefix: 'Page', desc: 'React page component rendered by the router.' },
  'src/components': { prefix: 'Component', desc: 'Reusable React UI component.' },
  'src/services': { prefix: 'Frontend Service', desc: 'Client-side service for API communication and business logic.' },
  'src/stores': { prefix: 'Store', desc: 'Zustand state store for client-side state management.' },
  'src/hooks': { prefix: 'Hook', desc: 'Custom React hook for shared component logic.' },
  'src/contexts': { prefix: 'Context', desc: 'React context provider for cross-component state sharing.' },
  'src/layouts': { prefix: 'Layout', desc: 'Page layout component defining the structural shell for routes.' },
  'src/routes': { prefix: 'Route Config', desc: 'React Router route definitions and lazy-loaded imports.' },
  'src/lib': { prefix: 'Library', desc: 'Client-side utility library.' },
  'src/config': { prefix: 'Configuration', desc: 'Frontend configuration constants and environment bindings.' },
  'src/data': { prefix: 'Data', desc: 'Static data, constants, and configuration objects.' },
  'src/utils': { prefix: 'Utility', desc: 'Frontend utility functions and helpers.' },
};

function humanize(filename) {
  // council.ts -> Council, admin-settings.ts -> Admin Settings
  const name = basename(filename, extname(filename));
  return name
    .replace(/([A-Z])/g, ' $1')         // camelCase -> spaces
    .replace(/[-_.]/g, ' ')              // kebab/snake -> spaces
    .replace(/\b\w/g, c => c.toUpperCase()) // capitalize
    .replace(/\s+/g, ' ')
    .trim();
}

function detectExports(content) {
  const exports = [];
  // export class/function/const/interface/type/enum
  const patterns = [
    /export\s+(?:default\s+)?class\s+(\w+)/g,
    /export\s+(?:default\s+)?function\s+(\w+)/g,
    /export\s+const\s+(\w+)/g,
    /export\s+interface\s+(\w+)/g,
    /export\s+type\s+(\w+)/g,
    /export\s+enum\s+(\w+)/g,
  ];
  for (const pattern of patterns) {
    let match;
    while ((match = pattern.exec(content)) !== null) {
      exports.push(match[1]);
    }
  }
  return [...new Set(exports)].slice(0, 8); // Max 8 exports listed
}

function getCategory(relPath) {
  // Find the most specific matching category (longest path match first)
  const normalized = relPath.replace(/\\/g, '/');
  const keys = Object.keys(CATEGORY_MAP).sort((a, b) => b.length - a.length);
  for (const key of keys) {
    if (normalized.startsWith(key + '/') || normalized.startsWith(key + '\\')) {
      return CATEGORY_MAP[key];
    }
  }
  return { prefix: 'Module', desc: 'Platform module.' };
}

function buildJSDoc(relPath, content) {
  const name = humanize(relPath);
  const category = getCategory(relPath);
  const exports = detectExports(content);
  const modulePath = relPath
    .replace(/\\/g, '/')
    .replace(/^(backend\/src\/|src\/)/, '')
    .replace(/\.(ts|tsx)$/, '');

  let doc = `/**\n * ${category.prefix} — ${name}\n *\n * ${category.desc}\n`;

  if (exports.length > 0) {
    doc += ` *\n * @exports ${exports.join(', ')}\n`;
  }

  doc += ` * @module ${modulePath}\n */`;
  return doc;
}

function processFile(filePath) {
  const content = readFileSync(filePath, 'utf-8');
  const relPath = relative(ROOT, filePath);

  // Skip if already has a JSDoc module header (after copyright)
  if (content.match(/\/\*\*[\s\S]*?@module[\s\S]*?\*\//)) {
    return false;
  }

  const jsdoc = buildJSDoc(relPath, content);

  // Insert after copyright header if present
  const copyrightPattern = /(\/\/ Copyright.*?\/\/ See LICENSE file for details\.)\n/s;
  let newContent;
  if (copyrightPattern.test(content)) {
    newContent = content.replace(copyrightPattern, `$1\n\n${jsdoc}\n`);
  } else {
    // No copyright header — insert at top
    newContent = `${jsdoc}\n\n${content}`;
  }

  writeFileSync(filePath, newContent, 'utf-8');
  return true;
}

function walkDir(dir, extensions) {
  const files = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    const stat = statSync(full);
    if (stat.isDirectory() && !entry.startsWith('.') && entry !== 'node_modules' && entry !== 'dist') {
      files.push(...walkDir(full, extensions));
    } else if (stat.isFile() && extensions.some(ext => full.endsWith(ext))) {
      files.push(full);
    }
  }
  return files;
}

// Main
console.log('Scanning files...');

const backendFiles = walkDir(join(ROOT, 'backend', 'src'), ['.ts']);
const frontendFiles = walkDir(join(ROOT, 'src'), ['.ts', '.tsx']);
const allFiles = [...backendFiles, ...frontendFiles];

console.log(`Found ${allFiles.length} source files`);

let added = 0;
let skipped = 0;

for (const file of allFiles) {
  try {
    if (processFile(file)) {
      added++;
    } else {
      skipped++;
    }
  } catch (err) {
    console.error(`Error processing ${relative(ROOT, file)}: ${err.message}`);
  }
}

console.log(`\nDone! Added JSDoc headers to ${added} files (${skipped} already had headers)`);
