/**
 * Universal HTML pitch deck to PPTX converter.
 * Parses HTML slides and generates PPTX with embedded screenshots.
 * Run: node docs/pitch-decks/html-to-pptx.cjs
 */
const PptxGenJS = require('pptxgenjs');
const fs = require('fs');
const path = require('path');

const BASE = __dirname;
const SCREENSHOTS_DIR = path.join(BASE, 'screenshots');

// Brand colors
const BG = '0A0E1A';
const GOLD = 'D4AF37';
const WHITE = 'FFFFFF';
const MUTED = '8B8FA3';
const CARD_BG = '141825';

// Screenshot definitions
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
  'speed|decision|roi|business|competitive|moat|fortune|enterprise': ['dashboard'],
  'red.team|adversarial|wargam|scenario': ['dashboard'],
};

function getScreenshots(filename, content) {
  const keys = new Set();
  for (const k of SCREENSHOT_MAP['_universal']) keys.add(k);
  const text = `${filename} ${content}`;
  for (const [pattern, imgKeys] of Object.entries(SCREENSHOT_MAP)) {
    if (pattern === '_universal') continue;
    if (new RegExp(pattern, 'i').test(text)) {
      for (const k of imgKeys) keys.add(k);
    }
  }
  return [...keys].slice(0, 2).map(k => SCREENSHOT_DEFS[k]).filter(Boolean);
}

// Simple HTML text extractor
function stripHtml(html) {
  return html.replace(/<[^>]+>/g, '').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&mdash;/g, '—').replace(/&ndash;/g, '–').replace(/&nbsp;/g, ' ').replace(/&copy;/g, '©').replace(/&trade;/g, '™').trim();
}

// Extract slide content from HTML
function parseSlides(html) {
  const slides = [];
  // Match each <div class="slide ..."> block
  const slideRegex = /<div class="slide[^"]*"[^>]*>([\s\S]*?)(?=<div class="slide |$)/g;
  let match;
  while ((match = slideRegex.exec(html)) !== null) {
    const content = match[1];
    
    // Skip screenshot slides
    if (content.includes('SCREENSHOT SLIDE')) continue;
    
    const slide = { type: 'content', texts: [] };
    
    // Extract eyebrow
    const eyebrowMatch = content.match(/class="eyebrow"[^>]*>([^<]+)/);
    if (eyebrowMatch) slide.eyebrow = stripHtml(eyebrowMatch[1]);
    
    // Extract h1 or h2
    const h1Match = content.match(/<h1[^>]*>([\s\S]*?)<\/h1>/);
    const h2Match = content.match(/<h2[^>]*>([\s\S]*?)<\/h2>/);
    slide.heading = stripHtml(h1Match ? h1Match[1] : h2Match ? h2Match[1] : '');
    
    // Extract subtitle
    const subMatch = content.match(/class="subtitle"[^>]*>([\s\S]*?)<\//);
    if (subMatch) slide.subtitle = stripHtml(subMatch[1]);
    
    // Extract quote
    const quoteMatch = content.match(/class="quote"[^>]*>([\s\S]*?)<\//);
    if (quoteMatch) slide.quote = stripHtml(quoteMatch[1]);
    
    // Extract list items
    const liRegex = /<li[^>]*>([\s\S]*?)<\/li>/g;
    let li;
    while ((li = liRegex.exec(content)) !== null) {
      slide.texts.push(stripHtml(li[1]));
    }
    
    // Extract paragraphs with content
    const pRegex = /<p[^>]*>([\s\S]*?)<\/p>/g;
    let p;
    while ((p = pRegex.exec(content)) !== null) {
      const text = stripHtml(p[1]);
      if (text.length > 20 && !text.includes('©') && !text.includes('datacendia.com') && !text.includes('CONFIDENTIAL')) {
        slide.texts.push(text);
      }
    }
    
    // Detect slide type
    if (content.includes('slide--title')) slide.type = 'title';
    else if (content.includes('slide--cta')) slide.type = 'cta';
    else if (content.includes('slide--accent')) slide.type = 'accent';
    else if (quoteMatch) slide.type = 'quote';
    
    // Extract metric values
    const metricRegex = /class="value"[^>]*>([\s\S]*?)<\/div>\s*<div class="label"[^>]*>([\s\S]*?)<\/div>/g;
    let metric;
    slide.metrics = [];
    while ((metric = metricRegex.exec(content)) !== null) {
      slide.metrics.push({ value: stripHtml(metric[1]), label: stripHtml(metric[2]) });
    }
    
    slides.push(slide);
  }
  return slides;
}

function buildPptx(filename, html, deckType) {
  const pptx = new PptxGenJS();
  pptx.defineLayout({ name: 'WIDE', width: 13.33, height: 7.5 });
  pptx.layout = 'WIDE';
  pptx.author = 'Datacendia';
  pptx.company = 'Datacendia, LLC';
  
  const titleMatch = html.match(/<title>([^<]+)<\/title>/);
  pptx.title = titleMatch ? stripHtml(titleMatch[1]) : filename;
  
  const addFooter = (slide) => {
    slide.addText('© 2024-2026 Datacendia, LLC', { x: 0.5, y: 7.0, w: 4, h: 0.3, fontSize: 8, color: MUTED });
    slide.addText('datacendia.com', { x: 9, y: 7.0, w: 4, h: 0.3, fontSize: 8, color: MUTED, align: 'right' });
  };
  const addLogo = (slide) => {
    slide.addText('DATACENDIA', { x: 0.5, y: 0.3, w: 3, h: 0.3, fontSize: 10, color: GOLD, bold: true });
    slide.addText(deckType.toUpperCase(), { x: 9, y: 0.3, w: 4, h: 0.3, fontSize: 8, color: MUTED, align: 'right' });
  };
  
  const slides = parseSlides(html);
  
  for (const sl of slides) {
    const s = pptx.addSlide();
    s.background = { color: BG };
    addLogo(s);
    
    if (sl.type === 'title') {
      s.addText('DATACENDIA', { x: 0.5, y: 2.2, w: 12, h: 0.4, fontSize: 11, color: GOLD, letterSpacing: 3, align: 'center' });
      s.addText(sl.heading || filename, { x: 0.5, y: 2.8, w: 12, h: 1.2, fontSize: 36, color: WHITE, bold: true, align: 'center' });
      if (sl.subtitle) s.addText(sl.subtitle, { x: 1.5, y: 4.2, w: 10, h: 0.6, fontSize: 16, color: MUTED, align: 'center' });
    } else if (sl.type === 'quote' || sl.type === 'accent') {
      const q = sl.quote || sl.texts[0] || '';
      s.addText(`"${q}"`, { x: 1, y: 2.0, w: 11, h: 2.5, fontSize: 22, color: WHITE, italic: true, align: 'center', valign: 'middle' });
      s.addText('— The Datacendia Manifesto', { x: 1, y: 4.5, w: 11, h: 0.4, fontSize: 12, color: MUTED, align: 'center' });
    } else if (sl.type === 'cta') {
      s.addText('NEXT STEPS', { x: 0.5, y: 2.0, w: 12, h: 0.3, fontSize: 11, color: GOLD, letterSpacing: 3, align: 'center' });
      s.addText('Let\u2019s Talk', { x: 0.5, y: 2.5, w: 12, h: 0.8, fontSize: 36, color: WHITE, bold: true, align: 'center' });
      s.addText('contact@datacendia.com | datacendia.com | app.datacendia.com', { x: 2, y: 4.0, w: 9, h: 0.4, fontSize: 12, color: MUTED, align: 'center' });
    } else {
      // Content slide
      if (sl.eyebrow) s.addText(sl.eyebrow.toUpperCase(), { x: 0.8, y: 1.0, w: 6, h: 0.3, fontSize: 11, color: GOLD, letterSpacing: 3 });
      if (sl.heading) s.addText(sl.heading, { x: 0.8, y: 1.5, w: 11, h: 0.8, fontSize: 24, color: WHITE, bold: true });
      
      if (sl.metrics.length > 0) {
        // Metrics layout
        const mW = Math.min(3, 11 / sl.metrics.length);
        sl.metrics.forEach((m, i) => {
          const mx = 0.8 + i * (mW + 0.3);
          s.addShape(pptx.ShapeType.roundRect, { x: mx, y: 2.8, w: mW, h: 1.8, fill: { color: CARD_BG }, rectRadius: 0.1 });
          s.addText(m.value, { x: mx, y: 3.0, w: mW, h: 0.8, fontSize: 28, color: GOLD, bold: true, align: 'center' });
          s.addText(m.label, { x: mx + 0.2, y: 3.8, w: mW - 0.4, h: 0.6, fontSize: 10, color: MUTED, align: 'center', wrap: true });
        });
      } else if (sl.texts.length > 0) {
        // Bullet points
        const rows = sl.texts.slice(0, 8).map(t => ({
          text: t,
          options: { fontSize: 12, color: MUTED, bullet: { code: '2192', color: GOLD }, lineSpacingMultiple: 1.5 }
        }));
        s.addText(rows, { x: 0.8, y: 2.6, w: 11, h: 4, valign: 'top' });
      }
    }
    
    addFooter(s);
  }
  
  // Screenshot slides
  const screenshots = getScreenshots(filename, html);
  for (const ss of screenshots) {
    const imgPath = path.join(SCREENSHOTS_DIR, ss.img);
    if (!fs.existsSync(imgPath)) continue;
    
    const ssc = pptx.addSlide();
    ssc.background = { color: BG };
    addLogo(ssc);
    ssc.addText(ss.section.toUpperCase(), { x: 0.8, y: 1.2, w: 4.5, h: 0.3, fontSize: 11, color: GOLD, letterSpacing: 3 });
    ssc.addText(ss.headline, { x: 0.8, y: 1.7, w: 4.5, h: 1.0, fontSize: 20, color: WHITE, bold: true });
    const pts = ss.points.map(p => ({ text: p, options: { fontSize: 11, color: MUTED, bullet: { code: '2192', color: GOLD }, lineSpacingMultiple: 1.5 } }));
    ssc.addText(pts, { x: 0.8, y: 3.0, w: 4.5, h: 3.5, valign: 'top' });
    ssc.addImage({ path: imgPath, x: 5.8, y: 1.2, w: 7.0, h: 5.3 });
    addFooter(ssc);
  }
  
  return pptx;
}

// Folders to process (excluding investor-50 which has its own generator)
const CONVERSIONS = [
  { htmlDir: 'investor', pptxDir: 'investor/pptx', deckType: 'Investor Deck' },
  { htmlDir: 'sales', pptxDir: 'sales/pptx', deckType: 'Sales Deck' },
  { htmlDir: 'design-partner', pptxDir: 'design-partner/pptx', deckType: 'Design Partner' },
  { htmlDir: 'gamma', pptxDir: 'gamma/pptx', deckType: 'Gamma Deck' },
];

async function main() {
  let total = 0, errors = 0;
  
  for (const { htmlDir, pptxDir, deckType } of CONVERSIONS) {
    const htmlFullDir = path.join(BASE, htmlDir);
    const pptxFullDir = path.join(BASE, pptxDir);
    
    if (!fs.existsSync(htmlFullDir)) { console.log(`SKIP: ${htmlDir}/`); continue; }
    if (!fs.existsSync(pptxFullDir)) fs.mkdirSync(pptxFullDir, { recursive: true });
    
    const files = fs.readdirSync(htmlFullDir).filter(f => f.endsWith('.html'));
    console.log(`\n${htmlDir}/ (${files.length} files)`);
    
    for (const file of files) {
      const htmlPath = path.join(htmlFullDir, file);
      const html = fs.readFileSync(htmlPath, 'utf8');
      const pptxName = file.replace('.html', '.pptx');
      const pptxPath = path.join(pptxFullDir, pptxName);
      
      try {
        const pptx = buildPptx(file.replace('.html', ''), html, deckType);
        await pptx.writeFile({ fileName: pptxPath });
        total++;
        process.stdout.write(`  ✓ ${pptxName}\n`);
      } catch (err) {
        errors++;
        console.error(`  ✗ ${pptxName}: ${err.message}`);
      }
    }
  }
  
  // Standalone files
  const standaloneFiles = fs.readdirSync(BASE).filter(f => f.endsWith('.html'));
  if (standaloneFiles.length > 0) {
    const outDir = path.join(BASE, 'pptx');
    if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
    console.log(`\nstandalone/ (${standaloneFiles.length} files)`);
    for (const file of standaloneFiles) {
      const html = fs.readFileSync(path.join(BASE, file), 'utf8');
      const pptxName = file.replace('.html', '.pptx');
      try {
        const pptx = buildPptx(file.replace('.html', ''), html, 'Overview');
        await pptx.writeFile({ fileName: path.join(outDir, pptxName) });
        total++;
        process.stdout.write(`  ✓ ${pptxName}\n`);
      } catch (err) {
        errors++;
        console.error(`  ✗ ${pptxName}: ${err.message}`);
      }
    }
  }
  
  console.log(`\nDone! ${total} PPTX files generated, ${errors} errors.`);
}

main().catch(err => { console.error('Fatal:', err); process.exit(1); });
