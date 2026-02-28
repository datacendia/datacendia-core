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
    if (!isWorkEmail(formData.email)) {
      setError('Please use your work email address. Personal email domains are not accepted.');
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
    <div className="min-h-screen flex bg-sovereign-base">
      {/* Left Panel - Sovereign Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-sovereign-elevated border-r border-sovereign-border-subtle p-12 flex-col justify-between">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-crimson-900/30 rounded-lg flex items-center justify-center border border-crimson-800/50">
              <span className="text-crimson-400 font-bold text-xl">D</span>
            </div>
            <span className="text-white text-xl font-semibold tracking-wider">DATACENDIA</span>
          </div>
        </div>

        <div>
          <p className="text-xs text-gray-600 uppercase tracking-[0.3em] mb-4">
            Sovereign Intelligence Platform
          </p>
          <h1 className="text-3xl font-light text-white mb-6">Request Platform Access</h1>
          <p className="text-gray-400 mb-8">
            Enterprise-only. Sovereign deployment.
            <br />
            No cloud dependencies.
          </p>

          {/* Features */}
          <div className="space-y-3">
            {[
              { icon: '🛡️', text: 'On-premise deployment' },
              { icon: '🔒', text: 'Zero data egress' },
              { icon: '🏢', text: 'Enterprise SSO integration' },
              { icon: '📜', text: 'Regulatory compliance mapping' },
            ].map((feature, idx) => (
              <div key={idx} className="flex items-center gap-3 text-gray-400">
                <span className="text-lg">{feature.icon}</span>
                <span className="text-sm">{feature.text}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="text-gray-600 text-xs">Work email required · Subject to approval</div>
      </div>

      {/* Right Panel - Registration Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center justify-center gap-3 mb-8">
            <div className="w-10 h-10 bg-crimson-900/30 rounded-lg flex items-center justify-center border border-crimson-800/50">
              <span className="text-crimson-400 font-bold text-xl">D</span>
            </div>
            <span className="text-white text-xl font-semibold tracking-wider">DATACENDIA</span>
          </div>

          <div className="text-center mb-8">
            <h2 className="text-2xl font-light text-white">Request Access</h2>
            <p className="text-gray-500 mt-2">
              {step === 1 ? 'Enter your work details' : 'Set your credentials'}
            </p>
          </div>

          {/* Progress indicator */}
          <div className="flex items-center justify-center gap-2 mb-6">
            <div
              className={cn(
                'w-8 h-1 rounded-full transition-colors',
                step >= 1 ? 'bg-cyan-500' : 'bg-sovereign-border'
              )}
            />
            <div
              className={cn(
                'w-8 h-1 rounded-full transition-colors',
                step >= 2 ? 'bg-cyan-500' : 'bg-sovereign-border'
              )}
            />
          </div>

          {step === 1 && (
            <>
              {/* Deployment Notice */}
              <div className="mb-6 p-4 bg-sovereign-card border border-sovereign-border rounded-lg">
                <p className="text-xs text-gray-500 text-center">
                  🔒 Access requests are processed during deployment setup.
                  <br />
                  Your instance runs entirely on your infrastructure.
                </p>
              </div>
            </>
          )}

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
              <div className="p-3 bg-crimson-900/20 border border-crimson-800/50 rounded-lg text-sm text-crimson-400">
                {error}
              </div>
            )}

            {step === 1 ? (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">
                      {t('auth.register.firstName')}
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      required
                      className="w-full h-11 px-4 bg-sovereign-card border border-sovereign-border rounded-lg text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                      placeholder="John"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">
                      {t('auth.register.lastName')}
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      required
                      className="w-full h-11 px-4 bg-sovereign-card border border-sovereign-border rounded-lg text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                      placeholder="Doe"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">
                    Work Email <span className="text-crimson-400">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full h-11 px-4 bg-sovereign-card border border-sovereign-border rounded-lg text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    placeholder="john@company.com"
                  />
                  <p className="text-xs text-gray-600 mt-1">
                    Personal email domains (gmail, yahoo, etc.) are not accepted
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">
                    Organization
                  </label>
                  <input
                    type="text"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    required
                    className="w-full h-11 px-4 bg-sovereign-card border border-sovereign-border rounded-lg text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    placeholder="Acme Inc."
                  />
                </div>

                <button
                  type="submit"
                  className="w-full h-11 bg-cyan-600 text-white font-medium rounded-lg hover:bg-cyan-500 transition-colors"
                >
                  Continue
                </button>
              </>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="flex items-center gap-1 text-sm text-gray-500 hover:text-white mb-4 transition-colors"
                >
                  ← Back
                </button>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">
                    {t('auth.register.password')}
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className="w-full h-11 px-4 bg-sovereign-card border border-sovereign-border rounded-lg text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    placeholder="••••••••"
                  />
                  <p className="text-xs text-gray-600 mt-1">Minimum 8 characters</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">
                    {t('auth.register.confirmPassword')}
                  </label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                    className="w-full h-11 px-4 bg-sovereign-card border border-sovereign-border rounded-lg text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    placeholder="••••••••"
                  />
                </div>

                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    name="acceptTerms"
                    checked={formData.acceptTerms}
                    onChange={handleChange}
                    className="w-4 h-4 mt-0.5 rounded border-gray-600 bg-sovereign-card text-cyan-500 focus:ring-cyan-500"
                  />
                  <span className="text-sm text-gray-400">
                    I agree to the{' '}
                    <Link to="/terms" className="text-cyan-500 hover:underline">
                      Terms of Service
                    </Link>{' '}
                    and{' '}
                    <Link to="/privacy" className="text-cyan-500 hover:underline">
                      Privacy Policy
                    </Link>
                  </span>
                </label>

                {/* Deployment Notice */}
                <div className="p-3 bg-sovereign-card border border-sovereign-border rounded-lg">
                  <p className="text-xs text-gray-500 text-center">
                    🏢 Credentials are configured during on-site deployment.
                    <br />
                    Our team will contact you to schedule setup.
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className={cn(
                    'w-full h-11 bg-crimson-800 text-white font-medium rounded-lg',
                    'hover:bg-crimson-700 transition-colors',
                    'disabled:opacity-50 disabled:cursor-not-allowed',
                    'flex items-center justify-center'
                  )}
                >
                  {isLoading ? (
                    <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    'Submit Access Request'
                  )}
                </button>
              </>
            )}
          </form>

          {/* Sign In Link */}
          <p className="mt-8 text-center text-sm text-gray-500">
            Already have access?{' '}
            <Link to="/login" className="text-cyan-500 hover:text-cyan-400 font-medium">
              Sign in
            </Link>
          </p>

          {/* Language Selector */}
          <div className="mt-6 flex justify-center">
            <LanguageSwitcher variant="compact" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
