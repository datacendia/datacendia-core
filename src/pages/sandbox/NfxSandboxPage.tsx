/**
 * NFX Sandbox Page
 * @module pages/sandbox/NfxSandboxPage
 */
import React from 'react';
import SandboxTemplatePage from './SandboxTemplate';
import config from './configs/nfx';

export const NfxSandboxPage: React.FC = () => {
  return <SandboxTemplatePage config={config} />;
};

export default NfxSandboxPage;
