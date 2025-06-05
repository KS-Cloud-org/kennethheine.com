# E2E Testing Configuration

This directory contains Playwright end-to-end tests for the Kenneth Heine website.

## Test Configurations

### Default Configuration (Fast) 🚀
- **File**: `playwright.config.ts`
- **Browser**: Chromium only
- **Purpose**: Fast feedback during development
- **Command**: `npm run test:e2e`

### Full Test Suite Configuration 🌐
- **File**: `playwright.config.full.ts`
- **Browsers**: Chromium, Firefox, WebKit, Mobile Chrome, Mobile Safari, Edge, Chrome
- **Purpose**: Complete cross-browser testing
- **Command**: `npm run test:e2e:full`

## Available Commands

### Quick Testing (Default)
```bash
npm run test:e2e              # Run fast single-browser tests
npm run test:e2e:headed       # Run with browser UI visible
npm run test:e2e:ui           # Run in Playwright UI mode
npm run test:e2e:debug        # Run in debug mode
```

### Full Cross-Browser Testing
```bash
npm run test:e2e:full         # Run full test suite (all browsers)
npm run test:e2e:full-headed  # Run full suite with browser UI visible
```

### Reports
```bash
npm run test:e2e:report       # Show default test report
npm run test:e2e:report-full  # Show full suite test report
```

## VS Code Tasks

You can also run tests directly from VS Code using the Command Palette:
- `Tasks: Run Task` → `Run E2E Tests (Fast)`
- `Tasks: Run Task` → `Run E2E Tests (Full Suite)`
- `Tasks: Run Task` → `Run E2E Tests (Headed)`
- `Tasks: Run Task` → `Run E2E Tests (UI Mode)`

## Test Strategy

### When to Use Fast Tests ⚡
- During active development
- For quick validation of changes
- In CI/CD pull request checks
- For TDD/BDD workflows

### When to Use Full Suite Tests 🔍
- Before major releases
- For comprehensive browser compatibility testing
- Weekly/nightly automated runs
- Before deploying to production

## Configuration Details

### Fast Configuration Features
- Single browser (Chromium) for speed
- Same test coverage, faster execution
- Optimized for developer productivity
- Separate report directory to avoid conflicts

### Full Suite Configuration Features
- Cross-browser compatibility testing
- Mobile device viewport testing
- Comprehensive device coverage
- Separate reporting for detailed analysis

## Best Practices

1. **Use fast tests for development** - Get quick feedback on your changes
2. **Run full suite before releases** - Ensure compatibility across all target browsers
3. **Check reports after test runs** - Review any failures or performance issues
4. **Use headed mode for debugging** - See what's happening in the browser
5. **Use UI mode for test development** - Interactive test creation and debugging
