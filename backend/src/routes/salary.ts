// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

// =============================================================================
// MARKET SALARY API ROUTES
// Endpoints for salary data lookup and negotiation preparation
// =============================================================================

import express, { Request, Response, Router } from 'express';
import { authenticate } from '../middleware/auth.js';
import { logger } from '../utils/logger.js';
import marketSalaryService, { SalaryQuery } from '../services/MarketSalaryService.js';

const router: Router = express.Router();

// =============================================================================
// SALARY LOOKUP
// =============================================================================

// Get salary data for a role
router.post('/lookup', authenticate, async (req: Request, res: Response) => {
  try {
    const query: SalaryQuery = {
      title: req.body.title,
      level: req.body.level,
      location: req.body.location,
      industry: req.body.industry,
      yearsExperience: req.body.yearsExperience,
      skills: req.body.skills,
      companySize: req.body.companySize,
    };

    if (!query.title) {
      return res.status(400).json({ error: 'Job title is required' });
    }

    const data = await marketSalaryService.getSalaryData(query);
    
    logger.info(`Salary lookup: ${query.title} - ${query.location || 'national'}`);
    res.json({ data });
  } catch (error) {
    logger.error('Salary lookup failed:', error);
    res.status(500).json({ error: 'Failed to get salary data' });
  }
});

// Get salary data (GET version for simple lookups)
router.get('/lookup', authenticate, async (req: Request, res: Response) => {
  try {
    const query: SalaryQuery = {
      title: req.query.title as string,
      level: req.query.level as string | undefined,
      location: req.query.location as string | undefined,
      industry: req.query.industry as string | undefined,
      yearsExperience: req.query.yearsExperience ? parseInt(req.query.yearsExperience as string) : undefined,
      companySize: req.query.companySize as SalaryQuery['companySize'] | undefined,
    };

    if (!query.title) {
      return res.status(400).json({ error: 'Job title is required' });
    }

    const data = await marketSalaryService.getSalaryData(query);
    res.json({ data });
  } catch (error) {
    logger.error('Salary lookup failed:', error);
    res.status(500).json({ error: 'Failed to get salary data' });
  }
});

// =============================================================================
// BENCHMARKING
// =============================================================================

// Benchmark current compensation against market
router.post('/benchmark', authenticate, async (req: Request, res: Response) => {
  try {
    const { currentSalary, title, level, location, industry, yearsExperience, companySize } = req.body;

    if (!currentSalary || !title) {
      return res.status(400).json({ error: 'Current salary and job title are required' });
    }

    const query: SalaryQuery = { title, level, location, industry, yearsExperience, companySize };
    const benchmark = await marketSalaryService.benchmarkCompensation(currentSalary, query);
    
    logger.info(`Benchmark: ${title} at $${currentSalary} = ${benchmark.percentile}th percentile`);
    res.json({ benchmark });
  } catch (error) {
    logger.error('Benchmark failed:', error);
    res.status(500).json({ error: 'Failed to benchmark compensation' });
  }
});

// =============================================================================
// NEGOTIATION PREP
// =============================================================================

// Prepare negotiation data
router.post('/negotiate', authenticate, async (req: Request, res: Response) => {
  try {
    const { currentSalary, title, level, location, industry, yearsExperience, companySize } = req.body;

    if (!currentSalary || !title) {
      return res.status(400).json({ error: 'Current salary and job title are required' });
    }

    const query: SalaryQuery = { title, level, location, industry, yearsExperience, companySize };
    const negotiation = await marketSalaryService.prepareNegotiation(currentSalary, query);
    
    logger.info(`Negotiation prep: ${title} from $${currentSalary} targeting $${negotiation.targetRange.target}`);
    res.json({ negotiation });
  } catch (error) {
    logger.error('Negotiation prep failed:', error);
    res.status(500).json({ error: 'Failed to prepare negotiation' });
  }
});

// Get full negotiation package (salary + benchmark + negotiation)
router.post('/negotiate/full', authenticate, async (req: Request, res: Response) => {
  try {
    const { currentSalary, title, level, location, industry, yearsExperience, companySize } = req.body;

    if (!currentSalary || !title) {
      return res.status(400).json({ error: 'Current salary and job title are required' });
    }

    const query: SalaryQuery = { title, level, location, industry, yearsExperience, companySize };
    
    const [marketData, benchmark, negotiation] = await Promise.all([
      marketSalaryService.getSalaryData(query),
      marketSalaryService.benchmarkCompensation(currentSalary, query),
      marketSalaryService.prepareNegotiation(currentSalary, query),
    ]);
    
    res.json({
      market: marketData,
      benchmark,
      negotiation,
      summary: {
        currentSalary,
        marketMedian: marketData.range.median,
        percentile: benchmark.percentile,
        targetSalary: negotiation.targetRange.target,
        potentialIncrease: negotiation.targetRange.target - currentSalary,
        potentialIncreasePercent: Math.round(((negotiation.targetRange.target - currentSalary) / currentSalary) * 100),
      },
    });
  } catch (error) {
    logger.error('Full negotiation prep failed:', error);
    res.status(500).json({ error: 'Failed to prepare negotiation package' });
  }
});

// =============================================================================
// COMPARISONS
// =============================================================================

// Compare multiple roles
router.post('/compare', authenticate, async (req: Request, res: Response) => {
  try {
    const { roles } = req.body;

    if (!roles || !Array.isArray(roles) || roles.length === 0) {
      return res.status(400).json({ error: 'Array of roles is required' });
    }

    const comparison = await marketSalaryService.compareRoles(roles);
    res.json({ comparison });
  } catch (error) {
    logger.error('Role comparison failed:', error);
    res.status(500).json({ error: 'Failed to compare roles' });
  }
});

// Get career progression salary data
router.get('/progression/:title', authenticate, async (req: Request, res: Response) => {
  try {
    const { title } = req.params;
    const { location } = req.query;

    const progression = await marketSalaryService.getCareerProgression(title, location as string | undefined);
    res.json({ progression });
  } catch (error) {
    logger.error('Career progression lookup failed:', error);
    res.status(500).json({ error: 'Failed to get career progression' });
  }
});

// =============================================================================
// QUICK LOOKUPS
// =============================================================================

// Quick lookup - software engineer levels
router.get('/quick/software-engineer', authenticate, async (req: Request, res: Response) => {
  try {
    const { location } = req.query;
    const progression = await marketSalaryService.getCareerProgression('software engineer', location as string | undefined);
    res.json({ 
      title: 'Software Engineer',
      location: location || 'National',
      progression,
    });
  } catch (error) {
    logger.error('Quick lookup failed:', error);
    res.status(500).json({ error: 'Failed to get data' });
  }
});

// Quick lookup - data scientist levels
router.get('/quick/data-scientist', authenticate, async (req: Request, res: Response) => {
  try {
    const { location } = req.query;
    const progression = await marketSalaryService.getCareerProgression('data scientist', location as string | undefined);
    res.json({ 
      title: 'Data Scientist',
      location: location || 'National',
      progression,
    });
  } catch (error) {
    logger.error('Quick lookup failed:', error);
    res.status(500).json({ error: 'Failed to get data' });
  }
});

// Quick lookup - product manager levels
router.get('/quick/product-manager', authenticate, async (req: Request, res: Response) => {
  try {
    const { location } = req.query;
    const progression = await marketSalaryService.getCareerProgression('product manager', location as string | undefined);
    res.json({ 
      title: 'Product Manager',
      location: location || 'National',
      progression,
    });
  } catch (error) {
    logger.error('Quick lookup failed:', error);
    res.status(500).json({ error: 'Failed to get data' });
  }
});

export default router;
