/**
 * NFL Sandbox Page
 *
 * Template-driven sandbox demo using the SandboxTemplate component.
 * Config: src/pages/sandbox/configs/nfl.ts
 *
 * @module pages/sandbox/NflSandboxPage
 */

// Copyright (c) 2024-2026 Datacendia, LLC. Licensed under Apache 2.0.

import React from 'react';
import SandboxTemplatePage from './SandboxTemplate';
import nflConfig from './configs/nfl';

export const NflSandboxPage: React.FC = () => {
  return <SandboxTemplatePage config={nflConfig} />;
};

export default NflSandboxPage;
