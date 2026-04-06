/**
 * Club Alianza Lima Sandbox Page
 *
 * Template-driven sandbox demo using the SandboxTemplate component.
 * Config: src/pages/sandbox/configs/alianza-lima.ts
 *
 * @module pages/sandbox/AlianzaLimaSandboxPage
 */

// Copyright (c) 2024-2026 Datacendia, LLC. Licensed under Apache 2.0.

import React from 'react';
import SandboxTemplatePage from './SandboxTemplate';
import alianzaLimaConfig from './configs/alianza-lima';

export const AlianzaLimaSandboxPage: React.FC = () => {
  return <SandboxTemplatePage config={alianzaLimaConfig} />;
};

export default AlianzaLimaSandboxPage;
