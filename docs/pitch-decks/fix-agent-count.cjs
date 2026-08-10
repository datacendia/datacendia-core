#!/usr/bin/env node
/**
 * Fix all remaining "14 agents" references across all pitch decks.
 * Handles prose text, headings, card descriptions, and metric labels.
 */

const fs = require('fs');
const path = require('path');

const baseDir = __dirname;
let totalFixed = 0;
let filesFixed = 0;

const REPLACEMENTS = [
  // Prose and headings
  ['14 specialized agents', '50+ specialized agent presets'],
  ['14 Specialized AI Agents Deliberate', '50+ Specialized AI Agent Presets'],
  ['14 Specialized AI Agents', '50+ Specialized AI Agent Presets'],
  ['14 agents deliberate', '50+ agents deliberate'],
  ['14 agents (CFO, CISO, Risk, Strategy, Legal) deliberate', '50+ agent presets (CFO, CISO, Risk, Strategy, Legal) deliberate'],
  ['14 agents (CFO, CISO', '50+ agent presets (CFO, CISO'],
  ['14 C-suite AI agents', '50+ specialized AI agents'],
  ['14-agent Council', '50+ agent Council'],
  ['14-agent boardroom', 'multi-agent boardroom'],
  ['14-agent deliberation', 'multi-agent deliberation'],
  // Generic catch-all for remaining "14 agents" in context
  ['14 agents deliberate in parallel', '50+ agents deliberate in parallel'],
  ['14 agents analyze', '50+ agents analyze'],
  // Table/card references
  ['>14</div>', '>50+</div>'],
];

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  const filename = path.basename(filePath);
  let fixCount = 0;

  for (const [search, replace] of REPLACEMENTS) {
    if (content.includes(search)) {
      const count = content.split(search).length - 1;
      content = content.split(search).join(replace);
      fixCount += count;
    }
  }

  // Catch remaining "14 agents" that appear in sentences
  // Be careful: only replace when "14 agents" is clearly about the AI Council
  const remaining14 = (content.match(/14 agents/gi) || []).length;
  if (remaining14 > 0) {
    content = content.replace(/14 agents/g, '50+ agents');
    fixCount += remaining14;
  }

  if (fixCount > 0) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`  ${filename}: ${fixCount} reference(s) fixed`);
    totalFixed += fixCount;
    filesFixed++;
  }
}

// Process all HTML files recursively
function processDir(dir) {
  if (!fs.existsSync(dir)) return;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      processDir(fullPath);
    } else if (entry.name.endsWith('.html')) {
      processFile(fullPath);
    }
  }
}

console.log('Fixing "14 agents" references across all pitch decks...\n');
processDir(baseDir);

console.log(`\n${'='.repeat(50)}`);
console.log(`${totalFixed} references fixed across ${filesFixed} files`);
