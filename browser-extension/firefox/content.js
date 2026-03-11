/**
 * CendiaGateway™ Firefox Content Script
 * Initializes the shared gateway interceptor on AI websites.
 */
const interceptor = new GatewayInterceptor();
interceptor.init().catch(err => {
  console.error('[CendiaGateway] Init error:', err);
});
