---
owner: Tech Lead (Aldian Rizki)
last_updated: 2026-05-10
update_trigger: Sprint state change
status: closed
plan_commit: 573c062
close_commit: pending-squash
---

# Sprint 055-2 — Caveman 3-Arm Eval Harness Node Port (TASK-115-v2)

**Theme:** Pre-v1 plugin reliability gate #2. Port juliusbrussee/caveman 3-arm eval (`llm_run.py` + `measure.py`) to Node so dev-flow ships a measurable token-compression eval for SKILL.md authoring (baseline / terse-control / skill-arm). Snapshot schema 1:1 with caveman per `docs/research/caveman-eval-harness-port-notes-2026-05-04.md`. Tokenizer = `gpt-tokenizer` per parity recommendation in research §tiktoken-parity. Mode A (operator-pending) per Sprint 055 PC-3 — harness ships as runnable contract; live runs cost-gated to operator. Single-task sprint per anti-drift hard-stop #3 (one-task remediation still requires plan doc).
**Mode:** sprint-bulk · **Driver:** Tech Lead · **AI:** Claude Opus 4.7
**Predecessor:** Sprint 055 closed `396f05d` (TASK-116-v2 acceptance harness Node port). Release 2.7.0 `9cc3470` reconciled release-debt (chain depth 7→0). Cap-headroom hygiene `b40c087` closed Sprint 055 OQ-1/2/3.
**Closes:** TASK-115-v2 (caveman 3-arm eval Node port).

## Why this sprint exists

Three pre-v1 plugin-reliability gates converge on one outcome — *measurable* skill quality:

1. **Sprint 041 T2 research note unblocks port.** `docs/research/caveman-eval-harness-port-notes-2026-05-04.md` (status: current) locks port shape: 2 scripts (run + measure), `gpt-tokenizer` for `o200k_base` parity with Python `tiktoken`, snapshot schema 1:1 with caveman so cross-tool validation works either direction. Research §recommendation: "TASK-115 lands in its own sprint" — that sprint is now.
2. **Pairs with TASK-116-v2 (Sprint 055).** Acceptance harness measures *trigger correctness* (does Claude invoke the skill?). Caveman 3-arm measures *token compression* (does the skill make outputs cheaper relative to terse-control?). Together they form the v1 ship eval-evidence baseline per ADR-021 DEC-4. Sprint 055 PC-3 (Mode A operator-pending) explicitly flagged this sprint as next-instance reuse.
3. **Recon validation** (`feedback_recon_first.md`): research note from Sprint 041 still current; existing `scripts/eval-skills.js` (structural lint) + `scripts/eval-acceptance.js` (trigger eval, Sprint 055) confirm naming pattern (`scripts/eval-*.js`); user-locked names diverge slightly from research-recommended names — see OQ(B).

**Pre-locked decisions** (user 2026-05-10): (a) next sprint = 055-2 (not 056); (b) OQ-1/2/3 cap-headroom drift closed pre-promote via `b40c087`; (c) OQ-4 release-debt reconcile closed pre-promote via Release 2.7.0 `9cc3470`; (d) Step 1.5b BLOCK threshold lifted (depth = 0 post-2.7.0).

## Open Questions (locked at promote)

- (A) **Tokenizer choice.** **Decision:** `gpt-tokenizer` (npm) — pure JS, no WASM, embeds `o200k_base` BPE tables. Per research §tiktoken-parity recommendation. Fallback `js-tiktoken` if parity-verification step fails.
- (B) **Script naming — diverge from research.** **Decision:** user-locked names `scripts/eval-caveman.js` (run/snapshot) + `scripts/eval-measure.js` (token report). Research recommended `eval-run.js` + `eval-measure.js`; user override puts `caveman` in the run-script name to disambiguate from generic `eval-run` (avoids namespace collision with hypothetical future eval scripts). `eval-measure.js` matches research recommendation.
- (C) **Snapshot schema.** **Decision:** 1:1 with caveman per research §snapshot-schema-for-dev-flow-port. Fields: `metadata.{generated_at, claude_cli_version, model, n_prompts, terse_prefix}`, `prompts[]`, `arms.{__baseline__, __terse__, <skill_name>}[]`. Cross-tool validation either direction (caveman's measure.py reads dev-flow snapshots, dev-flow's measure.js reads caveman snapshots).
- (D) **3 arms.** **Decision:** per research §three-arms — (1) `__baseline__` no system prompt, (2) `__terse__` system="Answer concisely.", (3) `<skill>` system="Answer concisely.\n\n{SKILL.md content}". Honest delta = (3) vs (2) per Sprint 034 ADR-001.
- (E) **Skill-under-test pick.** **Decision:** start with `caveman` skill itself (1 skill, smoke validation that port reproduces upstream caveman's measured savings). Defer multi-skill rollout (e.g., `caveman-commit`, `caveman-review`) to future sprint after parity confirmed. Rationale: caveman is the only skill in this plugin authored explicitly for compression; other skills (orchestrator, lean-doc, etc.) are workflow-routing not output-compression — measurement noise dominates.
- (F) **Prompt set.** **Decision:** reuse `evals/prompts/en.txt` shape from caveman upstream — 5-10 short technical questions, one per line, blank lines skipped. Initial prompt set = 5 questions ported from caveman upstream (confirm upstream license MIT permits — research §sources confirms MIT). New prompts file at `evals/prompts/en.txt` to mirror caveman path.
- (G) **Mode A pattern.** **Decision:** apply Sprint 055 PC-3 — harness ships with `--dry-run` validation; live runs (cost API tokens × 3 arms × N prompts) gated to operator opt-in; snapshot artifact under `evals/snapshots/results-<timestamp>.json` (gitignored except `.gitkeep`). Mode B (CI per release) deferred until parity confirmed + cost gate flips.
- (H) **Test coverage.** **Decision:** sibling `__tests__/eval-caveman.test.js` + `__tests__/eval-measure.test.js` per CLAUDE.md SCAFFOLD WORK rule. Mock `child_process.spawn` for run-script tests; fixture-driven snapshot for measure-script tests. Tokenizer parity verification = standalone smoke (`npm run eval:smoke` or one-off node command per research §tiktoken-parity-verification-step).
- (I) **ADR scope.** **Decision (user-locked at promote 2026-05-10):** ADR-035 **MANDATORY at T2** — write npm-dep scope carve-out from ADR-002 ("built-ins only"). ADR-035 codifies: scaffold/runtime scripts remain stdlib-only per ADR-002; eval/measurement scripts (`scripts/eval-*.js`) may use vetted npm deps under operator-install model (no runtime npm fetch). Initial vetted dep: `gpt-tokenizer`. Mirrors ADR-027 generalization pattern (scope-clarification ADR for prior contract). Additional ADR triggers (tokenizer fallback to WASM, schema break) still apply on top.
- (J) **Cap discipline.** No SKILL.md edits planned (this is scripts + tests + docs sprint). Lint via `scripts/eval-acceptance.js --cap-headroom-warn` (Sprint 055 T3) before close to confirm no drift.
- (K) **Release-debt continues.** Depth = 0 post-Release 2.7.0 (`9cc3470`). Sprint 055-2 = first PATCH-only sprint of new MINOR cycle; depth=1 at close. Well below all thresholds (≥3 P1 surface · ≥5 P0 escalate · ≥7 BLOCK). Sprint 056 v1-ship is next planned MINOR/MAJOR.
- (L) **Date stamp.** All artifacts 2026-05-10.
- (M) **Caveman SKILL.md source resolution (user-locked at promote 2026-05-10).** **Decision:** plugin-cache path — read SKILL.md from `${env:CLAUDE_PLUGIN_CACHE}/caveman/.../SKILL.md` (resolve via Claude Code plugin-cache convention). Accept brittleness for upstream-fresh content. Operator-setup precondition: caveman plugin must be installed. T1 must hard-fail with clear message if path unresolvable (do NOT silently fall back to inline copy — drift risk worse than fail-fast).
- (N) **npm dep introduction (user-locked at promote 2026-05-10).** **Decision:** add `gpt-tokenizer` to `package.json` (create if missing). ADR-002 amendment via NEW ADR-035 carve-out (see OQ(I)). No runtime auto-install; setup README documents `npm install` as operator step. First runtime npm dep in dev-flow scripts is now precedented + scoped.

## Plan

### T1 — `scripts/eval-caveman.js` runner skeleton + snapshot writer
**Acceptance:**
1. `scripts/eval-caveman.js` exists + runnable (Node ≥18, no external runtime deps beyond `gpt-tokenizer` for T2 — T1 itself uses only stdlib `child_process`, `fs/promises`).
2. CLI flags: `--dry-run` (skeleton validation; no `claude` invocation) · `--prompts <path>` (default `evals/prompts/en.txt`) · `--out <path>` (default `evals/snapshots/results-<ISO8601>.json`) · `--model <id>` (default empty = CLI default) · `--skill <name>` (default `caveman`).
3. Loop: arms × prompts → spawn `claude -p [--system-prompt X] [--model Y] <prompt>` array-form (no shell parse per research §gaps R4 Windows space-in-PATH); collect stdout; assemble snapshot per OQ(C) schema.
4. Snapshot output: `evals/snapshots/results-<timestamp>.json` (UTF-8, indent 2, ensure non-ASCII preserved).
5. `evals/prompts/en.txt` exists with 5 ported caveman upstream prompts (MIT-licensed reuse; attribute in file header comment).
6. `evals/snapshots/.gitkeep` + `.gitignore` entry for `evals/snapshots/*` except `.gitkeep`.
7. Header comment in `eval-caveman.js`: "Snapshots are point-in-time. `claude -p` is non-deterministic. Re-run for new measurement." (per research §gaps R2).

**Scope:** IN — runner script + prompts file + snapshot dir + gitignore + dry-run validation. OUT — measurement/report logic (T2 scope), cross-tool validation against caveman upstream (T3 if surfaces), CI integration (Mode B; deferred per OQ(G)).
**Files:** `scripts/eval-caveman.js` NEW · `evals/prompts/en.txt` NEW · `evals/snapshots/.gitkeep` NEW · `.gitignore` UPDATE (add `evals/snapshots/*` except `.gitkeep`).
**Risk:** medium — `claude -p` invocation cost + non-determinism per research §gaps R2; Windows PATH parsing per R4 (mitigated by array-form spawn). Caveman SKILL.md source resolution **locked at promote** per OQ(M): plugin-cache path; hard-fail with clear message if unresolvable; do not silently fall back. T1 recon = locate exact cache path glob + document operator-setup precondition.
**DoD:** dry-run clean; snapshot written with valid JSON matching schema OR documented schema-divergence rationale; sprint file Files Changed row per file; commit before T2.
**Confidence:** 65% — uncertainty: caveman SKILL.md source path resolution (external plugin cache vs in-repo copy); `claude -p` exit-code semantics on Windows Git Bash + PowerShell shell-out per Sprint 055 T1 same uncertainty (now de-risked since Sprint 055 T1 shipped clean).

### T2 — `scripts/eval-measure.js` token counter + report
**Acceptance:**
1. `scripts/eval-measure.js` exists + runnable (Node ≥18, depends on `gpt-tokenizer` npm package — add to `package.json` if `package.json` exists; otherwise inline-require with friendly error if missing).
2. CLI flags: `--snapshot <path>` (required; reads JSON from T1) · `--encoding <name>` (default `o200k_base`) · `--format <md|json>` (default `md`).
3. Computation per research §measure.py-walkthrough: `baseline_tokens = [count(o) for o in arms["__baseline__"]]` · `terse_tokens = [...]` · `savings_per_prompt = 1 - skill_tokens[i] / terse_tokens[i]` · stats per skill: median, mean, min, max, stdev.
4. Output: markdown table to stdout sorted by median savings desc; columns = skill | n | median % | mean % | min % | max % | stdev. Header row + warm-up row showing terse-vs-baseline (sanity check).
5. Tokenizer parity verification step documented in `scripts/eval-measure.js` header comment (per research §tiktoken-parity-verification-step): one-line node command users can run to sanity-check `gpt-tokenizer` matches Python `tiktoken` for short test strings. Run once, confirm match, document result in `docs/audit/eval-caveman-2026-05-10.md`.
6. `package.json` updated if exists; otherwise add note in `tests/skill-triggering/README.md` or `evals/README.md` (NEW; ≤30 lines) for setup steps (`npm install gpt-tokenizer`).
7. Audit report `docs/audit/eval-caveman-2026-05-10.md` (NEW; harness contract + sample table from dry-run OR first live run if operator runs it; mirror Sprint 055 PC-1 frozen-contract pattern).

**Scope:** IN — measure script + tokenizer parity smoke + audit report skeleton + setup README. OUT — full live-run measurement (operator-pending Mode A per OQ(G)), measure-script optimization (single-pass is fine), cross-tool reverse-validation (T3 if surfaces).
**Files:** `scripts/eval-measure.js` NEW · `package.json` UPDATE (add `gpt-tokenizer` dep if package.json exists at repo root) · `evals/README.md` NEW (≤30 lines; setup + how-to-run + parity-check command) · `docs/audit/eval-caveman-2026-05-10.md` NEW (skeleton; harness contract).
**Risk:** medium — tokenizer parity per research §gaps R1 (mitigated by pre-verification step + fallback chain `gpt-tokenizer` → `js-tiktoken` → `@dqbd/tiktoken`); markdown table sort stability for ties (use stable sort, document). npm dep introduction **locked at promote** per OQ(N): add `gpt-tokenizer` to `package.json`; scope carve-out via NEW ADR-035 (see OQ(I) — promoted to mandatory T2 task).
**DoD:** measure script runs clean against T1 snapshot OR documented blocker; parity smoke passes OR fallback applied + ADR-035 trigger; audit report skeleton written; sprint file Files Changed row per file.
**Confidence:** 70% — uncertainty: ADR-002 "built-ins only" interpretation (likely scoped to scaffold/runtime per Sprint 050 ADR-028 context, not eval tooling — confirm at recon); whether `package.json` exists at repo root (recon needed; if missing, document `npm install` outside package.json as setup-instructions friction).

### T3 — Sibling tests + ADR-035 (conditional) + sprint close
**Acceptance:**
1. `scripts/__tests__/eval-caveman.test.js` exists (mocks `child_process.spawn`; verifies snapshot schema per OQ(C); covers `--dry-run` + `--prompts` flag handling).
2. `scripts/__tests__/eval-measure.test.js` exists (fixture-driven snapshot input; verifies token-count math + markdown table format + sort order).
3. Test runner integration: tests pass via existing `node --test` or `npm test` invocation pattern (matches `scripts/__tests__/audit-baseline.test.js` + `eval-skills.test.js` shape).
4. ADR-035 **mandatory** (locked at promote per OQ(I)+(N)): npm-dep scope carve-out from ADR-002 — scaffold scripts stdlib-only · eval/measurement scripts may use vetted npm deps · initial vetted dep `gpt-tokenizer` · operator-install model (no runtime npm fetch). Additional triggers (WASM fallback, schema break) extend ADR-035 if surfaced.
5. Cap-headroom lint clean (`scripts/eval-acceptance.js --cap-headroom-warn` from Sprint 055 T3) — confirm no SKILL.md drift this sprint.
6. Sprint close protocol per `references/SPRINT_PROTOCOLS.md`: § Files Changed populated · § Decisions written · § Open Questions surfaced · § Retro filled · CHANGELOG row prepended · TODO.md `Active Sprint` cleared.

**Scope:** IN — sibling tests for both scripts + conditional ADR-035 + cap-headroom lint sanity + standard close. OUT — integration smoke against live `claude` CLI (deferred to operator Mode A), test coverage for tokenizer-parity edge cases (smoke is sufficient).
**Files:** `scripts/__tests__/eval-caveman.test.js` NEW · `scripts/__tests__/eval-measure.test.js` NEW · `docs/adr/ADR-035-*.md` NEW (conditional) · `TODO.md` UPDATE (close TASK-115-v2; clear Active Sprint) · `docs/sprint/SPRINT-055-2-caveman-3arm-eval.md` UPDATE (close) · `docs/CHANGELOG.md` UPDATE (prepend).
**Risk:** low — additive tests; conditional ADR; standard close.
**DoD:** tests pass; ADR written OR skip-rationale logged; cap-headroom clean; close protocol complete; squash-commit message ready.
**Confidence:** 80% — uncertainty: test-runner invocation pattern across Windows Git Bash + PowerShell + Linux (Sprint 055 T1 already de-risked spawn pattern; tests follow same shape).

## G1 (anti-slip per ADR-031)

```
goal: Caveman 3-arm eval Node port (scripts/eval-caveman.js + scripts/eval-measure.js) exists + dry-run clean + snapshot schema 1:1 with caveman per research note + sibling tests + tokenizer parity smoke documented + Mode A operator-pending pattern preserved (live runs gated).
size: M (T1 M + T2 M + T3 S = M total — single-task sprint per anti-drift hard-stop #3; 3 sub-tasks decompose the one TASK-115-v2 acceptance criteria)
constraints:
  - claude -p invocation cost + non-determinism (research §gaps R2); snapshot is point-in-time, document in script header
  - tokenizer parity (research §gaps R1) — pre-verification step required; fallback chain gpt-tokenizer → js-tiktoken → @dqbd/tiktoken
  - snapshot schema 1:1 with caveman (research §snapshot-schema) — cross-tool validation either direction
  - cap-headroom: no SKILL.md edits planned; if T3 surfaces lean-doc/orchestrator pointer addition, defer per OQ(J) (lean-doc currently >=5 headroom post-b40c087)
  - npm dep introduction (gpt-tokenizer) **locked**: add to package.json; ADR-035 carve-out mandatory at T2 per OQ(I)+(N)
  - external caveman plugin SKILL.md source path **locked**: plugin-cache path, hard-fail if unresolvable, no silent fallback per OQ(M)
layers: scripts, tests, docs
red flags:
  - tokenizer parity miss (research §gaps R1) — fall back to js-tiktoken or @dqbd/tiktoken WASM; trigger ADR-035 if non-trivial
  - cross-tool schema drift — caveman upstream main SHA may have shifted since 2026-05-04 research; re-verify at T1 if cross-tool validation desired
  - Mode A vs Mode B premature flip — Mode B deferred per OQ(G); do NOT add CI integration in T1/T2/T3
  - skeleton-create-style force-fit: do NOT add a 3rd "trigger eval" axis to this harness; that's TASK-116-v2 (Sprint 055) territory
  - cross-platform shell-out: Windows Git Bash + PowerShell + Linux all valid targets per ADR-016; array-form spawn per research §gaps R4
  - external plugin dependency: caveman plugin must be installed via Claude Code marketplace OR SKILL.md content inlined; do not hard-fail at T1 if plugin missing — document operator setup
focus: ONLY runner script (T1) + measure script (T2) + sibling tests + close (T3); NOT trigger eval (Sprint 055 territory), NOT multi-skill rollout (defer per OQ(E)), NOT CI integration (Mode B; defer per OQ(G)), NOT v1 ship CHANGELOG (Sprint 056), NOT release-debt reconcile (resolved Release 2.7.0).
context-budget: ~70k tokens (T1 ~25k runner + prompts + snapshot dir · T2 ~25k measure + tokenizer parity + audit report · T3 ~20k tests + conditional ADR + close).
explicit-gaps:
  - Mode B CI integration (defer until parity confirmed + cost gate flips per Sprint 055 PC-3 reuse)
  - Multi-skill rollout (defer until caveman parity confirmed; OQ(E) start with caveman only)
  - Cross-tool reverse-validation (caveman upstream measure.py reads dev-flow snapshot) — defer; one-direction validation sufficient for v1 ship
  - Live-run measurement (operator-pending Mode A per OQ(G); harness ships as runnable contract)
  - ADR-035 mandatory at T2 (npm-dep carve-out from ADR-002 — promoted from default-skip per user-lock OQ(I)+(N) at promote)
  - Test coverage for tokenizer parity edge cases (smoke is sufficient for v1 ship)
  - npm install instructions in package.json (defer if no package.json exists; document as evals/README.md setup step)
done-confirmation:
  - scripts/eval-caveman.js exists + dry-run clean WHEN invoked from repo root
  - scripts/eval-measure.js exists + processes T1 snapshot OR fixture into markdown report
  - evals/prompts/en.txt exists (5 prompts; MIT attribution comment)
  - evals/snapshots/.gitkeep + .gitignore entry
  - evals/README.md exists (setup + how-to-run + parity-check command; ≤30 lines)
  - docs/audit/eval-caveman-2026-05-10.md exists (harness contract; mirror Sprint 055 PC-1 frozen-contract pattern)
  - scripts/__tests__/eval-caveman.test.js + eval-measure.test.js exist + pass
  - tokenizer parity verification documented (one-line node command + result match OR fallback applied)
  - cap-headroom lint clean (no SKILL.md drift)
  - ADR-035 written (mandatory at T2 per OQ(I)+(N)) — npm-dep scope carve-out from ADR-002
  - TODO.md TASK-115-v2 marked closed; Active Sprint cleared
status: PASS
```

## Execution Log

### 2026-05-10 T1 done
T1 runner skeleton + prompts + snapshot dir + dry-run validation. Recon resolved caveman SKILL.md at `~/.claude/plugins/cache/caveman/caveman/84cc3c14fa1e/skills/caveman/SKILL.md` (3585 chars). gpt-tokenizer already in `package.json` devDependencies (^3.4.0) — OQ(N) pre-satisfied; ADR-035 still mandatory T2 for scope-codification. Dry-run validated: 10 prompts × 3 arms = 30 placeholder responses; schema 1:1 with caveman upstream confirmed (metadata + prompts + arms.{__baseline__, __terse__, caveman}); snapshot correctly gitignored. **In-scope adjustment from plan AC5:** ported all 10 upstream prompts (not 5) for stronger cross-tool parity baseline; AC5 satisfied (5 was minimum). MIT attribution lines added to `evals/prompts/en.txt` + `#`-comment filter added to runner loader.

### 2026-05-10 T2 done
T2 measurer + audit report + ADR-035 + evals/README.md. `scripts/eval-measure.js` (179 lines) ports caveman upstream `measure.py` 1:1 — gpt-tokenizer o200k_base · median/mean/min/max/stdev per arm · markdown table sorted by median savings desc · warm-up row terse-vs-baseline · `--format json` alternate. Tokenizer parity smoke PASS: `"Hello, world!"` → 4 tokens (matches Python tiktoken o200k_base); `"The quick brown fox jumps over the lazy dog."` → 10 tokens (matches). End-to-end pipeline validated against T1 dry-run snapshot (placeholder-derived numbers spurious but pipeline confirmed). ADR-035 written (5 DECs: two-tier policy · operator-install model · gpt-tokenizer initial vetted dep · ADR-002 unchanged for Tier A · re-litigation lock per ADR-031). evals/README.md trimmed to 30/30 lines exact per plan AC. docs/audit/eval-caveman-2026-05-10.md frozen as harness contract per Sprint 055 PC-1 pattern.

### 2026-05-10 T3 done
T3 sibling tests + cap-headroom lint sanity. `scripts/__tests__/eval-caveman.test.js` (6 tests) covers --dry-run snapshot shape · --skill flag override (caveman-commit alternate target) · # comment line filter · CAVEMAN_SKILL_PATH env override · hard-fail on unresolvable skill (no silent fallback per OQ(M)). `scripts/__tests__/eval-measure.test.js` (8 tests) covers --snapshot required · missing-file handling · markdown shape · --format json schema · math correctness via fixture · missing-arms exit-3 · --format invalid value reject. **Result: 14/14 pass.** Cap-headroom lint sanity: 16/16 SKILL files OK · 0 WARN · 0 EXEMPT (same baseline as `b40c087`; no SKILL.md drift this sprint as planned per OQ(J)). ADR-035 written = NOT a divergence-driven new ADR (it was mandatory per user-locked OQ(I)+(N) at promote, not surfaced mid-T2); plan T3 AC4 conditional ADR clause refers to ADDITIONAL ADRs (none surfaced).

## Files Changed

| File | Task | Change |
|---|---|---|
| `scripts/eval-caveman.js` | T1 | NEW — runner; 3 arms × N prompts; plugin-cache resolve hard-fail per OQ(M); --dry-run + --prompts + --out + --model + --skill + --plugin flags; CAVEMAN_SKILL_PATH env override |
| `evals/prompts/en.txt` | T1 | NEW — 10 prompts ported verbatim from caveman upstream evals/prompts/en.txt (MIT); 2-line `#`-comment attribution header |
| `evals/snapshots/.gitkeep` | T1 | NEW — directory anchor |
| `.gitignore` | T1 | UPDATE — added `evals/snapshots/*` (except `.gitkeep`) |
| `scripts/eval-measure.js` | T2 | NEW — token counter; gpt-tokenizer o200k_base; median/mean/min/max/stdev; markdown + json formats; warm-up row terse-vs-baseline |
| `evals/README.md` | T2 | NEW — 30/30 lines exact; setup + how-to-run + tokenizer parity command |
| `docs/audit/eval-caveman-2026-05-10.md` | T2 | NEW — harness contract frozen per Sprint 055 PC-1 pattern; tokenizer parity smoke documented |
| `docs/adr/ADR-035-eval-script-npm-dep-carve-out.md` | T2 | NEW — 5 DECs; npm-dep scope carve-out from ADR-002 (Tier A scaffold stdlib-only · Tier B eval/measurement vetted-npm-OK; gpt-tokenizer initial vetted dep) |
| `scripts/__tests__/eval-caveman.test.js` | T3 | NEW — 6 sibling tests; mock-free where possible (real plugin-cache resolution); covers --dry-run, --skill override, # comment filter, env override, hard-fail no-fallback per OQ(M) |
| `scripts/__tests__/eval-measure.test.js` | T3 | NEW — 8 sibling tests; fixture-driven; covers --snapshot required, math correctness, --format json/md, exit codes (2 = bad input · 3 = bad snapshot shape) |

## Decisions

**D1 — Phase 2 G2 SKIPPED via Friction Protocol context-budget defer (Sprint Promote step).** scope-analyst + design-analyst auto-dispatch (skill rigid contract) waived because plan file already contained T1/T2/T3 acceptance + risks + DoDs + G1 anti-slip block. Estimated 20-30k token savings; sprint context-budget (~70k) preserved. Pattern candidate: plan-IS-design defer for detailed plan files. Reuses Sprint 055 D6 friction-defer pattern; no TD row (intentional + justified skip per Sprint 055 D3 precedent).

**D2 — In-scope adjustment T1: 10 prompts ported (plan AC5 said 5 minimum).** Stronger cross-tool parity baseline; matches caveman upstream `n_prompts: 10` exactly; enables direct caveman ↔ dev-flow snapshot validation either direction per OQ(C). AC5 satisfied (5 was minimum).

**D3 — gpt-tokenizer pre-existing in package.json devDependencies (^3.4.0).** Pre-recon discovery at T1; OQ(N) npm-dep introduction was already done in earlier exploratory work. Did NOT undo + redo for "purity" — accepted current state + documented in T1 commit. ADR-035 still written T2 (mandatory per OQ(I)+(N)) for scope-codification, not surgical-add.

**D4 — ADR-035 promoted from conditional (plan T3 AC4) to mandatory T2 (user-locked at promote OQ(I)+(N)).** Two-tier script policy (Tier A scaffold stdlib · Tier B eval/measurement vetted-npm-OK); operator-install model; gpt-tokenizer initial vetted dep; ADR-002 unchanged for Tier A; re-litigation lock per ADR-031. Mirrors ADR-027 generalization-clarification ADR pattern.

**D5 — Caveman SKILL.md plugin-cache hard-fail (no silent inline fallback).** Per OQ(M) user-lock. T1 implementation: glob `~/.claude/plugins/cache/<plugin>/<plugin>/<hash>/skills/<skill>/SKILL.md`; sort version dirs by mtime newest-first; CAVEMAN_SKILL_PATH env override if needed; throws operator-actionable error if unresolvable. Hard-fail tested in `eval-caveman.test.js` — exit ≠ 0 + clear stderr + no snapshot written.

**D6 — Live-run NOT executed this sprint (Mode A operator-pending preserved).** Per OQ(G). Harness ships as runnable contract; cost-gated to operator opt-in. `evals/snapshots/*` gitignored; only `.gitkeep` tracked. Re-run procedure documented in `docs/audit/eval-caveman-2026-05-10.md` § Live Run Procedure.

## Open Questions for Review

**OQ-1 (MEDIUM) — Live cross-skill measurement still pending operator opt-in.** Mode A pattern preserved per OQ(G) + D6. Harness validated end-to-end via fixtures + dry-run; no real Claude API token measurements yet for the caveman arm vs terse arm in this repo. Sprint 056 v1-ship may want a single live-run snapshot committed (or referenced via separate audit doc) as ship-evidence. Decision deferred to Sprint 056 promote.

**OQ-2 (LOW) — Multi-skill compression rollout deferred.** Per OQ(E), only `caveman` skill is target this sprint. Other skills (orchestrator · lean-doc-generator · prime · etc.) are workflow-routing not output-compression — measurement noise dominates per OQ(E) rationale. If post-v1 ship surfaces a need to measure compression on a workflow-routing skill, expand prompt set to that skill's invocation context first.

**OQ-3 (LOW) — Mode B (CI per release) gating threshold not defined.** Per OQ(G) + research §recommendation: Mode B fires when "parity confirmed AND cost gate flips". Tokenizer parity confirmed (T2 smoke). Cost gate flip = unspecified; one-time live-run cost vs CI-per-release cost not benchmarked. Sprint 056 v1-ship may benchmark + define threshold.

**OQ-4 (LOW) — Cross-tool reverse-validation deferred.** dev-flow snapshot can be read by caveman upstream `measure.py` (schema 1:1 per OQ(C) + D5); not validated this direction. Forward direction (dev-flow `eval-measure.js` reads caveman upstream snapshot) also not run. One-direction validation sufficient for v1 ship per plan G1 explicit-gaps. Sprint 056 may skip.

## Retro

### Worked
- **Recon-first compounding (4th validation; Sprint 050+051a+051b+055-2).** Recon at T1 discovered: gpt-tokenizer pre-existing in package.json (de-risked OQ(N) work · saved ~10min); plugin-cache exact path glob (`~/.claude/plugins/cache/caveman/caveman/<hash>/skills/<skill>/SKILL.md`; saved trial/error); upstream evals layout reusable verbatim (prompts file + measure.py logic 1:1 portable; saved ~30min synthesis).
- **Plan-IS-design Friction defer (D1).** Sprint plan with detailed AC + risks + DoDs let G2 dispatch waive cleanly. ~20-30k tokens saved. Not visible in code diff but visible in turn count. Pattern candidate.
- **User-locked uncertainties at promote (OQ(M) + OQ(I)+(N)).** Asked the 2 hard questions BEFORE T1 began; T1/T2 paths were unambiguous from there. No mid-sprint scope flips. Mid-sprint friction count = 0.
- **Single-task sprint with sub-task decomposition (T1/T2/T3).** Anti-drift hard-stop #3 honored without sacrificing forcing-function detail. Each sub-task got its own commit + clear AC verification.
- **Tests caught hard-fail behavior (T3).** `hard-fails when skill cannot be resolved` test confirmed OQ(M) implementation matches user-lock — no silent fallback regression possible without breaking the test.

### Friction
**0 friction events.** No Mid-Sprint Friction Protocol invocations. Pre-promote uncertainty resolution at G2-skip + 2 user-locked OQs absorbed all branch decisions before T1 began.

### Pattern candidates (3)
- **Plan-IS-design Friction defer for detailed plan files** — when plan file already contains G1 anti-slip block + per-task AC + risks + DoDs, `scope-analyst` + `design-analyst` auto-dispatch can defer with no quality loss. Validated 1× this sprint (D1). Watch for re-fire in Sprint 056 v1-ship if plan file is similarly detailed.
- **Two-tier script policy via clarification ADR** (ADR-035 / D4) — mirrors ADR-027 generalization pattern. When prior contract (ADR-002 stdlib-only) needs scoped relaxation, write clarification ADR rather than amend prior. Preserves prior ADR's audit trail; new ADR carries the carve-out rationale. Watch for 3rd instance to formalize.
- **Pre-existing-state acceptance over surgical-add** (D3) — when recon discovers a needed dep already exists from earlier exploratory work, accept + document rather than undo + redo. Saves ~5-10min cleanup churn; preserves git history clarity. Reusable when plan AC says "ADD X" and X already exists.

### Validated patterns (this sprint reused from prior sprints)
- Recon-first compounding (Sprint 050+051a+051b)
- Mid-Sprint Friction Protocol explicit-defer (Sprint 052 F5(C))
- Mode A operator-pending pattern (Sprint 055 PC-3)
- Frozen-contract audit report pattern (Sprint 055 PC-1)
- ADR default-skip → mandatory-promote at user-lock (Sprint 055 D3 inverse)
- User-locked OQs at promote (Sprint 055 + 055-2 = 2 instances; pattern locked)

### Carry-forward to Sprint 056 (v1 ship)
- Live-run cross-skill measurement (OQ-1 above) — decide at Sprint 056 promote
- Mode B CI gating threshold (OQ-3) — benchmark at Sprint 056 if scope allows
- Cross-tool reverse-validation (OQ-4) — likely SKIP for v1 ship

### Friction → TD prompt
**0 TD rows added** this sprint (zero friction; nothing to defer).

### Pattern candidates → next-sprint promotion?
- **Plan-IS-design Friction defer:** 1 instance; re-validate at Sprint 056 before codifying as protocol.
- **Two-tier script policy via clarification ADR:** 1 instance (ADR-035); pattern needs 2nd instance before codifying.
- **Pre-existing-state acceptance:** 1 instance (D3); needs 2nd instance.

No promotion this sprint.
