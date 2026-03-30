/**
 * Canva Sandbox Page
 *
 * Template-driven sandbox demo using the SandboxTemplate component.
 * Config: src/pages/sandbox/configs/canva.ts
 *
 * @module pages/sandbox/CanvaSandboxPage
 */

// Copyright (c) 2024-2026 Datacendia, LLC. Licensed under Apache 2.0.

import React from 'react';
import SandboxTemplatePage from './SandboxTemplate';
import config from './configs/canva';

export const CanvaSandboxPage: React.FC = () => {
  return <SandboxTemplatePage config={config} />;
};

export default CanvaSandboxPage;
