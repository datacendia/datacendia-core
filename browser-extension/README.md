# CendiaGateway™ — Complete AI Governance Coverage

Three coverage layers that together govern **100% of organizational AI usage** across any browser, any app, any device.

## Coverage Architecture

```
┌─────────────────────────────────────────────────────┐
│                COVERAGE LAYERS                       │
├──────────────┬──────────────┬───────────────────────┤
│ Layer 1      │ Layer 2      │ Layer 3               │
│ API Gateway  │ Browser Ext  │ HTTP Proxy            │
│ (built-in)   │ (this dir)   │ (network-level)       │
├──────────────┼──────────────┼───────────────────────┤
│ Backend AI   │ Browser AI   │ ALL traffic           │
│ API calls    │ websites     │ (browser-agnostic)    │
│              │              │                       │
│ OpenAI API   │ chat.openai  │ Any browser           │
│ Anthropic    │ claude.ai    │ Any app               │
│ Google AI    │ gemini       │ Any HTTP client        │
│ Mistral      │ copilot      │ Via PAC file or       │
│ Groq, etc    │ perplexity   │ system proxy config   │
│              │ deepseek     │                       │
│              │ poe, etc     │                       │
├──────────────┼──────────────┼───────────────────────┤
│ ALWAYS ON    │ PER-BROWSER  │ NETWORK-LEVEL         │
└──────────────┴──────────────┴───────────────────────┘
```

## Layer 1: API Gateway (Already Built)

The core CendiaGateway reverse proxy. Located in `backend/src/services/gateway/`.

**Governs:** All programmatic AI API calls (backend services, developer tools, internal systems).

**Endpoints:**
- `POST /api/gateway/v1/chat/completions` — OpenAI-compatible
- `POST /api/gateway/v1/messages` — Anthropic-compatible
- `POST /api/gateway/proxy/:provider/*` — Any provider

**No additional installation needed** — part of the Datacendia platform.

---

## Layer 2: Browser Extensions

Content-script extensions that monitor AI websites and intercept prompts before submission. PII scanning + policy enforcement happens client-side (fast) and server-side (thorough).

### Supported Browsers

| Browser | Manifest | Directory | Status |
|---------|----------|-----------|--------|
| **Chrome** | V3 | `chrome/` | ✅ Ready |
| **Edge** | V3 (same as Chrome) | `chrome/` | ✅ Ready |
| **Brave** | V3 (same as Chrome) | `chrome/` | ✅ Ready |
| **Arc** | V3 (same as Chrome) | `chrome/` | ✅ Ready |
| **Firefox** | V2 | `firefox/` | ✅ Ready |
| **Safari** | V3 (Web Extension) | `safari/` | ✅ Ready |

### Governed AI Sites (15 domains)

ChatGPT, Claude, Gemini, Copilot, Bing Chat, Perplexity, Poe, You.com, Pi, DeepSeek, HuggingFace, Google AI Studio

### How It Works

1. Extension loads on any governed AI website
2. Shows "Governed by CendiaGateway™" banner (green, bottom-left)
3. When user types a prompt and submits:
   - **Client-side PII scan** (instant, <1ms) checks for SSN, credit cards, passport, etc.
   - **Critical PII → BLOCKED** immediately with full-screen overlay
   - **Non-critical PII → WARNING** banner (allowed to proceed)
   - **Server-side scan** via `/api/gateway/scan` for full policy evaluation
4. All interactions logged to audit ledger via `/api/gateway/browser-log`

### Installation

#### Chrome / Edge / Brave / Arc (Development)

```bash
1. Open chrome://extensions/
2. Enable "Developer mode" (top right)
3. Click "Load unpacked"
4. Select browser-extension/chrome/
5. Shield icon appears in toolbar
```

#### Firefox (Development)

```bash
1. Open about:debugging#/runtime/this-firefox
2. Click "Load Temporary Add-on"
3. Select browser-extension/firefox/manifest.json
```

#### Safari (Development)

```bash
# Requires Xcode and Safari Web Extension converter
xcrun safari-web-extension-converter browser-extension/safari/
# Then enable in Safari → Preferences → Extensions
```

#### Enterprise Deployment

| Browser | Method |
|---------|--------|
| Chrome | `ExtensionInstallForcelist` Group Policy |
| Edge | Microsoft Intune / Group Policy |
| Firefox | `ExtensionSettings` policy |
| Safari | MDM profile |
| All | Google Workspace Admin / Active Directory |

### Configuration

Click the extension popup icon in the toolbar:

| Setting | Description |
|---|---|
| **Gateway URL** | Your CendiaGateway API (e.g., `https://gateway.company.com/api/v1/gateway`) |
| **Organization ID** | Your org ID |
| **User ID** | Employee email |
| **Enable/Disable** | Toggle governance on/off |

---

## Layer 3: HTTP Forward Proxy (Network-Level)

Browser-agnostic, network-level AI traffic interception. Works with **any browser, any app** — configured via PAC file or system proxy settings.

Located in `backend/src/services/gateway/GatewayProxyServer.ts`.

### How It Works

1. Proxy listens on port 8888 (configurable)
2. All HTTP traffic is inspected; AI domains are governed
3. Non-AI traffic passes through untouched
4. AI requests: PII scan → policy enforcement → crypto signing → forward → log
5. HTTPS CONNECT tunneling: logged (and optionally blocked if ungoverned)

### API Endpoints

```
POST   /api/gateway/proxy/start          — Start the HTTP proxy server
POST   /api/gateway/proxy/stop           — Stop the HTTP proxy server
GET    /api/gateway/proxy/stats          — Proxy statistics
GET    /api/gateway/proxy/pac            — PAC file (auto-config for browsers)
GET    /api/gateway/proxy/domains        — List governed AI domains
POST   /api/gateway/proxy/domains        — Add a custom AI domain
DELETE /api/gateway/proxy/domains/:name  — Remove an AI domain
GET    /api/gateway/proxy/interactions   — Recent proxy interactions
```

### Deployment Options

#### Option A: PAC File (Recommended)

```bash
# 1. Start the proxy
curl -X POST http://localhost:3001/api/gateway/proxy/start

# 2. Configure browsers to use the PAC file:
#    http://gateway-host:3001/api/gateway/proxy/pac
#
# Via Group Policy (Windows):
#   Computer Config → Admin Templates → Windows Components →
#   Internet Explorer → Automatic Proxy Config URL
#
# Via macOS MDM:
#   PayloadType: com.apple.webcontent-filter
#   AutoConfigURL: http://gateway-host:3001/api/gateway/proxy/pac
```

#### Option B: System Proxy

```bash
# Windows (Group Policy)
netsh winhttp set proxy gateway-host:8888

# macOS
networksetup -setwebproxy "Wi-Fi" gateway-host 8888
networksetup -setsecurewebproxy "Wi-Fi" gateway-host 8888

# Linux
export http_proxy=http://gateway-host:8888
export https_proxy=http://gateway-host:8888
```

### Environment Variables

```bash
GATEWAY_PROXY_PORT=8888               # Proxy listen port
GATEWAY_PROXY_HOST=0.0.0.0            # Proxy bind address
GATEWAY_HTTPS_INSPECTION=false        # Enable HTTPS MITM inspection
GATEWAY_CA_CERT_PATH=/path/to/ca.crt  # Org CA cert (for HTTPS inspection)
GATEWAY_CA_KEY_PATH=/path/to/ca.key   # Org CA key
GATEWAY_BLOCK_UNGOVERNED=false        # Block AI HTTPS if inspection disabled
GATEWAY_CUSTOM_AI_DOMAINS=            # Comma-separated custom AI domains
GATEWAY_SIGNING_KEY=your-secret       # HMAC signing key
```

---

## Recommended Deployment Strategy

For most organizations (including regulated environments like FEPCMAC):

1. **Block direct AI websites** at the firewall/DNS (IT does this in 5 minutes)
2. **Provide an internal AI portal** that routes through CendiaGateway (Layer 1)
3. **Deploy browser extension** on all managed devices (Layer 2 — catches anything that gets through)
4. **Optional: HTTP proxy** for maximum coverage (Layer 3)

This gives 100% governance with zero software on unmanaged devices.

---

## File Structure

```
browser-extension/
├── README.md                      # This file
├── shared/
│   └── gateway-interceptor.js     # Shared interceptor logic (all browsers)
├── chrome/                        # Chrome / Edge / Brave / Arc
│   ├── manifest.json              # Manifest V3
│   ├── content.js                 # Content script entry point
│   ├── background.js              # Service worker
│   ├── popup.html                 # Extension popup UI
│   └── icons/                     # Extension icons (16/48/128px PNG)
├── firefox/                       # Firefox
│   ├── manifest.json              # Manifest V2 (Firefox compat)
│   ├── content.js                 # Content script entry point
│   └── background.js              # Background script
└── safari/                        # Safari
    └── manifest.json              # Manifest V3 (Web Extension)
```

## License

Copyright (c) 2024-2026 Datacendia, LLC. All Rights Reserved.
