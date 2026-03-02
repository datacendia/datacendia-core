# Datacendia Test Suite

Comprehensive test coverage for the entire platform.

## 📦 Installation

```powershell
# Install all test dependencies
.\tests\install-deps.ps1

# Or manually:
npm install --save-dev vitest @vitejs/plugin-react jsdom @testing-library/react @testing-library/jest-dom @testing-library/user-event @playwright/test @types/node c8
npx playwright install
```

## 🧪 Test Commands

| Command | Description |
|---------|-------------|
| `npm run test` | Run all unit/integration tests |
| `npm run test:watch` | Watch mode for development |
| `npm run test:coverage` | Generate coverage report |
| `npm run test:e2e` | Run Playwright E2E tests |
| `npm run test:all` | Run complete test suite |

## 📁 Test Structure

```
tests/
├── setup.ts                    # Global test configuration
├── frontend/                   # Frontend unit tests
│   ├── routes.test.tsx         # Route navigation tests
│   ├── auth.test.tsx           # Authentication flow tests
│   └── i18n.test.ts            # Internationalization tests
├── backend/                    # Backend service tests
│   ├── api.test.ts             # API endpoint tests
│   ├── agents.test.ts          # AI agent configuration tests
│   └── services.test.ts        # Service layer tests
├── integration/                # Full platform integration
│   └── full-platform.test.ts   # End-to-end integration
├── e2e/                        # Playwright E2E tests
│   ├── playwright.config.ts    # E2E configuration
│   └── tests/
│       ├── navigation.spec.ts  # Navigation tests
│       └── auth.spec.ts        # Auth flow tests
├── install-deps.ps1            # Dependency installer
└── run-tests.ps1               # Full test runner
```

## 🎯 Coverage Targets

| Category | Tests | Coverage |
|----------|-------|----------|
| **Routes** | 100+ routes verified | All public, auth, cortex, admin |
| **Auth** | Login, Register, Reset | Full flow coverage |
| **i18n** | 6 locales tested | en, es, fr, de, ja, zh |
| **API** | 50+ endpoints | All CRUD operations |
| **Agents** | 30 AI agents | All models verified |
| **Services** | 37 services | All business logic |
| **E2E** | 30+ scenarios | Critical user journeys |

## 🚀 Running Tests

### Quick Start
```powershell
# Run all tests
npm run test

# Watch mode for development
npm run test:watch

# E2E tests (requires dev server)
npm run dev  # In one terminal
npm run test:e2e  # In another
```

### Full Suite
```powershell
# Run comprehensive test suite
.\tests\run-tests.ps1
```

## 📊 Coverage Report

After running tests with coverage:
- **HTML Report**: `./coverage/index.html`
- **JSON Report**: `./coverage/coverage-final.json`
- **E2E Report**: `./playwright-report/index.html`

## ✅ What's Tested

### Frontend
- [x] All 100+ route configurations
- [x] Authentication forms and validation
- [x] i18n translation completeness
- [x] Navigation links work
- [x] 404 page handling
- [x] Mobile responsiveness

### Backend
- [x] All API endpoint structures
- [x] Authentication flow
- [x] Rate limiting headers
- [x] Error response formats
- [x] Pagination response formats

### AI Agents
- [x] 30 agent configurations
- [x] Model assignments
- [x] Capability definitions
- [x] Premium pack structure

### Services
- [x] 37 service definitions
- [x] Method contracts
- [x] Error handling
- [x] Database operations
- [x] Ollama integration

### Integration
- [x] Frontend availability
- [x] API availability
- [x] Database connectivity
- [x] AI service connectivity
- [x] Security features

## 🔧 Configuration

### vitest.config.ts
```typescript
export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./tests/setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
    },
  },
});
```

### playwright.config.ts
```typescript
export default defineConfig({
  testDir: './tests',
  use: {
    baseURL: 'http://localhost:5173',
    trace: 'on-first-retry',
  },
  projects: [
    { name: 'chromium' },
    { name: 'firefox' },
    { name: 'webkit' },
  ],
});
```

## 🐛 Debugging Failed Tests

```powershell
# Run specific test file
npx vitest run tests/frontend/auth.test.tsx

# Run with verbose output
npx vitest run --reporter=verbose

# Debug E2E test
npx playwright test --debug tests/e2e/tests/auth.spec.ts

# View E2E test trace
npx playwright show-trace trace.zip
```
