/**
 * Page — MRC Perú Sandbox Demo (Bilingual EN/ES)
 *
 * Bespoke sandbox for Mallas, Resortes & Cables S.A.C. — Peruvian industrial
 * supplier of meshes, springs, and steel cables for mining, automotive, and
 * general industry. 5 fully scripted multi-agent deliberation scenarios.
 *
 * Access: /sandbox/mrc (Key: MRC-26)
 *
 * @exports MrcPeruSandboxPage
 * @module pages/sandbox/MrcPeruSandboxPage
 */

// Copyright (c) 2024-2026 Datacendia, LLC. Licensed under Apache 2.0.

import React from 'react';
import { SandboxTemplatePage } from './SandboxTemplate';
import config from './configs/mrc-peru';

const MrcPeruSandboxPage: React.FC = () => <SandboxTemplatePage config={config} />;

export default MrcPeruSandboxPage;
