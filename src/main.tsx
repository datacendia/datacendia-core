// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

/**
 * DATACENDIA PLATFORM - FRONTEND APPLICATION
 * 
 * Copyright (c) 2024-2026 Datacendia, Inc. All Rights Reserved.
 * 
 * PROPRIETARY AND CONFIDENTIAL
 * Unauthorized copying, modification, or distribution is strictly prohibited.
 * See LICENSE file for details.
 */

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { initErrorTracking } from './lib/errorTracking';
import { ThemeProvider } from './contexts/ThemeContext';

// Initialize error tracking for production-grade error monitoring
initErrorTracking();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </React.StrictMode>
);
