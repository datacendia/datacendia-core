/**
 * MTN Group Sandbox Page
 *
 * Template-driven sandbox demo using the SandboxTemplate component.
 * Config: src/pages/sandbox/configs/mtn.ts
 *
 * @module pages/sandbox/MtnSandboxPage
 */

// Copyright (c) 2024-2026 Datacendia, LLC. Licensed under Apache 2.0.

import React from 'react';
import SandboxTemplatePage from './SandboxTemplate';
import config from './configs/mtn';

export const MtnSandboxPage: React.FC = () => {
  return <SandboxTemplatePage config={config} />;
};

export default MtnSandboxPage;
