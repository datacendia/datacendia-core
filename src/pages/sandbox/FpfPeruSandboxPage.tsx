/**
 * FPF Peru Sandbox Page
 *
 * Template-driven sandbox demo using the SandboxTemplate component.
 * Config: src/pages/sandbox/configs/fpf-peru.ts
 *
 * @module pages/sandbox/FpfPeruSandboxPage
 */

// Copyright (c) 2024-2026 Datacendia, LLC. Licensed under Apache 2.0.

import React from 'react';
import SandboxTemplatePage from './SandboxTemplate';
import fpfPeruConfig from './configs/fpf-peru';

export const FpfPeruSandboxPage: React.FC = () => {
  return <SandboxTemplatePage config={fpfPeruConfig} />;
};

export default FpfPeruSandboxPage;
