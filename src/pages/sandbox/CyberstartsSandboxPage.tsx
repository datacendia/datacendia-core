/**
 * Cyberstarts Sandbox Page
 *
 * Template-driven sandbox demo using the SandboxTemplate component.
 * Config: src/pages/sandbox/configs/cyberstarts.ts
 *
 * @module pages/sandbox/CyberstartsSandboxPage
 */

// Copyright (c) 2024-2026 Datacendia, LLC. Licensed under Apache 2.0.

import React from 'react';
import SandboxTemplatePage from './SandboxTemplate';
import config from './configs/cyberstarts';

export const CyberstartsSandboxPage: React.FC = () => {
  return <SandboxTemplatePage config={config} />;
};
