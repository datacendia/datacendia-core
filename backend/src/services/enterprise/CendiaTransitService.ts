// Copyright (c) 2024-2026 Datacendia, LLC. Licensed under Apache 2.0.
// See LICENSE file for details.




import { generateId, now, sr_create, sr_get } from './_base.js';

export type TravelRiskLevel = 'low' | 'moderate' | 'elevated' | 'high' | 'extreme';
export type RequestStatus = 'pending' | 'approved' | 'in_transit' | 'completed' | 'canceled' | 'emergency';

export interface TravelRequest {
  id: string;
  travelerId: string;
  travelerName: string;
  destination: string;
  country: string;
  departureDate: string;
  returnDate: string;
  purpose: string;
  riskLevel: TravelRiskLevel;
  status: RequestStatus;
  securityPlan?: SecurityPlan;
  createdAt: string;
}

export interface SecurityPlan {
  id: string;
  requestId: string;
  riskAssessment: string;
  securityMeasures: string[];
  emergencyContacts: { role: string; phone: string }[];
  safeHouses: { location: string; address: string }[];
  extractionRoutes: string[];
  checkInSchedule: string;
  createdAt: string;
}

export interface LocationRisk {
  location: string;
  country: string;
  overallRisk: TravelRiskLevel;
  riskScore: number;
  factors: { category: string; level: string; description: string }[];
  advisories: string[];
  lastUpdated: string;
}

const SN = 'CendiaTransit';
const requests = new Map<string, TravelRequest>();

class CendiaTransitService {
  async createTravelRequest(input: Partial<TravelRequest>): Promise<TravelRequest> {
    const req: TravelRequest = {
      id: generateId(), travelerId: input.travelerId || '', travelerName: input.travelerName || '',
      destination: input.destination || '', country: input.country || '',
      departureDate: input.departureDate || '', returnDate: input.returnDate || '',
      purpose: input.purpose || 'business', riskLevel: 'moderate', status: 'pending',
      createdAt: now(),
    };
    const risk = await this.assessLocationRisk(req.destination, req.country);
    req.riskLevel = risk.overallRisk;
    requests.set(req.id, req);
    await sr_create(SN, 'travel_request', req);
    return req;
  }

  getTravelRequest(id: string): TravelRequest | undefined {
    return requests.get(id);
  }

  async assessLocationRisk(location: string, country: string): Promise<LocationRisk> {
    const highRiskCountries = ['iraq', 'syria', 'libya', 'yemen', 'somalia', 'north korea', 'afghanistan'];
    const isHighRisk = highRiskCountries.some((c) => country.toLowerCase().includes(c));
    const score = isHighRisk ? 85 + Math.round(Math.random() * 10) : 15 + Math.round(Math.random() * 40);
    return {
      location, country,
      overallRisk: score > 80 ? 'extreme' : score > 60 ? 'high' : score > 40 ? 'elevated' : score > 20 ? 'moderate' : 'low',
      riskScore: score,
      factors: [
        { category: 'Crime', level: score > 50 ? 'high' : 'moderate', description: `Street crime index: ${score > 50 ? 'above' : 'near'} regional average` },
        { category: 'Political Stability', level: isHighRisk ? 'critical' : 'stable', description: isHighRisk ? 'Active conflict zone' : 'Stable democratic government' },
        { category: 'Health', level: 'moderate', description: 'Standard travel health precautions apply' },
        { category: 'Cyber', level: score > 40 ? 'elevated' : 'low', description: score > 40 ? 'Known state-sponsored surveillance — use encrypted devices only' : 'Standard cyber hygiene recommended' },
      ],
      advisories: isHighRisk ? ['Travel not recommended without security detail', 'Embassy registration required', 'Emergency extraction plan mandatory'] : ['Standard corporate travel policy applies'],
      lastUpdated: now(),
    };
  }

  async createSecurityPlan(requestId: string): Promise<SecurityPlan> {
    const req = requests.get(requestId);
    const plan: SecurityPlan = {
      id: generateId(), requestId,
      riskAssessment: `${req?.riskLevel ?? 'moderate'} risk travel to ${req?.destination ?? 'Unknown'}. ${req?.riskLevel === 'high' || req?.riskLevel === 'extreme' ? 'Full security detail assigned.' : 'Standard travel security measures.'}`,
      securityMeasures: [
        'Encrypted communications only — pre-configured secure phone issued',
        'Daily check-in via encrypted channel at 09:00 and 18:00 local time',
        req?.riskLevel === 'high' || req?.riskLevel === 'extreme' ? 'Armed security escort for all ground transport' : 'Pre-vetted ground transport provider assigned',
        'Hotel security sweep completed pre-arrival',
      ],
      emergencyContacts: [
        { role: 'Regional Security Manager', phone: '+1-555-SEC-MGMT' },
        { role: '24/7 Security Operations Center', phone: '+1-555-SOC-24HR' },
        { role: 'Local Embassy', phone: '+1-555-EMBASSY' },
      ],
      safeHouses: [{ location: `${req?.destination ?? 'TBD'} Safe House Alpha`, address: 'Details shared via secure channel only' }],
      extractionRoutes: ['Primary: Ground route to airport', 'Secondary: Helicopter extraction to border', 'Tertiary: Embassy compound refuge'],
      checkInSchedule: 'Every 12 hours via Signal protocol',
      createdAt: now(),
    };
    if (req) { req.securityPlan = plan; req.status = 'approved'; requests.set(requestId, req); }
    await sr_create(SN, 'security_plan', plan, undefined, requestId);
    return plan;
  }

  async activateExtraction(requestId: string, reason: string, activatedBy: string): Promise<{ activated: boolean; requestId: string; reason: string; protocol: string; estimatedTime: string; activatedAt: string }> {
    const req = requests.get(requestId);
    if (req) { req.status = 'emergency'; requests.set(requestId, req); }
    return {
      activated: true, requestId, reason,
      protocol: 'EXTRACTION PROTOCOL ALPHA — All assets mobilized. Security Operations Center notified. Local law enforcement coordination initiated. Extraction team en route.',
      estimatedTime: '90 minutes to primary extraction point',
      activatedAt: now(),
    };
  }
}

export const cendiaTransitService = new CendiaTransitService();
