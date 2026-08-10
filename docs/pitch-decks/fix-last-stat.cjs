const fs = require('fs');
const p = 'C:/Users/User/datacendia-core/docs/pitch-decks/sales/15-ai-governance-gap.html';
let c = fs.readFileSync(p, 'utf8');
const old = '<div class="value">83%</div><div class="label">Enterprises Have Shadow AI</div>';
const rep = '<div class="value">EU AI Act</div><div class="label">Requires AI System Documentation</div>';
if (c.includes(old)) {
  c = c.replace(old, rep);
  fs.writeFileSync(p, c);
  console.log('fixed: 83% Shadow AI -> EU AI Act');
} else {
  console.log('pattern not found');
}
