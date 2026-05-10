---
owner: Tech Lead (Aldian Rizki)
last_updated: 2026-05-10
update_trigger: Sprint state change
status: planning
plan_commit: tbd
close_commit: tbd
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

(empty — populated during T1/T2/T3 execution per Sprint Execute Protocol)

## Files Changed

(empty — populated per file touched per Sprint Execute Protocol step 4)

## Decisions

(empty — populated when architectural-level decisions surface per Sprint Execute Protocol step 2)

## Open Questions for Review

(empty — populated for user-pause surfacing per Sprint Execute Protocol step 7)

## Retro

(empty — populated at Sprint Close per protocol step 4)
