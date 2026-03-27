/**
 * Milan Sandbox Page
 *
 * Template-driven sandbox demo using the SandboxTemplate component.
 * Config: src/pages/sandbox/configs/ac-milan.ts
 *
 * @module pages/sandbox/MilanSandboxPage
 */

// Copyright (c) 2024-2026 Datacendia, LLC. Licensed under Apache 2.0.

import React from 'react';
import SandboxTemplatePage from './SandboxTemplate';
import milanConfig from './configs/ac-milan';

export const MilanSandboxPage: React.FC = () => {
  return <SandboxTemplatePage config={milanConfig} />;
};

export default MilanSandboxPage;
