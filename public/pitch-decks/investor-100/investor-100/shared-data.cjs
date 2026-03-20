/**
 * Shared factual content reused across all 100 personalized investor decks.
 * Every value here is verified — no fabricated stats.
 */

const FOUNDER = {
  name: 'Stuart Rainey',
  title: 'Founder & CEO',
  bullets: [
    '7 years as Senior Data Analyst at TCS, embedded with PGIM Fixed Income ($800B+ AUM)',
    'Built data infrastructure for regulated investment decisions at institutional scale',
    'M.S. in Big Data Analytics',
    'Author of the DDGI framework — ISO/IEC JTC 1/SC 42 standards track',
    'NVIDIA Inception member',
  ],
  whyCard: 'Built the exact data infrastructure that financial institutions need for AI governance — at one of the world\'s largest asset managers.',
};

const ASK = {
  headline: '$1.5M Pre-Seed — $7M Pre-Money Valuation',
  cards: [
    { title: 'What\'s Built', text: '205K+ passing tests. 156 validated API endpoints. Live production platform at app.datacendia.com.' },
    { title: 'Traction', text: '2 warm enterprise intros (financial institution, Big 4 channel). NVIDIA Inception member.' },
    { title: 'Use of Funds', text: 'GTM hiring, SOC 2 Type II certification, first enterprise pilots.' },
  ],
  footer: '$8.5M post-money · 21.5% dilution · Engineering risk resolved — GTM-stage investment.',
};

const PLATFORM = [
  { value: '205K+', label: 'Passing Tests' },
  { value: '156', label: 'Validated API Endpoints' },
  { value: '50+', label: 'Agent Presets' },
  { value: '23', label: 'Jurisdictions Covered' },
  { value: '4', label: 'Deployment Modes' },
];

const CAPABILITIES = [
  'Multi-agent deliberation with role-specific AI agents (CFO, CISO, Legal, Strategy, Risk, and more)',
  'Cryptographic decision evidence — Ed25519 signatures, Merkle trees, RFC 3161 timestamps',
  'Sovereign deployment — Cloud, Private Cloud, On-Premises, and Air-Gapped',
  'EU AI Act, DORA, GDPR, HIPAA compliance mapping across 23 jurisdictions',
  'Zero-copy data architecture — data never leaves customer infrastructure',
  'Open-source core (Apache 2.0) with enterprise features',
];

const GUARANTEE = 'Deploy Datacendia for 90 days on a single strategic problem. If the Council doesn\'t identify at least 3 critical risks you missed, we refund the pilot fee.';

module.exports = { FOUNDER, ASK, PLATFORM, CAPABILITIES, GUARANTEE };
