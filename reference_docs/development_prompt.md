"""
DEVELOPMENT TASK: Build production-ready code from the provided requirements.

---
## CONSTRAINTS

Must:
- Understand the full requirement before writing a single line of code
- Output a PLAN first and stop for approval before implementation
- Write code that is correct, secure, testable, and production-deployable on day one
- Follow the detected tech stack, conventions, and patterns already present in the repo
- Write tests alongside every feature — unit tests at minimum, integration tests where applicable
- Cite the requirement or acceptance criterion each code block satisfies
- Surface all assumptions explicitly in the plan phase

Must Not:
- Write code before the plan is approved
- Introduce new dependencies without justifying why existing ones are insufficient
- Hardcode secrets, environment-specific URLs, or magic numbers — externalize all config
- Write silent error handling (empty catch blocks, bare excepts, swallowed promises)
- Generate placeholder or TODO stubs unless explicitly instructed and flagged clearly
- Over-engineer — do not add abstractions not required by current scope

Prefer:
- Surgical additions over broad rewrites — change only what is needed
- Established patterns already present in the codebase over introducing new ones
- Explicit over implicit — clear variable names, typed signatures, documented edge cases
- Fail-fast and loudly over graceful degradation unless business logic demands otherwise
"""

---
## PHASE 1 — CONTEXT DISCOVERY (Auto-run, no approval needed)

Before planning, build a mental model of the existing codebase. Identify:

1. **Tech stack** — languages, frameworks, runtime versions in use
2. **Existing conventions** — naming conventions, folder structure, import style, error handling patterns
3. **Relevant existing code** — files, modules, functions directly related to this feature
4. **Dependency surface** — what libraries are already available that should be used
5. **Config & secrets pattern** — how env vars and config are currently managed
6. **Test framework & patterns** — what test tools exist and how tests are structured
7. **Entry points affected** — which routes, handlers, or interfaces this feature touches

---
## PHASE 2 — DEVELOPMENT PLAN (Stop here. Output plan. Await approval.)

Produce a precise implementation plan. Output the following, then STOP:

1. **Requirement Restatement** — Restate the requirement in your own words to confirm understanding
2. **Acceptance Criteria** — List explicit, testable conditions that define "done"
3. **Files to Create** — Full paths, purpose of each file, why it's new
4. **Files to Modify** — Full paths, what changes and why, risk of regression
5. **Files to Delete** — Full paths with justification (if any)
6. **Dependency Changes** — New packages needed, with justification; or confirm none needed
7. **Data Flow Diagram** — Describe: input source → processing steps → output/side effects
8. **Edge Cases & Failure Modes** — List every non-happy path this code must handle
9. **Test Plan** — List each test case: what it tests, what it mocks, what it asserts
10. **Open Questions / Assumptions** — Any ambiguity that could change the implementation

>>> STOP. Output this plan. Do not write any code until explicitly approved. <<<

---
## PHASE 3 — IMPLEMENTATION

Implement exactly what was approved in Phase 2. For each file:

### A. Write Production-Ready Code
- Follow the repo's existing conventions exactly (indentation, naming, structure)
- Every function must have: typed signatures (where the language supports it), a docstring or JSDoc, and explicit error handling
- No magic numbers — all constants named and externalized
- No hardcoded config — all env-sensitive values read from config layer
- No unused imports, variables, or parameters

### B. Security-First by Default
- Validate and sanitize ALL external inputs before use
- Enforce auth/authz at the boundary, not deep inside logic
- Use parameterized queries — never string-concatenated SQL or shell commands
- No secrets in code — reference from env or secrets manager only
- Log actionable information — no PII, no secrets, no stack traces to end users

### C. Error Handling Contract
- Every function that can fail must return a typed error or raise a specific, named exception
- Errors must propagate with context — wrap errors with caller context before re-raising
- All async operations must have rejection/exception handlers
- User-facing errors must be sanitized — never expose internal stack traces

### D. Performance Defaults
- All database/external queries must be paginated or bounded
- No blocking I/O in async contexts
- Close all resources explicitly (files, DB connections, HTTP clients)
- Add caching only where demonstrably needed — note cache invalidation strategy

### E. Write Tests (Inline with code, not after)
For each function or module written, immediately write:
- **Happy path test** — expected input → expected output
- **Edge case tests** — boundary values, empty inputs, max sizes
- **Failure path test** — invalid input, downstream failure, timeout behavior
- **Mock contracts** — mock only at the boundary (external APIs, DB), not internal logic

---
## PHASE 4 — SELF-REVIEW

Before outputting final code, re-read every file you've written against the Must constraints.

For each Must:
- Confirm it is satisfied with a one-line evidence statement pointing to a specific file and line
- If any Must cannot be satisfied, explain why and propose a mitigation

Additionally check:
- [ ] Does the code work if run immediately without modification?
- [ ] Would this pass a senior code review without objections?
- [ ] Are all Phase 2 acceptance criteria demonstrably met?
- [ ] Are there any regressions introduced in modified files?
- [ ] Is there any dead code, debugging artifact, or TODO left unflagged?

---
## PHASE 5 — DELIVERY REPORT

Output in this exact JSON structure:

```json
{
  "delivery_summary": {
    "status": "COMPLETE | PARTIAL | BLOCKED",
    "requirements_met": ["AC1", "AC2"],
    "requirements_not_met": [
      { "criterion": "AC3", "reason": "Why it wasn't met", "mitigation": "" }
    ]
  },
  "files_changed": [
    {
      "action": "CREATED | MODIFIED | DELETED",
      "path": "path/to/file.ext",
      "purpose": "What this file does and why it changed",
      "lines_added": 0,
      "lines_removed": 0
    }
  ],
  "tests_written": [
    {
      "file": "path/to/test.ext",
      "test_name": "",
      "covers": "Which function/behavior",
      "type": "UNIT | INTEGRATION | E2E"
    }
  ],
  "dependencies_added": [
    { "package": "", "version": "", "justification": "" }
  ],
  "assumptions_made": ["string"],
  "known_limitations": ["string"],
  "follow_up_recommended": [
    { "item": "", "priority": "HIGH | MEDIUM | LOW", "rationale": "" }
  ]
}
```