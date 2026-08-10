#!/usr/bin/env node
/**
 * Deck Restructure Script — Safe line-by-line approach
 * 
 * 1. Fixes "14 agents" text variants globally
 * 2. Fixes "17 jurisdictions" → "23 jurisdictions"
 * 3. Fixes "Target Q2 2026" → "In Progress"
 * 4. Removes DEPLOYMENT slides from sales + design-partner decks (line-by-line)
 * 5. Removes generic COMPLIANCE roadmap from sales decks (line-by-line)
 * 6. Removes orphaned empty slide divs
 * 7. Reports before/after slide counts
 */

const fs = require('fs');
const path = require('path');

const baseDir = __dirname;

function countSlides(content) {
  return (content.match(/<div class="slide[ "]/g) || []).length;
}

/**
 * Safely remove slides by processing line-by-line.
 * A slide line is one that starts with `<div class="slide` and contains the target eyebrow.
 * This avoids greedy regex consuming multiple slides.
 */
function removeSlidesByEyebrow(content, eyebrowText, headlineMatch) {
  const lines = content.split('\n');
  const filtered = [];
  let removed = 0;

  for (const line of lines) {
    const isSlide = line.includes('<div class="slide');
    const hasEyebrow = line.includes(`"eyebrow">${eyebrowText}<`);
    const hasHeadline = headlineMatch ? line.includes(headlineMatch) : true;

    if (isSlide && hasEyebrow && hasHeadline) {
      removed++;
      continue; // skip this line entirely
    }
    filtered.push(line);
  }

  return { content: filtered.join('\n'), removed };
}

/**
 * Remove orphaned slide header divs — lines that have a slide div with slide-header
 * but NO eyebrow and NO slide-content (broken/empty slides)
 */
function removeOrphanedSlides(content) {
  const lines = content.split('\n');
  const filtered = [];
  let removed = 0;

  for (const line of lines) {
    const trimmed = line.trim();
    // Match: starts with <div class="slide, has slide-header, has slide-num,
    // but does NOT have eyebrow or slide-content (it's just a bare header)
    if (trimmed.startsWith('<div class="slide slide--dark"><div class="slide-header">') &&
        trimmed.includes('slide-num') &&
        !trimmed.includes('eyebrow') &&
        !trimmed.includes('slide-content') &&
        !trimmed.includes('slide--accent') &&
        !trimmed.includes('slide--cta') &&
        !trimmed.includes('slide--title') &&
        trimmed.length < 300) {
      removed++;
      continue;
    }
    filtered.push(line);
  }

  return { content: filtered.join('\n'), removed };
}

function processFile(filePath, deckType) {
  let content = fs.readFileSync(filePath, 'utf8');
  const filename = path.basename(filePath, '.html');
  const beforeCount = countSlides(content);
  let changes = [];

  // ---- TEXT FIXES (all deck types) ----

  // Fix "14 agents" variants
  if (content.includes('14 agents deliberate')) {
    content = content.replace(/14 agents deliberate/g, '50+ agents deliberate');
    changes.push('fixed "14 agents" in table');
  }
  if (content.includes('14 C-suite AI agents')) {
    content = content.replace(/14 C-suite AI agents/g, '50+ specialized AI agents');
    changes.push('fixed "14 agents" in cards');
  }
  if (content.includes('14-agent Council')) {
    content = content.replace(/14-agent Council/g, '50+ agent Council');
    changes.push('fixed "14-agent" in solution');
  }
  // Metric cards: >14</div> followed by agent labels
  if (content.includes('>14</div>')) {
    content = content.replace(/>14<\/div>(\s*<div class="label">(?:AI Council Agents|Domain-Specific Agents|Agents Deliberate in Parallel|Agents with Dissent Tracking)<\/div>)/g,
      '>50+</div>$1');
    changes.push('fixed "14" in metric cards');
  }

  // Fix jurisdictions: 17 → 23
  if (content.includes('17 jurisdictions')) {
    content = content.replace(/17 jurisdictions/gi, '23 jurisdictions');
    changes.push('fixed jurisdictions 17→23');
  }
  if (content.includes('>17</div>') && content.includes('Jurisdictions')) {
    content = content.replace(/>17<\/div>(\s*<div class="label">Jurisdictions)/g, '>23</div>$1');
    changes.push('fixed "17" in jurisdiction metric');
  }

  // Fix SOC 2 date
  if (content.includes('Target Q2 2026')) {
    content = content.replace(/Target Q2 2026/g, 'In Progress');
    changes.push('fixed SOC 2 date');
  }

  // ---- SLIDE REMOVAL (sales + design-partner only) ----

  if (deckType === 'sales' || deckType === 'design-partner') {
    // Remove generic DEPLOYMENT slide ("Deploy Anywhere")
    const deployResult = removeSlidesByEyebrow(content, 'DEPLOYMENT', 'Deploy Anywhere');
    if (deployResult.removed > 0) {
      content = deployResult.content;
      changes.push(`removed ${deployResult.removed} DEPLOYMENT slide(s)`);
    }
  }

  if (deckType === 'sales') {
    // Remove generic COMPLIANCE slide (only the one titled "Enterprise Compliance Roadmap")
    const compResult = removeSlidesByEyebrow(content, 'COMPLIANCE', 'Enterprise Compliance Roadmap');
    if (compResult.removed > 0) {
      content = compResult.content;
      changes.push(`removed ${compResult.removed} generic COMPLIANCE slide(s)`);
    }
  }

  // Remove orphaned empty slide divs (broken HTML — bare slide headers with no content)
  const orphanResult = removeOrphanedSlides(content);
  if (orphanResult.removed > 0) {
    content = orphanResult.content;
    changes.push(`removed ${orphanResult.removed} orphaned slide div(s)`);
  }

  // Clean up excessive blank lines
  content = content.replace(/\n{4,}/g, '\n\n');

  const afterCount = countSlides(content);

  if (changes.length > 0) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`  ${filename}: ${beforeCount} → ${afterCount} slides (${changes.join(', ')})`);
  } else {
    console.log(`  ${filename}: ${beforeCount} slides (no changes)`);
  }

  return { before: beforeCount, after: afterCount, changed: changes.length > 0 };
}

// ============================================================================
// PROCESS ALL DECKS
// ============================================================================
let totalBefore = 0, totalAfter = 0, filesChanged = 0;

const deckTypes = {
  'investor': 'investor',
  'sales': 'sales',
  'design-partner': 'design-partner',
};

for (const [folder, deckType] of Object.entries(deckTypes)) {
  const dir = path.join(baseDir, folder);
  if (!fs.existsSync(dir)) continue;
  
  console.log(`\n${folder.toUpperCase()} DECKS:`);
  const files = fs.readdirSync(dir).filter(f => f.endsWith('.html'));
  for (const file of files) {
    const result = processFile(path.join(dir, file), deckType);
    totalBefore += result.before;
    totalAfter += result.after;
    if (result.changed) filesChanged++;
  }
}

// Standalone decks
console.log('\nSTANDALONE DECKS:');
const standaloneFiles = fs.readdirSync(baseDir).filter(f => f.endsWith('.html'));
for (const file of standaloneFiles) {
  const result = processFile(path.join(baseDir, file), 'standalone');
  totalBefore += result.before;
  totalAfter += result.after;
  if (result.changed) filesChanged++;
}

console.log(`\n${'='.repeat(60)}`);
console.log(`TOTAL: ${totalBefore} → ${totalAfter} slides across all decks`);
console.log(`${totalBefore - totalAfter} slides removed, ${filesChanged} files changed`);
