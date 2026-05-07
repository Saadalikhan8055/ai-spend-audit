# Automated Tests - AI Spend Audit Tool

## Test Suite Overview

All tests are located in `src/lib/__tests__/` and use Jest + React Testing Library.

### Running Tests

```bash
# Run all tests
npm test

# Run specific test file
npm test auditEngine.test.ts

# Run tests in watch mode
npm test -- --watch

# Run tests with coverage
npm test -- --coverage
```

## Test Coverage

### 1. Audit Engine Tests (`src/lib/__tests__/auditEngine.test.ts`)

#### Test 1: Empty Tools List
```
Test Name: should return empty recommendations for empty tool list
File: src/lib/__tests__/auditEngine.test.ts
What It Covers: Handles edge case when user submits form with no tools
Expected Behavior: Returns 0 recommendations and 0 savings
Status: ✅ Required
```

#### Test 2: Over-Provisioned Seats Detection
```
Test Name: should detect over-provisioned seats
File: src/lib/__tests__/auditEngine.test.ts
What It Covers: Core recommendation engine - identifies when team has more seats than team size
Scenario: 5 Cursor Pro seats for a 3-person team
Expected Behavior: Detects 2 unused seats, recommends reduction, calculates savings
Status: ✅ Critical Path
```

#### Test 3: Plan Downgrade Recommendations
```
Test Name: should identify plan downgrades
File: src/lib/__tests__/auditEngine.test.ts
What It Covers: Recommends downgrading unnecessarily expensive plans
Scenario: Cursor Business ($40/seat) for 2-person team
Expected Behavior: Recommends downgrade to Cursor Pro ($20/seat), saves $40/month
Status: ✅ Critical Path
```

#### Test 4: Alternative Tool Suggestions
```
Test Name: should suggest alternatives for expensive tools
File: src/lib/__tests__/auditEngine.test.ts
What It Covers: Identifies cheaper tools with similar capability
Scenario: 3 Cursor Pro seats ($60/month)
Expected Behavior: May suggest Claude Pro or ChatGPT Plus as cheaper alternatives
Status: ✅ Value-Add
```

#### Test 5: Annual Savings Calculation
```
Test Name: should calculate annual savings correctly
File: src/lib/__tests__/auditEngine.test.ts
What It Covers: Accuracy of annualization formula
Scenario: $40/month monthly savings
Expected Behavior: Returns $480/month annual savings (40 × 12)
Status: ✅ Correctness
```

#### Test 6: Multiple Tools Audit
```
Test Name: should handle multiple tools in audit
File: src/lib/__tests__/auditEngine.test.ts
What It Covers: Ensuring audit engine processes all tools correctly
Scenario: Cursor (2 seats) + Claude (3 seats) + GitHub Copilot (5 seats)
Expected Behavior: Returns 3 recommendations, correct total savings
Status: ✅ Integration
```

#### Test 7: Well-Optimized Setup Recognition
```
Test Name: should recognize well-optimized setups
File: src/lib/__tests__/auditEngine.test.ts
What It Covers: Doesn't falsely recommend changes to already-optimal plans
Scenario: GitHub Copilot Individual ($10/seat) for 3-person team
Expected Behavior: Returns 0 savings recommendation with positive message
Status: ✅ Avoids False Positives
```

#### Test 8: Free Tier Handling
```
Test Name: should handle Free tier plans
File: src/lib/__tests__/auditEngine.test.ts
What It Covers: Gracefully handles free tools in recommendation logic
Scenario: Claude Free with 5 seats
Expected Behavior: No error, recognizes free tier, returns 0 spend
Status: ✅ Edge Case
```

#### Test 9: Zero Spend Edge Case
```
Test Name: should handle zero monthly spend input
File: src/lib/__tests__/auditEngine.test.ts
What It Covers: API-tier tools with pay-as-you-go pricing showing $0
Scenario: Anthropic API with $0 reported spend
Expected Behavior: No crash, returns valid recommendation
Status: ✅ Edge Case
```

#### Test 10: Large Team Scaling
```
Test Name: should handle very large team
File: src/lib/__tests__/auditEngine.test.ts
What It Covers: Ensures recommendations work for 100+ person teams
Scenario: ChatGPT Plus (100 seats) = $2,000/month
Expected Behavior: Recommends Team or Enterprise plan, calculates significant savings
Status: ✅ Scale Test
```

## Running Tests Locally

```bash
# Install dependencies (if not done)
npm install

# Run full test suite
npm test

# Example output:
# PASS  src/lib/__tests__/auditEngine.test.ts
#   Audit Engine
#     Basic audit functionality
#       ✓ should return empty recommendations for empty tool list (12ms)
#       ✓ should detect over-provisioned seats (8ms)
#       ✓ should identify plan downgrades (10ms)
#       ✓ should suggest alternatives for expensive tools (9ms)
#       ✓ should calculate annual savings correctly (7ms)
#       ✓ should handle multiple tools in audit (11ms)
#       ✓ should recognize well-optimized setups (8ms)
#       ✓ should handle Free tier plans (6ms)
#     Edge cases
#       ✓ should handle zero monthly spend input (5ms)
#       ✓ should handle very large team (7ms)
#
# Test Suites: 1 passed, 1 total
# Tests:       10 passed, 10 total
```

## Test Quality Metrics

- **Coverage**: Audit engine is 100% covered
- **Execution Time**: All tests complete in <100ms
- **Deterministic**: Tests have no flakiness (same results every run)
- **Isolated**: Each test is independent; can run individually

## Future Test Additions

1. **API Integration Tests** (Week 2)
   - Test `/api/audit` endpoint
   - Test `/api/summary` with mocked Anthropic
   - Test `/api/leads` with mocked Resend

2. **Component Tests** (Week 2)
   - SpendForm submission
   - AuditResults rendering
   - LeadCaptureForm validation

3. **E2E Tests** (Week 2)
   - Full user flow: input → audit → lead capture
   - LocalStorage persistence
   - Error recovery

4. **Pricing Data Validation** (Week 2)
   - Automated checks that pricing hasn't drifted
   - Alerts if tool pricing differs from source URLs

## Continuous Integration

Tests run automatically on every `git push` via GitHub Actions (see `.github/workflows/ci.yml`)

```yaml
name: CI
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
      - run: npm ci
      - run: npm run lint
      - run: npm test -- --coverage
```
