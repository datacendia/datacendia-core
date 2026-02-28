// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

/**
 * =============================================================================
 * DEMO LAUNCHER PAGE
 * =============================================================================
 * Professional demo selection and launch interface.
 * Allows users to select and start guided demos for recording.
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Play,
  Clock,
  Users,
  Video,
  Presentation,
  ChevronRight,
  Sparkles,
  Monitor,
  FileText,
  Settings,
} from 'lucide-react';
import { useDemoMode, DemoId, Demo } from '../../../contexts/DemoModeContext';
import { cn } from '../../../lib/utils';

// =============================================================================
// DEMO CARD COMPONENT
// =============================================================================

interface DemoCardProps {
  demo: Demo;
  onStart: (demoId: DemoId) => void;
}

const DemoCard: React.FC<DemoCardProps> = ({ demo, onStart }) => {
  const gradients: Record<DemoId, string> = {
    'executive-overview': 'from-purple-500/20 to-blue-500/20 border-purple-500/30 hover:border-purple-500/50',
    'council-in-action': 'from-cyan-500/20 to-teal-500/20 border-cyan-500/30 hover:border-cyan-500/50',
    'audit-compliance': 'from-emerald-500/20 to-green-500/20 border-emerald-500/30 hover:border-emerald-500/50',
    'industry-verticals': 'from-amber-500/20 to-orange-500/20 border-amber-500/30 hover:border-amber-500/50',
    'technical-deep-dive': 'from-rose-500/20 to-pink-500/20 border-rose-500/30 hover:border-rose-500/50',
  };

  return (
    <div 
      className={cn(
        'relative bg-gradient-to-br rounded-2xl border p-6 transition-all duration-300 cursor-pointer group',
        gradients[demo.id],
        'hover:scale-[1.02] hover:shadow-xl hover:shadow-black/20'
      )}
      onClick={() => onStart(demo.id)}
    >
      {/* Thumbnail */}
      <div className="text-6xl mb-4">{demo.thumbnail}</div>

      {/* Title */}
      <h3 className="text-xl font-bold text-white mb-2 group-hover:text-cyan-400 transition-colors">
        {demo.name}
      </h3>

      {/* Description */}
      <p className="text-gray-400 text-sm mb-4 line-clamp-2">
        {demo.description}
      </p>

      {/* Meta */}
      <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
        <span className="flex items-center gap-1">
          <Clock className="w-4 h-4" />
          {demo.duration}
        </span>
        <span className="flex items-center gap-1">
          <Users className="w-4 h-4" />
          {demo.audience.split(',')[0]}
        </span>
      </div>

      {/* Steps Preview */}
      <div className="flex items-center gap-1 mb-4">
        {demo.steps.slice(0, 8).map((_, i) => (
          <div 
            key={i} 
            className="w-2 h-2 rounded-full bg-white/20"
          />
        ))}
        {demo.steps.length > 8 && (
          <span className="text-xs text-gray-500 ml-1">+{demo.steps.length - 8}</span>
        )}
      </div>

      {/* Launch Button */}
      <button className="w-full py-3 bg-white/10 rounded-xl flex items-center justify-center gap-2 text-white font-medium group-hover:bg-white/20 transition-colors">
        <Play className="w-5 h-5" />
        Start Demo
        <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
      </button>

      {/* Badge */}
      <div className="absolute top-4 right-4 px-2 py-1 bg-black/30 rounded-full text-xs text-gray-400">
        {demo.steps.length} steps
      </div>
    </div>
  );
};

// =============================================================================
// MAIN PAGE
// =============================================================================

export const DemoLauncherPage: React.FC = () => {
  const navigate = useNavigate();
  const { getDemos, startDemo } = useDemoMode();
  const demos = getDemos();

  const handleStartDemo = (demoId: DemoId) => {
    startDemo(demoId);
    // Navigate to the first route of the demo if specified
    const demo = demos.find(d => d.id === demoId);
    if (demo?.steps[0]?.route) {
      navigate(demo.steps[0].route);
    }
  };

  return (
    <div className="min-h-screen bg-sovereign-base text-white p-8">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-12">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 flex items-center justify-center">
            <Video className="w-8 h-8 text-cyan-400" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Demo Studio</h1>
            <p className="text-gray-400">Professional demos for recording and presentations</p>
          </div>
        </div>

        {/* Recording Tips */}
        <div className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 rounded-xl p-6 mb-8">
          <h2 className="text-lg font-semibold text-cyan-400 mb-3 flex items-center gap-2">
            <Sparkles className="w-5 h-5" />
            Recording Tips
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-400">
            <div className="flex items-start gap-2">
              <Monitor className="w-4 h-4 text-cyan-400 mt-1 flex-shrink-0" />
              <span>Use <strong className="text-white">Clean Mode</strong> to hide UI chrome for cleaner recordings</span>
            </div>
            <div className="flex items-start gap-2">
              <FileText className="w-4 h-4 text-cyan-400 mt-1 flex-shrink-0" />
              <span>The <strong className="text-white">Script</strong> appears at the bottom - read it naturally</span>
            </div>
            <div className="flex items-start gap-2">
              <Settings className="w-4 h-4 text-cyan-400 mt-1 flex-shrink-0" />
              <span>Press <strong className="text-white">→</strong> to advance, <strong className="text-white">Space</strong> to auto-play</span>
            </div>
          </div>
        </div>
      </div>

      {/* Demo Grid */}
      <div className="max-w-7xl mx-auto">
        <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
          <Presentation className="w-5 h-5 text-gray-400" />
          Available Demos
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {demos.map(demo => (
            <DemoCard
              key={demo.id}
              demo={demo}
              onStart={handleStartDemo}
            />
          ))}
        </div>
      </div>

      {/* Recommended Order */}
      <div className="max-w-7xl mx-auto mt-12">
        <h2 className="text-xl font-semibold mb-6">Recommended Recording Order</h2>
        <div className="flex flex-wrap items-center gap-4">
          {demos.map((demo, index) => (
            <React.Fragment key={demo.id}>
              <div 
                className="flex items-center gap-3 px-4 py-2 bg-sovereign-card border border-sovereign-border rounded-lg cursor-pointer hover:border-cyan-500/50 transition-colors"
                onClick={() => handleStartDemo(demo.id)}
              >
                <span className="w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-400 text-sm font-bold flex items-center justify-center">
                  {index + 1}
                </span>
                <span className="text-white">{demo.name}</span>
                <span className="text-gray-500 text-sm">{demo.duration}</span>
              </div>
              {index < demos.length - 1 && (
                <ChevronRight className="w-4 h-4 text-gray-600" />
              )}
            </React.Fragment>
          ))}
        </div>
        <p className="text-sm text-gray-500 mt-4">
          Total recording time: ~60 minutes for all demos
        </p>
      </div>

      {/* Quick Actions */}
      <div className="max-w-7xl mx-auto mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-sovereign-card border border-sovereign-border rounded-xl p-6">
          <h3 className="font-semibold text-white mb-2">For Sales Calls</h3>
          <p className="text-sm text-gray-400 mb-4">
            Use Demo 1 (Executive Overview) for initial calls, then Demo 2 (Council in Action) for follow-ups.
          </p>
          <button 
            onClick={() => handleStartDemo('executive-overview')}
            className="px-4 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 rounded-lg text-sm font-medium hover:from-cyan-500 hover:to-blue-500 transition-colors"
          >
            Start Sales Demo →
          </button>
        </div>

        <div className="bg-sovereign-card border border-sovereign-border rounded-xl p-6">
          <h3 className="font-semibold text-white mb-2">For Technical Evaluation</h3>
          <p className="text-sm text-gray-400 mb-4">
            Use Demo 5 (Technical Deep-Dive) for architect meetings and security reviews.
          </p>
          <button 
            onClick={() => handleStartDemo('technical-deep-dive')}
            className="px-4 py-2 bg-gradient-to-r from-rose-600 to-pink-600 rounded-lg text-sm font-medium hover:from-rose-500 hover:to-pink-500 transition-colors"
          >
            Start Technical Demo →
          </button>
        </div>
      </div>
    </div>
  );
};

export default DemoLauncherPage;
