# TODO Application Development Guidelines

This file provides context and guidelines for AI assistants working in this workspace.

## Project Context

This is a full-stack TODO application with the following characteristics:

- **Architecture**: React frontend + Express backend (monorepo structure)
- **Development Philosophy**: Iterative, feedback-driven development with emphasis on quality
- **Current Phase**: Backend stabilization and frontend feature completion
- **Structure**: Monorepo with `packages/frontend` and `packages/backend`

## Documentation References

Familiarize yourself with these key documentation files to understand the project:

- [docs/project-overview.md](../docs/project-overview.md) - Architecture, tech stack, and project structure
- [docs/testing-guidelines.md](../docs/testing-guidelines.md) - Test patterns and standards
- [docs/workflow-patterns.md](../docs/workflow-patterns.md) - Development workflow guidance

Always consult these documents when making decisions about project structure, testing approaches, or workflow patterns.

## Development Principles

Follow these core principles when working on this project:

- **Test-Driven Development (TDD)**: Follow the Red-Green-Refactor cycle
  - Write failing tests first (RED)
  - Implement minimal code to pass (GREEN)
  - Refactor for quality (REFACTOR)
- **Incremental Changes**: Make small, testable modifications rather than large sweeping changes
- **Systematic Debugging**: Use test failures as guides; understand the root cause before fixing
- **Validation Before Commit**: Ensure all tests pass and no lint errors exist before committing

## Testing Scope

This project uses a comprehensive testing strategy with three levels of testing:

### Testing Layers

1. **Backend Testing**: Jest + Supertest for API testing
   - Unit tests for business logic
   - Integration tests for API endpoints
   - Located in `packages/backend/__tests__/`

2. **Frontend Testing**: React Testing Library for component testing
   - Unit tests for isolated components
   - Integration tests for component interactions
   - Located in `packages/frontend/src/__tests__/`

3. **UI Testing**: Playwright for end-to-end automation
   - Critical user journey automation
   - Full application flow validation
   - Located in `packages/frontend/tests/ui/`

4. **Manual Testing**: Browser-based exploratory testing
   - Visual validation
   - User experience checks
   - Exploratory testing for edge cases

### Why This Approach?

Combine fast feedback (unit/integration) with end-to-end quality confidence (UI tests). Unit and integration tests provide rapid feedback during development, while UI tests ensure critical user journeys work end-to-end.

### Testing Approach by Context

- **Backend API Changes**: 
  - Write Jest tests FIRST, then implement (RED-GREEN-REFACTOR)
  - Test both success and error scenarios
  - Validate request/response contracts

- **Frontend Component Features**:
  - Write React Testing Library tests FIRST for component behavior (RED-GREEN-REFACTOR)
  - Test user interactions, state changes, and rendering
  - Follow with manual browser testing for full UI flows

**This is true TDD**: Test first, then write code to make the test pass.

## Workflow Patterns

Follow these established workflow patterns for different types of work:

### 1. TDD Workflow (Primary Development Pattern)

```
Write/Fix Tests → Run Tests → Fail (RED) → Implement Code → Pass (GREEN) → Refactor → Repeat
```

- Start with a failing test that describes the desired behavior
- Write the minimum code needed to pass the test
- Refactor for quality while keeping tests green
- Commit when tests pass and code is clean

### 2. Code Quality Workflow

```
Run Lint → Categorize Issues → Fix Systematically → Re-validate → Commit
```

- Run linting tools to identify code quality issues
- Categorize issues by type (formatting, unused vars, complexity, etc.)
- Fix issues systematically, one category at a time
- Re-run linting to verify all issues are resolved

### 3. Integration Workflow

```
Identify Issue → Debug → Test → Fix → Verify End-to-End
```

- Identify integration issues through test failures or manual testing
- Debug to understand root cause
- Write or update tests to capture the issue
- Implement fix
- Verify the entire integration path works

### 4. UI Testing Workflow

```
Define Critical Journeys → Create UI Tests → Run → Debug Failures → Validate Coverage
```

- Identify critical user journeys (login, create TODO, complete TODO, etc.)
- Create Playwright tests for these journeys
- Run tests to verify automation works
- Debug and fix test failures (distinguish app bugs from test bugs)
- Validate that critical paths are covered

## Agent Usage

This project uses specialized agent modes for different types of work. Use the appropriate agent for each context:

### tdd-developer

**Use for**: Implementation and unit/integration TDD cycles

- Writing backend API code with Jest tests
- Building frontend components with React Testing Library tests
- Following RED-GREEN-REFACTOR cycles
- Unit and integration test development

**Do NOT use for**: Creating or running Playwright UI tests

### code-reviewer

**Use for**: Addressing lint errors and code quality improvements

- Running and fixing ESLint/Prettier issues
- Code style consistency
- Code quality refactoring
- Technical debt reduction

### test-engineer

**Use for**: Playwright UI test authoring, execution, and maintenance

- Creating Playwright UI tests for critical user journeys
- Running and debugging Playwright test failures
- Triaging test failures (app defect vs. test defect vs. environment issue)
- Ensuring UI test stability and isolation
- Validating end-to-end test coverage

**Exclusively owns**: All Playwright-related work

## Memory System

This project uses a memory system to track development discoveries, patterns, and session notes.

- **Persistent Memory**: This file (`.github/copilot-instructions.md`) contains foundational principles and workflows
- **Working Memory**: `.github/memory/` directory contains discoveries and patterns
- **During active development**, take notes in `.github/memory/scratch/working-notes.md` (not committed)
- **At end of session**, summarize key findings into `.github/memory/session-notes.md` (committed)
- **Document recurring code patterns** in `.github/memory/patterns-discovered.md` (committed)
- **Reference these files** when providing context-aware suggestions

### Memory Files

1. **`.github/memory/README.md`**: Comprehensive guide to the memory system
2. **`.github/memory/session-notes.md`**: Historical session summaries (committed)
3. **`.github/memory/patterns-discovered.md`**: Accumulated code patterns (committed)
4. **`.github/memory/scratch/working-notes.md`**: Active session notes (NOT committed)

### When to Use

- **TDD sessions**: Track test expectations, implementation decisions, refactoring insights
- **Debugging**: Document investigation steps, root causes, solutions
- **Code reviews**: Note systematic fixes and emerging patterns
- **Feature development**: Capture decisions, API contracts, edge cases

See [`.github/memory/README.md`](.github/memory/README.md) for detailed usage instructions.

## Workflow Utilities

Use GitHub CLI commands to automate workflow tasks and interact with issues:

### GitHub CLI Commands

```bash
# List open issues
gh issue list --state open

# Get issue details
gh issue view <issue-number>

# Get issue with comments (includes step instructions)
gh issue view <issue-number> --comments
```

### Issue Management

- The main exercise issue will have "Exercise:" in the title
- Development steps are posted as comments on the main issue
- Use `/execute-step` prompts to work on specific steps
- Use `/validate-step` prompts to verify step completion

### Workflow Integration

- Check issue comments for detailed step instructions
- Reference issue numbers in commit messages
- Update issue status as work progresses

## Git Workflow

Follow these Git conventions for commits and branching:

### Conventional Commits

Use semantic commit messages with prefixes:

- `feat:` - New features
- `fix:` - Bug fixes
- `test:` - Test additions or modifications
- `chore:` - Maintenance tasks (dependencies, config)
- `docs:` - Documentation changes
- `refactor:` - Code refactoring without behavior changes
- `style:` - Formatting, whitespace, code style

**Examples**:
```
feat: add delete TODO endpoint
fix: correct TODO completion toggle logic
test: add integration tests for TODO API
chore: update dependencies
```

### Branch Strategy

- **Main branch**: `main` - stable, production-ready code
- **Feature branches**: `feature/<descriptive-name>` - for new features
- **Fix branches**: `fix/<descriptive-name>` - for bug fixes

### Commit Process

1. **Stage all changes**: `git add .` (or stage specific files)
2. **Commit with message**: `git commit -m "feat: description"`
3. **Push to branch**: `git push origin <branch-name>`
4. **Ensure tests pass** before pushing

### Best Practices

- Keep commits focused and atomic
- Write clear, descriptive commit messages
- Reference issue numbers when applicable: `feat: add search (#12)`
- Always ensure tests pass before committing
- Push regularly to backup work and enable collaboration
