// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

// =============================================================================
// DATACENDIA - RESET PASSWORD PAGE
// Set new password using reset token
// =============================================================================

import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { cn } from '../../../lib/utils';
import { api } from '../../lib/api/client';

export const ResetPasswordPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<'form' | 'success' | 'error' | 'no-token'>('form');
  const [error, setError] = useState<string | null>(null);

  // Password strength indicators
  const passwordChecks = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
    special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
  };
  const passwordStrength = Object.values(passwordChecks).filter(Boolean).length;

  useEffect(() => {
    if (!token) {
      setStatus('no-token');
    }
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (passwordStrength < 4) {
      setError('Password does not meet security requirements');
      return;
    }

    setIsLoading(true);

    try {
      const response = await api.post<{ message: string }>('/auth/reset-password', {
        token,
        password,
      });

      if (response.success) {
        setStatus('success');
        setTimeout(() => {
          navigate('/login', {
            state: { message: 'Password reset successful! Please log in with your new password.' },
          });
        }, 3000);
      } else {
        setError(response.error?.message || 'Failed to reset password');
        if (
          response.error?.message?.includes('expired') ||
          response.error?.message?.includes('invalid')
        ) {
          setStatus('error');
        }
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Shared status page wrapper
  const StatusPage: React.FC<{
    icon: React.ReactNode;
    title: string;
    message: string;
    action?: React.ReactNode;
  }> = ({ icon, title, message, action }) => (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0a0c] px-4">
      <div className="w-full max-w-sm text-center">
        <div className="flex justify-center mb-10">
          <span style={{ fontFamily: "'Georgia', 'Times New Roman', serif", letterSpacing: '0.3em', fontWeight: 400, fontSize: '20px', color: '#e8e4e0' }}>
            DATACEND<span style={{ color: '#c9a84c' }}>!</span>A
          </span>
        </div>

        <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 border" style={{ borderColor: 'rgba(201,168,76,0.2)', background: 'rgba(201,168,76,0.05)' }}>
          {icon}
        </div>

        <h2 className="text-xl font-light text-white tracking-wide mb-2">{title}</h2>
        <p className="text-gray-500 text-sm mb-8">{message}</p>
        {action}

        <div className="mt-8 pt-6 border-t border-gray-800/30 text-center">
          <p className="text-[10px] text-gray-800 uppercase tracking-wider">
            SOC 2 · ISO 27001 · HIPAA · NIST 800-53
          </p>
        </div>
      </div>
    </div>
  );

  if (status === 'no-token') {
    return (
      <StatusPage
        icon={
          <svg className="w-8 h-8 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
          </svg>
        }
        title="Invalid Reset Link"
        message="This password reset link is invalid or has expired."
        action={
          <Link
            to="/forgot-password"
            className={cn(
              'inline-flex items-center justify-center w-full h-11 font-medium rounded-lg text-sm',
              'bg-gradient-to-r from-[#c9a84c] to-[#b8963f] text-[#0a0a0c]',
              'hover:from-[#d4b55a] hover:to-[#c9a84c] transition-all',
              'shadow-lg shadow-[#c9a84c]/10'
            )}
          >
            Request New Reset Link
          </Link>
        }
      />
    );
  }

  if (status === 'success') {
    return (
      <StatusPage
        icon={
          <svg className="w-8 h-8 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        }
        title="Password Reset!"
        message="Your password has been reset successfully. Redirecting to login..."
      />
    );
  }

  if (status === 'error') {
    return (
      <StatusPage
        icon={
          <svg className="w-8 h-8 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        }
        title="Reset Failed"
        message={error || 'Something went wrong. Please try again.'}
        action={
          <Link
            to="/forgot-password"
            className={cn(
              'inline-flex items-center justify-center w-full h-11 font-medium rounded-lg text-sm',
              'bg-gradient-to-r from-[#c9a84c] to-[#b8963f] text-[#0a0a0c]',
              'hover:from-[#d4b55a] hover:to-[#c9a84c] transition-all',
              'shadow-lg shadow-[#c9a84c]/10'
            )}
          >
            Request New Reset Link
          </Link>
        }
      />
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
            <h1 className="text-4xl font-light text-white leading-[1.3] mb-3">Create a new password.</h1>
            <h1 className="text-4xl font-light text-[#c9a84c]/80 leading-[1.3] mb-8">Make it strong.</h1>
            <p className="text-gray-500 text-sm leading-relaxed max-w-md">
              Choose a strong, unique password that you don't use on any other
              site. A mix of uppercase, lowercase, numbers, and symbols is required.
            </p>
          </div>

          <div className="flex items-center gap-4 text-[11px] text-gray-700">
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500/60" />
              bcrypt Hashed
            </span>
            <span className="text-gray-800">·</span>
            <span>12-Round Salt</span>
            <span className="text-gray-800">·</span>
            <span>Zero-Knowledge</span>
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
            <h2 className="text-xl font-light text-white tracking-wide">Create New Password</h2>
            <p className="text-gray-600 mt-1.5 text-sm">Choose a strong password for your account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div role="alert" className="p-3 bg-red-950/30 border border-red-900/40 rounded-lg text-sm text-red-400">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="password" className="block text-[11px] font-medium text-gray-500 uppercase tracking-wider mb-1.5">
                New Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full h-11 px-4 pr-11 bg-white/[0.03] border border-gray-800/60 rounded-lg text-white placeholder-gray-700 focus:outline-none focus:ring-1 focus:ring-[#c9a84c]/40 focus:border-[#c9a84c]/40 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-400 transition-colors"
                >
                  {showPassword ? (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" /></svg>
                  ) : (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                  )}
                </button>
              </div>

              {/* Password Strength Indicator */}
              {password && (
                <div className="mt-3 space-y-2">
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((level) => (
                      <div
                        key={level}
                        className={cn(
                          'h-1 flex-1 rounded-full transition-colors',
                          passwordStrength >= level
                            ? passwordStrength >= 4
                              ? 'bg-emerald-500'
                              : passwordStrength >= 3
                                ? 'bg-[#c9a84c]'
                                : 'bg-red-500'
                            : 'bg-gray-800/60'
                        )}
                      />
                    ))}
                  </div>
                  <ul className="text-[10px] space-y-0.5">
                    {[
                      { check: passwordChecks.length, label: 'At least 8 characters' },
                      { check: passwordChecks.uppercase, label: 'One uppercase letter' },
                      { check: passwordChecks.lowercase, label: 'One lowercase letter' },
                      { check: passwordChecks.number, label: 'One number' },
                      { check: passwordChecks.special, label: 'One special character' },
                    ].map((item) => (
                      <li key={item.label} className={item.check ? 'text-emerald-500' : 'text-gray-700'}>
                        {item.check ? '\u2713' : '\u25CB'} {item.label}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-[11px] font-medium text-gray-500 uppercase tracking-wider mb-1.5">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                type={showPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full h-11 px-4 bg-white/[0.03] border border-gray-800/60 rounded-lg text-white placeholder-gray-700 focus:outline-none focus:ring-1 focus:ring-[#c9a84c]/40 focus:border-[#c9a84c]/40 transition-colors"
              />
              {confirmPassword && password !== confirmPassword && (
                <p className="mt-1.5 text-[10px] text-red-400">Passwords do not match</p>
              )}
            </div>

            <button
              type="submit"
              disabled={
                isLoading ||
                !password ||
                !confirmPassword ||
                password !== confirmPassword ||
                passwordStrength < 4
              }
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
                'Reset Password'
              )}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-xs text-gray-600">
              Remember your password?{' '}
              <Link to="/login" className="text-[#c9a84c]/70 hover:text-[#c9a84c] transition-colors">
                Sign in →
              </Link>
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
};

export default ResetPasswordPage;
