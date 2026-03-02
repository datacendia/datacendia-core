/**
 * Page — Vox Page
 *
 * React page component rendered by the router.
 *
 * @exports EnterprisePage
 * @module pages/sovereign/VoxPage
 */

﻿import { EnterpriseGate } from '@/components/ui/EnterpriseGate';

export default function EnterprisePage() {
  return <EnterpriseGate featureName="CendiaVox™" description="Voice-driven deliberation — natural language interface for Council interactions." />;
}
