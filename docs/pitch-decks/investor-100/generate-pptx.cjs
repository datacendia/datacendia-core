#!/usr/bin/env node
/**
 * Generate personalized PPTX pitch decks for 100 named investors/VCs.
 * Each deck embeds screenshots as base64 and is tailored to the investor.
 */
const PptxGenJS = require('pptxgenjs');
const fs = require('fs');
const path = require('path');
const shared = require('./shared-data.cjs');
const inv1 = require('./investors-001-025.cjs');
const inv2 = require('./investors-026-050.cjs');
const inv3 = require('./investors-051-075.cjs');
const inv4 = require('./investors-076-100.cjs');

const ALL = [...inv1, ...inv2, ...inv3, ...inv4];
const outDir = path.join(__dirname, 'pptx');
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

// Brand colors
const BG = '0A0E1A';
const GOLD = 'D4AF37';
const WHITE = 'FFFFFF';
const MUTED = '8B8FA3';
const CARD_BG = '141825';
const GREEN = '10B981';

// Screenshot library
const SCREENSHOTS_DIR = path.join(__dirname, '..', 'screenshots');
const SCREENSHOT_DEFS = {
  'council': { img: '02-council-deliberation.png', section: 'Multi-Agent Decision Engine', headline: 'Decisions Made by Specialized AI Agents', points: ['Role-specific agents: CFO, CISO, Legal, Strategy, Risk', 'Confidence scores and reasoning — dissent preserved', 'War Room, Governed, and Quick Brief modes'] },
  'decisions': { img: '05-decisions.png', section: 'Decision Audit Trail', headline: 'Every Decision Tracked with Full Evidence Chain', points: ['Complete searchable decision history', 'Full deliberation records linked to each decision', 'Trace any decision back to evidence in seconds'] },
  'compliance': { img: '04-dcii-dashboard.png', section: 'Compliance Automation', headline: 'Continuous Compliance Across Frameworks', points: ['Real-time scoring against EU AI Act, GDPR, HIPAA', 'Automated gap detection and remediation', 'Audit-ready compliance bundles on demand'] },
  'dashboard': { img: '01-dashboard.png', section: 'Command Center', headline: 'Enterprise Decision Intelligence Hub', points: ['Active deliberations, health scores, system status', 'One-click access to all platform capabilities', 'Role-based views for every stakeholder'] },
  'gateway': { img: '06-gateway-dashboard.png', section: 'AI Governance Gateway', headline: 'Every AI Interaction Logged and Auditable', points: ['Full audit trail for all AI requests/responses', 'PII detection and content policy enforcement', 'Real-time token usage and cost tracking'] },
  'pulse': { img: '13-pulse.png', section: 'Real-Time Monitoring', headline: 'Organizational Health at a Glance', points: ['Health score across data, ops, security, people', 'Latency and system status monitoring', 'Anomaly detection with one-click escalation'] },
  'graph': { img: '07-graph-explorer.png', section: 'Knowledge Graph', headline: 'See How Data, Decisions, and People Connect', points: ['Interactive entity and relationship mapping', 'Data lineage tracing upstream and downstream', 'Impact analysis before any change'] },
};

// Map investor sectors to screenshots
const SECTOR_MAP = {
  'security|cyber|zero-trust': ['council', 'gateway'],
  'defense|intelligence|military|govern': ['dashboard', 'council'],
  'financial|fintech|regtech|banking|insurance': ['compliance', 'decisions'],
  'enterprise|saas|infrastructure': ['dashboard', 'decisions'],
  'ai|deep.tech|ml': ['council', 'gateway'],
  'health|pharma|clinical': ['pulse', 'compliance'],
  'european|eu|nordic|german': ['compliance', 'council'],
  'impact|esg|responsible|sustainable|climate': ['pulse', 'dashboard'],
  'open.source': ['graph', 'council'],
  'data': ['graph', 'decisions'],
  'sovereign|wealth': ['dashboard', 'compliance'],
  'corporate|strategic': ['gateway', 'dashboard'],
};

function getScreenshots(inv) {
  const keys = new Set(['council', 'decisions']); // universal
  const text = `${inv.sector} ${inv.keyAngle} ${inv.type} ${inv.firm}`;
  for (const [pattern, imgKeys] of Object.entries(SECTOR_MAP)) {
    if (new RegExp(pattern, 'i').test(text)) {
      for (const k of imgKeys) keys.add(k);
    }
  }
  return [...keys].slice(0, 2).map(k => SCREENSHOT_DEFS[k]).filter(Boolean);
}

// Pre-load screenshot images as base64
const imgCache = {};
function getImgBase64(filename) {
  if (imgCache[filename]) return imgCache[filename];
  const p = path.join(SCREENSHOTS_DIR, filename);
  if (!fs.existsSync(p)) return null;
  imgCache[filename] = fs.readFileSync(p).toString('base64');
  return imgCache[filename];
}

function buildPPTX(inv) {
  const pptx = new PptxGenJS();
  pptx.defineLayout({ name: 'WIDE', width: 13.33, height: 7.5 });
  pptx.layout = 'WIDE';
  pptx.author = 'Datacendia';
  pptx.company = 'Datacendia, LLC';
  pptx.title = `Datacendia for ${inv.firm}`;

  const addFooter = (slide) => {
    slide.addText('\u00A9 2024\u20132026 Datacendia, LLC', { x: 0.5, y: 7.0, w: 4, h: 0.3, fontSize: 8, color: MUTED });
    slide.addText('datacendia.com', { x: 9, y: 7.0, w: 4, h: 0.3, fontSize: 8, color: MUTED, align: 'right' });
  };
  const addLogo = (slide) => {
    slide.addText('DATACENDIA', { x: 0.5, y: 0.3, w: 3, h: 0.3, fontSize: 10, color: GOLD, bold: true, letterSpacing: 3 });
  };

  // Slide 1: Title
  let s1 = pptx.addSlide();
  s1.background = { color: BG };
  addLogo(s1);
  s1.addText(`PREPARED FOR ${inv.firm.toUpperCase()}`, { x: 7, y: 0.3, w: 6, h: 0.3, fontSize: 8, color: MUTED, align: 'right' });
  // Investor badge
  s1.addShape(pptx.ShapeType.roundRect, { x: 4.5, y: 1.8, w: 4.3, h: 0.45, fill: { color: GOLD }, rectRadius: 0.04 });
  s1.addText(`PREPARED FOR ${inv.firm.toUpperCase()}`, { x: 4.5, y: 1.8, w: 4.3, h: 0.45, fontSize: 10, color: BG, bold: true, align: 'center', valign: 'middle' });
  s1.addText('DATACENDIA', { x: 0.5, y: 2.5, w: 12, h: 0.4, fontSize: 11, color: GOLD, letterSpacing: 3, align: 'center' });
  s1.addText(`Datacendia for ${inv.firm}`, { x: 0.5, y: 3.0, w: 12, h: 1.2, fontSize: 34, color: WHITE, bold: true, align: 'center' });
  s1.addText('Decision Crisis Immunization Infrastructure', { x: 1.5, y: 4.4, w: 10, h: 0.5, fontSize: 15, color: MUTED, align: 'center' });
  s1.addShape(pptx.ShapeType.line, { x: 5.5, y: 5.1, w: 2.3, h: 0, line: { color: GOLD, width: 2 } });
  s1.addText(`${inv.type} \u00B7 ${inv.hq} \u00B7 ${inv.stage} \u00B7 ${inv.aum} AUM`, { x: 2, y: 5.4, w: 9, h: 0.4, fontSize: 12, color: MUTED, align: 'center' });
  addFooter(s1);

  // Slide 2: Why This Investor
  let s2 = pptx.addSlide();
  s2.background = { color: BG };
  addLogo(s2);
  s2.addText('INVESTOR ALIGNMENT', { x: 9, y: 0.3, w: 4, h: 0.3, fontSize: 8, color: MUTED, align: 'right' });
  s2.addText(`WHY ${inv.firm.toUpperCase()}`, { x: 0.8, y: 1.0, w: 6, h: 0.3, fontSize: 11, color: GOLD, letterSpacing: 3 });
  s2.addText(`Why Datacendia Aligns with ${inv.firm}`, { x: 0.8, y: 1.5, w: 11, h: 0.6, fontSize: 22, color: WHITE, bold: true });
  // Left: thesis
  s2.addText(inv.thesis, { x: 0.8, y: 2.4, w: 5.5, h: 1.4, fontSize: 12, color: MUTED, lineSpacingMultiple: 1.5, valign: 'top' });
  // Left: why align card
  s2.addShape(pptx.ShapeType.roundRect, { x: 0.8, y: 4.0, w: 5.5, h: 2.5, fill: { color: CARD_BG }, rectRadius: 0.1 });
  s2.addText('Your Thesis \u2192 Our Mission', { x: 1.1, y: 4.2, w: 5, h: 0.4, fontSize: 13, color: GOLD, bold: true });
  s2.addText(inv.whyAlign, { x: 1.1, y: 4.7, w: 5, h: 1.6, fontSize: 11, color: MUTED, lineSpacingMultiple: 1.5, valign: 'top' });
  // Right: portfolio card
  s2.addShape(pptx.ShapeType.roundRect, { x: 7, y: 2.4, w: 5.5, h: 4.1, fill: { color: CARD_BG }, rectRadius: 0.1 });
  s2.addText('Portfolio Adjacency', { x: 7.3, y: 2.6, w: 5, h: 0.4, fontSize: 13, color: GOLD, bold: true });
  const portText = inv.portfolio.map(p => ({ text: p, options: { fontSize: 11, color: GOLD, bullet: { code: '2713', color: GREEN } } }));
  s2.addText(portText, { x: 7.3, y: 3.1, w: 4.8, h: 1.5, valign: 'top', lineSpacingMultiple: 1.4 });
  s2.addText(inv.hookSlide, { x: 7.3, y: 4.8, w: 4.8, h: 1.5, fontSize: 11, color: MUTED, lineSpacingMultiple: 1.4, valign: 'top' });
  addFooter(s2);

  // Slide 3: The Problem
  let s3 = pptx.addSlide();
  s3.background = { color: BG };
  addLogo(s3);
  s3.addText('THE PROBLEM', { x: 0.8, y: 1.0, w: 4, h: 0.3, fontSize: 11, color: GOLD, letterSpacing: 3 });
  s3.addText('Enterprise AI Has No Accountability Layer', { x: 0.8, y: 1.5, w: 11, h: 0.6, fontSize: 24, color: WHITE, bold: true });
  const problems = [
    'AI systems make high-stakes decisions with no audit trail, no evidence, and no dissent tracking',
    'EU AI Act (2025\u20132026) mandates governance for high-risk AI \u2014 penalties up to \u20AC35M or 7% revenue',
    'DORA requires AI operational resilience for financial services by Jan 2025',
    'No existing platform provides cryptographic proof of AI-assisted decisions',
    'Enterprises face regulatory risk with every AI deployment \u2014 and have no solution',
  ];
  const pRows = problems.map(b => ({ text: b, options: { fontSize: 13, color: MUTED, bullet: { code: '2192', color: GOLD }, lineSpacingMultiple: 1.5 } }));
  s3.addText(pRows, { x: 0.8, y: 2.4, w: 11, h: 3, valign: 'top' });
  // Metric cards
  const metrics = [
    { v: '\u20AC35M', l: 'Max EU AI Act penalty' },
    { v: '0', l: 'Platforms w/ crypto AI evidence' },
    { v: '2025', l: 'EU AI Act high-risk in effect' },
    { v: '85%', l: 'Fortune 500 deploying AI' },
  ];
  metrics.forEach((m, i) => {
    const cx = 0.8 + i * 3;
    s3.addShape(pptx.ShapeType.roundRect, { x: cx, y: 5.5, w: 2.7, h: 1.2, fill: { color: CARD_BG }, rectRadius: 0.1 });
    s3.addText(m.v, { x: cx, y: 5.6, w: 2.7, h: 0.6, fontSize: 24, color: GOLD, bold: true, align: 'center' });
    s3.addText(m.l, { x: cx + 0.2, y: 6.2, w: 2.3, h: 0.4, fontSize: 9, color: MUTED, align: 'center' });
  });
  addFooter(s3);

  // Slide 4: Solution
  let s4 = pptx.addSlide();
  s4.background = { color: BG };
  addLogo(s4);
  s4.addText('THE SOLUTION', { x: 0.8, y: 1.0, w: 4, h: 0.3, fontSize: 11, color: GOLD, letterSpacing: 3 });
  s4.addText('Multi-Agent Deliberation with Cryptographic Evidence', { x: 0.8, y: 1.5, w: 11, h: 0.6, fontSize: 22, color: WHITE, bold: true });
  const capRows = shared.CAPABILITIES.map(c => ({ text: c, options: { fontSize: 11, color: MUTED, bullet: { code: '2192', color: GOLD }, lineSpacingMultiple: 1.5 } }));
  s4.addText(capRows, { x: 0.8, y: 2.4, w: 5.5, h: 3.5, valign: 'top' });
  // Right: key angle card
  s4.addShape(pptx.ShapeType.roundRect, { x: 7, y: 2.4, w: 5.5, h: 1.5, fill: { color: CARD_BG }, rectRadius: 0.1 });
  s4.addText(`Key Angle for ${inv.firm}`, { x: 7.3, y: 2.6, w: 5, h: 0.4, fontSize: 13, color: GOLD, bold: true });
  s4.addText(inv.keyAngle, { x: 7.3, y: 3.1, w: 4.8, h: 0.7, fontSize: 14, color: WHITE, bold: true, valign: 'top' });
  // Sector card
  s4.addShape(pptx.ShapeType.roundRect, { x: 7, y: 4.1, w: 5.5, h: 0.8, fill: { color: CARD_BG }, rectRadius: 0.1 });
  s4.addText('Sector: ' + inv.sector, { x: 7.3, y: 4.1, w: 5, h: 0.8, fontSize: 12, color: MUTED, valign: 'middle' });
  // Guarantee card
  s4.addShape(pptx.ShapeType.roundRect, { x: 7, y: 5.1, w: 5.5, h: 1.5, fill: { color: CARD_BG }, rectRadius: 0.1 });
  s4.addText('90-Day Guarantee', { x: 7.3, y: 5.3, w: 5, h: 0.3, fontSize: 13, color: GOLD, bold: true });
  s4.addText(shared.GUARANTEE, { x: 7.3, y: 5.7, w: 4.8, h: 0.8, fontSize: 10, color: MUTED, lineSpacingMultiple: 1.4, valign: 'top' });
  addFooter(s4);

  // Slide 5: Platform Proof
  let s5 = pptx.addSlide();
  s5.background = { color: BG };
  addLogo(s5);
  s5.addText('PLATFORM PROOF', { x: 0.8, y: 1.0, w: 4, h: 0.3, fontSize: 11, color: GOLD, letterSpacing: 3 });
  s5.addText('This Is Not a Pitch \u2014 It\u2019s a Live Platform', { x: 0.8, y: 1.5, w: 11, h: 0.6, fontSize: 24, color: WHITE, bold: true });
  shared.PLATFORM.forEach((p, i) => {
    const cx = 0.8 + i * 2.4;
    s5.addShape(pptx.ShapeType.roundRect, { x: cx, y: 2.5, w: 2.2, h: 1.5, fill: { color: CARD_BG }, rectRadius: 0.1 });
    s5.addText(p.value, { x: cx, y: 2.6, w: 2.2, h: 0.8, fontSize: 28, color: GOLD, bold: true, align: 'center' });
    s5.addText(p.label, { x: cx + 0.2, y: 3.4, w: 1.8, h: 0.5, fontSize: 10, color: MUTED, align: 'center' });
  });
  // Demo + NVIDIA cards
  s5.addShape(pptx.ShapeType.roundRect, { x: 0.8, y: 4.5, w: 5.5, h: 2, fill: { color: CARD_BG }, rectRadius: 0.1 });
  s5.addText('Live Demo', { x: 1.1, y: 4.7, w: 5, h: 0.3, fontSize: 13, color: GOLD, bold: true });
  s5.addText('Production platform at app.datacendia.com\nMulti-agent deliberation, decision audit trails, compliance dashboards, AI governance gateway \u2014 all live.', { x: 1.1, y: 5.1, w: 4.8, h: 1.2, fontSize: 11, color: MUTED, lineSpacingMultiple: 1.5, valign: 'top' });
  s5.addShape(pptx.ShapeType.roundRect, { x: 7, y: 4.5, w: 5.5, h: 2, fill: { color: CARD_BG }, rectRadius: 0.1 });
  s5.addText('NVIDIA Inception Member', { x: 7.3, y: 4.7, w: 5, h: 0.3, fontSize: 13, color: GOLD, bold: true });
  s5.addText('Accepted into NVIDIA\u2019s elite startup program.\nDGX Cloud access, technical mentorship, co-marketing, and enterprise customer introductions.', { x: 7.3, y: 5.1, w: 4.8, h: 1.2, fontSize: 11, color: MUTED, lineSpacingMultiple: 1.5, valign: 'top' });
  addFooter(s5);

  // Screenshot slides
  const screenshots = getScreenshots(inv);
  for (const ss of screenshots) {
    const b64 = getImgBase64(ss.img);
    if (!b64) continue;
    let ssc = pptx.addSlide();
    ssc.background = { color: BG };
    addLogo(ssc);
    ssc.addText('PLATFORM PROOF', { x: 9, y: 0.3, w: 4, h: 0.3, fontSize: 8, color: MUTED, align: 'right' });
    ssc.addText(ss.section.toUpperCase(), { x: 0.8, y: 1.2, w: 4.5, h: 0.3, fontSize: 11, color: GOLD, letterSpacing: 3 });
    ssc.addText(ss.headline, { x: 0.8, y: 1.7, w: 4.5, h: 1.0, fontSize: 20, color: WHITE, bold: true });
    const ssPoints = ss.points.map(p => ({ text: p, options: { fontSize: 11, color: MUTED, bullet: { code: '2192', color: GOLD }, lineSpacingMultiple: 1.5 } }));
    ssc.addText(ssPoints, { x: 0.8, y: 3.0, w: 4.5, h: 3.5, valign: 'top' });
    ssc.addImage({ data: 'image/png;base64,' + b64, x: 5.8, y: 1.2, w: 7.0, h: 5.3 });
    addFooter(ssc);
  }

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

  // Slide 8: CTA
  let s8 = pptx.addSlide();
  s8.background = { color: BG };
  addLogo(s8);
  s8.addText('NEXT STEPS', { x: 0.5, y: 2.0, w: 12, h: 0.3, fontSize: 11, color: GOLD, letterSpacing: 3, align: 'center' });
  s8.addText('Let\u2019s Talk', { x: 0.5, y: 2.5, w: 12, h: 0.8, fontSize: 36, color: WHITE, bold: true, align: 'center' });
  s8.addText(`Personalized for ${inv.firm} \u2014 ${inv.keyAngle}`, { x: 1.5, y: 3.5, w: 10, h: 0.5, fontSize: 14, color: MUTED, align: 'center' });
  const ctaItems = ['Schedule Deep Dive', 'Technical Demo', 'Data Room Access', 'Try Live Demo \u2192'];
  ctaItems.forEach((t, i) => {
    const cx = 2.5 + i * 2.2;
    const isLast = i === ctaItems.length - 1;
    s8.addShape(pptx.ShapeType.roundRect, { x: cx, y: 4.3, w: 2, h: 0.5, fill: { color: isLast ? GOLD : CARD_BG }, rectRadius: 0.05 });
    s8.addText(t, { x: cx, y: 4.3, w: 2, h: 0.5, fontSize: 11, color: isLast ? BG : GOLD, bold: true, align: 'center', valign: 'middle' });
  });
  s8.addText('contact@datacendia.com | datacendia.com | app.datacendia.com', { x: 2, y: 5.5, w: 9, h: 0.4, fontSize: 12, color: MUTED, align: 'center' });
  addFooter(s8);

  return pptx;
}

async function main() {
  console.log(`Generating ${ALL.length} personalized PPTX investor decks...\n`);
  for (let i = 0; i < ALL.length; i++) {
    const inv = ALL[i];
    const pptx = buildPPTX(inv);
    const filename = `${inv.id}.pptx`;
    await pptx.writeFile({ fileName: path.join(outDir, filename) });
    process.stdout.write(`  ${filename}\n`);
  }
  console.log(`\nDone! ${ALL.length} PPTX decks in ${outDir}`);
}

main().catch(e => { console.error(e); process.exit(1); });
