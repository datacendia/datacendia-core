// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

// =============================================================================
// DATACENDIA - SEO COMPONENT
// Dynamic page titles, meta tags, Open Graph, and structured data
// =============================================================================

import { useEffect, useMemo } from 'react';
import { useLocation } from 'react-router-dom';

// =============================================================================
// TYPES
// =============================================================================

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string[];
  image?: string;
  type?: 'website' | 'article' | 'product';
  noIndex?: boolean;
  structuredData?: Record<string, unknown>;
}

interface PageSEOConfig {
  title: string;
  description: string;
  keywords: string[];
}

// =============================================================================
// DEFAULT SEO CONFIG
// =============================================================================

const SITE_NAME = 'Datacendia';
const DEFAULT_DESCRIPTION =
  'Enterprise Intelligence Platform - Transform your organization with AI-powered decision intelligence, predictive analytics, and automated workflows.';
const DEFAULT_IMAGE = '/og-image.svg';
const SITE_URL = typeof window !== 'undefined' ? window.location.origin : 'https://datacendia.com';

// Page-specific SEO configurations
const PAGE_SEO: Record<string, PageSEOConfig> = {
  '/': {
    title: 'Datacendia - Enterprise Intelligence Platform',
    description:
      'Transform your organization with AI-powered decision intelligence. Real-time analytics, predictive insights, and automated workflows for modern enterprises.',
    keywords: [
      'enterprise intelligence',
      'AI analytics',
      'business intelligence',
      'decision support',
      'predictive analytics',
    ],
  },
  '/cortex/dashboard': {
    title: 'Dashboard | Datacendia',
    description:
      "Your organization's health at a glance. Real-time metrics, alerts, and KPIs powered by AI intelligence.",
    keywords: [
      'dashboard',
      'analytics dashboard',
      'KPIs',
      'business metrics',
      'real-time monitoring',
    ],
  },
  '/cortex/council': {
    title: 'The Council - AI Decision Intelligence | Datacendia',
    description:
      'Consult our AI Council of expert agents for strategic decisions. Get multi-perspective analysis from specialized AI personas.',
    keywords: [
      'AI council',
      'decision intelligence',
      'AI agents',
      'strategic planning',
      'executive AI',
    ],
  },
  '/cortex/graph': {
    title: 'Knowledge Graph Explorer | Datacendia',
    description:
      "Visualize and explore your organization's knowledge graph. Discover relationships, lineage, and data dependencies.",
    keywords: [
      'knowledge graph',
      'data lineage',
      'entity relationships',
      'data visualization',
      'graph analytics',
    ],
  },
  '/cortex/pulse': {
    title: 'The Pulse - Real-Time Monitoring | Datacendia',
    description:
      'Real-time organizational health monitoring. Track anomalies, system status, and performance metrics.',
    keywords: [
      'real-time monitoring',
      'health monitoring',
      'anomaly detection',
      'system status',
      'alerts',
    ],
  },
  '/cortex/lens': {
    title: 'The Lens - Predictive Analytics | Datacendia',
    description:
      'Scenario simulation and predictive analytics. Forecast outcomes and explore what-if scenarios.',
    keywords: [
      'predictive analytics',
      'scenario planning',
      'forecasting',
      'what-if analysis',
      'simulation',
    ],
  },
  '/cortex/bridge': {
    title: 'The Bridge - Workflow Automation | Datacendia',
    description:
      'Automate workflows with AI-powered orchestration. Connect systems, manage approvals, and streamline operations.',
    keywords: [
      'workflow automation',
      'process automation',
      'integrations',
      'orchestration',
      'business automation',
    ],
  },
  '/login': {
    title: 'Sign In | Datacendia',
    description:
      'Sign in to your Datacendia account to access enterprise intelligence tools and analytics.',
    keywords: ['login', 'sign in', 'enterprise analytics'],
  },
  '/pricing': {
    title: 'Pricing | Datacendia',
    description: 'Flexible pricing plans for teams of all sizes. Start free and scale as you grow.',
    keywords: [
      'pricing',
      'enterprise pricing',
      'AI platform pricing',
      'business intelligence cost',
    ],
  },
};

// =============================================================================
// SEO COMPONENT
// =============================================================================

export function SEO({
  title,
  description,
  keywords = [],
  image = DEFAULT_IMAGE,
  type = 'website',
  noIndex = false,
  structuredData,
}: SEOProps) {
  const location = useLocation();
  const pathname = location.pathname;

  // Get page-specific config or use defaults
  const pageConfig = PAGE_SEO[pathname] || {
    title: title || `${SITE_NAME} - Enterprise Intelligence`,
    description: description || DEFAULT_DESCRIPTION,
    keywords: keywords,
  };

  const finalTitle = title || pageConfig.title;
  const finalDescription = description || pageConfig.description;
  const finalKeywords = useMemo(() => [...pageConfig.keywords, ...keywords], [pageConfig.keywords, keywords]);
  const canonicalUrl = `${SITE_URL}${pathname}`;

  useEffect(() => {
    // Update document title
    document.title = finalTitle;

    // Helper to set meta tag
    const setMeta = (name: string, content: string, property = false) => {
      const attr = property ? 'property' : 'name';
      let meta = document.querySelector(`meta[${attr}="${name}"]`) as HTMLMetaElement;
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute(attr, name);
        document.head.appendChild(meta);
      }
      meta.content = content;
    };

    // Basic meta tags
    setMeta('description', finalDescription);
    setMeta('keywords', finalKeywords.join(', '));

    // Robots
    setMeta('robots', noIndex ? 'noindex, nofollow' : 'index, follow');

    // Open Graph
    setMeta('og:title', finalTitle, true);
    setMeta('og:description', finalDescription, true);
    setMeta('og:type', type, true);
    setMeta('og:url', canonicalUrl, true);
    setMeta('og:image', image.startsWith('http') ? image : `${SITE_URL}${image}`, true);
    setMeta('og:site_name', SITE_NAME, true);
    setMeta('og:locale', 'en_US', true);

    // Twitter Card
    setMeta('twitter:card', 'summary_large_image');
    setMeta('twitter:title', finalTitle);
    setMeta('twitter:description', finalDescription);
    setMeta('twitter:image', image.startsWith('http') ? image : `${SITE_URL}${image}`);

    // Canonical URL
    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.rel = 'canonical';
      document.head.appendChild(canonical);
    }
    canonical.href = canonicalUrl;

    // Structured Data (JSON-LD)
    const defaultStructuredData = {
      '@context': 'https://schema.org',
      '@type': 'WebApplication',
      name: SITE_NAME,
      description: finalDescription,
      url: SITE_URL,
      applicationCategory: 'BusinessApplication',
      operatingSystem: 'Web Browser',
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'USD',
      },
      creator: {
        '@type': 'Organization',
        name: SITE_NAME,
        url: SITE_URL,
      },
    };

    let scriptTag = document.querySelector(
      'script[type="application/ld+json"]'
    ) as HTMLScriptElement;
    if (!scriptTag) {
      scriptTag = document.createElement('script');
      scriptTag.type = 'application/ld+json';
      document.head.appendChild(scriptTag);
    }
    scriptTag.textContent = JSON.stringify(structuredData || defaultStructuredData);

    // Cleanup on unmount
    return () => {
      // Reset to default on page change (optional)
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    finalTitle,
    finalDescription,
    finalKeywords,
    canonicalUrl,
    image,
    type,
    noIndex,
    structuredData,
  ]);

  return null; // This component doesn't render anything
}

// =============================================================================
// PAGE-SPECIFIC SEO HOOKS
// =============================================================================

export function useSEO(config: SEOProps) {
  const location = useLocation();

  useEffect(() => {
    const pageConfig = PAGE_SEO[location.pathname];
    const title = config.title || pageConfig?.title || `Datacendia`;
    const description = config.description || pageConfig?.description || DEFAULT_DESCRIPTION;

    document.title = title;

    // Update meta description
    let metaDesc = document.querySelector('meta[name="description"]') as HTMLMetaElement;
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.name = 'description';
      document.head.appendChild(metaDesc);
    }
    metaDesc.content = description;
  }, [location.pathname, config]);
}

// =============================================================================
// BREADCRUMB STRUCTURED DATA
// =============================================================================

export function BreadcrumbStructuredData({ items }: { items: { name: string; url: string }[] }) {
  useEffect(() => {
    const breadcrumbData = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: items.map((item, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: item.name,
        item: item.url,
      })),
    };

    let scriptTag = document.querySelector('script[data-type="breadcrumb"]') as HTMLScriptElement;
    if (!scriptTag) {
      scriptTag = document.createElement('script');
      scriptTag.type = 'application/ld+json';
      scriptTag.setAttribute('data-type', 'breadcrumb');
      document.head.appendChild(scriptTag);
    }
    scriptTag.textContent = JSON.stringify(breadcrumbData);

    return () => {
      scriptTag?.remove();
    };
  }, [items]);

  return null;
}

export default SEO;
