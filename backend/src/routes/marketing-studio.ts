/**
 * API Routes — Marketing Studio
 *
 * Express route handler defining REST endpoints.
 * @module routes/marketing-studio
 */

﻿// Copyright (c) 2024-2026 Datacendia, LLC. Licensed under Apache 2.0.
// See LICENSE file for details.

/**
 * Marketing Studio API Routes
 * 
 * AI-powered marketing content generation:
 * - Video scripts
 * - Image prompts (DALL-E, Midjourney, Stable Diffusion)
 * - Pitch decks
 * - Marketing copy (email, social, blog, landing pages)
 */

import { Router, Request, Response } from 'express';
import { logger } from '../utils/logger.js';
import ollamaService from '../services/ollama.js';

const router = Router();

// =============================================================================
// TEMPLATE FALLBACKS — used when Ollama is unavailable or slow
// =============================================================================

function videoScriptTemplate(topic: string, duration: string, targetAudience: string) {
  return {
    title: `${topic} — ${duration}s Video`,
    duration: `${duration}s`,
    targetAudience,
    script: {
      hook: `Every enterprise faces the same invisible risk: decisions made without proof. ${topic} changes that.`,
      problem: `Organizations lose millions annually to unauditable decisions, compliance gaps, and institutional amnesia.`,
      solution: `Datacendia's Sovereign Intelligence Platform captures every deliberation, cryptographically signs every decision, and proves compliance across jurisdictions — all on infrastructure you own.`,
      demo: `Watch as The Council — our multi-agent deliberation engine — analyzes a real scenario, generates a decision packet with Merkle-tree integrity, and exports a regulator-ready receipt in under 60 seconds.`,
      cta: `Request a live demo at datacendia.com. Your decisions deserve proof.`,
    },
    visualNotes: [
      'Open on dramatic enterprise office establishing shot',
      'Split-screen: traditional vs Datacendia decision flow',
      'Screen recording of Council deliberation interface',
      'Zoom into cryptographic signature and Merkle tree visualization',
      'End card with logo, URL, and CTA button',
    ],
    voiceoverNotes: 'Professional, authoritative tone. Measured pace. Let the product speak for itself.',
  };
}

function imagePromptTemplate(purpose: string, platform: string, style: string) {
  const base: any = {
    purpose,
    platform,
    prompt: `Professional ${style} visualization of ${purpose}, enterprise software dashboard with glowing data streams, dark sophisticated UI with gold accent highlights, volumetric lighting, photorealistic 8K render --ar 16:9`,
    style,
    aspectRatio: '16:9',
  };
  if (platform === 'stable-diffusion') {
    base.negativePrompt = 'cartoon, anime, low quality, blurry, distorted text, watermark, stock photo, generic, clip art';
  }
  return base;
}

function pitchDeckTemplate(audience: string) {
  const isSportsPartner = audience.toLowerCase().includes('sports') || audience.toLowerCase().includes('regulator') || audience.toLowerCase().includes('club');
  
  const slides = isSportsPartner ? [
    { slideNumber: 1, title: 'Datacendia — Sovereign Intelligence Platform', content: ['33 Design Partners · 6,600+ Regulatory Scenarios · 4 Live Sandbox Demos', 'On-premise, quantum-resistant, forensic-grade, independently verifiable', 'Zero cloud dependency'], visualSuggestion: 'Dark hero slide with Datacendia logo', speakerNotes: 'Open with our massive traction: 33 partners across football, UFC, NFL, World Rugby.' },
    { slideNumber: 2, title: 'Your Regulatory Challenges', content: ['Multiple compliance frameworks across jurisdictions', 'Risk of sanctions and legal disputes', 'Need for mathematical proof of decisions', 'Auditor and regulator skepticism'], visualSuggestion: 'Regulatory compliance pain points', speakerNotes: 'Focus on their specific regulatory pain points.' },
    { slideNumber: 3, title: 'Live Sandbox Demos', content: ['Celtic FC Sandbox (/sandbox/celtic) — 5 multi-agent scenarios', 'UEFA Sandbox (/sandbox/uefa) — 5 regulator scenarios for Čeferin', 'FIFA Sandbox (/sandbox/fifa) — 5 World Cup scenarios for Infantino', 'CONMEBOL Sandbox (/sandbox/conmebol) — Spanish i18n support'], visualSuggestion: '4 sandbox screenshots with scenario selectors', speakerNotes: 'Show the live demos — these are our most powerful sales tools.' },
    { slideNumber: 4, title: '200+ Scenarios Per Partner', content: ['Decision Type, Problem, Datacendia Solution, Applicable Regulations', 'Mapped to real regulatory requirements', 'CAS-ready evidence bundles', 'Regulator\'s Receipt cryptographic proof'], visualSuggestion: 'Scenario documentation example', speakerNotes: 'Show the depth of our regulatory expertise.' },
    { slideNumber: 5, title: 'Config-Driven Sandbox Creation', content: ['Drop in config file → Instant sandbox demo', 'Isolated URLs + unique access keys', 'i18n support (Spanish for CONMEBOL)', 'Template system for rapid org onboarding'], visualSuggestion: 'Config file screenshot + sandbox creation flow', speakerNotes: 'This is our revolutionary differentiator — sandboxes in minutes, not months.' },
    { slideNumber: 6, title: '33 Design Partners', content: ['Football: Celtic, Barcelona, Real Madrid, Man United, Liverpool, AC Milan, PSG, Ajax, Benfica', 'Governing Bodies: UEFA, FIFA, CONMEBOL', 'Sports: NFL, UFC, World Rugby', 'Each with 200+ detailed regulatory scenarios'], visualSuggestion: 'Grid of partner logos', speakerNotes: 'We have unprecedented access across sports and regulators.' },
    { slideNumber: 7, title: 'Sovereign Shield Technology', content: ['CJEU compliance (transparent, objective, non-discriminatory, proportionate)', 'CAS-ready evidence bundles', 'Post-quantum cryptography (ML-DSA-65)', 'Zero-knowledge proof systems'], visualSuggestion: 'Sovereign Shield architecture', speakerNotes: 'This is our regulatory moat.' },
    { slideNumber: 8, title: 'Business Model', content: ['Annual enterprise licenses ($150K-$1.5M)', 'On-premise deployment — customer owns everything', 'Professional services for vertical customization', 'Sandbox-as-a-Service for design partners'], visualSuggestion: 'Pricing tier diagram', speakerNotes: 'We sell infrastructure, not SaaS subscriptions.' },
    { slideNumber: 9, title: 'Proven Results', content: ['33 design partners signed', '6,600+ regulatory scenarios mapped', '4 live sandbox demos deployed', 'Multi-sport expansion complete'], visualSuggestion: 'Dashboard metrics screenshot', speakerNotes: 'The platform is proven. The partners are real. The demos work.' },
    { slideNumber: 10, title: 'Your Competitive Advantage', content: ['Mathematical proof of every decision', 'Regulator-ready evidence bundles', 'Live sandbox demos for your stakeholders', 'Config-driven rapid deployment'], visualSuggestion: 'Competitive differentiator matrix', speakerNotes: 'No competitor offers what we do.' },
    { slideNumber: 11, title: 'Next Steps', content: ['Schedule a live sandbox demo', 'Custom scenario development', 'Pilot deployment planning', 'Regulatory compliance mapping'], visualSuggestion: 'Implementation timeline', speakerNotes: 'Be specific about what happens next.' },
    { slideNumber: 12, title: 'Contact', content: ['datacendia.com', 'stuart.rainey@datacendia.com', 'Request a live sandbox demo today'], visualSuggestion: 'Clean closing slide with QR code', speakerNotes: 'Leave with a clear next step.' },
  ] : [
    { slideNumber: 1, title: 'Datacendia — Sovereign Intelligence Platform', content: ['33 Design Partners · 6,600+ Regulatory Scenarios · 4 Live Sandbox Demos', 'On-premise, quantum-resistant, forensic-grade, independently verifiable', 'Zero cloud dependency'], visualSuggestion: 'Dark hero slide with Datacendia logo', speakerNotes: 'Open with our massive traction: 33 partners across football, UFC, NFL, World Rugby.' },
    { slideNumber: 2, title: 'The Problem', content: ['$4.2T annual cost of poor enterprise decisions', 'Regulatory fines increasing 300% since 2020', 'AI adoption without governance = liability'], visualSuggestion: 'Infographic with cost statistics', speakerNotes: 'Ground the problem in real financial impact.' },
    { slideNumber: 3, title: 'Live Sandbox Demos', content: ['Celtic FC Sandbox (/sandbox/celtic) — 5 multi-agent scenarios', 'UEFA Sandbox (/sandbox/uefa) — 5 regulator scenarios for Čeferin', 'FIFA Sandbox (/sandbox/fifa) — 5 World Cup scenarios for Infantino', 'CONMEBOL Sandbox (/sandbox/conmebol) — Spanish i18n support'], visualSuggestion: '4 sandbox screenshots with scenario selectors', speakerNotes: 'Show the live demos — these are our most powerful sales tools.' },
    { slideNumber: 4, title: 'Our Solution', content: ['Multi-agent deliberation engine (The Council)', 'Cryptographic decision packets with Merkle integrity', 'Cross-jurisdiction compliance across 17 regions'], visualSuggestion: 'Product screenshot of Council interface', speakerNotes: 'Show, dont tell. This is where the demo begins.' },
    { slideNumber: 5, title: 'Config-Driven Sandbox Creation', content: ['Drop in config file → Instant sandbox demo', 'Isolated URLs + unique access keys', 'i18n support (Spanish for CONMEBOL)', 'Template system for rapid org onboarding'], visualSuggestion: 'Config file screenshot + sandbox creation flow', speakerNotes: 'This is our revolutionary differentiator — sandboxes in minutes, not months.' },
    { slideNumber: 6, title: '33 Design Partners', content: ['Football: Celtic, Barcelona, Real Madrid, Man United, Liverpool, AC Milan, PSG, Ajax, Benfica', 'Governing Bodies: UEFA, FIFA, CONMEBOL', 'Sports: NFL, UFC, World Rugby', 'Each with 200+ detailed regulatory scenarios'], visualSuggestion: 'Grid of partner logos', speakerNotes: 'We have unprecedented access across sports and regulators.' },
    { slideNumber: 7, title: 'Market Opportunity', content: ['$150B+ Enterprise Intelligence market', '33 sports verticals with regulatory pressure', 'AI governance mandatory under EU AI Act', 'First-mover in sovereign AI decision infrastructure'], visualSuggestion: 'Market size chart with sports verticals', speakerNotes: 'This is not optional — regulation is forcing adoption across all industries.' },
    { slideNumber: 8, title: 'Business Model', content: ['Annual enterprise licenses ($150K-$1.5M)', 'On-premise deployment — customer owns everything', 'Professional services for vertical customization', 'Sandbox-as-a-Service for design partners'], visualSuggestion: 'Pricing tier diagram', speakerNotes: 'We sell infrastructure, not SaaS subscriptions.' },
    { slideNumber: 9, title: 'Traction', content: ['33 design partners signed', '6,600+ regulatory scenarios mapped', '4 live sandbox demos deployed', 'Multi-sport expansion complete'], visualSuggestion: 'Dashboard metrics screenshot', speakerNotes: 'The platform is proven. The partners are real. The demos work.' },
    { slideNumber: 10, title: 'Competitive Landscape', content: ['No direct competitor combines AI governance + sovereign deployment', 'Palantir = analytics, not governance', 'ServiceNow GRC = checkbox compliance, not AI-native', 'Only Datacendia has live sandbox demos'], visualSuggestion: 'Competitive matrix', speakerNotes: 'We occupy a category of one with real, working demos.' },
    { slideNumber: 11, title: 'The Ask', content: ['Seeking design partners for sandbox deployments', 'Target: 10 new verticals in 2026', 'ROI: reduce compliance cost 40%, eliminate audit failures'], visualSuggestion: 'Timeline with milestones', speakerNotes: 'Be specific about what you need and what they get.' },
    { slideNumber: 12, title: 'Contact', content: ['datacendia.com', 'stuart.rainey@datacendia.com', 'Request a live sandbox demo today'], visualSuggestion: 'Clean closing slide with QR code', speakerNotes: 'Leave with a clear next step.' },
  ];
  return { audience, slides };
}

function copyTemplate(type: string, topic: string) {
  return {
    type,
    headline: `${topic}: Why 33 Design Partners Trust Datacendia`,
    body: `With 33 design partners across football, UFC, NFL, and World Rugby, Datacendia has proven its sovereign AI governance platform at the highest levels of sport and regulation. Our live sandbox demos for Celtic FC, UEFA, FIFA, and CONMEBOL showcase 6,600+ detailed regulatory scenarios. Every deliberation is captured, cryptographically signed, and regulator-ready — on infrastructure you own. No cloud dependency. No vendor lock-in. Mathematical proof of every decision.`,
    cta: 'Request a live sandbox demo at datacendia.com',
    variations: [
      `The Hidden Cost of Ungoverned AI: How ${topic} Exposes Enterprise Risk`,
      `${topic}: 33 Design Partners Can't Be Wrong`,
      `Why Celtic FC, UEFA, FIFA Choose ${topic}`,
    ],
  };
}

function calendarTemplate() {
  const posts = [];
  const types = ['educational', 'product', 'case study', 'thought leadership'];
  for (let day = 1; day <= 30; day += 3) {
    posts.push({
      date: `2026-03-${String(day).padStart(2, '0')}`,
      platform: day % 2 === 0 ? 'Twitter' : 'LinkedIn',
      postType: types[day % types.length],
      content: `Day ${day}: Sovereign AI governance insight — why on-premise decision infrastructure matters for enterprise compliance.`,
      hashtags: ['#AIGovernance', '#EnterpriseSoftware', '#Datacendia', '#Compliance'],
      visualSuggestion: 'Branded graphic with key statistic',
    });
  }
  return posts;
}

// Helper: try Ollama, fall back to template
async function tryGenerate(prompt: string, fallback: any): Promise<any> {
  try {
    const available = await ollamaService.isAvailable();
    if (!available) return fallback;
    const response = await ollamaService.generate(prompt, {
      temperature: 0.7, max_tokens: 2000,
      format: 'json',
    });
    return JSON.parse(response);
  } catch {
    return fallback;
  }
}

// =============================================================================
// ROUTES
// =============================================================================

/**
 * POST /api/v1/marketing-studio/video-script
 */
router.post('/video-script', async (req: Request, res: Response) => {
  try {
    const { topic, duration, targetAudience } = req.body;
    const fallback = videoScriptTemplate(topic || 'Datacendia', duration || '60', targetAudience || 'enterprise-cto');

    const prompt = `You are a professional video scriptwriter. Generate a ${duration}-second video script for: "${topic}". Target: ${targetAudience}. Output as JSON with keys: title, duration, targetAudience, script (hook, problem, solution, demo, cta), visualNotes (array), voiceoverNotes.`;

    const data = await tryGenerate(prompt, fallback);
    data.id = data.id || `vs-${Date.now()}`;
    data.duration = data.duration || `${duration}s`;
    data.targetAudience = data.targetAudience || targetAudience;

    res.json({ success: true, data });
  } catch (error) {
    logger.error('Error generating video script:', error);
    const data: any = videoScriptTemplate(req.body?.topic || 'Datacendia', req.body?.duration || '60', req.body?.targetAudience || 'enterprise-cto');
    data.id = `vs-${Date.now()}`;
    res.json({ success: true, data });
  }
});

/**
 * POST /api/v1/marketing-studio/image-prompt
 */
router.post('/image-prompt', async (req: Request, res: Response) => {
  try {
    const { purpose, platform, style } = req.body;
    const fallback = imagePromptTemplate(purpose || 'Hero image', platform || 'midjourney', style || 'professional-tech');

    const prompt = `You are an AI image prompt engineer. Generate an optimized ${platform} prompt for: "${purpose}". Style: ${style}. Output as JSON with keys: purpose, platform, prompt, negativePrompt (stable-diffusion only), style, aspectRatio.`;

    const data = await tryGenerate(prompt, fallback);
    data.id = data.id || `ip-${Date.now()}`;
    data.platform = data.platform || platform;

    res.json({ success: true, data });
  } catch (error) {
    logger.error('Error generating image prompt:', error);
    const data = imagePromptTemplate(req.body?.purpose || 'Hero image', req.body?.platform || 'midjourney', req.body?.style || 'professional-tech');
    data.id = `ip-${Date.now()}`;
    res.json({ success: true, data });
  }
});

/**
 * POST /api/v1/marketing-studio/pitch-deck
 */
router.post('/pitch-deck', async (req: Request, res: Response) => {
  try {
    const { audience, focus } = req.body;
    const fallback = pitchDeckTemplate(audience || 'Investors');

    const prompt = `You are a pitch deck consultant. Generate a 10-12 slide deck for Datacendia's Sovereign Intelligence Platform. Audience: ${audience}. Focus: ${focus}. Output as JSON with keys: audience, slides (array of slideNumber, title, content array, visualSuggestion, speakerNotes).`;

    const data = await tryGenerate(prompt, fallback);
    data.id = data.id || `pd-${Date.now()}`;

    res.json({ success: true, data });
  } catch (error) {
    logger.error('Error generating pitch deck:', error);
    const data: any = pitchDeckTemplate(req.body?.audience || 'Investors');
    data.id = `pd-${Date.now()}`;
    res.json({ success: true, data });
  }
});

/**
 * POST /api/v1/marketing-studio/copy
 */
router.post('/copy', async (req: Request, res: Response) => {
  try {
    const { type, topic, tone } = req.body;
    const fallback = copyTemplate(type || 'email', topic || 'AI Governance');

    const prompt = `You are a B2B copywriter. Generate ${type} copy for Datacendia. Topic: ${topic}. Tone: ${tone}. Output as JSON with keys: type, headline, body, cta, variations (array of 3+ strings).`;

    const data = await tryGenerate(prompt, fallback);
    data.id = data.id || `mc-${Date.now()}`;
    data.type = data.type || type;

    res.json({ success: true, data });
  } catch (error) {
    logger.error('Error generating marketing copy:', error);
    const data: any = copyTemplate(req.body?.type || 'email', req.body?.topic || 'AI Governance');
    data.id = `mc-${Date.now()}`;
    res.json({ success: true, data });
  }
});

/**
 * POST /api/v1/marketing-studio/social-media-calendar
 */
router.post('/social-media-calendar', async (req: Request, res: Response) => {
  try {
    const { themes, platforms, postsPerWeek } = req.body;
    const fallback = calendarTemplate();

    const prompt = `Generate a 30-day social media calendar for Datacendia. Themes: ${(themes || []).join(', ')}. Platforms: ${(platforms || []).join(', ')}. Posts/week: ${postsPerWeek}. Output as JSON array of posts with date, platform, postType, content, hashtags, visualSuggestion.`;

    const data = await tryGenerate(prompt, fallback);

    res.json({ success: true, data });
  } catch (error) {
    logger.error('Error generating social media calendar:', error);
    res.json({ success: true, data: calendarTemplate() });
  }
});

export default router;
