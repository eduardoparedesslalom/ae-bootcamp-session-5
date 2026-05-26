---
description: "Create UI tests for required critical user journeys"
agent: "test-engineer"
tools: ["search", "read", "edit", "execute", "todo"]
---

# Create UI Tests

Create Playwright end-to-end tests for critical user journeys using Page Object Model (POM) architecture.

## Input

User journeys (optional): ${input:journeys:Enter specific journeys to test (or leave blank for default set)}

## Instructions

### 1. Determine Test Scenarios

**If journeys are NOT provided**, use the default set:
- Create TODO
- Edit TODO
- Toggle TODO completion
- Delete TODO
- Core error-state handling

**If journeys ARE provided**, use the specified journeys.

**HARD LIMIT**: Create a maximum of 5 Playwright test cases for this run.
- Target: 3-5 total test cases
- Include at least 1 error-path test within the 3-5 total
- If more than 5 candidate scenarios exist, select the highest-risk 5 and list deferred scenarios

### 2. Review Existing Tests

Check current UI test coverage:

```bash
ls packages/frontend/tests/ui/
```

Review existing test files and page objects to avoid duplication.

### 3. Apply Page Object Model (POM)

**Structure**:
- **Page Objects**: `packages/frontend/tests/ui/pages/`
  - Encapsulate UI element selectors
  - Provide reusable interaction methods
  - Hide implementation details
  - Return page objects or data, not raw locators

- **Test Files**: `packages/frontend/tests/ui/*.spec.js`
  - Focus on test scenario intent and assertions
  - Use page objects for all UI interactions
  - Keep tests readable as user journey narratives
  - Avoid raw selectors in test files

### 4. Use Stable Selectors

**Preferred Locator Strategy** (in order of preference):
1. Semantic locators: `getByRole()`, `getByLabel()`, `getByText()`
2. Test IDs: `getByTestId()` (only when semantic locators insufficient)
3. ❌ Avoid: CSS selectors tied to styling classes
4. ❌ Never: XPath or fragile positional selectors

**Example**:
```javascript
// ✅ Good
this.addButton = page.getByRole('button', { name: 'Add Todo' });
this.todoInput = page.getByLabel('New todo');

// ⚠️ Acceptable when semantic not available
this.todoItem = page.getByTestId('todo-item');

// ❌ Avoid
this.addButton = page.locator('.btn-primary');
```

### 5. Use State-Based Waits

**Preferred Wait Strategies**:
- State-based waits: `waitFor({ state: 'visible' })`
- Network idle: `page.waitForLoadState('networkidle')`
- Leverage Playwright auto-waiting for actions

**Avoid**:
- ❌ Arbitrary timeouts: `page.waitForTimeout(1000)`
- ❌ Polling without conditions

**Example**:
```javascript
// ✅ Good
await this.page.getByText(todoText).waitFor({ state: 'visible' });

// ❌ Avoid
await this.page.waitForTimeout(1000);
```

### 6. Create/Update Test Files

**Example Page Object** (`packages/frontend/tests/ui/pages/TodoPage.js`):
```javascript
export class TodoPage {
  constructor(page) {
    this.page = page;
    this.newTodoInput = page.getByPlaceholder('What needs to be done?');
    this.todoList = page.getByRole('list');
  }

  async addTodo(text) {
    await this.newTodoInput.fill(text);
    await this.newTodoInput.press('Enter');
    await this.page.getByText(text).waitFor({ state: 'visible' });
  }

  async getTodoCount() {
    return await this.todoList.locator('li').count();
  }
}
```

**Example Test File** (`packages/frontend/tests/ui/todos.spec.js`):
```javascript
import { test, expect } from '@playwright/test';
import { TodoPage } from './pages/TodoPage';

test('user can create a new todo', async ({ page }) => {
  const todoPage = new TodoPage(page);
  await page.goto('/');
  
  await todoPage.addTodo('Buy groceries');
  
  expect(await todoPage.getTodoCount()).toBe(1);
  expect(await todoPage.getTodoText(0)).toBe('Buy groceries');
});
```

### 7. Verify Test Count Limit

**Before finishing:**
- Count the total number of `test(...)` or `it(...)` blocks created/updated
- If count exceeds 5, reduce to the highest-priority 5 tests
- List any deferred scenarios for future implementation

**Do NOT claim "small scope" if the final authored count is greater than 5.**

### 8. Report Changes

Provide a summary:

**Format**:
```
## UI Tests Created

### Files Changed
- [Created/Updated] packages/frontend/tests/ui/pages/TodoPage.js
- [Created/Updated] packages/frontend/tests/ui/todos.spec.js

### Scenarios Covered (X/5)
1. ✅ Create TODO - Happy path
2. ✅ Complete TODO - Toggle completion
3. ✅ Delete TODO - Remove from list
4. ✅ Edit TODO - Modify existing item
5. ✅ Error handling - Invalid input validation

### Deferred Scenarios
- Filter by status (All/Active/Completed)
- Bulk operations
- Persistence after page reload

### Next Steps
Run `/run-ui-tests` to execute and validate these tests.
```

## Quality Checklist

- ✅ Maximum 5 test cases created
- ✅ At least 1 error-path test included
- ✅ Page Object Model architecture applied
- ✅ Stable semantic selectors used
- ✅ State-based waits implemented (no arbitrary timeouts)
- ✅ Tests are isolated and deterministic
- ✅ Clear test names describing scenarios
- ✅ Arrange-Act-Assert structure followed

## References

- [Test Engineer Agent](.github/agents/test-engineer.agent.md)
- [Testing Guidelines](../../docs/testing-guidelines.md)
- [Playwright Documentation](https://playwright.dev)
