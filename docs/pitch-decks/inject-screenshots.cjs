/**
 * Batch-inject screenshot slides into investor, sales, and design-partner decks.
 * Run: node docs/pitch-decks/inject-screenshots.cjs
 */
const fs = require('fs');
const path = require('path');

// SCREENSHOT_DIR is set per-file based on depth (subdirectory files use ../screenshots)

// ============================================================================
// SCREENSHOT LIBRARY — each entry is a full slide with discussion content
// ============================================================================
const SCREENSHOTS = {
  'council-deliberation': {
    img: '02-council-deliberation.png',
    section: 'Multi-Agent Decision Engine',
    headline: 'Decisions Made by Specialized AI Agents — Not One Black Box',
    points: [
      'Each decision is deliberated by role-specific agents: CFO, CISO, Legal, Strategy, Risk, and more',
      'Every agent provides a confidence score and reasoning — dissenting views are preserved, not hidden',
      'War Room, Governed Deliberation, and Quick Brief modes adapt to the urgency and stakes of each decision',
    ],
  },
  'decisions-list': {
    img: '05-decisions.png',
    section: 'Decision Audit Trail',
    headline: 'Every Decision Tracked with Confidence, Agents, and Full Evidence Chain',
    points: [
      'Complete decision history — searchable by status, confidence level, agent participation, and date',
      'Each decision links to the full deliberation record: who participated, what they recommended, and why',
      'Regulators and auditors can trace any decision back to its evidence and reasoning in seconds',
    ],
  },
  'compliance-dashboard': {
    img: '04-dcii-dashboard.png',
    section: 'Compliance Automation',
    headline: 'Continuous Compliance Across EU AI Act, GDPR, SOC 2, HIPAA, and DORA',
    points: [
      'Five Rings of Sovereignty — framework, assessment, bundle, ring, and pillar-level compliance mapping',
      'Real-time compliance scoring against active regulatory frameworks with automated gap detection',
      'Generate audit-ready compliance bundles on demand — no manual evidence collection',
    ],
  },
  'panopticon': {
    img: '04-dcii-dashboard.png',
    section: 'Regulatory Intelligence',
    headline: 'Every Regulation Absorbed, Analyzed, and Mapped to Your Operations',
    points: [
      'Regulatory radar shows upcoming enforcement deadlines — DORA, EU AI Act, CCPA — with days-to-impact',
      'AI-generated risk assessments explain what each regulation means for your specific business units',
      'Recommended actions are prioritized by impact, with direct links to launch compliance workflows',
    ],
  },
  'scge': {
    img: '10-evidence-vault.png',
    section: 'Sovereign Governance',
    headline: 'Stress-Test Governance Decisions Before They Affect Real People',
    points: [
      'Synthetic populations model demographic, economic, and behavioral dynamics at scale',
      'Run governance scenarios — infrastructure crisis, pandemic response, contested elections — in simulation',
      'Measure trust delta, bias indicators, and decision quality before any policy is enacted',
    ],
  },
  'post-quantum-kms': {
    img: '11-ledger.png',
    section: 'Cryptographic Security',
    headline: 'Quantum-Resistant Key Management — NIST-Standardized Algorithms',
    points: [
      'Dilithium, Falcon, and SPHINCS+ — the three NIST-standardized post-quantum signature algorithms',
      'Generate, rotate, and manage cryptographic keys that survive quantum computing threats',
      'Every decision signature is future-proofed — your audit trail remains tamper-evident for decades',
    ],
  },
  'post-deliberation': {
    img: '03-post-deliberation.png',
    section: 'Deliberation Transparency',
    headline: 'After Every Decision: See Exactly Who Voted, How Confident, and Why',
    points: [
      'Post-deliberation panel shows each agent\'s vote, confidence score, and reasoning',
      'Dissenting opinions are preserved and surfaced — not buried in a consensus summary',
      'Board-ready output: executive summary, risk flags, recommended actions, and evidence citations',
    ],
  },
  'executive-summary': {
    img: '08-executive-summary.png',
    section: 'Board-Ready Output',
    headline: 'One-Click Executive Summaries with Full Evidence Chain',
    points: [
      'Auto-generated summaries distill multi-agent deliberations into board-ready language',
      'Every claim links back to source data, agent reasoning, and confidence scores',
      'Export to PDF, share via secure link, or integrate directly with your board portal',
    ],
  },
  'dcii-truth': {
    img: '04-dcii-dashboard.png',
    section: 'Cryptographic Verification',
    headline: 'Verify Any Claim Against Evidence — Cryptographically Proven',
    points: [
      'Submit any organizational claim and verify it against evidence from your own data sources',
      'Confidence scores and source reliability ratings — not just "true" or "false"',
      'Every verification is timestamped and signed — immutable proof for auditors and regulators',
    ],
  },
  'dcii-notary': {
    img: '11-ledger.png',
    section: 'Decision Integrity',
    headline: 'Tamper-Evident Signatures for Every Decision in Your Organization',
    points: [
      'Every council deliberation, policy change, and data access event is cryptographically signed',
      'Key management with rotation schedules, algorithm selection, and audit-ready export',
      'Non-repudiation: prove exactly what was decided, when, by which agents, and with what evidence',
    ],
  },
  'pulse': {
    img: '13-pulse.png',
    section: 'Real-Time Monitoring',
    headline: 'Organizational Health at a Glance — With Anomaly Detection',
    points: [
      'Health score aggregates data quality, operations, security, and people metrics in real time',
      'System status monitoring with latency tracking across all platform services',
      'Anomaly detection flags issues before they escalate — with one-click escalation to the Council',
    ],
  },
  'graph-explorer': {
    img: '07-graph-explorer.png',
    section: 'Knowledge Graph',
    headline: 'See How Your Data, Decisions, and People Are Connected',
    points: [
      'Interactive knowledge graph maps entities, datasets, metrics, processes, and their relationships',
      'Data lineage tracing — click any metric to see every dataset, transformation, and owner upstream',
      'Impact analysis — before changing anything, see what downstream reports and decisions are affected',
    ],
  },
  'red-team': {
    img: '12-collapse.png',
    section: 'Adversarial Security',
    headline: 'Continuously Attack Your Own AI Governance — Before Someone Else Does',
    points: [
      'Automated adversarial testing: prompt injection, policy bypass, privilege escalation, audit evasion',
      'Vulnerability scoring by severity with exploitability ratings and estimated potential damage',
      'Evil Twin mode inverts your AI\'s objectives to discover the most dangerous failure modes',
    ],
  },
  'chronos': {
    img: '09-council-analytics.png',
    section: 'Enterprise Time Machine',
    headline: 'Travel to Any Moment — See What Your Organization Knew, Decided, and Did',
    points: [
      'Replay every metric, event, and AI decision between any two points in time',
      'Built for auditors and regulators: answer "why did we sign off on that?" with timestamped evidence',
      'SOX, SEC, FedRAMP, and GDPR compliance views — export audit-ready evidence packages',
    ],
  },
  'dashboard': {
    img: '01-dashboard.png',
    section: 'Command Center',
    headline: 'Enterprise Dashboard — Your Organization\'s Decision Intelligence Hub',
    points: [
      'Single pane of glass: active deliberations, health scores, recent decisions, and system status',
      'One-click access to Council, Compliance, Graph, Pulse, and every platform capability',
      'Role-based views ensure each stakeholder sees what matters to them — from C-suite to compliance',
    ],
  },
  'regulators-receipt': {
    img: '08-executive-summary.png',
    section: 'Court-Admissible Evidence',
    headline: 'Every Decision Produces a Signed, Tamper-Evident Regulator\'s Receipt',
    points: [
      'Court-admissible evidence package — receipt ID, decision ID, compliance profile, and full decision summary',
      'Cryptographic integrity: SHA-256 decision hash, Merkle root, and verified digital signature from datacendia-kms',
      'Dissenting views on the record — agents who disagreed are named with their rationale, not buried in consensus',
    ],
  },
  'gateway': {
    img: '06-gateway-dashboard.png',
    section: 'AI Governance Gateway',
    headline: 'CendiaGateway — Every AI Interaction Logged, Scanned, Signed, and Auditable',
    points: [
      'Sits between your applications and AI providers — every request and response is logged with full audit trail',
      'PII detection, content policy enforcement, and blocked request tracking across all AI interactions',
      'Real-time metrics: total interactions, latency overhead, token usage, cost tracking, and active policy count',
    ],
  },
};

// ============================================================================
// KEYWORD → SCREENSHOT MAPPING (determines which slides each deck gets)
// ============================================================================
const SCREENSHOT_MAP = {
  '_universal': ['council-deliberation', 'decisions-list'],
  'compliance|regulation|audit|gdpr|hipaa|dora|soc|eu-ai|governance-gap': ['compliance-dashboard', 'regulators-receipt'],
  'sovereign|air-gap|defense|government|gov-defense|classified|military': ['scge', 'post-quantum-kms'],
  'multi-agent|council|deliberat|agent': ['post-deliberation', 'executive-summary'],
  'dcii|proof|notary|crypto|trust|timestamp': ['dcii-truth', 'regulators-receipt'],
  'healthcare|pharma|clinical': ['pulse'],
  'financial|banking|insurance|risk': ['pulse', 'regulators-receipt'],
  'data|lineage|silo|zero-copy|snowflake|sap|salesforce|integration': ['graph-explorer'],
  'red.team|adversarial|wargam|scenario|pre.mortem': ['red-team'],
  'chronos|time.machine|simulation': ['chronos'],
  'gateway|api|deploy|cloud|private|on.prem|hybrid': ['dashboard', 'gateway'],
  'speed|decision.speed|roi|business.model|competitive|moat|fortune|enterprise|mid.market': ['dashboard', 'chronos'],
  'automation|workflow|operations|it.operations': ['pulse'],
};

function getScreenshotsForFile(filename, content) {
  const keys = [];
  const seen = new Set();
  
  // Always add universal
  for (const k of SCREENSHOT_MAP['_universal']) {
    if (!seen.has(k)) { keys.push(k); seen.add(k); }
  }
  
  // Check each pattern
  for (const [pattern, imgKeys] of Object.entries(SCREENSHOT_MAP)) {
    if (pattern === '_universal') continue;
    const regex = new RegExp(pattern, 'i');
    if (regex.test(filename) || regex.test(content)) {
      for (const k of imgKeys) {
        if (!seen.has(k)) { keys.push(k); seen.add(k); }
      }
    }
  }
  
  // Cap at 2 slides per deck to keep focused
  return keys.slice(0, 2).map(k => SCREENSHOTS[k]).filter(Boolean);
}

function buildScreenshotSlides(screenshots, deckType, screenshotDir) {
  let html = '';
  
  for (const s of screenshots) {
    html += `\n<!-- SCREENSHOT SLIDE: PLATFORM PROOF -->\n`;
    html += `<div class="slide" style="background:var(--bg-primary)">\n`;
    // Top bar
    html += `<div style="position:absolute;top:0;left:0;right:0;display:flex;justify-content:space-between;align-items:center;padding:20px 80px;z-index:10"><div style="font-weight:800;font-size:12px;color:var(--gold);letter-spacing:3px;text-transform:uppercase">Datacendia</div><div style="font-size:10px;color:var(--text-muted)">${deckType}</div></div>\n`;
    // Two-column layout: text left, screenshot right
    html += `<div style="position:relative;z-index:10;display:grid;grid-template-columns:38% 60%;gap:2%;align-items:center;height:100%;padding:80px 80px 60px">\n`;
    // Left: discussion
    html += `<div>\n`;
    html += `<div style="font-size:11px;color:var(--gold);letter-spacing:3px;text-transform:uppercase;font-weight:700;margin-bottom:12px">${s.section}</div>\n`;
    html += `<h2 style="font-size:24px;font-weight:800;line-height:1.3;margin-bottom:24px">${s.headline}</h2>\n`;
    html += `<ul style="list-style:none;padding:0;margin:0">\n`;
    for (const point of s.points) {
      html += `<li style="font-size:13px;color:var(--text-muted);line-height:1.6;margin-bottom:14px;padding-left:20px;position:relative"><span style="position:absolute;left:0;color:var(--gold)">\u2192</span> ${point}</li>\n`;
    }
    html += `</ul>\n`;
    html += `</div>\n`;
    // Right: screenshot
    html += `<div style="border-radius:12px;overflow:hidden;box-shadow:0 8px 32px rgba(0,0,0,0.5);border:1px solid rgba(255,255,255,0.08)">\n`;
    html += `<img src="${screenshotDir}/${s.img}" alt="${s.headline}" style="width:100%;display:block">\n`;
    html += `</div>\n`;
    html += `</div>\n`;
    // Footer
    html += `<div style="position:absolute;bottom:20px;left:80px;right:80px;display:flex;justify-content:space-between;font-size:9px;color:var(--text-muted)"><span>&copy; 2024\u20132026 Datacendia, LLC</span><span>datacendia.com</span></div>\n`;
    html += `</div>\n`;
  }
  
  return html;
}

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  const filename = path.basename(filePath, '.html');
  
  // Strip existing screenshot slides so we can re-inject with updated screenshots
  if (content.includes('<!-- SCREENSHOT SLIDE: PLATFORM PROOF -->')) {
    content = content.replace(/\n<!-- SCREENSHOT SLIDE: PLATFORM PROOF -->\n[\s\S]*?(?=<!-- SLIDE |<\/body>)/g, '\n');
    console.log(`  REPLACING existing screenshots: ${filename}`);
  }
  
  let screenshots = getScreenshotsForFile(filename, content);
  
  // Find deck type from title
  const titleMatch = content.match(/<title>Datacendia — (.+?)<\/title>/);
  const deckType = titleMatch ? titleMatch[1] : 'Overview';
  
  // Compute relative path to screenshots/ based on file location
  const fileDir = path.dirname(filePath);
  const screenshotsAbsolute = path.join(__dirname, 'screenshots');
  const screenshotDir = path.relative(fileDir, screenshotsAbsolute).replace(/\\/g, '/');

  const screenshotSlides = buildScreenshotSlides(screenshots, deckType, screenshotDir);
  let newContent;

  // Try comment-based markers first (investor/, sales/ decks)
  const lastSlideMatch = content.match(/<!-- SLIDE \d+[^:]*?(?:CTA|CONTACT|NEXT|GET STARTED)[^>]*-->/i);
  if (lastSlideMatch) {
    const insertPos = content.lastIndexOf(lastSlideMatch[0]);
    newContent = content.slice(0, insertPos) + screenshotSlides + '\n' + content.slice(insertPos);
  } else {
    // For investor-50 style decks: insert before the CTA slide (slide--cta class)
    const ctaIdx = content.lastIndexOf('<div class="slide slide--cta">');
    if (ctaIdx > 0) {
      newContent = content.slice(0, ctaIdx) + screenshotSlides + '\n' + content.slice(ctaIdx);
    } else {
      // Fallback: insert before </body>
      newContent = content.replace('</body>', screenshotSlides + '\n</body>');
    }
  }
  
  fs.writeFileSync(filePath, newContent, 'utf8');
  console.log(`  OK: ${filename} (${screenshots.length} screenshots)`);

}

// Process all decks
const baseDir = path.join(__dirname);
const folders = ['investor', 'sales', 'design-partner', 'investor-50/html', 'gamma', 'investor-100/html'];

for (const folder of folders) {
  const dir = path.join(baseDir, folder);
  if (!fs.existsSync(dir)) {
    console.log(`SKIP folder: ${folder} (not found)`);
    continue;
  }
  
  console.log(`\nProcessing ${folder}/`);
  const files = fs.readdirSync(dir).filter(f => f.endsWith('.html'));
  for (const file of files) {
    processFile(path.join(dir, file));
  }
}

// Also process standalone decks in the base directory
console.log('\nProcessing standalone decks/');
const standaloneFiles = fs.readdirSync(baseDir).filter(f => f.endsWith('.html'));
for (const file of standaloneFiles) {
  processFile(path.join(baseDir, file));
}

// ============================================================================
// PHASE 2: Inject live demo link into CTA slides
// ============================================================================
const DEMO_URL = 'https://app.datacendia.com';
const DEMO_BUTTON = `<a href="${DEMO_URL}" target="_blank" style="font-size:14px;padding:8px 20px;background:linear-gradient(135deg,#d4af37,#b8962e);color:#0a0e1a;border-radius:6px;text-decoration:none;font-weight:700;letter-spacing:0.5px;display:inline-block">Try Live Demo →</a>`;

function injectDemoLink(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  const filename = path.basename(filePath, '.html');
  let changed = false;

  // Add demo button to the CTA tag group (before closing </div> of the flex container)
  // Pattern: the flex container with tag--gold buttons
  if (content.includes('tag--gold') && !content.includes(DEMO_URL)) {
    // Find the last tag--gold button in each CTA slide and add the demo button after it
    content = content.replace(
      /(<span class="tag tag--gold"[^>]*>[^<]+<\/span>)(<\/div><p class="muted")/g,
      `$1${DEMO_BUTTON}$2`
    );
    changed = true;
  }

  // Update contact line to include demo link
  if (content.includes('contact@datacendia.com | datacendia.com</p>') && !content.includes('app.datacendia.com')) {
    content = content.replace(
      /contact@datacendia\.com \| datacendia\.com<\/p>/g,
      `contact@datacendia.com | datacendia.com | <a href="${DEMO_URL}" style="color:var(--gold);text-decoration:none">app.datacendia.com</a></p>`
    );
    changed = true;
  }

  if (changed) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`  DEMO LINK: ${filename}`);
  }
}

console.log('\nInjecting live demo links into CTA slides...');
for (const folder of folders) {
  const dir = path.join(baseDir, folder);
  if (!fs.existsSync(dir)) continue;
  const files = fs.readdirSync(dir).filter(f => f.endsWith('.html'));
  for (const file of files) {
    injectDemoLink(path.join(dir, file));
  }
}
for (const file of standaloneFiles) {
  injectDemoLink(path.join(baseDir, file));
}

// ============================================================================
// PHASE 3: Inject NVIDIA Inception badge into title + CTA slides
// ============================================================================
function injectNvidiaBadge(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  const filename = path.basename(filePath, '.html');
  if (content.includes('nvidia-inception')) return; // already injected

  const fileDir = path.dirname(filePath);
  const screenshotsAbsolute = path.join(__dirname, 'screenshots');
  const screenshotDir = path.relative(fileDir, screenshotsAbsolute).replace(/\\/g, '/');
  const badgeSrc = `${screenshotDir}/nvidia-inception.png`;

  const badge = `<img src="${badgeSrc}" alt="NVIDIA Inception Member" style="height:36px;opacity:0.9" class="nvidia-inception">`;

  // Add to title slides — after the slide-footer opening, or before the slide-footer
  // Pattern: slide--title ... slide-footer
  content = content.replace(
    /(<div class="slide slide--title">)(.*?)(<div class="slide-footer">)/gs,
    (match, open, middle, footer) => {
      return `${open}${middle}<div style="position:absolute;top:24px;right:80px;z-index:20">${badge}</div>${footer}`;
    }
  );

  // Add to CTA slides
  content = content.replace(
    /(<div class="slide slide--cta">)(.*?)(<div class="slide-footer">)/gs,
    (match, open, middle, footer) => {
      return `${open}${middle}<div style="position:absolute;top:24px;right:80px;z-index:20">${badge}</div>${footer}`;
    }
  );

  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`  NVIDIA BADGE: ${filename}`);
}

console.log('\nInjecting NVIDIA Inception badges...');
for (const folder of folders) {
  const dir = path.join(baseDir, folder);
  if (!fs.existsSync(dir)) continue;
  const files = fs.readdirSync(dir).filter(f => f.endsWith('.html'));
  for (const file of files) {
    injectNvidiaBadge(path.join(dir, file));
  }
}
for (const file of standaloneFiles) {
  injectNvidiaBadge(path.join(baseDir, file));
}

console.log('\nDone! Screenshots + demo links + NVIDIA badge injected.');
