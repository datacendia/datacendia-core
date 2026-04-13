// Copyright (c) 2024-2026 Datacendia, LLC. Licensed under Apache 2.0.
// See LICENSE file for details.

import crypto from 'crypto';
import { deterministicPick } from '../../utils/deterministic.js';

class CendiaLegacyServiceImpl {
  private articles = new Map<string, any>();
  private memories: any[] = [];
  private experts: any[] = [];
  private transfers: any[] = [];

  async getDashboard(orgId: string) {
    const arts = this.getArticlesForOrg(orgId);
    return { organizationId: orgId, totalArticles: arts.length, published: arts.filter((a: any) => a.status === 'published').length, memories: this.memories.filter(m => m.organizationId === orgId).length, experts: this.experts.filter(e => e.organizationId === orgId).length };
  }

  getArticlesForOrg(orgId: string, filters?: any) {
    let results = [...this.articles.values()].filter(a => a.organizationId === orgId);
    if (filters?.category) results = results.filter(a => a.category === filters.category);
    if (filters?.status) results = results.filter(a => a.status === filters.status);
    return results;
  }

  getArticle(id: string) { return this.articles.get(id) || null; }

  async getVersionHistory(articleId: string) {
    const article = this.articles.get(articleId);
    if (!article) throw new Error('Article not found');
    return article.versions || [{ version: 1, content: article.content, editedAt: article.createdAt }];
  }

  getMemoriesForOrg(orgId: string, type?: string) {
    let results = this.memories.filter(m => m.organizationId === orgId);
    if (type) results = results.filter(m => m.type === type);
    return results;
  }

  findExperts(orgId: string, area?: string) {
    let results = this.experts.filter(e => e.organizationId === orgId);
    if (area) results = results.filter(e => e.areas?.includes(area));
    return results;
  }

  getTransfersForOrg(orgId: string) { return this.transfers.filter(t => t.organizationId === orgId); }

  async search(orgId: string, query: string) {
    const articles = this.getArticlesForOrg(orgId).filter((a: any) => JSON.stringify(a).toLowerCase().includes(query.toLowerCase()));
    return { query, results: articles, totalResults: articles.length };
  }
}

export const cendiaLegacyService = new CendiaLegacyServiceImpl();
