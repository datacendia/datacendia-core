/**
 * Lux Capital Sandbox Page
 *
 * Template-driven sandbox demo using the SandboxTemplate component.
 * Config: src/pages/sandbox/configs/lux-capital.ts
 *
 * @module pages/sandbox/LuxCapitalSandboxPage
 */

// Copyright (c) 2024-2026 Datacendia, LLC. Licensed under Apache 2.0.

import React from 'react';
import SandboxTemplatePage from './SandboxTemplate';
import config from './configs/lux-capital';

export const LuxCapitalSandboxPage: React.FC = () => {
  return <SandboxTemplatePage config={config} />;
};

export default LuxCapitalSandboxPage;
