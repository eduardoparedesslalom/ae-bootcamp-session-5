# Patterns Discovered

This file documents recurring code patterns, conventions, and best practices discovered during development. Each pattern includes context, problem statement, solution approach, and examples.

**Purpose**: Document "how we do things" in this codebase  
**Lifecycle**: Long-term, committed to git  
**Update Frequency**: When a pattern emerges or is validated through use

---

## Pattern Template

Use this template when documenting a new pattern:

```markdown
## [Pattern Name]

**Context**: When does this pattern apply? What problem domain?

**Problem**: What problem does this pattern solve? What pain point does it address?

**Solution**: How do we solve this problem? What approach do we use?

**Example**: Code snippet demonstrating the pattern

**Related Files**: Where is this pattern used in the codebase?

**Notes**: Additional context, tradeoffs, or alternatives considered
```

---

## Service Initialization Pattern

**Context**: When initializing service classes that manage collections (arrays, lists, sets)

**Problem**: Services need a consistent way to represent "no data yet" state. Using `null` or `undefined` can cause issues:
- Frontend expects empty arrays (`[]`) per REST conventions
- Null checks required throughout the codebase
- Inconsistent handling between frontend and backend

**Solution**: Initialize collection properties as empty arrays (`[]`) rather than `null` or `undefined`

**Example**:

```javascript
// ❌ Bad: Initializes as null
class TodoService {
  constructor() {
    this.todos = null;  // Causes issues with frontend expectations
  }
}

// ✅ Good: Initializes as empty array
class TodoService {
  constructor() {
    this.todos = [];  // Consistent with REST API conventions
  }
  
  getAllTodos() {
    return this.todos;  // Always returns array, no null checks needed
  }
}
```

**Related Files**:
- `packages/backend/src/services/TodoService.js`
- `packages/backend/__tests__/integration/todos.test.js`

**Notes**:
- This pattern aligns with REST API best practices (empty collection = empty array, not null)
- Eliminates need for null checks in consuming code
- Makes integration between frontend and backend smoother
- Discovered during backend initialization debugging (Session: 2026-05-15)

---

## [Add New Patterns Above This Line]

---

## Pattern Categories

As patterns accumulate, consider organizing them into categories:

### Data Initialization
- Service Initialization Pattern (empty array vs null)

### API Patterns
- (To be documented)

### Testing Patterns
- (To be documented)

### Error Handling
- (To be documented)

### State Management
- (To be documented)
