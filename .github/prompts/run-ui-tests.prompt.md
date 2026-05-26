---
description: "Run UI tests and summarize failures"
agent: "test-engineer"
tools: ["read", "execute", "todo"]
---

# Run UI Tests

Execute Playwright UI tests and provide a detailed summary of results with failure triage.

## Instructions

### 1. Install Playwright Dependencies (REQUIRED FIRST STEP)

**CRITICAL**: Always run the install command before executing UI tests:

```bash
npm run test:ui:install --workspace=frontend
```

**Ubuntu/Linux Environments**:
- This step is MANDATORY and cannot be skipped
- The command performs `playwright install --with-deps chromium`
- Includes automatic bounded Ubuntu repository remediation for common Yarn key issues
- One retry is automatically included in the script

**If install fails**:
- ❌ Do NOT perform ad-hoc package hunting
- ❌ Do NOT attempt broad OS troubleshooting
- ✅ STOP immediately and report an environment blocker
- ✅ Include the failing command and key error lines
- ✅ Do NOT continue to run Playwright tests after failed install

**Repeat this step after**:
- Container rebuilds
- Fresh environment setups
- Playwright version updates

### 2. Ensure Application is Running

**Before executing UI tests**, verify both backend and frontend are running:

```bash
# From repository root
npm start
```

This command starts:
- Backend server (typically on port 3001)
- Frontend development server (typically on port 3000)

**If servers are not running:**
- Start them before proceeding with tests
- Allow sufficient startup time (check terminal output)

### 3. Run UI Tests

Execute the Playwright test suite:

```bash
npm run test:ui --workspace=frontend
```

**Alternative Execution Modes**:

```bash
# Run with browser visible (headed mode)
npm run test:ui -- --headed --workspace=frontend

# Run in debug mode (interactive)
npm run test:ui:debug --workspace=frontend

# Run specific test file
npx playwright test tests/ui/todos.spec.js --workspace=frontend
```

### 4. Collect Test Results

Gather the following information from test output:

**Summary Metrics**:
- Total tests executed
- Tests passed
- Tests failed
- Tests skipped
- Execution time

**Failure Details** (for each failed test):
- Test name and file
- Error message
- Stack trace
- Screenshot path (if available)
- Video path (if available)

### 5. Triage Failures

For each test failure, classify into one of three categories:

#### **Application Defect**
- **Symptoms**: Unexpected behavior, wrong data, logic errors
- **Evidence**: Error message indicates app logic failure, incorrect API response, missing UI element
- **Action**: Report as bug with reproduction steps
- **Example**: "Expected TODO count to be 1, but got 0" → App not creating TODO

#### **Test Defect**
- **Symptoms**: Flaky selector, incorrect assertion, race condition, brittle test design
- **Evidence**: Intermittent failures, selector not found, timing issues
- **Action**: Fix test code to be more robust
- **Example**: "Selector '.btn-primary' not found" → Use semantic selector instead

#### **Environment Defect**
- **Symptoms**: Missing dependencies, service unavailable, timing issues, infrastructure problems
- **Evidence**: Connection errors, timeout failures, dependency errors
- **Action**: Fix environment configuration or test setup
- **Example**: "Connection refused on port 3001" → Backend not running

### 6. Provide Detailed Summary

**Format**:
```
## UI Test Results Summary

### Execution Summary
- Total: X tests
- ✅ Passed: Y tests
- ❌ Failed: Z tests
- ⏭️ Skipped: N tests
- ⏱️ Duration: Xs

### Failed Tests

#### Test: [Test Name]
- **File**: packages/frontend/tests/ui/[file].spec.js
- **Error**: [Error message]
- **Classification**: [Application Defect / Test Defect / Environment Defect]
- **Evidence**: [Specific reasoning for classification]
- **Recommended Action**: [Concrete next step]
- **Screenshot**: [path if available]

[Repeat for each failed test]

### Root Cause Analysis

**Application Defects**: X tests
- [List specific issues requiring code fixes]

**Test Defects**: Y tests
- [List specific test improvements needed]

**Environment Defects**: Z tests
- [List specific environment issues to resolve]

### Next Steps

1. [Prioritized action based on failure triage]
2. [Follow-up action]
3. [Validation step]
```

### 7. Generate Test Report

If needed, generate the Playwright HTML report:

```bash
npx playwright show-report --workspace=frontend
```

This provides an interactive view of test results with screenshots and traces.

### 8. Debug Failed Tests

For test failures requiring deeper investigation:

```bash
# Open trace viewer for a specific test
npx playwright show-trace trace.zip --workspace=frontend

# Run single test in debug mode
npx playwright test tests/ui/todos.spec.js --debug --workspace=frontend
```

## Validation Checklist

- ✅ Playwright dependencies installed (`test:ui:install` executed)
- ✅ Backend and frontend servers running
- ✅ All UI tests executed
- ✅ Pass/fail counts reported
- ✅ Each failure classified (app/test/env)
- ✅ Concrete evidence provided for each classification
- ✅ Recommended actions specified
- ✅ Screenshots/traces referenced where available

## Failure Classification Guide

| Category | Indicators | Resolution Path |
|----------|-----------|-----------------|
| **Application Defect** | Wrong data, logic error, feature not working | Fix application code, add/update tests |
| **Test Defect** | Flaky selectors, incorrect assertions, timing | Fix test code, improve reliability |
| **Environment Defect** | Service down, dependency missing, config issue | Fix environment setup, update config |

## References

- [Test Engineer Agent](.github/agents/test-engineer.agent.md)
- [Testing Guidelines](../../docs/testing-guidelines.md)
- [Playwright Documentation](https://playwright.dev)
- [Playwright Debugging Guide](https://playwright.dev/docs/debug)
