#!/usr/bin/env node
/**
 * Generate HTML pitch decks for all 50 investor-targeted decks.
 * Uses shared data + deck definitions to produce clean HTML files.
 */
const fs = require('fs');
const path = require('path');
const shared = require('./shared-data.cjs');
const decks1 = require('./decks-01-17.cjs');
const decks2 = require('./decks-18-34.cjs');
const decks3 = require('./decks-35-50.cjs');

const ALL_DECKS = [...decks1, ...decks2, ...decks3];
const outDir = path.join(__dirname, 'html');
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

function esc(s) { return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }

function buildHTML(deck, idx) {
  const totalSlides = 8;
  const num = String(idx+1).padStart(2,'0');
  const deckLabel = `INVESTOR \u2014 ${deck.cat.toUpperCase()}`;

  const slideHeader = (n) => `<div class="slide-header"><div class="logo">DATACENDIA</div><div class="deck-type">${deckLabel}</div><div class="slide-num">${n} / ${totalSlides}</div></div>`;
  const slideFooter = `<div class="slide-footer"><span>&copy; 2024\u20132026 Datacendia, LLC</span><span>datacendia.com</span></div>`;

  // Slide 1: Title
  const s1 = `<div class="slide slide--title">${slideHeader(1)}<div class="confidential">Confidential</div><div class="eyebrow">DATACENDIA</div><h1>${esc(deck.title)}</h1><p class="subtitle" style="text-align:center;margin:0 auto 30px">${esc(deck.sub)}</p><div class="divider divider--center"></div><p class="muted" style="margin-top:20px;font-size:14px">Decision Crisis Immunization Infrastructure</p><div style="position:absolute;top:24px;right:80px;z-index:20"><img src="../screenshots/nvidia-inception.png" alt="NVIDIA Inception Member" style="height:36px;opacity:0.9"></div>${slideFooter}</div>`;

  // Slide 2: Regulatory Drivers (4 metrics)
  const metrics = deck.drivers.map(d => `<div class="card metric"><div class="value">${esc(d.v)}</div><div class="label">${esc(d.l)}</div></div>`).join('');
  const s2 = `<div class="slide slide--dark">${slideHeader(2)}<div class="slide-content"><div class="eyebrow">WHY NOW</div><div class="grid-4" style="margin-top:40px">${metrics}</div></div>${slideFooter}</div>`;

  // Slide 3: Problem
  const bullets = deck.bullets.map(b => `<li>${esc(b)}</li>`).join('');
  const s3 = `<div class="slide slide--dark">${slideHeader(3)}<div class="slide-content"><div class="eyebrow">THE PROBLEM</div><h2>${esc(deck.problem)}</h2><ul style="margin-top:20px">${bullets}</ul></div>${slideFooter}</div>`;

  // Slide 4: Solution + Use Cases
  const cases = deck.cases.map(c => `<li><strong>${esc(c.split(' -- ')[0] || c.split(' \u2014 ')[0] || c)}</strong></li>`).join('');
  const s4 = `<div class="slide slide--dark">${slideHeader(4)}<div class="slide-content"><div class="eyebrow">THE SOLUTION</div><h2>How Datacendia Solves This</h2><div class="grid-2" style="margin-top:24px"><div><p style="color:var(--text-secondary);font-size:15px;line-height:1.7">${esc(deck.solution)}</p></div><div><div class="card card--gold"><h4 class="gold">Key Use Cases</h4><ul style="margin-top:12px;font-size:14px;color:var(--text-secondary)">${cases}</ul></div></div></div></div>${slideFooter}</div>`;

  // Slide 5: Investor Angle
  const s5 = `<div class="slide slide--dark">${slideHeader(5)}<div class="slide-content"><div class="eyebrow">INVESTOR THESIS</div><h2>Why This Is a Compelling Investment</h2><div class="grid-2" style="margin-top:24px"><div><p style="color:var(--text-secondary);font-size:15px;line-height:1.8">${esc(deck.angle)}</p></div><div><div class="card card--gold"><h4 class="gold">Platform Proof</h4><ul style="margin-top:12px;font-size:14px;color:var(--text-secondary)"><li><strong>205K+</strong> passing tests</li><li><strong>156</strong> validated API endpoints</li><li><strong>50+</strong> agent presets</li><li><strong>23</strong> jurisdictions covered</li><li><strong>4</strong> deployment modes</li><li><strong>Live</strong> at app.datacendia.com</li></ul></div></div></div></div>${slideFooter}</div>`;

  // Slide 6: Founder
  const fBullets = shared.FOUNDER.bullets.map(b => `<li>${esc(b)}</li>`).join('');
  const s6 = `<div class="slide slide--dark">${slideHeader(6)}<div class="slide-content"><div class="eyebrow">FOUNDER</div><h2>${esc(shared.FOUNDER.name)} \u2014 ${esc(shared.FOUNDER.title)}</h2><div class="grid-2" style="margin-top:24px"><div><ul style="margin-top:0">${fBullets}</ul></div><div><div class="card card--gold"><h4 class="gold">Why This Founder</h4><p style="color:var(--text-secondary);font-size:14px;margin-top:8px;line-height:1.6">${esc(shared.FOUNDER.whyCard)}</p></div></div></div></div>${slideFooter}</div>`;

  // Slide 7: The Ask
  const askCards = shared.ASK.cards.map(c => `<div class="card card--gold"><h4 class="gold">${esc(c.title)}</h4><p style="color:var(--text-secondary);font-size:14px;margin-top:8px;line-height:1.6">${esc(c.text)}</p></div>`).join('');
  const s7 = `<div class="slide slide--dark">${slideHeader(7)}<div class="slide-content"><div class="eyebrow">THE ASK</div><h2>${esc(shared.ASK.headline)}</h2><div class="grid-3" style="margin-top:24px">${askCards}</div><p style="margin-top:24px;text-align:center;color:var(--text-muted);font-size:14px">${esc(shared.ASK.footer)}</p></div>${slideFooter}</div>`;

  // Slide 8: CTA
  const s8 = `<div class="slide slide--cta">${slideHeader(8)}<div class="eyebrow">NEXT STEPS</div><h2>Let\u2019s Talk</h2><p class="subtitle" style="text-align:center;margin:0 auto 30px">${esc(deck.sub)}</p><div style="display:flex;gap:16px;flex-wrap:wrap;justify-content:center;margin-top:20px"><span class="tag tag--gold" style="font-size:14px;padding:8px 20px">Schedule Deep Dive</span><span class="tag tag--gold" style="font-size:14px;padding:8px 20px">Technical Demo</span><span class="tag tag--gold" style="font-size:14px;padding:8px 20px">Data Room Access</span><a href="https://app.datacendia.com" target="_blank" style="font-size:14px;padding:8px 20px;background:linear-gradient(135deg,#d4af37,#b8962e);color:#0a0e1a;border-radius:6px;text-decoration:none;font-weight:700;letter-spacing:0.5px;display:inline-block">Try Live Demo \u2192</a></div><p class="muted" style="margin-top:40px">contact@datacendia.com | datacendia.com</p><div style="position:absolute;top:24px;right:80px;z-index:20"><img src="../screenshots/nvidia-inception.png" alt="NVIDIA Inception Member" style="height:36px;opacity:0.9"></div>${slideFooter}</div>`;

  return `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"><title>Datacendia \u2014 ${esc(deck.title)}</title><link rel="stylesheet" href="../pitch-deck.css"><style>.slide-content{padding-top:60px;width:100%}</style></head><body>\n${s1}\n\n${s2}\n\n${s3}\n\n${s4}\n\n${s5}\n\n${s6}\n\n${s7}\n\n${s8}\n\n</body></html>`;
}

console.log(`Generating ${ALL_DECKS.length} HTML investor decks...\n`);
for (let i = 0; i < ALL_DECKS.length; i++) {
  const deck = ALL_DECKS[i];
  const html = buildHTML(deck, i);
  const filename = `${deck.id}.html`;
  fs.writeFileSync(path.join(outDir, filename), html, 'utf8');
  console.log(`  ${filename}`);
}
console.log(`\nDone! ${ALL_DECKS.length} HTML decks in ${outDir}`);
