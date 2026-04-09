# Website Integration Guide for Datacendia Demo Bundle

## Integration Options

### 1. Full Page Integration
**Best for**: Dedicated demo pages, marketing sites

**Implementation**:
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Datacendia Demo - Enterprise AI Governance</title>
  <link rel="stylesheet" href="https://demo.datacendia.com/demo-styles.css">
</head>
<body>
  <!-- Navigation -->
  <nav class="navbar">
    <a href="#demo" class="demo-link">Try Live Demo</a>
  </nav>
  
  <!-- Hero Section -->
  <section class="hero">
    <h1>Enterprise AI Governance Widgets</h1>
    <p>See our PII scanner, evidence viewer, and council badges in action</p>
    <a href="#demo" class="cta-button">Start Demo</a>
  </section>
  
  <!-- Demo Integration -->
  <section id="demo" class="demo-section">
    <iframe 
      src="https://demo.datacendia.com/demo-bundle.html" 
      width="100%" 
      height="800px" 
      frameborder="0"
      allowfullscreen>
    </iframe>
  </section>
  
  <!-- Analytics -->
  <script src="https://demo.datacendia.com/demo-analytics.js"></script>
</body>
</html>
```

### 2. Widget-Specific Integration
**Best for**: Product pages, feature highlights

**PII Scanner Widget**:
```html
<div class="widget-container">
  <h2>Try Our PII Scanner</h2>
  <p>Real-time PII detection with GDPR/HIPAA compliance</p>
  <iframe 
    src="https://demo.datacendia.com/pii-scanner-widget.html" 
    width="100%" 
    height="400px" 
    frameborder="0">
  </iframe>
</div>
```

**Evidence Viewer Widget**:
```html
<div class="widget-container">
  <h2>Cryptographic Evidence Viewer</h2>
  <p>Verifiable decision packets with agent deliberations</p>
  <iframe 
    src="https://demo.datacendia.com/evidence-viewer-widget.html" 
    width="100%" 
    height="500px" 
    frameborder="0">
  </iframe>
</div>
```

### 3. Modal Integration
**Best for**: Interactive demos without page navigation

```html
<!-- Trigger Button -->
<button onclick="openDemoModal()" class="demo-trigger">
  Try Live Demo
</button>

<!-- Modal -->
<div id="demo-modal" class="modal">
  <div class="modal-content">
    <span class="close" onclick="closeDemoModal()">&times;</span>
    <iframe 
      src="https://demo.datacendia.com/demo-bundle.html" 
      width="100%" 
      height="600px" 
      frameborder="0">
    </iframe>
  </div>
</div>

<style>
.modal {
  display: none;
  position: fixed;
  z-index: 1000;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0,0,0,0.8);
}

.modal-content {
  background-color: #06060a;
  margin: 5% auto;
  padding: 20px;
  border: 1px solid #2a2a3a;
  width: 90%;
  max-width: 1200px;
  height: 80vh;
  border-radius: 12px;
}

.close {
  color: #c9a84c;
  float: right;
  font-size: 28px;
  font-weight: bold;
  cursor: pointer;
}

iframe {
  width: 100%;
  height: calc(100% - 40px);
  border: none;
  border-radius: 8px;
}
</style>

<script>
function openDemoModal() {
  document.getElementById('demo-modal').style.display = 'block';
  // Track modal open
  if (typeof gtag !== 'undefined') {
    gtag('event', 'demo_modal_open', {
      event_category: 'engagement',
      event_label: 'demo_modal'
    });
  }
}

function closeDemoModal() {
  document.getElementById('demo-modal').style.display = 'none';
}

// Close modal when clicking outside
window.onclick = function(event) {
  const modal = document.getElementById('demo-modal');
  if (event.target == modal) {
    modal.style.display = 'none';
  }
}
</script>
```

## Platform-Specific Integration

### WordPress Integration
**Plugin Method**:
```php
<?php
/*
Plugin Name: Datacendia Demo Widget
Description: Embed Datacendia demo widgets in WordPress
*/

function datacendia_demo_shortcode($atts) {
  $atts = shortcode_atts([
    'widget' => 'full',
    'height' => '800',
    'width' => '100%'
  ], $atts);
  
  $widget_urls = [
    'full' => 'https://demo.datacendia.com/demo-bundle.html',
    'pii' => 'https://demo.datacendia.com/pii-scanner-widget.html',
    'evidence' => 'https://demo.datacendia.com/evidence-viewer-widget.html',
    'badges' => 'https://demo.datacendia.com/council-badges-widget.html'
  ];
  
  $url = $widget_urls[$atts['widget']] ?? $widget_urls['full'];
  
  return '<iframe src="' . esc_url($url) . '" 
          width="' . esc_attr($atts['width']) . '" 
          height="' . esc_attr($atts['height']) . '" 
          frameborder="0"></iframe>';
}

add_shortcode('datacendia_demo', 'datacendia_demo_shortcode');
```

**Usage in WordPress**:
```html
<!-- Full demo -->
[datacendia_demo widget="full"]

<!-- PII Scanner only -->
[datacendia_demo widget="pii" height="400"]

<!-- Evidence Viewer only -->
[datacendia_demo widget="evidence" height="500"]
```

### React Integration
**Component Example**:
```jsx
import React, { useState, useEffect } from 'react';

const DatacendiaDemo = ({ widget = 'full', height = '800' }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const widgetUrls = {
    full: 'https://demo.datacendia.com/demo-bundle.html',
    pii: 'https://demo.datacendia.com/pii-scanner-widget.html',
    evidence: 'https://demo.datacendia.com/evidence-viewer-widget.html',
    badges: 'https://demo.datacendia.com/council-badges-widget.html'
  };

  useEffect(() => {
    // Track demo view
    if (typeof gtag !== 'undefined') {
      gtag('event', 'demo_view', {
        event_category: 'engagement',
        event_label: `react_demo_${widget}`
      });
    }
  }, [widget]);

  const handleLoad = () => {
    setIsLoading(false);
  };

  const handleError = () => {
    setError('Failed to load demo. Please try again.');
    setIsLoading(false);
  };

  if (error) {
    return (
      <div className="demo-error">
        <p>{error}</p>
        <button onClick={() => window.location.reload()}>
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="datacendia-demo-container">
      {isLoading && (
        <div className="demo-loading">
          <div className="spinner"></div>
          <p>Loading demo...</p>
        </div>
      )}
      <iframe
        src={widgetUrls[widget]}
        width="100%"
        height={height}
        frameBorder="0"
        onLoad={handleLoad}
        onError={handleError}
        style={{ border: '1px solid #2a2a3a', borderRadius: '8px' }}
      />
    </div>
  );
};

export default DatacendiaDemo;
```

### Vue.js Integration
**Component Example**:
```vue
<template>
  <div class="datacendia-demo">
    <div v-if="loading" class="demo-loading">
      <div class="spinner"></div>
      <p>Loading demo...</p>
    </div>
    <iframe
      v-show="!loading"
      :src="widgetUrl"
      width="100%"
      :height="height"
      frameborder="0"
      @load="onLoad"
      @error="onError"
      class="demo-iframe"
    />
  </div>
</template>

<script>
export default {
  name: 'DatacendiaDemo',
  props: {
    widget: {
      type: String,
      default: 'full'
    },
    height: {
      type: String,
      default: '800'
    }
  },
  data() {
    return {
      loading: true,
      error: null
    };
  },
  computed: {
    widgetUrls() {
      return {
        full: 'https://demo.datacendia.com/demo-bundle.html',
        pii: 'https://demo.datacendia.com/pii-scanner-widget.html',
        evidence: 'https://demo.datacendia.com/evidence-viewer-widget.html',
        badges: 'https://demo.datacendia.com/council-badges-widget.html'
      };
    },
    widgetUrl() {
      return this.widgetUrls[this.widget] || this.widgetUrls.full;
    }
  },
  methods: {
    onLoad() {
      this.loading = false;
      this.trackDemoView();
    },
    onError() {
      this.error = 'Failed to load demo. Please try again.';
      this.loading = false;
    },
    trackDemoView() {
      if (typeof gtag !== 'undefined') {
        gtag('event', 'demo_view', {
          event_category: 'engagement',
          event_label: `vue_demo_${this.widget}`
        });
      }
    }
  }
};
</script>

<style scoped>
.demo-loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 400px;
  background: #0a0a0f;
  border: 1px solid #2a2a3a;
  border-radius: 8px;
}

.spinner {
  width: 32px;
  height: 32px;
  border: 3px solid #2a2a3a;
  border-top: 3px solid #c9a84c;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.demo-iframe {
  border: 1px solid #2a2a3a;
  border-radius: 8px;
}
</style>
```

## Styling and Branding

### Custom CSS for Integration
```css
/* Demo container styling */
.datacendia-demo-container {
  background: #06060a;
  border: 1px solid #2a2a3a;
  border-radius: 12px;
  padding: 20px;
  margin: 20px 0;
}

/* Demo loading state */
.demo-loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  color: #71717a;
}

/* Demo error state */
.demo-error {
  background: #ef444420;
  color: #ef4444;
  padding: 20px;
  border-radius: 8px;
  text-align: center;
}

.demo-error button {
  background: #ef4444;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 10px;
}

/* Responsive design */
@media (max-width: 768px) {
  .datacendia-demo-container {
    padding: 10px;
    margin: 10px 0;
  }
  
  .demo-iframe {
    height: 600px !important;
  }
}

@media (max-width: 480px) {
  .demo-iframe {
    height: 500px !important;
  }
}
```

## Performance Optimization

### Lazy Loading Implementation
```javascript
// Intersection Observer for lazy loading
const demoObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const iframe = entry.target;
      iframe.src = iframe.dataset.src;
      demoObserver.unobserve(iframe);
    }
  });
});

// Apply to all demo iframes
document.querySelectorAll('.demo-iframe[data-src]').forEach(iframe => {
  demoObserver.observe(iframe);
});
```

### Preloading Strategy
```html
<!-- Preload demo resources -->
<link rel="preload" href="https://demo.datacendia.com/demo-bundle.html" as="document">
<link rel="dns-prefetch" href="https://demo.datacendia.com">
<link rel="preconnect" href="https://demo.datacendia.com">
```

## Analytics Integration

### Event Tracking
```javascript
// Track demo interactions
function trackDemoInteraction(event, widget, action) {
  if (typeof gtag !== 'undefined') {
    gtag('event', event, {
      event_category: 'demo_interaction',
      event_label: `${widget}_${action}`,
      custom_map: {
        demo_widget: widget,
        demo_action: action
      }
    });
  }
}

// Track iframe load
document.querySelectorAll('.demo-iframe').forEach(iframe => {
  iframe.addEventListener('load', () => {
    trackDemoInteraction('demo_loaded', iframe.dataset.widget, 'load');
  });
});
```

### Conversion Tracking
```javascript
// Track demo conversions
function trackDemoConversion(conversionType, value = 1) {
  if (typeof gtag !== 'undefined') {
    gtag('event', 'demo_conversion', {
      event_category: 'conversion',
      event_label: conversionType,
      value: value
    });
  }
}

// Example usage
trackDemoConversion('demo_request_form');
trackDemoConversion('demo_contact_click');
```

## Security Considerations

### Content Security Policy
```html
<meta http-equiv="Content-Security-Policy" 
      content="default-src 'self'; 
               frame-src https://demo.datacendia.com; 
               script-src 'self' 'unsafe-inline' https://www.googletagmanager.com; 
               style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;">
```

### Sandbox Attributes
```html
<iframe 
  src="https://demo.datacendia.com/demo-bundle.html"
  sandbox="allow-scripts allow-same-origin allow-forms"
  loading="lazy">
</iframe>
```

## Testing and Validation

### Integration Testing Checklist
- [ ] Demo loads correctly in all browsers
- [ ] Responsive design works on mobile devices
- [ ] Analytics events are firing correctly
- [ ] No console errors or warnings
- [ ] Loading states display properly
- [ ] Error handling works as expected
- [ ] Performance metrics are acceptable
- [ ] Security headers are in place

### Automated Testing
```javascript
// Cypress test for demo integration
describe('Datacendia Demo Integration', () => {
  beforeEach(() => {
    cy.visit('/demo-page');
  });

  it('should load demo iframe', () => {
    cy.get('.demo-iframe')
      .should('be.visible')
      .and('have.attr', 'src', 'https://demo.datacendia.com/demo-bundle.html');
  });

  it('should track analytics events', () => {
    cy.window().then((win) => {
      cy.spy(win, 'gtag').as('gtag');
    });
    
    cy.get('.demo-iframe').then(() => {
      cy.get('@gtag').should('be.calledWith', 'event', 'demo_loaded');
    });
  });

  it('should handle loading states', () => {
    cy.get('.demo-loading').should('be.visible');
    cy.get('.demo-iframe', { timeout: 10000 }).should('be.visible');
    cy.get('.demo-loading').should('not.exist');
  });
});
```

## Deployment Considerations

### CDN Configuration
```javascript
// CDN configuration for demo assets
const demoCDN = {
  origin: 'https://demo.datacendia.com',
  cache: {
    ttl: 3600, // 1 hour
    staleWhileRevalidate: 86400 // 1 day
  },
  compression: {
    gzip: true,
    brotli: true
  }
};
```

### Monitoring Setup
```javascript
// Performance monitoring for demo iframes
const performanceObserver = new PerformanceObserver((list) => {
  list.getEntries().forEach((entry) => {
    if (entry.name.includes('demo.datacendia.com')) {
      console.log('Demo performance:', {
        loadTime: entry.loadEventEnd - entry.loadEventStart,
        domInteractive: entry.domInteractive - entry.loadEventStart
      });
    }
  });
});

performanceObserver.observe({ entryTypes: ['navigation'] });
```

This comprehensive integration guide provides multiple approaches for embedding the Datacendia demo bundle across different platforms and use cases.
