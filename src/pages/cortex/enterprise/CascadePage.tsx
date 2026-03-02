/**
 * Page — Cascade Page
 *
 * React page component rendered by the router.
 *
 * @exports EnterprisePage
 * @module pages/cortex/enterprise/CascadePage
 */

﻿import { EnterpriseGate } from '@/components/ui/EnterpriseGate';

export default function EnterprisePage() {
  return <EnterpriseGate featureName="CendiaCascade™" description="Second and third-order consequence analysis — trace the butterfly effect of every decision." />;
}
