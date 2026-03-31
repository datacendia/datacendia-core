/**
 * Club Sporting Cristal Sandbox Page
 *
 * Template-driven sandbox demo using the SandboxTemplate component.
 * Config: src/pages/sandbox/configs/sporting-cristal.ts
 *
 * @module pages/sandbox/SportingCristalSandboxPage
 */

// Copyright (c) 2024-2026 Datacendia, LLC. Licensed under Apache 2.0.

import React from 'react';
import SandboxTemplatePage from './SandboxTemplate';
import sportingCristalConfig from './configs/sporting-cristal';

export const SportingCristalSandboxPage: React.FC = () => {
  return <SandboxTemplatePage config={sportingCristalConfig} />;
};

export default SportingCristalSandboxPage;
