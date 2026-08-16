/**
 * Shared factual content reused across all 50 investor decks.
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
    { title: 'What\'s Built', text: '205K+ passing tests. 156 validated API endpoints. Live production platform.' },
    { title: 'Traction', text: '2 warm enterprise intros (financial institution, Big 4 channel). NVIDIA Inception.' },
    { title: 'Use of Funds', text: 'GTM hiring, SOC 2 Type II certification, first enterprise pilots.' },
  ],
  footer: '$8.5M post-money · 21.5% dilution · Engineering risk resolved — GTM-stage investment.',
};

const PLATFORM = [
  { value: '205K+', label: 'Passing Tests' },
  { value: '156', label: 'Validated API Endpoints' },
  { value: '50+', label: 'Agent Presets' },
  { value: '4', label: 'Deployment Modes' },
];

const PRICING = [
  { tier: 'Pilot', annual: '$50K', users: '10', sla: '99.5%' },
  { tier: 'Foundation', annual: '$150K–$500K', users: '50', sla: '99.9%' },
  { tier: 'Enterprise', annual: '$500K–$1.5M', users: '500', sla: '99.99%' },
  { tier: 'Strategic', annual: '$1.5M+', users: 'Unlimited', sla: '99.99%' },
];

const DEPLOYMENT = [
  { mode: 'Cloud (SaaS)', data: 'Our infrastructure', access: 'Full (logged)', setup: 'Hours' },
  { mode: 'Private Cloud', data: 'Your VPC', access: 'Metadata only', setup: 'Days' },
  { mode: 'On-Premises', data: 'Your data center', access: 'None', setup: 'Weeks' },
  { mode: 'Air-Gapped', data: 'Isolated network', access: 'None', setup: 'Weeks+' },
];

const GUARANTEE = 'Deploy Datacendia for 90 days on a single strategic problem. If the Council doesn\'t identify at least 3 critical risks you missed, we refund the pilot fee.';

module.exports = { FOUNDER, ASK, PLATFORM, PRICING, DEPLOYMENT, GUARANTEE };
