#!/usr/bin/env node
/**
 * Second pass: fix remaining "14 agents/specialized" references 
 * that have different surrounding text patterns.
 */
const fs = require('fs');
const path = require('path');

const baseDir = __dirname;
let totalFixed = 0;
let filesFixed = 0;

// Use regex replacements for flexibility
const REGEX_REPLACEMENTS = [
  [/14 specialized AI agents/gi, '50+ specialized AI agent presets'],
  [/14-agent structured deliberation/gi, 'multi-agent structured deliberation'],
  [/14-agent multi-perspective/gi, 'multi-agent multi-perspective'],
  [/14-agent/gi, 'multi-agent'],
  [/14 agents/gi, '50+ agents'],
];

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  const filename = path.basename(filePath);
  let fixCount = 0;

  for (const [regex, replacement] of REGEX_REPLACEMENTS) {
    const matches = content.match(regex);
    if (matches) {
      content = content.replace(regex, replacement);
      fixCount += matches.length;
    }
  }

  if (fixCount > 0) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`  ${filename}: ${fixCount} fix(es)`);
    totalFixed += fixCount;
    filesFixed++;
  }
}

function processDir(dir) {
  if (!fs.existsSync(dir)) return;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) processDir(fullPath);
    else if (entry.name.endsWith('.html')) processFile(fullPath);
  }
}

processDir(baseDir);
console.log(`\n${totalFixed} fixes across ${filesFixed} files`);
