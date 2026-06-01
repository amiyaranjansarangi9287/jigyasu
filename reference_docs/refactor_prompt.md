"""
REFACTOR TASK: Restructure existing code to improve quality without changing behavior.

---
## CONSTRAINTS

Must:
- Prove behavioral equivalence before and after every change — no assumption of safety
- Output a PLAN first and stop for approval before touching any code
- Write or update tests BEFORE refactoring — tests are the safety net, not the afterthought
- Follow the repo's existing conventions unless the convention itself is being refactored
- Make one logical change at a time — never bundle unrelated refactors in a single step
- Cite the specific code smell, violation, or quality goal each refactor addresses
- Surface all ripple effects and downstream dependencies before making changes

Must Not:
- Change external behavior, public API contracts, or observable side effects
- Refactor and fix bugs in the same step — separate them explicitly
- Rename symbols without global cross-file impact analysis first
- Delete code without confirming it is unreachable or superseded
- Introduce new dependencies or abstractions not required by the refactor goal
- Refactor test code and production code in the same commit/step

Prefer:
- Smallest possible transformation that achieves the quality goal
- Provably safe automated refactors (extract function, rename, move) over structural redesigns
- Backward-compatible changes over breaking changes — wrap, don't replace, when in doubt
- Explicit rollback points — each logical step should be independently revertible
"""

---
## PHASE 1 — CODEBASE ARCHAEOLOGY (Auto-run, no approval needed)

Before planning, build a complete picture of what exists and what is coupled to it:

1. **Code Smell Inventory** — Identify all quality issues in scope:
   - Duplication (DRY violations), Long functions/classes (God objects)
   - Deep nesting, inconsistent naming, mixed abstraction levels
   - Implicit dependencies, hidden side effects, poor cohesion
   - Dead code, unused variables, commented-out blocks
   - Inconsistent error handling patterns across similar modules

2. **Dependency & Coupling Map**
   - Who calls what? Build caller → callee chains for all symbols in scope
   - Identify tightly coupled modules — changes here ripple where?
   - Flag shared mutable state, global variables, singleton misuse

3. **Test Coverage Baseline**
   - What tests exist for the code being refactored?
   - What is covered vs. uncovered — especially edge cases and failure paths?
   - Are existing tests testing behavior (black-box) or implementation (white-box)?
   - White-box tests will break during refactor — identify and plan to rewrite them

4. **Public Contract Surface**
   - List all public APIs, exported symbols, event names, DB schemas touched
   - These CANNOT change in signature, behavior, or side effects
   - If a change here is unavoidable, flag it explicitly as a BREAKING CHANGE

5. **Risk Zones**
   - Files/functions with no test coverage → highest regression risk
   - Files with many callers → highest ripple risk
   - Files mixing multiple concerns → highest misidentification risk

---
## PHASE 2 — REFACTOR PLAN (Stop here. Output plan. Await approval.)

Produce a step-by-step refactor blueprint. Output the following, then STOP:

1. **Goal Restatement** — What quality problem is being solved? What does "better" look like, measurably?
2. **Out of Scope** — Explicitly list what will NOT be touched in this refactor
3. **Refactor Steps** — Ordered list of atomic transformations:
   - Step N: [Refactor type] on [file:lines] — [what changes] — [why] — [regression risk: LOW/MED/HIGH]
4. **Behavioral Invariants** — List every behavior that must be identical before and after:
   - Input/output contracts for each affected function
   - Side effects that must be preserved (DB writes, events emitted, logs produced)
   - Error behaviors that must be preserved (what exceptions are raised, when)
5. **Tests to Write First** — List tests that must exist before step 1 begins:
   - Each test: what behavior it locks in, what it asserts, what it mocks
6. **Tests to Update** — White-box tests that will need rewriting post-refactor (not removal)
7. **Files to Change** — Full paths with: current problem → post-refactor state → risk
8. **Rollback Strategy** — How to safely revert each step if a regression is detected
9. **Breaking Changes (if any)** — Explicit list with migration path for each caller
10. **Open Questions** — Any ambiguity that could cause behavioral drift

>>> STOP. Output this plan. Do not write any code until explicitly approved. <<<

---
## PHASE 3 — IMPLEMENTATION (Test-First, Step-by-Step)

Execute approved steps in strict order. For each step:

### A. Write/Update Tests First (Before Changing Production Code)
- Write tests that lock in the current behavior as a behavioral contract
- Run them against the EXISTING code — they must all pass before you touch anything
- These are your regression guards; if they fail after refactor, you broke something
- Annotate each test: `# BEHAVIORAL CONTRACT: <what invariant this guards>`

### B. Apply the Atomic Refactor
Apply exactly one approved step. Common refactor types and their rules:

**Extract Function/Method**
- New function must have: typed signature, docstring, single responsibility
- Original call site must produce identical output with identical inputs
- Do not extract and modify logic simultaneously — extract first, modify in next step

**Rename Symbol**
- Perform global search — rename every reference across all files
- Update: imports, type hints, docstrings, test names, config keys, API schemas, README
- Do not rename and move simultaneously

**Move Module/File**
- Update all import paths across the entire repo
- Add a deprecation shim at the old location if any external callers exist
- Verify no circular imports are introduced post-move

**Simplify Conditionals**
- Apply one transformation: invert negative conditions, extract guard clauses, remove nested ternaries
- Before/after must produce identical truth table — verify with parametrized tests

**Eliminate Duplication**
- Extract shared logic to a single source of truth
- Both original call sites must continue to work identically
- The extracted abstraction must not be more complex than the duplication it replaces

**Restructure Class/Module**
- Move methods/attributes one at a time
- Preserve all public interfaces — internal restructuring only
- Verify cohesion improves: each class should have one reason to change

### C. Validate Each Step Before Proceeding
After every atomic step:
- [ ] All pre-existing tests still pass
- [ ] New behavioral contract tests pass
- [ ] No new linting errors introduced
- [ ] No import errors or broken references
- [ ] Public contract surface unchanged (same signatures, same side effects)
- [ ] Code is in a clean, committable state (this is a rollback point)

**If any check fails → STOP. Report the regression. Do not proceed to next step.**

### D. No Scope Creep Rule
If you discover a bug, a new smell, or an improvement opportunity during implementation:
- Do NOT fix it inline
- Log it to the `follow_up_recommended` section in the delivery report
- Continue with the approved plan only

---
## PHASE 4 — SELF-REVIEW

Before outputting final code, re-read every changed file against the Must constraints.

For each Must:
- Confirm satisfaction with a one-line evidence statement pointing to file and line
- Flag any Must that could not be satisfied, with explanation and mitigation

Additionally verify:
- [ ] Every behavioral invariant listed in Phase 2 is still demonstrably true
- [ ] No public API signature has changed without explicit BREAKING CHANGE flag
- [ ] Every refactor step is independently revertible
- [ ] No debugging artifacts, TODOs, or commented-out old code left behind
- [ ] Test suite is strictly stronger after refactor than before
- [ ] Net complexity is lower — cyclomatic complexity, coupling, and duplication reduced
- [ ] No new abstractions introduced that aren't directly required by the refactor goal

---
## PHASE 5 — DELIVERY REPORT

Output in this exact JSON structure:

```json
{
  "refactor_summary": {
    "status": "COMPLETE | PARTIAL | BLOCKED",
    "goal": "What quality problem was solved",
    "behavioral_equivalence_verified": true,
    "steps_completed": 0,
    "steps_skipped": 0
  },
  "files_changed": [
    {
      "path": "path/to/file.ext",
      "changes": "What structurally changed",
      "behavior_preserved": true,
      "lines_added": 0,
      "lines_removed": 0,
      "net_complexity_delta": "REDUCED | NEUTRAL | INCREASED"
    }
  ],
  "behavioral_contracts": [
    {
      "function": "module.function_name",
      "invariant": "Exact behavior preserved",
      "test_guard": "path/to/test.ext::test_name"
    }
  ],
  "tests_written": [
    {
      "file": "path/to/test.ext",
      "test_name": "",
      "guards": "Which behavioral invariant",
      "type": "BEHAVIORAL_CONTRACT | REGRESSION | EDGE_CASE"
    }
  ],
  "breaking_changes": [
    {
      "symbol": "",
      "change": "",
      "migration_path": "",
      "callers_affected": []
    }
  ],
  "regressions_detected": [
    {
      "step": 0,
      "description": "",
      "resolution": ""
    }
  ],
  "follow_up_recommended": [
    {
      "item": "",
      "type": "BUG | SMELL | IMPROVEMENT | TEST_GAP",
      "priority": "HIGH | MEDIUM | LOW",
      "rationale": ""
    }
  ]
}
```