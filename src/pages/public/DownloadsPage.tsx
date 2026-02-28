// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

// =============================================================================
// DATACENDIA - COMPREHENSIVE DOWNLOADS PAGE
// Enterprise Downloads for Windows, macOS, Linux, iOS, Android
// =============================================================================

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

// =============================================================================
// TYPES
// =============================================================================

type Platform = 'windows' | 'macos' | 'linux' | 'ios' | 'android';
type Architecture = 'x64' | 'arm64' | 'universal';

interface DownloadItem {
  id: string;
  platform: Platform;
  architecture: Architecture;
  version: string;
  size: string;
  filename: string;
  downloadUrl: string;
  checksum: string;
  releaseDate: string;
  minOsVersion: string;
  notes?: string;
}

interface ReleaseChannel {
  name: string;
  description: string;
  badge: string;
  badgeColor: string;
}

// =============================================================================
// CONSTANTS
// =============================================================================

const CURRENT_VERSION = '2.4.1';
const RELEASE_DATE = '2024-11-15';

const releaseChannels: Record<string, ReleaseChannel> = {
  stable: {
    name: 'Stable',
    description: 'Recommended for production use',
    badge: 'Recommended',
    badgeColor: 'bg-success-100 text-success-700',
  },
  beta: {
    name: 'Beta',
    description: 'Preview upcoming features',
    badge: 'Beta',
    badgeColor: 'bg-warning-100 text-warning-700',
  },
  nightly: {
    name: 'Nightly',
    description: 'Latest development builds',
    badge: 'Nightly',
    badgeColor: 'bg-neutral-100 text-neutral-700',
  },
};

const platformInfo: Record<Platform, { name: string; icon: string; color: string }> = {
  windows: { name: 'Windows', icon: '🪟', color: 'bg-blue-500' },
  macos: { name: 'macOS', icon: '🍎', color: 'bg-neutral-800' },
  linux: { name: 'Linux', icon: '🐧', color: 'bg-orange-500' },
  ios: { name: 'iOS', icon: '📱', color: 'bg-neutral-800' },
  android: { name: 'Android', icon: '🤖', color: 'bg-green-500' },
};

const downloads: DownloadItem[] = [
  // Windows
  {
    id: 'win-x64',
    platform: 'windows',
    architecture: 'x64',
    version: CURRENT_VERSION,
    size: '145 MB',
    filename: `Datacendia-${CURRENT_VERSION}-win-x64.exe`,
    downloadUrl: `/downloads/desktop/Datacendia-${CURRENT_VERSION}-win-x64.exe`,
    checksum: 'sha256:a1b2c3d4e5f6...',
    releaseDate: RELEASE_DATE,
    minOsVersion: 'Windows 10 (1903+)',
  },
  {
    id: 'win-arm64',
    platform: 'windows',
    architecture: 'arm64',
    version: CURRENT_VERSION,
    size: '142 MB',
    filename: `Datacendia-${CURRENT_VERSION}-win-arm64.exe`,
    downloadUrl: `/downloads/desktop/Datacendia-${CURRENT_VERSION}-win-arm64.exe`,
    checksum: 'sha256:b2c3d4e5f6a1...',
    releaseDate: RELEASE_DATE,
    minOsVersion: 'Windows 11 ARM',
  },
  // macOS
  {
    id: 'mac-universal',
    platform: 'macos',
    architecture: 'universal',
    version: CURRENT_VERSION,
    size: '168 MB',
    filename: `Datacendia-${CURRENT_VERSION}-mac-universal.dmg`,
    downloadUrl: `/downloads/desktop/Datacendia-${CURRENT_VERSION}-mac-universal.dmg`,
    checksum: 'sha256:c3d4e5f6a1b2...',
    releaseDate: RELEASE_DATE,
    minOsVersion: 'macOS 12.0+',
    notes: 'Universal binary for Intel and Apple Silicon',
  },
  {
    id: 'mac-x64',
    platform: 'macos',
    architecture: 'x64',
    version: CURRENT_VERSION,
    size: '152 MB',
    filename: `Datacendia-${CURRENT_VERSION}-mac-x64.dmg`,
    downloadUrl: `/downloads/desktop/Datacendia-${CURRENT_VERSION}-mac-x64.dmg`,
    checksum: 'sha256:d4e5f6a1b2c3...',
    releaseDate: RELEASE_DATE,
    minOsVersion: 'macOS 12.0+',
    notes: 'Intel Macs only',
  },
  {
    id: 'mac-arm64',
    platform: 'macos',
    architecture: 'arm64',
    version: CURRENT_VERSION,
    size: '148 MB',
    filename: `Datacendia-${CURRENT_VERSION}-mac-arm64.dmg`,
    downloadUrl: `/downloads/desktop/Datacendia-${CURRENT_VERSION}-mac-arm64.dmg`,
    checksum: 'sha256:e5f6a1b2c3d4...',
    releaseDate: RELEASE_DATE,
    minOsVersion: 'macOS 12.0+',
    notes: 'Apple Silicon (M1/M2/M3)',
  },
  // Linux
  {
    id: 'linux-x64-appimage',
    platform: 'linux',
    architecture: 'x64',
    version: CURRENT_VERSION,
    size: '152 MB',
    filename: `Datacendia-${CURRENT_VERSION}-linux-x64.AppImage`,
    downloadUrl: `/downloads/desktop/Datacendia-${CURRENT_VERSION}-linux-x64.AppImage`,
    checksum: 'sha256:f6a1b2c3d4e5...',
    releaseDate: RELEASE_DATE,
    minOsVersion: 'glibc 2.31+',
    notes: 'Universal Linux AppImage',
  },
  {
    id: 'linux-x64-deb',
    platform: 'linux',
    architecture: 'x64',
    version: CURRENT_VERSION,
    size: '148 MB',
    filename: `datacendia_${CURRENT_VERSION}_amd64.deb`,
    downloadUrl: `/downloads/desktop/datacendia_${CURRENT_VERSION}_amd64.deb`,
    checksum: 'sha256:a1b2c3d4e5f6...',
    releaseDate: RELEASE_DATE,
    minOsVersion: 'Ubuntu 20.04+ / Debian 11+',
  },
  {
    id: 'linux-x64-rpm',
    platform: 'linux',
    architecture: 'x64',
    version: CURRENT_VERSION,
    size: '150 MB',
    filename: `datacendia-${CURRENT_VERSION}.x86_64.rpm`,
    downloadUrl: `/downloads/desktop/datacendia-${CURRENT_VERSION}.x86_64.rpm`,
    checksum: 'sha256:b2c3d4e5f6a1...',
    releaseDate: RELEASE_DATE,
    minOsVersion: 'Fedora 36+ / RHEL 8+',
  },
  {
    id: 'linux-arm64-appimage',
    platform: 'linux',
    architecture: 'arm64',
    version: CURRENT_VERSION,
    size: '145 MB',
    filename: `Datacendia-${CURRENT_VERSION}-linux-arm64.AppImage`,
    downloadUrl: `/downloads/desktop/Datacendia-${CURRENT_VERSION}-linux-arm64.AppImage`,
    checksum: 'sha256:c3d4e5f6a1b2...',
    releaseDate: RELEASE_DATE,
    minOsVersion: 'glibc 2.31+',
    notes: 'ARM64/AArch64 systems',
  },
  // iOS
  {
    id: 'ios',
    platform: 'ios',
    architecture: 'universal',
    version: CURRENT_VERSION,
    size: '85 MB',
    filename: 'Datacendia iOS App',
    downloadUrl: 'https://apps.apple.com/app/datacendia/id123456789',
    checksum: '',
    releaseDate: RELEASE_DATE,
    minOsVersion: 'iOS 15.0+',
    notes: 'Available on App Store',
  },
  // Android
  {
    id: 'android',
    platform: 'android',
    architecture: 'universal',
    version: CURRENT_VERSION,
    size: '78 MB',
    filename: 'Datacendia Android App',
    downloadUrl: 'https://play.google.com/store/apps/details?id=com.datacendia.app',
    checksum: '',
    releaseDate: RELEASE_DATE,
    minOsVersion: 'Android 10+',
    notes: 'Available on Google Play',
  },
  {
    id: 'android-apk',
    platform: 'android',
    architecture: 'universal',
    version: CURRENT_VERSION,
    size: '82 MB',
    filename: `Datacendia-${CURRENT_VERSION}.apk`,
    downloadUrl: `/downloads/mobile/Datacendia-${CURRENT_VERSION}.apk`,
    checksum: 'sha256:d4e5f6a1b2c3...',
    releaseDate: RELEASE_DATE,
    minOsVersion: 'Android 10+',
    notes: 'Direct APK download',
  },
];

const systemRequirements = {
  windows: {
    minimum: {
      os: 'Windows 10 (version 1903+)',
      cpu: '2 GHz dual-core processor',
      ram: '4 GB RAM',
      storage: '500 MB available space',
      display: '1280 x 720 resolution',
    },
    recommended: {
      os: 'Windows 11',
      cpu: '2.5 GHz quad-core processor',
      ram: '8 GB RAM',
      storage: '1 GB available space',
      display: '1920 x 1080 resolution',
    },
  },
  macos: {
    minimum: {
      os: 'macOS 12.0 Monterey',
      cpu: 'Intel Core i5 or Apple M1',
      ram: '4 GB RAM',
      storage: '500 MB available space',
      display: '1280 x 800 resolution',
    },
    recommended: {
      os: 'macOS 14.0 Sonoma',
      cpu: 'Apple M1 Pro or better',
      ram: '8 GB RAM',
      storage: '1 GB available space',
      display: 'Retina display',
    },
  },
  linux: {
    minimum: {
      os: 'Ubuntu 20.04 / Debian 11 / Fedora 36',
      cpu: '2 GHz dual-core processor',
      ram: '4 GB RAM',
      storage: '500 MB available space',
      display: 'X11 or Wayland',
    },
    recommended: {
      os: 'Ubuntu 22.04 / Fedora 38',
      cpu: '2.5 GHz quad-core processor',
      ram: '8 GB RAM',
      storage: '1 GB available space',
      display: '1920 x 1080 resolution',
    },
  },
};

// =============================================================================
// COMPONENT
// =============================================================================

export const DownloadsPage: React.FC = () => {
  const navigate = useNavigate();
  const [selectedPlatform, setSelectedPlatform] = useState<Platform | 'all'>('all');
  const [selectedChannel, setSelectedChannel] = useState<'stable' | 'beta' | 'nightly'>('stable');
  const [detectedPlatform, setDetectedPlatform] = useState<Platform>('windows');

  // Detect user's platform
  useEffect(() => {
    const userAgent = navigator.userAgent.toLowerCase();
    if (userAgent.includes('win')) {
      setDetectedPlatform('windows');
    } else if (userAgent.includes('mac')) {
      setDetectedPlatform('macos');
    } else if (userAgent.includes('linux')) {
      setDetectedPlatform('linux');
    } else if (userAgent.includes('android')) {
      setDetectedPlatform('android');
    } else if (userAgent.includes('iphone') || userAgent.includes('ipad')) {
      setDetectedPlatform('ios');
    }
  }, []);

  const filteredDownloads =
    selectedPlatform === 'all'
      ? downloads
      : downloads.filter((d) => d.platform === selectedPlatform);

  const getDownloadsByPlatform = (platform: Platform) =>
    downloads.filter((d) => d.platform === platform);

  const handleDownload = (item: DownloadItem) => {
    // Track download analytics
    console.log(`Download initiated: ${item.filename}`);

    // For app store links, open in new tab
    if (item.downloadUrl.startsWith('http')) {
      window.open(item.downloadUrl, '_blank');
    } else {
      // For direct downloads, trigger download
      const link = document.createElement('a');
      link.href = item.downloadUrl;
      link.download = item.filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const recommendedDownload = downloads.find(
    (d) =>
      d.platform === detectedPlatform &&
      (d.architecture === 'universal' || d.architecture === 'x64')
  );

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header */}
      <header className="bg-white border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">D</span>
            </div>
            <span className="text-xl font-bold text-neutral-900">Datacendia</span>
          </Link>
          <nav className="flex items-center gap-6">
            <Link to="/product" className="text-neutral-600 hover:text-neutral-900">
              Product
            </Link>
            <Link to="/pricing" className="text-neutral-600 hover:text-neutral-900">
              Pricing
            </Link>
            <Link
              to="/login"
              className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
            >
              Sign In
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="bg-gradient-to-br from-primary-900 via-primary-800 to-primary-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold mb-4">Download Datacendia</h1>
          <p className="text-xl text-white/80 max-w-2xl mx-auto mb-8">
            Get Datacendia for your platform. Available for Windows, macOS, Linux, iOS, and Android.
          </p>
          <div className="flex items-center justify-center gap-2 text-sm text-white/60">
            <span>Current Version: {CURRENT_VERSION}</span>
            <span>•</span>
            <span>Released: {new Date(RELEASE_DATE).toLocaleDateString()}</span>
          </div>
        </div>
      </section>

      {/* Recommended Download */}
      {recommendedDownload && (
        <section className="py-12 bg-white border-b border-neutral-200">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-gradient-to-r from-primary-50 to-primary-100 rounded-2xl p-8 border border-primary-200">
              <div className="flex items-center gap-2 mb-4">
                <span className="px-2 py-1 bg-primary-600 text-white text-xs font-medium rounded">
                  Recommended for you
                </span>
              </div>
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center shadow-sm">
                    <span className="text-4xl">{platformInfo[detectedPlatform].icon}</span>
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-neutral-900">
                      Datacendia for {platformInfo[detectedPlatform].name}
                    </h2>
                    <p className="text-neutral-600">
                      Version {recommendedDownload.version} • {recommendedDownload.size} •{' '}
                      {recommendedDownload.architecture}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => handleDownload(recommendedDownload)}
                  className="px-8 py-4 bg-primary-600 text-white font-semibold rounded-xl hover:bg-primary-700 transition-colors shadow-lg shadow-primary-500/25 flex items-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                    />
                  </svg>
                  Download for {platformInfo[detectedPlatform].name}
                </button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Platform Tabs */}
      <section className="py-8 bg-white sticky top-0 z-10 border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 overflow-x-auto pb-2">
            <button
              onClick={() => setSelectedPlatform('all')}
              className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
                selectedPlatform === 'all'
                  ? 'bg-primary-600 text-white'
                  : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
              }`}
            >
              All Platforms
            </button>
            {(Object.keys(platformInfo) as Platform[]).map((platform) => (
              <button
                key={platform}
                onClick={() => setSelectedPlatform(platform)}
                className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors flex items-center gap-2 ${
                  selectedPlatform === platform
                    ? 'bg-primary-600 text-white'
                    : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                }`}
              >
                <span>{platformInfo[platform].icon}</span>
                {platformInfo[platform].name}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Downloads Grid */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {selectedPlatform === 'all' ? (
            // Show by platform sections
            <>
              {/* Desktop */}
              <div className="mb-12">
                <h2 className="text-2xl font-bold text-neutral-900 mb-6">Desktop Applications</h2>
                <div className="grid md:grid-cols-3 gap-6">
                  {['windows', 'macos', 'linux'].map((platform) => (
                    <div
                      key={platform}
                      className="bg-white rounded-xl border border-neutral-200 overflow-hidden"
                    >
                      <div className={`${platformInfo[platform as Platform].color} p-4`}>
                        <div className="flex items-center gap-3 text-white">
                          <span className="text-3xl">
                            {platformInfo[platform as Platform].icon}
                          </span>
                          <span className="text-xl font-semibold">
                            {platformInfo[platform as Platform].name}
                          </span>
                        </div>
                      </div>
                      <div className="p-4 space-y-3">
                        {getDownloadsByPlatform(platform as Platform).map((item) => (
                          <button
                            key={item.id}
                            onClick={() => handleDownload(item)}
                            className="w-full p-3 bg-neutral-50 rounded-lg hover:bg-neutral-100 transition-colors text-left flex items-center justify-between group"
                          >
                            <div>
                              <p className="font-medium text-neutral-900">{item.architecture}</p>
                              <p className="text-sm text-neutral-500">{item.size}</p>
                            </div>
                            <svg
                              className="w-5 h-5 text-neutral-400 group-hover:text-primary-600 transition-colors"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                              />
                            </svg>
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Mobile */}
              <div className="mb-12">
                <h2 className="text-2xl font-bold text-neutral-900 mb-6">Mobile Applications</h2>
                <div className="grid md:grid-cols-2 gap-6">
                  {['ios', 'android'].map((platform) => (
                    <div
                      key={platform}
                      className="bg-white rounded-xl border border-neutral-200 p-6"
                    >
                      <div className="flex items-center gap-4 mb-6">
                        <div
                          className={`w-16 h-16 ${platformInfo[platform as Platform].color} rounded-xl flex items-center justify-center`}
                        >
                          <span className="text-3xl">
                            {platformInfo[platform as Platform].icon}
                          </span>
                        </div>
                        <div>
                          <h3 className="text-xl font-semibold text-neutral-900">
                            {platformInfo[platform as Platform].name}
                          </h3>
                          <p className="text-neutral-500">Version {CURRENT_VERSION}</p>
                        </div>
                      </div>
                      <div className="space-y-3">
                        {getDownloadsByPlatform(platform as Platform).map((item) => (
                          <button
                            key={item.id}
                            onClick={() => handleDownload(item)}
                            className="w-full p-4 bg-neutral-50 rounded-lg hover:bg-neutral-100 transition-colors text-left flex items-center justify-between group"
                          >
                            <div>
                              <p className="font-medium text-neutral-900">
                                {item.notes || item.filename}
                              </p>
                              <p className="text-sm text-neutral-500">
                                {item.size} • {item.minOsVersion}
                              </p>
                            </div>
                            <span className="px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium group-hover:bg-primary-700 transition-colors">
                              {item.downloadUrl.startsWith('http') ? 'Get' : 'Download'}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : (
            // Show filtered downloads
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-neutral-900 mb-6">
                {platformInfo[selectedPlatform].icon} {platformInfo[selectedPlatform].name}{' '}
                Downloads
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                {filteredDownloads.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white rounded-xl border border-neutral-200 p-6 hover:border-primary-300 hover:shadow-md transition-all"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="font-semibold text-neutral-900">{item.filename}</h3>
                        <p className="text-sm text-neutral-500">
                          {item.architecture} • {item.size}
                        </p>
                      </div>
                      <span className="px-2 py-1 bg-success-100 text-success-700 text-xs font-medium rounded">
                        v{item.version}
                      </span>
                    </div>
                    {item.notes && <p className="text-sm text-neutral-600 mb-4">{item.notes}</p>}
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-neutral-500">Requires {item.minOsVersion}</span>
                      <button
                        onClick={() => handleDownload(item)}
                        className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors flex items-center gap-2"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                          />
                        </svg>
                        Download
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* CLI & Self-Hosted */}
      <section className="py-12 bg-white border-t border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8">
            {/* CLI */}
            <div>
              <h2 className="text-2xl font-bold text-neutral-900 mb-6">Command Line Interface</h2>
              <div className="bg-neutral-900 rounded-xl p-6 space-y-4">
                <div>
                  <p className="text-neutral-400 text-sm mb-2">npm</p>
                  <code className="block p-3 bg-neutral-800 text-green-400 rounded-lg text-sm font-mono">
                    npm install -g @datacendia/cli
                  </code>
                </div>
                <div>
                  <p className="text-neutral-400 text-sm mb-2">Homebrew (macOS/Linux)</p>
                  <code className="block p-3 bg-neutral-800 text-green-400 rounded-lg text-sm font-mono">
                    brew install datacendia/tap/datacendia
                  </code>
                </div>
                <div>
                  <p className="text-neutral-400 text-sm mb-2">curl (Linux/macOS)</p>
                  <code className="block p-3 bg-neutral-800 text-green-400 rounded-lg text-sm font-mono break-all">
                    curl -fsSL https://get.datacendia.com | sh
                  </code>
                </div>
                <div>
                  <p className="text-neutral-400 text-sm mb-2">PowerShell (Windows)</p>
                  <code className="block p-3 bg-neutral-800 text-green-400 rounded-lg text-sm font-mono break-all">
                    irm https://get.datacendia.com/ps1 | iex
                  </code>
                </div>
              </div>
            </div>

            {/* Self-Hosted */}
            <div>
              <h2 className="text-2xl font-bold text-neutral-900 mb-6">Self-Hosted Deployment</h2>
              <div className="space-y-4">
                <div className="bg-neutral-50 rounded-xl p-6 border border-neutral-200">
                  <div className="flex items-center gap-4 mb-4">
                    <span className="text-3xl">🐳</span>
                    <div>
                      <h3 className="font-semibold text-neutral-900">Docker Compose</h3>
                      <p className="text-sm text-neutral-500">Quick start for evaluation</p>
                    </div>
                  </div>
                  <button className="text-primary-600 hover:text-primary-700 font-medium text-sm">
                    View Documentation →
                  </button>
                </div>
                <div className="bg-neutral-50 rounded-xl p-6 border border-neutral-200">
                  <div className="flex items-center gap-4 mb-4">
                    <span className="text-3xl">☸️</span>
                    <div>
                      <h3 className="font-semibold text-neutral-900">Kubernetes (Helm)</h3>
                      <p className="text-sm text-neutral-500">Production-ready deployment</p>
                    </div>
                  </div>
                  <button className="text-primary-600 hover:text-primary-700 font-medium text-sm">
                    View Helm Charts →
                  </button>
                </div>
                <div className="bg-neutral-50 rounded-xl p-6 border border-neutral-200">
                  <div className="flex items-center gap-4 mb-4">
                    <span className="text-3xl">🔒</span>
                    <div>
                      <h3 className="font-semibold text-neutral-900">Air-Gapped Bundle</h3>
                      <p className="text-sm text-neutral-500">Completely isolated deployment</p>
                    </div>
                  </div>
                  <button className="text-primary-600 hover:text-primary-700 font-medium text-sm">
                    Contact Sales →
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* System Requirements */}
      <section className="py-12 border-t border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-neutral-900 mb-8 text-center">
            System Requirements
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {Object.entries(systemRequirements).map(([platform, reqs]) => (
              <div
                key={platform}
                className="bg-white rounded-xl border border-neutral-200 overflow-hidden"
              >
                <div className="bg-neutral-100 p-4 flex items-center gap-3">
                  <span className="text-2xl">{platformInfo[platform as Platform].icon}</span>
                  <span className="font-semibold text-neutral-900">
                    {platformInfo[platform as Platform].name}
                  </span>
                </div>
                <div className="p-4">
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-neutral-500 mb-2">Minimum</h4>
                    <ul className="text-sm text-neutral-600 space-y-1">
                      {Object.entries(reqs.minimum).map(([key, value]) => (
                        <li key={key}>
                          <span className="font-medium">{key}:</span> {value}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-neutral-500 mb-2">Recommended</h4>
                    <ul className="text-sm text-neutral-600 space-y-1">
                      {Object.entries(reqs.recommended).map(([key, value]) => (
                        <li key={key}>
                          <span className="font-medium">{key}:</span> {value}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Verification */}
      <section className="py-12 bg-neutral-900 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Verify Your Download</h2>
          <p className="text-neutral-400 mb-6">
            All downloads are cryptographically signed. Verify the SHA-256 checksum to ensure file
            integrity.
          </p>
          <div className="bg-neutral-800 rounded-lg p-4 text-left">
            <code className="text-green-400 text-sm font-mono break-all">
              sha256sum Datacendia-{CURRENT_VERSION}-*.* | grep -f checksums.txt
            </code>
          </div>
          <p className="text-sm text-neutral-500 mt-4">
            <a href="/downloads/checksums.txt" className="text-primary-400 hover:text-primary-300">
              Download checksums.txt
            </a>
            {' • '}
            <a href="/downloads/KEYS" className="text-primary-400 hover:text-primary-300">
              GPG Public Key
            </a>
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-neutral-200 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm text-neutral-500">
          <p>© {new Date().getFullYear()} Datacendia. All rights reserved.</p>
          <div className="flex items-center justify-center gap-4 mt-4">
            <Link to="/privacy" className="hover:text-neutral-900">
              Privacy Policy
            </Link>
            <Link to="/terms" className="hover:text-neutral-900">
              Terms of Service
            </Link>
            <Link to="/security" className="hover:text-neutral-900">
              Security
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default DownloadsPage;
