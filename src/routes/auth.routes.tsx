// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

// =============================================================================
// AUTH ROUTES - Login, Register, Password Reset, Onboarding
// =============================================================================

import React, { lazy } from 'react';
import { RouteObject } from 'react-router-dom';
import { SuspenseWrapper } from './utils';

const LoginPage = lazy(() =>
  import('../pages/auth/LoginPage').then((m) => ({ default: m.LoginPage }))
);
const RegisterPage = lazy(() =>
  import('../pages/auth/RegisterPage').then((m) => ({ default: m.RegisterPage }))
);
const ForgotPasswordPage = lazy(() =>
  import('../pages/auth/ForgotPasswordPage').then((m) => ({ default: m.ForgotPasswordPage }))
);
const ResetPasswordPage = lazy(() =>
  import('../pages/auth/ResetPasswordPage').then((m) => ({ default: m.ResetPasswordPage }))
);
const VerifyEmailPage = lazy(() =>
  import('../pages/auth/VerifyEmailPage').then((m) => ({ default: m.VerifyEmailPage }))
);
const FindAccountPage = lazy(() =>
  import('../pages/auth/FindAccountPage').then((m) => ({ default: m.FindAccountPage }))
);
const OnboardingWizard = lazy(() =>
  import('../pages/onboarding').then((m) => ({ default: m.OnboardingWizard }))
);

const w = (Component: React.ComponentType) => (
  <SuspenseWrapper><Component /></SuspenseWrapper>
);

export const authRoutes: RouteObject[] = [
  { path: '/login', element: w(LoginPage) },
  { path: '/register', element: w(RegisterPage) },
  { path: '/forgot-password', element: w(ForgotPasswordPage) },
  { path: '/reset-password', element: w(ResetPasswordPage) },
  { path: '/verify-email', element: w(VerifyEmailPage) },
  { path: '/find-account', element: w(FindAccountPage) },
  { path: '/auth/login', element: w(LoginPage) },
  { path: '/auth/register', element: w(RegisterPage) },
  { path: '/auth/forgot-password', element: w(ForgotPasswordPage) },
  { path: '/auth/reset-password', element: w(ResetPasswordPage) },
  { path: '/auth/verify-email', element: w(VerifyEmailPage) },
  { path: '/auth/find-account', element: w(FindAccountPage) },
  { path: '/onboarding', element: w(OnboardingWizard) },
  { path: '/welcome', element: w(OnboardingWizard) },
  { path: '/get-started', element: w(OnboardingWizard) },
];
