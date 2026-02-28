// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

// =============================================================================
// MODEL SWITCHER COMPONENT
// Easy UI for switching AI models for agents and services
// =============================================================================

import React, { useState, useMemo } from 'react';
import {
  Cpu,
  ChevronDown,
  Check,
  Zap,
  Brain,
  Code,
  Image,
  Search,
  AlertCircle,
  Info,
  Settings,
  RefreshCw,
} from 'lucide-react';
import {
  OllamaModel,
  ModelCategory,
  getAvailableModels,
  getModel,
  getModelCategories,
  getRecommendedModels,
  getDefaultModel,
  TOTAL_MODEL_COUNT,
} from '../../lib/agents/modelSwitching';

// =============================================================================
// MODEL SWITCHER PANEL (Full)
// =============================================================================

interface ModelSwitcherProps {
  agentCode: string;
  agentName: string;
  currentModel: string;
  onModelChange: (modelId: string) => void;
}

export const ModelSwitcher: React.FC<ModelSwitcherProps> = ({
  agentCode,
  agentName,
  currentModel,
  onModelChange,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const categories = getModelCategories();
  const allModels = getAvailableModels();
  const recommendedModels = useMemo(() => getRecommendedModels(agentCode), [agentCode]);
  const currentModelData = getModel(currentModel);

  const filteredModels = useMemo(() => {
    let models = allModels;

    if (selectedCategory) {
      const category = categories.find((c) => c.id === selectedCategory);
      if (category) {
        models = models.filter((m) => category.models.includes(m.id));
      }
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      models = models.filter(
        (m) =>
          m.name.toLowerCase().includes(query) ||
          m.description.toLowerCase().includes(query) ||
          m.capabilities.some((c) => c.includes(query))
      );
    }

    return models;
  }, [allModels, selectedCategory, searchQuery, categories]);

  const getSpeedIcon = (speed: string) => {
    switch (speed) {
      case 'fast':
        return <Zap size={14} className="text-green-400" />;
      case 'medium':
        return <Zap size={14} className="text-amber-400" />;
      case 'slow':
        return <Zap size={14} className="text-red-400" />;
      default:
        return null;
    }
  };

  const getQualityBadge = (quality: string) => {
    const colors: Record<string, string> = {
      basic: 'bg-slate-500/20 text-slate-400',
      good: 'bg-blue-500/20 text-blue-400',
      excellent: 'bg-purple-500/20 text-purple-400',
      flagship: 'bg-amber-500/20 text-amber-400',
    };
    return colors[quality] || colors.good;
  };

  const getCapabilityIcon = (capability: string) => {
    switch (capability) {
      case 'reasoning':
        return <Brain size={12} />;
      case 'coding':
        return <Code size={12} />;
      case 'vision':
        return <Image size={12} />;
      default:
        return null;
    }
  };

  return (
    <div className="bg-slate-900/50 rounded-xl border border-slate-700/50 overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 bg-slate-800/50 border-b border-slate-700/50">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <Cpu size={20} className="text-cyan-400" />
              Model Selection
            </h3>
            <p className="text-sm text-slate-400 mt-1">Choose the AI model for {agentName}</p>
          </div>

          <div className="text-right">
            <span className="text-xs text-slate-500">{TOTAL_MODEL_COUNT} models available</span>
          </div>
        </div>

        {/* Current Model Display */}
        {currentModelData && (
          <div className="mt-4 p-3 rounded-lg bg-cyan-500/10 border border-cyan-500/30">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-cyan-500/20 flex items-center justify-center">
                  <Cpu size={20} className="text-cyan-400" />
                </div>
                <div>
                  <p className="font-medium text-white">{currentModelData.name}</p>
                  <p className="text-xs text-slate-400">
                    {currentModelData.size} • {currentModelData.contextLength.toLocaleString()}{' '}
                    context
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {getSpeedIcon(currentModelData.speed)}
                <span
                  className={`text-xs px-2 py-0.5 rounded ${getQualityBadge(currentModelData.quality)}`}
                >
                  {currentModelData.quality}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Search */}
        <div className="mt-4 relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search models..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
          />
        </div>
      </div>

      {/* Recommended Models */}
      {recommendedModels.length > 0 && (
        <div className="px-6 py-4 border-b border-slate-700/50">
          <h4 className="text-sm font-medium text-white mb-3 flex items-center gap-2">
            <span className="text-amber-400">★</span>
            Recommended for {agentName}
          </h4>
          <div className="flex flex-wrap gap-2">
            {recommendedModels.map((model) => (
              <button
                key={model.id}
                onClick={() => onModelChange(model.id)}
                className={`
                  px-3 py-1.5 rounded-lg text-sm flex items-center gap-2 transition-all
                  ${
                    currentModel === model.id
                      ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                      : 'bg-slate-700/50 text-slate-300 border border-slate-600/50 hover:bg-slate-700'
                  }
                `}
              >
                {currentModel === model.id && <Check size={14} />}
                {model.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Category Tabs */}
      <div className="px-6 py-3 border-b border-slate-700/50 overflow-x-auto">
        <div className="flex gap-2">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`
              px-3 py-1.5 rounded-lg text-sm whitespace-nowrap transition-all
              ${
                selectedCategory === null
                  ? 'bg-cyan-500/20 text-cyan-400'
                  : 'bg-slate-700/50 text-slate-400 hover:text-white'
              }
            `}
          >
            All Models
          </button>
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`
                px-3 py-1.5 rounded-lg text-sm whitespace-nowrap transition-all
                ${
                  selectedCategory === category.id
                    ? 'bg-cyan-500/20 text-cyan-400'
                    : 'bg-slate-700/50 text-slate-400 hover:text-white'
                }
              `}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>

      {/* Model List */}
      <div className="max-h-96 overflow-y-auto divide-y divide-slate-700/50">
        {filteredModels.map((model) => (
          <button
            key={model.id}
            onClick={() => onModelChange(model.id)}
            className={`
              w-full px-6 py-4 text-left transition-all
              ${currentModel === model.id ? 'bg-cyan-500/10' : 'hover:bg-slate-800/50'}
            `}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-white">{model.name}</span>
                  <span className="text-xs text-slate-500">{model.size}</span>
                  {currentModel === model.id && <Check size={16} className="text-cyan-400" />}
                </div>
                <p className="text-sm text-slate-400 mt-1">{model.description}</p>

                {/* Capabilities */}
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {model.capabilities.slice(0, 4).map((cap) => (
                    <span
                      key={cap}
                      className="px-2 py-0.5 rounded bg-slate-700/50 text-xs text-slate-400 flex items-center gap-1"
                    >
                      {getCapabilityIcon(cap)}
                      {cap}
                    </span>
                  ))}
                  {model.capabilities.length > 4 && (
                    <span className="px-2 py-0.5 rounded bg-slate-700/50 text-xs text-slate-500">
                      +{model.capabilities.length - 4} more
                    </span>
                  )}
                </div>
              </div>

              <div className="flex flex-col items-end gap-1 ml-4">
                <div className="flex items-center gap-2">
                  {getSpeedIcon(model.speed)}
                  <span className={`text-xs px-2 py-0.5 rounded ${getQualityBadge(model.quality)}`}>
                    {model.quality}
                  </span>
                </div>
                <span className="text-xs text-slate-500">
                  {model.contextLength.toLocaleString()} ctx
                </span>
                <span className="text-xs text-slate-500">{model.memoryRequired}</span>
              </div>
            </div>
          </button>
        ))}

        {filteredModels.length === 0 && (
          <div className="px-6 py-8 text-center text-slate-400">
            No models found matching your criteria
          </div>
        )}
      </div>
    </div>
  );
};

// =============================================================================
// COMPACT MODEL SWITCHER (Inline/Dropdown)
// =============================================================================

interface CompactModelSwitcherProps {
  currentModel: string;
  onModelChange: (modelId: string) => void;
  agentCode?: string;
}

export const CompactModelSwitcher: React.FC<CompactModelSwitcherProps> = ({
  currentModel,
  onModelChange,
  agentCode,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const currentModelData = getModel(currentModel);
  const models = agentCode ? getRecommendedModels(agentCode) : getAvailableModels().slice(0, 10);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 hover:bg-slate-700 transition-colors"
      >
        <Cpu size={16} className="text-cyan-400" />
        <span className="text-sm text-white">{currentModelData?.name || currentModel}</span>
        <ChevronDown
          size={14}
          className={`text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute top-full left-0 mt-1 w-64 bg-slate-800 border border-slate-700 rounded-lg shadow-xl z-50 overflow-hidden">
            <div className="max-h-64 overflow-y-auto">
              {models.map((model) => (
                <button
                  key={model.id}
                  onClick={() => {
                    onModelChange(model.id);
                    setIsOpen(false);
                  }}
                  className={`
                    w-full px-4 py-2 text-left flex items-center justify-between
                    ${
                      currentModel === model.id
                        ? 'bg-cyan-500/10 text-cyan-400'
                        : 'text-slate-300 hover:bg-slate-700'
                    }
                  `}
                >
                  <div>
                    <span className="text-sm font-medium">{model.name}</span>
                    <span className="text-xs text-slate-500 ml-2">{model.size}</span>
                  </div>
                  {currentModel === model.id && <Check size={14} />}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

// =============================================================================
// GLOBAL MODEL SETTINGS PANEL
// For system-wide model configuration
// =============================================================================

interface GlobalModelSettingsProps {
  defaultModel: string;
  onDefaultChange: (modelId: string) => void;
  agentModels: Record<string, string>;
  onAgentModelChange: (agentCode: string, modelId: string) => void;
}

export const GlobalModelSettings: React.FC<GlobalModelSettingsProps> = ({
  defaultModel,
  onDefaultChange,
  agentModels,
  onAgentModelChange,
}) => {
  const [activeTab, setActiveTab] = useState<'default' | 'agents'>('default');
  const defaultModelData = getModel(defaultModel);
  const allModels = getAvailableModels();

  return (
    <div className="bg-slate-900/50 rounded-xl border border-slate-700/50">
      {/* Header */}
      <div className="px-6 py-4 border-b border-slate-700/50">
        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
          <Settings size={20} className="text-cyan-400" />
          Global Model Settings
        </h3>
        <p className="text-sm text-slate-400 mt-1">Configure AI models for the entire platform</p>
      </div>

      {/* Tabs */}
      <div className="px-6 py-3 border-b border-slate-700/50 flex gap-4">
        <button
          onClick={() => setActiveTab('default')}
          className={`text-sm font-medium ${activeTab === 'default' ? 'text-cyan-400' : 'text-slate-400'}`}
        >
          Default Model
        </button>
        <button
          onClick={() => setActiveTab('agents')}
          className={`text-sm font-medium ${activeTab === 'agents' ? 'text-cyan-400' : 'text-slate-400'}`}
        >
          Agent Models
        </button>
      </div>

      {/* Content */}
      <div className="p-6">
        {activeTab === 'default' && (
          <div className="space-y-4">
            <div className="p-4 rounded-lg bg-slate-800/50 border border-slate-700/50">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-white">System Default</p>
                  <p className="text-sm text-slate-400">{defaultModelData?.name || defaultModel}</p>
                </div>
                <CompactModelSwitcher currentModel={defaultModel} onModelChange={onDefaultChange} />
              </div>
            </div>

            <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-start gap-3">
              <Info size={16} className="text-amber-400 mt-0.5" />
              <p className="text-sm text-amber-300/80">
                The default model is used when no specific model is assigned to an agent or service.
              </p>
            </div>
          </div>
        )}

        {activeTab === 'agents' && (
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {Object.entries(agentModels).map(([agentCode, modelId]) => (
              <div
                key={agentCode}
                className="flex items-center justify-between p-3 rounded-lg bg-slate-800/50 border border-slate-700/50"
              >
                <span className="text-sm font-medium text-white capitalize">{agentCode}</span>
                <CompactModelSwitcher
                  currentModel={modelId}
                  onModelChange={(newModel) => onAgentModelChange(agentCode, newModel)}
                  agentCode={agentCode}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ModelSwitcher;
