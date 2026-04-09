# Analytics Dashboard Setup for Datacendia Demo

## Dashboard Configuration

### Google Analytics 4 Dashboard Setup

#### 1. Create Custom Dashboard
**Steps:**
1. Go to Google Analytics > Explore > Dashboard
2. Click "Create new dashboard"
3. Name: "Datacendia Demo Performance"
4. Select template: "Blank canvas"

#### 2. Key Widgets to Add

**Widget 1: Demo Overview**
- **Type**: Metric
- **Metrics**: Sessions, Users, Engagement rate
- **Time Range**: Last 30 days
- **Filters**: Page contains "/demo"

**Widget 2: Feature Engagement**
- **Type**: Bar chart
- **Dimension**: Event name
- **Metrics**: Event count
- **Events**: pii_scan, badge_click, evidence_interaction, copy_action

**Widget 3: Conversion Tracking**
- **Type**: Scorecard
- **Metrics**: Conversions, Conversion rate
- **Events**: conversion

**Widget 4: Industry Interest**
- **Type**: Pie chart
- **Dimension**: Event label
- **Metrics**: Event count
- **Events**: industry_switch

**Widget 5: Time on Demo**
- **Type**: Line chart
- **Dimension**: Date
- **Metrics**: Average engagement time
- **Filters**: Page contains "/demo"

**Widget 6: Device Performance**
- **Type**: Table
- **Dimensions**: Device category, Browser
- **Metrics**: Sessions, Bounce rate, Engagement time

### Real-Time Monitoring Setup

#### Real-Time Dashboard
1. Go to Realtime > Overview
2. Add these real-time widgets:
   - Current users on demo
   - Event count by event name
   - Conversions in last 30 minutes
   - Top pages

#### Alert Configuration
```javascript
// Custom alert setup
const alertRules = [
  {
    name: "High Demo Traffic",
    condition: "users > 50",
    notification: "email",
    recipients: ["sales@datacendia.com", "marketing@datacendia.com"]
  },
  {
    name: "Low Engagement",
    condition: "avg_engagement_time < 60",
    notification: "email",
    recipients: ["product@datacendia.com"]
  },
  {
    name: "Conversion Spike",
    condition: "conversions > 5",
    notification: "slack",
    channel: "#sales-alerts"
  }
];
```

## Custom Reports

### Report 1: Daily Demo Performance
**Schedule**: Daily at 9:00 AM
**Recipients**: Sales team, Marketing team
**Content**:
- Total demo views
- Feature engagement breakdown
- Conversion count
- Top performing industries
- Device/ browser breakdown

### Report 2: Weekly Demo Analytics
**Schedule**: Weekly on Mondays
**Recipients**: Management team, Product team
**Content**:
- Week-over-week comparison
- Trend analysis
- User journey insights
- Performance optimization opportunities
- ROI metrics

### Report 3: Monthly Demo Insights
**Schedule**: Monthly on 1st
**Recipients**: Executive team, Board
**Content**:
- Monthly performance summary
- Lead generation metrics
- Customer acquisition cost
- Sales impact analysis
- Strategic recommendations

## Data Studio Dashboard

### Dashboard Layout
```html
<!-- Google Data Studio Embed -->
<iframe 
  width="100%" 
  height="800" 
  src="https://datastudio.google.com/embed/reporting/1abc123def456/page/abc123"
  frameborder="0" 
  style="border:0" 
  allowfullscreen>
</iframe>
```

### Data Sources
1. **Google Analytics 4** - Primary data source
2. **Google Sheets** - Manual data entry for offline conversions
3. **CRM Data** - Lead tracking and revenue attribution
4. **Support Tickets** - Customer feedback and issues

### Dashboard Sections

#### Section 1: Overview Metrics
- Total demo views
- Unique visitors
- Average session duration
- Conversion rate
- Revenue generated

#### Section 2: Feature Usage
- PII Scanner usage
- Evidence Viewer interactions
- Council Badge clicks
- Copy actions
- Policy switches

#### Section 3: User Behavior
- New vs returning users
- Device breakdown
- Browser compatibility
- Geographic distribution
- Traffic sources

#### Section 4: Conversion Analysis
- Conversion funnel
- Time to conversion
- Conversion by industry
- Conversion by feature
- Revenue attribution

#### Section 5: Performance Trends
- Daily/weekly/monthly trends
- Year-over-year comparison
- Seasonal patterns
- Growth metrics
- Predictive analytics

## Integration with Other Tools

### CRM Integration
```javascript
// HubSpot integration example
const hubspotClient = require('@hubspot/api-client');

async function syncDemoToCRM(email, demoData) {
  const contact = await hubspotClient.crm.contacts.basicApi.create({
    properties: {
      email: email,
      demo_views: demoData.views,
      demo_features_used: demoData.features.join(','),
      demo_conversion_score: demoData.conversionScore,
      demo_last_visit: demoData.lastVisit
    }
  });
  
  return contact;
}
```

### Slack Integration
```javascript
// Slack webhook for real-time alerts
const slackWebhook = 'https://hooks.slack.com/services/abc123/def456/ghi789';

function sendSlackAlert(message) {
  fetch(slackWebhook, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      text: message,
      channel: '#demo-alerts',
      username: 'Demo Bot'
    })
  });
}

// Example usage
sendSlackAlert('Demo traffic spike: 25 concurrent users');
```

### Email Integration
```javascript
// Email notification system
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransporter({
  service: 'gmail',
  auth: {
    user: 'analytics@datacendia.com',
    pass: process.env.EMAIL_PASSWORD
  }
});

function sendDailyReport(reportData) {
  const html = `
    <h2>Daily Demo Performance Report</h2>
    <p><strong>Total Views:</strong> ${reportData.views}</p>
    <p><strong>Conversions:</strong> ${reportData.conversions}</p>
    <p><strong>Top Feature:</strong> ${reportData.topFeature}</p>
    <p><strong>Avg Session Time:</strong> ${reportData.avgSessionTime}s</p>
  `;
  
  transporter.sendMail({
    from: 'analytics@datacendia.com',
    to: 'team@datacendia.com',
    subject: 'Daily Demo Performance Report',
    html: html
  });
}
```

## Advanced Analytics Setup

### Custom Dimensions
```javascript
// Custom dimensions for enhanced tracking
const customDimensions = {
  demo_session_id: 'dimension1',
  user_industry: 'dimension2',
  user_role: 'dimension3',
  traffic_source: 'dimension4',
  conversion_stage: 'dimension5'
};
```

### Conversion Tracking
```javascript
// Enhanced conversion tracking
function trackConversion(type, value, metadata = {}) {
  gtag('event', 'conversion', {
    event_category: 'conversion',
    event_label: type,
    value: value,
    custom_map: {
      conversion_type: type,
      conversion_value: value,
      user_industry: metadata.industry,
      user_role: metadata.role
    }
  });
}
```

### Funnel Analysis
```javascript
// Conversion funnel tracking
const funnelSteps = [
  'demo_view',
  'feature_interaction',
  'multiple_features',
  'extended_session',
  'conversion_request'
];

function trackFunnelStep(step, userProperties = {}) {
  gtag('event', 'funnel_step', {
    event_category: 'funnel_analysis',
    event_label: step,
    custom_map: userProperties
  });
}
```

## Performance Monitoring

### Key Performance Indicators (KPIs)
```javascript
const kpis = {
  engagement: {
    avg_session_duration: 180, // 3 minutes
    pages_per_session: 2.5,
    bounce_rate: 0.35,
    return_visitor_rate: 0.25
  },
  conversion: {
    conversion_rate: 0.15, // 15%
    lead_quality_score: 7.5, // 1-10 scale
    time_to_conversion: 86400, // 24 hours
    revenue_per_conversion: 5000
  },
  technical: {
    page_load_time: 2.5, // seconds
    error_rate: 0.02, // 2%
    browser_compatibility: 0.95, // 95%
    mobile_performance: 0.90 // 90%
  }
};
```

### Alert Thresholds
```javascript
const alertThresholds = {
  high_traffic: { users: 100, timeWindow: '1h' },
  low_engagement: { avgTime: 60, timeWindow: '24h' },
  high_errors: { errorRate: 0.05, timeWindow: '1h' },
  conversion_drop: { rate: 0.10, timeWindow: '24h' }
};
```

## Data Visualization

### Chart Types and Use Cases
- **Line Charts**: Time series data, trends
- **Bar Charts**: Feature comparison, industry breakdown
- **Pie Charts**: Distribution, percentages
- **Heat Maps**: User behavior patterns
- **Funnel Charts**: Conversion analysis
- **Scatter Plots**: Correlation analysis

### Color Schemes
```css
:root {
  --primary-color: #c9a84c;
  --secondary-color: #22c55e;
  --accent-color: #3b82f6;
  --warning-color: #eab308;
  --danger-color: #ef4444;
  --background-color: #06060a;
  --text-color: #e4e4e7;
}
```

## Privacy and Compliance

### Data Anonymization
```javascript
// Anonymize user data before storage
function anonymizeUserData(userData) {
  return {
    sessionId: hashSessionId(userData.sessionId),
    userAgent: sanitizeUserAgent(userData.userAgent),
    ipAddress: hashIP(userData.ipAddress),
    location: generalizeLocation(userData.location)
  };
}
```

### GDPR Compliance
```javascript
// GDPR compliance functions
function handleDataRequest(requestType, userEmail) {
  switch (requestType) {
    case 'access':
      return exportUserData(userEmail);
    case 'deletion':
      return deleteUserData(userEmail);
    case 'rectification':
      return updateUserData(userEmail);
    case 'portability':
      return exportUserData(userEmail, 'json');
  }
}
```

## Automation Scripts

### Daily Report Automation
```python
#!/usr/bin/env python3
import requests
import json
from datetime import datetime

def generate_daily_report():
    # Fetch analytics data
    analytics_data = fetch_analytics_data()
    
    # Process data
    report_data = process_analytics_data(analytics_data)
    
    # Generate report
    report = create_report(report_data)
    
    # Send email
    send_email_report(report)
    
    # Update dashboard
    update_dashboard(report_data)

if __name__ == "__main__":
    generate_daily_report()
```

### Performance Monitoring
```javascript
// Automated performance monitoring
const performanceMonitor = {
  checkPageLoadTime: () => {
    const navigation = performance.getEntriesByType('navigation')[0];
    return navigation.loadEventEnd - navigation.loadEventStart;
  },
  
  checkErrorRate: () => {
    // Monitor console errors
    window.addEventListener('error', (event) => {
      logError(event.error);
    });
  },
  
  checkUserEngagement: () => {
    // Track user interactions
    document.addEventListener('click', (event) => {
      trackInteraction(event.target);
    });
  }
};
```

## Troubleshooting Guide

### Common Issues
1. **Data Not Showing**: Check GA configuration and filters
2. **Events Not Firing**: Verify gtag() implementation
3. **Conversion Tracking**: Check conversion setup and attribution
4. **Real-Time Data**: 5-10 minute delay is normal
5. **Dashboard Errors**: Check data source connections

### Debug Mode
```javascript
// Enable debug mode for troubleshooting
gtag('config', 'GA_MEASUREMENT_ID', {
  debug_mode: true,
  send_page_view: false
});

// Test event tracking
gtag('event', 'test_event', {
  event_category: 'testing',
  event_label: 'debug_mode',
  value: 1
});
```

This comprehensive analytics dashboard setup provides complete visibility into demo performance and user behavior, enabling data-driven optimization and business intelligence.
