#!/usr/bin/env node
/**
 * Design Partner Email Generator
 * Generates personalized outreach emails for potential design partners and enterprise clients.
 * Similar to _gen-emails.cjs but for client/partner outreach instead of investors.
 */
const fs = require('fs');
const path = require('path');

const partners = require('./design-partners.cjs');

// Map vertical to design partner deck path
const deckMap = {
  'healthcare': 'design-partner/01-healthcare',
  'financial-services': 'design-partner/02-financial-services',
  'legal': 'design-partner/03-legal',
  'government': 'design-partner/04-government',
  'defense': 'design-partner/05-defense',
  'energy-utilities': 'design-partner/06-energy-utilities',
  'insurance': 'design-partner/07-insurance',
  'pharma': 'design-partner/08-pharma',
  'risk-management': 'design-partner/09-risk-management',
  'compliance': 'design-partner/10-compliance-officers',
  'consulting': 'design-partner/10-compliance-officers',
  'technology': 'design-partner/11-it-operations',
  'telecom': 'design-partner/11-it-operations',
  'strategy': 'design-partner/12-strategy-teams',
  'automotive': 'design-partner/13-operations-leaders',
  'aerospace': 'design-partner/13-operations-leaders',
  'consumer-goods': 'design-partner/13-operations-leaders',
  'logistics': 'design-partner/13-operations-leaders',
  'sovereign': 'design-partner/04-government',
};

// Vertical display names
const verticalNames = {
  'healthcare': 'Healthcare',
  'financial-services': 'Financial Services',
  'legal': 'Legal',
  'government': 'Government',
  'defense': 'Defense & National Security',
  'energy-utilities': 'Energy & Utilities',
  'insurance': 'Insurance',
  'pharma': 'Pharmaceutical',
  'risk-management': 'Risk Management',
  'compliance': 'Compliance & RegTech',
  'consulting': 'Consulting & Advisory',
  'technology': 'Technology',
  'telecom': 'Telecommunications',
  'strategy': 'Strategy & Consulting',
  'automotive': 'Automotive & Manufacturing',
  'aerospace': 'Aerospace & Defense',
  'consumer-goods': 'Consumer Goods & Supply Chain',
  'logistics': 'Logistics & Supply Chain',
  'sovereign': 'Sovereign & Government',
};

// What's built section — consistent across all emails (verifiable claims only)
const whatsBuilt = [
  '- Production platform with 205K+ passing tests, 156 validated API endpoints, live at app.datacendia.com',
  '- Multi-agent deliberation: 50+ specialized agent presets (CFO, CISO, Legal, Risk, Strategy) with structured dissent',
  '- Cryptographic decision evidence: Ed25519 signatures, Merkle trees, RFC 3161 timestamping',
  '- 4 deployment modes: cloud, private cloud, on-prem, air-gapped — data never leaves your infrastructure',
  '- Compliance mapping across 23 jurisdictions (EU AI Act, DORA, GDPR, HIPAA, SOC 2, ISO 27001)',
];

// Design partner benefits — consistent across all emails
const partnerBenefits = [
  '- Direct influence on product roadmap for your industry',
  '- Priority support and dedicated engineering resources',
  '- Preferred pricing locked at design partner rates (90-day pilot)',
  '- Co-marketing — joint case studies and thought leadership',
  '- Weekly syncs with our engineering team',
];

// Vertical-specific regulatory hooks
const regulatoryHooks = {
  'healthcare': 'HIPAA compliance, FDA AI guidance, and CMS auditability requirements',
  'financial-services': 'DORA operational resilience, SEC AI scrutiny, and Basel III risk governance',
  'legal': 'EU AI Act transparency requirements and client accountability standards',
  'government': 'Executive Order 14110, FedRAMP, NIST 800-53, and FISMA requirements',
  'defense': 'ITAR compliance, CMMC, and classified environment governance (TPM 2.0, air-gapped)',
  'energy-utilities': 'NERC CIP critical infrastructure standards and environmental compliance',
  'insurance': 'State insurance commissioner scrutiny, EU AI Act, and DORA requirements',
  'pharma': 'FDA documentation requirements, EMA regulatory submissions, and GxP compliance',
  'risk-management': 'SEC, ESMA, and global regulatory scrutiny of AI-driven risk assessments',
  'compliance': 'SOC 2, ISO 27001, GDPR, and cross-jurisdiction regulatory compliance',
  'consulting': 'Client AI governance assessments and multi-framework compliance verification',
  'technology': 'EU AI Act high-risk classification and global AI governance requirements',
  'telecom': 'Ofcom, FCC, and EU regulatory scrutiny of AI-driven network operations',
  'strategy': 'Client accountability for AI-informed strategic recommendations',
  'automotive': 'EU AI Act high-risk classification for autonomous and safety-critical AI',
  'aerospace': 'Safety-critical AI governance and defense classification requirements',
  'consumer-goods': 'ESG reporting accountability and supply chain AI governance',
  'logistics': 'Multi-jurisdiction AI governance across global operations',
  'sovereign': 'National AI strategy requirements and sovereign data governance',
};

function generateEmail(p) {
  const vertName = verticalNames[p.vertical] || p.vertical;
  const deckPath = deckMap[p.vertical] || 'design-partner/01-healthcare';
  const regHook = regulatoryHooks[p.vertical] || 'global AI governance requirements';

  const lines = [];
  lines.push(`### ${p.company}`);
  lines.push(`**Deck:** \`${deckPath}.pptx\``);
  lines.push(`*${vertName} · ${p.hq} · ${p.size}*`);
  lines.push('');
  lines.push(`**Subject:** Design Partnership — Datacendia × ${p.company}`);
  lines.push('');
  lines.push('**Body:**');
  lines.push('');
  lines.push('Hi [FIRST NAME],');
  lines.push('');
  lines.push(`I'm Stuart Rainey, founder of Datacendia. We've built decision evidence infrastructure for AI systems — cryptographic proof of every AI-assisted decision, designed for regulated enterprises.`);
  lines.push('');
  lines.push(`**Why ${p.company}:** ${p.whyThem} The regulatory environment is accelerating — ${regHook} — and enterprises need purpose-built governance infrastructure, not DIY solutions.`);
  lines.push('');

  lines.push("**What's built (not idea-stage):**");
  for (const line of whatsBuilt) {
    lines.push(line);
  }
  lines.push('');

  lines.push('**What design partners get:**');
  for (const line of partnerBenefits) {
    lines.push(line);
  }
  lines.push('');

  lines.push(`**The ask:** A 90-day design partnership. We deploy Datacendia on a real decision workflow in your organization, with dedicated engineering support. If the platform doesn't identify at least 3 critical risks you missed, we refund the pilot fee.`);
  lines.push('');
  lines.push(`I've attached a design partner deck for ${vertName}. Happy to schedule a 20-minute discovery call or live demo at your convenience.`);
  lines.push('');
  lines.push('Best,');
  lines.push('Stuart Rainey');
  lines.push('Founder & CEO, Datacendia');
  lines.push('contact@datacendia.com | datacendia.com | app.datacendia.com');

  return lines.join('\n');
}

// ── Generate ──
const output = [];
output.push('# Design Partner & Enterprise Client Emails');
output.push('');
output.push(`> Generated ${new Date().toISOString().split('T')[0]} — ${partners.length} personalized outreach emails`);
output.push('> Replace \`[FIRST NAME]\` with the actual contact name before sending.');
output.push('> Attach the corresponding PDF (not PPTX) from the deck path listed.');
output.push('');
output.push('---');
output.push('');

// Track vertical distribution
const verticalCounts = {};

for (const p of partners) {
  output.push(generateEmail(p));
  output.push('');
  output.push('---');
  output.push('');
  verticalCounts[p.vertical] = (verticalCounts[p.vertical] || 0) + 1;
}

const outPath = path.join(__dirname, 'DESIGN-PARTNER-EMAILS.md');
fs.writeFileSync(outPath, output.join('\n'), 'utf8');

console.log(`Generated ${partners.length} personalized design partner emails`);
console.log('Vertical distribution:');
const sorted = Object.entries(verticalCounts).sort((a, b) => b[1] - a[1]);
for (const [v, c] of sorted) {
  console.log(`  ${verticalNames[v] || v}: ${c}`);
}
console.log(`\nWritten to ${outPath}`);
