/**
 * Samsung Electronics Sandbox Page
 *
 * Template-driven sandbox demo using the SandboxTemplate component.
 * Config: src/pages/sandbox/configs/samsung.ts
 *
 * @module pages/sandbox/SamsungSandboxPage
 */

// Copyright (c) 2024-2026 Datacendia, LLC. Licensed under Apache 2.0.

import React from 'react';
import SandboxTemplatePage from './SandboxTemplate';
import config from './configs/samsung';

export const SamsungSandboxPage: React.FC = () => {
  return <SandboxTemplatePage config={config} />;
};

export default SamsungSandboxPage;
