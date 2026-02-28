// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

/**
 * Breadcrumbs - Navigation trail for deep links
 * Shows the path hierarchy and allows quick navigation back
 */

import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

// Route label mappings for human-readable breadcrumbs
const ROUTE_LABELS: Record<string, string> = {
  // Core
  cortex: 'Mission Control',
  dashboard: 'Dashboard',
  // Foundation Tier
  council: 'The Council',
  deliberation: 'Deliberation',
  agent: 'Agent Profile',
  intelligence: 'DECIDE',
  chronos: 'CendiaChronos™',
  'pre-mortem': 'CendiaPreMortem™',
  'ghost-board': 'Ghost Board™',
  'decision-debt': 'Decision Debt™',
  'decision-dna': 'Decision DNA',
  dcii: 'DCII',
  // Enterprise Tier
  enterprise: 'Enterprise',
  compliance: 'Comply',
  governance: 'Govern',
  'continuous-monitor': 'Continuous Monitor',
  'decision-packets': 'Decision Packets',
  'adversarial-redteam': 'Stress-Test',
  sovereign: 'Sovereign',
  monitor: 'Operate',
  live: 'Live Monitor',
  // Strategic Tier
  collapse: 'COLLAPSE',
  sgas: 'SGAS',
  sanctuary: 'Frontier',
  // Services
  graph: 'Knowledge Graph',
  pulse: 'Pulse',
  alerts: 'Alerts',
  metrics: 'Metrics',
  lens: 'Lens',
  forecast: 'Forecast',
  scenarios: 'Scenarios',
  bridge: 'Bridge',
  workflows: 'Workflows',
  approvals: 'Approvals',
  integrations: 'Integrations',
  walkthroughs: 'Walkthroughs',
  crucible: 'CendiaCrucible™',
  panopticon: 'Oversight',
  aegis: 'CendiaAegis™',
  eternal: 'CendiaEternal™',
  symbiont: 'CendiaSymbiont™',
  vox: 'CendiaVox™',
  horizon: 'CendiaHorizon™',
  // System
  pillars: '8 Pillars',
  helm: 'Helm',
  lineage: 'Lineage',
  predict: 'Predict',
  flow: 'Flow',
  health: 'Health',
  guard: 'Guard',
  ethics: 'Ethics',
  agents: 'Agents',
  data: 'Data',
  sources: 'Sources',
  catalog: 'Catalog',
  quality: 'Quality',
  security: 'Security',
  settings: 'Settings',
  crown: 'Crown Jewels',
  echo: 'CendiaEcho™',
  redteam: 'CendiaRedTeam™',
  gnosis: 'Gnosis',
  verticals: 'Industry Verticals',
  admin: 'Administration',
  'vertical-config': 'Vertical Config',
};

// Tier context — inject tier label into breadcrumb trail
const TIER_CONTEXT: Record<string, string> = {
  council: 'Foundation',
  intelligence: 'Foundation',
  dcii: 'Foundation',
  enterprise: 'Enterprise',
  compliance: 'Enterprise',
  governance: 'Enterprise',
  monitor: 'Enterprise',
  sovereign: 'Strategic',
  collapse: 'Strategic',
  sgas: 'Strategic',
  sanctuary: 'Strategic',
};

interface BreadcrumbsProps {
  className?: string;
  maxItems?: number;
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ 
  className = '', 
  maxItems = 5 
}) => {
  const location = useLocation();
  const pathSegments = location.pathname.split('/').filter(Boolean);

  // Don't show breadcrumbs for root or single-level paths
  if (pathSegments.length <= 1) {
    return null;
  }

  // Build breadcrumb items
  const items = pathSegments.map((segment, index) => {
    const path = '/' + pathSegments.slice(0, index + 1).join('/');
    const label = ROUTE_LABELS[segment] || segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' ');
    const isLast = index === pathSegments.length - 1;
    
    // Skip UUID-like segments but keep a generic label
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(segment);
    const displayLabel = isUuid ? 'Details' : label;

    return { path, label: displayLabel, isLast };
  });

  // Truncate if too many items
  const displayItems = items.length > maxItems 
    ? [items[0], { path: '', label: '...', isLast: false }, ...items.slice(-2)]
    : items;

  return (
    <nav className={`flex items-center text-sm ${className}`} aria-label="Breadcrumb">
      <Link 
        to="/cortex/dashboard" 
        className="text-slate-400 hover:text-white transition-colors"
        title="Home"
      >
        <Home className="w-4 h-4" />
      </Link>
      
      {displayItems.map((item, index) => (
        <React.Fragment key={index}>
          <ChevronRight className="w-4 h-4 mx-2 text-slate-600" />
          {item.isLast || item.label === '...' ? (
            <span className={item.isLast ? 'text-white font-medium' : 'text-slate-500'}>
              {item.label}
            </span>
          ) : (
            <Link 
              to={item.path}
              className="text-slate-400 hover:text-white transition-colors"
            >
              {item.label}
            </Link>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
};

// Compact version for tight spaces
export const BreadcrumbsCompact: React.FC<{ className?: string }> = ({ className = '' }) => {
  const location = useLocation();
  const pathSegments = location.pathname.split('/').filter(Boolean);
  
  if (pathSegments.length <= 2) {return null;}

  const parentPath = '/' + pathSegments.slice(0, -1).join('/');
  const parentLabel = ROUTE_LABELS[pathSegments[pathSegments.length - 2]] || 
    pathSegments[pathSegments.length - 2].charAt(0).toUpperCase() + 
    pathSegments[pathSegments.length - 2].slice(1);

  return (
    <Link 
      to={parentPath}
      className={`inline-flex items-center gap-1 text-sm text-slate-400 hover:text-white transition-colors ${className}`}
    >
      <ChevronRight className="w-4 h-4 rotate-180" />
      Back to {parentLabel}
    </Link>
  );
};

export default Breadcrumbs;
