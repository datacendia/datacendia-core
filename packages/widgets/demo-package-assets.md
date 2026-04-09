# Demo Package Assets and Resources

## Asset Structure

```
demo-package/
|
|-- assets/
|   |-- images/
|   |   |-- logos/
|   |   |   |-- datacendia-logo.svg
|   |   |   |-- datacendia-logo-dark.svg
|   |   |   |-- datacendia-icon.svg
|   |   |-- screenshots/
|   |   |   |-- pii-scanner-demo.png
|   |   |   |-- evidence-viewer-demo.png
|   |   |   |-- council-badges-demo.png
|   |   |   |-- full-demo-screenshot.png
|   |   |-- icons/
|   |   |   |-- pii-icon.svg
|   |   |   |-- evidence-icon.svg
|   |   |   |-- badge-icon.svg
|   |   |   |-- check-icon.svg
|   |   |   |-- warning-icon.svg
|   |   |   |-- error-icon.svg
|   |-- styles/
|   |   |-- themes/
|   |   |   |-- default.css
|   |   |   |-- dark.css
|   |   |   |-- light.css
|   |   |   |-- custom.css
|   |   |-- components/
|   |   |   |-- pii-scanner.css
|   |   |   |-- evidence-viewer.css
|   |   |   |-- council-badges.css
|   |   |-- utilities/
|   |       |-- animations.css
|   |       |-- responsive.css
|   |       |-- accessibility.css
|   |-- fonts/
|   |   |-- inter/
|   |   |   |-- inter-regular.woff2
|   |   |   |-- inter-medium.woff2
|   |   |   |-- inter-semibold.woff2
|   |   |   |-- inter-bold.woff2
|   |   |-- jetbrains-mono/
|   |       |-- jetbrains-mono-regular.woff2
|   |       |-- jetbrains-mono-medium.woff2
|   |-- videos/
|   |   |-- walkthroughs/
|   |   |   |-- 2min-overview.mp4
|   |   |   |-- 5min-detailed.mp4
|   |   |   |-- 30sec-teasers/
|   |   |       |-- pii-detection.mp4
|   |   |       |-- cryptographic-proof.mp4
|   |   |       |-- interactive-badges.mp4
|   |   |       |-- industry-solutions.mp4
|   |   |-- tutorials/
|   |       |-- getting-started.mp4
|   |       |-- integration-guide.mp4
|   |       |-- customization.mp4
|   |       |-- troubleshooting.mp4
|
|-- docs/
|   |-- README.md
|   |-- api-reference.md
|   |-- integration-guide.md
|   |-- troubleshooting.md
|   |-- changelog.md
|   |-- license.md
|
|-- examples/
|   |-- react/
|   |   |-- basic-example.jsx
|   |   |-- typescript-example.tsx
|   |   |-- hooks-example.jsx
|   |   |-- package.json
|   |-- vue/
|   |   |-- vue3-composition-api.vue
|   |   |-- vue2-options-api.vue
|   |   |-- nuxt-example.vue
|   |   |-- package.json
|   |-- angular/
|   |   |-- basic-component.ts
|   |   |-- service-example.ts
|   |   |-- angular.json
|   |   |-- package.json
|   |-- plain-html/
|   |   |-- basic-example.html
|   |   |-- advanced-example.html
|   |   |-- mobile-responsive.html
|
|-- core/
|   |-- demo-bundle.html
|   |-- demo-production.html
|   |-- demo-analytics.js
|   |-- datacendia-widgets.js
|   |-- datacendia-widgets.css
|   |-- industry-samples.json
|
|-- tools/
|   |-- build/
|   |   |-- build.js
|   |   |-- optimize.js
|   |   |-- package.json
|   |-- deploy/
|   |   |-- deploy.sh
|   |   |-- netlify.toml
|   |   |-- vercel.json
|   |-- test/
|       |-- test-runner.js
|       |-- e2e-tests.js
|       |-- accessibility-tests.js
```

## Image Assets

### Logo Files

#### Datacendia Logo (SVG)
```svg
<!-- datacendia-logo.svg -->
<svg width="200" height="50" viewBox="0 0 200 50" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" style="stop-color:#c9a84c;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#f4e4c1;stop-opacity:1" />
    </linearGradient>
  </defs>
  <text x="10" y="35" font-family="Inter, sans-serif" font-size="24" font-weight="700" fill="url(#logoGradient)">Datacendia</text>
</svg>
```

#### Datacendia Icon (SVG)
```svg
<!-- datacendia-icon.svg -->
<svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="iconGradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#c9a84c;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#f4e4c1;stop-opacity:1" />
    </linearGradient>
  </defs>
  <circle cx="16" cy="16" r="14" fill="url(#iconGradient)" opacity="0.1"/>
  <path d="M8 12 L16 8 L24 12 L24 20 L16 24 L8 20 Z" fill="url(#iconGradient)"/>
  <circle cx="16" cy="16" r="2" fill="#fff"/>
</svg>
```

### Widget Icons

#### PII Scanner Icon
```svg
<!-- pii-icon.svg -->
<svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" fill="#22c55e"/>
  <text x="12" y="18" font-family="monospace" font-size="8" text-anchor="middle" fill="#fff">PII</text>
</svg>
```

#### Evidence Viewer Icon
```svg
<!-- evidence-icon.svg -->
<svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
  <path d="M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zm2 14H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z" fill="#3b82f6"/>
  <circle cx="12" cy="18" r="1" fill="#3b82f6"/>
</svg>
```

#### Council Badge Icon
```svg
<!-- badge-icon.svg -->
<svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" fill="#c9a84c"/>
</svg>
```

### Status Icons

#### Check Icon
```svg
<!-- check-icon.svg -->
<svg width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
  <path d="M13.5 4.5L6 12l-3.5-3.5" stroke="#22c55e" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
```

#### Warning Icon
```svg
<!-- warning-icon.svg -->
<svg width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
  <path d="M8 1v6M8 11h.01M3 15h10a2 2 0 002-2L8 1 3 13a2 2 0 002 2z" stroke="#eab308" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
```

#### Error Icon
```svg
<!-- error-icon.svg -->
<svg width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
  <path d="M8 1v6M8 11h.01M1 8h14" stroke="#ef4444" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
```

## Style Assets

### Default Theme CSS
```css
/* assets/styles/themes/default.css */
:root {
  /* Primary Colors */
  --primary-color: #c9a84c;
  --primary-dark: #a4883a;
  --primary-light: #f4e4c1;
  
  /* Secondary Colors */
  --secondary-color: #71717a;
  --secondary-dark: #52525b;
  --secondary-light: #a1a1aa;
  
  /* Status Colors */
  --success-color: #22c55e;
  --warning-color: #eab308;
  --error-color: #ef4444;
  --info-color: #3b82f6;
  
  /* Background Colors */
  --bg-primary: #06060a;
  --bg-secondary: #0a0a0f;
  --bg-tertiary: #141420;
  --bg-quaternary: #1a1a2a;
  
  /* Text Colors */
  --text-primary: #e4e4e7;
  --text-secondary: #71717a;
  --text-tertiary: #52525b;
  --text-inverse: #18181b;
  
  /* Border Colors */
  --border-primary: #2a2a3a;
  --border-secondary: #3f3f52;
  --border-tertiary: #52525b;
  
  /* Typography */
  --font-family-primary: 'Inter', system-ui, sans-serif;
  --font-family-mono: 'JetBrains Mono', monospace;
  
  /* Spacing */
  --spacing-xs: 4px;
  --spacing-sm: 8px;
  --spacing-md: 16px;
  --spacing-lg: 24px;
  --spacing-xl: 32px;
  --spacing-2xl: 48px;
  
  /* Border Radius */
  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 12px;
  --radius-xl: 16px;
  
  /* Shadows */
  --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  --shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
  
  /* Transitions */
  --transition-fast: 150ms ease;
  --transition-normal: 250ms ease;
  --transition-slow: 350ms ease;
}

/* Base Styles */
* {
  box-sizing: border-box;
}

body {
  font-family: var(--font-family-primary);
  color: var(--text-primary);
  background-color: var(--bg-primary);
  line-height: 1.6;
  margin: 0;
  padding: 0;
}

/* Component Base Styles */
.widget {
  background: var(--bg-secondary);
  border: 1px solid var(--border-primary);
  border-radius: var(--radius-lg);
  padding: var(--spacing-lg);
  margin: var(--spacing-md) 0;
}

.widget-title {
  font-size: 18px;
  font-weight: 600;
  color: var(--primary-color);
  margin-bottom: var(--spacing-md);
}

.widget-description {
  font-size: 14px;
  color: var(--text-secondary);
  margin-bottom: var(--spacing-lg);
}

/* Button Styles */
.btn {
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-sm) var(--spacing-md);
  border: 1px solid var(--border-primary);
  border-radius: var(--radius-md);
  font-family: var(--font-family-primary);
  font-size: 14px;
  font-weight: 500;
  text-decoration: none;
  cursor: pointer;
  transition: all var(--transition-fast);
  background: var(--bg-tertiary);
  color: var(--text-primary);
}

.btn:hover {
  border-color: var(--primary-color);
  color: var(--primary-color);
  transform: translateY(-1px);
  box-shadow: var(--shadow-md);
}

.btn-primary {
  background: var(--primary-color);
  color: var(--text-inverse);
  border-color: var(--primary-color);
}

.btn-primary:hover {
  background: var(--primary-dark);
  border-color: var(--primary-dark);
}

.btn-secondary {
  background: var(--bg-tertiary);
  color: var(--text-primary);
  border-color: var(--border-secondary);
}

.btn-success {
  background: var(--success-color);
  color: white;
  border-color: var(--success-color);
}

.btn-warning {
  background: var(--warning-color);
  color: var(--text-inverse);
  border-color: var(--warning-color);
}

.btn-error {
  background: var(--error-color);
  color: white;
  border-color: var(--error-color);
}

/* Form Controls */
.form-control {
  display: block;
  width: 100%;
  padding: var(--spacing-sm) var(--spacing-md);
  border: 1px solid var(--border-primary);
  border-radius: var(--radius-md);
  font-family: var(--font-family-primary);
  font-size: 14px;
  background: var(--bg-tertiary);
  color: var(--text-primary);
  transition: border-color var(--transition-fast);
}

.form-control:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px rgba(201, 168, 76, 0.1);
}

.form-select {
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e");
  background-position: right var(--spacing-sm) center;
  background-repeat: no-repeat;
  background-size: 16px;
  padding-right: var(--spacing-xl);
}

/* Status Indicators */
.status {
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-xs);
  padding: var(--spacing-xs) var(--spacing-sm);
  border-radius: var(--radius-sm);
  font-size: 12px;
  font-weight: 500;
  text-transform: uppercase;
}

.status-success {
  background: rgba(34, 197, 94, 0.1);
  color: var(--success-color);
}

.status-warning {
  background: rgba(234, 179, 8, 0.1);
  color: var(--warning-color);
}

.status-error {
  background: rgba(239, 68, 68, 0.1);
  color: var(--error-color);
}

.status-info {
  background: rgba(59, 130, 246, 0.1);
  color: var(--info-color);
}

/* Loading States */
.loading {
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-sm);
}

.spinner {
  width: 16px;
  height: 16px;
  border: 2px solid var(--border-primary);
  border-top: 2px solid var(--primary-color);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Utility Classes */
.text-center { text-align: center; }
.text-left { text-align: left; }
.text-right { text-align: right; }

.font-mono { font-family: var(--font-family-mono); }
.font-bold { font-weight: 600; }
.font-medium { font-weight: 500; }

.text-primary { color: var(--text-primary); }
.text-secondary { color: var(--text-secondary); }
.text-tertiary { color: var(--text-tertiary); }

.bg-primary { background: var(--bg-primary); }
.bg-secondary { background: var(--bg-secondary); }
.bg-tertiary { background: var(--bg-tertiary); }

.border-primary { border-color: var(--border-primary); }
.border-secondary { border-color: var(--border-secondary); }

.rounded-sm { border-radius: var(--radius-sm); }
.rounded-md { border-radius: var(--radius-md); }
.rounded-lg { border-radius: var(--radius-lg); }

.shadow-sm { box-shadow: var(--shadow-sm); }
.shadow-md { box-shadow: var(--shadow-md); }
.shadow-lg { box-shadow: var(--shadow-lg); }
```

### Dark Theme CSS
```css
/* assets/styles/themes/dark.css */
:root {
  --bg-primary: #0a0a0f;
  --bg-secondary: #141420;
  --bg-tertiary: #1a1a2a;
  --bg-quaternary: #2a2a3a;
  
  --text-primary: #e4e4e7;
  --text-secondary: #a1a1aa;
  --text-tertiary: #71717a;
  --text-inverse: #18181b;
  
  --border-primary: #2a2a3a;
  --border-secondary: #3f3f52;
  --border-tertiary: #52525b;
}

/* Enhanced dark theme adjustments */
.widget {
  background: var(--bg-secondary);
  border-color: var(--border-primary);
}

.form-control {
  background: var(--bg-tertiary);
  border-color: var(--border-primary);
  color: var(--text-primary);
}

.btn {
  background: var(--bg-tertiary);
  border-color: var(--border-primary);
  color: var(--text-primary);
}

.btn:hover {
  border-color: var(--primary-color);
  color: var(--primary-color);
}
```

### Light Theme CSS
```css
/* assets/styles/themes/light.css */
:root {
  --bg-primary: #ffffff;
  --bg-secondary: #f8f9fa;
  --bg-tertiary: #e9ecef;
  --bg-quaternary: #dee2e6;
  
  --text-primary: #212529;
  --text-secondary: #6c757d;
  --text-tertiary: #adb5bd;
  --text-inverse: #f8f9fa;
  
  --border-primary: #dee2e6;
  --border-secondary: #ced4da;
  --border-tertiary: #adb5bd;
}

/* Light theme adjustments */
.widget {
  background: var(--bg-secondary);
  border-color: var(--border-primary);
  color: var(--text-primary);
}

.form-control {
  background: var(--bg-primary);
  border-color: var(--border-primary);
  color: var(--text-primary);
}

.btn {
  background: var(--bg-tertiary);
  border-color: var(--border-primary);
  color: var(--text-primary);
}

.btn:hover {
  border-color: var(--primary-color);
  color: var(--primary-color);
}
```

### Animations CSS
```css
/* assets/styles/utilities/animations.css */

/* Fade animations */
.fade-in {
  animation: fadeIn 0.3s ease-in-out;
}

.fade-out {
  animation: fadeOut 0.3s ease-in-out;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes fadeOut {
  from { opacity: 1; }
  to { opacity: 0; }
}

/* Slide animations */
.slide-in-up {
  animation: slideInUp 0.3s ease-out;
}

.slide-in-down {
  animation: slideInDown 0.3s ease-out;
}

.slide-in-left {
  animation: slideInLeft 0.3s ease-out;
}

.slide-in-right {
  animation: slideInRight 0.3s ease-out;
}

@keyframes slideInUp {
  from { transform: translateY(20px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

@keyframes slideInDown {
  from { transform: translateY(-20px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

@keyframes slideInLeft {
  from { transform: translateX(-20px); opacity: 0; }
  to { transform: translateX(0); opacity: 1; }
}

@keyframes slideInRight {
  from { transform: translateX(20px); opacity: 0; }
  to { transform: translateX(0); opacity: 1; }
}

/* Scale animations */
.scale-in {
  animation: scaleIn 0.2s ease-out;
}

.scale-out {
  animation: scaleOut 0.2s ease-in;
}

@keyframes scaleIn {
  from { transform: scale(0.8); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
}

@keyframes scaleOut {
  from { transform: scale(1); opacity: 1; }
  to { transform: scale(0.8); opacity: 0; }
}

/* Pulse animation */
.pulse {
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

/* Bounce animation */
.bounce {
  animation: bounce 0.6s ease-out;
}

@keyframes bounce {
  0%, 20%, 53%, 80%, 100% {
    transform: translateY(0);
  }
  40%, 43% {
    transform: translateY(-8px);
  }
  70% {
    transform: translateY(-4px);
  }
  90% {
    transform: translateY(-2px);
  }
}

/* Hover effects */
.hover-lift {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.hover-lift:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.hover-scale {
  transition: transform 0.2s ease;
}

.hover-scale:hover {
  transform: scale(1.05);
}

.hover-glow {
  transition: box-shadow 0.2s ease;
}

.hover-glow:hover {
  box-shadow: 0 0 20px rgba(201, 168, 76, 0.3);
}

/* Loading animations */
.loading-dots {
  display: inline-flex;
  gap: 4px;
}

.loading-dots span {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--primary-color);
  animation: loadingDots 1.4s infinite ease-in-out both;
}

.loading-dots span:nth-child(1) { animation-delay: -0.32s; }
.loading-dots span:nth-child(2) { animation-delay: -0.16s; }

@keyframes loadingDots {
  0%, 80%, 100% {
    transform: scale(0);
    opacity: 0.5;
  }
  40% {
    transform: scale(1);
    opacity: 1;
  }
}

/* Progress animations */
.progress-bar {
  overflow: hidden;
  height: 4px;
  background: var(--bg-tertiary);
  border-radius: 2px;
}

.progress-bar-fill {
  height: 100%;
  background: var(--primary-color);
  border-radius: 2px;
  transition: width 0.3s ease;
}

.progress-bar-animated {
  background: linear-gradient(
    90deg,
    var(--primary-color),
    var(--primary-light),
    var(--primary-color)
  );
  background-size: 200% 100%;
  animation: progressAnimation 2s linear infinite;
}

@keyframes progressAnimation {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}
```

### Responsive CSS
```css
/* assets/styles/utilities/responsive.css */

/* Mobile First Approach */
.container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 var(--spacing-md);
}

/* Grid System */
.grid {
  display: grid;
  gap: var(--spacing-md);
}

.grid-cols-1 { grid-template-columns: 1fr; }
.grid-cols-2 { grid-template-columns: repeat(2, 1fr); }
.grid-cols-3 { grid-template-columns: repeat(3, 1fr); }
.grid-cols-4 { grid-template-columns: repeat(4, 1fr); }

/* Flexbox Utilities */
.flex { display: flex; }
.flex-col { flex-direction: column; }
.flex-wrap { flex-wrap: wrap; }
.flex-nowrap { flex-wrap: nowrap; }

.justify-start { justify-content: flex-start; }
.justify-center { justify-content: center; }
.justify-end { justify-content: flex-end; }
.justify-between { justify-content: space-between; }
.justify-around { justify-content: space-around; }

.items-start { align-items: flex-start; }
.items-center { align-items: center; }
.items-end { align-items: flex-end; }
.items-stretch { align-items: stretch; }

/* Spacing Utilities */
.gap-xs { gap: var(--spacing-xs); }
.gap-sm { gap: var(--spacing-sm); }
.gap-md { gap: var(--spacing-md); }
.gap-lg { gap: var(--spacing-lg); }
.gap-xl { gap: var(--spacing-xl); }

.p-xs { padding: var(--spacing-xs); }
.p-sm { padding: var(--spacing-sm); }
.p-md { padding: var(--spacing-md); }
.p-lg { padding: var(--spacing-lg); }
.p-xl { padding: var(--spacing-xl); }

.m-xs { margin: var(--spacing-xs); }
.m-sm { margin: var(--spacing-sm); }
.m-md { margin: var(--spacing-md); }
.m-lg { margin: var(--spacing-lg); }
.m-xl { margin: var(--spacing-xl); }

/* Responsive Breakpoints */
@media (min-width: 640px) {
  .sm\:grid-cols-2 { grid-template-columns: repeat(2, 1fr); }
  .sm\:grid-cols-3 { grid-template-columns: repeat(3, 1fr); }
  .sm\:grid-cols-4 { grid-template-columns: repeat(4, 1fr); }
  
  .sm\:flex-row { flex-direction: row; }
  .sm\:flex-col { flex-direction: column; }
  
  .sm\:p-md { padding: var(--spacing-md); }
  .sm\:p-lg { padding: var(--spacing-lg); }
}

@media (min-width: 768px) {
  .md\:grid-cols-2 { grid-template-columns: repeat(2, 1fr); }
  .md\:grid-cols-3 { grid-template-columns: repeat(3, 1fr); }
  .md\:grid-cols-4 { grid-template-columns: repeat(4, 1fr); }
  
  .md\:hidden { display: none; }
  .md\:block { display: block; }
  .md\:flex { display: flex; }
}

@media (min-width: 1024px) {
  .lg\:grid-cols-2 { grid-template-columns: repeat(2, 1fr); }
  .lg\:grid-cols-3 { grid-template-columns: repeat(3, 1fr); }
  .lg\:grid-cols-4 { grid-template-columns: repeat(4, 1fr); }
  
  .lg\:hidden { display: none; }
  .lg\:block { display: block; }
  .lg\:flex { display: flex; }
}

@media (min-width: 1280px) {
  .xl\:grid-cols-2 { grid-template-columns: repeat(2, 1fr); }
  .xl\:grid-cols-3 { grid-template-columns: repeat(3, 1fr); }
  .xl\:grid-cols-4 { grid-template-columns: repeat(4, 1fr); }
  
  .xl\:hidden { display: none; }
  .xl\:block { display: block; }
  .xl\:flex { display: flex; }
}

/* Mobile Optimizations */
@media (max-width: 639px) {
  .container {
    padding: 0 var(--spacing-sm);
  }
  
  .widget {
    padding: var(--spacing-md);
    margin: var(--spacing-sm) 0;
  }
  
  .btn {
    padding: var(--spacing-sm) var(--spacing-md);
    font-size: 14px;
  }
  
  .form-control {
    padding: var(--spacing-sm);
    font-size: 16px; /* Prevents zoom on iOS */
  }
  
  .grid-cols-2,
  .grid-cols-3,
  .grid-cols-4 {
    grid-template-columns: 1fr;
  }
}

/* Tablet Optimizations */
@media (min-width: 640px) and (max-width: 1023px) {
  .widget {
    padding: var(--spacing-lg);
  }
  
  .grid-cols-3,
  .grid-cols-4 {
    grid-template-columns: repeat(2, 1fr);
  }
}

/* Desktop Optimizations */
@media (min-width: 1024px) {
  .widget {
    padding: var(--spacing-xl);
  }
  
  .container {
    padding: 0 var(--spacing-lg);
  }
}

/* Print Styles */
@media print {
  .widget {
    border: 1px solid #000;
    background: #fff;
    color: #000;
  }
  
  .btn {
    display: none;
  }
  
  .spinner {
    display: none;
  }
}
```

### Accessibility CSS
```css
/* assets/styles/utilities/accessibility.css */

/* Focus Management */
.focus-visible:focus {
  outline: 2px solid var(--primary-color);
  outline-offset: 2px;
}

.focus-within:focus-within {
  outline: 2px solid var(--primary-color);
  outline-offset: 2px;
}

/* Skip Links */
.skip-link {
  position: absolute;
  top: -40px;
  left: 6px;
  background: var(--primary-color);
  color: var(--text-inverse);
  padding: 8px;
  text-decoration: none;
  border-radius: 4px;
  z-index: 1000;
}

.skip-link:focus {
  top: 6px;
}

/* Screen Reader Only */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

/* Not Screen Reader Only */
.not-sr-only {
  position: static;
  width: auto;
  height: auto;
  padding: 0;
  margin: 0;
  overflow: visible;
  clip: auto;
  white-space: normal;
}

/* High Contrast Mode */
@media (prefers-contrast: high) {
  :root {
    --border-primary: #000000;
    --text-primary: #000000;
    --bg-primary: #ffffff;
  }
  
  .btn {
    border-width: 2px;
  }
  
  .widget {
    border-width: 2px;
  }
}

/* Reduced Motion */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
  
  .spinner {
    animation: none;
    border: 4px solid var(--border-primary);
    border-top-color: var(--primary-color);
  }
}

/* Color Blindness Support */
.colorblind-safe {
  --success-color: #0066cc;
  --warning-color: #ff8800;
  --error-color: #cc0000;
  --info-color: #0066cc;
}

/* Large Text Support */
@media (prefers-reduced-motion: no-preference) {
  .large-text {
    font-size: 1.2em;
    line-height: 1.5;
  }
}

/* Keyboard Navigation */
.keyboard-nav *:focus {
  outline: 2px solid var(--primary-color);
  outline-offset: 2px;
}

/* ARIA Attributes */
[aria-hidden="true"] {
  display: none;
}

[aria-disabled="true"] {
  opacity: 0.6;
  cursor: not-allowed;
}

[aria-expanded="true"]::before {
  content: "(-) ";
}

[aria-expanded="false"]::before {
  content: "(+) ";
}

/* Role Attributes */
[role="button"] {
  cursor: pointer;
}

[role="button"]:hover {
  background: var(--bg-tertiary);
}

[role="navigation"] {
  list-style: none;
  padding: 0;
}

[role="navigation"] li {
  margin: var(--spacing-sm) 0;
}

[role="main"] {
  min-height: 100vh;
}

[role="complementary"] {
  margin: var(--spacing-lg) 0;
}

/* Live Regions */
[aria-live="polite"] {
  position: absolute;
  left: -10000px;
  width: 1px;
  height: 1px;
  overflow: hidden;
}

[aria-live="assertive"] {
  position: absolute;
  left: -10000px;
  width: 1px;
  height: 1px;
  overflow: hidden;
}

/* Tooltips */
[aria-describedby] {
  position: relative;
}

[aria-describedby]::after {
  content: attr(aria-describedby);
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%);
  background: var(--bg-tertiary);
  color: var(--text-primary);
  padding: var(--spacing-sm);
  border-radius: var(--radius-sm);
  font-size: 12px;
  white-space: nowrap;
  opacity: 0;
  pointer-events: none;
  transition: opacity var(--transition-fast);
  z-index: 1000;
}

[aria-describedby]:hover::after {
  opacity: 1;
}
```

## Font Assets

### Inter Font Files
The Inter font files should be downloaded from Google Fonts or the Inter website and placed in the appropriate directories:

```
assets/fonts/inter/
|-- inter-regular.woff2
|-- inter-medium.woff2
|-- inter-semibold.woff2
|-- inter-bold.woff2
```

### JetBrains Mono Font Files
```
assets/fonts/jetbrains-mono/
|-- jetbrains-mono-regular.woff2
|-- jetbrains-mono-medium.woff2
```

## Video Assets

### Video Specifications
- **Format**: MP4 (H.264)
- **Resolution**: 1920x1080 (Full HD)
- **Frame Rate**: 30fps
- **Bitrate**: 8-12 Mbps
- **Audio**: AAC, 128kbps, 48kHz

### Video Content Structure
```
assets/videos/
|
|-- walkthroughs/
|   |-- 2min-overview.mp4
|   |-- 5min-detailed.mp4
|   |-- 30sec-teasers/
|   |   |-- pii-detection.mp4
|   |   |-- cryptographic-proof.mp4
|   |   |-- interactive-badges.mp4
|   |   |-- industry-solutions.mp4
|
|-- tutorials/
|   |-- getting-started.mp4
|   |-- integration-guide.mp4
|   |-- customization.mp4
|   |-- troubleshooting.mp4
|
|-- thumbnails/
|   |-- 2min-overview.jpg
|   |-- 5min-detailed.jpg
|   |-- pii-detection.jpg
|   |-- cryptographic-proof.jpg
|   |-- interactive-badges.jpg
|   |-- industry-solutions.jpg
```

## Asset Optimization

### Image Optimization
- Use WebP format for better compression
- Provide fallback formats (PNG, JPEG)
- Implement lazy loading for large images
- Use responsive images with srcset

### Font Optimization
- Use WOFF2 format for better compression
- Subset fonts to include only needed characters
- Implement font-display: swap for better loading

### Video Optimization
- Use adaptive streaming for large videos
- Provide multiple quality options
- Implement poster images for video placeholders
- Use modern video codecs (H.265/AV1) where supported

## Asset Delivery

### CDN Configuration
```javascript
// CDN configuration for assets
const assetCDN = {
  baseURL: 'https://cdn.datacendia.com/demo-package',
  version: '1.0.0',
  compression: {
    gzip: true,
    brotli: true
  },
  cache: {
    maxAge: 31536000, // 1 year
    immutable: true
  }
};
```

### Asset Loading Strategy
```javascript
// Progressive asset loading
class AssetLoader {
  constructor() {
    this.loadedAssets = new Set();
    this.loadingPromises = new Map();
  }

  async loadAsset(type, path) {
    const key = `${type}:${path}`;
    
    if (this.loadedAssets.has(key)) {
      return Promise.resolve();
    }

    if (this.loadingPromises.has(key)) {
      return this.loadingPromises.get(key);
    }

    const promise = this.loadAssetInternal(type, path);
    this.loadingPromises.set(key, promise);

    try {
      await promise;
      this.loadedAssets.add(key);
    } finally {
      this.loadingPromises.delete(key);
    }

    return promise;
  }

  async loadAssetInternal(type, path) {
    const element = this.createElement(type, path);
    return this.loadElement(element);
  }

  createElement(type, path) {
    switch (type) {
      case 'script':
        const script = document.createElement('script');
        script.src = path;
        script.async = true;
        return script;
      
      case 'style':
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = path;
        return link;
      
      case 'image':
        const img = document.createElement('img');
        img.src = path;
        return img;
      
      default:
        throw new Error(`Unsupported asset type: ${type}`);
    }
  }

  loadElement(element) {
    return new Promise((resolve, reject) => {
      element.onload = resolve;
      element.onerror = reject;
      document.head.appendChild(element);
    });
  }
}
```

This comprehensive asset structure provides all the resources needed for a professional, production-ready demo package.
