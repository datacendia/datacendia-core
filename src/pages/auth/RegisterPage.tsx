// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

// =============================================================================
// DATACENDIA - REGISTER PAGE (Fully Internationalized)
// =============================================================================

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { cn } from '../../../lib/utils';
import { authApi } from '../../lib/api';
import { useI18n } from '../../lib/i18n';
import { LanguageSwitcher } from '../../components/i18n/LanguageSwitcher';

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useI18n();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    company: '',
    acceptTerms: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [step, setStep] = useState<1 | 2>(1);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  // List of personal email domains that are not allowed
  const personalEmailDomains = [
    'gmail.com',
    'yahoo.com',
    'hotmail.com',
    'outlook.com',
    'aol.com',
    'icloud.com',
    'mail.com',
    'protonmail.com',
    'zoho.com',
    'yandex.com',
    'gmx.com',
    'live.com',
    'msn.com',
    'me.com',
    'qq.com',
    '163.com',
  ];

  const isWorkEmail = (email: string): boolean => {
    const domain = email.split('@')[1]?.toLowerCase();
    return !!domain && !personalEmailDomains.includes(domain);
  };

  const validateStep1 = () => {
    if (!formData.firstName || !formData.lastName) {
      setError(t('auth.register.errors.fullNameRequired'));
      return false;
    }
    if (!formData.email || !formData.email.includes('@')) {
      setError(t('auth.register.errors.validEmailRequired'));
      return false;
    }
    setError('');
    return true;
  };

  const validateStep2 = () => {
    if (formData.password.length < 8) {
      setError(t('auth.register.errors.passwordMinLength'));
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setError(t('auth.register.errors.passwordMismatch'));
      return false;
    }
    if (!formData.acceptTerms) {
      setError(t('auth.register.errors.acceptTerms'));
      return false;
    }
    setError('');
    return true;
  };

  const handleNextStep = () => {
    if (validateStep1()) {
      setStep(2);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep2()) {
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await authApi.register({
        email: formData.email,
        password: formData.password,
        name: `${formData.firstName} ${formData.lastName}`,
        ...(formData.company ? { organizationName: formData.company } : {}),
      });

      if (response.success) {
        navigate('/cortex/dashboard');
      } else {
        setError(response.error?.message || t('auth.register.errors.registrationFailed'));
      }
    } catch (err) {
      setError(t('auth.login.errors.networkError'));
    } finally {
      setIsLoading(false);
    }
  };

  // Registration handled during on-site deployment setup
  // No cloud OAuth - enterprise identity configured per-deployment

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
              Get started.
            </h1>
            <h1 className="text-4xl font-light text-white leading-[1.3] mb-3">
              Own your decisions.
            </h1>
            <h1 className="text-4xl font-light text-[#c9a84c]/80 leading-[1.3] mb-8">
              Own your proof.
            </h1>
            <p className="text-gray-500 text-sm leading-relaxed max-w-md">
              Create your account to deploy sovereign AI decision intelligence
              on your infrastructure. No cloud dependencies. Every decision
              is explainable, defensible, and yours.
            </p>

            {/* Trust indicators */}
            <div className="flex items-center gap-8 mt-10">
              {[
                { value: '29', label: 'Industry Verticals' },
                { value: '260', label: 'Database Models' },
                { value: '40+', label: 'AI Agents' },
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

      {/* Right Panel — Registration Form */}
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
            <h2 className="text-xl font-light text-white tracking-wide">Create Account</h2>
            <p className="text-gray-600 mt-1.5 text-sm">
              {step === 1 ? 'Enter your details to get started' : 'Set your password'}
            </p>
          </div>

          {/* Progress indicator */}
          <div className="flex items-center gap-2 mb-6">
            <div
              className={cn(
                'flex-1 h-1 rounded-full transition-colors',
                step >= 1 ? 'bg-[#c9a84c]' : 'bg-gray-800/60'
              )}
            />
            <div
              className={cn(
                'flex-1 h-1 rounded-full transition-colors',
                step >= 2 ? 'bg-[#c9a84c]' : 'bg-gray-800/60'
              )}
            />
          </div>

          {/* Form */}
          <form
            onSubmit={
              step === 2
                ? handleSubmit
                : (e) => {
                    e.preventDefault();
                    handleNextStep();
                  }
            }
            className="space-y-4"
          >
            {error && (
              <div
                role="alert"
                className="p-3 bg-red-950/30 border border-red-900/40 rounded-lg text-sm text-red-400"
              >
                {error}
              </div>
            )}

            {step === 1 ? (
              <>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-medium text-gray-500 uppercase tracking-wider mb-1.5">
                      {t('auth.register.firstName')}
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      required
                      className="w-full h-11 px-4 bg-white/[0.03] border border-gray-800/60 rounded-lg text-white placeholder-gray-700 focus:outline-none focus:ring-1 focus:ring-[#c9a84c]/40 focus:border-[#c9a84c]/40 transition-colors"
                      placeholder="John"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-gray-500 uppercase tracking-wider mb-1.5">
                      {t('auth.register.lastName')}
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      required
                      className="w-full h-11 px-4 bg-white/[0.03] border border-gray-800/60 rounded-lg text-white placeholder-gray-700 focus:outline-none focus:ring-1 focus:ring-[#c9a84c]/40 focus:border-[#c9a84c]/40 transition-colors"
                      placeholder="Doe"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-gray-500 uppercase tracking-wider mb-1.5">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full h-11 px-4 bg-white/[0.03] border border-gray-800/60 rounded-lg text-white placeholder-gray-700 focus:outline-none focus:ring-1 focus:ring-[#c9a84c]/40 focus:border-[#c9a84c]/40 transition-colors"
                    placeholder="you@company.com"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-gray-500 uppercase tracking-wider mb-1.5">
                    Organization
                  </label>
                  <input
                    type="text"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    className="w-full h-11 px-4 bg-white/[0.03] border border-gray-800/60 rounded-lg text-white placeholder-gray-700 focus:outline-none focus:ring-1 focus:ring-[#c9a84c]/40 focus:border-[#c9a84c]/40 transition-colors"
                    placeholder="Acme Inc."
                  />
                </div>

                <button
                  type="submit"
                  className={cn(
                    'w-full h-11 mt-2 font-medium rounded-lg text-sm',
                    'bg-gradient-to-r from-[#c9a84c] to-[#b8963f] text-[#0a0a0c]',
                    'hover:from-[#d4b55a] hover:to-[#c9a84c] transition-all',
                    'flex items-center justify-center shadow-lg shadow-[#c9a84c]/10'
                  )}
                >
                  Continue
                </button>
              </>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="flex items-center gap-1 text-sm text-gray-500 hover:text-[#c9a84c] mb-2 transition-colors"
                >
                  ← Back
                </button>

                <div>
                  <label className="block text-[11px] font-medium text-gray-500 uppercase tracking-wider mb-1.5">
                    {t('auth.register.password')}
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className="w-full h-11 px-4 bg-white/[0.03] border border-gray-800/60 rounded-lg text-white placeholder-gray-700 focus:outline-none focus:ring-1 focus:ring-[#c9a84c]/40 focus:border-[#c9a84c]/40 transition-colors"
                    placeholder="••••••••"
                  />
                  <p className="text-[10px] text-gray-700 mt-1">Minimum 8 characters</p>
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-gray-500 uppercase tracking-wider mb-1.5">
                    {t('auth.register.confirmPassword')}
                  </label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                    className="w-full h-11 px-4 bg-white/[0.03] border border-gray-800/60 rounded-lg text-white placeholder-gray-700 focus:outline-none focus:ring-1 focus:ring-[#c9a84c]/40 focus:border-[#c9a84c]/40 transition-colors"
                    placeholder="••••••••"
                  />
                </div>

                <label className="flex items-start gap-3 cursor-pointer pt-1">
                  <input
                    type="checkbox"
                    name="acceptTerms"
                    checked={formData.acceptTerms}
                    onChange={handleChange}
                    className="w-3.5 h-3.5 mt-0.5 rounded border-gray-700 bg-transparent text-[#c9a84c] focus:ring-[#c9a84c]/40"
                  />
                  <span className="text-xs text-gray-500">
                    I agree to the{' '}
                    <Link to="/terms" className="text-[#c9a84c]/70 hover:text-[#c9a84c] transition-colors">
                      Terms of Service
                    </Link>{' '}
                    and{' '}
                    <Link to="/privacy" className="text-[#c9a84c]/70 hover:text-[#c9a84c] transition-colors">
                      Privacy Policy
                    </Link>
                  </span>
                </label>

                <button
                  type="submit"
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
                    'Create Account'
                  )}
                </button>
              </>
            )}
          </form>

          {/* Sign In Link */}
          <div className="mt-8 text-center">
            <p className="text-xs text-gray-600">
              Already have an account?{' '}
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

export default RegisterPage;
