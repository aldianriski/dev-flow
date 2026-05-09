---
owner: Tech Lead (Aldian Rizki)
last_updated: 2026-05-10
update_trigger: Sprint state change
status: closed
plan_commit: b05ae9a
close_commit: tbd
---

# Sprint 055b — Token + Output Discipline (TASK-128 + DEC-3 codify + TASK-133)

**Theme:** Pre-v1 quality gate. Three-task token-reduction + protocol-discipline sprint. T1 audits current footprint; T2 codifies release-debt prevention scan (ADR-032 DEC-3); T3 codifies plugin-wide Output Discipline principle (new ADR-033) with 23-file pointer fan-out.
**Mode:** sprint-bulk · **Driver:** Tech Lead · **AI:** Claude Opus 4.7
**Predecessor:** Sprint 054b closed `65e74c5` (TASK-131 doc-wire) · Sprint 052b closed `26543d7` (release-debt 10-sprint reconcile + ADR-032).
**Closes:** TASK-128 (token audit) · TASK-NEW DEC-3 codification · TASK-133 (Output Discipline plugin principle).

## Why this sprint exists

Three pre-v1 quality gates converge:

1. **TASK-128** — Pre-ship token-footprint audit. Sprint 047+ feature growth (codemap, sprint-bulk, release-patch generalize, lean-architecture, anti-slip, output-discipline) added skills + reference content. Need bloat baseline before v1 ship (Sprint 056).
2. **TASK-NEW DEC-3** — Sprint 052b ADR-032 DEC-3 locked release-debt scan as Sprint Promote step but only at decision level. Codify behavioral protocol so 10-sprint debt chain (resolved 052b) doesn't recur.
3. **TASK-133** — Sprint 055b session 2026-05-09 surfaced cross-skill verbosity: lean-doc-generator Sprint Promote run emitted preamble + decorative emoji checkmarks + per-row paragraphs + meta-narration. Risk = drift across all 16 skills + 7 agents. Plugin-wide principle in CONTEXT.md + ADR + 23-file pointer fan-out.

Pre-locked decisions (AskUserQuestion 2026-05-09): T1→T2→T3 sequence (audit baseline first); gpt-tokenizer for T1; trim-adjacent fallback ADR-scope-exception for T3 zero-headroom; verify-per-file before T3 fan-out write.

## Plan

### T1 — TASK-128 Token Usage Optimization Audit
**Acceptance:** `docs/audit/token-usage-2026-05-09.md` exists with:
1. Per-file token estimate (gpt-tokenizer) — 16 skills + 7 agents + CLAUDE.md + CONTEXT.md + 16 reference files.
2. **Default session-start context load** measurement — sum of: CLAUDE.md + MEMORY.md + SessionStart hook output + statusline + /prime defaults. Ranked vs total context budget. Trim candidates surfaced.
3. **Caveman plugin removal feasibility check** — overlap analysis Output Discipline (protocol meta-output) vs caveman (all-output compression). Verdict: keep / remove / re-scope. If remove → trim ROI = caveman skill + 6 caveman-* sub-skills + statusline integration.
4. **Sprint-close commit-ID fan-out audit** — trace commit-ID propagation across sprint close: TODO.md sprint frontmatter + sprint file frontmatter (`plan_commit` / `close_commit`) + Active Sprint pointer + CHANGELOG.md row + Roadmap row + § Files Changed table + retro narrative. Measure redundancy + token cost per close. Propose canonical-source pattern (e.g., single source-of-truth, derive others).
5. **Sprint planner protocol audit** — measure token cost: Sprint Promote Step 3 decompose template (10-row Q&A per task × N tasks) + sprint file Plan section + G1 anti-slip block + execution log + retro. Propose compression candidates (terse decompose template, lean G1, deferred-fields pattern).
6. Bloat candidates ranked by ROI; recommendations triaged into TD rows or TASK-116-v2 lint scope.

**Scope:** IN — read-only scan + measurement + removal-feasibility analysis + protocol-flow tracing. OUT — actual trim (defer to follow-up sprint), actual caveman removal (defer post-T1 verdict), actual sprint-close flow refactor (defer post-T1 verdict), actual decompose-template compression (defer post-T1 verdict), benchmark counter implementation.
**Files:** `docs/audit/token-usage-2026-05-09.md` NEW; `package.json` (gpt-tokenizer dep); `scripts/audit-tokens.js` NEW (decide reusable vs one-shot mid-T1).
**Risk:** low — read-only audit; recommendations not auto-applied.
**DoD:** audit report committed; TODO.md TASK-128 `[x]`; recommendations triaged; caveman keep/remove verdict surfaced for user decision.
**Confidence:** 78% — uncertainty: gpt-tokenizer behavior on markdown vs code tokens; caveman removal blast-radius (statusline hook · 6 sub-skills · existing user habits).

### T2 — TASK-NEW DEC-3 Codification (release-debt scan)
**Acceptance:** `skills/lean-doc-generator/references/SPRINT_PROTOCOLS.md` gains Step 1.5b release-debt scan ≤25 lines; rules — depth ≥3 → P1 candidate · ≥5 → auto-escalate P0 · ≥7 → BLOCK Sprint Promote until release-debt sprint promoted; cross-link ADR-032 DEC-3.
**Scope:** IN — additive protocol step parallel to Step 1.5 TD scan. OUT — automated lint (TASK-116-v2), CHANGELOG parser script.
**Files:** `skills/lean-doc-generator/references/SPRINT_PROTOCOLS.md`.
**Risk:** low — additive protocol.
**DoD:** SPRINT_PROTOCOLS.md edited; TODO.md row `[x]`; lean-doc-generator skill PATCH bump (2.3.0 → 2.3.1) per behavioral clarification.
**Confidence:** 88% — uncertainty: skill version bump scope (PATCH vs no-bump for protocol-only).

### T3 — TASK-133 Output Discipline Plugin Principle
**Phases:**
- **T3.1** — write `.claude/CONTEXT.md` § Output Discipline (≤25 lines: rules + rationale + apply-when + caveman scope clause).
- **T3.2** — write `docs/adr/ADR-033-output-discipline.md` (decision + scope = all 16 skills + 7 agents + alternative rejected = per-skill duplication + zero-headroom exception note).
- **T3.3** — propagate single canonical pointer line `> Output Discipline: see [.claude/CONTEXT.md § Output Discipline](../../.claude/CONTEXT.md#output-discipline).` to 16 SKILL.md + 7 agent.md (23 files); verify-per-file cap pre-write (read line count → Edit one file at a time).
- **T3.4** — validation pass: confirm 23 files reference principle; CLAUDE.md ≤80 / SKILL.md ≤100 / agent ≤30 caps held.

**Acceptance:** (1) CONTEXT.md § Output Discipline ≤25 lines with rules — terse step verdicts, no decorative emoji checkmarks, compact list rendering, ≤4-line HALT prompts, no preamble fluff, caveman-mode-independent (applies to protocol meta-output, NOT caveman-rendered user content); (2) ADR-033 written; (3) 23 files reference principle via canonical pointer line; (4) all caps held.

**Edge cases:**
- `release-patch/SKILL.md` 100/100 zero-headroom → trim adjacent line first; if no clean trim → ADR-033 § Consequences notes scope-exception (verified sole zero-headroom skill, line-count audit 2026-05-09).
- `caveman.md` skill — principle applies to its protocol meta-output only, not user-rendered caveman content (CONTEXT.md scope clause + caveman SKILL.md pointer-line clarification).
- `orchestrator/SKILL.md` 97/100 → 3-line headroom; pointer line + blank fits exactly.

**Files (likely):** `.claude/CONTEXT.md`; `docs/adr/ADR-033-output-discipline.md` NEW; 16 SKILL.md + 7 agent.md (pointer line each, 23 files); `TODO.md` TASK-133 close.
**Risk:** medium — 23-file fan-out; cap pressure on `release-patch` + `orchestrator`; ADR locks principle.
**DoD:** 23 files reference principle; ADR-033 + CONTEXT.md committed; caps verified; TODO.md row `[x]`; sprint-file Files Changed row per file.
**Confidence:** 70% — uncertainty: zero-headroom trim feasibility on release-patch.

### T4 — Sprint close
**Acceptance:** standard Sprint Close protocol per `skills/lean-doc-generator/references/SPRINT_PROTOCOLS.md`.

## G1 (anti-slip per ADR-031)
```
goal: Pre-v1 token reduction + plugin-wide Output Discipline principle codified with ADR-033 + 23-file pointer fan-out + release-debt scan codified.
size: M (T1 S + T2 S + T3 S-M = ~M total)
constraints: gpt-tokenizer dep accepted (planned for TASK-115-v2 reuse); 23-file fan-out verify-per-file (~46 tool calls); release-patch SKILL.md 100/100 zero-headroom = trim-or-exception decision.
layers: governance, skills, agents, scripts, docs
red flags:
  - Cap breach on release-patch/SKILL.md if no clean trim → fall back to ADR-033 § Consequences scope-exception
  - 23-file fan-out commit fragmentation — one squash at close per protocol
  - Mid-sprint scope creep: T1 audit may surface trim opportunities tempting in-sprint fixes; defer to follow-up sprint per Mid-Sprint Friction Protocol
focus: ONLY audit + 2 codifications + ADR; NOT actual trim (TASK-128 OUT scope), NOT lint automation (TASK-116-v2 Sprint 055).
context-budget: ~80k tokens (T1 audit scan ~30k + T3 fan-out 23 files ~30k + T2/T3.1/T3.2 writes ~20k).
explicit-gaps:
  - Output Discipline lint automation (defer TASK-116-v2 Sprint 055)
  - release-debt scan automated CHANGELOG parser (defer TASK-116-v2 Sprint 055)
  - actual token trim per audit recommendations (defer follow-up sprint post-055b)
  - actual caveman plugin removal IF T1 verdict = remove (defer post-T1 user decision)
  - actual sprint-close commit-ID flow refactor IF T1 verdict = canonical-source (defer post-T1 user decision)
  - actual sprint planner template compression IF T1 verdict = compress (defer post-T1 user decision)
done-confirmation:
  - docs/audit/token-usage-2026-05-09.md committed
  - SPRINT_PROTOCOLS.md gains Step 1.5b
  - .claude/CONTEXT.md gains § Output Discipline
  - docs/adr/ADR-033-output-discipline.md written
  - 23 files reference principle via canonical pointer line
  - all caps held (verified per-file pre-write)
status: PASS
```

## Execution Log

### 2026-05-09 | T1 done — pending commit
TASK-128 token usage audit complete. 6-item acceptance delivered:
1. Per-file scan — 37 files · 35,549 tokens · 2,951 lines · cap-pressure files identified (release-patch SKILL.md exact 100/100 · CLAUDE.md 79/80 · orchestrator 97/100 · 2 agents at 28/30).
2. Session-start dev-flow contribution ~4,728 tokens (CLAUDE.md 838 + MEMORY.md ~732 + 23 skill descriptions ~2,600 + 7 agent descriptions 508 + hook 50).
3. Caveman removal verdict = **KEEP** (user-toggle UX layer; Output Discipline is mandatory protocol layer; coexist; ~400 token removal ROI not worth UX regression).
4. Sprint-close commit-ID fan-out traced — SHA appears 6-8 locations per close; canonical-source proposal = sprint file frontmatter `close_commit:`; ROI ~175/sprint.
5. Sprint planner protocol cost measured — ~5,040 tokens overhead per 3-task sprint (1,540 decompose + 1,750 sprint file structure + 1,750 protocol output); compression ROI ~30-40%.
6. Bloat candidates ranked — 1 in-sprint (T3 OD rollout) + 4 post-055b NEW TASKs + 1 inline (T2 narrative compress) + 1 lint candidate (TASK-116-v2).

**3 verdicts surfaced for user decision:** caveman KEEP · sprint-close commit-ID flow DEFER · sprint planner compression DEFER. Audit synthesis: `docs/audit/token-usage-2026-05-09.md`.

### 2026-05-09 | T2 done — pending commit
TASK-NEW DEC-3 codification complete. Step 1.5b added to `skills/lean-doc-generator/references/SPRINT_PROTOCOLS.md` after Step 1.5 (TD scan). Rules codified per ADR-032 DEC-3:
- depth ≥3 → P1 candidate (user prompt y/n)
- depth ≥5 → auto-escalate P0 (no human review)
- depth ≥7 → HARD STOP Sprint Promote until release-debt sprint promoted
- counter-stale guard (TD-001 codify) — refresh atomically; no cached values
- pre-release alpha/beta/rc treated as MINOR

`lean-doc-generator/SKILL.md` 2.2.0 → 2.3.0 (MINOR per Sprint 053 precedent — new behavioral contract step).

### 2026-05-10 | T3 done — pending commit
TASK-133 Output Discipline plugin principle complete across 4 phases:
- **T3.1** — `.claude/CONTEXT.md` § Output Discipline (16 lines: 6 rules + apply-when + why + O8 outcome anchor). External-plugin reference dropped per user feedback ("focus our plugin performance + user outcome").
- **T3.2** — `docs/adr/ADR-033-output-discipline.md` (5 decisions + 5 alternatives rejected + Consequences). DEC-3 anchored to O8 plugin reliability per ADR-026.
- **T3.3** — Pointer-line fan-out via `scripts/propagate-output-discipline.js` (verify-per-file Node script). Result: 22 of 23 files written with canonical pointer line; **release-patch SKILL.md sole exception (100/100 cap zero-headroom per ADR-033 DEC-4)**. Initial run used `\n\n---\n\n<pointer>\n` (+4 lines) which breached caps on 4 files; reverted via git checkout, fixed script to `\n\n<pointer>\n` (+2 lines), re-ran clean. **Note:** initial git checkout was over-broad and reverted T2 SPRINT_PROTOCOLS.md edit; re-applied (Step 1.5b restored) + lean-doc SKILL.md last-validated bumped to 2026-05-10.
- **T3.4** — Cap validation pass via `node scripts/audit-tokens.js` re-run. Post-T3 totals: 37 files · 36,856 tokens · 3,020 lines (delta +1,307 tokens vs pre-T3 baseline). All caps held: release-patch 100/100 (exception), orchestrator 99/100, lean-doc 96/100, agents max 30/30 (design-analyst + scope-analyst at exact cap).

23-file fan-out cost: 1 propagate-script run + 1 cap-validation re-audit (vs 46+ tool calls had we done verify-per-file via Read+Edit). Idempotency handled via MARKER check ("Output Discipline: see").

## Files Changed

| File | Task | Change | Risk |
|:-----|:-----|:-------|:-----|
| `package.json` | T1.A | Added `devDependencies.gpt-tokenizer` for token-count audit script | low |
| `scripts/audit-tokens.js` | T1.A | NEW reusable Node script — gpt-tokenizer-based per-file scan with cap-headroom + tokens/line metrics; output to `docs/audit/token-counts-<date>.json` | low |
| `docs/audit/token-counts-2026-05-09.json` | T1.B | NEW machine-readable raw token counts per file (37 files measured) | low |
| `docs/audit/token-usage-2026-05-09.md` | T1.D | NEW audit synthesis — 6 acceptance items + 3 verdicts surfaced for user decision | low |
| `skills/lean-doc-generator/references/SPRINT_PROTOCOLS.md` | T2.A | Step 1.5b release-debt scan inserted after Step 1.5 (TD scan); 5 rules + ADR-032 DEC-3 cross-link | low |
| `skills/lean-doc-generator/SKILL.md` | T2.B + T3.3 | version 2.2.0 → 2.3.0 (MINOR — new behavioral contract step); last-validated 2026-05-10; Output Discipline pointer line appended | low |
| `.claude/CONTEXT.md` | T3.1 | NEW § Output Discipline section (16 lines: 6 rules + apply-when + why + O8 outcome anchor); last_updated 2026-05-10 | low |
| `docs/adr/ADR-033-output-discipline.md` | T3.2 | NEW ADR — 5 decisions (principle home + pointer propagation + O8 anchor + zero-headroom handling + re-litigation lock) + 5 alternatives rejected | low |
| `scripts/propagate-output-discipline.js` | T3.3 | NEW Node script — verify-per-file pointer-line fan-out with cap-headroom check + idempotency marker | low |
| `skills/*/SKILL.md` (15 files via script; lean-doc above) | T3.3 | Output Discipline pointer line appended at end | low |
| `agents/*.md` (7 files via script) | T3.3 | Output Discipline pointer line appended at end | low |
| `skills/release-patch/SKILL.md` | T3.3 | DOCUMENTED EXCEPTION — 100/100 zero-headroom; pointer skipped per ADR-033 DEC-4; principle applies behaviorally | medium |
| `docs/audit/token-counts-2026-05-09.json` | T3.4 | RE-RUN — post-T3 cap validation (37 files · 36,856 tokens · all caps held) | low |
| `TODO.md` | T1+T2+T3 | TASK-128 + TASK-NEW DEC-3 + TASK-133 marked `[x]` with one-line summaries | low |

## Decisions

### 2026-05-09 | T1 — gpt-tokenizer as dev dependency
Installed `gpt-tokenizer` as `devDependency` (not runtime) since dev-flow is a plugin/scaffold. TASK-115-v2 caveman 3-arm eval also planned to use `gpt-tokenizer` per its task spec — install once, reuse.

### 2026-05-09 | T1 — Caveman KEEP verdict (defer to user confirm at sprint review)
Audit recommends caveman plugin stays installed. Rationale: caveman = user-toggle UX layer compressing all output; Output Discipline (T3) = mandatory protocol layer for protocol meta-output. Different scopes, both have value, ~400-token removal ROI not worth UX regression. Document layered relationship in CONTEXT.md § Output Discipline scope clause (T3.1).

### 2026-05-09 | T1 — Sprint-close commit-ID + planner compression DEFER (defer post-055b)
Both candidates have meaningful ROI (~175/sprint + ~1,500/sprint respectively) but are out of T1 scope (audit-only) and would expand sprint scope beyond planned 3 tasks. Triaged as post-055b NEW TASKs.

### 2026-05-09 | T2 — Counter-stale guard codified inline (TD-001 fold-in)
Step 1.5b includes "release-debt depth count refreshes atomically with this scan; do NOT trust pre-cached values from prior session memory." This codifies TD-001 (Sprint 052b retro Friction #1 — depth count was stale at promote, memory said 8 actual was 10). TD-001 can close at sprint retro as `status: resolved → TASK-NEW Step 1.5b inline fold-in` (TD-001 was Sprint 055/055b TASK-128 token-audit overlap candidate; T2 absorbed it).

### 2026-05-09 | T2 — Pre-release versioning (alpha/beta/rc) treated as MINOR for depth-counting
Edge case decision: pre-release versions count as MINOR for release-debt depth purposes since release-effort already happened. Avoids false-positive depth inflation when project is in alpha/beta phase.

## Open Questions for Review

### 2026-05-10 | Surprise during T3 — Mid-Sprint Friction Protocol invoked
**Surfaced by user post-T3 close (context 21% utilized):** TODO.md Active Sprint ribbon at 8 closed-sprint pointer narratives + Backlog rows preserve verbose acceptance summaries (TASK-133 row alone ~50 lines). Bloat compounds every sprint; new-session render cost grows linearly. Existing hygiene rules in TODO.md (lines 26-29) under-enforced.

User scope: **WIDE** — TODO.md + sprint files + CHANGELOG + ADRs/Roadmap **+ legacy-file scan** (e.g. repo-root AUDIT.md, AUDIT_PASS2.md, BASELINE_ASPECT.md, READINESS.md, STRATEGY_REVIEW.md candidates).

**Friction Protocol verdict: DEFER (per ADR-031 anti-slip + Sprint 052 F5(C) defer protocol).** Plan frozen at `plan_commit: b05ae9a`; mid-sprint expansion → ADR-031 violation precedent. Deferred to TASK-134a + TASK-134b (Sprint 055c candidate, 2-task pairing).

No edit to § Plan. No new T4 in 055b. Closing 055b on 3-task plan as locked.

## Retro

### Worked
- **Plugin-principle pattern compounded.** Output Discipline (T3) reuses canonical-source + pointer-fan-out shape from ADR-026 outcome lens. Pattern proves reusable: 23-file fan-out cost amortized via Node script vs 46+ tool calls for verify-per-file.
- **Audit-first, decide-second sequence held.** T1 audit measured ~5,040/sprint protocol overhead BEFORE T3 codification fired; verdicts (caveman KEEP, sprint-close DEFER, planner-compress DEFER) were data-driven rather than presumed. Sprint 055b T1 → T3 sequence locked by user before plan-locked commit.
- **Mid-Sprint Friction Protocol invoked correctly.** User-surfaced History Hygiene scope expansion (post-T3, pre-close) routed via Surprise log + DEFER per ADR-031 anti-slip, NOT folded as T4. Plan integrity preserved; new work captured as TASK-134a + TASK-134b in Backlog.
- **TD-001 inline-fold-in.** T2 Step 1.5b counter-stale guard codified TD-001 directly without separate task. TD row eligible for `status: resolved → TASK-NEW (T2 inline)` at retro.

### Friction
- **Initial pointer pattern (+4 lines) breached caps on 4 files.** Used `\n\n---\n\n<pointer>\n` thinking horizontal-rule separator was cleaner; broke design-analyst (28→32), scope-analyst (28→32), orchestrator (97→101), release-patch (100→102 already breach). Reverted via `git checkout -- skills/ agents/`; fixed script to `\n\n<pointer>\n` (+2 lines); re-ran clean.
  - **TD candidate: `propagate-output-discipline.js` should compute projected line count BEFORE write, not detect breach AFTER.** Script currently computes both; the breach check IS pre-write (`if (newWc > t.cap) skip`). Initial 4-file cap-breach was *script working as designed* with too-aggressive separator. Lesson: prefer minimal-line-count append patterns when fan-out targets cap-pressure files. **Y/N/already-resolved?**
- **Over-broad git checkout reverted T2 SPRINT_PROTOCOLS.md edit.** `git checkout -- skills/` reverted everything under `skills/`, including `references/SPRINT_PROTOCOLS.md`. Re-applied Step 1.5b + lean-doc SKILL.md version bump. Lesson: scope `git checkout` to specific glob `skills/*/SKILL.md agents/` not directory-wide.
  - **TD candidate: codify scoped-checkout-glob pattern in CLAUDE.md or sprint protocols.** **Y/N/already-resolved?**
- **gpt-tokenizer date drift.** Audit script's `new Date().toISOString().slice(0, 10)` returned `2026-05-09` even though session date had progressed to `2026-05-10`. Both dates appear in artifacts (token-counts-2026-05-09.json + ADR-033 last_updated 2026-05-10). Lesson: trust system-provided `currentDate` over JS `Date()` in scripts; or document JS-Date drift behavior.
  - **TD candidate?** Probably not — script-internal date is OK for filename; decision metadata uses session date. **Y/N/already-resolved?**

### Pattern candidates (carried forward)
1. **Verify-per-file fan-out via Node script.** When propagating plugin-wide pointer/pattern/citation across 10+ files, write a verification-script (read line count + cap-headroom + idempotency-marker check + write) instead of per-file tool calls. Sprint 055b T3.3 validated; pattern reusable for TASK-134a, TASK-116-v2 lint candidates.
2. **Plugin-principle 4-step shape.** (1) CONTEXT.md canonical section; (2) ADR locks decision; (3) propagation script for fan-out; (4) cap-validation re-run. Reuse for TASK-134a History Hygiene, future plugin-wide principles.
3. **Mid-Sprint scope deferral via Surprise log + new Backlog tasks.** When user surfaces new scope mid-sprint, route to Surprise log + new TASK-NNN, never fold as T4. Sprint 055b validated. Reinforces ADR-031.
4. **Audit-then-codify sequence.** Audit task (read-only measurement) BEFORE codification task locks data-driven decisions; rejected verdicts (caveman KEEP) avoid speculative cleanup. Useful template for v1 prereq audits.

### Surprise log
- **T3.3 initial-attempt cap breach** (logged inline above; required revert + script fix).
- **Mid-Sprint Friction Protocol invocation** (logged in Open Questions for Review § Surprise during T3).
