// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

// =============================================================================
// DATACENDIA - FORGOT PASSWORD PAGE (Fully Internationalized)
// Request password reset email
// =============================================================================

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { cn } from '../../../lib/utils';
import { api } from '../../lib/api/client';
import { useI18n } from '../../lib/i18n';
import { LanguageSwitcher } from '../../components/i18n/LanguageSwitcher';

export const ForgotPasswordPage: React.FC = () => {
  const { t } = useI18n();

  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const response = await api.post<{ message: string }>('/auth/forgot-password', { email });

      if (response.success) {
        setIsSubmitted(true);
      } else {
        // Always show success to prevent email enumeration
        setIsSubmitted(true);
      }
    } catch (err) {
      // Still show success to prevent email enumeration
      setIsSubmitted(true);
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen flex bg-[#0a0a0c]">
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
              <span style={{ fontFamily: "'Georgia', 'Times New Roman', serif", letterSpacing: '0.3em', fontWeight: 400, fontSize: '22px', color: '#e8e4e0' }}>
                DATACEND<span style={{ color: '#c9a84c' }}>!</span>A
              </span>
            </div>
            <div className="max-w-lg">
              <p className="text-[10px] text-[#c9a84c] uppercase tracking-[0.4em] mb-6 font-medium">Password Recovery</p>
              <h1 className="text-4xl font-light text-white leading-[1.3] mb-3">Check your inbox.</h1>
              <h1 className="text-4xl font-light text-[#c9a84c]/80 leading-[1.3] mb-8">We've got you.</h1>
              <p className="text-gray-500 text-sm leading-relaxed max-w-md">
                If an account exists with that email, a password reset link has been sent.
                Check your inbox and spam folder.
              </p>
            </div>
            <div className="flex items-center gap-4 text-[11px] text-gray-700">
              <span>Link expires in 1 hour</span>
              <span className="text-gray-800">·</span>
              <span>One-time use</span>
            </div>
          </div>
        </div>

        <div className="flex-1 flex items-center justify-center p-8 bg-[#0e0e12] lg:border-l lg:border-gray-800/50">
          <div className="w-full max-w-sm text-center">
            <div className="lg:hidden flex justify-center mb-10">
              <span style={{ fontFamily: "'Georgia', 'Times New Roman', serif", letterSpacing: '0.3em', fontWeight: 400, fontSize: '20px', color: '#e8e4e0' }}>
                DATACEND<span style={{ color: '#c9a84c' }}>!</span>A
              </span>
            </div>

            <div className="w-16 h-16 rounded-full bg-emerald-900/30 border border-emerald-800/40 flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>

            <h2 className="text-xl font-light text-white tracking-wide mb-2">
              {t('auth.forgotPassword.checkEmail')}
            </h2>
            <p className="text-gray-500 text-sm mb-2">
              {t('auth.forgotPassword.emailSentTo')}
            </p>
            <p className="text-[#c9a84c] text-sm font-mono mb-6">{email}</p>
            <p className="text-[10px] text-gray-700 mb-8">{t('auth.forgotPassword.linkExpiry')}</p>

            <Link
              to="/login"
              className={cn(
                'inline-flex items-center justify-center w-full h-11 font-medium rounded-lg text-sm',
                'bg-gradient-to-r from-[#c9a84c] to-[#b8963f] text-[#0a0a0c]',
                'hover:from-[#d4b55a] hover:to-[#c9a84c] transition-all',
                'shadow-lg shadow-[#c9a84c]/10'
              )}
            >
              {t('auth.forgotPassword.backToLogin')}
            </Link>

            <div className="mt-6">
              <p className="text-xs text-gray-600">
                Didn't receive it?{' '}
                <button
                  onClick={() => setIsSubmitted(false)}
                  className="text-[#c9a84c]/70 hover:text-[#c9a84c] transition-colors"
                >
                  Try again →
                </button>
              </p>
            </div>

            <div className="mt-8 pt-6 border-t border-gray-800/30 text-center">
              <p className="text-[10px] text-gray-800 uppercase tracking-wider">
                SOC 2 · ISO 27001 · HIPAA · NIST 800-53
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-[#0a0a0c]">
      {/* Left Panel */}
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
            <span style={{ fontFamily: "'Georgia', 'Times New Roman', serif", letterSpacing: '0.3em', fontWeight: 400, fontSize: '22px', color: '#e8e4e0' }}>
              DATACEND<span style={{ color: '#c9a84c' }}>!</span>A
            </span>
          </div>

          <div className="max-w-lg">
            <p className="text-[10px] text-[#c9a84c] uppercase tracking-[0.4em] mb-6 font-medium">Password Recovery</p>
            <h1 className="text-4xl font-light text-white leading-[1.3] mb-3">Forgot your password?</h1>
            <h1 className="text-4xl font-light text-[#c9a84c]/80 leading-[1.3] mb-8">We'll fix that.</h1>
            <p className="text-gray-500 text-sm leading-relaxed max-w-md">
              Enter the email address associated with your account and we'll
              send you a secure link to reset your password.
            </p>
          </div>

          <div className="flex items-center gap-4 text-[11px] text-gray-700">
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500/60" />
              Secure Reset
            </span>
            <span className="text-gray-800">·</span>
            <span>Anti-Enumeration Protected</span>
            <span className="text-gray-800">·</span>
            <span>1-Hour Expiry</span>
          </div>
        </div>
      </div>

      {/* Right Panel */}
      <div className="flex-1 flex items-center justify-center p-8 bg-[#0e0e12] lg:border-l lg:border-gray-800/50">
        <div className="w-full max-w-sm">
          <div className="lg:hidden flex justify-center mb-10">
            <span style={{ fontFamily: "'Georgia', 'Times New Roman', serif", letterSpacing: '0.3em', fontWeight: 400, fontSize: '20px', color: '#e8e4e0' }}>
              DATACEND<span style={{ color: '#c9a84c' }}>!</span>A
            </span>
          </div>

          <div className="mb-8">
            <h2 className="text-xl font-light text-white tracking-wide">{t('auth.forgotPassword.title')}</h2>
            <p className="text-gray-600 mt-1.5 text-sm">{t('auth.forgotPassword.subtitle')}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div role="alert" className="p-3 bg-red-950/30 border border-red-900/40 rounded-lg text-sm text-red-400">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-[11px] font-medium text-gray-500 uppercase tracking-wider mb-1.5">
                {t('auth.login.email')}
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                required
                className="w-full h-11 px-4 bg-white/[0.03] border border-gray-800/60 rounded-lg text-white placeholder-gray-700 focus:outline-none focus:ring-1 focus:ring-[#c9a84c]/40 focus:border-[#c9a84c]/40 transition-colors"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading || !email}
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
                t('auth.forgotPassword.sendResetLink')
              )}
            </button>
          </form>

          <div className="mt-8 text-center space-y-2">
            <p className="text-xs text-gray-600">
              Remember your password?{' '}
              <Link to="/login" className="text-[#c9a84c]/70 hover:text-[#c9a84c] transition-colors">
                Sign in →
              </Link>
            </p>
            <p className="text-xs text-gray-600">
              Can't remember your email?{' '}
              <Link to="/find-account" className="text-[#c9a84c]/70 hover:text-[#c9a84c] transition-colors">
                Find my account →
              </Link>
            </p>
          </div>

          <div className="mt-6 flex justify-center">
            <LanguageSwitcher variant="compact" />
          </div>

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

export default ForgotPasswordPage;
