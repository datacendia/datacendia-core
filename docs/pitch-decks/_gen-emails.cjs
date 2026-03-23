#!/usr/bin/env node
/**
 * Generate personalized investor emails with archetype-based customization.
 * Sources:
 *   - investor-100: Rich .cjs data (120 investors with whyAlign, hookSlide, sector)
 *   - investor-500: JSON data (379 investors with type, region, portfolio, thesis)
 * Output: INVESTOR-EMAILS.md
 */
const fs = require('fs');
const path = require('path');

const BASE = __dirname;
const OUTPUT = path.join(BASE, 'INVESTOR-EMAILS.md');

// ─── Load investor-100 data (rich) ─────────────────────────────────────────
const inv100 = [
  ...require('./investor-100/investors-001-025.cjs'),
  ...require('./investor-100/investors-026-050.cjs'),
  ...require('./investor-100/investors-051-075.cjs'),
  ...require('./investor-100/investors-076-100.cjs'),
  ...require('./investor-100/investors-101-120.cjs'),
];

// ─── Load investor-500 data (JSON) ─────────────────────────────────────────
const inv500 = JSON.parse(fs.readFileSync(path.join(BASE, '_investor_500_data.json'), 'utf8'));

// ─── Archetype classification ──────────────────────────────────────────────
const ARCHETYPES = {
  'ai-infra':       { label: 'AI/ML Infrastructure' },
  'cybersecurity':  { label: 'Cybersecurity' },
  'fintech':        { label: 'Fintech' },
  'defense-gov':    { label: 'Defense & Government' },
  'impact-esg':     { label: 'Impact / ESG' },
  'corporate-vc':   { label: 'Corporate Strategic' },
  'sovereign':      { label: 'Sovereign / Institutional' },
  'growth-pe':      { label: 'Growth / PE / Crossover' },
  'european':       { label: 'European' },
  'asia-pacific':   { label: 'Asia-Pacific' },
  'middle-east':    { label: 'Middle East' },
  'healthcare':     { label: 'Healthcare' },
  'open-source':    { label: 'Open Source / Developer' },
  'data-infra':     { label: 'Data Infrastructure' },
  'general-vc':     { label: 'Venture Capital' },
};

function classifyArchetype(inv) {
  const text = [
    inv.type || '', inv.sector || '', inv.thesis || '',
    inv.keyAngle || '', inv.firm || inv.name || '',
    inv.region || '',
  ].join(' ').toLowerCase();

  if (/defense|military|intelligence|diu|govern.*tech|national.security|cleared|itar|dod/.test(text)) return 'defense-gov';
  if (/sovereign.wealth|pension|endowment|swf/.test(text)) return 'sovereign';
  if (/cyber|security(?!.*sovereign)|zero.trust|threat|siem/.test(text)) return 'cybersecurity';
  if (/fintech|banking|financial.*tech|regtech|payment|insurtech|digital.asset/.test(text)) return 'fintech';
  if (/health|pharma|clinical|biotech|medical/.test(text)) return 'healthcare';
  if (/impact|esg|responsible|sustainable|climate|social.enterprise|mission.driven/.test(text)) return 'impact-esg';
  if (/corporate.v|cvc|strategic.*invest|ventures.*\(/.test(text)) return 'corporate-vc';
  if (/growth.equity|crossover|private.equity|buyout|late.stage|secondary/.test(text)) return 'growth-pe';
  if (/open.source|developer|devops|devtool/.test(text)) return 'open-source';
  if (/\bai\b|machine.learn|deep.tech|ml|artificial|foundation.model|llm|frontier/.test(text)) return 'ai-infra';
  if (/data(?!cendia)|analytics|observ|monitor/.test(text)) return 'data-infra';

  // Region-based fallback
  const region = inv.region || '';
  const loc = (inv.hq || inv.loc || '').toLowerCase();
  if (/middle.east|uae|saudi|dubai|abu.dhabi|qatar|bahrain|oman|kuwait/.test(loc) || region === 'middle-east') return 'middle-east';
  if (/asia|japan|korea|china|india|singapore|australia|hong.kong|tokyo|seoul|mumbai|bangalore|sydney/.test(loc) || region === 'asia') return 'asia-pacific';
  if (/eu\b|europe|london|berlin|paris|munich|amsterdam|stockholm|oslo|helsinki|dublin|madrid|barcelona|brussels|zurich|geneva|copenhagen|vienna|lisbon|milan|rome|warsaw|prague|luxembourg/.test(loc) || region === 'eu') return 'european';

  return 'general-vc';
}

// ─── Archetype-specific "Why you" templates ────────────────────────────────
// Each returns a paragraph string given investor data
const WHY_TEMPLATES = {
  'ai-infra': (inv) => {
    const p = topPortfolio(inv);
    return p.length
      ? `${inv._firm} has backed the AI infrastructure stack — ${p.join(', ')}. Every enterprise deploying these tools will face one question from regulators: "Prove how AI made that decision." Datacendia is the infrastructure layer that produces that proof — cryptographic decision evidence for every AI-assisted action.`
      : `${inv._firm} invests in the AI infrastructure that enterprises depend on. As adoption scales, regulatory accountability becomes the bottleneck. Datacendia is the missing governance layer — cryptographic proof of how AI-assisted decisions are made, stored on your infrastructure.`;
  },
  'cybersecurity': (inv) => {
    const p = topPortfolio(inv);
    return p.length
      ? `${inv._firm} has built a security portfolio — ${p.join(', ')} — that protects data in motion and at rest. Datacendia extends that protection to AI decisions: zero-trust architecture where data never leaves customer infrastructure, cryptographic evidence chains (Ed25519, Merkle trees), and sovereign deployment including air-gapped environments.`
      : `${inv._firm} understands that the next frontier of enterprise security is AI accountability. Datacendia applies zero-trust principles to AI decision-making: data never moves, decisions are cryptographically signed, and every deliberation is replayable. This is security for the AI era.`;
  },
  'fintech': (inv) => {
    const p = topPortfolio(inv);
    return p.length
      ? `${inv._firm} has backed financial infrastructure — ${p.join(', ')} — that moves and manages money. DORA mandates operational traceability for AI in financial services. EU AI Act penalties reach €35M or 7% of revenue. Datacendia produces the decision evidence trail that makes AI-assisted financial decisions audit-ready by design.`
      : `${inv._firm} invests where compliance and technology converge. With DORA and EU AI Act enforcement accelerating, every financial institution using AI needs cryptographic proof of how decisions were made. Datacendia is that proof layer — built for regulated financial infrastructure.`;
  },
  'defense-gov': (inv) => {
    const p = topPortfolio(inv);
    return p.length
      ? `${inv._firm} backs technology for national security — ${p.join(', ')}. Datacendia is the only decision intelligence platform that runs fully air-gapped with hardware-rooted trust (TPM 2.0), supports ITAR/CUI-compliant deployment, and produces cryptographic decision evidence. No data leaves the customer's network. Ever.`
      : `${inv._firm} understands that sovereign AI is not optional for defense and intelligence. Datacendia deploys air-gapped with hardware-rooted trust, supports classified environments, and produces cryptographic evidence for every AI decision. Built for environments where "trust but verify" means TPM attestation and Ed25519 signatures.`;
  },
  'impact-esg': (inv) => {
    return `${inv._firm} invests at the intersection of technology and accountability. Datacendia makes AI decisions transparent, explainable, and auditable — the infrastructure that ensures AI systems serve institutional goals rather than encode hidden biases. Every decision is recorded with cryptographic evidence, formal dissent tracking, and adversarial challenge. This is responsible AI infrastructure, not a chatbot.`;
  },
  'corporate-vc': (inv) => {
    const p = topPortfolio(inv);
    const parent = inv._firm.replace(/\s*(Ventures|Capital|Innovation|Strategic|Catalyst|Fund).*$/i, '');
    return `${inv._firm} invests to strengthen its enterprise ecosystem. Datacendia integrates with existing infrastructure — deploying on private cloud, on-prem, or air-gapped — and adds the AI governance layer that regulated enterprises are being forced to adopt. Zero-copy architecture means data never leaves your customers' databases. ${p.length ? `Your portfolio adjacency with ${p.slice(0,2).join(' and ')} creates natural co-sell opportunities.` : ''}`;
  },
  'sovereign': (inv) => {
    return `${inv._firm} deploys patient capital in technology infrastructure that shapes industries. Datacendia is building the decision evidence standard for enterprise AI — comparable to what SSL/TLS became for internet security. As 140+ countries pass data sovereignty laws and the EU AI Act mandates auditability, Datacendia's sovereign deployment model (including air-gapped) positions it as critical national AI infrastructure. We're raising a pre-seed round, but the market timing and infrastructure-layer positioning align with how ${inv._firm} identifies generational platform shifts early.`;
  },
  'growth-pe': (inv) => {
    const p = topPortfolio(inv);
    return `${inv._firm} backs technology platforms at scale${p.length ? ` — ${p.slice(0,3).join(', ')}` : ''}. Datacendia is pre-revenue and raising a pre-seed round, which is earlier than your typical entry point. I'm reaching out because the decision evidence category is emerging now — analogous to where cloud security was in 2012 — and early visibility matters. Our platform is production-ready (205K+ tests, 156 API endpoints, live at app.datacendia.com), and we're targeting $500K–$1.5M enterprise contracts. Happy to share our pipeline and GTM plan if the timing or stage interest aligns.`;
  },
  'european': (inv) => {
    const p = topPortfolio(inv);
    const loc = inv.hq || inv.loc || '';
    return p.length
      ? `${inv._firm} has backed ${p.join(', ')} — companies building in the regulatory reality of the EU. The EU AI Act (enforcement 2025–2026) mandates decision auditability for high-risk AI, with penalties up to €35M or 7% of revenue. Datacendia produces the cryptographic decision evidence that makes enterprises compliant by design, not by retrofit. Sovereign deployment ensures data stays within EU jurisdiction.`
      : `${inv._firm} invests in European technology where regulation drives infrastructure adoption. The EU AI Act is the GDPR moment for AI — and Datacendia is the compliance infrastructure layer. We deploy on-prem or in sovereign cloud, data never leaves EU jurisdiction, and every AI decision produces a cryptographic evidence packet for regulators. First-mover in a market that the EU is legislating into existence.`;
  },
  'asia-pacific': (inv) => {
    const p = topPortfolio(inv);
    const loc = (inv.hq || inv.loc || '').toLowerCase();
    let regionHook = 'Asia-Pacific';
    let regRef = "Singapore's Model AI Governance Framework, Japan's AI Strategy, and Australia's AI Ethics Principles";
    if (/japan|tokyo/.test(loc)) { regionHook = 'Japan'; regRef = "Japan's AI Strategy and Society 5.0 framework"; }
    else if (/korea|seoul/.test(loc)) { regionHook = 'South Korea'; regRef = "South Korea's National AI Strategy and K-AI governance standards"; }
    else if (/india|mumbai|bangalore|delhi/.test(loc)) { regionHook = 'India'; regRef = "India's DPDP Act and emerging AI governance framework"; }
    else if (/australia|sydney|melbourne/.test(loc)) { regionHook = 'Australia'; regRef = "Australia's AI Ethics Principles and Critical Infrastructure Act"; }
    else if (/singapore/.test(loc)) { regionHook = 'Southeast Asia'; regRef = "Singapore's Model AI Governance Framework and MAS AI guidelines"; }
    else if (/china|beijing|shanghai|shenzhen|hong.kong/.test(loc)) { regionHook = 'Greater China'; regRef = "China's AI governance regulations and cross-border data requirements"; }
    return p.length
      ? `${inv._firm} has backed ${p.join(', ')} across ${regionHook}. As ${regRef} accelerate AI accountability requirements, enterprises across the region need decision evidence infrastructure. Datacendia's sovereign deployment — including air-gapped — ensures data never leaves sovereign territory, with cryptographic proof of every AI decision.`
      : `${inv._firm} invests in ${regionHook} technology where data sovereignty is non-negotiable. ${regRef} are creating AI accountability mandates. Datacendia deploys on-prem or air-gapped, produces cryptographic decision evidence, and supports 26 languages — built for markets where sovereign AI infrastructure is a regulatory requirement, not a feature.`;
  },
  'middle-east': (inv) => {
    const loc = (inv.hq || inv.loc || '').toLowerCase();
    let regionHook;
    if (/saudi|riyadh/.test(loc)) regionHook = "Saudi Vision 2030 prioritizes AI sovereignty and digital transformation. Datacendia deploys air-gapped — data never leaves Saudi territory — with cryptographic proof of every AI decision. As the Kingdom builds national AI infrastructure, decision accountability is foundational.";
    else if (/uae|dubai|abu.dhabi/.test(loc)) regionHook = "The UAE's National AI Strategy 2031 and Abu Dhabi's technology diversification demand sovereign AI infrastructure. Datacendia deploys air-gapped — data never leaves UAE territory — with cryptographic evidence for every AI decision.";
    else regionHook = "MENA's AI sovereignty ambitions — Saudi Vision 2030, UAE National AI Strategy, Qatar National Vision — demand infrastructure where data never leaves sovereign territory. Datacendia deploys air-gapped with cryptographic proof of every AI decision.";
    return `${inv._firm} invests at the intersection of sovereign technology and regional ambition. ${regionHook} As governments and enterprises adopt AI at national scale, decision evidence infrastructure becomes as critical as the models themselves.`;
  },
  'healthcare': (inv) => {
    const p = topPortfolio(inv);
    return `${inv._firm} invests in healthcare technology${p.length ? ` — ${p.join(', ')}` : ''} where regulatory compliance is existential. HIPAA requires audit trails for AI-assisted clinical decisions. FDA is developing AI/ML-based software guidance. Datacendia produces cryptographic evidence for every AI-assisted decision, deploys within healthcare infrastructure (HIPAA-compliant, on-prem capable), and supports the clinical decision documentation that regulators are beginning to mandate.`;
  },
  'open-source': (inv) => {
    const p = topPortfolio(inv);
    return `${inv._firm} backs developer infrastructure${p.length ? ` — ${p.join(', ')}` : ''}. Datacendia has an Apache 2.0 open-source foundation that builds trust and community adoption, with enterprise features (sovereign deployment, cryptographic evidence, compliance automation) on top. This mirrors the open-core model that built Elastic, GitLab, and Hashicorp — community adoption drives enterprise pipeline.`;
  },
  'data-infra': (inv) => {
    const p = topPortfolio(inv);
    return p.length
      ? `${inv._firm} has backed the data infrastructure stack — ${p.join(', ')}. Datacendia sits downstream of every data platform: it governs the decisions made with that data. Zero-copy architecture connects directly to PostgreSQL, MySQL, SQL Server, Oracle, MongoDB — no ETL, no data movement. As enterprises face "prove your AI decisions" pressure, Datacendia completes the data stack with decision evidence.`
      : `${inv._firm} invests in data infrastructure that enterprises depend on. Datacendia is the governance layer that sits between data platforms and regulatory accountability — producing cryptographic evidence of how AI decisions consume and act on enterprise data. Zero-copy architecture means we connect to existing databases without moving data.`;
  },
  'general-vc': (inv) => {
    const p = topPortfolio(inv);
    return p.length
      ? `${inv._firm} backs companies building category-defining technology${p.length ? ` — ${p.join(', ')}` : ''}. Datacendia is creating the AI governance category: cryptographic decision evidence infrastructure for regulated enterprises. No incumbent exists. EU AI Act enforcement begins 2025–2026, creating a regulatory forcing function for adoption. We're the infrastructure layer that enterprises will need between AI deployment and regulatory compliance.`
      : `${inv._firm} invests in technology that becomes essential infrastructure. Datacendia is building the decision evidence layer for enterprise AI — cryptographic proof of how AI-assisted decisions are made. The EU AI Act, DORA, and emerging global AI regulations are creating a compliance mandate with no existing solution. We're first-mover in a category that regulation is legislating into existence.`;
  },
};

// ─── Archetype-specific "What's built" sections ────────────────────────────
const WHATS_BUILT = {
  'ai-infra': [
    '- 205K+ passing tests, 156 validated API endpoints, live production platform at app.datacendia.com',
    '- Multi-agent deliberation engine: 50+ specialized agent presets (CFO, CISO, Risk, Legal, Strategy) with structured dissent',
    '- Cryptographic decision evidence: Ed25519 signatures, Merkle trees, RFC 3161 timestamping',
    '- 4 deployment modes: cloud, private cloud, on-prem, air-gapped',
  ],
  'cybersecurity': [
    '- 205K+ passing tests, 156 validated API endpoints, zero-trust architecture throughout',
    '- Cryptographic evidence chain: Ed25519/RSA-PSS signatures, Merkle tree integrity, immutable audit ledger',
    '- Zero-copy architecture: data never leaves customer databases — read-only connections, customer-owned encryption',
    '- Sovereign deployment: air-gapped with TPM 2.0 attestation and HSM key storage',
  ],
  'fintech': [
    '- 205K+ passing tests, 156 validated API endpoints, compliance-first architecture',
    '- Automated evidence for SOC 2, ISO 27001, GDPR, DORA, and EU AI Act — one-click audit packets',
    '- Cryptographic decision evidence: immutable audit trail with Ed25519 signatures for every AI action',
    '- Sovereign deployment: private cloud or on-prem, no CLOUD Act exposure, zero-copy data architecture',
  ],
  'defense-gov': [
    '- 205K+ passing tests, 156 validated API endpoints, sovereign-first architecture',
    '- Air-gapped deployment with TPM 2.0 attestation, HSM key storage, 11 sovereign patterns',
    '- Cryptographic evidence: Ed25519/RSA-PSS signatures, Merkle trees — every decision replayable and verifiable',
    '- Zero-copy architecture: no data movement, no external dependencies, customer-owned keys',
  ],
  'impact-esg': [
    '- 205K+ passing tests, 156 validated API endpoints, live at app.datacendia.com',
    '- Formal dissent tracking: every AI disagreement is logged, protected, and linked to outcomes — accountability by design',
    '- Multi-agent deliberation: 50+ agent presets ensure diverse perspectives on every decision, not AI groupthink',
    '- Cryptographic transparency: immutable evidence of how decisions were made, exportable for stakeholders',
  ],
  'corporate-vc': [
    '- 205K+ passing tests, 156 validated API endpoints, enterprise-ready platform',
    '- Zero-copy integration: connects to PostgreSQL, MySQL, SQL Server, Oracle, MongoDB — no ETL, no data movement',
    '- Sovereign deployment: private cloud, on-prem, or air-gapped — deploys within existing enterprise infrastructure',
    '- NVIDIA Inception member; open-core Apache 2.0 foundation with enterprise tier',
  ],
  'sovereign': [
    '- 205K+ passing tests, 156 validated API endpoints, production platform at app.datacendia.com',
    '- Sovereign deployment: air-gapped, on-prem, private cloud — 11 sovereign patterns including data diode and TPM attestation',
    '- Compliance automation for 17 jurisdictions: EU AI Act, GDPR, DORA, SOC 2, ISO 27001, HIPAA, FedRAMP pathway',
    '- NVIDIA Inception member; enterprise pricing from $50K pilots to $100M+ nation-scale deployments',
  ],
  'growth-pe': [
    '- 205K+ passing tests, 156 validated API endpoints, production platform live at app.datacendia.com',
    '- Revenue model: $50K pilot → $500K department → $1.5M enterprise → $100M+ nation-scale (90-day money-back guarantee)',
    '- Multi-agent deliberation with cryptographic evidence — no competitor has equivalent architecture',
    '- NVIDIA Inception member; 5-tier pricing from community (free) to nation-scale ($100M+)',
  ],
  'european': [
    '- 205K+ passing tests, 156 validated API endpoints, live production platform',
    '- EU AI Act compliance-ready: automated evidence generation for high-risk AI auditability requirements',
    '- Sovereign deployment: on-prem or EU-jurisdiction cloud — data never leaves customer infrastructure',
    '- Cryptographic decision evidence: Ed25519 signatures, Merkle trees — regulator-ready audit packets on demand',
  ],
  'asia-pacific': [
    '- 205K+ passing tests, 156 validated API endpoints, multi-language platform (26 languages)',
    '- Sovereign deployment: air-gapped, on-prem, private cloud — built for data sovereignty requirements',
    '- Cryptographic decision evidence: immutable audit trail compliant with emerging APAC AI governance frameworks',
    '- NVIDIA Inception member; enterprise pricing from $50K pilots to nation-scale deployments',
  ],
  'middle-east': [
    '- 205K+ passing tests, 156 validated API endpoints, sovereign-first architecture',
    '- Air-gapped and on-prem deployment: data never leaves sovereign territory, 11 sovereign deployment patterns',
    '- Multi-language platform (26 languages including Arabic) with cryptographic decision evidence',
    '- NVIDIA Inception member; pricing from $50K pilots to $100M+ nation-scale sovereign deployments',
  ],
  'healthcare': [
    '- 205K+ passing tests, 156 validated API endpoints, HIPAA-architecture platform',
    '- Cryptographic decision evidence: full audit trail for AI-assisted clinical and operational decisions',
    '- Sovereign deployment: on-prem or private cloud — PHI never leaves healthcare infrastructure',
    '- Compliance automation: SOC 2, ISO 27001, HIPAA evidence packets generated automatically',
  ],
  'open-source': [
    '- 205K+ passing tests, 156 validated API endpoints, Apache 2.0 open-source foundation',
    '- Open-core model: community edition drives adoption, enterprise features (sovereign, compliance, crypto evidence) on top',
    '- Multi-agent deliberation with 50+ specialized agent presets and cryptographic audit trail',
    '- 4 deployment modes: cloud, private cloud, on-prem, air-gapped — developer-friendly architecture',
  ],
  'data-infra': [
    '- 205K+ passing tests, 156 validated API endpoints, zero-copy data architecture',
    '- Connects to PostgreSQL, MySQL, SQL Server, Oracle, MongoDB, DB2 — no ETL, no data copies, read-only',
    '- Cryptographic decision evidence: Ed25519 signatures link every AI decision back to source data lineage',
    '- 4 deployment modes: cloud, private cloud, on-prem, air-gapped',
  ],
  'general-vc': [
    '- 205K+ passing tests, 156 validated API endpoints, live production platform at app.datacendia.com',
    '- Multi-agent deliberation: 50+ specialized agent presets with cryptographic evidence (Ed25519, Merkle trees)',
    '- Sovereign deployment: cloud, private cloud, on-prem, air-gapped',
    '- NVIDIA Inception member; open-core Apache 2.0 foundation with enterprise tier',
  ],
};

// ─── Subject line variations ───────────────────────────────────────────────
const SUBJECTS = {
  'ai-infra':      (f) => `Datacendia — The Governance Layer for Enterprise AI | For ${f}`,
  'cybersecurity': (f) => `Datacendia — Zero-Trust Decision Evidence for AI Systems | For ${f}`,
  'fintech':       (f) => `Datacendia — DORA & EU AI Act Decision Evidence Infrastructure | For ${f}`,
  'defense-gov':   (f) => `Datacendia — Sovereign AI Decision Intelligence (Air-Gapped) | For ${f}`,
  'impact-esg':    (f) => `Datacendia — Accountable AI Infrastructure with Decision Evidence | For ${f}`,
  'corporate-vc':  (f) => `Datacendia — Enterprise AI Governance for Your Ecosystem | For ${f}`,
  'sovereign':     (f) => `Datacendia — Sovereign Decision Evidence Infrastructure | For ${f}`,
  'growth-pe':     (f) => `Datacendia — Decision Evidence Platform (Enterprise AI Governance) | For ${f}`,
  'european':      (f) => `Datacendia — EU AI Act Decision Evidence Infrastructure | For ${f}`,
  'asia-pacific':  (f) => `Datacendia — Sovereign AI Decision Evidence for APAC Enterprises | For ${f}`,
  'middle-east':   (f) => `Datacendia — Sovereign AI Infrastructure for National Decision Intelligence | For ${f}`,
  'healthcare':    (f) => `Datacendia — HIPAA-Compliant AI Decision Evidence | For ${f}`,
  'open-source':   (f) => `Datacendia — Open-Core AI Governance Infrastructure | For ${f}`,
  'data-infra':    (f) => `Datacendia — Decision Evidence for the Data Stack | For ${f}`,
  'general-vc':    (f) => `Datacendia — Decision Evidence Infrastructure for Enterprise AI | For ${f}`,
};

// ─── Helpers ───────────────────────────────────────────────────────────────

function topPortfolio(inv) {
  const p = inv.portfolio || [];
  // Filter out generic/placeholder entries
  return p.filter(c =>
    c && c.length < 40 &&
    !/enterprise|startup|ecosystem|allocation|infrastructure|investment|tech$|globally|alumni|network|initiatives/i.test(c)
  ).slice(0, 4);
}

function fixCase(name) {
  const acronyms = new Set([
    'A16Z','GV','NEA','CRV','IVP','ADIA','GIC','KKR','DARPA','CIA','NSF','DOE',
    'NASA','SPRIND','EIC','NGI','NTT','IBM','BECO','STV','GFC','JAFCO','DCM',
    'DIU','NYCA','QED','NYDIG','CDPQ','PIF','ADQ','OMERS','SAP','PTC','NTT',
    'SVB','TCV','JP','PUMA','SADC','IMF','WHO','UN','DPDP','MAS',
  ]);
  const preserveExact = {
    'a16z': 'a16z', 'dbt': 'dbt', 'iO': 'iO',
  };
  return name.split(' ').map(w => {
    if (preserveExact[w]) return preserveExact[w];
    // Handle parenthesized acronyms like (PIF), (DIU)
    const parenMatch = w.match(/^\(([A-Za-z]+)\)$/);
    if (parenMatch) {
      const inner = parenMatch[1].toUpperCase();
      if (acronyms.has(inner)) return `(${inner})`;
      return w;
    }
    if (acronyms.has(w.toUpperCase()) && w.length <= 5) return w.toUpperCase();
    if (w.toUpperCase() === w && w.length > 3) return w[0] + w.slice(1).toLowerCase();
    return w;
  }).join(' ')
    .replace(/\(A16z\)/g, '(a16z)')
    .replace(/Dbt Labs/g, 'dbt Labs')
    .replace(/\bDbl\b/g, 'DBL')
    .replace(/\bTpg\b/g, 'TPG');
}

function isNonSeedStage(inv) {
  const type = (inv.type || '').toLowerCase();
  const stage = (inv.stage || '').toLowerCase();
  const thesis = (inv.thesis || '').toLowerCase();

  // If stage explicitly includes seed/pre-seed, they DO invest early
  if (/seed|pre.seed|early/i.test(stage)) return false;

  // If type is explicitly non-seed
  if (/growth.equity|crossover|private.equity|buyout|sovereign.wealth|pension|endowment|hedge.fund|asset.manag|secondary|fund.of.fund|investment.holding/i.test(type)) return true;

  // If thesis mentions late/growth stage explicitly
  if (/late.stage|growth.stage|buyout|crossover|public.private/i.test(thesis)) return true;

  // Default: assume they could do early stage (most VCs can)
  return false;
}

function getDeckPath(inv) {
  if (inv.id) {
    // investor-100 format
    return `investor-100/pptx/${inv.id}.pptx`;
  }
  if (inv.num) {
    return `investor-500/pptx/${String(inv.num).padStart(3,'0')}-${inv.slug}.pptx`;
  }
  return '';
}

// ─── Normalize investor data to common shape ───────────────────────────────
function normalize(inv, source) {
  if (source === 'inv100') {
    return {
      _firm: fixCase(inv.firm),
      _firmRaw: inv.firm,
      type: inv.type || 'Venture Capital',
      hq: inv.hq || '',
      loc: inv.hq || '',
      stage: inv.stage || '',
      aum: inv.aum || '',
      thesis: inv.thesis || '',
      portfolio: inv.portfolio || [],
      whyAlign: inv.whyAlign || '',
      hookSlide: inv.hookSlide || '',
      keyAngle: inv.keyAngle || '',
      sector: inv.sector || '',
      region: '',
      id: inv.id,
      num: parseInt((inv.id || '').split('-')[0]) || 0,
      slug: (inv.id || '').replace(/^\d+-/, ''),
      _source: 'inv100',
    };
  } else {
    return {
      _firm: fixCase(inv.name),
      _firmRaw: inv.name,
      type: inv.type || 'Venture Capital',
      hq: inv.loc || '',
      loc: inv.loc || '',
      stage: '',
      aum: inv.aum || '',
      thesis: inv.thesis || '',
      portfolio: inv.portfolio || [],
      whyAlign: '',
      hookSlide: '',
      keyAngle: '',
      sector: '',
      region: inv.region || '',
      id: '',
      num: inv.num,
      slug: inv.slug,
      _source: 'inv500',
    };
  }
}

// ─── Generate email for one investor ───────────────────────────────────────
function generateEmail(inv) {
  const archetype = classifyArchetype(inv);
  const firm = inv._firm;
  const deckPath = getDeckPath(inv);

  // Context line
  const ctxParts = [];
  if (inv.type) ctxParts.push(inv.type);
  if (inv.hq || inv.loc) ctxParts.push(inv.hq || inv.loc);
  if (inv.aum) ctxParts.push(inv.aum);
  const contextLine = ctxParts.length ? `*${ctxParts.join(' · ')}*` : '';

  // Subject
  const subject = (SUBJECTS[archetype] || SUBJECTS['general-vc'])(firm);

  // "Why [Firm]" — use rich data for inv100, archetype template for inv500
  let whyParagraph;
  if (inv._source === 'inv100' && inv.whyAlign) {
    // Use the rich whyAlign (thesis hook) + hookSlide (portfolio connection)
    whyParagraph = inv.hookSlide
      ? `${inv.whyAlign} ${inv.hookSlide}`
      : inv.whyAlign;
  } else {
    // Use archetype template
    const templateFn = WHY_TEMPLATES[archetype] || WHY_TEMPLATES['general-vc'];
    whyParagraph = templateFn(inv);
  }

  // "What's built"
  const builtLines = WHATS_BUILT[archetype] || WHATS_BUILT['general-vc'];

  // Stage-mismatch bridge (for growth/PE/sovereign/large funds)
  let stageBridge = '';
  if (isNonSeedStage(inv) && archetype !== 'growth-pe') {
    // growth-pe archetype already has stage bridge built into the Why paragraph
    stageBridge = `*Note: We're raising a $1.5M pre-seed at $7M pre-money. I'm reaching out because category visibility at the infrastructure layer matters early, and your perspective on market timing would be valuable regardless of stage fit.*`;
  }

  // Build email
  const lines = [];
  lines.push(`### ${firm}`);
  lines.push(`**Deck:** \`${deckPath}\``);
  if (contextLine) lines.push(contextLine);
  lines.push('');
  lines.push(`**Subject:** ${subject}`);
  lines.push('');
  lines.push('**Body:**');
  lines.push('');
  lines.push(`Hi [FIRST NAME],`);
  lines.push('');
  lines.push(`I'm Stuart Rainey, founder of Datacendia. I've built the decision evidence layer for enterprise AI — the infrastructure that produces cryptographic proof of how AI-assisted decisions are made.`);
  lines.push('');
  lines.push(`**Why ${firm}:** ${whyParagraph}`);
  lines.push('');

  if (stageBridge) {
    lines.push(stageBridge);
    lines.push('');
  }

  lines.push("**What's built (not idea-stage):**");
  for (const line of builtLines) {
    lines.push(line);
  }
  lines.push('');
  lines.push("**The ask:** $1.5M pre-seed at $7M pre-money. Engineering risk is resolved — this is a GTM-stage investment. Funds go to first enterprise pilots, SOC 2 Type II certification, and EU AI Act regulatory validation.");
  lines.push('');
  lines.push(`I've attached a deck personalized for ${firm}. Happy to schedule a 20-minute deep dive or live demo at your convenience.`);
  lines.push('');
  lines.push('Best,');
  lines.push('Stuart Rainey');
  lines.push('Founder & CEO, Datacendia');
  lines.push('contact@datacendia.com | datacendia.com | app.datacendia.com');

  return { text: lines.join('\n'), archetype };
}

// ─── Main ──────────────────────────────────────────────────────────────────
function main() {
  // Normalize all investors, deduplicating by firm name (inv100 takes priority)
  const allInvestors = [];
  const seenFirms = new Set();

  for (const inv of inv100) {
    const n = normalize(inv, 'inv100');
    allInvestors.push(n);
    seenFirms.add(n._firm.toLowerCase());
  }
  let skipped = 0;
  for (const inv of inv500) {
    const n = normalize(inv, 'inv500');
    if (seenFirms.has(n._firm.toLowerCase())) {
      skipped++;
      continue;
    }
    seenFirms.add(n._firm.toLowerCase());
    allInvestors.push(n);
  }
  if (skipped) console.log(`Deduplicated: skipped ${skipped} investor-500 entries already in investor-100`);

  // Sort: inv100 first (by id num), then inv500 (by num)
  allInvestors.sort((a, b) => {
    const na = a.num || 0;
    const nb = b.num || 0;
    if (a._source !== b._source) return a._source === 'inv100' ? -1 : 1;
    return na - nb;
  });

  // Generate emails
  const emails = [];
  const archetypeCounts = {};

  for (const inv of allInvestors) {
    const { text, archetype } = generateEmail(inv);
    emails.push(text);
    archetypeCounts[archetype] = (archetypeCounts[archetype] || 0) + 1;
  }

  // Write output
  const out = [];
  out.push('# Personalized Investor Emails\n');
  out.push('Each email below is **individually customized** based on investor archetype, portfolio alignment, thesis fit, and stage.\n');
  out.push('Replace `[FIRST NAME]` with the actual contact name. Attach the **PDF version** of the deck.\n');
  out.push(`**Total: ${emails.length} personalized emails**\n`);

  // Archetype distribution
  out.push('## Archetype Distribution\n');
  out.push('| Archetype | Count |');
  out.push('|-----------|-------|');
  for (const [arch, count] of Object.entries(archetypeCounts).sort((a,b) => b[1] - a[1])) {
    const label = ARCHETYPES[arch] ? ARCHETYPES[arch].label : arch;
    out.push(`| ${label} | ${count} |`);
  }
  out.push('');
  out.push('---\n');

  for (const email of emails) {
    out.push(email);
    out.push('\n---\n');
  }

  fs.writeFileSync(OUTPUT, out.join('\n'), 'utf8');
  console.log(`Generated ${emails.length} personalized emails`);
  console.log('Archetype distribution:');
  for (const [arch, count] of Object.entries(archetypeCounts).sort((a,b) => b[1] - a[1])) {
    console.log(`  ${arch}: ${count}`);
  }
  console.log(`Written to ${OUTPUT}`);
}

main();
