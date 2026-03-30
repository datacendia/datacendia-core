/**
 * Bloomberg Law Sandbox Page
 *
 * Template-driven sandbox demo using the SandboxTemplate component.
 * Config: src/pages/sandbox/configs/bloomberg-law.ts
 *
 * @module pages/sandbox/BloombergLawSandboxPage
 */

// Copyright (c) 2024-2026 Datacendia, LLC. Licensed under Apache 2.0.

import React from 'react';
import SandboxTemplatePage from './SandboxTemplate';
import config from './configs/bloomberg-law';

export const BloombergLawSandboxPage: React.FC = () => {
  return <SandboxTemplatePage config={config} />;
};

export default BloombergLawSandboxPage;
