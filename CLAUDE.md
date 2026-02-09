# Bon Vent - Project Rules

## E2E Testing Rules

### Architecture

Tests use Playwright with helpers in `e2e-tests/helpers.ts`:

- `clearIndexedDB(page)` - Clears the database
- `seedDatabase(page)` - Imports mock data via the app's native import feature
- `setupWithData(page, path)` - Combines clear + seed + navigation

### Writing Stable Tests

1. **Always use the app's import feature** to seed data (never manipulate IndexedDB directly)
2. **Keep tests simple** - Test one thing per test
3. **Avoid fragile selectors** - Prefer `getByRole`, `getByText`, `getByLabel` over CSS selectors
4. **No exact value assertions** on data that changes (dates, counts)
5. **Each test should be independent** - Use `setupWithData()` instead of `beforeEach` with shared state
6. **Use unique test values** - When creating/editing data, use names that won't match existing mock data or trigger duplicate detection (e.g., "Renamed Company" not "Acme Updated")
7. **Scope assertions to specific elements** - Use `page.locator("tr", { hasText: "..." })` instead of `page.getByText("...")` to avoid matching multiple elements

### Test Structure

```typescript
// Good: Independent test with its own setup
test("does something", async ({ page }) => {
  await setupWithData(page, "/path");
  // ... assertions
});

// Bad: Shared beforeEach that can cause flaky tests
test.beforeEach(async ({ page }) => {
  await seedDatabase(page);
});
```

### Mock Data

Mock data lives in `e2e-tests/mock-data.ts` and must mirror the app's export format exactly.

When adding new fields to types:

1. Update `mockExportData` to include the new fields
2. Ensure the values are realistic and match what the app produces

### Preventing Test Failures

**Before modifying any feature:**

1. Run `npm test` to ensure tests pass before changes
2. Note which tests touch the feature you're modifying

**After modifying a feature:**

1. If you changed UI text, update test assertions to match
2. If you added required fields to types, update mock data
3. If you renamed/removed elements, update selectors
4. Run `npm test` before considering the task complete

**When tests fail unexpectedly:**

1. Check if mock data matches current type definitions
2. Check if UI text in tests matches actual UI
3. Check if selectors still match the DOM structure

## Database Schema

- Schema is in `features/db/indexeddb.ts`
- No migration logic - when schema changes, update manually
- Increment `DB_VERSION` when adding new object stores
- Tests use the app's import feature, so they work with any schema version

## Mocks Location

Domain-specific mocks go in `features/[domain]/mocks/`. E2E test mocks stay in `e2e-tests/mock-data.ts`.
