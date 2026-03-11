/**
 * Service — Index
 *
 * Business logic service implementing platform capabilities.
 * @module services/gateway/index
 */

export { default as CendiaGatewayService } from './CendiaGatewayService';
export { scanForPII, containsPII, scanForKeywords } from './PIIDetector';
export { default as ModelRouter } from './ModelRouter';
export { default as ShadowAIDetector } from './ShadowAIDetector';
export { default as WebhookNotifier } from './WebhookNotifier';
export { default as GatewayRateLimiter } from './RateLimiter';
export { default as SIEMIntegration } from './SIEMIntegration';
export { default as ManifestExporter } from './ManifestExporter';
export { presidioPIIService } from './PresidioPIIService';
export { piiEvaluation } from './PIIEvaluationMetrics';

export type { PIIDetection, PIIType, PIIScanResult } from './PIIDetector';
export type { PresidioPIIScanResult } from './PresidioPIIService';
export type { EvaluationResult, BiasEvaluationResult, PIITestCase, BiasTestCase } from './PIIEvaluationMetrics';
export type {
  GatewayProvider,
  GatewayPolicy,
  GatewayRequest,
  GatewayResponse,
  GatewayInteraction,
  GatewayStats,
  AIManifest,
  GovernanceReceipt,
} from './CendiaGatewayService';
export type { ModelTier, ModelCapability, RoutingRule, RoutingDecision } from './ModelRouter';
export type { ShadowAIEvent, ShadowAIEventType, ShadowAIConfig, ShadowAIReport } from './ShadowAIDetector';
export type { WebhookConfig, WebhookEventType, WebhookPayload } from './WebhookNotifier';
export type { RateLimitConfig, RateLimitResult } from './RateLimiter';
export type { SIEMConfig, SIEMEventType, SIEMEvent } from './SIEMIntegration';
