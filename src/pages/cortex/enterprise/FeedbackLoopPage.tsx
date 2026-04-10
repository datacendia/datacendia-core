/**
 * Feedback & Improvement Loop Deep-Dive Page
 *
 * Manage feedback entries, track improvement items, view analytics.
 *
 * @module pages/cortex/enterprise/FeedbackLoopPage
 */

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MessageSquare, RefreshCw, Plus, ChevronRight, Loader2,
  ThumbsUp, ThumbsDown, AlertCircle, CheckCircle2, Clock,
  Filter, BarChart3, TrendingUp, Tag,
} from 'lucide-react';
import apiClient from '../../../lib/api/client';

// =============================================================================
// TYPES
// =============================================================================

interface FeedbackEntry {
  id: string;
  type: string;
  source: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  submittedBy: string;
  createdAt: string;
  tags?: string[];
  votes?: number;
}

// =============================================================================
// COMPONENT
// =============================================================================

export default function FeedbackLoopPage() {
  const [feedback, setFeedback] = useState<FeedbackEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ type: 'suggestion', title: '', description: '', priority: 'medium' });

  const fetchFeedback = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (statusFilter) params.append('status', statusFilter);
      if (typeFilter) params.append('type', typeFilter);
      const resp: any = await apiClient.api.get(`/feedback?${params.toString()}`);
      setFeedback(resp?.data?.feedback || resp?.data?.entries || resp?.feedback || []);
    } catch {
      setFeedback([]);
    }
    setLoading(false);
  }, [statusFilter, typeFilter]);

  useEffect(() => { fetchFeedback(); }, [fetchFeedback]);

  const submitFeedback = async () => {
    try {
      await apiClient.api.post('/feedback', formData);
      setShowForm(false);
      setFormData({ type: 'suggestion', title: '', description: '', priority: 'medium' });
      fetchFeedback();
    } catch {}
  };

  const statusColors: Record<string, string> = {
    new: 'bg-blue-600', under_review: 'bg-amber-600', in_progress: 'bg-purple-600',
    implemented: 'bg-emerald-600', declined: 'bg-red-600', closed: 'bg-slate-600',
  };

  const priorityColors: Record<string, string> = {
    low: 'text-slate-400', medium: 'text-amber-400', high: 'text-orange-400', critical: 'text-red-400',
  };

  const stats = {
    total: feedback.length,
    open: feedback.filter((f) => ['new', 'under_review', 'in_progress'].includes(f.status)).length,
    implemented: feedback.filter((f) => f.status === 'implemented').length,
    avgVotes: feedback.length > 0 ? Math.round(feedback.reduce((s, f) => s + (f.votes || 0), 0) / feedback.length) : 0,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center">
                <MessageSquare className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-pink-400 to-rose-400 bg-clip-text text-transparent">
                Feedback & Improvement Loop
              </h1>
            </div>
            <p className="text-sm text-slate-400 ml-13">
              {stats.total} entries &middot; {stats.open} open &middot; {stats.implemented} implemented
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowForm(!showForm)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-pink-600 hover:bg-pink-700 text-sm font-medium transition-colors"
            >
              <Plus className="w-4 h-4" /> Submit Feedback
            </button>
            <button
              onClick={fetchFeedback}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-sm transition-colors"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          {[
            { label: 'Total', value: stats.total, icon: MessageSquare, color: 'pink' },
            { label: 'Open', value: stats.open, icon: Clock, color: 'amber' },
            { label: 'Implemented', value: stats.implemented, icon: CheckCircle2, color: 'emerald' },
            { label: 'Avg Votes', value: stats.avgVotes, icon: ThumbsUp, color: 'blue' },
          ].map((s) => (
            <div key={s.label} className="bg-slate-800/60 border border-slate-700/50 rounded-xl p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-400">{s.label}</p>
                  <p className="text-2xl font-bold mt-1">{s.value}</p>
                </div>
                <s.icon className={`w-8 h-8 text-${s.color}-400 opacity-60`} />
              </div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="flex gap-2 mb-6">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-sm text-white focus:outline-none"
          >
            <option value="">All Status</option>
            <option value="new">New</option>
            <option value="under_review">Under Review</option>
            <option value="in_progress">In Progress</option>
            <option value="implemented">Implemented</option>
            <option value="declined">Declined</option>
          </select>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-sm text-white focus:outline-none"
          >
            <option value="">All Types</option>
            <option value="bug">Bug</option>
            <option value="suggestion">Suggestion</option>
            <option value="feature_request">Feature Request</option>
            <option value="compliance_issue">Compliance Issue</option>
          </select>
        </div>

        {/* Submit Form */}
        <AnimatePresence>
          {showForm && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden mb-6"
            >
              <div className="bg-slate-800/80 border border-slate-700 rounded-xl p-6">
                <h3 className="text-lg font-semibold mb-4">Submit Feedback</h3>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="text-xs text-slate-400 mb-1 block">Type</label>
                    <select value={formData.type} onChange={(e) => setFormData({ ...formData, type: e.target.value })} className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-sm text-white">
                      <option value="suggestion">Suggestion</option>
                      <option value="bug">Bug Report</option>
                      <option value="feature_request">Feature Request</option>
                      <option value="compliance_issue">Compliance Issue</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs text-slate-400 mb-1 block">Priority</label>
                    <select value={formData.priority} onChange={(e) => setFormData({ ...formData, priority: e.target.value })} className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-sm text-white">
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                      <option value="critical">Critical</option>
                    </select>
                  </div>
                </div>
                <div className="mb-4">
                  <label className="text-xs text-slate-400 mb-1 block">Title</label>
                  <input
                    type="text" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-sm text-white"
                    placeholder="Brief description of the feedback"
                  />
                </div>
                <div className="mb-4">
                  <label className="text-xs text-slate-400 mb-1 block">Details</label>
                  <textarea
                    value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-sm text-white h-24 resize-none"
                    placeholder="Detailed description..."
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <button onClick={() => setShowForm(false)} className="px-4 py-2 text-sm text-slate-400 hover:text-white">Cancel</button>
                  <button onClick={submitFeedback} className="px-4 py-2 rounded-lg bg-pink-600 hover:bg-pink-700 text-sm font-medium">Submit</button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Feedback List */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-pink-400" />
          </div>
        ) : (
          <div className="space-y-3">
            {feedback.map((entry, i) => (
              <motion.div
                key={entry.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.02 }}
                className="bg-slate-800/60 border border-slate-700/50 rounded-xl p-4 hover:border-pink-500/30 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-sm">{entry.title}</h3>
                      <span className={`text-xs rounded-full px-2 py-0.5 ${statusColors[entry.status] || 'bg-slate-600'}`}>
                        {entry.status.replace('_', ' ')}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 line-clamp-2 mb-2">{entry.description}</p>
                    <div className="flex items-center gap-3 text-xs text-slate-500">
                      <span className="bg-slate-700/40 rounded px-2 py-0.5">{entry.type}</span>
                      <span className={priorityColors[entry.priority] || 'text-slate-400'}>{entry.priority}</span>
                      <span>by {entry.submittedBy || 'anonymous'}</span>
                      {entry.createdAt && <span>{new Date(entry.createdAt).toLocaleDateString()}</span>}
                    </div>
                  </div>
                  {entry.votes !== undefined && (
                    <div className="flex items-center gap-1 text-sm text-slate-400 ml-4">
                      <ThumbsUp className="w-4 h-4" />
                      <span>{entry.votes}</span>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
            {feedback.length === 0 && (
              <div className="text-center py-12 text-slate-500">No feedback entries found. Be the first to submit!</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
