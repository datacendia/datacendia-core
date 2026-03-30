/**
 * SAP Sandbox Page
 *
 * Template-driven sandbox demo using the SandboxTemplate component.
 * Config: src/pages/sandbox/configs/sap.ts
 *
 * @module pages/sandbox/SapSandboxPage
 */

// Copyright (c) 2024-2026 Datacendia, LLC. Licensed under Apache 2.0.

import React from 'react';
import SandboxTemplatePage from './SandboxTemplate';
import config from './configs/sap';

export const SapSandboxPage: React.FC = () => {
  return <SandboxTemplatePage config={config} />;
};

export default SapSandboxPage;
