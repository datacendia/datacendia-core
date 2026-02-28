// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

/**
 * LEGAL DEMO SHOWCASE PAGE
 * 
 * Enterprise-grade demo launcher for legal vertical scenarios.
 * One-click loading of pre-configured legal scenarios with full Council integration.
 * 
 * Features:
 * - Pre-loaded legal scenarios (employment, contract, regulatory, M&A, litigation)
 * - One-click scenario loading into Council
 * - Demo materials viewer
 * - Quick prompts for rapid demo
 * - Legal Research API status
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Scale,
  Gavel,
  FileText,
  Play,
  Clock,
  Users,
  AlertTriangle,
  CheckCircle,
  ChevronRight,
  Briefcase,
  FileWarning,
  Building,
  UserX,
  Shield,
  Rocket,
  BookOpen,
  Zap,
  RefreshCw,
  ExternalLink,
} from 'lucide-react';

const API_BASE = '/api/v1/legal-research';

interface LegalScenario {
  id: string;
  name: string;
  category: string;
  councilMode: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  estimatedTime: string;
  description: string;
  clientPrompt: string;
  context: Record<string, any>;
  expectedAgents: string[];
  keyIssues: string[];
  learningObjectives: string[];
}

interface DemoMaterial {
  id: string;
  name: string;
  filename: string;
  category: string;
  description: string;
}

interface QuickPrompts {
  [key: string]: string;
}

const LegalDemoShowcasePage: React.FC = () => {
  const navigate = useNavigate();
  const [scenarios, setScenarios] = useState<LegalScenario[]>([]);
  const [materials, setMaterials] = useState<DemoMaterial[]>([]);
  const [quickPrompts, setQuickPrompts] = useState<QuickPrompts>({});
  const [loading, setLoading] = useState(true);
  const [selectedScenario, setSelectedScenario] = useState<LegalScenario | null>(null);
  const [apiStatus, setApiStatus] = useState<Record<string, boolean>>({});
  const [activeTab, setActiveTab] = useState<'scenarios' | 'materials' | 'quick'>('scenarios');

  useEffect(() => {
    fetchScenarios();
    fetchMaterials();
    fetchApiStatus();
  }, []);

  const fetchScenarios = async () => {
    try {
      const res = await fetch(`${API_BASE}/demo/scenarios`);
      const data = await res.json();
      if (data.success) {
        setScenarios(data.scenarios);
        setQuickPrompts(data.quickPrompts || {});
      }
    } catch (error) {
      console.error('Failed to fetch scenarios:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMaterials = async () => {
    try {
      const res = await fetch(`${API_BASE}/demo/materials`);
      const data = await res.json();
      if (data.success) {
        setMaterials(data.materials);
      }
    } catch (error) {
      console.error('Failed to fetch materials:', error);
    }
  };

  const fetchApiStatus = async () => {
    try {
      const res = await fetch(`${API_BASE}/status`);
      const data = await res.json();
      if (data.success) {
        setApiStatus(data.status);
      }
    } catch (error) {
      console.error('Failed to fetch API status:', error);
    }
  };

  const launchScenario = (scenario: LegalScenario) => {
    // Store scenario in sessionStorage for Council to pick up
    sessionStorage.setItem('legalDemoScenario', JSON.stringify({
      prompt: scenario.clientPrompt,
      mode: scenario.councilMode,
      context: scenario.context,
      expectedAgents: scenario.expectedAgents,
    }));
    // Navigate to Council with legal mode
    navigate('/cortex/council?demo=legal&scenario=' + scenario.id);
  };

  const launchQuickPrompt = (key: string, prompt: string) => {
    sessionStorage.setItem('legalDemoScenario', JSON.stringify({
      prompt,
      mode: 'general-counsel',
      context: {},
      expectedAgents: [],
    }));
    navigate('/cortex/council?demo=legal&quick=' + key);
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'employment-law': return <UserX className="w-5 h-5" />;
      case 'contract-law': return <FileText className="w-5 h-5" />;
      case 'regulatory': return <Shield className="w-5 h-5" />;
      case 'mergers-acquisitions': return <Building className="w-5 h-5" />;
      case 'litigation': return <Gavel className="w-5 h-5" />;
      default: return <Scale className="w-5 h-5" />;
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-500/20 text-green-400';
      case 'intermediate': return 'bg-yellow-500/20 text-yellow-400';
      case 'advanced': return 'bg-orange-500/20 text-orange-400';
      case 'expert': return 'bg-red-500/20 text-red-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'employment-law': return 'from-blue-500/20 to-cyan-500/20 border-blue-500/30';
      case 'contract-law': return 'from-purple-500/20 to-pink-500/20 border-purple-500/30';
      case 'regulatory': return 'from-red-500/20 to-orange-500/20 border-red-500/30';
      case 'mergers-acquisitions': return 'from-emerald-500/20 to-teal-500/20 border-emerald-500/30';
      case 'litigation': return 'from-amber-500/20 to-yellow-500/20 border-amber-500/30';
      default: return 'from-gray-500/20 to-slate-500/20 border-gray-500/30';
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-amber-500/20 rounded-lg">
              <Gavel className="w-8 h-8 text-amber-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Legal Demo Showcase</h1>
              <p className="text-gray-400">Enterprise Legal Vertical - One-Click Demo Scenarios</p>
            </div>
          </div>
          <p className="text-gray-500 italic mt-2">
            "Transform how law firms handle complex litigation with AI-powered analysis"
          </p>
        </div>

        {/* API Status Banner */}
        <div className="mb-6 bg-gray-800 rounded-xl p-4 border border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-400">Legal Research API Status:</span>
              {Object.entries(apiStatus).map(([source, available]) => (
                <span
                  key={source}
                  className={`px-2 py-1 rounded text-xs ${
                    available ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                  }`}
                >
                  {available ? <CheckCircle className="w-3 h-3 inline mr-1" /> : <AlertTriangle className="w-3 h-3 inline mr-1" />}
                  {source}
                </span>
              ))}
            </div>
            <button
              onClick={fetchApiStatus}
              className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          {[
            { id: 'scenarios', label: 'Demo Scenarios', icon: Briefcase },
            { id: 'materials', label: 'Demo Materials', icon: BookOpen },
            { id: 'quick', label: 'Quick Prompts', icon: Zap },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors ${
                activeTab === tab.id
                  ? 'bg-amber-500/20 text-amber-400 border border-amber-500/50'
                  : 'bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <RefreshCw className="w-8 h-8 animate-spin text-gray-400" />
          </div>
        ) : (
          <>
            {/* Scenarios Tab */}
            {activeTab === 'scenarios' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {scenarios.map((scenario) => (
                  <div
                    key={scenario.id}
                    className={`bg-gradient-to-br ${getCategoryColor(scenario.category)} rounded-xl border p-6 hover:scale-[1.02] transition-all cursor-pointer group`}
                    onClick={() => setSelectedScenario(selectedScenario?.id === scenario.id ? null : scenario)}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-gray-800/50 rounded-lg">
                          {getCategoryIcon(scenario.category)}
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg">{scenario.name}</h3>
                          <p className="text-sm text-gray-400">{scenario.category.replace(/-/g, ' ')}</p>
                        </div>
                      </div>
                      <span className={`px-2 py-1 rounded text-xs ${getDifficultyColor(scenario.difficulty)}`}>
                        {scenario.difficulty}
                      </span>
                    </div>

                    <p className="text-sm text-gray-300 mb-4 line-clamp-2">{scenario.description}</p>

                    <div className="flex items-center gap-4 text-sm text-gray-400 mb-4">
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {scenario.estimatedTime}
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        {scenario.expectedAgents.length} agents
                      </span>
                    </div>

                    {/* Expanded Details */}
                    {selectedScenario?.id === scenario.id && (
                      <div className="mt-4 pt-4 border-t border-gray-700/50 space-y-4">
                        <div>
                          <h4 className="text-sm font-semibold text-gray-300 mb-2">Client Prompt:</h4>
                          <p className="text-xs text-gray-400 bg-gray-800/50 rounded-lg p-3 max-h-32 overflow-y-auto">
                            {scenario.clientPrompt}
                          </p>
                        </div>

                        <div>
                          <h4 className="text-sm font-semibold text-gray-300 mb-2">Key Issues:</h4>
                          <div className="flex flex-wrap gap-1">
                            {scenario.keyIssues.map((issue, i) => (
                              <span key={i} className="px-2 py-0.5 bg-gray-800/50 rounded text-xs text-gray-400">
                                {issue}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div>
                          <h4 className="text-sm font-semibold text-gray-300 mb-2">Expected Agents:</h4>
                          <div className="flex flex-wrap gap-1">
                            {scenario.expectedAgents.map((agent, i) => (
                              <span key={i} className="px-2 py-0.5 bg-amber-500/20 rounded text-xs text-amber-300">
                                {agent.replace(/-/g, ' ')}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        launchScenario(scenario);
                      }}
                      className="w-full mt-4 py-3 bg-amber-600 hover:bg-amber-700 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors"
                    >
                      <Rocket className="w-5 h-5" />
                      Launch Demo
                      <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Materials Tab */}
            {activeTab === 'materials' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {materials.map((material) => (
                  <div
                    key={material.id}
                    className="bg-gray-800 rounded-xl border border-gray-700 p-6 hover:border-amber-500/50 transition-colors"
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 bg-amber-500/20 rounded-lg">
                        <FileText className="w-5 h-5 text-amber-400" />
                      </div>
                      <div>
                        <h3 className="font-semibold">{material.name}</h3>
                        <p className="text-xs text-gray-400">{material.filename}</p>
                      </div>
                    </div>
                    <p className="text-sm text-gray-400 mb-4">{material.description}</p>
                    <span className="px-2 py-1 bg-gray-700 rounded text-xs text-gray-300">
                      {material.category.replace(/-/g, ' ')}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {/* Quick Prompts Tab */}
            {activeTab === 'quick' && (
              <div className="space-y-4">
                <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Zap className="w-5 h-5 text-yellow-400" />
                    Quick Demo Prompts
                  </h3>
                  <p className="text-sm text-gray-400 mb-6">
                    One-click prompts for rapid demonstrations. Click any prompt to immediately launch in Council.
                  </p>
                  <div className="space-y-3">
                    {Object.entries(quickPrompts).map(([key, prompt]) => (
                      <div
                        key={key}
                        className="p-4 bg-gray-700/50 rounded-lg hover:bg-gray-700 transition-colors cursor-pointer group"
                        onClick={() => launchQuickPrompt(key, prompt)}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className="font-medium text-amber-400 mb-1">
                              {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                            </h4>
                            <p className="text-sm text-gray-300">{prompt}</p>
                          </div>
                          <button className="p-2 bg-amber-600 hover:bg-amber-700 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
                            <Play className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {/* Instructions Panel */}
        <div className="mt-8 bg-gray-800/50 rounded-xl p-6 border border-gray-700">
          <h3 className="text-lg font-semibold mb-4">Demo Instructions</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-400 font-bold">1</div>
              <div>
                <p className="font-medium">Select a Scenario</p>
                <p className="text-gray-400">Choose from employment, contract, regulatory, M&A, or litigation demos</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-400 font-bold">2</div>
              <div>
                <p className="font-medium">Launch Demo</p>
                <p className="text-gray-400">Click "Launch Demo" to open Council with pre-loaded scenario</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-400 font-bold">3</div>
              <div>
                <p className="font-medium">Watch Agents Deliberate</p>
                <p className="text-gray-400">Legal agents analyze the case using research tools and case law</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LegalDemoShowcasePage;
