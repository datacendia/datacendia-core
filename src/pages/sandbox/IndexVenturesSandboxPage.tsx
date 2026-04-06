import { lazy, Suspense } from 'react';
import config from './configs/index-ventures';

const SandboxTemplate = lazy(() => import('./SandboxTemplate'));

export default function IndexVenturesSandboxPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-black" />}>
      <SandboxTemplate config={config} />
    </Suspense>
  );
}
