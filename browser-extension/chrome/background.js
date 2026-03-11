/**
 * CendiaGateway™ Chrome/Edge Background Service Worker
 * Handles extension lifecycle, badge updates, and cross-tab communication.
 */

// Update badge with governance status
chrome.runtime.onInstalled.addListener(() => {
  chrome.action.setBadgeBackgroundColor({ color: '#16a34a' });
  chrome.action.setBadgeText({ text: 'ON' });
});

// Listen for messages from content scripts
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'interaction:blocked') {
    chrome.action.setBadgeBackgroundColor({ color: '#dc2626' });
    chrome.action.setBadgeText({ text: '!' });
    setTimeout(() => {
      chrome.action.setBadgeBackgroundColor({ color: '#16a34a' });
      chrome.action.setBadgeText({ text: 'ON' });
    }, 5000);
  }

  if (message.type === 'getStats') {
    chrome.storage.local.get(['stats'], (result) => {
      sendResponse(result.stats || { scanned: 0, blocked: 0, warned: 0, allowed: 0 });
    });
    return true;
  }
});
