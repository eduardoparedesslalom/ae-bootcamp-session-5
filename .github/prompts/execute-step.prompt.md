---
description: "Execute instructions from the current GitHub Issue step"
agent: "tdd-developer"
tools: ["search", "read", "edit", "execute", "web", "todo"]
---

# Execute GitHub Issue Step

Execute the instructions from a specific step in the current GitHub Issue following the project's TDD workflow.

## Input

Issue number (optional): ${input:issue-number:Enter issue number (or leave blank to auto-detect)}

## Instructions

### 1. Find the Exercise Issue

If no issue number is provided:
- Use `gh issue list --state open` to find open issues
- Identify the exercise issue (title contains "Exercise:")
- Extract the issue number

If issue number is provided, use it directly.

### 2. Get Issue Content with Comments

Retrieve the full issue details including all step instructions:

```bash
gh issue view <issue-number> --comments
```

### 3. Parse Latest Step Instructions

- Locate the most recent step comment in the issue
- Extract all `:keyboard: Activity:` sections from that step
- Identify any specific requirements or constraints

### 4. Execute Activities Systematically

For each Activity section:
- Follow TDD principles (Red-Green-Refactor)
- Write tests first, then implement
- Ensure all tests pass before moving to the next activity
- Track progress using the todo tool

**Scope Boundaries**:
- ✅ Write backend tests (Jest + Supertest)
- ✅ Write frontend component tests (React Testing Library)
- ❌ Do NOT create or run Playwright UI tests
- ❌ Do NOT commit or push changes

**Handoff Rules**:
- For Playwright UI test creation → Use `/create-ui-tests`
- For running UI tests → Use `/run-ui-tests`
- These prompts will automatically switch to the `test-engineer` agent

### 5. Completion Guidance

After completing all activities, provide the next commands in sequence:

**If the current step requires UI workflow:**
1. `/create-ui-tests` (creates Playwright tests)
2. `/run-ui-tests` (executes and triages UI tests)
3. `/validate-step {step-number}` (validates success criteria)

**If UI workflow is NOT required:**
1. `/validate-step {step-number}` (validates success criteria)

**Never recommend `/validate-step` before completing required UI prompts.**

### 6. Testing Scope Constraints

Follow the testing guidelines from [docs/testing-guidelines.md](../../docs/testing-guidelines.md):
- Backend: Jest + Supertest for API integration tests
- Frontend: React Testing Library for component tests
- UI: Playwright for end-to-end tests (delegated to test-engineer)

## References

- [Workflow Patterns](../../docs/workflow-patterns.md)
- [Testing Guidelines](../../docs/testing-guidelines.md)
- [Git Workflow](.github/copilot-instructions.md#git-workflow)
- [Workflow Utilities](.github/copilot-instructions.md#workflow-utilities)
