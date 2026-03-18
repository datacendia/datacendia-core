import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search, Map, Shield, Crown, Zap, Globe, Lock, Unlock,
  ChevronDown, ChevronRight, ExternalLink, Layers, LayoutGrid,
  Brain, Activity, Database, Settings, Users, FileText,
  Gavel, Eye, Fingerprint, BookOpen, Monitor, BarChart3,
  Building2, Compass, Sparkles, Server, Key, FlaskConical,
} from 'lucide-react';

// ─── Tier Definitions ───────────────────────────────────────────────────────
type Tier = 'foundation' | 'enterprise' | 'strategic';

const TIER_CONFIG: Record<Tier, { label: string; color: string; bg: string; border: string; icon: React.ReactNode }> = {
  foundation: { label: 'Foundation', color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', icon: <Unlock className="w-3 h-3" /> },
  enterprise: { label: 'Enterprise', color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20', icon: <Crown className="w-3 h-3" /> },
  strategic:  { label: 'Strategic',  color: 'text-purple-400', bg: 'bg-purple-500/10', border: 'border-purple-500/20', icon: <Sparkles className="w-3 h-3" /> },
};

// ─── Page Entry ─────────────────────────────────────────────────────────────
interface PageEntry {
  name: string;
  route: string;
  tier: Tier;
  gated?: boolean;
  description?: string;
}

interface Category {
  id: string;
  label: string;
  icon: React.ReactNode;
  color: string;
  pages: PageEntry[];
}

// ─── Platform Data ──────────────────────────────────────────────────────────
const CATEGORIES: Category[] = [
  {
    id: 'public',
    label: 'Public / Marketing',
    icon: <Globe className="w-5 h-5" />,
    color: 'text-blue-400',
    pages: [
      { name: 'Sovereign Landing', route: '/', tier: 'foundation', description: 'Primary marketing homepage' },
      { name: 'Legacy Landing', route: '/old-home', tier: 'foundation' },
      { name: 'Legacy Home', route: '/legacy-home', tier: 'foundation' },
      { name: 'Pricing', route: '/pricing', tier: 'foundation' },
      { name: 'Demo Request', route: '/demo', tier: 'foundation' },
      { name: 'Product', route: '/product', tier: 'foundation' },
      { name: 'About', route: '/about', tier: 'foundation' },
      { name: 'Contact', route: '/contact', tier: 'foundation' },
      { name: 'Manifesto', route: '/manifesto', tier: 'foundation' },
      { name: 'Downloads', route: '/downloads', tier: 'foundation' },
      { name: 'License', route: '/license', tier: 'foundation' },
      { name: 'Services', route: '/services', tier: 'foundation' },
      { name: 'Packages', route: '/packages', tier: 'foundation' },
      { name: 'SEI Overview', route: '/sovereign', tier: 'foundation' },
      { name: 'Honesty Matrices', route: '/honesty', tier: 'foundation' },
      { name: 'Showcases', route: '/showcases', tier: 'foundation' },
      { name: 'Privacy Policy', route: '/privacy', tier: 'foundation' },
      { name: 'Terms of Service', route: '/terms', tier: 'foundation' },
      { name: 'Security', route: '/security', tier: 'foundation' },
      { name: 'Cookie Policy', route: '/cookies', tier: 'foundation' },
      { name: 'Documentation', route: '/docs', tier: 'foundation' },
      { name: 'Blog', route: '/blog', tier: 'foundation' },
      { name: 'Changelog', route: '/changelog', tier: 'foundation' },
      { name: 'Support', route: '/support', tier: 'foundation' },
      { name: 'Integrations', route: '/integrations', tier: 'foundation' },
      { name: 'CendiaVerify™', route: '/verify', tier: 'foundation' },
      { name: 'Pitch Deck', route: '/pitch', tier: 'foundation' },
    ],
  },
  {
    id: 'apex',
    label: 'Apex Package',
    icon: <Zap className="w-5 h-5" />,
    color: 'text-cyan-400',
    pages: [
      { name: 'CendiaForecast™', route: '/apex/forecast', tier: 'foundation' },
      { name: 'CendiaSentry™', route: '/apex/sentry', tier: 'foundation' },
    ],
  },
  {
    id: 'auth',
    label: 'Auth',
    icon: <Key className="w-5 h-5" />,
    color: 'text-indigo-400',
    pages: [
      { name: 'Login', route: '/login', tier: 'foundation' },
      { name: 'Register', route: '/register', tier: 'foundation' },
      { name: 'Forgot Password', route: '/forgot-password', tier: 'foundation' },
      { name: 'Reset Password', route: '/reset-password', tier: 'foundation' },
      { name: 'Verify Email', route: '/verify-email', tier: 'foundation' },
      { name: 'Find Account', route: '/find-account', tier: 'foundation' },
      { name: 'Onboarding', route: '/onboarding', tier: 'foundation' },
    ],
  },
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: <LayoutGrid className="w-5 h-5" />,
    color: 'text-white',
    pages: [
      { name: 'Dashboard', route: '/cortex/dashboard', tier: 'foundation' },
    ],
  },
  {
    id: 'council',
    label: 'The Council',
    icon: <Brain className="w-5 h-5" />,
    color: 'text-amber-400',
    pages: [
      { name: 'Council', route: '/cortex/council', tier: 'foundation', description: 'Multi-agent deliberation' },
      { name: 'Deliberation View', route: '/cortex/council/deliberation/:id', tier: 'foundation' },
      { name: 'Agent Profile', route: '/cortex/council/agent/:id', tier: 'foundation' },
      { name: 'All Decisions', route: '/cortex/decisions', tier: 'foundation' },
      { name: 'Deliberation Visualization', route: '/cortex/council/visualization', tier: 'foundation' },
      { name: 'CendiaReplay™', route: '/cortex/council/replay-theater', tier: 'foundation' },
      { name: 'Council Modes', route: '/cortex/council/modes', tier: 'foundation' },
      { name: 'Post-Deliberation', route: '/cortex/council/post-deliberation/:id', tier: 'foundation' },
      { name: 'User Intervention', route: '/cortex/council/intervene/:id', tier: 'foundation' },
      { name: 'Executive Summary', route: '/cortex/council/executive-summary', tier: 'foundation' },
      { name: 'Council History', route: '/cortex/council/history', tier: 'foundation' },
      { name: 'Council Analytics', route: '/cortex/council/analytics', tier: 'foundation' },
    ],
  },
  {
    id: 'dcii',
    label: 'DCII',
    icon: <Fingerprint className="w-5 h-5" />,
    color: 'text-teal-400',
    pages: [
      { name: 'CendiaTruth™', route: '/cortex/dcii/truth', tier: 'foundation' },
      { name: 'CendiaNotary™', route: '/cortex/dcii/notary', tier: 'foundation' },
      { name: 'CendiaWitness™', route: '/cortex/dcii/witness', tier: 'foundation' },
      { name: 'CendiaTimestamp™', route: '/cortex/dcii/timestamp', tier: 'foundation' },
      { name: 'CendiaSimilarity™', route: '/cortex/dcii/similarity', tier: 'foundation' },
      { name: 'CendiaMemory™', route: '/cortex/dcii/memory', tier: 'foundation' },
      { name: 'Statement of Facts', route: '/cortex/dcii/statement-of-facts', tier: 'foundation' },
    ],
  },
  {
    id: 'decide',
    label: 'DECIDE Intelligence',
    icon: <Zap className="w-5 h-5" />,
    color: 'text-yellow-400',
    pages: [
      { name: 'Pre-Mortem', route: '/cortex/intelligence/pre-mortem', tier: 'foundation' },
      { name: 'Ghost Board', route: '/cortex/intelligence/ghost-board', tier: 'foundation' },
      { name: 'Decision Debt', route: '/cortex/intelligence/decision-debt', tier: 'foundation' },
      { name: 'Chronos', route: '/cortex/intelligence/chronos', tier: 'foundation' },
      { name: 'Live Demo', route: '/cortex/intelligence/live-demo', tier: 'foundation' },
      { name: 'CendiaRegulatory™', route: '/cortex/intelligence/regulatory', tier: 'enterprise', gated: true },
      { name: 'Decision DNA', route: '/cortex/intelligence/decision-dna', tier: 'enterprise', gated: true },
      { name: 'CendiaLens™', route: '/cortex/intelligence/lens', tier: 'enterprise', gated: true },
      { name: 'CendiaOrbit™', route: '/cortex/intelligence/orbit', tier: 'enterprise', gated: true },
      { name: 'Consensus Builder', route: '/cortex/intelligence/consensus', tier: 'enterprise', gated: true },
      { name: 'What-If Scenarios', route: '/cortex/intelligence/what-if', tier: 'enterprise', gated: true },
      { name: 'Synthesis Engine', route: '/cortex/intelligence/synthesis', tier: 'enterprise', gated: true },
      { name: 'RDP Service', route: '/cortex/intelligence/rdp', tier: 'enterprise', gated: true },
      { name: 'CendiaProvenance™', route: '/cortex/intelligence/audit-provenance', tier: 'enterprise', gated: true },
    ],
  },
  {
    id: 'gateway',
    label: 'CendiaGateway™',
    icon: <Shield className="w-5 h-5" />,
    color: 'text-cyan-400',
    pages: [
      { name: 'CendiaGateway™', route: '/cortex/gateway', tier: 'foundation', description: 'AI Governance Gateway' },
    ],
  },
  {
    id: 'graph',
    label: 'Graph',
    icon: <Layers className="w-5 h-5" />,
    color: 'text-blue-400',
    pages: [
      { name: 'Graph Explorer', route: '/cortex/graph', tier: 'foundation' },
      { name: 'Data Lineage', route: '/cortex/graph/lineage/:id', tier: 'foundation' },
      { name: 'Entity Details', route: '/cortex/graph/entity/:id', tier: 'foundation' },
    ],
  },
  {
    id: 'pulse',
    label: 'Pulse',
    icon: <Activity className="w-5 h-5" />,
    color: 'text-green-400',
    pages: [
      { name: 'Pulse', route: '/cortex/pulse', tier: 'foundation' },
      { name: 'Alerts', route: '/cortex/pulse/alerts', tier: 'foundation' },
      { name: 'Metrics', route: '/cortex/pulse/metrics', tier: 'foundation' },
    ],
  },
  {
    id: 'bridge',
    label: 'Bridge',
    icon: <FileText className="w-5 h-5" />,
    color: 'text-orange-400',
    pages: [
      { name: 'Bridge', route: '/cortex/bridge', tier: 'foundation' },
      { name: 'Workflows', route: '/cortex/bridge/workflows', tier: 'foundation' },
      { name: 'Approvals', route: '/cortex/bridge/approvals', tier: 'foundation' },
      { name: 'Integrations', route: '/cortex/bridge/integrations', tier: 'foundation' },
    ],
  },
  {
    id: 'pillars',
    label: 'Pillars',
    icon: <Building2 className="w-5 h-5" />,
    color: 'text-indigo-400',
    pages: [
      { name: 'The Helm', route: '/cortex/pillars/helm', tier: 'foundation' },
      { name: 'Lineage', route: '/cortex/pillars/lineage', tier: 'foundation' },
      { name: 'Predict', route: '/cortex/pillars/predict', tier: 'foundation' },
      { name: 'Flow', route: '/cortex/pillars/flow', tier: 'foundation' },
      { name: 'Health', route: '/cortex/pillars/health', tier: 'foundation' },
      { name: 'Guard', route: '/cortex/pillars/guard', tier: 'foundation' },
      { name: 'Ethics', route: '/cortex/pillars/ethics', tier: 'foundation' },
      { name: 'Agents', route: '/cortex/pillars/agents', tier: 'foundation' },
    ],
  },
  {
    id: 'data',
    label: 'Data',
    icon: <Database className="w-5 h-5" />,
    color: 'text-sky-400',
    pages: [
      { name: 'Data Sources', route: '/cortex/data/sources', tier: 'foundation' },
      { name: 'Data Catalog', route: '/cortex/data/catalog', tier: 'foundation' },
      { name: 'Data Quality', route: '/cortex/data/quality', tier: 'foundation' },
      { name: 'Import / Export', route: '/cortex/data/import-export', tier: 'foundation' },
    ],
  },
  {
    id: 'compliance',
    label: 'Compliance',
    icon: <Shield className="w-5 h-5" />,
    color: 'text-violet-400',
    pages: [
      { name: 'Compliance Readiness', route: '/cortex/compliance', tier: 'foundation' },
      { name: 'CendiaCompliance™', route: '/cortex/compliance/continuous-monitor', tier: 'enterprise', gated: true },
      { name: 'CendiaGapScan™', route: '/cortex/compliance/gap-scanner', tier: 'enterprise', gated: true },
      { name: 'CendiaJurisdiction™', route: '/cortex/compliance/cross-jurisdiction', tier: 'enterprise', gated: true },
      { name: 'CendiaSandbox™', route: '/cortex/compliance/regulatory-sandbox', tier: 'enterprise', gated: true },
    ],
  },
  {
    id: 'governance',
    label: 'Governance',
    icon: <Gavel className="w-5 h-5" />,
    color: 'text-cyan-400',
    pages: [
      { name: 'Decision Packets™', route: '/cortex/governance/decision-packets', tier: 'enterprise', gated: true },
      { name: 'CendiaCourt™', route: '/cortex/governance/constitutional-court', tier: 'enterprise', gated: true },
    ],
  },
  {
    id: 'crypto',
    label: 'Crypto',
    icon: <Lock className="w-5 h-5" />,
    color: 'text-amber-400',
    pages: [
      { name: 'CendiaEscrow™', route: '/cortex/crypto/escrow', tier: 'enterprise', gated: true },
    ],
  },
  {
    id: 'security',
    label: 'Security',
    icon: <Shield className="w-5 h-5" />,
    color: 'text-red-400',
    pages: [
      { name: 'Security Overview', route: '/cortex/security', tier: 'foundation' },
      { name: 'Access Control', route: '/cortex/security/access', tier: 'foundation' },
      { name: 'Audit Log', route: '/cortex/security/audit', tier: 'foundation' },
      { name: 'Security Policies', route: '/cortex/security/policies', tier: 'foundation' },
      { name: 'CendiaZKP™', route: '/cortex/security/zkp', tier: 'enterprise', gated: true },
    ],
  },
  {
    id: 'crown',
    label: 'Crown Jewels',
    icon: <Crown className="w-5 h-5" />,
    color: 'text-amber-300',
    pages: [
      { name: 'CendiaEcho™', route: '/cortex/crown/echo', tier: 'enterprise', gated: true },
      { name: 'CendiaRedTeam™', route: '/cortex/crown/redteam', tier: 'enterprise', gated: true },
      { name: 'CendiaGnosis™', route: '/cortex/crown/gnosis', tier: 'enterprise', gated: true },
    ],
  },
  {
    id: 'sovereign',
    label: 'Sovereign',
    icon: <Eye className="w-5 h-5" />,
    color: 'text-purple-400',
    pages: [
      { name: 'Crucible', route: '/cortex/sovereign/crucible', tier: 'enterprise', gated: true },
      { name: 'Panopticon', route: '/cortex/sovereign/panopticon', tier: 'enterprise', gated: true },
      { name: 'Aegis', route: '/cortex/sovereign/aegis', tier: 'enterprise', gated: true },
      { name: 'Eternal', route: '/cortex/sovereign/eternal', tier: 'enterprise', gated: true },
      { name: 'ShadowOps', route: '/cortex/sovereign/shadow-ops', tier: 'enterprise', gated: true },
      { name: 'Succession', route: '/cortex/sovereign/succession', tier: 'enterprise', gated: true },
      { name: 'Sanctuary', route: '/cortex/sovereign/sanctuary', tier: 'enterprise', gated: true },
      { name: 'CendiaNotary™', route: '/cortex/sovereign/notary', tier: 'enterprise', gated: true },
      { name: 'CendiaVault™', route: '/cortex/sovereign/vault', tier: 'enterprise', gated: true },
      { name: 'Symbiont', route: '/cortex/sovereign/symbiont', tier: 'enterprise', gated: true },
      { name: 'Vox', route: '/cortex/sovereign/vox', tier: 'enterprise', gated: true },
      { name: 'Horizon', route: '/cortex/sovereign/horizon', tier: 'enterprise', gated: true },
      { name: 'Defense', route: '/cortex/sovereign/defense', tier: 'enterprise', gated: true },
      { name: 'SGAS', route: '/cortex/sovereign/sgas', tier: 'strategic', gated: true },
      { name: 'SCGE', route: '/cortex/sovereign/scge', tier: 'strategic', gated: true },
      { name: 'COLLAPSE', route: '/cortex/sovereign/collapse', tier: 'strategic', gated: true },
    ],
  },
  {
    id: 'monitor',
    label: 'Monitor',
    icon: <Monitor className="w-5 h-5" />,
    color: 'text-blue-400',
    pages: [
      { name: 'CendiaPulse™ Live', route: '/cortex/monitor/live', tier: 'enterprise', gated: true },
    ],
  },
  {
    id: 'settings',
    label: 'Settings',
    icon: <Settings className="w-5 h-5" />,
    color: 'text-neutral-400',
    pages: [
      { name: 'Organization', route: '/cortex/settings/organization', tier: 'foundation' },
      { name: 'Users', route: '/cortex/settings/users', tier: 'foundation' },
      { name: 'Teams', route: '/cortex/settings/teams', tier: 'foundation' },
      { name: 'Roles & Permissions', route: '/cortex/settings/roles', tier: 'foundation' },
      { name: 'Billing', route: '/cortex/settings/billing', tier: 'foundation' },
      { name: 'API Keys', route: '/cortex/settings/api-keys', tier: 'foundation' },
      { name: 'Integrations', route: '/cortex/settings/integrations', tier: 'foundation' },
      { name: 'Preferences', route: '/cortex/settings/preferences', tier: 'foundation' },
      { name: 'Security', route: '/cortex/settings/security', tier: 'foundation' },
    ],
  },
  {
    id: 'other-cortex',
    label: 'Other Cortex',
    icon: <Compass className="w-5 h-5" />,
    color: 'text-neutral-400',
    pages: [
      { name: 'Walkthroughs', route: '/cortex/walkthroughs', tier: 'foundation' },
      { name: 'Workflow Builder', route: '/cortex/workflows/builder', tier: 'foundation' },
      { name: 'Showcase', route: '/cortex/showcase', tier: 'foundation' },
      { name: 'Demo Studio', route: '/cortex/demo', tier: 'foundation' },
      { name: 'Legal Demo', route: '/cortex/demo/legal', tier: 'foundation' },
      { name: 'Vertical Config', route: '/cortex/admin/vertical-config', tier: 'foundation' },
      { name: 'Profile', route: '/cortex/profile', tier: 'foundation' },
      { name: 'Getting Started', route: '/cortex/help', tier: 'foundation' },
      { name: 'Upgrade', route: '/cortex/upgrade', tier: 'foundation' },
    ],
  },
  {
    id: 'admin',
    label: 'Admin',
    icon: <Server className="w-5 h-5" />,
    color: 'text-amber-500',
    pages: [
      { name: 'Admin Dashboard', route: '/admin', tier: 'foundation' },
      { name: 'Tenants', route: '/admin/tenants', tier: 'foundation' },
      { name: 'Licenses', route: '/admin/licenses', tier: 'foundation' },
      { name: 'Usage Analytics', route: '/admin/usage', tier: 'foundation' },
      { name: 'System Health', route: '/admin/health', tier: 'foundation' },
      { name: 'Feature Flags', route: '/admin/features', tier: 'foundation' },
      { name: 'Data Sources', route: '/admin/data-sources', tier: 'foundation' },
      { name: 'Mode Analytics', route: '/admin/mode-analytics', tier: 'foundation' },
      { name: 'R&D Lab', route: '/admin/rd-lab', tier: 'foundation' },
      { name: 'Datacendia Core', route: '/admin/core', tier: 'foundation' },
      { name: 'Control Center', route: '/admin/control-center', tier: 'foundation' },
      { name: 'CendiaAdmin™ AI', route: '/admin/ai', tier: 'foundation' },
      { name: 'Sovereign Stack', route: '/admin/sovereign-stack', tier: 'foundation' },
      { name: 'Marketing CMS', route: '/admin/marketing', tier: 'foundation' },
      { name: 'Env Config', route: '/admin/env-config', tier: 'foundation' },
      { name: 'Marketing Studio', route: '/admin/marketing-studio', tier: 'foundation' },
    ],
  },
  {
    id: 'tools',
    label: 'Tools',
    icon: <BarChart3 className="w-5 h-5" />,
    color: 'text-emerald-400',
    pages: [
      { name: 'ROI Calculator', route: '/tools/roi-calculator', tier: 'foundation' },
    ],
  },
  {
    id: 'verticals',
    label: 'Verticals',
    icon: <Globe className="w-5 h-5" />,
    color: 'text-purple-400',
    pages: [
      { name: 'Verticals Hub', route: '/verticals', tier: 'foundation', description: 'Industry overview (teaser)' },
      { name: 'Healthcare', route: '/verticals/healthcare', tier: 'strategic', gated: true },
      { name: 'Financial Services', route: '/verticals/financial-services', tier: 'strategic', gated: true },
      { name: 'Government & Legal', route: '/verticals/government-legal', tier: 'strategic', gated: true },
      { name: 'Legal / Law Firms', route: '/verticals/legal', tier: 'strategic', gated: true },
      { name: 'Insurance', route: '/verticals/insurance', tier: 'strategic', gated: true },
      { name: 'Pharmaceutical', route: '/verticals/pharmaceutical', tier: 'strategic', gated: true },
      { name: 'Manufacturing', route: '/verticals/manufacturing', tier: 'strategic', gated: true },
      { name: 'Energy & Utilities', route: '/verticals/energy-utilities', tier: 'strategic', gated: true },
      { name: 'Technology / SaaS', route: '/verticals/technology', tier: 'strategic', gated: true },
      { name: 'Retail & Hospitality', route: '/verticals/retail-hospitality', tier: 'strategic', gated: true },
      { name: 'Real Estate', route: '/verticals/real-estate', tier: 'strategic', gated: true },
      { name: 'Transportation', route: '/verticals/transportation', tier: 'strategic', gated: true },
      { name: 'Media / Entertainment', route: '/verticals/media-entertainment', tier: 'strategic', gated: true },
      { name: 'Professional Services', route: '/verticals/professional-services', tier: 'strategic', gated: true },
      { name: 'Higher Education', route: '/verticals/higher-education', tier: 'strategic', gated: true },
      { name: 'Sports / Athletics', route: '/verticals/sports', tier: 'strategic', gated: true },
      { name: 'Telecommunications', route: '/verticals/telecommunications', tier: 'strategic', gated: true },
      { name: 'Aerospace / Defense', route: '/verticals/aerospace', tier: 'strategic', gated: true },
      { name: 'Agriculture / AgTech', route: '/verticals/agriculture', tier: 'strategic', gated: true },
      { name: 'Automotive', route: '/verticals/automotive', tier: 'strategic', gated: true },
      { name: 'Construction', route: '/verticals/construction', tier: 'strategic', gated: true },
      { name: 'Hospitality / Travel', route: '/verticals/hospitality', tier: 'strategic', gated: true },
      { name: 'Non-Profit / NGO', route: '/verticals/nonprofit', tier: 'strategic', gated: true },
      { name: 'Industrial Services', route: '/verticals/industrial-services', tier: 'strategic', gated: true },
      { name: 'CendiaCity™ (Smart City)', route: '/verticals/smart-city', tier: 'strategic', gated: true },
      { name: 'EU Banking', route: '/verticals/eu-banking', tier: 'strategic', gated: true },
    ],
  },
];

// ─── TierBadge ──────────────────────────────────────────────────────────────
const TierBadge: React.FC<{ tier: Tier; gated?: boolean }> = ({ tier, gated }) => {
  const cfg = TIER_CONFIG[tier];
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium ${cfg.color} ${cfg.bg} border ${cfg.border}`}>
      {cfg.icon}
      {cfg.label}
      {gated && <Lock className="w-2.5 h-2.5 ml-0.5 opacity-60" />}
    </span>
  );
};

// ─── Main Component ─────────────────────────────────────────────────────────
const PlatformMapPage: React.FC = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [tierFilter, setTierFilter] = useState<Tier | 'all'>('all');
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set(CATEGORIES.map(c => c.id)));
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');

  const toggleCategory = (id: string) => {
    setExpandedCategories(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const expandAll = () => setExpandedCategories(new Set(CATEGORIES.map(c => c.id)));
  const collapseAll = () => setExpandedCategories(new Set());

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return CATEGORIES.map(cat => ({
      ...cat,
      pages: cat.pages.filter(p => {
        const matchSearch = !q || p.name.toLowerCase().includes(q) || p.route.toLowerCase().includes(q) || (p.description || '').toLowerCase().includes(q);
        const matchTier = tierFilter === 'all' || p.tier === tierFilter;
        return matchSearch && matchTier;
      }),
    })).filter(cat => cat.pages.length > 0);
  }, [search, tierFilter]);

  const totalPages = filtered.reduce((sum, c) => sum + c.pages.length, 0);
  const totalAll = CATEGORIES.reduce((sum, c) => sum + c.pages.length, 0);
  const foundationCount = CATEGORIES.reduce((sum, c) => sum + c.pages.filter(p => p.tier === 'foundation').length, 0);
  const enterpriseCount = CATEGORIES.reduce((sum, c) => sum + c.pages.filter(p => p.tier === 'enterprise').length, 0);
  const strategicCount = CATEGORIES.reduce((sum, c) => sum + c.pages.filter(p => p.tier === 'strategic').length, 0);

  return (
    <div className="p-4 lg:p-6 max-w-[1400px] mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-blue-500/30 flex items-center justify-center">
            <Map className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <h1 className="text-2xl" style={{ fontFamily: 'Arial, Helvetica, sans-serif', fontWeight: 300, letterSpacing: '0.35em', color: '#e8e4e0' }}>
              PLATFORM MAP
            </h1>
            <p className="text-[11px] uppercase tracking-[0.25em] text-white/60 font-light">
              Every page across the entire platform
            </p>
          </div>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-4 gap-3">
        <button
          onClick={() => setTierFilter('all')}
          className={`p-3 rounded-xl border transition-colors text-left ${tierFilter === 'all' ? 'border-blue-500/50 bg-blue-500/10' : 'border-neutral-700/50 bg-neutral-800/50 hover:border-neutral-600'}`}
        >
          <div className="text-2xl font-bold text-white">{totalAll}</div>
          <div className="text-[10px] uppercase tracking-wider text-neutral-400">Total Pages</div>
        </button>
        <button
          onClick={() => setTierFilter(tierFilter === 'foundation' ? 'all' : 'foundation')}
          className={`p-3 rounded-xl border transition-colors text-left ${tierFilter === 'foundation' ? 'border-emerald-500/50 bg-emerald-500/10' : 'border-neutral-700/50 bg-neutral-800/50 hover:border-neutral-600'}`}
        >
          <div className="text-2xl font-bold text-emerald-400">{foundationCount}</div>
          <div className="text-[10px] uppercase tracking-wider text-neutral-400">Foundation</div>
        </button>
        <button
          onClick={() => setTierFilter(tierFilter === 'enterprise' ? 'all' : 'enterprise')}
          className={`p-3 rounded-xl border transition-colors text-left ${tierFilter === 'enterprise' ? 'border-amber-500/50 bg-amber-500/10' : 'border-neutral-700/50 bg-neutral-800/50 hover:border-neutral-600'}`}
        >
          <div className="text-2xl font-bold text-amber-400">{enterpriseCount}</div>
          <div className="text-[10px] uppercase tracking-wider text-neutral-400">Enterprise</div>
        </button>
        <button
          onClick={() => setTierFilter(tierFilter === 'strategic' ? 'all' : 'strategic')}
          className={`p-3 rounded-xl border transition-colors text-left ${tierFilter === 'strategic' ? 'border-purple-500/50 bg-purple-500/10' : 'border-neutral-700/50 bg-neutral-800/50 hover:border-neutral-600'}`}
        >
          <div className="text-2xl font-bold text-purple-400">{strategicCount}</div>
          <div className="text-[10px] uppercase tracking-wider text-neutral-400">Strategic</div>
        </button>
      </div>

      {/* Search + Controls */}
      <div className="flex items-center gap-3">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
          <input
            type="text"
            placeholder="Search pages, routes, or features..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-neutral-800/50 border border-neutral-700/50 rounded-xl text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-blue-500/50"
          />
          {search && (
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-neutral-500">
              {totalPages} result{totalPages !== 1 ? 's' : ''}
            </span>
          )}
        </div>
        <button onClick={expandAll} className="px-3 py-2.5 text-xs text-neutral-400 hover:text-white bg-neutral-800/50 border border-neutral-700/50 rounded-xl transition-colors">
          Expand All
        </button>
        <button onClick={collapseAll} className="px-3 py-2.5 text-xs text-neutral-400 hover:text-white bg-neutral-800/50 border border-neutral-700/50 rounded-xl transition-colors">
          Collapse
        </button>
      </div>

      {/* Categories */}
      <div className="space-y-2">
        {filtered.map(cat => {
          const isExpanded = expandedCategories.has(cat.id);
          return (
            <div key={cat.id} className="rounded-xl border border-neutral-700/50 bg-neutral-900/50 overflow-hidden">
              {/* Category Header */}
              <button
                onClick={() => toggleCategory(cat.id)}
                className="w-full flex items-center justify-between px-4 py-3 hover:bg-neutral-800/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className={cat.color}>{cat.icon}</span>
                  <span className="text-sm font-medium text-white">{cat.label}</span>
                  <span className="text-xs text-neutral-500 bg-neutral-800 px-2 py-0.5 rounded-full">
                    {cat.pages.length}
                  </span>
                </div>
                {isExpanded ? <ChevronDown className="w-4 h-4 text-neutral-500" /> : <ChevronRight className="w-4 h-4 text-neutral-500" />}
              </button>

              {/* Pages */}
              {isExpanded && (
                <div className="border-t border-neutral-800">
                  {cat.pages.map((page, i) => (
                    <div
                      key={page.route}
                      className={`flex items-center justify-between px-4 py-2.5 hover:bg-neutral-800/30 transition-colors cursor-pointer group ${i > 0 ? 'border-t border-neutral-800/50' : ''}`}
                      onClick={() => {
                        if (!page.route.includes(':')) navigate(page.route);
                      }}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <span className="text-sm text-neutral-200 truncate">{page.name}</span>
                        {page.description && (
                          <span className="text-xs text-neutral-500 hidden lg:inline truncate">— {page.description}</span>
                        )}
                      </div>
                      <div className="flex items-center gap-3 shrink-0">
                        <code className="text-[11px] text-neutral-500 font-mono hidden md:block">{page.route}</code>
                        <TierBadge tier={page.tier} gated={page.gated} />
                        {!page.route.includes(':') && (
                          <ExternalLink className="w-3.5 h-3.5 text-neutral-600 group-hover:text-neutral-400 transition-colors" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Source Stats */}
      <div className="rounded-xl border border-neutral-700/50 bg-neutral-900/50 p-4">
        <h3 className="text-xs uppercase tracking-wider text-neutral-500 mb-3">Source Files</h3>
        <div className="grid grid-cols-3 md:grid-cols-6 gap-3 text-center">
          {[
            { label: 'Pages', count: 176, color: 'text-blue-400' },
            { label: 'Components', count: 92, color: 'text-purple-400' },
            { label: 'Layouts', count: 3, color: 'text-emerald-400' },
            { label: 'Contexts', count: 8, color: 'text-amber-400' },
            { label: 'Routes', count: 10, color: 'text-cyan-400' },
            { label: 'Total .tsx', count: 292, color: 'text-white' },
          ].map(s => (
            <div key={s.label}>
              <div className={`text-lg font-bold ${s.color}`}>{s.count}</div>
              <div className="text-[10px] uppercase tracking-wider text-neutral-500">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PlatformMapPage;
