/**
 * Datacendia Pitch Deck Engine — Template functions and platform data
 */
const fs = require('fs');
const path = require('path');

// Platform data from actual codebase (SubscriptionTiers.ts, marketing en.json)
const D = {
  tagline: 'Decision Crisis Immunization Infrastructure',
  mission: 'Turn data and AI into accountable, explainable decisions — on your infrastructure, under your control.',
  endpoints: 156, routeFiles: 82, connectors: 16, languages: 26, modes: 4, agents: 14, councilModes: 12, sovPatterns: 11,
};

const TIERS = [
  ['Pilot','$50K','10','100/mo','5','Priority','99.5%'],
  ['Foundation','$150K–$500K','50','1,000/mo','25','Dedicated','99.9%'],
  ['Enterprise','$500K–$1.5M','500','Unlimited','Unlimited','White Glove','99.99%'],
  ['Strategic','$1.5M+','Unlimited','Unlimited','Unlimited','White Glove','99.99%'],
];

const DEPLOY = [
  ['Cloud (SaaS)','Our infrastructure','Full (logged)','Hours'],
  ['Private Cloud','Your VPC','Metadata only','Days'],
  ['On-Premises','Your data center','None','Weeks'],
  ['Air-Gapped','Isolated network','None','Weeks+'],
];

const COMPLIANCE = [
  ['SOC 2 Type II','Target Q2 2026','Control mapping complete'],
  ['ISO 27001','Target H2 2026','Gap assessment complete'],
  ['GDPR','Aligned','DPA available on request'],
  ['FedRAMP Moderate','Control-Ready','Architecture designed to controls'],
  ['HIPAA','Controls Aligned','BAA available on enterprise contract'],
];

const AGENTS_SHORT = [
  ['CEO','Strategic Synthesis'], ['CFO','Financial Intelligence'], ['COO','Operational Intelligence'],
  ['CISO','Security & Compliance'], ['CMO','Market Intelligence'], ['CTO','Technology Intelligence'],
  ['CHRO','People Intelligence'], ['CRO','Revenue Intelligence'], ['CDO','Data Intelligence'],
  ['Risk','Risk Assessment'], ['CLO','Legal Intelligence'], ['Red Team','Adversarial Challenge'],
  ['Analyst','Pattern Recognition'], ['Arbiter','Final Synthesis'],
];

const SOV_PATTERNS = ['Data Diode','Local RLHF','Audit Provenance','Shadow Council','Deterministic Replay','QR Air-Gap Bridge','Canary Tripwires','TPM Attestation','Time-Lock','Federated Mesh','Portable USB Instance'];

// HTML helpers
function hd(title, dt) {
  return `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"><title>${title} — Datacendia</title><link rel="stylesheet" href="../pitch-deck.css"><style>.slide-content{padding-top:60px;width:100%}</style></head><body>\n`;
}
function ft() { return '\n</body></html>'; }
function sh(dt, n, tot) {
  return `<div class="slide-header"><div class="logo">DATACENDIA</div><div class="deck-type">${dt}</div><div class="slide-num">${n} / ${tot}</div></div>`;
}
function sf(c) { return `<div class="slide-footer"><span>&copy; 2024–2026 Datacendia, LLC</span><span>${c?'CONFIDENTIAL':'datacendia.com'}</span></div>`; }

// Slide builders
function titleS(title, sub, dt, tot, conf=true) {
  return `<div class="slide slide--title">${sh(dt,1,tot)}${conf?'<div class="confidential">Confidential</div>':''}<div class="eyebrow">DATACENDIA</div><h1>${title}</h1><p class="subtitle" style="text-align:center;margin:0 auto 30px">${sub}</p><div class="divider divider--center"></div><p class="muted" style="margin-top:20px;font-size:14px">${D.tagline}</p>${sf(conf)}</div>`;
}

function quoteS(dt, n, tot, q, attr='') {
  return `<div class="slide slide--accent">${sh(dt,n,tot)}<div style="max-width:900px"><div class="quote">${q}</div>${attr?`<p class="muted" style="margin-top:20px;padding-left:27px">— ${attr}</p>`:''}</div>${sf()}</div>`;
}

function metricsS(dt, n, tot, eye, ms) {
  const g = ms.length<=4?'grid-4':'grid-3';
  return `<div class="slide slide--dark">${sh(dt,n,tot)}<div class="slide-content"><div class="eyebrow">${eye}</div><div class="${g}" style="margin-top:40px">${ms.map(m=>`<div class="card metric"><div class="value">${m[0]}</div><div class="label">${m[1]}</div></div>`).join('')}</div></div>${sf()}</div>`;
}

function cardsS(dt, n, tot, eye, title, cards, cols=3) {
  const g = cols===4?'grid-4':cols===2?'grid-2':'grid-3';
  return `<div class="slide slide--dark">${sh(dt,n,tot)}<div class="slide-content"><div class="eyebrow">${eye}</div><h2>${title}</h2><div class="${g}" style="margin-top:30px">${cards.map(c=>`<div class="card ${c[2]||''}"><h4>${c[0]}</h4><p style="color:var(--text-secondary);font-size:14px;margin-top:8px">${c[1]}</p></div>`).join('')}</div></div>${sf()}</div>`;
}

function tableS(dt, n, tot, eye, title, hdrs, rows) {
  return `<div class="slide slide--dark">${sh(dt,n,tot)}<div class="slide-content"><div class="eyebrow">${eye}</div><h2>${title}</h2><table style="margin-top:30px"><thead><tr>${hdrs.map(h=>`<th>${h}</th>`).join('')}</tr></thead><tbody>${rows.map(r=>`<tr>${r.map(c=>`<td>${c}</td>`).join('')}</tr>`).join('')}</tbody></table></div>${sf()}</div>`;
}

function bulletS(dt, n, tot, eye, title, bs, cols=1) {
  return `<div class="slide slide--dark">${sh(dt,n,tot)}<div class="slide-content"><div class="eyebrow">${eye}</div><h2>${title}</h2><ul style="margin-top:20px;columns:${bs.length>6?2:cols};column-gap:40px">${bs.map(b=>`<li>${b}</li>`).join('')}</ul></div>${sf()}</div>`;
}

function twoColS(dt, n, tot, eye, title, left, right) {
  return `<div class="slide slide--dark">${sh(dt,n,tot)}<div class="slide-content"><div class="eyebrow">${eye}</div><h2>${title}</h2><div class="grid-2" style="margin-top:30px"><div>${left}</div><div>${right}</div></div></div>${sf()}</div>`;
}

function ctaS(dt, n, tot, heading, sub, acts) {
  return `<div class="slide slide--cta">${sh(dt,n,tot)}<div class="eyebrow">NEXT STEPS</div><h2>${heading}</h2><p class="subtitle" style="text-align:center;margin:0 auto 30px">${sub}</p><div style="display:flex;gap:16px;flex-wrap:wrap;justify-content:center;margin-top:20px">${acts.map(a=>`<span class="tag tag--gold" style="font-size:14px;padding:8px 20px">${a}</span>`).join('')}</div><p class="muted" style="margin-top:40px">contact@datacendia.com | datacendia.com</p>${sf()}</div>`;
}

// Common slides
function pricingS(dt, n, tot) { return tableS(dt,n,tot,'PRICING','Transparent, Procurement-Ready Pricing',['Tier','Annual','Users','Deliberations','Sources','Support','SLA'],TIERS); }
function deployS(dt, n, tot) { return tableS(dt,n,tot,'DEPLOYMENT','Deploy Anywhere — Your Infrastructure, Your Control',['Mode','Data Location','Our Access','Setup'],DEPLOY); }
function compliS(dt, n, tot) { return tableS(dt,n,tot,'COMPLIANCE','Enterprise Compliance Roadmap',['Framework','Status','Detail'],COMPLIANCE); }
function platMetrics(dt, n, tot) { return metricsS(dt,n,tot,'PLATFORM METRICS',[['156','Validated Endpoints'],['16','Connectors'],['26','Languages'],['4','Deployment Modes']]); }
function guaranteeS(dt, n, tot) { return quoteS(dt,n,tot,"Deploy Datacendia for 90 days on a single strategic problem. If the Council doesn't identify at least 3 critical risks you missed, we refund the pilot fee.",'Datacendia Pilot Guarantee'); }

function whatWeDoS(dt, n, tot) {
  return twoColS(dt,n,tot,'WHAT WE BUILD','Decision Crisis Immunization Infrastructure',
    `<p style="color:var(--text-secondary);font-size:16px;line-height:1.7">Not a chatbot. A system of specialized intelligences that debate, dissent, and decide — with cryptographic proof of every step.</p><div class="divider" style="margin:20px 0"></div><ul><li><strong>Multi-agent deliberation</strong> — 14 specialized agents</li><li><strong>Cryptographic audit trail</strong> — immutable evidence</li><li><strong>Zero-copy architecture</strong> — data never leaves your DB</li><li><strong>Sovereign deployment</strong> — air-gapped to cloud</li></ul>`,
    `<div class="card card--gold"><h4 class="gold">The Council™</h4><p style="color:var(--text-secondary);font-size:14px;margin-top:8px">14 agents (CFO, CISO, Risk, Strategy, Legal) deliberate on your data. You get a boardroom debate, not a chatbot answer.</p></div><div class="card card--blue" style="margin-top:16px"><h4 class="blue">Audit Provenance™</h4><p style="color:var(--text-secondary);font-size:14px;margin-top:8px">Every decision, vote, dissent — hashed, timestamped, exportable. When the auditor says "prove it," hand them this.</p></div>`);
}

function councilS(dt, n, tot) {
  return cardsS(dt,n,tot,'THE COUNCIL','14 Specialized AI Agents Deliberate',AGENTS_SHORT.slice(0,6).map(a=>[`${a[0]} — ${a[1]}`,`Specialized ${a[1].toLowerCase()} analysis`,'card--gold']),3);
}

// Build and write a deck
function writeDeck(filepath, slides) {
  const dir = path.dirname(filepath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(filepath, slides, 'utf8');
  console.log('  ✓ ' + path.relative(process.cwd(), filepath));
}

module.exports = { D, TIERS, DEPLOY, COMPLIANCE, AGENTS_SHORT, SOV_PATTERNS,
  hd, ft, sh, sf, titleS, quoteS, metricsS, cardsS, tableS, bulletS, twoColS, ctaS,
  pricingS, deployS, compliS, platMetrics, guaranteeS, whatWeDoS, councilS, writeDeck };
