// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

// =============================================================================
// CENDIA VERTICAL CONFIGURATION PAGE
// Industry vertical management with toggleable service access
// Enterprise Platinum Standard - 100% Client Ready
// =============================================================================

import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Settings,
  Check,
  ChevronDown,
  ChevronRight,
  Shield,
  Zap,
  Lock,
  AlertTriangle,
  RefreshCw,
  Search,
  Filter,
  Info,
  Building2,
  Loader2,
  Save,
  RotateCcw,
  LayoutDashboard,
  ArrowRight,
} from 'lucide-react';
import { cn } from '../../../lib/utils';
import { verticalConfigApi } from '../../../services/VerticalConfigService';

// =============================================================================
// TYPES
// =============================================================================

interface ServiceDefinition {
  id: string;
  name: string;
  description: string;
  category: 'core' | 'intelligence' | 'governance' | 'security' | 'sovereign' | 'analytics';
  icon: string;
  tier: 'foundation' | 'enterprise' | 'strategic';
  isCore: boolean;
}

interface VerticalTemplate {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  defaultServices: string[];
  recommendedServices: string[];
  excludedServices: string[];
}

// =============================================================================
// SAMPLE DATA
// =============================================================================

const SERVICE_CATALOG: ServiceDefinition[] = [
  // Core Services
  { id: 'council', name: 'CendiaCouncil™', description: 'AI-powered multi-agent deliberation engine', category: 'core', icon: '🏛️', tier: 'foundation', isCore: true },
  { id: 'ledger', name: 'CendiaLedger™', description: 'Immutable decision blockchain for audit trails', category: 'governance', icon: '📒', tier: 'foundation', isCore: true },
  { id: 'evidence-vault', name: 'Evidence Vault', description: 'Global decision packet management', category: 'governance', icon: '🗄️', tier: 'foundation', isCore: true },
  
  // Intelligence Services
  { id: 'chronos', name: 'CendiaChronos™', description: 'Decision timeline & pivotal moment detection', category: 'intelligence', icon: '⏳', tier: 'foundation', isCore: false },
  { id: 'decision-dna', name: 'DecisionDNA', description: 'Full decision lifecycle visualization', category: 'intelligence', icon: '🧬', tier: 'foundation', isCore: false },
  { id: 'ghost-board', name: 'Ghost Board', description: 'What-if scenario simulation', category: 'intelligence', icon: '👻', tier: 'foundation', isCore: false },
  { id: 'pre-mortem', name: 'Pre-Mortem', description: 'Proactive risk analysis', category: 'intelligence', icon: '🔮', tier: 'foundation', isCore: false },
  { id: 'cascade', name: 'CendiaCascade™', description: 'Decision consequence engineering', category: 'intelligence', icon: '🌊', tier: 'enterprise', isCore: false },
  { id: 'horizon', name: 'CendiaHorizon™', description: 'Strategic forecasting & prediction', category: 'intelligence', icon: '🌅', tier: 'enterprise', isCore: false },
  { id: 'genomics', name: 'CendiaGenomics™', description: 'Decision pattern DNA analysis', category: 'intelligence', icon: '🧬', tier: 'enterprise', isCore: false },
  
  // Governance Services
  { id: 'govern', name: 'CendiaGovern™', description: 'Policy-as-code enforcement', category: 'governance', icon: '⚖️', tier: 'foundation', isCore: false },
  { id: 'veto', name: 'CendiaVeto™', description: 'Human override capability', category: 'governance', icon: '🛑', tier: 'enterprise', isCore: false },
  { id: 'dissent', name: 'CendiaDissent™', description: 'Protected whistleblower channels', category: 'governance', icon: '✊', tier: 'enterprise', isCore: false },
  { id: 'regulatory-absorb', name: 'Regulatory Absorb', description: 'Compliance document ingestion', category: 'governance', icon: '📜', tier: 'foundation', isCore: false },
  { id: 'audit-workflow', name: 'Audit Workflow', description: 'Compliance audit management', category: 'governance', icon: '📋', tier: 'foundation', isCore: false },
  
  // Security Services
  { id: 'defense-stack', name: 'CendiaDefenseStack™', description: 'Security posture management', category: 'security', icon: '🛡️', tier: 'enterprise', isCore: false },
  { id: 'red-team', name: 'RedTeam', description: 'Adversarial AI testing', category: 'security', icon: '🎯', tier: 'enterprise', isCore: false },
  { id: 'apotheosis', name: 'CendiaApotheosis™', description: 'Self-improving AI with safety rails', category: 'security', icon: '🦋', tier: 'enterprise', isCore: false },
  { id: 'panopticon', name: 'CendiaPanopticon™', description: 'Real-time observability', category: 'security', icon: '👁️', tier: 'enterprise', isCore: false },
  { id: 'crisis-management', name: 'Crisis Management', description: 'Incident response coordination', category: 'security', icon: '🚨', tier: 'enterprise', isCore: false },
  
  // Analytics Services
  { id: 'echo', name: 'CendiaEcho™', description: 'Decision outcome tracking', category: 'analytics', icon: '📡', tier: 'foundation', isCore: false },
  { id: 'gnosis', name: 'CendiaGnosis™', description: 'Knowledge graph exploration', category: 'analytics', icon: '🔍', tier: 'foundation', isCore: false },
  { id: 'voice', name: 'CendiaVoice™', description: 'Executive presentation layer', category: 'analytics', icon: '🎙️', tier: 'enterprise', isCore: false },
  { id: 'persona-forge', name: 'CendiaPersonaForge™', description: 'Stakeholder simulation', category: 'analytics', icon: '🎭', tier: 'enterprise', isCore: false },
  { id: 'omni-translate', name: 'CendiaOmniTranslate™', description: '100+ language translation', category: 'analytics', icon: '🌐', tier: 'enterprise', isCore: false },
  
  // Sovereign Services
  { id: 'sovereign', name: 'CendiaSovereign™', description: 'On-premise air-gapped deployment', category: 'sovereign', icon: '🏰', tier: 'strategic', isCore: false },
  { id: 'mesh', name: 'CendiaMesh™', description: 'Secure multi-site collaboration', category: 'sovereign', icon: '🕸️', tier: 'enterprise', isCore: false },
  { id: 'data-diode', name: 'Data Diode', description: 'Unidirectional secure data ingest', category: 'sovereign', icon: '➡️', tier: 'strategic', isCore: false },
  { id: 'local-rlhf', name: 'Local RLHF', description: 'Zero-cloud AI improvement', category: 'sovereign', icon: '🔄', tier: 'strategic', isCore: false },
  { id: 'tpm-attestation', name: 'TPM Attestation', description: 'Hardware-signed decisions', category: 'sovereign', icon: '🔐', tier: 'strategic', isCore: false },
  { id: 'time-lock', name: 'Time-Lock', description: 'Cryptographic decision embargo', category: 'sovereign', icon: '⏰', tier: 'strategic', isCore: false },
  { id: 'federated-mesh', name: 'Federated Mesh', description: 'Multi-org learning without data sharing', category: 'sovereign', icon: '🌐', tier: 'strategic', isCore: false },
  { id: 'canary-tripwire', name: 'Canary Tripwire', description: 'Exfiltration detection', category: 'sovereign', icon: '🐤', tier: 'strategic', isCore: false },
  { id: 'portable-instance', name: 'Portable Instance', description: 'USB-bootable deployment', category: 'sovereign', icon: '💾', tier: 'strategic', isCore: false },
  
  // Additional Services
  { id: 'autopilot', name: 'CendiaAutopilot™', description: 'Automated decision execution', category: 'intelligence', icon: '✈️', tier: 'enterprise', isCore: false },
  { id: 'union', name: 'CendiaUnion™', description: 'Multi-agent defensive synthesis', category: 'intelligence', icon: '🤝', tier: 'enterprise', isCore: false },
  { id: 'training', name: 'Training Center', description: 'User onboarding & certification', category: 'core', icon: '🎓', tier: 'foundation', isCore: false },
];

const VERTICAL_TEMPLATES: VerticalTemplate[] = [
  // Core Verticals
  { id: 'financial-services', name: 'Financial Services', description: 'Banks, Asset Managers, Insurance', icon: '🏦', color: '#10B981', defaultServices: ['council', 'ledger', 'evidence-vault', 'govern', 'chronos', 'decision-dna', 'regulatory-absorb', 'audit-workflow', 'cascade', 'dissent', 'omni-translate'], recommendedServices: ['red-team', 'ghost-board', 'pre-mortem', 'echo', 'crisis-management'], excludedServices: ['data-diode', 'qr-air-gap', 'portable-instance'] },
  { id: 'healthcare', name: 'Healthcare / Life Sciences', description: 'Hospitals, Pharma, Biotech', icon: '🏥', color: '#EC4899', defaultServices: ['council', 'ledger', 'evidence-vault', 'veto', 'dissent', 'regulatory-absorb', 'ghost-board', 'pre-mortem', 'mesh', 'omni-translate', 'apotheosis'], recommendedServices: ['chronos', 'decision-dna', 'crisis-management', 'audit-workflow'], excludedServices: [] },
  { id: 'manufacturing', name: 'Manufacturing / Supply Chain', description: 'Automotive, Aerospace, CPG', icon: '🏭', color: '#F59E0B', defaultServices: ['council', 'ledger', 'evidence-vault', 'cascade', 'chronos', 'horizon', 'pre-mortem', 'mesh', 'data-diode', 'ghost-board', 'genomics', 'crisis-management'], recommendedServices: ['govern', 'audit-workflow', 'echo'], excludedServices: [] },
  { id: 'technology', name: 'Technology / SaaS', description: 'Software Companies, Cloud Providers', icon: '💻', color: '#8B5CF6', defaultServices: ['council', 'ledger', 'evidence-vault', 'apotheosis', 'red-team', 'chronos', 'ghost-board', 'defense-stack', 'panopticon', 'autopilot', 'crisis-management'], recommendedServices: ['cascade', 'genomics', 'echo', 'gnosis'], excludedServices: [] },
  { id: 'energy', name: 'Energy / Utilities', description: 'Oil & Gas, Power, Renewables', icon: '⚡', color: '#EF4444', defaultServices: ['council', 'ledger', 'evidence-vault', 'cascade', 'horizon', 'pre-mortem', 'data-diode', 'tpm-attestation', 'crisis-management', 'mesh'], recommendedServices: ['govern', 'audit-workflow', 'chronos'], excludedServices: [] },
  { id: 'government', name: 'Government / Public Sector', description: 'Federal, State, Defense', icon: '🏛️', color: '#3B82F6', defaultServices: ['council', 'ledger', 'evidence-vault', 'sovereign', 'veto', 'dissent', 'portable-instance', 'federated-mesh', 'local-rlhf', 'time-lock', 'canary-tripwire', 'tpm-attestation'], recommendedServices: ['data-diode', 'govern', 'audit-workflow'], excludedServices: [] },
  { id: 'legal', name: 'Legal / Professional Services', description: 'Law Firms, Consulting', icon: '⚖️', color: '#6366F1', defaultServices: ['council', 'ledger', 'evidence-vault', 'regulatory-absorb', 'omni-translate', 'voice', 'ghost-board', 'pre-mortem', 'persona-forge', 'decision-dna'], recommendedServices: ['chronos', 'govern', 'dissent'], excludedServices: [] },
  // High-Value Additions
  { id: 'retail', name: 'Retail / E-Commerce', description: 'Retailers, D2C Brands, Marketplaces', icon: '🛒', color: '#F97316', defaultServices: ['council', 'ledger', 'evidence-vault', 'horizon', 'cascade', 'ghost-board', 'crisis-management', 'chronos', 'echo', 'persona-forge'], recommendedServices: ['omni-translate', 'autopilot', 'gnosis'], excludedServices: [] },
  { id: 'real-estate', name: 'Real Estate / PropTech', description: 'REITs, Property Management, Development', icon: '🏠', color: '#84CC16', defaultServices: ['council', 'ledger', 'evidence-vault', 'cascade', 'horizon', 'ghost-board', 'decision-dna', 'chronos', 'govern'], recommendedServices: ['pre-mortem', 'echo', 'audit-workflow'], excludedServices: [] },
  { id: 'telecommunications', name: 'Telecommunications', description: 'Carriers, ISPs, Network Operators', icon: '📡', color: '#06B6D4', defaultServices: ['council', 'ledger', 'evidence-vault', 'panopticon', 'cascade', 'mesh', 'crisis-management', 'horizon', 'defense-stack', 'chronos'], recommendedServices: ['data-diode', 'autopilot', 'echo'], excludedServices: [] },
  { id: 'hospitality', name: 'Hospitality / Travel', description: 'Hotels, Airlines, OTAs, Cruise Lines', icon: '✈️', color: '#0EA5E9', defaultServices: ['council', 'ledger', 'evidence-vault', 'horizon', 'cascade', 'omni-translate', 'persona-forge', 'crisis-management', 'ghost-board', 'chronos'], recommendedServices: ['echo', 'voice', 'autopilot'], excludedServices: [] },
  { id: 'education', name: 'Education / EdTech', description: 'Universities, K-12, LMS Providers', icon: '📚', color: '#A855F7', defaultServices: ['council', 'ledger', 'evidence-vault', 'training', 'veto', 'dissent', 'govern', 'decision-dna', 'chronos', 'gnosis'], recommendedServices: ['regulatory-absorb', 'omni-translate', 'echo'], excludedServices: [] },
  { id: 'media', name: 'Media / Entertainment', description: 'Studios, Streaming, Gaming, Publishing', icon: '🎬', color: '#EC4899', defaultServices: ['council', 'ledger', 'evidence-vault', 'persona-forge', 'cascade', 'chronos', 'ghost-board', 'horizon', 'voice', 'echo'], recommendedServices: ['omni-translate', 'gnosis', 'crisis-management'], excludedServices: [] },
  { id: 'agriculture', name: 'Agriculture / AgTech', description: 'Farms, Food Supply Chain, AgTech', icon: '🌾', color: '#22C55E', defaultServices: ['council', 'ledger', 'evidence-vault', 'horizon', 'data-diode', 'cascade', 'mesh', 'crisis-management', 'chronos', 'pre-mortem'], recommendedServices: ['govern', 'echo', 'panopticon'], excludedServices: [] },
  { id: 'logistics', name: 'Logistics / Transportation', description: 'Freight, 3PL, Shipping, Fleet', icon: '🚚', color: '#F59E0B', defaultServices: ['council', 'ledger', 'evidence-vault', 'cascade', 'horizon', 'data-diode', 'crisis-management', 'mesh', 'chronos', 'panopticon'], recommendedServices: ['autopilot', 'echo', 'govern'], excludedServices: [] },
  { id: 'insurance', name: 'Insurance (Specialized)', description: 'P&C, Reinsurance, InsurTech', icon: '🛡️', color: '#14B8A6', defaultServices: ['council', 'ledger', 'evidence-vault', 'cascade', 'horizon', 'regulatory-absorb', 'audit-workflow', 'ghost-board', 'pre-mortem', 'decision-dna'], recommendedServices: ['echo', 'chronos', 'persona-forge'], excludedServices: [] },
  { id: 'nonprofit', name: 'Non-Profit / NGO', description: 'Foundations, Aid Organizations, Charities', icon: '🤝', color: '#F472B6', defaultServices: ['council', 'ledger', 'evidence-vault', 'veto', 'dissent', 'govern', 'decision-dna', 'chronos', 'omni-translate', 'audit-workflow'], recommendedServices: ['echo', 'pre-mortem', 'voice'], excludedServices: [] },
  // Specialized / Niche
  { id: 'construction', name: 'Construction / Engineering', description: 'Contractors, AEC, Infrastructure', icon: '🏗️', color: '#78716C', defaultServices: ['council', 'ledger', 'evidence-vault', 'cascade', 'pre-mortem', 'data-diode', 'crisis-management', 'mesh', 'chronos', 'horizon'], recommendedServices: ['govern', 'audit-workflow', 'echo'], excludedServices: [] },
  { id: 'mining', name: 'Mining / Resources', description: 'Mining, Forestry, Natural Resources', icon: '⛏️', color: '#A16207', defaultServices: ['council', 'ledger', 'evidence-vault', 'sovereign', 'data-diode', 'tpm-attestation', 'crisis-management', 'cascade', 'mesh', 'qr-air-gap'], recommendedServices: ['horizon', 'pre-mortem', 'portable-instance'], excludedServices: [] },
  { id: 'aerospace', name: 'Aerospace / Defense', description: 'Defense Contractors, Space, Aviation', icon: '🚀', color: '#1E3A8A', defaultServices: ['council', 'ledger', 'evidence-vault', 'sovereign', 'time-lock', 'tpm-attestation', 'federated-mesh', 'canary-tripwire', 'portable-instance', 'local-rlhf', 'veto', 'dissent'], recommendedServices: ['data-diode', 'qr-air-gap', 'crisis-management'], excludedServices: [] },
  { id: 'pharmaceuticals', name: 'Pharmaceuticals (Specialized)', description: 'Clinical Trials, Drug Development, R&D', icon: '💊', color: '#059669', defaultServices: ['council', 'ledger', 'evidence-vault', 'regulatory-absorb', 'chronos', 'veto', 'dissent', 'audit-workflow', 'decision-dna', 'pre-mortem', 'ghost-board'], recommendedServices: ['mesh', 'omni-translate', 'echo'], excludedServices: [] },
  { id: 'automotive', name: 'Automotive (Specialized)', description: 'OEMs, Tier 1 Suppliers, EV Manufacturers', icon: '🚗', color: '#DC2626', defaultServices: ['council', 'ledger', 'evidence-vault', 'cascade', 'data-diode', 'mesh', 'crisis-management', 'horizon', 'pre-mortem', 'chronos', 'genomics'], recommendedServices: ['govern', 'audit-workflow', 'panopticon'], excludedServices: [] },
  { id: 'sports', name: 'Sports / Entertainment', description: 'Leagues, Teams, Venues, Esports', icon: '🏆', color: '#7C3AED', defaultServices: ['council', 'ledger', 'evidence-vault', 'persona-forge', 'crisis-management', 'cascade', 'ghost-board', 'chronos', 'voice', 'echo'], recommendedServices: ['omni-translate', 'horizon', 'gnosis'], excludedServices: [] },
  // Custom
  { id: 'custom', name: 'Custom Configuration', description: 'Build your own service bundle', icon: '⚙️', color: '#6B7280', defaultServices: ['council', 'ledger', 'evidence-vault'], recommendedServices: [], excludedServices: [] },
];

const CATEGORIES = [
  { id: 'all', name: 'All Services', icon: '📦' },
  { id: 'core', name: 'Core', icon: '⭐' },
  { id: 'intelligence', name: 'Intelligence', icon: '🧠' },
  { id: 'governance', name: 'Governance', icon: '⚖️' },
  { id: 'security', name: 'Security', icon: '🛡️' },
  { id: 'analytics', name: 'Analytics', icon: '📊' },
  { id: 'sovereign', name: 'Sovereign', icon: '🏰' },
];

const TIERS = [
  { id: 'starter', name: 'Starter', color: 'text-gray-400' },
  { id: 'professional', name: 'Professional', color: 'text-blue-400' },
  { id: 'enterprise', name: 'Enterprise', color: 'text-purple-400' },
  { id: 'sovereign', name: 'Sovereign', color: 'text-amber-400' },
];

// =============================================================================
// TOGGLE COMPONENT
// =============================================================================

interface ToggleSwitchProps {
  enabled: boolean;
  onChange: (enabled: boolean) => void;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({ enabled, onChange, disabled = false, size = 'md' }) => {
  const sizes = {
    sm: { track: 'w-8 h-4', thumb: 'w-3 h-3', translate: 'translate-x-4' },
    md: { track: 'w-11 h-6', thumb: 'w-5 h-5', translate: 'translate-x-5' },
    lg: { track: 'w-14 h-7', thumb: 'w-6 h-6', translate: 'translate-x-7' },
  };
  const s = sizes[size];

  return (
    <button
      onClick={() => !disabled && onChange(!enabled)}
      disabled={disabled}
      className={cn(
        s.track,
        'relative inline-flex items-center rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:ring-offset-2 focus:ring-offset-sovereign-base',
        enabled ? 'bg-cyan-500' : 'bg-sovereign-border',
        disabled && 'opacity-50 cursor-not-allowed'
      )}
    >
      <span
        className={cn(
          s.thumb,
          'inline-block rounded-full bg-white shadow transform transition-transform duration-200',
          enabled ? s.translate : 'translate-x-0.5'
        )}
      />
    </button>
  );
};

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export const VerticalConfigPage: React.FC = () => {
  const navigate = useNavigate();
  
  // State
  const [selectedVertical, setSelectedVertical] = useState<string>('financial-services');
  const [enabledServices, setEnabledServices] = useState<Set<string>>(new Set(['council', 'ledger', 'evidence-vault']));
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set(['core', 'intelligence', 'governance']));
  const [showVerticalSelector, setShowVerticalSelector] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  // Initialize with vertical defaults
  useEffect(() => {
    const vertical = VERTICAL_TEMPLATES.find(v => v.id === selectedVertical);
    if (vertical) {
      const coreServices = SERVICE_CATALOG.filter(s => s.isCore).map(s => s.id);
      setEnabledServices(new Set([...coreServices, ...vertical.defaultServices]));
    }
  }, [selectedVertical]);

  // Toggle service
  const toggleService = useCallback((serviceId: string, enabled: boolean) => {
    const service = SERVICE_CATALOG.find(s => s.id === serviceId);
    if (service?.isCore) {return;} // Can't toggle core services

    setEnabledServices(prev => {
      const next = new Set(prev);
      if (enabled) {
        next.add(serviceId);
      } else {
        next.delete(serviceId);
      }
      return next;
    });
    setHasChanges(true);
  }, []);

  // Toggle category
  const toggleCategory = useCallback((categoryId: string) => {
    setExpandedCategories(prev => {
      const next = new Set(prev);
      if (next.has(categoryId)) {
        next.delete(categoryId);
      } else {
        next.add(categoryId);
      }
      return next;
    });
  }, []);

  // Enable all in category
  const enableAllInCategory = useCallback((categoryId: string) => {
    const services = SERVICE_CATALOG.filter(s => s.category === categoryId && !s.isCore);
    setEnabledServices(prev => {
      const next = new Set(prev);
      services.forEach(s => next.add(s.id));
      return next;
    });
    setHasChanges(true);
  }, []);

  // Disable all in category
  const disableAllInCategory = useCallback((categoryId: string) => {
    const services = SERVICE_CATALOG.filter(s => s.category === categoryId && !s.isCore);
    setEnabledServices(prev => {
      const next = new Set(prev);
      services.forEach(s => next.delete(s.id));
      return next;
    });
    setHasChanges(true);
  }, []);

  // Filter services
  const filteredServices = SERVICE_CATALOG.filter(s => {
    if (selectedCategory !== 'all' && s.category !== selectedCategory) {return false;}
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return s.name.toLowerCase().includes(q) || s.description.toLowerCase().includes(q);
    }
    return true;
  });

  // Group by category
  const servicesByCategory = CATEGORIES.slice(1).map(cat => ({
    ...cat,
    services: filteredServices.filter(s => s.category === cat.id),
  })).filter(cat => cat.services.length > 0);

  // Current vertical
  const currentVertical = VERTICAL_TEMPLATES.find(v => v.id === selectedVertical);

  // Stats
  const enabledCount = enabledServices.size;
  const totalCount = SERVICE_CATALOG.length;
  const coreCount = SERVICE_CATALOG.filter(s => s.isCore).length;

  // Loading state for save operations
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Save handler - calls API to persist configuration
  const handleSave = async () => {
    setIsSaving(true);
    setSaveError(null);
    setSaveSuccess(false);
    
    try {
      // Build toggles array from current state vs defaults
      const toggles = SERVICE_CATALOG
        .filter(s => !s.isCore)
        .map(s => ({
          serviceId: s.id,
          enabled: enabledServices.has(s.id),
        }));

      await verticalConfigApi.bulkToggleServices(toggles);
      
      setHasChanges(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : 'Failed to save configuration');
    } finally {
      setIsSaving(false);
    }
  };

  // Reset handler
  const handleReset = async () => {
    const vertical = VERTICAL_TEMPLATES.find(v => v.id === selectedVertical);
    if (vertical) {
      const coreServices = SERVICE_CATALOG.filter(s => s.isCore).map(s => s.id);
      setEnabledServices(new Set([...coreServices, ...vertical.defaultServices]));
      setHasChanges(false);
      setSaveError(null);
    }
  };

  // Switch vertical handler - calls API
  const handleVerticalSwitch = async (newVerticalId: string) => {
    setIsSaving(true);
    try {
      await verticalConfigApi.switchVertical(newVerticalId, false);
      setSelectedVertical(newVerticalId);
      setShowVerticalSelector(false);
      setHasChanges(false);
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : 'Failed to switch vertical');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-sovereign-base text-white p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-purple-500/20 to-blue-500/20 border border-purple-500/30 flex items-center justify-center">
              <Settings className="w-7 h-7 text-purple-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Vertical Configuration</h1>
              <p className="text-sm text-gray-400">
                Customize your industry vertical and toggle services
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {saveSuccess && (
              <span className="text-sm text-emerald-400 flex items-center gap-1">
                <Check className="w-4 h-4" />
                Configuration saved
              </span>
            )}
            {saveError && (
              <span className="text-sm text-red-400 flex items-center gap-1">
                <AlertTriangle className="w-4 h-4" />
                {saveError}
              </span>
            )}
            {hasChanges && !saveError && !saveSuccess && (
              <span className="text-sm text-amber-400 flex items-center gap-1">
                <AlertTriangle className="w-4 h-4" />
                Unsaved changes
              </span>
            )}
            <button
              onClick={handleReset}
              disabled={isSaving}
              className="px-4 py-2 text-gray-400 hover:text-white transition-colors flex items-center gap-2 disabled:opacity-50"
            >
              <RotateCcw className="w-4 h-4" />
              Reset to Defaults
            </button>
            <button
              onClick={handleSave}
              disabled={!hasChanges || isSaving}
              className="px-4 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-lg font-medium hover:from-cyan-500 hover:to-blue-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isSaving ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              {isSaving ? 'Saving...' : 'Save Configuration'}
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-6">
        {/* Left Sidebar - Vertical Selector & Stats */}
        <div className="space-y-6">
          {/* Vertical Selector */}
          <div className="bg-sovereign-card border border-sovereign-border rounded-xl p-4">
            <h3 className="text-sm font-semibold text-gray-400 mb-3 flex items-center gap-2">
              <Building2 className="w-4 h-4" />
              Industry Vertical
            </h3>
            <button
              onClick={() => setShowVerticalSelector(!showVerticalSelector)}
              className="w-full p-3 bg-sovereign-elevated border border-sovereign-border rounded-lg flex items-center justify-between hover:border-cyan-500/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{currentVertical?.icon}</span>
                <div className="text-left">
                  <div className="font-medium text-white">{currentVertical?.name}</div>
                  <div className="text-xs text-gray-500">{currentVertical?.description}</div>
                </div>
              </div>
              <ChevronDown className={cn('w-5 h-5 text-gray-400 transition-transform', showVerticalSelector && 'rotate-180')} />
            </button>

            {showVerticalSelector && (
              <div className="mt-2 space-y-1 max-h-80 overflow-y-auto">
                {VERTICAL_TEMPLATES.map(vertical => (
                  <button
                    key={vertical.id}
                    onClick={() => handleVerticalSwitch(vertical.id)}
                    disabled={isSaving}
                    className={cn(
                      'w-full p-3 rounded-lg flex items-center gap-3 transition-colors text-left',
                      vertical.id === selectedVertical
                        ? 'bg-cyan-500/20 border border-cyan-500/50'
                        : 'hover:bg-sovereign-elevated border border-transparent'
                    )}
                  >
                    <span className="text-xl">{vertical.icon}</span>
                    <div>
                      <div className="font-medium text-white">{vertical.name}</div>
                      <div className="text-xs text-gray-500">{vertical.description}</div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Stats */}
          <div className="bg-sovereign-card border border-sovereign-border rounded-xl p-4">
            <h3 className="text-sm font-semibold text-gray-400 mb-3">Configuration Summary</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Enabled Services</span>
                <span className="text-cyan-400 font-bold">{enabledCount} / {totalCount}</span>
              </div>
              <div className="w-full bg-sovereign-border rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-cyan-500 to-blue-500 h-2 rounded-full transition-all"
                  style={{ width: `${(enabledCount / totalCount) * 100}%` }}
                />
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Core Services</span>
                <span className="text-emerald-400">{coreCount} always on</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Optional Enabled</span>
                <span className="text-white">{enabledCount - coreCount}</span>
              </div>
            </div>
          </div>

          {/* View Dashboard Link */}
          <button
            onClick={() => {
              // Map vertical IDs to their dashboard routes
              const verticalRoutes: Record<string, string> = {
                'financial-services': '/verticals/financial-services',
                'healthcare': '/verticals/healthcare',
                'manufacturing': '/verticals/manufacturing',
                'technology': '/verticals/technology',
                'energy': '/verticals/energy-utilities',
                'government': '/verticals/government-legal',
                'legal': '/verticals/government-legal',
                'retail': '/verticals/retail-hospitality',
                'real-estate': '/verticals/real-estate',
                'telecommunications': '/verticals/telecommunications',
                'hospitality': '/verticals/hospitality',
                'education': '/verticals/higher-education',
                'media': '/verticals/media-entertainment',
                'agriculture': '/verticals/agriculture',
                'logistics': '/verticals/transportation',
                'insurance': '/verticals/insurance',
                'nonprofit': '/verticals/nonprofit',
                'construction': '/verticals/construction',
                'mining': '/verticals/energy-utilities',
                'aerospace': '/verticals/aerospace',
                'pharmaceuticals': '/verticals/pharmaceutical',
                'automotive': '/verticals/automotive',
                'sports': '/verticals/sports',
              };
              const route = verticalRoutes[selectedVertical] || '/verticals';
              navigate(route);
            }}
            className="w-full bg-gradient-to-r from-cyan-600/20 to-blue-600/20 border border-cyan-500/30 rounded-xl p-4 hover:border-cyan-500/50 transition-all group"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-cyan-500/20 flex items-center justify-center">
                  <LayoutDashboard className="w-5 h-5 text-cyan-400" />
                </div>
                <div className="text-left">
                  <div className="font-medium text-white">View Dashboard</div>
                  <div className="text-xs text-gray-400">See your {currentVertical?.name} dashboard</div>
                </div>
              </div>
              <ArrowRight className="w-5 h-5 text-cyan-400 group-hover:translate-x-1 transition-transform" />
            </div>
          </button>

          {/* Legend */}
          <div className="bg-sovereign-card border border-sovereign-border rounded-xl p-4">
            <h3 className="text-sm font-semibold text-gray-400 mb-3">Tier Legend</h3>
            <div className="space-y-2">
              {TIERS.map(tier => (
                <div key={tier.id} className="flex items-center gap-2">
                  <span className={cn('text-xs font-medium px-2 py-0.5 rounded', tier.color, 'bg-sovereign-elevated')}>
                    {tier.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content - Service List */}
        <div className="col-span-3 space-y-4">
          {/* Search & Filter */}
          <div className="bg-sovereign-card border border-sovereign-border rounded-xl p-4 flex items-center gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="text"
                placeholder="Search services..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-sovereign-base border border-sovereign-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-500" />
              {CATEGORIES.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={cn(
                    'px-3 py-1.5 rounded-lg text-sm transition-colors',
                    selectedCategory === cat.id
                      ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/50'
                      : 'text-gray-400 hover:text-white hover:bg-sovereign-elevated'
                  )}
                >
                  {cat.icon} {cat.name}
                </button>
              ))}
            </div>
          </div>

          {/* Service Categories */}
          <div className="space-y-4">
            {servicesByCategory.map(category => (
              <div key={category.id} className="bg-sovereign-card border border-sovereign-border rounded-xl overflow-hidden">
                {/* Category Header */}
                <div
                  className="w-full p-4 flex items-center justify-between bg-sovereign-elevated hover:bg-sovereign-hover transition-colors cursor-pointer"
                >
                  <div 
                    className="flex items-center gap-3 flex-1"
                    onClick={() => toggleCategory(category.id)}
                  >
                    <span className="text-xl">{category.icon}</span>
                    <div className="text-left">
                      <h3 className="font-semibold text-white">{category.name}</h3>
                      <p className="text-xs text-gray-500">
                        {category.services.filter(s => enabledServices.has(s.id)).length} / {category.services.length} enabled
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => enableAllInCategory(category.id)}
                        className="px-2 py-1 text-xs text-emerald-400 hover:bg-emerald-500/10 rounded"
                      >
                        Enable All
                      </button>
                      <button
                        onClick={() => disableAllInCategory(category.id)}
                        className="px-2 py-1 text-xs text-red-400 hover:bg-red-500/10 rounded"
                      >
                        Disable All
                      </button>
                    </div>
                    <div onClick={() => toggleCategory(category.id)} className="cursor-pointer">
                      {expandedCategories.has(category.id) ? (
                        <ChevronDown className="w-5 h-5 text-gray-400" />
                      ) : (
                        <ChevronRight className="w-5 h-5 text-gray-400" />
                      )}
                    </div>
                  </div>
                </div>

                {/* Service List */}
                {expandedCategories.has(category.id) && (
                  <div className="divide-y divide-sovereign-border">
                    {category.services.map(service => {
                      const isEnabled = enabledServices.has(service.id);
                      const tier = TIERS.find(t => t.id === service.tier);
                      const isRecommended = currentVertical?.recommendedServices.includes(service.id);

                      return (
                        <div
                          key={service.id}
                          className={cn(
                            'p-4 flex items-center justify-between transition-colors',
                            isEnabled ? 'bg-sovereign-base' : 'bg-sovereign-elevated/30'
                          )}
                        >
                          <div className="flex items-center gap-4">
                            <span className="text-2xl">{service.icon}</span>
                            <div>
                              <div className="flex items-center gap-2">
                                <span className={cn('font-medium', isEnabled ? 'text-white' : 'text-gray-500')}>
                                  {service.name}
                                </span>
                                {service.isCore && (
                                  <span className="flex items-center gap-1 text-xs text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                                    <Lock className="w-3 h-3" />
                                    Core
                                  </span>
                                )}
                                {isRecommended && !isEnabled && (
                                  <span className="flex items-center gap-1 text-xs text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full">
                                    <Zap className="w-3 h-3" />
                                    Recommended
                                  </span>
                                )}
                                <span className={cn('text-xs px-2 py-0.5 rounded bg-sovereign-card', tier?.color)}>
                                  {tier?.name}
                                </span>
                              </div>
                              <p className={cn('text-sm mt-0.5', isEnabled ? 'text-gray-400' : 'text-gray-600')}>
                                {service.description}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            {service.isCore ? (
                              <div className="flex items-center gap-2 text-emerald-400">
                                <Shield className="w-4 h-4" />
                                <span className="text-sm">Always On</span>
                              </div>
                            ) : (
                              <ToggleSwitch
                                enabled={isEnabled}
                                onChange={(enabled) => toggleService(service.id, enabled)}
                              />
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Info Banner */}
      <div className="mt-8 p-4 bg-blue-500/10 border border-blue-500/30 rounded-xl flex items-start gap-3">
        <Info className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
        <div>
          <h4 className="font-medium text-blue-400">About Service Configuration</h4>
          <p className="text-sm text-gray-400 mt-1">
            Core services (Council, Ledger, Evidence Vault) are always enabled and cannot be disabled.
            Changes to your configuration will take effect immediately after saving.
            Switching verticals will reset your enabled services to the vertical defaults, but you can customize further.
          </p>
        </div>
      </div>
    </div>
  );
};

export default VerticalConfigPage;
