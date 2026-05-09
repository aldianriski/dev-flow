---
owner: Tech Lead (Aldian Rizki)
last_updated: 2026-05-08
update_trigger: Sprint state change
status: closed
plan_commit: TBD (backfill — single consolidated commit per Sprint 048/049/050 pattern)
close_commit: TBD (backfill)
---

# Sprint 051a — Lean Architecture Foundation (STACK_PRESETS migration + project skeleton scaffold)

**Theme:** First half of ISSUE-04 (lean architecture skeleton). Migrate `STACK_PRESETS` from layered MVC (`api/service/repository/middleware/model`) to **Clean Architecture + Domain-Driven Design** (`domain/application/infrastructure/interface/shared`). Add `createProjectSkeleton(target, preset)` to bin/dev-flow-init.js that materializes per-stack folder skeleton at init time. ADR-029 locks CA+DDD as canonical for dev-flow-scaffolded user-projects. Sprint 051b (next session) handles template re-rendering (CLAUDE.md + ARCHITECTURE.md) + blueprint primer.
**Mode:** mvp · **Driver:** Tech Lead · **AI:** Claude Opus 4.7
**Predecessor:** Sprint 050 closed `8940f01` (F3 init scaffold full).
**Successor:** Sprint 051b — Template re-render + blueprint primer (S2/S3/S4 from ISSUE-04 plan).

---

## Why this sprint exists

ISSUE-04 (post-Sprint-050 user feedback): "all the suggestion file of this plugin is only supporting file, we miss the user pov to project specifict needed file, and we not have a stadarize structure for foldering, for project usage file with suggestion lean architecture." User explicit ask: Clean Architecture + Domain-Driven Design.

**Symptom audit:**

- `STACK_PRESETS` (bin/dev-flow-init.js) defines `layers` field per stack (api/service/repository/middleware/model — layered MVC). Layers reference values flow through `applySubstitutions` → CLAUDE.md template `[CUSTOMIZE]` blocks → user must fill in manually.
- `createEmptyScaffoldDirs` (Sprint 050) only creates `docs/codemap/` + `docs/adr/` — meta-coordination dirs. NOT user-project source dirs.
- `templates/CLAUDE.md.template` lines 16-22, 24-25, 27-28, 30-31, 33-37 all `[CUSTOMIZE]` — user-project structure is left undefined per-adoption.
- AI agents reading user-project hit empty placeholders → can't reason about layers; can't auto-route refactors; layer-based skill-dispatch (orchestrator skill-dispatch.md) breaks because layers don't map to filesystem.
- ISSUE-03 lesson rerun: governance-only optimization without user-project shape.

**Locked decisions (session AskUserQuestion):**
- (a) react-next: `app/` at root (Next.js routing) + `src/` for CA layers (interface/ collapses into app/).
- (b) Sprint split: 051a (foundation) + 051b (templates + blueprint).
- (c) Uniform CA+DDD across backend stacks; react-next variant has 4 layers (no interface/ — collapses to app/).

**Per OQ-J: Date stamping = 2026-05-08.**

---

## Open Questions (locked at promote)

- (A) **Layer set canonical.** **Decision:** `domain · application · infrastructure · interface · shared` (CA+DDD synthesis). domain = entities + VOs + aggregates + domain events + repo *interfaces*; application = use cases + app services + DTOs + ports; infrastructure = repo *implementations* + framework adapters + db + external clients + mappers; interface = HTTP/CLI/UI entry (controllers, routes, presenters); shared = cross-cutting (errors, types, value objects shared across contexts) — guard against kitchen-sink.
- (B) **Per-stack source root.** **Decision:** node-express → `src/`; react-next → `src/` (CA layers) + `app/` (Next routing parallel); python-fastapi → `app/`; go-gin → `internal/` + `cmd/<name>/`; custom → user owns (skip skeleton creation).
- (C) **Test dirs.** **Decision:** unified `tests/{unit,integration,e2e}/` for node-express + react-next + python-fastapi. Go-gin uses Go convention `internal/.../tests/` co-located; skip top-level tests/ for go-gin to avoid Go-idiom violation.
- (D) **react-next layer count.** **Decision:** 4 layers (`domain · application · infrastructure · shared`) — interface collapses into `app/` (Next.js App Router). Documented in CLAUDE.md template stack-render (Sprint 051b).
- (E) **Bounded contexts.** **Decision:** default = single bounded context (CA layers at src/ root). Multi-context (`src/contexts/<name>/`) as Sprint 051b primer documentation; NOT auto-scaffolded — opt-in pattern user adopts at scale.
- (F) **Existing test migration.** **Decision:** rewrite existing assertions in `bin/__tests__/dev-flow-init.test.js` that reference old layer names (`'repository'` / `'hook'`) → new CA+DDD names (`'domain'` / `'application'`). Existing test count grows from 34 → ~40 (3 migrated + 6 new for skeleton scaffold).
- (G) **`createProjectSkeleton` placement.** **Decision:** new function in `bin/dev-flow-init.js` (not a separate file). Idempotent — preserves user content; `recursive: true` mkdir; `.gitkeep` only if missing. Module export added. Called in main() after `createEmptyScaffoldDirs(target)`.
- (H) **Backwards compat for old user-projects.** **Decision:** NOT supported. Old user-projects scaffolded with layered MVC layer names continue to work (their TODO.md has `Layer values` block matching their structure). dev-flow-init.js produces NEW scaffolds with CA+DDD; users migrating manually pick their pace. ADR-029 records the migration rationale; no auto-migration tooling.
- (I) **ADR placement.** **Decision:** ADR-029 lands Sprint 051a (with implementation), not 051b. Locks CA+DDD canonical decision atomically with the STACK_PRESETS migration. Sprint 051b template rewrites cite ADR-029 as the lock.
- (J) **Date stamp.** All artifacts stamp 2026-05-08.
- (K) **Cap discipline.** bin/dev-flow-init.js no cap (script); existing ~285 lines + new function ~30 lines = ~315 — manageable. ADR-029 ≤120 lines target. Sprint file ≤300.

---

## Plan

### T1 — Migrate STACK_PRESETS to CA+DDD layers + add per-stack source/test/app/cmd roots
**Scope:** small · **Layers:** scripts · **Risk:** medium · **HITL** *(reviewer verifies: every preset has CA+DDD layers; sourceRoot per stack correct; react-next has appRoot; go-gin has cmdRoot; existing test assertions migrated)*
**Acceptance:**
- (a) `bin/dev-flow-init.js` STACK_PRESETS rewritten:
  - `node-express` → `layers: 'domain, application, infrastructure, interface, shared'`, `sourceRoot: 'src'`, `testRoot: 'tests'`.
  - `react-next` → `layers: 'domain, application, infrastructure, shared'` (4 layers — interface collapses to app/), `sourceRoot: 'src'`, `appRoot: 'app'`, `testRoot: 'tests'`.
  - `python-fastapi` → `layers: 'domain, application, infrastructure, interface, shared'`, `sourceRoot: 'app'`, `testRoot: 'tests'`.
  - `go-gin` → `layers: 'domain, application, infrastructure, interface, shared'`, `sourceRoot: 'internal'`, `cmdRoot: 'cmd'`. (Go-gin omits `testRoot` — tests live alongside source per Go convention.)
- (b) `lintCommand` / `typecheckCommand` / `packageManager` fields preserved verbatim per preset.
- (c) `getStackPreset('custom', ...)` function preserves custom layers + sourceRoot/testRoot/appRoot/cmdRoot if user supplies; defaults to undefined (skeleton skips custom).
- (d) Sprint file § Files Changed row recorded.
**Source:** existing STACK_PRESETS + ADR-029 layer canonical decision.
**Depends on:** none.

### T2 — Add `createProjectSkeleton(target, preset)` + main flow integration
**Scope:** small-medium · **Layers:** scripts · **Risk:** medium · **HITL** *(reviewer verifies: function idempotent; preserves user content; .gitkeep only if missing; main flow ordering after createEmptyScaffoldDirs; module exports extended)*
**Acceptance:**
- (a) New function `createProjectSkeleton(target, preset)` in `bin/dev-flow-init.js`:
  - If `!preset.sourceRoot` → return (custom preset skips).
  - For each layer in `preset.layers` (comma-split, trimmed): mkdir `<target>/<sourceRoot>/<layer>/` + write `.gitkeep` if missing.
  - If `preset.appRoot` (react-next): mkdir `<target>/<appRoot>/` + write `.gitkeep` if missing.
  - If `preset.cmdRoot` (go-gin): mkdir `<target>/<cmdRoot>/` + write `.gitkeep` if missing.
  - If `preset.testRoot`: mkdir `<target>/<testRoot>/{unit,integration,e2e}/` + write `.gitkeep` per dir if missing.
- (b) Idempotent: re-runs preserve existing user content; only writes `.gitkeep` files that are missing.
- (c) Called in `main()` after `createEmptyScaffoldDirs(target)` and before console output. Skipped for custom preset (preset.sourceRoot undefined).
- (d) Console output adds: `Lean architecture skeleton: <sourceRoot>/{<layers>}/ + <testRoot>/{unit,integration,e2e}/` (per-preset details).
- (e) Module exports extended: `createProjectSkeleton`.
- (f) Sprint file § Files Changed row recorded.
**Source:** existing `createEmptyScaffoldDirs` pattern (Sprint 050) + STACK_PRESETS migration (T1).
**Depends on:** T1.

### T3 — Sibling tests migration + new skeleton tests
**Scope:** small · **Layers:** ci · **Risk:** low · **HITL** *(reviewer verifies: existing tests rewritten for CA+DDD; new tests cover skeleton creation; idempotency test; tests pass)*
**Acceptance:**
- (a) Existing `bin/__tests__/dev-flow-init.test.js` assertions rewritten:
  - Line ~91 `getStackPreset('node-express').layers.includes('repository')` → `.includes('domain')` (and add `'application'`).
  - Line ~99 `getStackPreset('react-next').layers.includes('hook')` → `.includes('application')` (and verify `appRoot === 'app'`).
  - Other preset assertions migrated similarly.
- (b) NEW tests:
  - `createProjectSkeleton: creates 5 CA layers under src/ for node-express` (assert each layer dir + .gitkeep present).
  - `createProjectSkeleton: creates app/ + 4 layers under src/ for react-next` (assert appRoot + 4 layers).
  - `createProjectSkeleton: creates internal/ layers + cmd/ for go-gin` (assert cmdRoot + 5 layers).
  - `createProjectSkeleton: creates tests/{unit,integration,e2e}/ for non-go stacks` (skip go-gin).
  - `createProjectSkeleton: idempotent on re-run` (preserves user content; .gitkeep present).
  - `createProjectSkeleton: skips custom preset` (preset without sourceRoot → no scaffolding).
- (c) Run `node --test bin/__tests__/dev-flow-init.test.js` → all pass (target ~40 tests).
- (d) Sprint file § Files Changed row recorded.
**Source:** existing test file + T1 + T2.
**Depends on:** T1 + T2.

### T4 — ADR-029 — Clean Architecture + DDD as canonical lean architecture
**Scope:** small · **Layers:** docs · **Risk:** low · **HITL** *(reviewer verifies: ADR-029 ID non-colliding; 5 decisions captured; cross-links resolve; ≤120 lines)*
**Acceptance:**
- (a) NEW `docs/adr/ADR-029-lean-architecture-canonical.md` (≤120 lines).
- (b) 5 decisions: (1) CA+DDD adopted as canonical; (2) 5-layer set (`domain · application · infrastructure · interface · shared`); (3) per-stack source-root convention (src/ / src/+app/ / app/ / internal/+cmd/); (4) react-next variant — 4 layers + app/ for Next.js routing; (5) skeleton auto-created at init (S1) — opt-out only via `custom` preset.
- (c) Context cites ISSUE-04 origin (user session 2026-05-08) + Sprint 050 retro Friction (init scaffold gap was governance-only, missed user-project shape).
- (d) Alternatives + Consequences per ADR template. Alternatives: layered MVC (rejected — flat dependency confusion); hexagonal/ports-adapters only (rejected — DDD building blocks lost); stack-flavored layers (rejected — breaks cross-project AI reasoning); opt-in skeleton via prompt (rejected — friction; defaults already opinionated for stack presets).
- (e) Cross-links: ADR-026 (outcome lens that surfaced ISSUE-04), Sprint 050 retro Friction, Sprint 051a plan, USER-OUTCOMES.md (init outcomes O1+O3+O7), Sprint 051b dependency.
- (f) Sprint file § Files Changed + § Decisions DEC-1..5 rows recorded.
**Source:** Sprint 051a OQ block + ADR-027/028 template.
**Depends on:** T1.

### T5 — TODO.md sprint pointer + Roadmap update
**Scope:** small · **Layers:** governance · **Risk:** low · **HITL** *(reviewer verifies: sprint pointer flipped; Active Sprint cleared at close; Roadmap row updated; TASK-122 split into 122a + 122b)*
**Acceptance:**
- (a) Frontmatter `sprint: none` → `sprint: 051a` at promote → `none` at close.
- (b) Active Sprint block: TASK-122a with sub-tasks T1-T5.
- (c) `> Next:` updates to point at Sprint 051b (template re-render + blueprint primer).
- (d) Backlog § P0: TASK-122 split into TASK-122a (Sprint 051a, this sprint) + TASK-122b (Sprint 051b, next sprint). Description text reflects split scope.
- (e) Roadmap row: Sprint 51 split into 51a (in_progress) + 51b (queued); Sprint 52+ unchanged.
- (f) Sprint file § Files Changed row recorded.
**Source:** existing TODO.md + Sprint 050 close pattern.
**Depends on:** T1+T2+T3+T4.

---

## Dependency chain

```
T1 (STACK_PRESETS migration)        independent
T2 (createProjectSkeleton)          depends T1
T3 (sibling tests)                  depends T1 + T2
T4 (ADR-029)                        depends T1
T5 (TODO.md update)                 depends T1+T2+T3+T4
```

Recommended execution: **T1 → T2 → T3 → T4 → T5**.

---

## Cross-task risks

- **Test pass mandatory (T3).** All 40+ tests must pass before commit. Run `node --test bin/__tests__/dev-flow-init.test.js` post-T3.
- **Existing assertion migration (T3).** Test lines 91, 99 reference old layer names. Migration is mechanical but must verify the new assertion is meaningful (e.g., not `assert.ok('domain'.includes('domain'))` — must `getStackPreset('node-express').layers.includes('domain')`).
- **Custom preset skip (T2).** `getStackPreset('custom', custom)` returns object without sourceRoot — `createProjectSkeleton` must guard with `if (!preset.sourceRoot) return`. Reviewer verifies skip semantics.
- **Idempotency (T2).** Re-runs must preserve user content. Test #5 covers; reviewer additionally verifies `recursive: true` mkdir + `if (!fs.existsSync(keepPath))` guard.
- **Old user-project compat (OQ-H).** Old scaffolds keep their MVC layers; dev-flow-init.js produces new CA+DDD scaffolds; ADR-029 § Consequences acknowledges no auto-migration.
- **Plugin runtime catch-up.** Sprint 049 release-debt (skill rename + drop) + Sprint 050 release-debt (script behavior change) accumulate. Sprint 051a adds another layer (script behavior change). Plugin manifest reload required for end-to-end test in Claude Code session — currently only verifiable via Node test suite + manual run. Acceptance harness Sprint 053 covers retroactively.
- **Sprint 051b dependency.** Sprint 051a establishes layer canonical (ADR-029) + skeleton creation. Sprint 051b depends on these to render templates correctly. If 051a ships broken layers, 051b cascades fail. Mitigation: T3 tests are the gate.

---

## Sprint DoD

- [x] T1 STACK_PRESETS migrated to CA+DDD layers (`domain · application · infrastructure · interface · shared`); per-preset roots: node-express src/+tests/; react-next src/+app/+tests/ (4 layers, no interface); python-fastapi app/+tests/; go-gin internal/+cmd/ (no testRoot).
- [x] T2 `createProjectSkeleton(target, preset)` added (~50 lines incl. comment); idempotent; preserves user content; main flow integration after createEmptyScaffoldDirs; module exports extended (createProjectSkeleton); console output adds skeleton summary line per preset.
- [x] T3 6 existing test assertions migrated (node-express layers · react-next layers · python-fastapi sourceRoot · go-gin sourceRoot/cmdRoot/testRoot · every-preset-fields) + 6 new skeleton tests (node-express 5 layers · react-next 4 layers + app/ · go-gin layers + cmd/ no tests · tests dirs unit/integration/e2e · custom skip · idempotent re-run); 43/43 pass via `node --test`.
- [x] T4 ADR-029 written (104 lines / cap 120) — 5 decisions: CA+DDD canonical · 5-layer set · per-stack source roots · react-next 4-layer variant · skeleton auto-create default. 6 alternatives considered (layered MVC · hexagonal-only · stack-flavored · opt-in skeleton · auto bounded contexts · docs-only no skeleton).
- [x] T5 TODO.md `sprint: 051a`; Active Sprint → TASK-122a + sub-tasks; TASK-122 split into 122a (this sprint) + 122b (Sprint 051b); Roadmap row Sprint 51 split into 51a (in_progress) + 51b (queued).
- [x] Plan + close consolidated commit; SHA backfill follow-up.
- [x] Open questions A-K resolved at promote; zero re-litigation during execution.
- [x] Date verification: all artifacts stamp 2026-05-08.
- [x] ADR-029 ID verified non-colliding (max ADR was 028 post-Sprint-050).
- [x] Cap discipline held: ADR-029 104/120 · sprint file 214/300 · bin/dev-flow-init.js no cap.
- [x] release-patch NOT invoked (release-debt continues per Sprint 049/050/051a accumulation; tooling sprint deferred per ADR-028 OQ-J).
- [x] Zero unrelated edits — only sprint-intent files staged; pre-existing untracked files left alone.
- [x] Sibling tests pass: 43/43 (`node --test bin/__tests__/dev-flow-init.test.js`).

---

## Execution Log

### 2026-05-08 | T1 done — single consolidated commit (SHA backfill)
STACK_PRESETS rewritten in `bin/dev-flow-init.js`. All 4 stacks migrated to CA+DDD layers. Per-preset additions: node-express adds `sourceRoot: 'src'` + `testRoot: 'tests'`. react-next adds `sourceRoot: 'src'` + `appRoot: 'app'` + `testRoot: 'tests'`; layers reduced to 4 (no `interface` — collapses to Next.js app/). python-fastapi adds `sourceRoot: 'app'` + `testRoot: 'tests'`. go-gin adds `sourceRoot: 'internal'` + `cmdRoot: 'cmd'` (testRoot omitted per Go convention). 14-line block comment above STACK_PRESETS documents layer semantics + react-next variant + go-gin testRoot omission rationale.

### 2026-05-08 | T2 done — same commit
New `createProjectSkeleton(target, preset)` function added between `createEmptyScaffoldDirs` and templates section. ~50 lines incl. comment block. Inner helper `writeKeep(dirPath)` deduplicates mkdir+gitkeep pattern. Iterates `preset.layers` (comma-split) under `preset.sourceRoot`; conditional `appRoot` (react-next), `cmdRoot` (go-gin), `testRoot` (3 subdirs unit/integration/e2e). Custom preset (no sourceRoot) → early return; skeleton skipped silently. Function called in `main()` after `createEmptyScaffoldDirs(target)`. Console output adds `Lean architecture skeleton (ADR-029): <sourceRoot>/{<layers>}/ + <extras>` per preset; custom prints `skipped`. Module exports extended with `createProjectSkeleton`.

### 2026-05-08 | T3 done — same commit
Existing layer assertions migrated: node-express now asserts 5 CA+DDD layers + sourceRoot/testRoot. react-next asserts 4 layers (no interface) + appRoot. python-fastapi asserts sourceRoot. go-gin asserts sourceRoot + cmdRoot + testRoot undefined. `every-preset-fields` test now requires sourceRoot (in addition to layers/lintCommand/typecheckCommand/packageManager).

6 NEW skeleton tests added at bottom of test file: (1) creates 5 CA layers under src/ for node-express; (2) creates app/ + 4 layers under src/ for react-next (asserts !exists src/interface/); (3) creates internal/ layers + cmd/ for go-gin (asserts !exists tests/); (4) creates tests/{unit,integration,e2e}/ for non-go stacks; (5) skips custom preset (no sourceRoot); (6) idempotent on re-run preserves user content (writes Python module under app/domain/, re-runs, asserts content preserved + sibling .gitkeep present).

`node --test bin/__tests__/dev-flow-init.test.js` → 43/43 pass.

### 2026-05-08 | T4 done — same commit
ADR-029 written at `docs/adr/ADR-029-lean-architecture-canonical.md` (104 lines / cap 120). 5 decisions captured. § Context cites ISSUE-04 origin + Sprint 050 retro Friction (init scaffold gap was governance-only). § Alternatives considers 6 options: layered MVC (rejected — flat dependency confusion); hexagonal-only (rejected — DDD building blocks lost); stack-flavored layers (rejected — breaks cross-project AI reasoning); opt-in skeleton (rejected — friction, defaults already opinionated); auto bounded contexts (rejected for default — single-context covers ~80%); docs-only no skeleton (rejected — AI agents need real tree to reason against day-1). § Consequences acknowledges opinion-coupling + no auto-migration for old user-projects + react-next 4-layer asymmetry + release-debt accumulation + eval-evidence gap (acceptance harness Sprint 053).

### 2026-05-08 | T5 done — same commit
TODO.md frontmatter `sprint: 051a`; Active Sprint block points to TASK-122a with T1-T5 sub-tasks; `> Next:` arrow updated to Sprint 051b (TASK-122b template re-render + blueprint primer); P0 backlog TASK-122 split into TASK-122a (this sprint) + TASK-122b (next sprint) with explicit dependency note; Roadmap row Sprint 51 split into 51a (in_progress) + 51b (queued); Sprint 52+ rows unchanged.

### 2026-05-08 | sprint close
This commit. CA+DDD canonical lean architecture locked structurally. Foundation in place: STACK_PRESETS embed CA+DDD layers + per-stack roots; createProjectSkeleton materializes the skeleton at init; ADR-029 records the canonical decision. Sprint 051b next: re-render templates (CLAUDE.md + ARCHITECTURE.md) against the new layers + write blueprint primer + commit blueprint/ tracking. Sprint 052 after that: F4 + F5 + F6 fold-in.

---

## Files Changed

| File | Task | Change | Risk | Test added |
|:-----|:-----|:-------|:-----|:-----------|
| `bin/dev-flow-init.js` | T1 + T2 | STACK_PRESETS rewritten (CA+DDD layers + roots); new `createProjectSkeleton` function; main flow + module exports | medium | T3 |
| `bin/__tests__/dev-flow-init.test.js` | T3 | Existing layer assertions migrated; 6 new skeleton tests | low | self |
| `docs/adr/ADR-029-lean-architecture-canonical.md` | T4 | NEW (≤120 lines) — 5-decision CA+DDD canonical ADR | low | — |
| `TODO.md` | T5 | sprint: 051a; Active Sprint → TASK-122a; TASK-122 split into 122a+122b; Roadmap row updated | low | — |
| `docs/sprint/SPRINT-051a-lean-architecture-foundation.md` | sprint | NEW — this file | low | — |

---

## Decisions

| ID | Decision | Reason | ADR |
|:---|:---------|:-------|:----|
| DEC-1 | Clean Architecture + Domain-Driven Design adopted as canonical lean architecture for dev-flow-scaffolded user-projects | User explicit ask (ISSUE-04); CA dependency rule + DDD building blocks (aggregates, value objects, repositories) provide shared mental model + explicit dependency direction | ADR-029 |
| DEC-2 | 5-layer canonical set: domain · application · infrastructure · interface · shared | Industry-standard CA+DDD synthesis; covers entities/use-cases/adapters/entry/cross-cutting; uniform across backend stacks | ADR-029 |
| DEC-3 | Per-stack source-root convention: node-express src/ · react-next src/+app/ · python-fastapi app/ · go-gin internal/+cmd/ · custom user-owned | Match each stack ecosystem convention (Python `app/`, Go `internal/`, Next.js `app/`) while preserving CA layer naming | ADR-029 |
| DEC-4 | react-next 4-layer variant: domain·application·infrastructure·shared (interface collapses into Next.js `app/` routing) | Next.js App Router IS the interface adapter; forcing nested src/interface/app/ breaks Next.js auto-routing assumptions | ADR-029 |
| DEC-5 | Skeleton auto-created at init (default ON); custom preset skips skeleton creation | Matches dev-flow's existing opinionated stack preset philosophy (lint+typecheck auto-wired); custom preset escape hatch preserves user-owned shape | ADR-029 |

---

## Open Questions for Review

*(none surfaced during execution — all 11 promote-time OQs (A-K) resolved cleanly via "approve all" + recent session AskUserQuestion locks. Recon-first pattern (Sprint 050) repeated: read existing STACK_PRESETS + test file + understand getStackPreset custom branch BEFORE planning. Execution mechanical. Cap discipline + idempotency design + module export extension all first-try clean.)*

---

## Retro

### Worked
- **Recon-first compounded.** Sprint 050's pattern (read implementation before planning) repeated — read STACK_PRESETS + existing test assertions + `getStackPreset('custom', ...)` branch BEFORE writing the plan. Surfaced: custom preset already has graceful skip path via `if (!preset.sourceRoot) return` design; existing test assertions reference old layer names (mechanical migration); main flow ordering after createEmptyScaffoldDirs is right place. Plan landed without speculative scope.
- **Single function for all stack variants.** `createProjectSkeleton` covers 4 stacks + custom skip in ~50 lines via conditional checks (`preset.appRoot` / `preset.cmdRoot` / `preset.testRoot`). Inner `writeKeep` helper deduplicates the mkdir+gitkeep pattern. Cleaner than per-stack functions (would have been 5 near-identical 10-line functions).
- **Test coverage extended without bloat.** 6 new skeleton tests + 6 migrated assertions = 12 test surfaces touched. Test file grew ~80 lines but per-test scope is narrow (one assertion or one tightly-coupled cluster). Idempotency test writes a Python file under app/domain/order.py and verifies preservation — explicit scenario beyond mechanical .gitkeep check.
- **CA+DDD layer set held across stacks (uniformity decision OQ-A pays off).** Same 5 layers across node-express + python-fastapi + go-gin (4 for react-next). AI agents reading any user-project scaffolded post-Sprint-051a get same vocabulary regardless of language. Lift over Sprint 049 layered-MVC presets where naming was language-specific (api/service/repository).
- **react-next 4-layer asymmetry handled cleanly.** No interface/ in src/ for react-next (Next.js app/ IS the interface). Test explicitly asserts `!exists src/interface/`. Documented in ADR-029 DEC-4. No drift between code + spec + tests.
- **Sprint split (051a + 051b) confirmed right call.** 5 tasks (T1-T5) fit one M sprint cleanly. Adding template re-render (T4 + T5 from original 8-task plan) would have ballooned sprint to L size and risked surface contamination (script changes vs template content changes mixed). Split keeps each sprint single-themed.

### Friction
- **Release-debt depth growing.** Sprint 049 MINOR (skill drop + rename + behavior change) + Sprint 050 PATCH (script logic) + Sprint 051a PATCH (script behavior change in skeleton creation) + upcoming Sprint 051b changes (template content). Manual reconcile cost grows monotonically. Sprint 052 might need to PROMOTE release-debt resolution to P0 instead of P2 backlog row. Watching.
- **Plugin runtime catch-up still blocking.** Sprint 049 rename (system-design-reviewer → architecture-grill) + drop (dev-flow-compress) not visible in current Claude Code session — `/context` still shows old skill names. Plugin manifest reload requires Claude Code restart or version bump. Currently un-tested behavior changes from Sprint 049-051a only verified via Node test suite, not real Claude session. Acceptance harness Sprint 053 covers but ship-before-verify continues.
- **Sprint 051b dependency assumed not yet validated.** ADR-029 + skeleton creation assumes Sprint 051b will re-render CLAUDE.md template against new layer names. If 051b ships incomplete (e.g., misses File Structure block), user-projects scaffolded in 051a-051b window have skeleton dirs but CLAUDE.md still references old MVC layers. Mitigation: 051b MUST land before any user-project init via dev-flow.
- **Old user-project compat NOT auto-migrated.** ADR-029 § Consequences: users scaffolded with layered MVC layers continue to work but stay on old structure. Pattern: when adopting an opinionated change like CA+DDD, accept that old artifacts diverge. Documented; no migration tooling.

### Pattern candidates (carried forward)
1. **Stack-uniform vocabulary.** When introducing a cross-stack canonical (CA+DDD layers, in this case), prefer uniform naming across stacks even when language idioms differ. Cross-project AI reasoning is the lift.
2. **Conditional skeleton extras via preset fields.** `appRoot` / `cmdRoot` / `testRoot` are optional preset fields — present only on stacks that need them. Single function reads conditionally. Cleaner than per-stack branching.
3. **Idempotency by design (not retrofit).** Both `createEmptyScaffoldDirs` (Sprint 050) and `createProjectSkeleton` (Sprint 051a) designed idempotent from first commit — `recursive: true` mkdir + `if (!fs.existsSync(keepPath))` guard + `writeKeep` helper enforces the pattern. Pattern: any function that materializes filesystem state MUST be idempotent.
4. **Sprint split before scope balloon.** When a sprint has both substantive logic change AND template re-render of dependent files, split into foundation + dependents. 051a (foundation) → 051b (dependents). Prevents L-size sprints; preserves G1 size discipline.
5. **Recon-first as repeatable pattern.** Sprint 050 + Sprint 051a both used recon-first (read existing implementation before planning). Pattern fully load-bearing now. Codify in lean-doc-generator Sprint Promote checklist.

### Surprise log
- T1: 14-line block comment above STACK_PRESETS unexpectedly worth the cost. Documents layer semantics + react-next variant + go-gin testRoot omission. Future contributor reads STACK_PRESETS once and understands the per-stack convention without checking ADR-029. Doc in code > doc in ADR for hot-touch surfaces.
- T2: `writeKeep` inner helper added during T2 implementation (not planned). Reduces createProjectSkeleton from ~70 lines (with inline mkdir+gitkeep per branch) to ~50. Refactor surfaced during writing — design-by-typing.
- T3: idempotency test for createProjectSkeleton wrote a Python file (`class Order: pass`) to verify preservation. Initial draft used `'user content'` plain string but realized testing under `app/domain/` for python-fastapi preset deserves a domain-shaped artifact. Test reads more meaningfully. Documentation-via-test.
- T4: ADR-029 came in at 104 lines vs cap 120. Pattern from Sprint 049 ADR-027 (85) + Sprint 050 ADR-028 (98) + 051a ADR-029 (104): well-structured 4-7 decision ADRs land 80-110 lines. Cap pressure absent.
- T5: TASK-122 split into 122a + 122b mirrored Sprint 049 reframing pattern (initial scope → revised scope mid-execution). Difference: 051a/b split was planned at promote (locked OQ); not mid-sprint pivot. Pattern stable.
- close: 43 tests pass; all caps held; zero re-litigation. Recon-first + pre-resolve OQs + idempotency by design + sprint split = high-confidence sprint shape. Combination compounding across Sprints 048-051a.
