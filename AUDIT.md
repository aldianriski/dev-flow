---
owner: Tech Lead (Aldian Rizki)
last_updated: 2026-04-27
update_trigger: New audit finding added; finding resolved → move to docs/CHANGELOG.md
status: current
audit_pass: 2 (pass 2 complete — see AUDIT_PASS2.md)
audit_lens: correctness · context efficiency · UX · self-rule compliance
---

# dev-flow — Audit Findings

> Pass 1 = quick scan only. Pass 2 (deep) reads every SKILL.md, every script body, every blueprint section line-by-line.
> Each finding is a candidate TASK-NNN — promote in priority order. Severity follows backlog convention: P0 = blocks adoption, P1 = blocks correctness or trust, P2 = quality / drift.

---

## Summary table

| ID | Severity | Lens | Title |
|:---|:---------|:-----|:------|
| AUD-001 | **P0** | correctness | Phase-file write side never implemented — Thin-Coordinator Rule is dead code |
| AUD-002 | **P0** | correctness · UX | settings.json hooks contain `[your-lint-command]` placeholders — break on use |
| AUD-003 | P1 | correctness | CI workflow runs only 2 validators; ignores all `__tests__/` suites |
| AUD-004 | P1 | correctness | Skill change protocol (RED-GREEN-REFACTOR) declared, not enforced — Sprint 11–13 changes have no before/after snapshots |
| AUD-005 | P1 | UX | README still teaches manual `cp -r` adoption — `bin/dev-flow-init.js` (Sprint 12) is invisible |
| AUD-006 | P1 | context · governance | `examples/node-express/` is a checked-in full duplicate of `.claude/` + `docs/blueprint/` — drift + size |
| AUD-007 | P1 | context | `dev-flow/SKILL.md` (335 lines) violates own >100-line rule — should split to `references/` |
| AUD-008 | P1 | context | Three blueprint files (10-modes:871, 06-harness:565, 08-orchestrator-prompts:397) far over any reasonable single-pass read budget |
| AUD-009 | P1 | governance · UX | Blueprint version SSOT split across 3 places — `AI_WORKFLOW_BLUEPRINT.md` stuck at 1.7.0 despite Sprint 11 MINOR + Sprint 13 PATCH bumps |
| AUD-010 | P1 | UX | `bin/dev-flow-init.js` does not render `settings.json` for the chosen stack — adopter inherits broken hook placeholders |
| AUD-011 | P2 | self-rule | Several SKILL.md files lack the GraphViz `dot` flowchart required by CLAUDE.md "non-obvious decision logic" rule |
| AUD-012 | P2 | context | Subagent files (code-reviewer, security-analyst) restate ~70 % of the skill they preload — redundant prompt context |
| AUD-013 | P2 | UX · governance | `BUGS.md` references closed tasks (TASK-041, TASK-043 in Sprint 7) — bugs likely fixed but file never rotated |
| AUD-014 | P2 | UX | README marketing numbers drift from source-of-truth (claims "9+ skills", actual 10; claims "27 Hard Stops", actual 24 in 08-orchestrator-prompts.md) |
| AUD-015 | P2 | governance | `IMPROVEMENT_LOG.md` (371-line session-1 transcript at repo root) has no ownership header, no rotation policy, no link from README |
| AUD-016 | P2 | UX | Sprint 14 active but empty; session-start logs info-only — opening session has no actionable next step |
| AUD-017 | P2 | governance | `package.json` version `0.1.0` does not track blueprint version — no semver mapping documented |

---

## Detailed findings

### AUD-001 — Phase-file write side never implemented (P0, correctness)

**Lens**: correctness — the central enforcement mechanism for the Thin-Coordinator Rule is half-built.

**Evidence**:
- `.claude/scripts/read-guard.js:12,49` reads `.claude/.phase` and gates Read/Grep/Glob in `implement|test|review|security|docs`.
- `.claude/scripts/session-start.js:142–153` audits the same file.
- `grep '\.claude/\.phase'` finds 10 hits — all are **readers** or **test fixtures** (read-guard.test.js:26, session-start.test.js:157,170 use `writeFileSync` to seed test state). No production script and no SKILL.md instructs the orchestrator to write `.claude/.phase` on phase transitions.
- `.gitignore:5` lists `.claude/.phase` as per-machine state but nothing creates it.

**Why it matters**: read-guard.js short-circuits with `if (!existsSync(PHASE_FILE)) process.exit(0);` — i.e. **the file never exists in real sessions, so every Read is allowed**. The §1 Thin-Coordinator Rule, the headline correctness control of v1.7.0 and the entire reason `read-guard.js` exists, is silently bypassed in 100 % of real sessions.

**Suggested action**:
1. Add a phase-state writer — either (a) a hook on phase-marker output strings (e.g. PostToolUse on Write to `.claude/.phase` after the orchestrator emits a Gate marker), or (b) explicit `phase: <name>` directives inside `dev-flow/SKILL.md` Phase Checklist that include `node .claude/scripts/set-phase.js <name>` as a step.
2. Decide enforcement model: orchestrator-managed (writes phase before each phase entry) vs harness-managed (hook detects phase boundaries from session output). Document choice in DECISIONS.md.
3. Add an integration test that exercises the full cycle: phase set → Read attempt → block → phase clear → Read allowed.

**Layer**: harness · skills · scripts.

---

### AUD-002 — settings.json contains literal placeholder commands (P0, correctness · UX)

**Lens**: correctness — committed `settings.json` cannot be used as-is.

**Evidence**:
- `.claude/settings.json:80,90,100,110` — four `PreToolUse` hook entries have `command: "[your-lint-command]"` and `[your-typecheck-command]` (literal strings, not template tokens).
- `bin/dev-flow-init.js:67–82 copyScaffold()` copies `.claude/` recursively without rendering `settings.json` — adopters inherit the same literal strings.
- The dev-flow repo itself runs these hooks on every `git commit` / `git push` here. Either Claude Code refuses to execute the unknown command (silent permission failure) or it tries to run a shell command literally named `[your-lint-command]`. Either way: the Bash(git commit*) hook is non-functional in this repo.

**Why it matters**: every claim that "lint/typecheck must pass before commit" depends on a working hook. The hook is currently a string literal. P0 because it both (a) breaks the dev-flow repo's own DoD enforcement and (b) ships broken to every adopter.

**Suggested action**:
1. Move the four placeholder hooks to `settings.local.example.json` (per-stack, per-machine), out of the committed `settings.json`. Or split: keep generic hooks in committed settings, ship stack-specific hooks via templates rendered by `dev-flow-init.js`.
2. Extend `dev-flow-init.js` `LAYER_PRESETS` with hook command presets per stack (`node-express` → `npm run lint`, `python-fastapi` → `ruff check`, etc.), and render `settings.json` (or `settings.local.json`) during init.
3. Add a check to `validate-scaffold.js`: any hook `command` containing `[your-` substring → `[FAIL]`.

**Layer**: harness · scripts · governance.

---

### AUD-003 — CI runs only validate-scaffold + validate-blueprint (P1, correctness)

**Lens**: correctness — tests exist but never gate merges.

**Evidence**:
- `.github/workflows/validate.yml:17–21` runs only `validate-scaffold.js` and `validate-blueprint.js`.
- Test files present but uncovered by CI:
  - `.claude/scripts/__tests__/*.test.js` — 9 Node test files (read-guard, track-change, ci-status, regenerate-manifest, validate-scaffold, validate-blueprint, session-start, audit-skill-staleness)
  - `.claude/scripts/__tests__/compress.test.py` — 17 unittest tests
  - `bin/__tests__/dev-flow-init.test.js`
  - `evals/measure.py` — never compile-checked
- No matrix on Node version (only Node 18) despite `engines.node: ">=18"`. Adopters on Node 20/22 may hit unflagged regressions.

**Why it matters**: CONTRIBUTING.md §"Skill changes" promises eval evidence and tests as merge gates. CI does not enforce them. Sprint 11–13 added 30+ new tests that have never run on a PR — only locally.

**Suggested action**:
1. Add a CI step: `node --test .claude/scripts/__tests__/ bin/__tests__/` (Node ≥18 has built-in test runner, no deps).
2. Add a CI step: `python -m unittest discover -s .claude/scripts/__tests__/ -p "*.test.py"` and `python -m py_compile evals/measure.py .claude/scripts/compress.py`.
3. Add Node version matrix: `[18, 20, 22]`.
4. Add `audit-skill-staleness.js` as a scheduled cron CI job (weekly), not on PR.

**Layer**: ci · scripts.

---

### AUD-004 — Skill change protocol declared, not enforced (P1, correctness)

**Lens**: correctness — `CONTRIBUTING.md:33–34` mandates RED-GREEN-REFACTOR with `compare` snapshots for any skill change. Repo state contradicts.

**Evidence**:
- `evals/snapshots/<skill>/baseline-001.json` exists for all 9 skills (Sprint 10 TASK-048).
- Sprint 11 modified `dev-flow/SKILL.md` twice (TASK-044 sprint mode, TASK-036 :compress dispatch) and added `dev-flow-compress/SKILL.md`. No before/after snapshots committed in `evals/snapshots/dev-flow/` or `dev-flow-compress/`.
- Sprint 12 / 13 touched skills via cross-cutting docs (`05-skills.md` Skill Change Protocol section) but no `evals/measure.py compare` output attached to those commits.
- `.github/workflows/validate.yml` has no eval-evidence check — process is honor-system only.

**Why it matters**: the headline TASK-026 deliverable was a TDD framework for skills. It exists. It is not invoked. Skill behavior changes are merging without measurement, exactly the regression mode the framework was built to prevent.

**Suggested action**:
1. Add a CI gate: on PRs that modify any `.claude/skills/**/SKILL.md`, require a paired `evals/snapshots/<skill>/<task-id>-after.json` + a `compare` output attached as a PR comment or in `evals/runs/<task-id>.md`.
2. Backfill before/after snapshots for Sprint 11 dev-flow + dev-flow-compress changes — close the open audit trail.
3. Document the gate in CONTRIBUTING.md §"Skill changes" with explicit CI step name.

**Layer**: governance · ci · evals.

---

### AUD-005 — README still teaches manual `cp -r` adoption (P1, UX)

**Lens**: UX — onboarding path documented in README is harder than the one already shipped.

**Evidence**:
- `README.md:30–36` lists `git clone` + `cp -r dev-flow/.claude your-project/` + `cp templates/*.template`.
- `bin/dev-flow-init.js` (172 lines, Sprint 12, ADR-002) does all of that interactively in one command — copies scaffold, renders templates with project name + stack preset, creates `.claude/CLAUDE.md` with layers prefilled.
- `package.json:5` exposes it as `bin: { "dev-flow-init": "./bin/dev-flow-init.js" }`.
- `README.md` does not mention `dev-flow-init.js` at all. `examples/README.md` mentions it; root does not.

**Why it matters**: first impression is the manual path. Adopter cargo-cults `cp -r` instead of running the CLI, never learns about template substitution, ends up with placeholder strings in their `.claude/CLAUDE.md`.

**Suggested action**:
1. Replace `README.md` "How to adopt" block with: `npx --no node bin/dev-flow-init.js` or `node bin/dev-flow-init.js` as the primary path; demote manual `cp -r` to "If you cannot run Node ≥18, …".
2. Confirm `package.json bin` makes `npx dev-flow-init` work after `git clone`; if not, document the `node bin/...` invocation explicitly.
3. Add a brief "What gets created" table showing the 8 files `dev-flow-init.js` writes.

**Layer**: docs · governance.

---

### AUD-006 — `examples/node-express/` is a checked-in full duplicate (P1, context · governance)

**Lens**: context efficiency + governance — every SSOT change must be mirrored manually.

**Evidence**:
- `examples/node-express/.claude/` mirrors `.claude/` (50+ files: skills, agents, scripts, settings, MANIFEST). `examples/node-express/docs/blueprint/` mirrors `docs/blueprint/`.
- `diff -q` confirms current parity but no automation enforces it. Any change to `.claude/skills/dev-flow/SKILL.md` requires a paired write to `examples/node-express/.claude/skills/dev-flow/SKILL.md` — easy to forget.
- CLAUDE.md anti-pattern §"Editing auto-synced copies" warns against this exact failure mode but no script auto-syncs the two trees.
- Repo size impact: doubles every committed `.claude` change in git history.

**Why it matters**: a working example is the right idea, but storing a literal byte-for-byte mirror in the same repo makes the example a second source of truth that will drift the moment anyone forgets to mirror.

**Suggested action**: pick one of three paths and document in DECISIONS.md.
1. **Delete the mirror**, replace `examples/node-express/` with a README + the project-specific files only (`src/index.js`, `package.json`, `TODO.md` post-bootstrap). Tell readers to run `node bin/dev-flow-init.js` to see the rest.
2. **Auto-sync via pre-commit hook**: add `scripts/sync-examples.js` that re-runs `dev-flow-init.js` into `examples/<stack>/` on commit; CI fails if drift detected.
3. **Generate during CI**: don't commit the mirror at all; CI bootstraps a fresh example on each PR and runs validate-scaffold against it as a smoke test.

**Layer**: governance · scripts · examples.

---

### AUD-007 — `dev-flow/SKILL.md` violates the >100-line rule (P1, context)

**Lens**: context efficiency — the orchestrator skill is ~3× the size of every other skill.

**Evidence**:
- `.claude/skills/dev-flow/SKILL.md` = 335 lines (covers Mode Dispatch + Phase Checklist 0–10 + Hard Stops + Hotfix + Resume + Sprint Mode + Red Flags inline).
- Other skills: adr-writer 79, refactor-advisor 60, lean-doc-generator 106, pr-reviewer 104, security-auditor 76, system-design-reviewer 89, task-decomposer 87.
- CLAUDE.md anti-pattern §3 + `docs/blueprint/05-skills.md` say "heavy reference content (>100 lines, e.g. patterns catalog) goes in a sibling file under skills/<name>/references/".
- task-decomposer correctly applies the rule: 87-line SKILL.md + 136-line `references/decomposition-spec.md`.

**Why it matters**: every `/dev-flow` invocation loads 335 lines into orchestrator context before the user has even said which mode. Sprint Mode + Hotfix + Resume are mode-specific — only one applies per session, but all three sit in baseline context.

**Suggested action**:
1. Keep in SKILL.md (≤120 lines): frontmatter, Mode Dispatch table, decision flow `dot`, Sub-commands, top-level Phase Checklist, Red Flags table.
2. Move to `skills/dev-flow/references/`: `phases.md` (full Phase 0–10 detail with gate templates), `hard-stops.md` (the 24 ❌ list), `mode-hotfix.md`, `mode-resume.md`, `mode-sprint.md`. SKILL.md cross-references the relevant file when a mode is chosen.
3. After split, run `evals/measure.py compare` on `dev-flow` to confirm `terse_isolation_delta` does not regress past the +379 % baseline.

**Layer**: skills · evals.

---

### AUD-008 — Three blueprint files exceed any single-pass read budget (P1, context)

**Lens**: context efficiency — reference content fine in principle, sizes make targeted reading impossible.

**Evidence**: `wc -l docs/blueprint/*.md`:
| File | Lines | Conceptual bite-size |
|:-----|:------|:---------------------|
| `10-modes.md` | **871** | INIT, Resume, Migration, Performance, Hotfix, Task Decomposer all in one file |
| `06-harness.md` | **565** | settings.json, scripts, CLAUDE.md template all in one file |
| `08-orchestrator-prompts.md` | **397** | Every gate prompt + TDD + 24 hard stops |
| 04-subagents.md | 193 | OK |
| 05-skills.md | 270 | borderline |
| Others | 74–169 | OK |

**Why it matters**: the blueprint itself owns "any docs/ file line count exceeds its limit" (08-orchestrator-prompts.md:375 — README:50, ARCHITECTURE:150, SETUP:100, AI_CONTEXT:100). It defines no limit for `docs/blueprint/*.md`, but the spirit of the same rule applies — humans and AI cannot meaningfully review an 871-line doc in one session.

**Suggested action**:
1. Split `10-modes.md` per mode: `10a-init.md`, `10b-resume.md`, `10c-migration.md`, `10d-performance.md`, `10e-hotfix.md`, `10f-task-decomposer.md`. Keep `10-modes.md` as a 30-line index.
2. Split `06-harness.md` into `06a-settings.md`, `06b-scripts.md`, `06c-claude-md-template.md`.
3. Set an explicit blueprint-doc line cap (suggest 250) and add `validate-blueprint.js` check. Bump MAJOR (or document as PATCH if cross-references all preserved — the 5-file split was already done in TASK-005 as PATCH).

**Layer**: docs · scripts · governance.

---

### AUD-009 — Blueprint version SSOT is split across three places (P1, governance · UX)

**Lens**: governance — the version humans and AI see does not match the latest bump.

**Evidence**:
- `AI_WORKFLOW_BLUEPRINT.md:3` frontmatter: `version: 1.7.0`. File body: "Current version: **1.7.0** (last blueprint content release)."
- `docs/CHANGELOG.md` records subsequent bumps: Sprint 11 = MINOR (sprint mode + :compress sub-skill), Sprint 13 = PATCH (canonical files governance). By CONTRIBUTING.md rules current version is at minimum **1.8.1**.
- README points adopters to `AI_WORKFLOW_BLUEPRINT.md` for the version, where it's stuck at 1.7.0.
- `package.json:3` is `0.1.0` — independent of blueprint version, no documented mapping.
- No script enforces version bumps on changes that match MINOR/MAJOR triggers (new mode, new skill, new hard stop).

**Why it matters**: an adopter pinning to "blueprint v1.7.0" thinks they know the surface area. Real surface includes `/dev-flow sprint` (Sprint 11), `:compress` sub-skill (Sprint 11), Skill Change Protocol (Sprint 12), Canonical Files Governance (Sprint 13). Version pinning is meaningless until SSOT is fixed.

**Suggested action**:
1. Pick one SSOT for blueprint version. Recommend `docs/blueprint/VERSION` (one line: `1.8.1`). Every other file references it.
2. Update `AI_WORKFLOW_BLUEPRINT.md` redirect to read VERSION at runtime (or remove version line; the redirect is purely a redirect now).
3. Add a CI check: on any blueprint change matching MINOR/MAJOR rules (regex on changed paths + diff content), require VERSION bumped in same PR.
4. Document the relationship between `package.json` version and blueprint version (or break them apart explicitly: package.json tracks the CLI, blueprint version tracks the workflow contract).

**Layer**: governance · ci · docs.

---

### AUD-010 — `dev-flow-init.js` does not render `settings.json` for the chosen stack (P1, UX)

**Lens**: UX — bootstrap leaves the most error-prone file unrendered.

**Evidence**:
- `bin/dev-flow-init.js:66–83 copyScaffold()` copies `.claude/` byte-for-byte except for excluding `settings.local.json`.
- The placeholder hooks in `settings.json` (AUD-002) propagate verbatim. Adopter must hand-edit four hook commands or face silent failure.
- `TEMPLATE_MAP` (`bin/dev-flow-init.js:21–30`) covers 8 doc files. None target `settings.json` or `settings.local.json`.
- `settings.local.example.json:11` says "Replace `[package-manager] *`" but there is no rendering step that does it.

**Why it matters**: stack preset (`node-express`, `react-next`, `python-fastapi`, `go-gin`) is the perfect place to inject `npm run lint`, `eslint .`, `ruff check`, etc. The information is already collected at prompt time; not using it is an avoidable cliff.

**Suggested action**:
1. Extend `LAYER_PRESETS` to a richer `STACK_PRESETS` shape: `{ layers, lintCommand, typecheckCommand, packageManager }`.
2. Add `settings.json` and `settings.local.example.json` to `TEMPLATE_MAP` with substitutions: `[your-lint-command]`, `[your-typecheck-command]`, `[package-manager]`.
3. After init, write a one-line summary: "Hooks configured for `node-express`: lint=`npm run lint`, typecheck=`tsc --noEmit`. Edit `.claude/settings.local.json` to override."

**Layer**: scripts · templates.

---

### AUD-011 — Several SKILL.md files lack the GraphViz flowchart (P2, self-rule)

**Lens**: self-rule compliance — CLAUDE.md says "Every SKILL.md with non-obvious decision logic gets a GraphViz `dot` flowchart".

**Evidence (spot check)**:
| Skill | Has `dot` block? | Decision logic? |
|:------|:-----------------|:----------------|
| dev-flow | ✓ | yes |
| task-decomposer | ✓ | yes |
| lean-doc-generator | ✗ | yes — HOW filter, ownership header, line-count branches |
| security-auditor | ✗ | borderline — checklist, less branchy |
| pr-reviewer | ✗ | yes — Stage 1 → Stage 2 gating |
| refactor-advisor | ✗ | unread in this pass |
| system-design-reviewer | ✗ | unread in this pass |
| release-manager | ✗ | unread in this pass |
| adr-writer | ✗ | low — append-only |

**Why it matters**: PR-reviewer gates Stage 2 on Stage 1 (104 lines, 7 lenses, sequential rule) — exactly the kind of logic the rule targets. Lean-doc-generator's HOW filter is a multi-branch decision used at every commit. Both should have flowcharts.

**Suggested action**: pass-2 review of every SKILL.md against the rule; add `dot` blocks where decision logic is multi-branch or sequential. Don't add `dot` to skills whose body is purely a checklist (security-auditor, adr-writer) — note those as exempt in `docs/blueprint/05-skills.md`.

**Layer**: skills · docs.

---

### AUD-012 — Subagent files duplicate ~70 % of preloaded skill content (P2, context)

**Lens**: context efficiency — agent dispatch loads agent + preloaded skill, both repeating the same review checklist.

**Evidence**:
- `.claude/agents/code-reviewer.md` (88 lines) restates: two-stage review process, 7 quality lenses, output format, hard rules. All also in `.claude/skills/pr-reviewer/SKILL.md` (104 lines).
- `.claude/agents/security-analyst.md` (76 lines) restates: OWASP audit checklist, output format, hard rules. All also in `.claude/skills/security-auditor/SKILL.md` (76 lines).
- The agents are described as "thin wrappers that preload" the skills — they should be ≤25 lines: input contract, model/tools/effort, "use the preloaded skill", output token budget. Nothing else.

**Why it matters**: every Phase 6 / Phase 7 dispatch pays the cost of both the agent prompt and the skill prompt. Eliminating the duplicate reduces dispatch cost by ~40 % per review.

**Suggested action**:
1. Trim `code-reviewer.md` and `security-analyst.md` to: frontmatter, one-paragraph mandate, input contract, "follow `[skill-name]`", output token budget. Target ≤25 lines each.
2. Apply same trim to migration-analyst, performance-analyst (read in pass 2 to confirm).
3. Re-run `evals/measure.py` baseline for both agents post-trim; expect noticeable `brevity_delta` improvement.

**Layer**: agents · evals.

---

### AUD-013 — `BUGS.md` references closed tasks (P2, governance)

**Lens**: governance · trust — open bugs against done tasks.

**Evidence**:
- `docs/BUGS.md:16` BUG-001 status: "open — tracked in TASK-041".
- `docs/BUGS.md:32` BUG-002 status: "open — tracked in TASK-043".
- `TODO.md:49` (line comment): "TASK-039, 040, 041, 043, 045 promoted to Sprint 7 — closed".
- `docs/CHANGELOG.md` Sprint 7 entry confirms harness init fixes shipped.
- BUGS.md last_updated: 2026-04-24 (one day before this audit) — file was touched recently but the status field was not.

**Why it matters**: a new contributor reads BUGS.md, sees two P0 bugs marked open, panics or ignores; either is wrong. Source-of-truth is split between `BUGS.md` and `CHANGELOG.md`.

**Suggested action**:
1. Verify BUG-001 (CLAUDE_PLUGIN_ROOT) and BUG-002 (allowedTools) are actually fixed in current `settings.json`. Spot check: `settings.json:16` uses `$CLAUDE_PROJECT_DIR` not `${CLAUDE_PLUGIN_ROOT}` ✓. `settings.json:3–7` has `Bash(node .claude/scripts/*)` allowlist ✓. Both bugs are fixed.
2. Move both BUG entries to `docs/CHANGELOG.md` Sprint 7 block (resolved bugs entry).
3. Replace BUGS.md body with "No open bugs." plus a rule: "if open bugs exist, list with link to tracking task; else this file is empty by design."

**Layer**: docs · governance.

---

### AUD-014 — README marketing numbers drift from source-of-truth (P2, UX)

**Lens**: UX · trust — claimed numbers don't match committed files.

**Evidence**:
- `README.md:21` claims "Skill library — 9+ project-local, git-tracked skills". Actual = 10 (`MANIFEST.json`).
- `README.md:18` claims "27 Hard Stops — non-negotiable pipeline blocks". Actual count of `❌` lines in `docs/blueprint/08-orchestrator-prompts.md` = **24**. Even allowing for hard stops in `dev-flow/SKILL.md` (17 there, but overlapping the same set), neither number reaches 27. Last Hard Stop count of 27 likely traces back to Sprint 1 / IMPROVEMENT_LOG.md.
- `README.md:19` claims "7 Subagents". Actual count `.claude/agents/*.md` = 7 ✓.

**Why it matters**: numbers in README are the first signal of project maturity. Drift signals "rotting docs" to anyone counting.

**Suggested action**:
1. Replace fixed counts with auto-rendered ones at session-start time, OR remove the counts entirely (e.g. "skill library", "rich subagent set", "non-negotiable pipeline blocks").
2. If keeping counts, add a `validate-blueprint.js` check: count `❌` in 08-orchestrator-prompts.md and `MANIFEST.json` skills; fail if README values drift.

**Layer**: docs · scripts.

---

### AUD-015 — `IMPROVEMENT_LOG.md` is unmanaged historical content (P2, governance)

**Lens**: governance — 371-line transcript at repo root, no header, no purpose, no rotation.

**Evidence**:
- `IMPROVEMENT_LOG.md:1–10` is a verbatim Session-1 transcript ("Putting on the System Orchestrator hat, here is the honest critique…").
- No ownership header. No `last_updated`. Not referenced by README, CHANGELOG, or CONTRIBUTING.
- Content fully superseded by Sprint 0 Research outputs (`context/research/*.md`) and the actual scaffold.

**Why it matters**: at 371 lines and root-located, it's surfaced to AI tools by default. Indexers, IDE assists, and `Glob **/*.md` all see it. New AI sessions may load it and confuse historical critique with current state.

**Suggested action**: pick one.
1. **Move** to `docs/archive/2026-04-20-session-1-critique.md` with an ownership header `status: archived`. Add `docs/archive/` to `.gitignore`-equivalent indexer hint or `.claude/settings.local.json` exclusion.
2. **Delete**. Sprint 0 outputs already capture the actionable parts.

**Layer**: docs · governance.

---

### AUD-016 — Sprint 14 active but empty (P2, UX)

**Lens**: UX — opening a session has no clear next step.

**Evidence**:
- `TODO.md:38–41`: "### Sprint 14 — TBD (active) — No tasks yet. Promote from Backlog or add new items."
- `TODO.md:46–66` Backlog comment lines all show promoted/closed; **no remaining backlog items**.
- `session-start.js:122–123` logs "ℹ Active Sprint exists but has no open tasks — promote from Backlog or start new sprint." — info only, no action.

**Why it matters**: dev-flow's own usage signal is that the project has caught up to its own backlog. Either:
- The next sprint hasn't been planned and the project is between cycles (state should be made explicit), or
- The current AUDIT findings should populate Sprint 14.

**Suggested action**:
1. After this audit, promote the AUD-NNN findings as TASK-NNN entries (sequence continues from TASK-052+ — verify last assigned in Sprint 13). P0 → Sprint 14, P1 → backlog ordered, P2 → backlog tail.
2. Patch session-start.js: when Active Sprint empty AND Backlog empty, escalate to `WARN` (not `ℹ`) and suggest "Run `/task-decomposer <intent>` or `/dev-flow <freeform>` to populate Sprint."

**Layer**: governance · scripts.

---

### AUD-017 — `package.json` version untracked (P2, governance)

**Lens**: governance — semver story for the bin/ CLI is undefined.

**Evidence**:
- `package.json:3` version `0.1.0` — never bumped despite Sprint 12 (CLI introduced) and Sprint 13.
- Adopters who ever publish this to npm or pin via `npm i github:aldian/dev-flow` see `0.1.0` regardless of blueprint version.
- ADR-002 doesn't address version coupling between `bin/dev-flow-init` and the blueprint it bootstraps.

**Why it matters**: low-impact today (no npm publish). Becomes a problem the moment dev-flow goes to a registry or supports multiple stacks with different bootstrap surfaces.

**Suggested action**:
1. Decide coupling: package.json version = blueprint version (simple), OR independent (`bin/dev-flow-init` semver tracks the CLI surface, blueprint semver tracks the workflow contract).
2. Document in CONTRIBUTING.md or as a new ADR.
3. If coupled — add CI check that `package.json` version matches blueprint VERSION on every PR.

**Layer**: governance · ci.

---

## Recommended sprint plan (suggested, not enforced)

> Promote findings to TASK-NNN in `TODO.md` Active Sprint via `/task-decomposer` or by hand. Suggested ordering by dependency + severity:

**Sprint 14 (P0 — must ship first, atomic)**:
- AUD-001 (phase-file write side) — without this, `read-guard.js` is dead. Highest value per token.
- AUD-002 (placeholder hooks in settings.json) — paired with AUD-010 since the fix touches the same files.

**Sprint 15 (P1 batch — correctness + UX honesty)**:
- AUD-003 (CI runs all tests + matrix)
- AUD-004 (skill change protocol enforced in CI)
- AUD-005 (README adoption path uses `dev-flow-init.js`) + AUD-010 (init renders settings)
- AUD-009 (blueprint version SSOT)

**Sprint 16 (P1 — context surgery)**:
- AUD-007 (split `dev-flow/SKILL.md`)
- AUD-008 (split blueprint mega-files)
- AUD-006 (decide examples mirror policy + apply)

**Sprint 17 (P2 cleanup)**:
- AUD-011, AUD-012, AUD-013, AUD-014, AUD-015, AUD-016, AUD-017 — group into one polish sprint.

---

## What this audit did NOT cover

Pass 2 (TASK-096, 2026-04-27) completed all items in this queue. See `AUDIT_PASS2.md` for findings.

Pass 2 open (deferred to v2 EPIC):
- Eval golden dataset reproducibility — are baseline snapshots reproducible across model versions?
- Adversarial / red-team pass on bundled scripts and skills.
- Multi-stack proof (Python-FastAPI, Go-Gin).

---

## How to use this file

1. Treat each `AUD-NNN` finding as a draft TASK-NNN candidate.
2. Promote in priority order via `/task-decomposer` — the **Suggested action** sections are deliberately written as decomposition input.
3. As findings ship, move them to `docs/CHANGELOG.md` (or to `docs/BUGS.md` if reclassified as live bugs) and remove from this file.
4. Keep AUDIT.md alive only while Pass 1 + Pass 2 backlog is open. Once cleared, archive the file under `docs/archive/2026-04-25-audit-pass-1.md`.
