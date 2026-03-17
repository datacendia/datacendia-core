#!/usr/bin/env node
/**
 * Generate PPTX pitch decks for all 50 investor-targeted decks.
 * Uses pptxgenjs to create professional PowerPoint files.
 */
const PptxGenJS = require('pptxgenjs');
const fs = require('fs');
const path = require('path');
const shared = require('./shared-data.cjs');
const decks1 = require('./decks-01-17.cjs');
const decks2 = require('./decks-18-34.cjs');
const decks3 = require('./decks-35-50.cjs');

const ALL_DECKS = [...decks1, ...decks2, ...decks3];
const outDir = path.join(__dirname, 'pptx');
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

// Brand colors
const BG = '0A0E1A';
const GOLD = 'D4AF37';
const WHITE = 'FFFFFF';
const MUTED = '8B8FA3';
const CARD_BG = '141825';
const GREEN = '10B981';

// Screenshot library for PPTX slides
const SCREENSHOTS_DIR = path.join(__dirname, '..', 'screenshots');
const SCREENSHOT_DEFS = {
  'council-deliberation': { img: '02-council-deliberation.png', section: 'Multi-Agent Decision Engine', headline: 'Decisions Made by Specialized AI Agents', points: ['Role-specific agents: CFO, CISO, Legal, Strategy, Risk', 'Confidence scores and reasoning — dissent preserved', 'War Room, Governed, and Quick Brief modes'] },
  'decisions-list': { img: '05-decisions.png', section: 'Decision Audit Trail', headline: 'Every Decision Tracked with Full Evidence Chain', points: ['Complete searchable decision history', 'Full deliberation records linked to each decision', 'Trace any decision back to evidence in seconds'] },
  'compliance-dashboard': { img: '04-dcii-dashboard.png', section: 'Compliance Automation', headline: 'Continuous Compliance Across Frameworks', points: ['Real-time scoring against EU AI Act, GDPR, HIPAA', 'Automated gap detection and remediation', 'Audit-ready compliance bundles on demand'] },
  'post-deliberation': { img: '03-post-deliberation.png', section: 'Deliberation Transparency', headline: 'See Who Voted, How Confident, and Why', points: ['Each agent\'s vote, confidence, and reasoning', 'Dissenting opinions surfaced, not buried', 'Board-ready executive summaries'] },
  'executive-summary': { img: '08-executive-summary.png', section: 'Board-Ready Output', headline: 'One-Click Executive Summaries', points: ['Auto-generated board-ready language', 'Every claim links to source data and reasoning', 'Export to PDF or share via secure link'] },
  'pulse': { img: '13-pulse.png', section: 'Real-Time Monitoring', headline: 'Organizational Health at a Glance', points: ['Health score across data, ops, security, people', 'Latency and system status monitoring', 'Anomaly detection with one-click escalation'] },
  'graph-explorer': { img: '07-graph-explorer.png', section: 'Knowledge Graph', headline: 'See How Data, Decisions, and People Connect', points: ['Interactive entity and relationship mapping', 'Data lineage tracing upstream and downstream', 'Impact analysis before any change'] },
  'dashboard': { img: '01-dashboard.png', section: 'Command Center', headline: 'Enterprise Decision Intelligence Hub', points: ['Active deliberations, health scores, system status', 'One-click access to all platform capabilities', 'Role-based views for every stakeholder'] },
  'gateway': { img: '06-gateway-dashboard.png', section: 'AI Governance Gateway', headline: 'Every AI Interaction Logged and Auditable', points: ['Full audit trail for all AI requests/responses', 'PII detection and content policy enforcement', 'Real-time token usage and cost tracking'] },
};

const SCREENSHOT_MAP = {
  '_universal': ['council-deliberation', 'decisions-list'],
  'compliance|regulation|audit|gdpr|hipaa|dora|soc|eu-ai|governance': ['compliance-dashboard'],
  'sovereign|air-gap|defense|government|classified|military': ['dashboard'],
  'multi-agent|council|deliberat|agent': ['post-deliberation', 'executive-summary'],
  'healthcare|pharma|clinical': ['pulse'],
  'financial|banking|insurance|risk': ['pulse'],
  'data|lineage|silo|zero-copy|snowflake|sap|salesforce|integration': ['graph-explorer'],
  'gateway|api|deploy|cloud|private|on.prem|hybrid': ['dashboard', 'gateway'],
  'speed|decision|roi|business.model|competitive|moat|fortune|enterprise|mid.market': ['dashboard'],
};

function getScreenshotsForDeck(deck) {
  const keys = new Set();
  for (const k of SCREENSHOT_MAP['_universal']) keys.add(k);
  const text = `${deck.id} ${deck.title} ${deck.sub} ${deck.problem} ${deck.solution}`;
  for (const [pattern, imgKeys] of Object.entries(SCREENSHOT_MAP)) {
    if (pattern === '_universal') continue;
    if (new RegExp(pattern, 'i').test(text)) {
      for (const k of imgKeys) keys.add(k);
    }
  }
  return [...keys].slice(0, 2).map(k => SCREENSHOT_DEFS[k]).filter(Boolean);
}

function buildPPTX(deck, idx) {
  const pptx = new PptxGenJS();
  pptx.defineLayout({ name: 'WIDE', width: 13.33, height: 7.5 });
  pptx.layout = 'WIDE';
  pptx.author = 'Datacendia';
  pptx.company = 'Datacendia, LLC';
  pptx.subject = deck.title;
  pptx.title = `Datacendia - ${deck.title}`;

  const addFooter = (slide) => {
    slide.addText('\u00A9 2024-2026 Datacendia, LLC', { x: 0.5, y: 7.0, w: 4, h: 0.3, fontSize: 8, color: MUTED });
    slide.addText('datacendia.com', { x: 9, y: 7.0, w: 4, h: 0.3, fontSize: 8, color: MUTED, align: 'right' });
  };

  const addLogo = (slide) => {
    slide.addText('DATACENDIA', { x: 0.5, y: 0.3, w: 3, h: 0.3, fontSize: 10, color: GOLD, bold: true, letterSpacing: 3 });
  };

  // Slide 1: Title
  let s1 = pptx.addSlide();
  s1.background = { color: BG };
  addLogo(s1);
  s1.addText('Confidential', { x: 10, y: 0.3, w: 2.5, h: 0.3, fontSize: 8, color: MUTED, align: 'right' });
  s1.addText('DATACENDIA', { x: 0.5, y: 2.2, w: 12, h: 0.4, fontSize: 11, color: GOLD, letterSpacing: 3, align: 'center' });
  s1.addText(deck.title, { x: 0.5, y: 2.8, w: 12, h: 1.2, fontSize: 36, color: WHITE, bold: true, align: 'center' });
  s1.addText(deck.sub, { x: 1.5, y: 4.2, w: 10, h: 0.6, fontSize: 16, color: MUTED, align: 'center' });
  s1.addShape(pptx.ShapeType.line, { x: 5.5, y: 5.0, w: 2.3, h: 0, line: { color: GOLD, width: 2 } });
  s1.addText('Decision Crisis Immunization Infrastructure', { x: 2, y: 5.3, w: 9, h: 0.4, fontSize: 12, color: MUTED, align: 'center' });
  addFooter(s1);

  // Slide 2: Regulatory Drivers
  let s2 = pptx.addSlide();
  s2.background = { color: BG };
  addLogo(s2);
  s2.addText('WHY NOW', { x: 0.8, y: 1.0, w: 4, h: 0.3, fontSize: 11, color: GOLD, letterSpacing: 3 });
  const cardW = 2.7, cardH = 1.6, cardGap = 0.3, startX = 0.8;
  deck.drivers.forEach((d, i) => {
    const cx = startX + i * (cardW + cardGap);
    s2.addShape(pptx.ShapeType.roundRect, { x: cx, y: 1.8, w: cardW, h: cardH, fill: { color: CARD_BG }, rectRadius: 0.1 });
    s2.addText(d.v, { x: cx, y: 2.0, w: cardW, h: 0.7, fontSize: 28, color: GOLD, bold: true, align: 'center' });
    s2.addText(d.l, { x: cx + 0.2, y: 2.7, w: cardW - 0.4, h: 0.5, fontSize: 10, color: MUTED, align: 'center', wrap: true });
  });
  addFooter(s2);

  // Slide 3: Problem
  let s3 = pptx.addSlide();
  s3.background = { color: BG };
  addLogo(s3);
  s3.addText('THE PROBLEM', { x: 0.8, y: 1.0, w: 4, h: 0.3, fontSize: 11, color: GOLD, letterSpacing: 3 });
  s3.addText(deck.problem, { x: 0.8, y: 1.5, w: 11, h: 0.6, fontSize: 24, color: WHITE, bold: true });
  const bulletRows = deck.bullets.map(b => ({ text: b, options: { fontSize: 13, color: MUTED, bullet: { code: '2192', color: GOLD }, lineSpacingMultiple: 1.5 } }));
  s3.addText(bulletRows, { x: 0.8, y: 2.4, w: 11, h: 4, valign: 'top' });
  addFooter(s3);

  // Slide 4: Solution + Use Cases
  let s4 = pptx.addSlide();
  s4.background = { color: BG };
  addLogo(s4);
  s4.addText('THE SOLUTION', { x: 0.8, y: 1.0, w: 4, h: 0.3, fontSize: 11, color: GOLD, letterSpacing: 3 });
  s4.addText('How Datacendia Solves This', { x: 0.8, y: 1.5, w: 11, h: 0.6, fontSize: 24, color: WHITE, bold: true });
  s4.addText(deck.solution, { x: 0.8, y: 2.4, w: 5.5, h: 3, fontSize: 13, color: MUTED, lineSpacingMultiple: 1.6, valign: 'top' });
  s4.addShape(pptx.ShapeType.roundRect, { x: 7, y: 2.4, w: 5.5, h: 3.5, fill: { color: CARD_BG }, rectRadius: 0.1 });
  s4.addText('Key Use Cases', { x: 7.3, y: 2.6, w: 5, h: 0.4, fontSize: 14, color: GOLD, bold: true });
  const caseRows = deck.cases.map(c => ({ text: c, options: { fontSize: 11, color: MUTED, bullet: { code: '2192', color: GOLD }, lineSpacingMultiple: 1.4 } }));
  s4.addText(caseRows, { x: 7.3, y: 3.1, w: 4.8, h: 2.5, valign: 'top' });
  addFooter(s4);

  // Slide 5: Investor Angle
  let s5 = pptx.addSlide();
  s5.background = { color: BG };
  addLogo(s5);
  s5.addText('INVESTOR THESIS', { x: 0.8, y: 1.0, w: 4, h: 0.3, fontSize: 11, color: GOLD, letterSpacing: 3 });
  s5.addText('Why This Is a Compelling Investment', { x: 0.8, y: 1.5, w: 11, h: 0.6, fontSize: 24, color: WHITE, bold: true });
  s5.addText(deck.angle, { x: 0.8, y: 2.4, w: 5.5, h: 3, fontSize: 13, color: MUTED, lineSpacingMultiple: 1.7, valign: 'top' });
  s5.addShape(pptx.ShapeType.roundRect, { x: 7, y: 2.4, w: 5.5, h: 3.5, fill: { color: CARD_BG }, rectRadius: 0.1 });
  s5.addText('Platform Proof', { x: 7.3, y: 2.6, w: 5, h: 0.4, fontSize: 14, color: GOLD, bold: true });
  const proofItems = [
    { text: '205K+ passing tests', options: { fontSize: 12, color: MUTED, bullet: { code: '2713', color: GREEN } } },
    { text: '156 validated API endpoints', options: { fontSize: 12, color: MUTED, bullet: { code: '2713', color: GREEN } } },
    { text: '50+ agent presets', options: { fontSize: 12, color: MUTED, bullet: { code: '2713', color: GREEN } } },
    { text: '23 jurisdictions covered', options: { fontSize: 12, color: MUTED, bullet: { code: '2713', color: GREEN } } },
    { text: '4 deployment modes', options: { fontSize: 12, color: MUTED, bullet: { code: '2713', color: GREEN } } },
    { text: 'Live at app.datacendia.com', options: { fontSize: 12, color: MUTED, bullet: { code: '2713', color: GREEN } } },
  ];
  s5.addText(proofItems, { x: 7.3, y: 3.2, w: 4.8, h: 2.5, valign: 'top', lineSpacingMultiple: 1.5 });
  addFooter(s5);

  // Slide 6: Founder
  let s6 = pptx.addSlide();
  s6.background = { color: BG };
  addLogo(s6);
  s6.addText('FOUNDER', { x: 0.8, y: 1.0, w: 4, h: 0.3, fontSize: 11, color: GOLD, letterSpacing: 3 });
  s6.addText(`${shared.FOUNDER.name} \u2014 ${shared.FOUNDER.title}`, { x: 0.8, y: 1.5, w: 11, h: 0.6, fontSize: 24, color: WHITE, bold: true });
  const fRows = shared.FOUNDER.bullets.map(b => ({ text: b, options: { fontSize: 12, color: MUTED, bullet: { code: '2192', color: GOLD }, lineSpacingMultiple: 1.5 } }));
  s6.addText(fRows, { x: 0.8, y: 2.4, w: 5.5, h: 3, valign: 'top' });
  s6.addShape(pptx.ShapeType.roundRect, { x: 7, y: 2.4, w: 5.5, h: 2.5, fill: { color: CARD_BG }, rectRadius: 0.1 });
  s6.addText('Why This Founder', { x: 7.3, y: 2.6, w: 5, h: 0.4, fontSize: 14, color: GOLD, bold: true });
  s6.addText(shared.FOUNDER.whyCard, { x: 7.3, y: 3.2, w: 4.8, h: 1.5, fontSize: 12, color: MUTED, lineSpacingMultiple: 1.5, valign: 'top' });
  addFooter(s6);

  // Slide 7: The Ask
  let s7 = pptx.addSlide();
  s7.background = { color: BG };
  addLogo(s7);
  s7.addText('THE ASK', { x: 0.8, y: 1.0, w: 4, h: 0.3, fontSize: 11, color: GOLD, letterSpacing: 3 });
  s7.addText(shared.ASK.headline, { x: 0.8, y: 1.5, w: 11, h: 0.6, fontSize: 24, color: WHITE, bold: true });
  shared.ASK.cards.forEach((c, i) => {
    const cx = 0.8 + i * 4;
    s7.addShape(pptx.ShapeType.roundRect, { x: cx, y: 2.5, w: 3.6, h: 2.2, fill: { color: CARD_BG }, rectRadius: 0.1 });
    s7.addText(c.title, { x: cx + 0.3, y: 2.7, w: 3, h: 0.4, fontSize: 14, color: GOLD, bold: true });
    s7.addText(c.text, { x: cx + 0.3, y: 3.2, w: 3, h: 1.3, fontSize: 11, color: MUTED, lineSpacingMultiple: 1.4, valign: 'top' });
  });
  s7.addText(shared.ASK.footer, { x: 1, y: 5.2, w: 11, h: 0.4, fontSize: 12, color: MUTED, align: 'center' });
  addFooter(s7);

  // Screenshot slides (before CTA)
  const screenshots = getScreenshotsForDeck(deck);
  for (const ss of screenshots) {
    const imgPath = path.join(SCREENSHOTS_DIR, ss.img);
    if (!fs.existsSync(imgPath)) continue;
    
    let ssc = pptx.addSlide();
    ssc.background = { color: BG };
    addLogo(ssc);
    ssc.addText('PLATFORM PROOF', { x: 9, y: 0.3, w: 4, h: 0.3, fontSize: 8, color: MUTED, align: 'right' });
    
    // Left column: text
    ssc.addText(ss.section.toUpperCase(), { x: 0.8, y: 1.2, w: 4.5, h: 0.3, fontSize: 11, color: GOLD, letterSpacing: 3 });
    ssc.addText(ss.headline, { x: 0.8, y: 1.7, w: 4.5, h: 1.0, fontSize: 20, color: WHITE, bold: true });
    const ssPoints = ss.points.map(p => ({ text: p, options: { fontSize: 11, color: MUTED, bullet: { code: '2192', color: GOLD }, lineSpacingMultiple: 1.5 } }));
    ssc.addText(ssPoints, { x: 0.8, y: 3.0, w: 4.5, h: 3.5, valign: 'top' });
    
    // Right column: screenshot image
    ssc.addImage({ path: imgPath, x: 5.8, y: 1.2, w: 7.0, h: 5.3 });
    
    addFooter(ssc);
  }

  // Slide 8: CTA
  let s8 = pptx.addSlide();
  s8.background = { color: BG };
  addLogo(s8);
  s8.addText('NEXT STEPS', { x: 0.5, y: 2.0, w: 12, h: 0.3, fontSize: 11, color: GOLD, letterSpacing: 3, align: 'center' });
  s8.addText('Let\u2019s Talk', { x: 0.5, y: 2.5, w: 12, h: 0.8, fontSize: 36, color: WHITE, bold: true, align: 'center' });
  s8.addText(deck.sub, { x: 1.5, y: 3.5, w: 10, h: 0.5, fontSize: 14, color: MUTED, align: 'center' });
  const ctaItems = ['Schedule Deep Dive', 'Technical Demo', 'Data Room Access', 'Try Live Demo \u2192'];
  ctaItems.forEach((t, i) => {
    const cx = 2.5 + i * 2.2;
    const isLast = i === ctaItems.length - 1;
    s8.addShape(pptx.ShapeType.roundRect, { x: cx, y: 4.3, w: 2, h: 0.5, fill: { color: isLast ? GOLD : CARD_BG }, rectRadius: 0.05 });
    s8.addText(t, { x: cx, y: 4.3, w: 2, h: 0.5, fontSize: 11, color: isLast ? BG : GOLD, bold: true, align: 'center', valign: 'middle' });
  });
  s8.addText('contact@datacendia.com | datacendia.com', { x: 2, y: 5.5, w: 9, h: 0.4, fontSize: 12, color: MUTED, align: 'center' });
  addFooter(s8);

  return pptx;
}

async function main() {
  console.log(`Generating ${ALL_DECKS.length} PPTX investor decks...\n`);
  for (let i = 0; i < ALL_DECKS.length; i++) {
    const deck = ALL_DECKS[i];
    const pptx = buildPPTX(deck, i);
    const filename = `${deck.id}.pptx`;
    await pptx.writeFile({ fileName: path.join(outDir, filename) });
    console.log(`  ${filename}`);
  }
  console.log(`\nDone! ${ALL_DECKS.length} PPTX decks in ${outDir}`);
}

main().catch(e => { console.error(e); process.exit(1); });
