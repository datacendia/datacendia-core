#!/usr/bin/env node
// Copyright (c) 2024-2026 Datacendia, LLC. Licensed under Apache 2.0.
// See LICENSE file for details.
//
// Lint ratchet. The codebase carries hundreds of existing ESLint problems, so
// `npm run lint` can't gate CI yet, and CI used to ignore its result entirely.
// This fails only when a file gains problems of any rule compared with the
// committed baseline: new code must be clean, old debt can only shrink.
//
//   node scripts/lint-ratchet.mjs <baseline.json> [--update] [--ext .ts,.tsx]
//        [--report-unused-disable-directives] <paths...>
//
// Run it from the package directory (repo root, or backend/); ESLint and the
// config are resolved from there. --update rewrites the baseline, to lock in
// improvements or, deliberately, to accept new problems (reviewers see the diff).

import { createRequire } from 'module';
import fs from 'fs';
import path from 'path';

const args = process.argv.slice(2);
const baselineFile = args.shift();
const update = args.includes('--update');
const unusedDirectives = args.includes('--report-unused-disable-directives');
const extIndex = args.indexOf('--ext');
const extensions = extIndex >= 0 ? args[extIndex + 1].split(',') : ['.js', '.ts', '.tsx'];
const patterns = args.filter((a, i) => !a.startsWith('--') && !(extIndex >= 0 && i === extIndex + 1));
if (!baselineFile || patterns.length === 0) {
  console.error('usage: lint-ratchet.mjs <baseline.json> [--update] [--ext .ts,.tsx] <paths...>');
  process.exit(2);
}

const require = createRequire(path.join(process.cwd(), 'package.json'));
const { ESLint } = require('eslint');
const eslint = new ESLint({
  extensions,
  reportUnusedDisableDirectives: unusedDirectives ? 'error' : undefined,
});
const results = await eslint.lintFiles(patterns);

/** { "src/file.ts": { "rule-id": count } }, keys sorted for stable diffs. */
const current = {};
for (const result of results) {
  if (result.messages.length === 0) continue;
  const file = path.relative(process.cwd(), result.filePath).split(path.sep).join('/');
  const counts = {};
  for (const m of result.messages) {
    const rule = m.ruleId ?? (m.fatal ? 'parse-error' : 'unused-disable-directive');
    counts[rule] = (counts[rule] ?? 0) + 1;
  }
  current[file] = Object.fromEntries(Object.entries(counts).sort(([a], [b]) => a.localeCompare(b)));
}
const sorted = Object.fromEntries(Object.entries(current).sort(([a], [b]) => a.localeCompare(b)));
const total = (counts) => Object.values(counts).reduce((sum, c) => sum + Object.values(c).reduce((s, n) => s + n, 0), 0);

if (update) {
  fs.writeFileSync(baselineFile, JSON.stringify(sorted, null, 2) + '\n');
  console.log(`Baseline written: ${total(sorted)} problems in ${Object.keys(sorted).length} files.`);
  process.exit(0);
}

const baseline = fs.existsSync(baselineFile) ? JSON.parse(fs.readFileSync(baselineFile, 'utf8')) : {};
const regressions = [];
let improved = 0;
for (const [file, counts] of Object.entries(sorted)) {
  for (const [rule, n] of Object.entries(counts)) {
    const before = baseline[file]?.[rule] ?? 0;
    if (n > before) regressions.push(`  ${file}  ${rule}: ${before} -> ${n}`);
  }
}
for (const [file, counts] of Object.entries(baseline)) {
  for (const [rule, before] of Object.entries(counts)) {
    const n = sorted[file]?.[rule] ?? 0;
    if (n < before) improved += before - n;
  }
}

console.log(`ESLint: ${total(sorted)} problems (baseline ${total(baseline)}).`);
if (regressions.length > 0) {
  console.error(`\nNew lint problems (fix them, or run with --update to accept):\n${regressions.join('\n')}`);
  process.exit(1);
}
if (improved > 0) {
  console.log(`${improved} fewer than the baseline. Lock that in: run with --update and commit the baseline.`);
}
