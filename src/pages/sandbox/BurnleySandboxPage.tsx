/**
 * Burnley FC Sandbox Page
 *
 * Template-driven sandbox demo using the SandboxTemplate component.
 * Config: src/pages/sandbox/configs/burnley-fc.ts
 *
 * @module pages/sandbox/BurnleySandboxPage
 */

// Copyright (c) 2024-2026 Datacendia, LLC. Licensed under Apache 2.0.

import React from 'react';
import SandboxTemplatePage from './SandboxTemplate';
import burnleyConfig from './configs/burnley-fc';

export const BurnleySandboxPage: React.FC = () => {
  return <SandboxTemplatePage config={burnleyConfig} />;
};

export default BurnleySandboxPage;
