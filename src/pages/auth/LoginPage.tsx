// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

// =============================================================================
// DATACENDIA - LOGIN PAGE
// Premium sovereign branding with enterprise SSO
// =============================================================================

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { cn } from '../../../lib/utils';
import { authApi } from '../../lib/api';
import { useI18n } from '../../lib/i18n';
import { LanguageSwitcher } from '../../components/i18n/LanguageSwitcher';

// Inline SVG icons for SSO methods (no emoji)
const SSOIcons = {
  ad: (
    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="3" y="3" width="18" height="18" rx="3" />
      <path d="M3 9h18M9 3v18" />
    </svg>
  ),
  saml: (
    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="5" y="11" width="14" height="10" rx="2" />
      <path d="M12 11V7a4 4 0 0 1 8 0v4" />
      <circle cx="12" cy="16" r="1.5" />
    </svg>
  ),
  oidc: (
    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="12" cy="12" r="3" />
      <path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83" />
    </svg>
  ),
  cert: (
    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M12 2L3 7v5c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-9-5z" />
      <path d="M9 12l2 2 4-4" />
    </svg>
  ),
};

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useI18n();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await authApi.login({ email, password });

      if (response.success) {
        navigate('/cortex/dashboard');
      } else {
        setError(response.error?.message || t('auth.login.errors.invalidCredentials'));
      }
    } catch (err) {
      setError(t('auth.login.errors.networkError'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleEnterpriseSSO = (method: 'ad' | 'saml' | 'oidc' | 'cert') => {
    console.log(`Enterprise SSO: ${method}`);
  };

  return (
    <div className="min-h-screen flex bg-[#0a0a0c]">
      {/* Left Panel — Brand Statement */}
      <div className="hidden lg:flex lg:w-[55%] relative overflow-hidden">
        {/* Subtle grid background */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#0a0a0c] via-[#0f0f14] to-[#0a0a0c]" />
        {/* Gold accent line */}
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#c9a84c]/30 to-transparent" />

        <div className="relative z-10 flex flex-col justify-between p-14 w-full">
          {/* Logo */}
          <div>
            <span
              style={{
                fontFamily: "'Georgia', 'Times New Roman', serif",
                letterSpacing: '0.3em',
                fontWeight: 400,
                fontSize: '22px',
                color: '#e8e4e0',
              }}
            >
              DATACEND<span style={{ color: '#c9a84c' }}>!</span>A
            </span>
          </div>

          {/* Hero Statement */}
          <div className="max-w-lg">
            <p className="text-[10px] text-[#c9a84c] uppercase tracking-[0.4em] mb-6 font-medium">
              Sovereign Intelligence Platform
            </p>
            <h1 className="text-4xl font-light text-white leading-[1.3] mb-3">
              Your decisions.
            </h1>
            <h1 className="text-4xl font-light text-white leading-[1.3] mb-3">
              Your infrastructure.
            </h1>
            <h1 className="text-4xl font-light text-[#c9a84c]/80 leading-[1.3] mb-8">
              Your proof.
            </h1>
            <p className="text-gray-500 text-sm leading-relaxed max-w-md">
              Multi-agent deliberation with cryptographic audit trails.
              Deploy on-premises, private cloud, or air-gapped.
              Every decision is explainable, defensible, and yours.
            </p>

            {/* Trust indicators */}
            <div className="flex items-center gap-8 mt-10">
              {[
                { value: '40+', label: 'AI Agents' },
                { value: '11', label: 'Sovereign Patterns' },
                { value: '10+', label: 'Compliance Frameworks' },
              ].map((stat) => (
                <div key={stat.label}>
                  <div className="text-2xl font-light text-white">{stat.value}</div>
                  <div className="text-[10px] text-gray-600 uppercase tracking-wider mt-1">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom */}
          <div className="flex items-center gap-4 text-[11px] text-gray-700">
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500/60" />
              Air-Gap Ready
            </span>
            <span className="text-gray-800">·</span>
            <span>Zero Vendor Cloud Dependency</span>
            <span className="text-gray-800">·</span>
            <span>Your Keys, Your Ledger</span>
          </div>
        </div>
      </div>

      {/* Right Panel — Login Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-[#0e0e12] lg:border-l lg:border-gray-800/50">
        <div className="w-full max-w-sm">
          {/* Mobile Logo */}
          <div className="lg:hidden flex justify-center mb-10">
            <span
              style={{
                fontFamily: "'Georgia', 'Times New Roman', serif",
                letterSpacing: '0.3em',
                fontWeight: 400,
                fontSize: '20px',
                color: '#e8e4e0',
              }}
            >
              DATACEND<span style={{ color: '#c9a84c' }}>!</span>A
            </span>
          </div>

          <div className="mb-8">
            <h2 className="text-xl font-light text-white tracking-wide">{t('auth.login.title')}</h2>
            <p className="text-gray-600 mt-1.5 text-sm">{t('auth.login.subtitle')}</p>
          </div>

          {/* Enterprise SSO */}
          <div className="space-y-2 mb-6">
            <p className="text-[10px] text-gray-700 uppercase tracking-wider mb-1">Enterprise SSO <span className="text-[#c9a84c]/50">— Configure per deployment</span></p>
            {[
              { method: 'ad' as const, label: 'Active Directory', sub: 'LDAP / Kerberos' },
              { method: 'saml' as const, label: 'SAML 2.0', sub: 'Okta / ADFS / Ping' },
              { method: 'oidc' as const, label: 'OpenID Connect', sub: 'Keycloak / Dex' },
              { method: 'cert' as const, label: 'Certificate Auth', sub: 'PKI / Smart Card' },
            ].map((sso) => (
              <button
                key={sso.method}
                onClick={() => handleEnterpriseSSO(sso.method)}
                className="w-full flex items-center gap-3 h-11 px-4 bg-white/[0.03] border border-gray-800/60 rounded-lg text-gray-400 hover:bg-white/[0.06] hover:border-[#c9a84c]/30 hover:text-gray-300 transition-all group"
              >
                <span className="text-gray-600 group-hover:text-[#c9a84c]/70 transition-colors">
                  {SSOIcons[sso.method]}
                </span>
                <span className="text-sm font-medium">{sso.label}</span>
                <span className="text-[10px] text-gray-700 ml-auto">{sso.sub}</span>
              </button>
            ))}
          </div>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-800/60" />
            </div>
            <div className="relative flex justify-center">
              <span className="px-3 bg-[#0e0e12] text-[11px] text-gray-700 uppercase tracking-wider">
                or sign in with email
              </span>
            </div>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div
                role="alert"
                data-testid="error-message"
                className="p-3 bg-red-950/30 border border-red-900/40 rounded-lg text-sm text-red-400"
              >
                {error}
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-[11px] font-medium text-gray-500 uppercase tracking-wider mb-1.5">
                {t('auth.login.email')}
              </label>
              <input
                id="email"
                data-testid="email-input"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full h-11 px-4 bg-white/[0.03] border border-gray-800/60 rounded-lg text-white placeholder-gray-700 focus:outline-none focus:ring-1 focus:ring-[#c9a84c]/40 focus:border-[#c9a84c]/40 transition-colors"
                placeholder="you@company.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-[11px] font-medium text-gray-500 uppercase tracking-wider mb-1.5">
                {t('auth.login.password')}
              </label>
              <input
                id="password"
                data-testid="password-input"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full h-11 px-4 bg-white/[0.03] border border-gray-800/60 rounded-lg text-white placeholder-gray-700 focus:outline-none focus:ring-1 focus:ring-[#c9a84c]/40 focus:border-[#c9a84c]/40 transition-colors"
                placeholder="••••••••"
              />
            </div>

            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-3.5 h-3.5 rounded border-gray-700 bg-transparent text-[#c9a84c] focus:ring-[#c9a84c]/40"
                />
                <span className="text-xs text-gray-500">{t('auth.login.rememberMe')}</span>
              </label>
              <Link to="/forgot-password" className="text-xs text-gray-500 hover:text-[#c9a84c]/70 transition-colors">
                {t('auth.login.forgotPassword')}
              </Link>
            </div>

            <button
              type="submit"
              data-testid="login-button"
              disabled={isLoading}
              className={cn(
                'w-full h-11 mt-2 font-medium rounded-lg text-sm',
                'bg-gradient-to-r from-[#c9a84c] to-[#b8963f] text-[#0a0a0c]',
                'hover:from-[#d4b55a] hover:to-[#c9a84c] transition-all',
                'disabled:opacity-50 disabled:cursor-not-allowed',
                'flex items-center justify-center shadow-lg shadow-[#c9a84c]/10'
              )}
            >
              {isLoading ? (
                <span className="w-5 h-5 border-2 border-[#0a0a0c] border-t-transparent rounded-full animate-spin" />
              ) : (
                t('auth.login.submitButton')
              )}
            </button>
          </form>

          {/* Request Access */}
          <div className="mt-8 text-center">
            <p className="text-xs text-gray-600">
              Don't have access?{' '}
              <Link to="/" className="text-[#c9a84c]/70 hover:text-[#c9a84c] transition-colors">
                Request Access →
              </Link>
            </p>
          </div>

          {/* Language Selector */}
          <div className="mt-6 flex justify-center">
            <LanguageSwitcher variant="compact" />
          </div>

          {/* Trust Footer */}
          <div className="mt-8 pt-6 border-t border-gray-800/30 text-center">
            <p className="text-[10px] text-gray-800 uppercase tracking-wider">
              SOC 2 · ISO 27001 · HIPAA · NIST 800-53
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
