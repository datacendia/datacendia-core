# =============================================================================
# INSTALL TEST DEPENDENCIES
# =============================================================================

Write-Host "Installing test dependencies..." -ForegroundColor Cyan
Write-Host ""

# Install Vitest and React Testing Library
npm install --save-dev `
    vitest `
    @vitejs/plugin-react `
    jsdom `
    @testing-library/react `
    @testing-library/jest-dom `
    @testing-library/user-event `
    @types/node `
    c8

# Install Playwright
npm install --save-dev @playwright/test
npx playwright install chromium firefox webkit

Write-Host ""
Write-Host "All test dependencies installed!" -ForegroundColor Green
Write-Host ""
Write-Host "Available test commands:" -ForegroundColor Yellow
Write-Host "  npm run test          - Run all unit tests" -ForegroundColor White
Write-Host "  npm run test:watch    - Run tests in watch mode" -ForegroundColor White
Write-Host "  npm run test:coverage - Run tests with coverage" -ForegroundColor White
Write-Host "  npm run test:e2e      - Run E2E tests with Playwright" -ForegroundColor White
Write-Host "  npm run test:all      - Run all tests" -ForegroundColor White
Write-Host ""
