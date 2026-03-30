/**
 * Wolters Kluwer Sandbox Page
 *
 * Template-driven sandbox demo using the SandboxTemplate component.
 * Config: src/pages/sandbox/configs/wolters-kluwer.ts
 *
 * @module pages/sandbox/WoltersKluwerSandboxPage
 */

// Copyright (c) 2024-2026 Datacendia, LLC. Licensed under Apache 2.0.

import React from 'react';
import SandboxTemplatePage from './SandboxTemplate';
import config from './configs/wolters-kluwer';

export const WoltersKluwerSandboxPage: React.FC = () => {
  return <SandboxTemplatePage config={config} />;
};

export default WoltersKluwerSandboxPage;
