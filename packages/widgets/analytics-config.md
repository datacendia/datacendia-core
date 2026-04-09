# Google Analytics Configuration for Datacendia Demo

## Setup Instructions

### 1. Create Google Analytics 4 Property
1. Go to [Google Analytics](https://analytics.google.com)
2. Sign in with your Google account
3. Click "Admin" (gear icon) in the bottom left
4. Click "+ Create Account"
5. Enter account name: "Datacendia"
6. Click "Next"
7. Enter property name: "Datacendia Demo Bundle"
8. Select reporting time zone: "United States"
9. Click "Next"
10. Select industry category: "Technology"
11. Select business size: "Small"
12. Click "Create"
13. Accept terms of service

### 2. Get Measurement ID
1. After creation, click "Admin" > "Data Streams"
2. Click "Web stream"
3. Copy the "Measurement ID" (format: G-XXXXXXXXXX)
4. This ID will be used in the demo HTML files

### 3. Configure Demo Analytics
Replace `GA_MEASUREMENT_ID` in both demo files with your actual measurement ID:

**In demo-production.html:**
```html
<script async src="https://www.googletagmanager.com/gtag/js?id=G-YOUR_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-YOUR_MEASUREMENT_ID', {
    page_title: 'Datacendia Widgets Demo',
    page_location: window.location.href,
    content_group: 'Product Demo'
  });
</script>
```

**In demo-analytics.js:**
```javascript
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
```

### 4. Enable Enhanced Measurement
1. In Google Analytics, go to "Admin" > "Data Streams"
2. Click your web stream
3. Under "Enhanced measurement", toggle ON:
   - Scrolls
   - Outbound clicks
   - Site search
   - Video engagement
   - File downloads
   - Form interactions
4. Click "Save"

### 5. Create Custom Events
The demo automatically tracks these custom events:
- `demo_view` - Page view
- `pii_scan` - PII scanner usage
- `badge_click` - Council badge interactions
- `evidence_interaction` - Evidence viewer usage
- `copy_action` - Copy to clipboard usage
- `policy_switch` - Policy selection changes
- `industry_switch` - Industry sample changes
- `theme_toggle` - Theme switching
- `conversion` - Conversion events
- `session_end` - Session completion

### 6. Set Up Conversion Tracking
1. In Google Analytics, go to "Admin" > "Conversions"
2. Click "New conversion event"
3. Enter event name: `conversion`
4. Click "Save"

### 7. Create Dashboard
1. Go to "Explore" > "Dashboard"
2. Add widgets for:
   - Demo views (event: demo_view)
   - PII scans (event: pii_scan)
   - Badge clicks (event: badge_click)
   - Conversion rate (event: conversion)
   - Session duration
   - User engagement

### 8. Set Up Goals
Create goals for:
- **Demo completion**: Users who spend > 3 minutes
- **Feature engagement**: Users who perform 5+ interactions
- **Conversion**: Users who request demo or contact

### 9. Configure Real-Time Reporting
1. Go to "Realtime" > "Events"
2. Monitor live demo usage
3. Set up alerts for unusual activity

### 10. Data Retention Settings
1. Go to "Admin" > "Data Settings" > "Data Retention"
2. Set user data retention to 14 months
3. Set event data retention to 2 months

## Environment Variables

Add these to your Netlify environment:

```
GOOGLE_ANALYTICS_ID=G-YOUR_MEASUREMENT_ID
GOOGLE_TAG_MANAGER_ID=GTM-XXXXXXX
```

## Privacy Compliance

The demo analytics implementation is GDPR-compliant:
- No personal data collected
- No cookies required for basic functionality
- Analytics data anonymized
- User can opt-out via browser settings

## Testing

1. Open demo in browser
2. Open Chrome DevTools > Network
3. Filter for "analytics.google.com"
4. Verify events are being sent
5. Check Google Analytics real-time reports

## Troubleshooting

**Common Issues:**
- **Events not showing**: Check measurement ID is correct
- **Real-time data delayed**: Real-time reports may have 5-10 minute delay
- **No conversions**: Verify conversion event is set up correctly
- **Bot traffic**: Use filters to exclude internal traffic

**Debug Mode:**
Add `?debug_mode=true` to URL to enable debug logging:
```javascript
gtag('config', 'G-YOUR_MEASUREMENT_ID', { debug_mode: true });
```

## Next Steps

1. Set up Google Analytics property
2. Configure measurement ID in demo files
3. Test event tracking
4. Set up custom dashboards
5. Configure conversion goals
6. Monitor initial user behavior
7. Optimize based on data insights
