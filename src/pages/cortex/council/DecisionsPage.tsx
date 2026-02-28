// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

// =============================================================================
// DATACENDIA - DECISIONS PAGE
// View all council decisions and deliberations
// =============================================================================

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Search, 
  Filter, 
  Calendar,
  Clock,
  Users,
  CheckCircle,
  XCircle,
  AlertCircle,
  ChevronRight,
  RefreshCw,
} from 'lucide-react';
import { councilApi } from '../../../lib/api';
// =============================================================================
// TYPES
// =============================================================================

interface Decision {
  id: string;
  question: string;
  mode: 'quick' | 'deliberation';
  status: 'completed' | 'in_progress' | 'pending' | 'failed';
  confidence?: number;
  agentCount: number;
  createdAt: string;
  completedAt?: string;
  synthesis?: string;
}

// =============================================================================
// COMPONENT
// =============================================================================

export const DecisionsPage: React.FC = () => {
  const navigate = useNavigate();
  
  const [decisions, setDecisions] = useState<Decision[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterMode, setFilterMode] = useState<'all' | 'quick' | 'deliberation'>('all');
  const [filterStatus, setFilterStatus] = useState<'all' | 'completed' | 'in_progress'>('all');

  // Load decisions from API
  useEffect(() => {
    loadDecisions();
  }, []);

  const loadDecisions = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await councilApi.getAllDeliberations(50);
      if (response.success && response.data) {
        setDecisions(response.data.map((d: any) => ({
          id: d.id,
          question: d.question,
          mode: d.mode || 'deliberation',
          status: d.status || 'completed',
          confidence: d.confidence,
          agentCount: d.agentResponses?.length || d.agents?.length || 0,
          createdAt: d.createdAt || d.startedAt,
          completedAt: d.completedAt,
          synthesis: d.synthesis || d.response,
        })));
      }
    } catch (err) {
      console.error('Failed to load decisions:', err);
      setError('Failed to load decisions. The backend may not be running.');
      // Show empty state with demo data option
      setDecisions([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Filter decisions
  const filteredDecisions = decisions.filter(d => {
    // Search filter
    if (searchQuery && !d.question.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    // Mode filter
    if (filterMode !== 'all' && d.mode !== filterMode) {
      return false;
    }
    // Status filter
    if (filterStatus !== 'all' && d.status !== filterStatus) {
      return false;
    }
    return true;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-400" />;
      case 'in_progress':
        return <Clock className="w-4 h-4 text-yellow-400 animate-pulse" />;
      case 'failed':
        return <XCircle className="w-4 h-4 text-red-400" />;
      default:
        return <AlertCircle className="w-4 h-4 text-gray-400" />;
    }
  };

  const getConfidenceColor = (confidence?: number) => {
    if (!confidence) {return 'text-gray-400';}
    if (confidence >= 90) {return 'text-green-400';}
    if (confidence >= 70) {return 'text-yellow-400';}
    if (confidence >= 50) {return 'text-orange-400';}
    return 'text-red-400';
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/cortex/council')}
              className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-white">All Decisions</h1>
              <p className="text-gray-400 text-sm mt-1">
                {filteredDecisions.length} decision{filteredDecisions.length !== 1 ? 's' : ''} found
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                const ctx = {
                  question: 'Analyze the patterns in our recent decisions and identify any areas of concern or improvement',
                  sourcePage: 'Decisions',
                  contextSummary: `${decisions.length} decisions, ${decisions.filter(d => d.status === 'completed').length} completed`,
                  contextData: {
                    totalDecisions: decisions.length,
                    completedDecisions: decisions.filter(d => d.status === 'completed').length,
                    avgConfidence: decisions.filter(d => d.confidence).reduce((sum, d) => sum + (d.confidence || 0), 0) / decisions.filter(d => d.confidence).length || 0,
                    quickDecisions: decisions.filter(d => d.mode === 'quick').length,
                    deliberations: decisions.filter(d => d.mode === 'deliberation').length,
                  },
                  suggestedMode: 'advisory',
                };
                sessionStorage.setItem('councilQueryContext', JSON.stringify(ctx));
                navigate('/cortex/council?fromContext=true');
              }}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors"
            >
              💬 Ask Council
            </button>
            <button
              onClick={loadDecisions}
              disabled={isLoading}
              className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-4 mb-6">
          {/* Search */}
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              type="text"
              placeholder="Search decisions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* Mode Filter */}
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-500" />
            <select
              value={filterMode}
              onChange={(e) => setFilterMode(e.target.value as any)}
              className="px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-indigo-500"
            >
              <option value="all">All Modes</option>
              <option value="quick">Quick Brief</option>
              <option value="deliberation">Deliberation</option>
            </select>
          </div>

          {/* Status Filter */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as any)}
            className="px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-indigo-500"
          >
            <option value="all">All Status</option>
            <option value="completed">Completed</option>
            <option value="in_progress">In Progress</option>
          </select>
        </div>

        {/* Error State */}
        {error && (
          <div className="mb-6 p-4 bg-red-900/30 border border-red-800 rounded-lg">
            <p className="text-red-400">{error}</p>
            <p className="text-sm text-gray-400 mt-2">
              Decisions are saved when you click "Save" or generate a summary/minutes from the Council page.
            </p>
          </div>
        )}

        {/* Loading State */}
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <RefreshCw className="w-8 h-8 text-indigo-400 animate-spin" />
          </div>
        ) : filteredDecisions.length === 0 ? (
          /* Empty State */
          <div className="text-center py-20">
            <div className="text-6xl mb-4">💭</div>
            <h3 className="text-xl font-semibold text-white mb-2">No decisions yet</h3>
            <p className="text-gray-400 mb-6 max-w-md mx-auto">
              Start a deliberation in the Council to see your decisions here. 
              Decisions are saved when you click "Save" or generate summaries.
            </p>
            <button
              onClick={() => navigate('/cortex/council')}
              className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors"
            >
              Go to Council →
            </button>
          </div>
        ) : (
          /* Decisions List */
          <div className="space-y-4">
            {filteredDecisions.map((decision) => (
              <button
                key={decision.id}
                onClick={() => navigate(`/cortex/council/deliberation/${decision.id}`)}
                className="w-full text-left p-6 bg-gray-800 hover:bg-gray-750 border border-gray-700 hover:border-indigo-500 rounded-xl transition-all group"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    {/* Question */}
                    <h3 className="text-lg font-medium text-white mb-2 line-clamp-2 group-hover:text-indigo-300 transition-colors">
                      {decision.question}
                    </h3>
                    
                    {/* Meta */}
                    <div className="flex flex-wrap items-center gap-4 text-sm">
                      {/* Mode Badge */}
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        decision.mode === 'deliberation' 
                          ? 'bg-orange-900/50 text-orange-400' 
                          : 'bg-blue-900/50 text-blue-400'
                      }`}>
                        {decision.mode === 'deliberation' ? '⚖️ Deliberation' : '⚡ Quick Brief'}
                      </span>
                      
                      {/* Status */}
                      <span className="flex items-center gap-1 text-gray-400">
                        {getStatusIcon(decision.status)}
                        <span className="capitalize">{decision.status.replace('_', ' ')}</span>
                      </span>
                      
                      {/* Confidence */}
                      {decision.confidence && (
                        <span className={`${getConfidenceColor(decision.confidence)}`}>
                          {decision.confidence}% confidence
                        </span>
                      )}
                      
                      {/* Agents */}
                      <span className="flex items-center gap-1 text-gray-400">
                        <Users className="w-4 h-4" />
                        {decision.agentCount} agent{decision.agentCount !== 1 ? 's' : ''}
                      </span>
                      
                      {/* Date */}
                      <span className="flex items-center gap-1 text-gray-500">
                        <Calendar className="w-4 h-4" />
                        {formatDate(decision.createdAt)}
                      </span>
                    </div>
                    
                    {/* Synthesis Preview */}
                    {decision.synthesis && (
                      <p className="mt-3 text-sm text-gray-400 line-clamp-2">
                        {decision.synthesis}
                      </p>
                    )}
                  </div>
                  
                  <ChevronRight className="w-5 h-5 text-gray-500 group-hover:text-indigo-400 transition-colors flex-shrink-0" />
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DecisionsPage;
