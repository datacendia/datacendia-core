/**
 * CendiaGateway™ Firefox Background Script
 * Handles extension lifecycle, badge updates, and cross-tab communication.
 */

// Update badge with governance status
browser.browserAction.setBadgeBackgroundColor({ color: '#16a34a' });
browser.browserAction.setBadgeText({ text: 'ON' });

// Listen for messages from content scripts
browser.runtime.onMessage.addListener((message, sender) => {
  if (message.type === 'interaction:blocked') {
    browser.browserAction.setBadgeBackgroundColor({ color: '#dc2626' });
    browser.browserAction.setBadgeText({ text: '!' });
    setTimeout(() => {
      browser.browserAction.setBadgeBackgroundColor({ color: '#16a34a' });
      browser.browserAction.setBadgeText({ text: 'ON' });
    }, 5000);
  }

  if (message.type === 'getStats') {
    return browser.storage.local.get(['stats']).then(result => {
      return result.stats || { scanned: 0, blocked: 0, warned: 0, allowed: 0 };
    });
  }
});
