/**
 * FBC Melgar Sandbox Page
 *
 * Template-driven sandbox demo using the SandboxTemplate component.
 * Config: src/pages/sandbox/configs/melgar.ts
 *
 * @module pages/sandbox/MelgarSandboxPage
 */

// Copyright (c) 2024-2026 Datacendia, LLC. Licensed under Apache 2.0.

import React from 'react';
import SandboxTemplatePage from './SandboxTemplate';
import melgarConfig from './configs/melgar';

export const MelgarSandboxPage: React.FC = () => {
  return <SandboxTemplatePage config={melgarConfig} />;
};

export default MelgarSandboxPage;
