# Framework-Specific Integration Examples

## React Integration

### Basic React Component
```jsx
import React, { useEffect, useRef, useState } from 'react';
import './datacendia-widgets.css';

const DatacendiaWidgets = () => {
  const [widgetsLoaded, setWidgetsLoaded] = useState(false);
  const [scanResults, setScanResults] = useState(null);
  const piiScannerRef = useRef(null);

  useEffect(() => {
    // Load widget scripts
    const script = document.createElement('script');
    script.src = './datacendia-widgets.js';
    script.onload = () => setWidgetsLoaded(true);
    document.head.appendChild(script);

    // Set up event listeners
    const handleScanComplete = (event) => {
      setScanResults(event.detail);
    };

    document.addEventListener('pii-scan-complete', handleScanComplete);

    return () => {
      document.removeEventListener('pii-scan-complete', handleScanComplete);
    };
  }, []);

  const handleLoadSample = () => {
    if (piiScannerRef.current) {
      piiScannerRef.current.loadSample();
    }
  };

  const handleScan = () => {
    if (piiScannerRef.current) {
      piiScannerRef.current.scan();
    }
  };

  if (!widgetsLoaded) {
    return <div>Loading Datacendia Widgets...</div>;
  }

  return (
    <div className="datacendia-demo">
      <h1>Datacendia AI Governance Widgets</h1>
      
      <div className="widget-section">
        <h2>PII Scanner</h2>
        <cendia-pii-scanner 
          ref={piiScannerRef}
          policy="gdpr"
          api-url="https://your-api.com/scan"
          auto-scan-ms="0">
        </cendia-pii-scanner>
        
        <div className="controls">
          <button onClick={handleLoadSample}>Load Sample</button>
          <button onClick={handleScan}>Scan PII</button>
        </div>
        
        {scanResults && (
          <div className="scan-results">
            <h3>Scan Results</h3>
            <p>Detections: {scanResults.detections.length}</p>
            <p>Policy: {scanResults.policy}</p>
            <p>Confidence: {scanResults.confidence}%</p>
          </div>
        )}
      </div>

      <div className="widget-section">
        <h2>Evidence Viewer</h2>
        <dcii-evidence-viewer 
          show-agents={true}
          compact={false}>
        </dcii-evidence-viewer>
      </div>

      <div className="widget-section">
        <h2>Council Status Badges</h2>
        <div className="badges">
          <council-status-badge 
            status="completed" 
            confidence="0.82" 
            agent-count="6">
          </council-status-badge>
          <council-status-badge 
            status="deliberating" 
            confidence="0.64" 
            agent-count="4">
          </council-status-badge>
          <council-status-badge 
            status="pending">
          </council-status-badge>
        </div>
      </div>
    </div>
  );
};

export default DatacendiaWidgets;
```

### React with TypeScript
```tsx
import React, { useEffect, useRef, useState } from 'react';
import './datacendia-widgets.css';

interface ScanResults {
  detections: Array<{
    type: string;
    value: string;
    confidence: number;
  }>;
  policy: string;
  confidence: number;
  redactedText: string;
}

interface DatacendiaWidgetsProps {
  apiUrl?: string;
  defaultPolicy?: string;
  showAnalytics?: boolean;
}

const DatacendiaWidgets: React.FC<DatacendiaWidgetsProps> = ({
  apiUrl = 'https://your-api.com/scan',
  defaultPolicy = 'gdpr',
  showAnalytics = true
}) => {
  const [widgetsLoaded, setWidgetsLoaded] = useState(false);
  const [scanResults, setScanResults] = useState<ScanResults | null>(null);
  const piiScannerRef = useRef<any>(null);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = './datacendia-widgets.js';
    script.onload = () => setWidgetsLoaded(true);
    document.head.appendChild(script);

    const handleScanComplete = (event: CustomEvent<ScanResults>) => {
      setScanResults(event.detail);
    };

    document.addEventListener('pii-scan-complete', handleScanComplete);

    return () => {
      document.removeEventListener('pii-scan-complete', handleScanComplete);
    };
  }, []);

  if (!widgetsLoaded) {
    return <div>Loading Datacendia Widgets...</div>;
  }

  return (
    <div className="datacendia-demo">
      <cendia-pii-scanner 
        ref={piiScannerRef}
        policy={defaultPolicy}
        api-url={apiUrl}
        auto-scan-ms="0">
      </cendia-pii-scanner>
      
      {showAnalytics && (
        <div className="analytics">
          <h3>Analytics</h3>
          <p>Scans Completed: {scanResults?.detections.length || 0}</p>
          <p>Policy Used: {scanResults?.policy || 'None'}</p>
        </div>
      )}
    </div>
  );
};

export default DatacendiaWidgets;
```

### React Hooks for Widget Management
```jsx
import { useState, useEffect, useCallback } from 'react';

export const useDatacendiaWidgets = () => {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = './datacendia-widgets.js';
    script.onload = () => setLoaded(true);
    script.onerror = () => setError('Failed to load widgets');
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, []);

  const loadWidgets = useCallback(() => {
    if (!loaded) {
      const script = document.createElement('script');
      script.src = './datacendia-widgets.js';
      script.onload = () => setLoaded(true);
      document.head.appendChild(script);
    }
  }, [loaded]);

  return { loaded, error, loadWidgets };
};

export const usePIIScanner = () => {
  const [results, setResults] = useState(null);
  const [scanning, setScanning] = useState(false);

  const scan = useCallback((text, policy = 'gdpr') => {
    setScanning(true);
    
    const scanner = document.querySelector('cendia-pii-scanner');
    if (scanner) {
      scanner.scanText(text, policy);
    }
  }, []);

  useEffect(() => {
    const handleScanComplete = (event) => {
      setResults(event.detail);
      setScanning(false);
    };

    document.addEventListener('pii-scan-complete', handleScanComplete);
    
    return () => {
      document.removeEventListener('pii-scan-complete', handleScanComplete);
    };
  }, []);

  return { results, scanning, scan };
};
```

## Vue.js Integration

### Vue 3 Composition API
```vue
<template>
  <div class="datacendia-demo">
    <h1>Datacendia AI Governance Widgets</h1>
    
    <div v-if="!widgetsLoaded" class="loading">
      Loading widgets...
    </div>
    
    <div v-else>
      <div class="widget-section">
        <h2>PII Scanner</h2>
        <cendia-pii-scanner 
          ref="piiScanner"
          :policy="selectedPolicy"
          :api-url="apiUrl"
          @scan-complete="handleScanComplete">
        </cendia-pii-scanner>
        
        <div class="controls">
          <button @click="loadSample">Load Sample</button>
          <button @click="scanText">Scan PII</button>
          <select v-model="selectedPolicy">
            <option value="gdpr">GDPR</option>
            <option value="hipaa">HIPAA</option>
            <option value="custom">Custom</option>
          </select>
        </div>
        
        <div v-if="scanResults" class="scan-results">
          <h3>Scan Results</h3>
          <p>Detections: {{ scanResults.detections.length }}</p>
          <p>Policy: {{ scanResults.policy }}</p>
          <p>Confidence: {{ scanResults.confidence }}%</p>
        </div>
      </div>

      <div class="widget-section">
        <h2>Evidence Viewer</h2>
        <dcii-evidence-viewer 
          :show-agents="showAgents"
          :compact="compactMode"
          @evidence-loaded="handleEvidenceLoaded">
        </dcii-evidence-viewer>
      </div>

      <div class="widget-section">
        <h2>Council Status Badges</h2>
        <div class="badges">
          <council-status-badge 
            v-for="badge in badges"
            :key="badge.id"
            :status="badge.status"
            :confidence="badge.confidence"
            :agent-count="badge.agentCount"
            @badge-clicked="handleBadgeClick">
          </council-status-badge>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, reactive } from 'vue';

export default {
  name: 'DatacendiaDemo',
  setup() {
    const widgetsLoaded = ref(false);
    const piiScanner = ref(null);
    const selectedPolicy = ref('gdpr');
    const apiUrl = ref('https://your-api.com/scan');
    const scanResults = ref(null);
    const showAgents = ref(true);
    const compactMode = ref(false);

    const badges = reactive([
      { id: 1, status: 'completed', confidence: 0.82, agentCount: 6 },
      { id: 2, status: 'deliberating', confidence: 0.64, agentCount: 4 },
      { id: 3, status: 'pending', confidence: 0, agentCount: 0 }
    ]);

    const loadWidgets = () => {
      const script = document.createElement('script');
      script.src = './datacendia-widgets.js';
      script.onload = () => {
        widgetsLoaded.value = true;
      };
      document.head.appendChild(script);
    };

    const loadSample = () => {
      if (piiScanner.value) {
        piiScanner.value.loadSample();
      }
    };

    const scanText = () => {
      if (piiScanner.value) {
        piiScanner.value.scan();
      }
    };

    const handleScanComplete = (event) => {
      scanResults.value = event.detail;
    };

    const handleEvidenceLoaded = (event) => {
      console.log('Evidence loaded:', event.detail);
    };

    const handleBadgeClick = (event) => {
      console.log('Badge clicked:', event.detail);
    };

    onMounted(() => {
      loadWidgets();
    });

    return {
      widgetsLoaded,
      piiScanner,
      selectedPolicy,
      apiUrl,
      scanResults,
      showAgents,
      compactMode,
      badges,
      loadSample,
      scanText,
      handleScanComplete,
      handleEvidenceLoaded,
      handleBadgeClick
    };
  }
};
</script>

<style scoped>
.datacendia-demo {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.widget-section {
  margin-bottom: 40px;
}

.controls {
  margin: 20px 0;
  display: flex;
  gap: 10px;
  align-items: center;
}

.scan-results {
  background: #f5f5f5;
  padding: 20px;
  border-radius: 8px;
  margin-top: 20px;
}

.badges {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
}

.loading {
  text-align: center;
  padding: 40px;
  font-size: 18px;
}
</style>
```

### Vue 2 Options API
```vue
<template>
  <div class="datacendia-demo">
    <h1>Datacendia AI Governance Widgets</h1>
    
    <div v-if="!widgetsLoaded" class="loading">
      Loading widgets...
    </div>
    
    <div v-else>
      <cendia-pii-scanner 
        ref="piiScanner"
        :policy="policy"
        :api-url="apiUrl">
      </cendia-pii-scanner>
      
      <div class="controls">
        <button @click="loadSample">Load Sample</button>
        <button @click="scan">Scan PII</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'DatacendiaDemo',
  data() {
    return {
      widgetsLoaded: false,
      policy: 'gdpr',
      apiUrl: 'https://your-api.com/scan',
      scanResults: null
    };
  },
  mounted() {
    this.loadWidgets();
    this.setupEventListeners();
  },
  methods: {
    loadWidgets() {
      const script = document.createElement('script');
      script.src = './datacendia-widgets.js';
      script.onload = () => {
        this.widgetsLoaded = true;
      };
      document.head.appendChild(script);
    },
    
    setupEventListeners() {
      document.addEventListener('pii-scan-complete', (event) => {
        this.scanResults = event.detail;
      });
    },
    
    loadSample() {
      if (this.$refs.piiScanner) {
        this.$refs.piiScanner.loadSample();
      }
    },
    
    scan() {
      if (this.$refs.piiScanner) {
        this.$refs.piiScanner.scan();
      }
    }
  }
};
</script>
```

## Angular Integration

### Angular Component
```typescript
import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-datacendia-demo',
  template: `
    <div class="datacendia-demo">
      <h1>Datacendia AI Governance Widgets</h1>
      
      <div *ngIf="!widgetsLoaded" class="loading">
        Loading widgets...
      </div>
      
      <div *ngIf="widgetsLoaded">
        <div class="widget-section">
          <h2>PII Scanner</h2>
          <cendia-pii-scanner 
            #piiScanner
            [policy]="selectedPolicy"
            [api-url]="apiUrl">
          </cendia-pii-scanner>
          
          <div class="controls">
            <button (click)="loadSample()">Load Sample</button>
            <button (click)="scan()">Scan PII</button>
            <select [(ngModel)]="selectedPolicy">
              <option value="gdpr">GDPR</option>
              <option value="hipaa">HIPAA</option>
              <option value="custom">Custom</option>
            </select>
          </div>
          
          <div *ngIf="scanResults" class="scan-results">
            <h3>Scan Results</h3>
            <p>Detections: {{ scanResults.detections.length }}</p>
            <p>Policy: {{ scanResults.policy }}</p>
            <p>Confidence: {{ scanResults.confidence }}%</p>
          </div>
        </div>

        <div class="widget-section">
          <h2>Evidence Viewer</h2>
          <dcii-evidence-viewer 
            [showAgents]="showAgents"
            [compact]="compactMode">
          </dcii-evidence-viewer>
        </div>

        <div class="widget-section">
          <h2>Council Status Badges</h2>
          <div class="badges">
            <council-status-badge 
              *ngFor="let badge of badges"
              [status]="badge.status"
              [confidence]="badge.confidence"
              [agentCount]="badge.agentCount">
            </council-status-badge>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .datacendia-demo {
      max-width: 1200px;
      margin: 0 auto;
      padding: 20px;
    }
    
    .widget-section {
      margin-bottom: 40px;
    }
    
    .controls {
      margin: 20px 0;
      display: flex;
      gap: 10px;
      align-items: center;
    }
    
    .scan-results {
      background: #f5f5f5;
      padding: 20px;
      border-radius: 8px;
      margin-top: 20px;
    }
    
    .badges {
      display: flex;
      gap: 20px;
      flex-wrap: wrap;
    }
    
    .loading {
      text-align: center;
      padding: 40px;
      font-size: 18px;
    }
  `]
})
export class DatacendiaDemoComponent implements OnInit, OnDestroy {
  @ViewChild('piiScanner') piiScanner!: ElementRef;
  
  widgetsLoaded = false;
  selectedPolicy = 'gdpr';
  apiUrl = 'https://your-api.com/scan';
  scanResults: any = null;
  showAgents = true;
  compactMode = false;
  
  badges = [
    { status: 'completed', confidence: 0.82, agentCount: 6 },
    { status: 'deliberating', confidence: 0.64, agentCount: 4 },
    { status: 'pending', confidence: 0, agentCount: 0 }
  ];

  ngOnInit() {
    this.loadWidgets();
    this.setupEventListeners();
  }

  ngOnDestroy() {
    this.removeEventListeners();
  }

  loadWidgets() {
    const script = document.createElement('script');
    script.src = './datacendia-widgets.js';
    script.onload = () => {
      this.widgetsLoaded = true;
    };
    document.head.appendChild(script);
  }

  setupEventListeners() {
    document.addEventListener('pii-scan-complete', this.handleScanComplete.bind(this));
    document.addEventListener('evidence-loaded', this.handleEvidenceLoaded.bind(this));
    document.addEventListener('badge-clicked', this.handleBadgeClicked.bind(this));
  }

  removeEventListeners() {
    document.removeEventListener('pii-scan-complete', this.handleScanComplete);
    document.removeEventListener('evidence-loaded', this.handleEvidenceLoaded);
    document.removeEventListener('badge-clicked', this.handleBadgeClicked);
  }

  loadSample() {
    if (this.piiScanner && this.piiScanner.nativeElement) {
      (this.piiScanner.nativeElement as any).loadSample();
    }
  }

  scan() {
    if (this.piiScanner && this.piiScanner.nativeElement) {
      (this.piiScanner.nativeElement as any).scan();
    }
  }

  private handleScanComplete(event: any) {
    this.scanResults = event.detail;
  }

  private handleEvidenceLoaded(event: any) {
    console.log('Evidence loaded:', event.detail);
  }

  private handleBadgeClicked(event: any) {
    console.log('Badge clicked:', event.detail);
  }
}
```

### Angular Service for Widget Management
```typescript
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DatacendiaWidgetsService {
  private widgetsLoaded = false;
  private loadPromise: Promise<void>;

  constructor() {
    this.loadPromise = this.loadWidgets();
  }

  private loadWidgets(): Promise<void> {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = './datacendia-widgets.js';
      script.onload = () => {
        this.widgetsLoaded = true;
        resolve();
      };
      script.onerror = () => reject(new Error('Failed to load widgets'));
      document.head.appendChild(script);
    });
  }

  ensureWidgetsLoaded(): Promise<void> {
    return this.widgetsLoaded ? Promise.resolve() : this.loadPromise;
  }

  getWidget(element: string): any {
    return document.querySelector(element);
  }

  configurePIIScanner(config: {
    policy?: string;
    apiUrl?: string;
    autoScanMs?: number;
  }): void {
    const scanner = this.getWidget('cendia-pii-scanner');
    if (scanner) {
      Object.assign(scanner, config);
    }
  }

  scanText(text: string, policy = 'gdpr'): Promise<any> {
    return new Promise((resolve, reject) => {
      const scanner = this.getWidget('cendia-pii-scanner');
      if (scanner) {
        const handleComplete = (event: any) => {
          document.removeEventListener('pii-scan-complete', handleComplete);
          resolve(event.detail);
        };
        
        document.addEventListener('pii-scan-complete', handleComplete);
        scanner.scanText(text, policy);
      } else {
        reject(new Error('PII Scanner not found'));
      }
    });
  }
}
```

## Plain HTML Integration

### Basic HTML Page
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Datacendia Widgets Demo</title>
  <link rel="stylesheet" href="datacendia-widgets.css">
  <style>
    body {
      font-family: Arial, sans-serif;
      max-width: 1200px;
      margin: 0 auto;
      padding: 20px;
      background-color: #f5f5f5;
    }
    
    .demo-container {
      background: white;
      padding: 30px;
      border-radius: 8px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
      margin-bottom: 30px;
    }
    
    .controls {
      margin: 20px 0;
      display: flex;
      gap: 10px;
      align-items: center;
    }
    
    .controls button {
      background: #007bff;
      color: white;
      border: none;
      padding: 8px 16px;
      border-radius: 4px;
      cursor: pointer;
    }
    
    .controls button:hover {
      background: #0056b3;
    }
    
    .controls select {
      padding: 8px;
      border: 1px solid #ddd;
      border-radius: 4px;
    }
    
    .results {
      background: #e9ecef;
      padding: 20px;
      border-radius: 4px;
      margin-top: 20px;
    }
    
    .badges {
      display: flex;
      gap: 20px;
      flex-wrap: wrap;
    }
  </style>
</head>
<body>
  <div class="demo-container">
    <h1>Datacendia AI Governance Widgets</h1>
    
    <div class="widget-section">
      <h2>PII Scanner</h2>
      <cendia-pii-scanner id="pii-scanner" policy="gdpr"></cendia-pii-scanner>
      
      <div class="controls">
        <button onclick="loadSample()">Load Sample</button>
        <button onclick="scanText()">Scan PII</button>
        <select id="policy-select" onchange="changePolicy()">
          <option value="gdpr">GDPR</option>
          <option value="hipaa">HIPAA</option>
          <option value="custom">Custom</option>
        </select>
      </div>
      
      <div id="scan-results" class="results" style="display: none;">
        <h3>Scan Results</h3>
        <p id="detections-count"></p>
        <p id="policy-used"></p>
        <p id="confidence-score"></p>
      </div>
    </div>

    <div class="widget-section">
      <h2>Evidence Viewer</h2>
      <dcii-evidence-viewer id="evidence-viewer" show-agents="true"></dcii-evidence-viewer>
    </div>

    <div class="widget-section">
      <h2>Council Status Badges</h2>
      <div class="badges">
        <council-status-badge status="completed" confidence="0.82" agent-count="6"></council-status-badge>
        <council-status-badge status="deliberating" confidence="0.64" agent-count="4"></council-status-badge>
        <council-status-badge status="pending"></council-status-badge>
      </div>
    </div>
  </div>

  <script src="datacendia-widgets.js"></script>
  <script>
    // Widget management functions
    function loadSample() {
      const scanner = document.getElementById('pii-scanner');
      if (scanner) {
        scanner.loadSample();
      }
    }

    function scanText() {
      const scanner = document.getElementById('pii-scanner');
      if (scanner) {
        scanner.scan();
      }
    }

    function changePolicy() {
      const scanner = document.getElementById('pii-scanner');
      const policySelect = document.getElementById('policy-select');
      
      if (scanner && policySelect) {
        scanner.policy = policySelect.value;
      }
    }

    // Event listeners
    document.addEventListener('DOMContentLoaded', function() {
      // Listen for scan completion
      document.addEventListener('pii-scan-complete', function(event) {
        const results = event.detail;
        const resultsDiv = document.getElementById('scan-results');
        const detectionsCount = document.getElementById('detections-count');
        const policyUsed = document.getElementById('policy-used');
        const confidenceScore = document.getElementById('confidence-score');
        
        if (resultsDiv && detectionsCount && policyUsed && confidenceScore) {
          detectionsCount.textContent = `Detections: ${results.detections.length}`;
          policyUsed.textContent = `Policy: ${results.policy}`;
          confidenceScore.textContent = `Confidence: ${results.confidence}%`;
          resultsDiv.style.display = 'block';
        }
      });

      // Listen for badge clicks
      document.addEventListener('badge-clicked', function(event) {
        console.log('Badge clicked:', event.detail);
      });

      // Listen for evidence loading
      document.addEventListener('evidence-loaded', function(event) {
        console.log('Evidence loaded:', event.detail);
      });
    });

    // Analytics tracking
    function trackEvent(eventName, data) {
      if (typeof gtag !== 'undefined') {
        gtag('event', eventName, data);
      }
    }

    // Track widget interactions
    document.addEventListener('click', function(event) {
      if (event.target.tagName.toLowerCase() === 'button') {
        trackEvent('widget_interaction', {
          event_category: 'engagement',
          event_label: event.target.textContent
        });
      }
    });
  </script>
</body>
</html>
```

### Advanced HTML with Custom Configuration
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Datacendia Widgets - Advanced Demo</title>
  <link rel="stylesheet" href="datacendia-widgets.css">
  <style>
    :root {
      --primary-color: #007bff;
      --secondary-color: #6c757d;
      --success-color: #28a745;
      --warning-color: #ffc107;
      --danger-color: #dc3545;
      --light-color: #f8f9fa;
      --dark-color: #343a40;
    }
    
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      margin: 0;
      padding: 0;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      min-height: 100vh;
    }
    
    .header {
      background: rgba(255, 255, 255, 0.1);
      backdrop-filter: blur(10px);
      padding: 20px;
      text-align: center;
      color: white;
    }
    
    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 20px;
    }
    
    .widget-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 30px;
      margin-top: 30px;
    }
    
    .widget-card {
      background: white;
      border-radius: 12px;
      padding: 30px;
      box-shadow: 0 10px 30px rgba(0,0,0,0.1);
      transition: transform 0.3s ease;
    }
    
    .widget-card:hover {
      transform: translateY(-5px);
    }
    
    .controls {
      display: flex;
      gap: 10px;
      margin: 20px 0;
      flex-wrap: wrap;
    }
    
    .btn {
      background: var(--primary-color);
      color: white;
      border: none;
      padding: 10px 20px;
      border-radius: 6px;
      cursor: pointer;
      transition: background 0.3s ease;
    }
    
    .btn:hover {
      background: #0056b3;
    }
    
    .btn-secondary {
      background: var(--secondary-color);
    }
    
    .btn-success {
      background: var(--success-color);
    }
    
    .form-control {
      padding: 10px;
      border: 1px solid #ddd;
      border-radius: 6px;
      font-size: 14px;
    }
    
    .alert {
      padding: 15px;
      border-radius: 6px;
      margin: 20px 0;
    }
    
    .alert-info {
      background: #d1ecf1;
      color: #0c5460;
      border: 1px solid #bee5eb;
    }
    
    .alert-success {
      background: #d4edda;
      color: #155724;
      border: 1px solid #c3e6cb;
    }
    
    .metrics {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
      gap: 15px;
      margin: 20px 0;
    }
    
    .metric {
      background: var(--light-color);
      padding: 15px;
      border-radius: 6px;
      text-align: center;
    }
    
    .metric-value {
      font-size: 24px;
      font-weight: bold;
      color: var(--primary-color);
    }
    
    .metric-label {
      font-size: 12px;
      color: var(--secondary-color);
      text-transform: uppercase;
    }
  </style>
</head>
<body>
  <header class="header">
    <h1>Datacendia AI Governance Widgets</h1>
    <p>Advanced Demo with Custom Configuration</p>
  </header>

  <div class="container">
    <div class="widget-grid">
      <div class="widget-card">
        <h2>PII Scanner</h2>
        <cendia-pii-scanner id="pii-scanner" policy="gdpr" api-url="https://your-api.com/scan"></cendia-pii-scanner>
        
        <div class="controls">
          <button class="btn" onclick="loadSample()">Load Sample</button>
          <button class="btn btn-success" onclick="scanText()">Scan PII</button>
          <select class="form-control" id="policy-select" onchange="changePolicy()">
            <option value="gdpr">GDPR</option>
            <option value="hipaa">HIPAA</option>
            <option value="custom">Custom</option>
          </select>
        </div>
        
        <div id="scan-metrics" class="metrics">
          <div class="metric">
            <div class="metric-value" id="scan-count">0</div>
            <div class="metric-label">Scans</div>
          </div>
          <div class="metric">
            <div class="metric-value" id="detection-count">0</div>
            <div class="metric-label">Detections</div>
          </div>
          <div class="metric">
            <div class="metric-value" id="avg-confidence">0%</div>
            <div class="metric-label">Avg Confidence</div>
          </div>
        </div>
      </div>

      <div class="widget-card">
        <h2>Evidence Viewer</h2>
        <dcii-evidence-viewer id="evidence-viewer" show-agents="true" compact="false"></dcii-evidence-viewer>
        
        <div class="controls">
          <button class="btn" onclick="loadEvidence()">Load Evidence</button>
          <button class="btn btn-secondary" onclick="toggleCompact()">Toggle Compact</button>
        </div>
      </div>

      <div class="widget-card">
        <h2>Council Status Badges</h2>
        <div id="badges-container" class="badges">
          <council-status-badge status="completed" confidence="0.82" agent-count="6"></council-status-badge>
          <council-status-badge status="deliberating" confidence="0.64" agent-count="4"></council-status-badge>
          <council-status-badge status="pending"></council-status-badge>
        </div>
        
        <div class="controls">
          <button class="btn" onclick="addBadge()">Add Badge</button>
          <button class="btn btn-secondary" onclick="clearBadges()">Clear Badges</button>
        </div>
      </div>
    </div>
  </div>

  <script src="datacendia-widgets.js"></script>
  <script>
    // Advanced widget management
    let scanCount = 0;
    let totalDetections = 0;
    let totalConfidence = 0;
    
    function loadSample() {
      const scanner = document.getElementById('pii-scanner');
      if (scanner) {
        scanner.loadSample();
        showNotification('Sample loaded successfully', 'success');
      }
    }

    function scanText() {
      const scanner = document.getElementById('pii-scanner');
      if (scanner) {
        scanner.scan();
        scanCount++;
        updateMetrics();
      }
    }

    function changePolicy() {
      const scanner = document.getElementById('pii-scanner');
      const policySelect = document.getElementById('policy-select');
      
      if (scanner && policySelect) {
        scanner.policy = policySelect.value;
        showNotification(`Policy changed to ${policySelect.value}`, 'info');
      }
    }

    function loadEvidence() {
      const viewer = document.getElementById('evidence-viewer');
      if (viewer) {
        viewer.loadEvidence();
        showNotification('Evidence loaded', 'success');
      }
    }

    function toggleCompact() {
      const viewer = document.getElementById('evidence-viewer');
      if (viewer) {
        viewer.compact = !viewer.compact;
        showNotification(`Compact mode ${viewer.compact ? 'enabled' : 'disabled'}`, 'info');
      }
    }

    function addBadge() {
      const container = document.getElementById('badges-container');
      const badge = document.createElement('council-status-badge');
      const statuses = ['completed', 'deliberating', 'pending', 'failed'];
      const status = statuses[Math.floor(Math.random() * statuses.length)];
      const confidence = Math.random();
      const agentCount = Math.floor(Math.random() * 10);
      
      badge.setAttribute('status', status);
      badge.setAttribute('confidence', confidence);
      badge.setAttribute('agent-count', agentCount);
      
      container.appendChild(badge);
      showNotification('Badge added', 'success');
    }

    function clearBadges() {
      const container = document.getElementById('badges-container');
      container.innerHTML = '';
      showNotification('Badges cleared', 'info');
    }

    function updateMetrics() {
      document.getElementById('scan-count').textContent = scanCount;
      document.getElementById('detection-count').textContent = totalDetections;
      document.getElementById('avg-confidence').textContent = 
        scanCount > 0 ? Math.round(totalConfidence / scanCount) + '%' : '0%';
    }

    function showNotification(message, type = 'info') {
      const alert = document.createElement('div');
      alert.className = `alert alert-${type}`;
      alert.textContent = message;
      
      document.body.appendChild(alert);
      
      setTimeout(() => {
        alert.remove();
      }, 3000);
    }

    // Event listeners
    document.addEventListener('DOMContentLoaded', function() {
      document.addEventListener('pii-scan-complete', function(event) {
        const results = event.detail;
        totalDetections += results.detections.length;
        totalConfidence += results.confidence;
        updateMetrics();
        
        showNotification(`Scan complete: ${results.detections.length} detections found`, 'success');
      });

      document.addEventListener('badge-clicked', function(event) {
        showNotification('Badge clicked: ' + JSON.stringify(event.detail), 'info');
      });
    });
  </script>
</body>
</html>
```

## Integration Best Practices

### 1. Performance Optimization
```javascript
// Lazy load widgets
function loadWidgetsOnDemand() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const script = document.createElement('script');
        script.src = './datacendia-widgets.js';
        document.head.appendChild(script);
        observer.disconnect();
      }
    });
  });

  observer.observe(document.querySelector('.widget-container'));
}
```

### 2. Error Handling
```javascript
// Robust error handling
function initializeWidgets() {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = './datacendia-widgets.js';
    
    script.onload = () => {
      // Verify widgets are loaded
      if (customElements.get('cendia-pii-scanner')) {
        resolve();
      } else {
        reject(new Error('Widgets failed to initialize'));
      }
    };
    
    script.onerror = () => reject(new Error('Failed to load widget script'));
    document.head.appendChild(script);
  });
}
```

### 3. Accessibility
```html
<!-- Ensure accessibility -->
<cendia-pii-scanner 
  role="region" 
  aria-label="PII Scanner Widget"
  tabindex="0">
</cendia-pii-scanner>
```

### 4. Testing
```javascript
// Unit testing example
describe('Datacendia Widgets', () => {
  beforeEach(() => {
    document.body.innerHTML = '<cendia-pii-scanner></cendia-pii-scanner>';
  });

  it('should load sample text', () => {
    const scanner = document.querySelector('cendia-pii-scanner');
    scanner.loadSample();
    expect(scanner.textContent).toContain('John Smith');
  });
});
```

These integration examples provide comprehensive guidance for implementing Datacendia widgets across different frameworks and use cases.
