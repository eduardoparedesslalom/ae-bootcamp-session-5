# Development Memory System

## Purpose

This memory system tracks patterns, decisions, and lessons learned during development. It serves as a knowledge base that helps AI assistants provide context-aware suggestions and helps developers understand past decisions.

## Memory Types

### 1. Persistent Memory (`.github/copilot-instructions.md`)
- **Purpose**: Foundational principles, workflows, and architectural decisions
- **Lifecycle**: Long-term, rarely changes
- **Content**: TDD principles, testing strategies, Git conventions, agent usage patterns
- **Usage**: Referenced by AI for all development tasks

### 2. Working Memory (`.github/memory/`)
- **Purpose**: Active discoveries, session notes, and emerging patterns
- **Lifecycle**: Short to medium-term
- **Content**: Session summaries, code patterns, debugging insights
- **Usage**: Referenced during active development and retrospectives

## Directory Structure

```
.github/memory/
├── README.md                    # This file - explains the memory system
├── session-notes.md            # Historical session summaries (committed)
├── patterns-discovered.md      # Accumulated code patterns (committed)
└── scratch/
    ├── .gitignore              # Ignores all files in scratch/
    └── working-notes.md        # Active session notes (NOT committed)
```

### File Descriptions

#### `session-notes.md` (Committed)
- **What**: Summaries of completed development sessions
- **When**: Updated at the end of each session
- **Why**: Provides historical context for future work
- **Content**: What was accomplished, key findings, decisions made, outcomes

#### `patterns-discovered.md` (Committed)
- **What**: Recurring code patterns and best practices discovered during development
- **When**: Updated when a pattern emerges or is validated
- **Why**: Documents "how we do things" in this codebase
- **Content**: Pattern name, context, problem, solution, examples

#### `scratch/working-notes.md` (NOT Committed)
- **What**: Active session notes, observations, and work-in-progress findings
- **When**: Updated continuously during a development session
- **Why**: Captures thinking and discoveries without cluttering git history
- **Content**: Current task, approach, findings, decisions, blockers, next steps

## When to Use Each File

### During TDD Workflow

1. **Start Session**: Open `scratch/working-notes.md` and note the current task
2. **Write Test (RED)**: Document test expectations in scratch notes
3. **Implement (GREEN)**: Note implementation decisions and challenges
4. **Refactor**: Document refactoring insights
5. **End Session**: Summarize key findings into `session-notes.md`, patterns into `patterns-discovered.md`

### During Linting/Code Quality Workflow

1. **Start Lint Run**: Note error categories in `scratch/working-notes.md`
2. **Fix Issues**: Document systematic fixes and rationale
3. **Discover Pattern**: If a recurring issue emerges, document in `patterns-discovered.md`
4. **End Session**: Summarize fixes and learnings in `session-notes.md`

### During Debugging Workflow

1. **Identify Bug**: Note symptoms and initial hypotheses in scratch notes
2. **Debug**: Document investigation steps, findings, and false leads
3. **Fix**: Document root cause and solution approach
4. **Validate**: Note verification steps
5. **End Session**: Add key debugging insights to session notes; if the bug reveals a pattern, document in patterns-discovered.md

### During Integration/Feature Development

1. **Start Work**: Note feature requirements and approach in scratch notes
2. **Implement**: Track decisions, API contracts, edge cases
3. **Test**: Document test scenarios and results
4. **Discover Pattern**: Note any reusable patterns for future reference
5. **End Session**: Summarize feature implementation in session notes

## How AI Uses This Memory

### During Development
- **AI reads** `patterns-discovered.md` to understand code conventions
- **AI reads** recent entries in `session-notes.md` for project context
- **AI writes** to `scratch/working-notes.md` to track current work
- **AI suggests** patterns that match similar problems solved before

### At Session End
- **AI summarizes** scratch notes into structured session-notes.md entries
- **AI extracts** validated patterns from scratch notes to patterns-discovered.md
- **AI ensures** institutional knowledge is preserved for future sessions

### For Future Work
- **AI references** past sessions to avoid repeating mistakes
- **AI applies** documented patterns to new, similar problems
- **AI provides** context-aware suggestions based on project history

## Best Practices

### Do:
✅ Keep scratch notes informal and stream-of-consciousness  
✅ Be specific about what worked and what didn't  
✅ Document the "why" behind decisions  
✅ Update patterns when you discover better approaches  
✅ Commit session-notes.md and patterns-discovered.md regularly  

### Don't:
❌ Commit scratch/working-notes.md (it's intentionally ephemeral)  
❌ Let session-notes.md grow unbounded (archive old sessions periodically)  
❌ Document obvious patterns (focus on non-intuitive insights)  
❌ Duplicate information already in copilot-instructions.md  
❌ Wait too long to transfer knowledge from scratch to permanent memory  

## Workflow Summary

```
Active Session:
├─ Work on code
├─ Take notes in scratch/working-notes.md
├─ Document discoveries as they happen
└─ Keep notes informal and rapid

End of Session:
├─ Review scratch/working-notes.md
├─ Extract completed work summary → session-notes.md
├─ Extract validated patterns → patterns-discovered.md
├─ Clear or archive scratch/working-notes.md
└─ Commit session-notes.md and patterns-discovered.md

Future Sessions:
├─ AI reads session-notes.md for context
├─ AI reads patterns-discovered.md for conventions
└─ AI applies learned patterns to new work
```

## Example Usage Scenario

**Scenario**: Implementing a new TODO filtering feature

1. **Start**: Create entry in `scratch/working-notes.md`
   ```
   ## Current Task
   Add filtering feature to TODO API
   
   ## Approach
   - Add query parameters to GET /api/todos
   - Filter by status, priority, date
   ```

2. **During Work**: Add observations
   ```
   ## Key Findings
   - Query parameter validation needed
   - Empty filter should return all todos (not error)
   
   ## Decisions Made
   - Use middleware for query validation
   - Return 200 with empty array for no matches
   ```

3. **End Session**: Transfer to permanent memory
   - Add to `session-notes.md`: Summary of filtering feature implementation
   - Add to `patterns-discovered.md`: API query parameter validation pattern

4. **Future Work**: AI references these patterns when implementing similar features

---

This memory system ensures that development knowledge is preserved, searchable, and actionable for both human developers and AI assistants.
