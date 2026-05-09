---
owner: Tech Lead (Aldian Rizki)
last_updated: 2026-05-09
update_trigger: Sprint state change
status: active
plan_commit: tbd
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

(empty until T1 starts)

## Files Changed

| File | Task | Change | Risk |
|:-----|:-----|:-------|:-----|
| (empty until T1 starts) | | | |

## Decisions

(empty until T1 starts; ADR-033 logs at T3.2)

## Open Questions for Review

(empty)

## Retro

(empty until close)
