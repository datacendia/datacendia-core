/**
 * Universitario de Deportes Sandbox Page
 *
 * Template-driven sandbox demo using the SandboxTemplate component.
 * Config: src/pages/sandbox/configs/universitario.ts
 *
 * @module pages/sandbox/UniversitarioSandboxPage
 */

// Copyright (c) 2024-2026 Datacendia, LLC. Licensed under Apache 2.0.

import React from 'react';
import SandboxTemplatePage from './SandboxTemplate';
import universitarioConfig from './configs/universitario';

export const UniversitarioSandboxPage: React.FC = () => {
  return <SandboxTemplatePage config={universitarioConfig} />;
};

export default UniversitarioSandboxPage;
