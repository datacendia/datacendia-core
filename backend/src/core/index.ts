// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

// =============================================================================
// DATACENDIA PLATFORM - CORE EXPORTS
// Enterprise-grade platform infrastructure
// =============================================================================

// Services
export * from './services/BaseService';
export * from './services/ServiceRegistry';

// Events
export * from './events/EventBus';

// Modules
export * from './modules/ModuleRegistry';

// Connectors
export * from './connectors/BaseConnector';

// Re-export singletons
export { serviceRegistry } from './services/ServiceRegistry';
export { eventBus } from './events/EventBus';
export { moduleRegistry } from './modules/ModuleRegistry';
