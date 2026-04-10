/**
 * Compliance Marketplace
 * 
 * Marketplace for sharing, publishing, and consuming compliance packages:
 * policies, templates, playbooks, agent configs, and audit frameworks.
 * Community-driven with ratings, reviews, and enterprise publishing controls.
 * 
 * @module services/enterprise/ComplianceMarketplaceService
 */

import { logger } from '../../utils/logger.js';

// =============================================================================
// TYPES
// =============================================================================

export type PackageType = 'policy' | 'template' | 'playbook' | 'agent_config' | 'audit_framework' | 'report_template' | 'integration';
export type PackageStatus = 'draft' | 'published' | 'archived' | 'under_review';

export interface MarketplacePackage {
  id: string;
  name: string;
  description: string;
  longDescription: string;
  type: PackageType;
  version: string;
  publisher: PackagePublisher;
  category: string;
  tags: string[];
  frameworks: string[];
  pricing: PackagePricing;
  stats: PackageStats;
  content: Record<string, any>;
  status: PackageStatus;
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PackagePublisher {
  id: string;
  name: string;
  type: 'datacendia' | 'partner' | 'community' | 'enterprise';
  verified: boolean;
  trustScore?: number;
}

export interface PackagePricing {
  model: 'free' | 'freemium' | 'paid' | 'enterprise';
  price?: number;
  currency?: string;
  trialDays?: number;
}

export interface PackageStats {
  downloads: number;
  activeInstalls: number;
  rating: number;
  reviewCount: number;
  lastDownloaded?: string;
}

export interface PackageReview {
  id: string;
  packageId: string;
  reviewer: string;
  rating: number;
  title: string;
  content: string;
  createdAt: string;
  helpful: number;
}

export interface InstalledPackage {
  id: string;
  packageId: string;
  version: string;
  installedBy: string;
  installedAt: string;
  status: 'active' | 'disabled' | 'update_available';
  config: Record<string, any>;
}

// =============================================================================
// SERVICE
// =============================================================================

class ComplianceMarketplaceService {
  private packages: Map<string, MarketplacePackage> = new Map();
  private reviews: Map<string, PackageReview[]> = new Map();
  private installed: Map<string, InstalledPackage[]> = new Map();

  constructor() {
    this.loadBuiltInPackages();
  }

  // ---------------------------------------------------------------------------
  // BROWSE & SEARCH
  // ---------------------------------------------------------------------------

  async search(filters?: {
    query?: string;
    type?: PackageType;
    category?: string;
    framework?: string;
    pricing?: string;
    sortBy?: 'popular' | 'rating' | 'recent' | 'name';
  }): Promise<{ packages: MarketplacePackage[]; total: number; facets: Record<string, Record<string, number>> }> {
    let results = Array.from(this.packages.values()).filter(p => p.status === 'published');

    if (filters?.query) {
      const q = filters.query.toLowerCase();
      results = results.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.tags.some(t => t.toLowerCase().includes(q))
      );
    }
    if (filters?.type) results = results.filter(p => p.type === filters.type);
    if (filters?.category) results = results.filter(p => p.category === filters.category);
    if (filters?.framework) results = results.filter(p => p.frameworks.includes(filters.framework!));
    if (filters?.pricing) results = results.filter(p => p.pricing.model === filters.pricing);

    switch (filters?.sortBy) {
      case 'popular': results.sort((a, b) => b.stats.downloads - a.stats.downloads); break;
      case 'rating': results.sort((a, b) => b.stats.rating - a.stats.rating); break;
      case 'name': results.sort((a, b) => a.name.localeCompare(b.name)); break;
      default: results.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
    }

    const allPublished = Array.from(this.packages.values()).filter(p => p.status === 'published');
    const facets = {
      types: this.buildFacet(allPublished, p => p.type),
      categories: this.buildFacet(allPublished, p => p.category),
      pricing: this.buildFacet(allPublished, p => p.pricing.model),
    };

    return { packages: results, total: results.length, facets };
  }

  async getPackage(packageId: string): Promise<MarketplacePackage | null> {
    return this.packages.get(packageId) || null;
  }

  async getPackageReviews(packageId: string): Promise<PackageReview[]> {
    return this.reviews.get(packageId) || [];
  }

  // ---------------------------------------------------------------------------
  // PUBLISH
  // ---------------------------------------------------------------------------

  async publishPackage(input: {
    name: string;
    description: string;
    longDescription: string;
    type: PackageType;
    version: string;
    publisher: PackagePublisher;
    category: string;
    tags: string[];
    frameworks: string[];
    pricing: PackagePricing;
    content: Record<string, any>;
  }): Promise<MarketplacePackage> {
    const id = `pkg_${crypto.randomUUID().split('-')[0]}`;
    const pkg: MarketplacePackage = {
      id,
      ...input,
      stats: { downloads: 0, activeInstalls: 0, rating: 0, reviewCount: 0 },
      status: 'published',
      publishedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.packages.set(id, pkg);
    logger.info(`[Marketplace] Package published: ${id} (${input.name})`);
    return pkg;
  }

  // ---------------------------------------------------------------------------
  // INSTALL / UNINSTALL
  // ---------------------------------------------------------------------------

  async installPackage(packageId: string, organizationId: string, userId: string): Promise<InstalledPackage | null> {
    const pkg = this.packages.get(packageId);
    if (!pkg) return null;

    pkg.stats.downloads++;
    pkg.stats.activeInstalls++;
    pkg.stats.lastDownloaded = new Date().toISOString();
    this.packages.set(packageId, pkg);

    const installation: InstalledPackage = {
      id: `inst_${crypto.randomUUID().split('-')[0]}`,
      packageId,
      version: pkg.version,
      installedBy: userId,
      installedAt: new Date().toISOString(),
      status: 'active',
      config: {},
    };

    const orgInstalls = this.installed.get(organizationId) || [];
    orgInstalls.push(installation);
    this.installed.set(organizationId, orgInstalls);

    return installation;
  }

  async uninstallPackage(organizationId: string, installationId: string): Promise<boolean> {
    const orgInstalls = this.installed.get(organizationId);
    if (!orgInstalls) return false;

    const idx = orgInstalls.findIndex(i => i.id === installationId);
    if (idx === -1) return false;

    const install = orgInstalls[idx];
    const pkg = this.packages.get(install.packageId);
    if (pkg) {
      pkg.stats.activeInstalls = Math.max(0, pkg.stats.activeInstalls - 1);
      this.packages.set(install.packageId, pkg);
    }

    orgInstalls.splice(idx, 1);
    this.installed.set(organizationId, orgInstalls);
    return true;
  }

  async getInstalledPackages(organizationId: string): Promise<InstalledPackage[]> {
    return this.installed.get(organizationId) || [];
  }

  // ---------------------------------------------------------------------------
  // REVIEWS
  // ---------------------------------------------------------------------------

  async addReview(packageId: string, review: Omit<PackageReview, 'id' | 'createdAt' | 'helpful'>): Promise<PackageReview | null> {
    const pkg = this.packages.get(packageId);
    if (!pkg) return null;

    const newReview: PackageReview = {
      id: `rev_${crypto.randomUUID().split('-')[0]}`,
      ...review,
      createdAt: new Date().toISOString(),
      helpful: 0,
    };

    const pkgReviews = this.reviews.get(packageId) || [];
    pkgReviews.push(newReview);
    this.reviews.set(packageId, pkgReviews);

    // Update package stats
    pkg.stats.reviewCount = pkgReviews.length;
    pkg.stats.rating = pkgReviews.reduce((s, r) => s + r.rating, 0) / pkgReviews.length;
    this.packages.set(packageId, pkg);

    return newReview;
  }

  // ---------------------------------------------------------------------------
  // DASHBOARD
  // ---------------------------------------------------------------------------

  async getDashboard(): Promise<{
    totalPackages: number;
    totalDownloads: number;
    topPackages: MarketplacePackage[];
    recentPackages: MarketplacePackage[];
    categoryBreakdown: Record<string, number>;
  }> {
    const all = Array.from(this.packages.values()).filter(p => p.status === 'published');
    return {
      totalPackages: all.length,
      totalDownloads: all.reduce((s, p) => s + p.stats.downloads, 0),
      topPackages: [...all].sort((a, b) => b.stats.downloads - a.stats.downloads).slice(0, 10),
      recentPackages: [...all].sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()).slice(0, 10),
      categoryBreakdown: this.buildFacet(all, p => p.category),
    };
  }

  // ---------------------------------------------------------------------------
  // PRIVATE
  // ---------------------------------------------------------------------------

  private buildFacet(items: MarketplacePackage[], extractor: (p: MarketplacePackage) => string): Record<string, number> {
    const facet: Record<string, number> = {};
    for (const item of items) { const key = extractor(item); facet[key] = (facet[key] || 0) + 1; }
    return facet;
  }

  private loadBuiltInPackages(): void {
    const builtIns: Omit<MarketplacePackage, 'id' | 'stats' | 'createdAt' | 'updatedAt'>[] = [
      {
        name: 'GDPR Compliance Starter Kit',
        description: 'Complete GDPR compliance policy set with data processing agreements, consent management, and breach notification templates',
        longDescription: 'Everything you need to bootstrap GDPR compliance. Includes 12 policy templates, 5 automated playbooks, and pre-configured monitoring agents.',
        type: 'template',
        version: '2.1.0',
        publisher: { id: 'pub_datacendia', name: 'Datacendia', type: 'datacendia', verified: true, trustScore: 98 },
        category: 'Data Protection',
        tags: ['gdpr', 'privacy', 'eu', 'data-protection'],
        frameworks: ['GDPR'],
        pricing: { model: 'free' },
        content: { templateCount: 12, playbookCount: 5 },
        status: 'published',
        publishedAt: '2026-03-01T00:00:00Z',
      },
      {
        name: 'EU AI Act High-Risk Framework',
        description: 'Comprehensive compliance framework for EU AI Act high-risk AI systems with Articles 9-15 controls',
        longDescription: 'Full implementation of EU AI Act requirements for high-risk systems including risk management, data governance, logging, transparency, human oversight, and accuracy controls.',
        type: 'audit_framework',
        version: '1.3.0',
        publisher: { id: 'pub_datacendia', name: 'Datacendia', type: 'datacendia', verified: true, trustScore: 98 },
        category: 'AI Governance',
        tags: ['eu-ai-act', 'high-risk', 'ai-governance'],
        frameworks: ['EU AI Act'],
        pricing: { model: 'free' },
        content: { controlCount: 28, automatedChecks: 15 },
        status: 'published',
        publishedAt: '2026-02-15T00:00:00Z',
      },
      {
        name: 'SOC 2 Type II Automation Pack',
        description: 'Automated evidence collection and continuous monitoring for SOC 2 Type II compliance',
        longDescription: 'Pre-configured agents and playbooks that continuously collect evidence for all 5 Trust Services Categories: Security, Availability, Processing Integrity, Confidentiality, Privacy.',
        type: 'agent_config',
        version: '3.0.1',
        publisher: { id: 'pub_datacendia', name: 'Datacendia', type: 'datacendia', verified: true, trustScore: 98 },
        category: 'Security',
        tags: ['soc2', 'audit', 'automation', 'evidence'],
        frameworks: ['SOC 2'],
        pricing: { model: 'freemium' },
        content: { agentCount: 5, playbookCount: 8 },
        status: 'published',
        publishedAt: '2026-01-20T00:00:00Z',
      },
      {
        name: 'Financial Services AML/KYC Pack',
        description: 'Anti-money laundering and Know Your Customer policies for banking and financial services',
        longDescription: 'Industry-standard AML/KYC compliance package with transaction monitoring rules, customer due diligence workflows, and regulatory reporting templates.',
        type: 'policy',
        version: '1.5.0',
        publisher: { id: 'pub_finreg', name: 'FinReg Partners', type: 'partner', verified: true, trustScore: 92 },
        category: 'Financial Services',
        tags: ['aml', 'kyc', 'banking', 'financial'],
        frameworks: ['AML/KYC', 'MiFID II'],
        pricing: { model: 'paid', price: 2500, currency: 'USD' },
        content: { policyCount: 8, workflowCount: 12 },
        status: 'published',
        publishedAt: '2026-03-10T00:00:00Z',
      },
      {
        name: 'DORA Resilience Playbook',
        description: 'Digital Operational Resilience Act playbooks for ICT risk management and incident reporting',
        longDescription: 'Complete DORA compliance toolkit with ICT risk management framework, incident classification and reporting templates, and third-party risk assessment workflows.',
        type: 'playbook',
        version: '1.1.0',
        publisher: { id: 'pub_datacendia', name: 'Datacendia', type: 'datacendia', verified: true, trustScore: 98 },
        category: 'Financial Services',
        tags: ['dora', 'resilience', 'ict', 'banking'],
        frameworks: ['DORA'],
        pricing: { model: 'free' },
        content: { playbookCount: 6, templateCount: 4 },
        status: 'published',
        publishedAt: '2026-03-20T00:00:00Z',
      },
      {
        name: 'HIPAA Privacy & Security Pack',
        description: 'Healthcare compliance package for HIPAA Privacy and Security Rules',
        longDescription: 'Pre-built policies, monitoring agents, and audit templates for HIPAA compliance covering PHI handling, access controls, breach notification, and business associate agreements.',
        type: 'template',
        version: '2.0.0',
        publisher: { id: 'pub_healthcomp', name: 'HealthComp Solutions', type: 'partner', verified: true, trustScore: 90 },
        category: 'Healthcare',
        tags: ['hipaa', 'phi', 'healthcare', 'privacy'],
        frameworks: ['HIPAA'],
        pricing: { model: 'paid', price: 1500, currency: 'USD' },
        content: { templateCount: 10, agentCount: 3 },
        status: 'published',
        publishedAt: '2026-02-28T00:00:00Z',
      },
    ];

    for (const pkg of builtIns) {
      const id = `pkg_${crypto.randomUUID().split('-')[0]}`;
      const now = new Date().toISOString();
      this.packages.set(id, {
        id,
        ...pkg,
        stats: {
          downloads: Math.floor(Math.random() * 500 + 50),
          activeInstalls: Math.floor(Math.random() * 200 + 20),
          rating: 4.0 + Math.random(),
          reviewCount: Math.floor(Math.random() * 30 + 5),
        },
        createdAt: now,
        updatedAt: now,
      });
    }
  }
}

export const complianceMarketplace = new ComplianceMarketplaceService();
export { ComplianceMarketplaceService };
