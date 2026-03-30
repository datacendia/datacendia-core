/**
 * African Development Bank Sandbox Page
 *
 * Template-driven sandbox demo using the SandboxTemplate component.
 * Config: src/pages/sandbox/configs/afdb.ts
 *
 * @module pages/sandbox/AfdbSandboxPage
 */

// Copyright (c) 2024-2026 Datacendia, LLC. Licensed under Apache 2.0.

import React from 'react';
import SandboxTemplatePage from './SandboxTemplate';
import config from './configs/afdb';

export const AfdbSandboxPage: React.FC = () => {
  return <SandboxTemplatePage config={config} />;
};

export default AfdbSandboxPage;
