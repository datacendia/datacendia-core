// Datacendia Demo Bundle Analytics Implementation
// Tracks user engagement and provides insights for optimization

class DemoAnalytics {
  constructor() {
    this.sessionId = this.generateSessionId();
    this.startTime = Date.now();
    this.events = [];
    this.metrics = {
      demoViews: 0,
      piiScans: 0,
      badgeClicks: 0,
      evidenceClicks: 0,
      copyActions: 0,
      policySwitches: 0,
      industrySwitches: 0,
      themeToggles: 0,
      timeOnPage: 0,
      interactions: 0,
      conversionEvents: 0
    };
    
    this.init();
  }

  generateSessionId() {
    return 'demo_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  init() {
    // Track page view
    this.trackEvent('demo_view', {
      sessionId: this.sessionId,
      timestamp: Date.now(),
      userAgent: navigator.userAgent,
      screenResolution: `${screen.width}x${screen.height}`,
      referrer: document.referrer || 'direct'
    });

    // Track session duration
    setInterval(() => {
      this.metrics.timeOnPage = Math.round((Date.now() - this.startTime) / 1000);
      this.updateDashboard();
    }, 5000);

    // Track page unload
    window.addEventListener('beforeunload', () => {
      this.trackEvent('session_end', {
        sessionId: this.sessionId,
        duration: this.metrics.timeOnPage,
        totalInteractions: this.metrics.interactions,
        conversionScore: this.calculateConversionScore()
      });
      this.sendAnalytics();
    });

    // Track visibility changes
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        this.trackEvent('page_hidden', {
          sessionId: this.sessionId,
          timeOnPage: this.metrics.timeOnPage
        });
      } else {
        this.trackEvent('page_visible', {
          sessionId: this.sessionId,
          timeOnPage: this.metrics.timeOnPage
        });
      }
    });
  }

  trackEvent(eventName, data = {}) {
    const event = {
      name: eventName,
      timestamp: Date.now(),
      sessionId: this.sessionId,
      ...data
    };

    this.events.push(event);
    this.metrics.interactions++;

    // Google Analytics tracking
    if (typeof gtag !== 'undefined') {
      gtag('event', eventName, {
        event_category: data.category || 'demo_interaction',
        event_label: data.label || eventName,
        value: data.value || 1,
        custom_map: {
          session_id: this.sessionId
        }
      });
    }

    console.log(`Analytics Event: ${eventName}`, event);
    this.updateDashboard();
  }

  trackPIIScan(policy, piiCount, scanDuration) {
    this.metrics.piiScans++;
    this.trackEvent('pii_scan', {
      category: 'feature_usage',
      label: 'pii_scanner',
      policy: policy,
      piiDetected: piiCount,
      scanDuration: scanDuration,
      value: piiCount
    });
  }

  trackBadgeClick(status, confidence, agentCount, variant) {
    this.metrics.badgeClicks++;
    this.trackEvent('badge_click', {
      category: 'interaction',
      label: 'council_badge',
      status: status,
      confidence: confidence,
      agentCount: agentCount,
      variant: variant,
      value: 1
    });
  }

  trackEvidenceClick(action, element) {
    this.metrics.evidenceClicks++;
    this.trackEvent('evidence_interaction', {
      category: 'interaction',
      label: 'evidence_viewer',
      action: action,
      element: element,
      value: 1
    });
  }

  trackCopyAction(contentType, contentLength) {
    this.metrics.copyActions++;
    this.trackEvent('copy_action', {
      category: 'feature_usage',
      label: 'copy_to_clipboard',
      contentType: contentType,
      contentLength: contentLength,
      value: 1
    });
  }

  trackPolicySwitch(fromPolicy, toPolicy) {
    this.metrics.policySwitches++;
    this.trackEvent('policy_switch', {
      category: 'feature_usage',
      label: 'policy_selection',
      fromPolicy: fromPolicy,
      toPolicy: toPolicy,
      value: 1
    });
  }

  trackIndustrySwitch(fromIndustry, toIndustry) {
    this.metrics.industrySwitches++;
    this.trackEvent('industry_switch', {
      category: 'feature_usage',
      label: 'industry_selection',
      fromIndustry: fromIndustry,
      toIndustry: toIndustry,
      value: 1
    });
  }

  trackThemeToggle(fromTheme, toTheme) {
    this.metrics.themeToggles++;
    this.trackEvent('theme_toggle', {
      category: 'ui_interaction',
      label: 'theme_selection',
      fromTheme: fromTheme,
      toTheme: toTheme,
      value: 1
    });
  }

  trackConversion(type, value = 1) {
    this.metrics.conversionEvents++;
    this.trackEvent('conversion', {
      category: 'conversion',
      label: type,
      value: value,
      conversionScore: this.calculateConversionScore()
    });
  }

  calculateConversionScore() {
    let score = 0;
    
    // Base score for time on page
    if (this.metrics.timeOnPage > 60) score += 10;
    if (this.metrics.timeOnPage > 180) score += 20;
    if (this.metrics.timeOnPage > 300) score += 30;
    
    // Score for feature interactions
    score += Math.min(this.metrics.piiScans * 15, 45);
    score += Math.min(this.metrics.badgeClicks * 10, 30);
    score += Math.min(this.metrics.evidenceClicks * 5, 25);
    score += Math.min(this.metrics.copyActions * 8, 24);
    
    // Score for exploration
    if (this.metrics.policySwitches > 0) score += 15;
    if (this.metrics.industrySwitches > 0) score += 15;
    if (this.metrics.themeToggles > 0) score += 5;
    
    return Math.min(score, 100);
  }

  updateDashboard() {
    // Update dashboard if it exists
    if (document.getElementById('demo-views')) {
      document.getElementById('demo-views').textContent = this.metrics.demoViews;
    }
    if (document.getElementById('pii-scans')) {
      document.getElementById('pii-scans').textContent = this.metrics.piiScans;
    }
    if (document.getElementById('badge-clicks')) {
      document.getElementById('badge-clicks').textContent = this.metrics.badgeClicks;
    }
    if (document.getElementById('evidence-clicks')) {
      document.getElementById('evidence-clicks').textContent = this.metrics.evidenceClicks;
    }
    if (document.getElementById('copy-actions')) {
      document.getElementById('copy-actions').textContent = this.metrics.copyActions;
    }
    if (document.getElementById('avg-time')) {
      document.getElementById('avg-time').textContent = this.metrics.timeOnPage + 's';
    }
    if (document.getElementById('conversion-score')) {
      document.getElementById('conversion-score').textContent = this.calculateConversionScore() + '%';
    }
    if (document.getElementById('interaction-count')) {
      document.getElementById('interaction-count').textContent = this.metrics.interactions;
    }
  }

  sendAnalytics() {
    // Send to analytics endpoint
    const analyticsData = {
      sessionId: this.sessionId,
      metrics: this.metrics,
      events: this.events,
      userAgent: navigator.userAgent,
      timestamp: Date.now(),
      conversionScore: this.calculateConversionScore()
    };

    // Send to your analytics endpoint
    fetch('https://api.datacendia.com/analytics/demo', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(analyticsData)
    }).catch(error => {
      console.log('Analytics send failed:', error);
    });

    // Also store in localStorage for debugging
    localStorage.setItem('demo_analytics', JSON.stringify(analyticsData));
  }

  getReport() {
    return {
      sessionId: this.sessionId,
      metrics: this.metrics,
      events: this.events,
      duration: this.metrics.timeOnPage,
      conversionScore: this.calculateConversionScore(),
      insights: this.generateInsights()
    };
  }

  generateInsights() {
    const insights = [];
    
    if (this.metrics.piiScans > 3) {
      insights.push("High engagement with PII scanner - strong compliance interest");
    }
    
    if (this.metrics.badgeClicks > 5) {
      insights.push("Frequent badge interactions - good UI/UX engagement");
    }
    
    if (this.metrics.policySwitches > 2) {
      insights.push("Multiple policy switches - compliance diversity interest");
    }
    
    if (this.metrics.industrySwitches > 2) {
      insights.push("Industry exploration - broad market interest");
    }
    
    if (this.metrics.copyActions > 3) {
      insights.push("Frequent copy actions - practical implementation interest");
    }
    
    if (this.calculateConversionScore() > 70) {
      insights.push("High conversion score - strong sales prospect");
    }
    
    if (this.metrics.timeOnPage > 300) {
      insights.push("Extended session time - detailed evaluation");
    }
    
    return insights;
  }
}

// Initialize analytics
window.demoAnalytics = new DemoAnalytics();

// Export for use in components
if (typeof module !== 'undefined' && module.exports) {
  module.exports = DemoAnalytics;
}
