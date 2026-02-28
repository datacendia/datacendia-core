// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

// =============================================================================
// MARKETING CMS PAGE - Owner-Only Marketing Website Management
// Allows Stuart Rainey to update the marketing website from the Admin panel
// =============================================================================

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { cn } from '../../../lib/utils';

// =============================================================================
// TYPES
// =============================================================================

interface MarketingPage {
  id: string;
  name: string;
  path: string;
  lastModified: string;
  status: 'published' | 'draft' | 'pending';
  description: string;
}

interface DeployStatus {
  status: 'idle' | 'building' | 'deployed' | 'failed';
  lastDeploy: string;
  commitHash?: string;
  message?: string;
}

// =============================================================================
// MOCK DATA (Replace with GitHub API integration)
// =============================================================================

const MARKETING_PAGES: MarketingPage[] = [
  { id: 'index', name: 'Home Page', path: 'index.html', lastModified: '2026-01-09', status: 'published', description: 'Main landing page' },
  { id: 'verticals', name: 'Industry Verticals', path: 'verticals.html', lastModified: '2026-01-09', status: 'published', description: 'All industry verticals' },
  { id: 'pricing', name: 'Pricing', path: 'pricing.html', lastModified: '2026-01-05', status: 'published', description: 'Pricing tiers and packages' },
  { id: 'trust', name: 'Trust & Security', path: 'trust.html', lastModified: '2026-01-03', status: 'published', description: 'Security and compliance info' },
  { id: 'demos', name: 'Demos', path: 'demos.html', lastModified: '2026-01-02', status: 'published', description: 'Product demonstrations' },
  { id: 'pilot', name: 'Pilot Program', path: 'pilot.html', lastModified: '2026-01-01', status: 'published', description: 'Pilot program signup' },
  { id: 'briefing', name: 'Request Briefing', path: 'briefing.html', lastModified: '2025-12-28', status: 'published', description: 'Contact form' },
  { id: 'architecture', name: 'Architecture', path: 'architecture.html', lastModified: '2025-12-20', status: 'published', description: 'Technical architecture' },
  { id: 'case-studies', name: 'Case Studies', path: 'case-studies.html', lastModified: '2025-12-15', status: 'published', description: 'Customer success stories' },
  { id: 'compliance', name: 'Compliance', path: 'resources/compliance.html', lastModified: '2025-12-23', status: 'published', description: 'Compliance frameworks' },
];

// =============================================================================
// COMPONENT
// =============================================================================

export const MarketingCMSPage: React.FC = () => {
  const { user } = useAuth();
  const [pages, setPages] = useState<MarketingPage[]>(MARKETING_PAGES);
  const [selectedPage, setSelectedPage] = useState<MarketingPage | null>(null);
  const [deployStatus, setDeployStatus] = useState<DeployStatus>({
    status: 'idle',
    lastDeploy: '2026-01-09T01:16:00Z',
    commitHash: 'f4a4d71',
    message: 'fix: Change compliance badges from compliant to ready',
  });
  const [isDeploying, setIsDeploying] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editContent, setEditContent] = useState('');

  // Check if user is OWNER
  const isOwner = user?.role === 'OWNER';

  // If not owner, show access denied
  if (!isOwner) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🔒</div>
          <h1 className="text-2xl font-bold text-white mb-2">Access Denied</h1>
          <p className="text-neutral-400">
            Only the platform owner (Stuart Rainey) can access the Marketing CMS.
          </p>
          <p className="text-neutral-500 text-sm mt-4">
            Your role: {user?.role || 'Unknown'}
          </p>
        </div>
      </div>
    );
  }

  const handleDeploy = async () => {
    setIsDeploying(true);
    setDeployStatus(prev => ({ ...prev, status: 'building' }));
    
    // Simulate deploy (replace with actual Netlify/GitHub API call)
    setTimeout(() => {
      setDeployStatus({
        status: 'deployed',
        lastDeploy: new Date().toISOString(),
        commitHash: 'abc1234',
        message: 'Manual deploy from Admin CMS',
      });
      setIsDeploying(false);
    }, 3000);
  };

  const handleEditPage = (page: MarketingPage) => {
    setSelectedPage(page);
    setEditMode(true);
    // In real implementation, fetch content from GitHub
    setEditContent(`<!-- Content for ${page.name} -->\n\n<h1>${page.name}</h1>\n<p>Edit this content...</p>`);
  };

  const handleSaveContent = async () => {
    if (!selectedPage) {return;}
    
    // In real implementation, commit to GitHub
    console.log('Saving content for:', selectedPage.path);
    console.log('Content:', editContent);
    
    // Update local state
    setPages(prev => prev.map(p => 
      p.id === selectedPage.id 
        ? { ...p, lastModified: new Date().toISOString().split('T')[0], status: 'pending' as const }
        : p
    ));
    
    setEditMode(false);
    setSelectedPage(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            🌐 Marketing Website CMS
            <span className="px-2 py-0.5 bg-amber-500/20 text-amber-400 text-xs rounded-full">
              OWNER ONLY
            </span>
          </h1>
          <p className="text-neutral-400 mt-1">
            Manage datacendia.com content • Hosted on Namecheap • Source: GitHub
          </p>
        </div>
        <div className="flex items-center gap-3">
          <a
            href="https://datacendia.com"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 bg-neutral-700 hover:bg-neutral-600 text-white rounded-lg text-sm transition-colors"
          >
            View Live Site →
          </a>
          <button
            onClick={handleDeploy}
            disabled={isDeploying}
            className={cn(
              'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
              isDeploying
                ? 'bg-amber-600 text-white cursor-wait'
                : 'bg-emerald-600 hover:bg-emerald-500 text-white'
            )}
          >
            {isDeploying ? '🔄 Deploying...' : '🚀 Deploy to Production'}
          </button>
        </div>
      </div>

      {/* Deploy Status */}
      <div className={cn(
        'p-4 rounded-xl border',
        deployStatus.status === 'deployed' ? 'bg-emerald-900/20 border-emerald-500/30' :
        deployStatus.status === 'building' ? 'bg-amber-900/20 border-amber-500/30' :
        deployStatus.status === 'failed' ? 'bg-red-900/20 border-red-500/30' :
        'bg-neutral-800 border-neutral-700'
      )}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">
              {deployStatus.status === 'deployed' ? '✅' :
               deployStatus.status === 'building' ? '🔄' :
               deployStatus.status === 'failed' ? '❌' : '⏸️'}
            </span>
            <div>
              <p className="text-white font-medium">
                {deployStatus.status === 'deployed' ? 'Site is Live' :
                 deployStatus.status === 'building' ? 'Building...' :
                 deployStatus.status === 'failed' ? 'Deploy Failed' : 'Ready to Deploy'}
              </p>
              <p className="text-neutral-400 text-sm">
                Last deploy: {new Date(deployStatus.lastDeploy).toLocaleString()}
              </p>
            </div>
          </div>
          {deployStatus.commitHash && (
            <div className="text-right">
              <p className="text-neutral-500 text-xs font-mono">{deployStatus.commitHash}</p>
              <p className="text-neutral-400 text-sm">{deployStatus.message}</p>
            </div>
          )}
        </div>
      </div>

      {/* Edit Mode */}
      {editMode && selectedPage && (
        <div className="bg-neutral-800 rounded-xl border border-neutral-700 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-white">
              Editing: {selectedPage.name}
            </h2>
            <div className="flex gap-2">
              <button
                onClick={() => { setEditMode(false); setSelectedPage(null); }}
                className="px-4 py-2 bg-neutral-700 hover:bg-neutral-600 text-white rounded-lg text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveContent}
                className="px-4 py-2 bg-primary-600 hover:bg-primary-500 text-white rounded-lg text-sm"
              >
                💾 Save & Commit
              </button>
            </div>
          </div>
          <textarea
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            className="w-full h-96 bg-neutral-900 border border-neutral-600 rounded-lg p-4 text-white font-mono text-sm resize-none focus:outline-none focus:border-primary-500"
            placeholder="Enter HTML content..."
          />
          <p className="text-neutral-500 text-xs mt-2">
            ⚠️ Changes will be committed to GitHub and require a deploy to go live.
          </p>
        </div>
      )}

      {/* Pages Grid */}
      {!editMode && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {pages.map((page) => (
            <div
              key={page.id}
              className="bg-neutral-800 rounded-xl border border-neutral-700 p-4 hover:border-neutral-600 transition-colors"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="text-white font-medium">{page.name}</h3>
                  <p className="text-neutral-500 text-xs font-mono">{page.path}</p>
                </div>
                <span className={cn(
                  'px-2 py-0.5 rounded-full text-xs',
                  page.status === 'published' ? 'bg-emerald-500/20 text-emerald-400' :
                  page.status === 'pending' ? 'bg-amber-500/20 text-amber-400' :
                  'bg-neutral-600 text-neutral-300'
                )}>
                  {page.status}
                </span>
              </div>
              <p className="text-neutral-400 text-sm mb-3">{page.description}</p>
              <div className="flex items-center justify-between">
                <span className="text-neutral-500 text-xs">
                  Modified: {page.lastModified}
                </span>
                <div className="flex gap-2">
                  <a
                    href={`https://datacendia.com/${page.path}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1 bg-neutral-700 hover:bg-neutral-600 text-white rounded text-xs"
                  >
                    View
                  </a>
                  <button
                    onClick={() => handleEditPage(page)}
                    className="px-3 py-1 bg-primary-600 hover:bg-primary-500 text-white rounded text-xs"
                  >
                    Edit
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Quick Actions */}
      <div className="bg-neutral-800 rounded-xl border border-neutral-700 p-6">
        <h2 className="text-lg font-semibold text-white mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button className="p-4 bg-neutral-700 hover:bg-neutral-600 rounded-lg text-left transition-colors">
            <span className="text-2xl">📊</span>
            <p className="text-white font-medium mt-2">View Analytics</p>
            <p className="text-neutral-400 text-xs">Google Analytics</p>
          </button>
          <button className="p-4 bg-neutral-700 hover:bg-neutral-600 rounded-lg text-left transition-colors">
            <span className="text-2xl">🔍</span>
            <p className="text-white font-medium mt-2">SEO Check</p>
            <p className="text-neutral-400 text-xs">Meta tags & sitemap</p>
          </button>
          <button className="p-4 bg-neutral-700 hover:bg-neutral-600 rounded-lg text-left transition-colors">
            <span className="text-2xl">🌍</span>
            <p className="text-white font-medium mt-2">Translations</p>
            <p className="text-neutral-400 text-xs">11 languages</p>
          </button>
          <button className="p-4 bg-neutral-700 hover:bg-neutral-600 rounded-lg text-left transition-colors">
            <span className="text-2xl">📝</span>
            <p className="text-white font-medium mt-2">Changelog</p>
            <p className="text-neutral-400 text-xs">Recent updates</p>
          </button>
        </div>
      </div>

      {/* Hosting Info */}
      <div className="bg-neutral-800/50 rounded-xl border border-neutral-700 p-4">
        <div className="flex items-center gap-4 text-sm text-neutral-400">
          <span>🏠 Hosted: <strong className="text-white">Namecheap</strong></span>
          <span>•</span>
          <span>📦 Source: <strong className="text-white">GitHub (datacendia-marketing)</strong></span>
          <span>•</span>
          <span>🚀 Deploy: <strong className="text-white">Netlify</strong></span>
          <span>•</span>
          <span>🔒 SSL: <strong className="text-emerald-400">Active</strong></span>
        </div>
      </div>
    </div>
  );
};

export default MarketingCMSPage;
