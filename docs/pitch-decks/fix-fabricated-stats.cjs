#!/usr/bin/env node
/**
 * Fix fabricated statistics across sales and design-partner decks.
 * Replaces unsourced market sizes, percentages, and dollar amounts
 * with real regulatory facts and product proof points.
 */

const fs = require('fs');
const path = require('path');

const baseDir = __dirname;

// Map of fabricated value+label → replacement value+label
// Format: { 'old_value|||old_label': { value: 'new_value', label: 'new_label' } }
const REPLACEMENTS = {
  // Generic compliance stats (appear in multiple decks)
  '$5.2M|||Avg Non-Compliance Cost': { value: 'EU AI Act', label: 'Aug 2025 Enforcement Deadline' },
  '$5.2M|||Avg Cost of Non-Compliance': { value: 'EU AI Act', label: 'Aug 2025 Enforcement Deadline' },
  '72%|||Failing AI Audits': { value: '€35M', label: 'Max EU AI Act Penalty (Art. 99)' },
  '72%|||Enterprises Failing AI Audits': { value: '€35M', label: 'Max EU AI Act Penalty (Art. 99)' },
  '1,200+|||Hours/Year Manual Compliance': { value: '0', label: 'Competitors w/ Crypto Decision Evidence' },

  // Banking
  '$10.4B|||Regulatory Fines 2024': { value: 'DORA', label: 'Jan 2025 — AI Operational Resilience' },
  '$10.4B|||Total Regulatory Fines 2024': { value: 'DORA', label: 'Jan 2025 — AI Operational Resilience' },
  '94%|||Banks Lack AI Audit Trails': { value: '0', label: 'AI Platforms w/ Crypto Decision Evidence' },

  // Insurance
  '$2.8B|||InsurTech AI Market 2027': { value: 'Solvency II', label: 'AI Model Risk Governance Required' },
  '$4.1M|||Avg Regulatory Fine': { value: 'DORA', label: 'Jan 2025 — Operational Resilience' },
  '67%|||Claims Using AI w/o Audit': { value: '0', label: 'AI Platforms w/ Claims Decision Evidence' },

  // Pharma
  '$2.6B|||Avg Drug Development Cost': { value: 'EU AI Act', label: 'Healthcare AI = High-Risk (Annex III)' },

  // Manufacturing
  '$4.4T|||Global Supply Chain Disruption Cost': { value: 'EU AI Act', label: 'Industrial AI Oversight Required' },
  '73%|||Manufacturers Lack AI Governance': { value: '0', label: 'AI Platforms w/ Supply Chain Decision Evidence' },

  // Retail
  '$3.2M|||Avg Data Breach Cost Retail': { value: 'GDPR', label: '4% Revenue Penalty for Data Violations' },
  '$5.9T|||Global Retail Market': { value: 'EU AI Act', label: 'AI Transparency Required for Consumers' },
  '68%|||Retailers Using AI w/o Governance': { value: '0', label: 'AI Platforms w/ Retail Decision Evidence' },

  // Decision speed
  '$1.8M|||Cost of Delayed Strategic Decisions': { value: '205K+', label: 'Passing Tests — Production Ready' },
  '67%|||Decisions Delayed by Missing Data': { value: '156', label: 'Validated API Endpoints' },

  // AI trust
  '78%|||Executives Don\'t Trust AI Recommendations': { value: 'EU AI Act', label: 'Explainability Required for High-Risk AI' },
  '82%|||AI Decisions Cannot Be Explained': { value: '0', label: 'Competitors w/ Dissent Tracking' },
  '91%|||Boards Demanding AI Accountability': { value: '€35M', label: 'Max EU AI Act Penalty (Art. 99)' },
};

let totalFixed = 0;
let filesFixed = 0;

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  const filename = path.basename(filePath, '.html');
  let fixCount = 0;

  for (const [key, replacement] of Object.entries(REPLACEMENTS)) {
    const [oldValue, oldLabel] = key.split('|||');
    const searchPattern = `<div class="value">${oldValue}</div><div class="label">${oldLabel}</div>`;
    
    if (content.includes(searchPattern)) {
      const newPattern = `<div class="value">${replacement.value}</div><div class="label">${replacement.label}</div>`;
      content = content.replace(searchPattern, newPattern);
      fixCount++;
    }
  }

  if (fixCount > 0) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`  ${filename}: ${fixCount} fabricated stat(s) replaced`);
    totalFixed += fixCount;
    filesFixed++;
  }
}

// Process sales decks
console.log('SALES DECKS:');
const salesDir = path.join(baseDir, 'sales');
if (fs.existsSync(salesDir)) {
  for (const file of fs.readdirSync(salesDir).filter(f => f.endsWith('.html'))) {
    processFile(path.join(salesDir, file));
  }
}

// Process design-partner decks
console.log('\nDESIGN-PARTNER DECKS:');
const dpDir = path.join(baseDir, 'design-partner');
if (fs.existsSync(dpDir)) {
  for (const file of fs.readdirSync(dpDir).filter(f => f.endsWith('.html'))) {
    processFile(path.join(dpDir, file));
  }
}

// Process standalone decks
console.log('\nSTANDALONE DECKS:');
for (const file of fs.readdirSync(baseDir).filter(f => f.endsWith('.html'))) {
  processFile(path.join(baseDir, file));
}

console.log(`\n${'='.repeat(50)}`);
console.log(`${totalFixed} fabricated stats replaced across ${filesFixed} files`);
