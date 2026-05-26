---
description: "Validate that all success criteria for the current step are met"
agent: "code-reviewer"
tools: ["search", "read", "execute", "web", "todo"]
---

# Validate Step Completion

Verify that all success criteria for a specific GitHub Issue step have been met.

## Input

Step number (REQUIRED): ${input:step-number:Enter step number (e.g., 5-0, 5-1, 5-2)}

## Instructions

### 1. Find the Exercise Issue

Use GitHub CLI to locate the main exercise issue:

```bash
gh issue list --state open
```

Identify the issue with "Exercise:" in the title and extract the issue number.

### 2. Get Issue with Comments

Retrieve the full issue content including all step comments:

```bash
gh issue view <issue-number> --comments
```

### 3. Locate the Target Step

Search through the issue content to find:

**Step Header Format**: `# Step ${input:step-number}:`

Example: If step-number is "5-1", search for "# Step 5-1:"

### 4. Extract Success Criteria

From the located step, extract the **"Success Criteria"** section.

This section typically contains a checklist of requirements that must be met, such as:
- Specific files created or modified
- Tests passing
- Features implemented
- Code quality checks passing

### 5. Validate Each Criterion

For each success criterion, check against the current workspace state:

**File/Directory Checks**:
- Verify files exist at expected paths
- Confirm directory structure is correct

**Test Execution Checks**:
```bash
# Backend tests
cd packages/backend && npm test

# Frontend tests
cd packages/frontend && npm test

# UI tests (if applicable)
cd packages/frontend && npm run test:ui
```

**Code Quality Checks**:
```bash
# Lint checks
npm run lint

# Type checks (if applicable)
npm run type-check
```

**Functionality Checks**:
- Review implemented features against requirements
- Verify API endpoints exist and respond correctly
- Confirm UI components render and behave as expected

### 6. Report Completion Status

Provide a clear summary:

**Format**:
```
## Step ${input:step-number} Validation Results

### Success Criteria Status

✅ [Criterion 1]: Met - [brief evidence]
✅ [Criterion 2]: Met - [brief evidence]
⚠️ [Criterion 3]: Incomplete - [specific guidance]
❌ [Criterion 4]: Not met - [required action]

### Overall Status

[COMPLETE / INCOMPLETE]

### Next Steps

[If incomplete, provide specific actions to complete remaining criteria]
[If complete, recommend: `/commit-and-push {branch-name}`]
```

### 7. Provide Guidance

**If all criteria are met:**
- Confirm step completion
- Recommend next action: `/commit-and-push {branch-name}`

**If criteria are incomplete:**
- List specific incomplete items
- Provide concrete steps to complete each item
- Reference relevant documentation or examples

## Validation Checklist

- ✅ Correct step number provided
- ✅ Success criteria extracted from issue
- ✅ Each criterion checked against workspace
- ✅ Test results validated
- ✅ Clear status reported for each criterion
- ✅ Actionable guidance provided for incomplete items

## References

- [Workflow Patterns](../../docs/workflow-patterns.md)
- [Testing Guidelines](../../docs/testing-guidelines.md)
- [Workflow Utilities](.github/copilot-instructions.md#workflow-utilities)
