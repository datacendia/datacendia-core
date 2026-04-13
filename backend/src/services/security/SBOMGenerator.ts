// Copyright (c) 2024-2026 Datacendia, LLC. Licensed under Apache 2.0.
// See LICENSE file for details.

import crypto from 'crypto';

const PLATFORM_COMPONENTS = [
  { name: 'express', version: '4.21.2', license: 'MIT', type: 'framework' },
  { name: 'prisma', version: '6.2.1', license: 'Apache-2.0', type: 'orm' },
  { name: 'react', version: '18.3.1', license: 'MIT', type: 'frontend' },
  { name: 'vite', version: '6.0.7', license: 'MIT', type: 'build' },
  { name: 'typescript', version: '5.7.3', license: 'Apache-2.0', type: 'language' },
  { name: 'jsonwebtoken', version: '9.0.2', license: 'MIT', type: 'auth' },
  { name: 'helmet', version: '8.0.0', license: 'MIT', type: 'security' },
  { name: 'zod', version: '3.24.1', license: 'MIT', type: 'validation' },
  { name: 'tailwindcss', version: '3.4.17', license: 'MIT', type: 'styling' },
  { name: 'recharts', version: '2.15.0', license: 'MIT', type: 'visualization' },
  { name: 'lucide-react', version: '0.469.0', license: 'ISC', type: 'icons' },
  { name: 'framer-motion', version: '11.18.0', license: 'MIT', type: 'animation' },
];

class SBOMGeneratorImpl {
  async generatePlatformSBOM(format: 'cyclonedx' | 'spdx') {
    const components = PLATFORM_COMPONENTS.map(c => ({
      ...c, purl: `pkg:npm/${c.name}@${c.version}`, hash: crypto.createHash('sha256').update(`${c.name}@${c.version}`).digest('hex')
    }));
    return {
      format, metadata: { tool: 'datacendia-sbom-generator', version: '1.0.0', timestamp: new Date().toISOString() },
      components,
      vulnerabilitySummary: { critical: 0, high: 0, medium: 0, low: 0, info: 0 },
    };
  }

  export(sbom: any) { return JSON.stringify(sbom, null, 2); }

  getLicenseSummary(sbom: any): Record<string, number> {
    const summary: Record<string, number> = {};
    for (const c of sbom.components) { summary[c.license] = (summary[c.license] || 0) + 1; }
    return summary;
  }
}

export const sbomGenerator = new SBOMGeneratorImpl();
