// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

// =============================================================================
// DATACENDIA - FIND MY ACCOUNT PAGE
// Helps users recover their email address by name + organization lookup
// =============================================================================

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { cn } from '../../../lib/utils';
import { authApi } from '../../lib/api';
import { LanguageSwitcher } from '../../components/i18n/LanguageSwitcher';

interface FoundAccount {
  name: string;
  maskedEmail: string;
}

export const FindAccountPage: React.FC = () => {
  const [name, setName] = useState('');
  const [organizationName, setOrganizationName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [results, setResults] = useState<FoundAccount[] | null>(null);
  const [resultMessage, setResultMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setResults(null);
    setIsLoading(true);

    try {
      const response = await authApi.findAccount({ name, organizationName });

      if (response.success && response.data) {
        setResults(response.data.accounts);
        setResultMessage(response.data.message);
      } else {
        setError(response.error?.message || 'Something went wrong. Please try again.');
      }
    } catch (err) {
      setError('Unable to reach the server. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-[#0a0a0c]">
      {/* Left Panel — Brand Statement */}
      <div className="hidden lg:flex lg:w-[55%] relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-[#0a0a0c] via-[#0f0f14] to-[#0a0a0c]" />
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#c9a84c]/30 to-transparent" />

        <div className="relative z-10 flex flex-col justify-between p-14 w-full">
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

          <div className="max-w-lg">
            <p className="text-[10px] text-[#c9a84c] uppercase tracking-[0.4em] mb-6 font-medium">
              Account Recovery
            </p>
            <h1 className="text-4xl font-light text-white leading-[1.3] mb-3">
              Find your account.
            </h1>
            <h1 className="text-4xl font-light text-[#c9a84c]/80 leading-[1.3] mb-8">
              Get back in.
            </h1>
            <p className="text-gray-500 text-sm leading-relaxed max-w-md">
              Can't remember which email you used? Enter your name and
              organization and we'll show you the email on file — partially
              masked for security.
            </p>
          </div>

          <div className="flex items-center gap-4 text-[11px] text-gray-700">
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500/60" />
              Privacy Protected
            </span>
            <span className="text-gray-800">·</span>
            <span>Rate Limited</span>
            <span className="text-gray-800">·</span>
            <span>Masked Results</span>
          </div>
        </div>
      </div>

      {/* Right Panel — Find Account Form */}
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
            <h2 className="text-xl font-light text-white tracking-wide">Find My Account</h2>
            <p className="text-gray-600 mt-1.5 text-sm">
              Enter your name and organization to look up your email
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div
                role="alert"
                className="p-3 bg-red-950/30 border border-red-900/40 rounded-lg text-sm text-red-400"
              >
                {error}
              </div>
            )}

            <div>
              <label className="block text-[11px] font-medium text-gray-500 uppercase tracking-wider mb-1.5">
                Your Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full h-11 px-4 bg-white/[0.03] border border-gray-800/60 rounded-lg text-white placeholder-gray-700 focus:outline-none focus:ring-1 focus:ring-[#c9a84c]/40 focus:border-[#c9a84c]/40 transition-colors"
                placeholder="John Doe"
              />
            </div>

            <div>
              <label className="block text-[11px] font-medium text-gray-500 uppercase tracking-wider mb-1.5">
                Organization Name
              </label>
              <input
                type="text"
                value={organizationName}
                onChange={(e) => setOrganizationName(e.target.value)}
                required
                className="w-full h-11 px-4 bg-white/[0.03] border border-gray-800/60 rounded-lg text-white placeholder-gray-700 focus:outline-none focus:ring-1 focus:ring-[#c9a84c]/40 focus:border-[#c9a84c]/40 transition-colors"
                placeholder="Acme Inc."
              />
            </div>

            <button
              type="submit"
              disabled={isLoading || !name || !organizationName}
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
                'Look Up Account'
              )}
            </button>
          </form>

          {/* Results */}
          {results !== null && (
            <div className="mt-6">
              {results.length > 0 ? (
                <div className="space-y-3">
                  <p className="text-sm text-gray-400">{resultMessage}</p>
                  {results.map((account, idx) => (
                    <div
                      key={idx}
                      className="p-4 bg-white/[0.03] border border-[#c9a84c]/20 rounded-lg"
                    >
                      <p className="text-sm text-white font-medium">{account.name}</p>
                      <p className="text-sm text-[#c9a84c] mt-1 font-mono">{account.maskedEmail}</p>
                    </div>
                  ))}
                  <div className="flex gap-3 mt-4">
                    <Link
                      to="/login"
                      className={cn(
                        'flex-1 h-10 font-medium rounded-lg text-sm',
                        'bg-gradient-to-r from-[#c9a84c] to-[#b8963f] text-[#0a0a0c]',
                        'hover:from-[#d4b55a] hover:to-[#c9a84c] transition-all',
                        'flex items-center justify-center'
                      )}
                    >
                      Sign In
                    </Link>
                    <Link
                      to="/forgot-password"
                      className="flex-1 h-10 font-medium rounded-lg text-sm border border-gray-800/60 text-gray-400 hover:text-white hover:border-[#c9a84c]/30 transition-all flex items-center justify-center"
                    >
                      Reset Password
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="p-4 bg-white/[0.03] border border-gray-800/60 rounded-lg text-center">
                  <p className="text-sm text-gray-400">{resultMessage}</p>
                  <Link
                    to="/register"
                    className="inline-block mt-3 text-sm text-[#c9a84c]/70 hover:text-[#c9a84c] transition-colors"
                  >
                    Create a new account →
                  </Link>
                </div>
              )}
            </div>
          )}

          {/* Back to Login */}
          <div className="mt-8 text-center">
            <p className="text-xs text-gray-600">
              Remember your email?{' '}
              <Link to="/login" className="text-[#c9a84c]/70 hover:text-[#c9a84c] transition-colors">
                Sign in →
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

export default FindAccountPage;
