# =============================================================================
# DATACENDIA TEST RUNNER - Comprehensive Test Suite
# =============================================================================

Write-Host "========================================" -ForegroundColor Cyan
Write-Host " DATACENDIA COMPREHENSIVE TEST SUITE" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if dependencies are installed
Write-Host "[1/6] Checking test dependencies..." -ForegroundColor Yellow

$packageJson = Get-Content "package.json" | ConvertFrom-Json
$devDeps = $packageJson.devDependencies

$requiredDeps = @(
    "vitest",
    "@testing-library/react",
    "@testing-library/jest-dom",
    "@testing-library/user-event",
    "@playwright/test"
)

$missingDeps = @()
foreach ($dep in $requiredDeps) {
    if (-not $devDeps.$dep) {
        $missingDeps += $dep
    }
}

if ($missingDeps.Count -gt 0) {
    Write-Host "Missing dependencies detected. Installing..." -ForegroundColor Yellow
    $depsToInstall = $missingDeps -join " "
    npm install --save-dev $depsToInstall vitest @vitejs/plugin-react jsdom @types/node
    npx playwright install
}

Write-Host "[OK] Dependencies ready" -ForegroundColor Green
Write-Host ""

# Run Unit Tests
Write-Host "[2/6] Running Unit Tests (Vitest)..." -ForegroundColor Yellow
npx vitest run --reporter=verbose

if ($LASTEXITCODE -ne 0) {
    Write-Host "[FAIL] Unit tests failed" -ForegroundColor Red
} else {
    Write-Host "[OK] Unit tests passed" -ForegroundColor Green
}
Write-Host ""

# Run Frontend Tests
Write-Host "[3/6] Running Frontend Tests..." -ForegroundColor Yellow
npx vitest run tests/frontend --reporter=verbose

if ($LASTEXITCODE -ne 0) {
    Write-Host "[FAIL] Frontend tests failed" -ForegroundColor Red
} else {
    Write-Host "[OK] Frontend tests passed" -ForegroundColor Green
}
Write-Host ""

# Run Backend Tests
Write-Host "[4/6] Running Backend Tests..." -ForegroundColor Yellow
npx vitest run tests/backend --reporter=verbose

if ($LASTEXITCODE -ne 0) {
    Write-Host "[FAIL] Backend tests failed" -ForegroundColor Red
} else {
    Write-Host "[OK] Backend tests passed" -ForegroundColor Green
}
Write-Host ""

# Run E2E Tests
Write-Host "[5/6] Running E2E Tests (Playwright)..." -ForegroundColor Yellow

# Check if dev server is running
$devServerRunning = Test-NetConnection -ComputerName localhost -Port 5173 -WarningAction SilentlyContinue

if (-not $devServerRunning.TcpTestSucceeded) {
    Write-Host "Starting dev server for E2E tests..." -ForegroundColor Yellow
    Start-Process npm -ArgumentList "run dev" -WindowStyle Hidden
    Start-Sleep -Seconds 10
}

npx playwright test --reporter=html

if ($LASTEXITCODE -ne 0) {
    Write-Host "[FAIL] E2E tests failed" -ForegroundColor Red
} else {
    Write-Host "[OK] E2E tests passed" -ForegroundColor Green
}
Write-Host ""

# Generate Coverage Report
Write-Host "[6/6] Generating Coverage Report..." -ForegroundColor Yellow
npx vitest run --coverage

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host " TEST SUITE COMPLETE" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Reports available at:" -ForegroundColor White
Write-Host "  - Unit/Frontend/Backend: ./coverage/" -ForegroundColor Gray
Write-Host "  - E2E: ./playwright-report/" -ForegroundColor Gray
Write-Host ""
