// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

/**
 * DATACENDIA PLATFORM - APPLICATION ROOT
 * 
 * Copyright (c) 2024-2026 Datacendia, Inc. All Rights Reserved.
 * 
 * PROPRIETARY AND CONFIDENTIAL
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 * See LICENSE file for details.
 */

import React from 'react';
import { RouterProvider } from 'react-router-dom';
import { ToastProvider } from '../components/feedback';
import { I18nProvider } from './lib/i18n';
import { AuthProvider } from './contexts/AuthContext';
import { VerticalConfigProvider } from './contexts/VerticalConfigContext';
import { DemoModeProvider } from './contexts/DemoModeContext';
// Use lazy-loaded routes for better performance (code splitting)
import { router } from './routes.lazy';
import ErrorBoundary from './components/ErrorBoundary';
import { TechTeamPanel } from './components/dev/TechTeamPanel';
import { DemoOverlay } from './components/demo/DemoOverlay';

export const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <I18nProvider>
        <AuthProvider>
          <VerticalConfigProvider>
            <DemoModeProvider>
              <ToastProvider>
                <RouterProvider router={router} />
                {/* AI Tech Team - Auto-Heal Panel */}
                <TechTeamPanel />
                {/* Demo Recording Overlay */}
                <DemoOverlay />
              </ToastProvider>
            </DemoModeProvider>
          </VerticalConfigProvider>
        </AuthProvider>
      </I18nProvider>
    </ErrorBoundary>
  );
};

export default App;
