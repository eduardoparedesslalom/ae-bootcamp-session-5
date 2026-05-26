---
description: "Analyze changes, generate commit message, and push to feature branch"
tools: ["read", "execute", "todo"]
---

# Commit and Push Changes

Analyze the current changes, generate a conventional commit message, and push to a feature branch.

## Input

Branch name (REQUIRED): ${input:branch-name:Enter feature branch name (e.g., feature/add-delete-endpoint)}

## Instructions

### 1. Pre-Commit Validation

**If the current step includes required UI workflow:**
- Verify that UI tests have been run successfully in this chat session
- OR run `npm run test:ui --workspace=frontend` to execute UI tests
- Ensure UI tests pass before proceeding with commit

### 2. Analyze Changes

Review the current changes to understand the scope:

```bash
git status
git diff
```

Identify:
- Files modified, added, or deleted
- Nature of changes (feature, fix, test, chore, etc.)
- Scope of changes (backend, frontend, docs, config)

### 3. Generate Commit Message

Create a conventional commit message following the project standard:

**Format**: `<type>: <description>`

**Types**:
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

### 4. Create or Switch to Branch

Check if the branch exists:

```bash
git branch --list ${input:branch-name}
```

**If branch does NOT exist:**
```bash
git checkout -b ${input:branch-name}
```

**If branch exists:**
```bash
git checkout ${input:branch-name}
```

### 5. Stage and Commit

Stage all changes and commit with the generated message:

```bash
git add .
git commit -m "<generated-commit-message>"
```

### 6. Push to Branch

Push the committed changes to the remote branch:

```bash
git push origin ${input:branch-name}
```

**IMPORTANT**: Only push to the user-provided branch name. Never commit to `main` or any other branch.

### 7. Confirmation

Report:
- Branch name used
- Commit message generated
- Number of files changed
- Push status (success/failure)

## Safety Checks

- ✅ Verify branch name is provided (required)
- ✅ Ensure not pushing to `main` branch
- ✅ Confirm all tests pass before commit (especially if UI workflow required)
- ✅ Validate commit message follows conventional format

## References

- [Git Workflow](.github/copilot-instructions.md#git-workflow)
- [Conventional Commits](https://www.conventionalcommits.org/)
