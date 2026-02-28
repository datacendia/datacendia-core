// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

// =============================================================================
// DATACENDIA - EMAIL VERIFICATION PAGE
// Handles email verification token processing
// =============================================================================

import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { CheckCircle, XCircle, Loader2, Mail } from 'lucide-react';
import { api } from '../../lib/api/client';

export const VerifyEmailPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const [status, setStatus] = useState<'loading' | 'success' | 'error' | 'no-token'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!token) {
      setStatus('no-token');
      setMessage('No verification token provided.');
      return;
    }

    const verifyEmail = async () => {
      try {
        const response = await api.post<{ message: string }>('/auth/verify-email', { token });

        if (response.success) {
          setStatus('success');
          setMessage(response.data?.message || 'Your email has been verified successfully!');

          // Redirect to login after 3 seconds
          setTimeout(() => {
            navigate('/auth/login', {
              state: { message: 'Email verified! Please log in to continue.' },
            });
          }, 3000);
        } else {
          setStatus('error');
          setMessage(
            response.error?.message || 'Failed to verify email. The link may have expired.'
          );
        }
      } catch (error) {
        setStatus('error');
        setMessage('An error occurred while verifying your email.');
      }
    };

    verifyEmail();
  }, [token, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 px-4">
      <div className="max-w-md w-full">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 mb-4">
            <Mail className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white">Email Verification</h1>
        </div>

        {/* Status Card */}
        <div className="bg-gray-800 rounded-2xl border border-gray-700 p-8 text-center">
          {status === 'loading' && (
            <>
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-indigo-900/50 mb-4">
                <Loader2 className="w-8 h-8 text-indigo-400 animate-spin" />
              </div>
              <h2 className="text-xl font-semibold text-white mb-2">Verifying your email...</h2>
              <p className="text-gray-400">Please wait while we verify your email address.</p>
            </>
          )}

          {status === 'success' && (
            <>
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-900/50 mb-4">
                <CheckCircle className="w-8 h-8 text-green-400" />
              </div>
              <h2 className="text-xl font-semibold text-white mb-2">Email Verified!</h2>
              <p className="text-gray-400 mb-4">{message}</p>
              <p className="text-sm text-gray-500">Redirecting to login...</p>
            </>
          )}

          {status === 'error' && (
            <>
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-900/50 mb-4">
                <XCircle className="w-8 h-8 text-red-400" />
              </div>
              <h2 className="text-xl font-semibold text-white mb-2">Verification Failed</h2>
              <p className="text-gray-400 mb-6">{message}</p>
              <div className="space-y-3">
                <Link
                  to="/auth/login"
                  className="block w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors"
                >
                  Go to Login
                </Link>
                <button
                  onClick={() => navigate('/auth/resend-verification')}
                  className="block w-full py-3 px-4 bg-gray-700 hover:bg-gray-600 text-white font-medium rounded-lg transition-colors"
                >
                  Resend Verification Email
                </button>
              </div>
            </>
          )}

          {status === 'no-token' && (
            <>
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-yellow-900/50 mb-4">
                <XCircle className="w-8 h-8 text-yellow-400" />
              </div>
              <h2 className="text-xl font-semibold text-white mb-2">Invalid Link</h2>
              <p className="text-gray-400 mb-6">{message}</p>
              <Link
                to="/auth/login"
                className="block w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors"
              >
                Go to Login
              </Link>
            </>
          )}
        </div>

        {/* Footer */}
        <p className="mt-6 text-center text-sm text-gray-500">
          Need help?{' '}
          <a href="mailto:support@datacendia.com" className="text-indigo-400 hover:text-indigo-300">
            Contact Support
          </a>
        </p>
      </div>
    </div>
  );
};

export default VerifyEmailPage;
