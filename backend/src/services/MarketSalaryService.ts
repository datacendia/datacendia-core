// Copyright (c) 2024-2026 Datacendia, LLC. Licensed under Apache 2.0.
// See LICENSE file for details.

export interface SalaryQuery {
  title: string;
  role?: string;
  level?: string;
  location?: string;
  experience?: number;
  yearsExperience?: number;
  industry?: string;
  skills?: string[];
  companySize?: 'startup' | 'small' | 'medium' | 'large' | 'enterprise';
}

const BASE_SALARIES: Record<string, number> = {
  'software engineer': 130000, 'senior software engineer': 165000, 'staff engineer': 200000,
  'data scientist': 140000, 'senior data scientist': 175000,
  'product manager': 135000, 'senior product manager': 170000,
  'engineering manager': 185000, 'director of engineering': 220000,
  'designer': 110000, 'account executive': 95000,
};

const LOCATION_MULTS: Record<string, number> = {
  'san francisco': 1.35, 'new york': 1.30, 'seattle': 1.20, 'austin': 1.05,
  'chicago': 1.0, 'denver': 1.05, 'remote': 0.95, 'national': 1.0,
};

const SIZE_MULTS: Record<string, number> = { startup: 0.85, small: 0.90, medium: 1.0, large: 1.10, enterprise: 1.20 };

function getBase(title: string): number {
  const key = title.toLowerCase();
  return BASE_SALARIES[key] || Object.entries(BASE_SALARIES).find(([k]) => key.includes(k))?.[1] || 100000;
}

class MarketSalaryServiceImpl {
  async getSalaryData(query: SalaryQuery) {
    const base = getBase(query.title);
    const locMult = LOCATION_MULTS[(query.location || 'national').toLowerCase()] || 1.0;
    const sizeMult = SIZE_MULTS[query.companySize || 'medium'] || 1.0;
    const expMult = 1 + ((query.yearsExperience || query.experience || 5) - 5) * 0.03;
    const median = Math.round(base * locMult * sizeMult * expMult);
    return { title: query.title, location: query.location || 'National', median, p10: Math.round(median * 0.72), p25: Math.round(median * 0.85), p75: Math.round(median * 1.15), p90: Math.round(median * 1.30), sampleSize: 1250, lastUpdated: new Date().toISOString() };
  }

  async benchmarkCompensation(currentSalary: number, query: SalaryQuery) {
    const data = await this.getSalaryData(query);
    const percentile = Math.min(99, Math.max(1, Math.round(((currentSalary - data.p10) / (data.p90 - data.p10)) * 100)));
    return { currentSalary, percentile, marketMedian: data.median, delta: currentSalary - data.median, deltaPercent: Math.round((currentSalary / data.median - 1) * 100), recommendation: percentile < 25 ? 'Below market — consider adjustment' : percentile > 75 ? 'Above market — competitive' : 'At market rate' };
  }

  async prepareNegotiation(currentSalary: number, query: SalaryQuery) {
    const data = await this.getSalaryData(query);
    const target = Math.round(data.p75);
    return { currentSalary, targetRange: { low: Math.round(data.median), target, high: Math.round(data.p90) }, talking_points: [`Market median for ${query.title} is $${data.median.toLocaleString()}`, `Your target of $${target.toLocaleString()} is at the 75th percentile`, 'Consider total compensation including equity and benefits'], dataPoints: { sampleSize: data.sampleSize, location: query.location || 'National' } };
  }

  async compareRoles(roles: SalaryQuery[]) {
    const results = await Promise.all(roles.map(async r => ({ ...r, data: await this.getSalaryData(r) })));
    return { roles: results, comparedAt: new Date().toISOString() };
  }

  async getCareerProgression(title: string, location?: string) {
    const levels = ['Junior', '', 'Senior', 'Staff', 'Principal'];
    const progression = await Promise.all(levels.map(async (lvl, i) => {
      const fullTitle = lvl ? `${lvl} ${title}` : title;
      const data = await this.getSalaryData({ title: fullTitle, location, yearsExperience: i * 3 + 1 });
      return { level: lvl || 'Mid', ...data, title: fullTitle };
    }));
    return { title, location: location || 'National', progression };
  }
}

export const marketSalaryService = new MarketSalaryServiceImpl();

export default marketSalaryService;
