# Datacendia Demo Package - Documentation

## Overview

This downloadable demo package contains everything you need to integrate and deploy Datacendia's AI governance widgets in your applications.

## Package Contents

### Core Files
- `demo-bundle.html` - Standalone demo with all widgets
- `demo-production.html` - Production-ready demo with analytics
- `demo-analytics.js` - Advanced analytics tracking system
- `industry-samples.json` - Industry-specific sample data

### Documentation
- `README.md` - Quick start guide and setup instructions
- `integration-guide.md` - Framework-specific integration examples
- `api-reference.md` - Complete API documentation
- `troubleshooting.md` - Common issues and solutions

### Examples
- `examples/react/` - React integration examples
- `examples/vue/` - Vue.js integration examples
- `examples/angular/` - Angular integration examples
- `examples/plain-html/` - Vanilla JavaScript examples

### Assets
- `assets/images/` - Logos, icons, and screenshots
- `assets/styles/` - CSS themes and customization
- `assets/fonts/` - Custom fonts and typography
- `assets/videos/` - Video walkthroughs and tutorials

## Quick Start

### 1. Extract the Package
```bash
unzip datacendia-demo-package.zip
cd datacendia-demo-package
```

### 2. Open the Demo
```bash
# Open in browser
open demo-bundle.html

# Or start local server
python -m http.server 8000
# Then visit http://localhost:8000/demo-bundle.html
```

### 3. Explore Features
- Click "Load Sample" to populate PII data
- Try different policies (GDPR, HIPAA, Custom)
- Scan for PII and see results
- Click Council Badges for interactivity
- Expand Evidence Viewer agents

## Integration Guide

### React Integration
```jsx
import React from 'react';
import './datacendia-widgets.css';

const DatacendiaDemo = () => {
  return (
    <div>
      <cendia-pii-scanner></cendia-pii-scanner>
      <dcii-evidence-viewer></dcii-evidence-viewer>
      <council-status-badge status="completed" confidence="0.82"></council-status-badge>
    </div>
  );
};

export default DatacendiaDemo;
```

### Vue.js Integration
```vue
<template>
  <div>
    <cendia-pii-scanner></cendia-pii-scanner>
    <dcii-evidence-viewer></dcii-evidence-viewer>
    <council-status-badge status="completed" confidence="0.82"></council-status-badge>
  </div>
</template>

<script>
export default {
  name: 'DatacendiaDemo',
  mounted() {
    // Load widget scripts
    this.loadWidgets();
  },
  methods: {
    loadWidgets() {
      const script = document.createElement('script');
      script.src = './datacendia-widgets.js';
      document.head.appendChild(script);
    }
  }
};
</script>
```

### Angular Integration
```typescript
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-datacendia-demo',
  template: `
    <div>
      <cendia-pii-scanner></cendia-pii-scanner>
      <dcii-evidence-viewer></dcii-evidence-viewer>
      <council-status-badge status="completed" confidence="0.82"></council-status-badge>
    </div>
  `
})
export class DatacendiaDemoComponent implements OnInit {
  ngOnInit() {
    this.loadWidgets();
  }

  loadWidgets() {
    const script = document.createElement('script');
    script.src = './datacendia-widgets.js';
    document.head.appendChild(script);
  }
}
```

### Plain HTML Integration
```html
<!DOCTYPE html>
<html>
<head>
  <title>Datacendia Demo</title>
  <link rel="stylesheet" href="datacendia-widgets.css">
</head>
<body>
  <cendia-pii-scanner></cendia-pii-scanner>
  <dcii-evidence-viewer></dcii-evidence-viewer>
  <council-status-badge status="completed" confidence="0.82"></council-status-badge>
  
  <script src="datacendia-widgets.js"></script>
</body>
</html>
```

## Customization

### Styling
```css
/* Custom theme */
cendia-pii-scanner {
  --primary-color: #your-brand-color;
  --secondary-color: #your-accent-color;
  --font-family: 'Your Font', sans-serif;
}

/* Custom sizing */
cendia-pii-scanner {
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
}
```

### Configuration
```javascript
// Configure PII Scanner
const piiScanner = document.querySelector('cendia-pii-scanner');
piiScanner.policy = 'gdpr';
piiScanner.apiUrl = 'https://your-api.com/scan';
piiScanner.autoScanMs = 1000;

// Configure Evidence Viewer
const evidenceViewer = document.querySelector('dcii-evidence-viewer');
evidenceViewer.showAgents = true;
evidenceViewer.compact = false;
```

## API Reference

### PII Scanner Properties
- `policy` - Compliance policy ('gdpr', 'hipaa', 'custom')
- `apiUrl` - API endpoint for scanning
- `autoScanMs` - Auto-scan delay in milliseconds
- `showConfidence` - Show confidence scores

### Evidence Viewer Properties
- `showAgents` - Show agent deliberations
- `compact` - Compact display mode
- `showMetrics` - Show confidence metrics

### Council Badge Properties
- `status` - Badge status ('completed', 'deliberating', 'pending', 'failed')
- `confidence` - Confidence score (0-1)
- `agentCount` - Number of agents
- `variant` - Display variant ('badge', 'card')

### Events
- `pii-sample-loaded` - Sample text loaded
- `pii-scan-complete` - PII scan completed
- `evidence-loaded` - Evidence packet loaded
- `badge-clicked` - Badge clicked

## Troubleshooting

### Common Issues

#### Widgets Not Loading
**Problem**: Widgets don't appear on the page
**Solution**: 
1. Check that script tags are loaded
2. Verify file paths are correct
3. Check browser console for errors

#### PII Scanner Not Working
**Problem**: Scan button doesn't work
**Solution**:
1. Ensure sample text is loaded
2. Check API endpoint configuration
3. Verify network connectivity

#### Styling Issues
**Problem**: Widgets don't look right
**Solution**:
1. Check CSS file is loaded
2. Verify custom CSS doesn't conflict
3. Check browser compatibility

#### Performance Issues
**Problem**: Demo runs slowly
**Solution**:
1. Optimize image sizes
2. Minimize external dependencies
3. Use browser caching

### Browser Compatibility
- **Chrome 120+**: Full support
- **Firefox 121+**: Full support
- **Safari 17+**: Full support
- **Edge 120+**: Full support

### Mobile Support
- **iOS Safari 17+**: Full support
- **Chrome Mobile**: Full support
- **Samsung Internet**: Full support

## Support

### Documentation
- [API Reference](api-reference.md)
- [Integration Examples](integration-guide.md)
- [Troubleshooting Guide](troubleshooting.md)

### Community
- [GitHub Issues](https://github.com/datacendia/datacendia-core/issues)
- [Discord Community](https://discord.gg/datacendia)
- [Stack Overflow](https://stackoverflow.com/questions/tagged/datacendia)

### Enterprise Support
- Email: enterprise@datacendia.com
- Phone: 1-800-DATACENDIA
- Support Portal: https://support.datacendia.com

## License

This demo package is provided under the Apache 2.0 License. See LICENSE file for details.

## Version History

### v1.0.0 (Current)
- Initial release
- All widgets included
- Complete documentation
- Integration examples

### Upcoming Features
- Additional widget types
- Enhanced customization options
- Performance optimizations
- Mobile app examples

## Contributing

We welcome contributions! Please see CONTRIBUTING.md for guidelines.

### Development Setup
```bash
git clone https://github.com/datacendia/datacendia-core.git
cd datacendia-core/packages/widgets
npm install
npm run dev
```

### Testing
```bash
npm test
npm run test:e2e
npm run test:accessibility
```

## Security

### Data Privacy
- All PII processing happens client-side
- No data sent to external servers
- GDPR and CCPA compliant

### Security Best Practices
- Use HTTPS in production
- Validate all inputs
- Implement proper CSP headers
- Regular security updates

## Performance

### Optimization Tips
- Minimize external dependencies
- Use browser caching
- Optimize images and assets
- Implement lazy loading

### Benchmarks
- Load time: < 2 seconds
- Scan time: < 500ms
- Memory usage: < 50MB
- Bundle size: < 1MB

## Roadmap

### Q2 2024
- Additional widget types
- Enhanced analytics
- Mobile app support

### Q3 2024
- Advanced customization
- Performance improvements
- Additional integrations

### Q4 2024
- Enterprise features
- Advanced security
- Global expansion

---

For more information, visit https://datacendia.com or contact support@datacendia.com
