---
owner: Tech Lead (Aldian Rizki)
last_updated: 2026-05-10
update_trigger: ADR status change
status: decided
sprint: 055c
---

# ADR-034: History Hygiene as Plugin-Wide Principle — `.claude/CONTEXT.md` canonical source + per-surface pruning rules

**Date**: 2026-05-10
**Status**: Accepted
**Deciders**: Tech Lead (Aldian Rizki)

## Context

Sprint 055b session 2026-05-10 T3 close surfaced compounding doc-history bloat across multiple surfaces. TODO.md Active Sprint ribbon held 8 closed-sprint narrative pointers (lines 40-77 in pre-trim state); closed P0 task rows accumulated verbose AC summaries (TASK-133 row alone ≈50 lines including phases/decisions); sprint files retro sub-sections drifted past readable cap; CHANGELOG entries varied in size with no per-row contract; Roadmap done-clusters spanned multi-line repetitions for already-done EPIC blocks. Existing TODO.md L26-29 inline hygiene rules (closed sub-block collapse after 1-sprint cooldown · >2-sprint old DELETE) covered ONLY backlog sub-blocks — partial coverage; other surfaces had no codified rule.

**Symptoms (recon-first 2026-05-10):**

- TODO.md Active Sprint ribbon = 8 closed-sprint narrative pointers (Sprints 048-055b); each ~10-30 lines; ≈200 lines combined; renders into every new session.
- 15 closed P0 task rows in TODO.md with verbose AC content (TASK-119 through TASK-133 cluster); estimated ≈600 lines combined; aged 3-6 sprints; no collapse trigger fired.
- Sprint 055b retro sub-sections (Worked/Friction/Pattern) = 8/9/7 bullets respectively (above proposed ≤6 cap).
- CHANGELOG entries varied 8-30 lines; no per-row cap; deeper detail duplicated between CHANGELOG row + sprint file.
- Roadmap (TODO.md) had done-cluster blocks for Sprints 28-29, 35-37 spanning multiple lines for completed EPIC work; collapse-to-1-line opportunity unrealized.
- Per-surface inline rules would drift faster (5 places to update, 5 places to forget); mirrors Output Discipline (ADR-033) plugin-wide drift surface that Sprint 055b just codified.
- v1 ship (Sprint 056) inherits this bloat baseline if not pruned pre-ship.

User explicit lock at Sprint 055c promote 2026-05-10 (Pick A confirmed): paired sprint with TASK-134b legacy-doc scan; ADR required (hard-to-reverse once principle propagates); WIDE scope (TODO.md + sprint files + CHANGELOG + ADRs/Roadmap).

## Scope (Sprint 059 T4 / ADR-037 user-vs-internal clarification)

**Rules in this ADR apply to dev-flow's internal sprint artifacts ONLY.** Specifically:

- `TODO.md` (Active Sprint ribbon · Backlog rows · Tech Debt · Roadmap) at the dev-flow plugin repo root
- `docs/sprint/SPRINT-NNN-*.md` files in the dev-flow plugin repo
- `docs/CHANGELOG.md` in the dev-flow plugin repo
- ADR registry (`docs/adr/`) in the dev-flow plugin repo

**Adopter projects MAY adopt the principle** by copying this ADR + the per-surface rules into their own repo's `docs/adr/` and applying matching pruning conventions to their own TODO/sprint/CHANGELOG. The dev-flow plugin **does NOT enforce** these rules on adopter project artifacts:

- The plugin's `lean-doc-generator` Sprint Promote / Sprint Close protocols apply hygiene to whatever the adopter has marked as their sprint artifacts (per their `.claude/CONTEXT.md` § History Hygiene if they've copied this principle).
- The plugin does NOT scan adopter TODO.md / sprint files for collapse-eligibility on its own initiative.
- Adopter opt-in is intentional — different teams have different cadence + history-preservation preferences.

**Cross-reference (Sprint 059 T3):** `scripts/codemap-refresh.ps1` similarly applies adopter-scope by default + `--Internal` flag for plugin self-audit (per ADR-037). Both ADR-034 (this) and ADR-037 (codemap user-scope) ship in v4.0.0 lockstep clarifying user-vs-internal applicability across the plugin.

## Decision

**DEC-1: History Hygiene = plugin-wide principle in `.claude/CONTEXT.md` § History Hygiene.** Single canonical source. Lives alongside Gates / Modes / Output Discipline as cross-cutting principle. Five per-surface rules + apply-when + rationale. ≤25 lines. Read by all agents + skills per existing `Context first` principle (CONTEXT.md line 38). Mirrors Output Discipline (ADR-033) plugin-principle pattern shape — same canonical-CONTEXT-section structure.

**DEC-2: Five surfaces locked with per-surface pruning rules.** (1) TODO.md Active Sprint ribbon: ≤3 most-recent closed-sprint narrative pointers; older → archive narrative to CHANGELOG row. (2) TODO.md closed task rows (P0/P1): verbose AC summaries collapse to 1-line pointer (`closed Sprint NNN <sha> — <one-line summary>`) after 1-sprint cooldown. (3) Sprint files retro: Worked / Friction / Pattern sub-sections capped at ≤6 bullets each; older surprise-log entries archive at close. (4) CHANGELOG.md: per-sprint row cap ~12 lines headline + 6 bullets max; deeper detail lives in sprint file. (5) Roadmap (TODO.md): done-cluster blocks (≥5 consecutive done sprints in same EPIC/theme) collapse to 1-line summary pointing to CHANGELOG range. Surface count + thresholds locked here; future tuning requires new ADR (DEC-5).

**DEC-3: Apply-when triggers = Sprint Close (lean-doc) AND Sprint Promote Step 1.5c (NEW).** Sprint Close fires forward hygiene (write-time enforcement on outgoing sprint artifacts). Sprint Promote Step 1.5c fires backward hygiene (pre-plan-write eligibility sweep — verify prior surfaces still pass thresholds before adding new sprint content). Two-trigger pattern ensures principle is enforced at BOTH ends of sprint lifecycle; missing either end → drift surface re-opens. Step 1.5c is NEW; insertion into `lean-doc-generator/references/SPRINT_PROTOCOLS.md § Sprint Promote` is in Sprint 055c T2 scope (acceptance criteria Phase 4 cross-ref check covers this).

**DEC-4: Collapse-vs-delete-vs-archive policy.** Three actions, distinct triggers: (a) **collapse** — closed task row >1 sprint old → reduce to 1-line pointer preserving Sprint+SHA+summary linkage (existing TODO.md L27 precedent superseded into ADR scope). (b) **archive** — Active Sprint ribbon narrative >3 closed sprints back → rotate full narrative to CHANGELOG row (preserves audit trail; CHANGELOG IS the long-form history). (c) **delete** — closed sub-block OR individual closed task row >2 sprints old in TODO.md backlog → remove entirely (history lives in CHANGELOG + sprint file + git log; backlog is for OPEN work). Three-action discipline avoids confusion between preserve-linkage vs preserve-narrative vs hard-prune; surfaces map to actions deterministically per DEC-2 rule set.

**DEC-5: Re-litigation lock per ADR-031 anti-slip.** Per-sprint exception requests for any surface threshold (e.g. "let's keep ribbon at 5 this sprint because…") = HARD STOP per ADR-031 lock 5 (focus discipline). Threshold tuning (≤3→≤5 ribbon depth, ≤6→≤10 retro bullets, etc.) requires new sprint promote + new ADR. Apply-when triggers (DEC-3) are non-negotiable canonical form. Future re-evaluation cadence: post-v1 ship (Sprint 056) review DEC-2 thresholds against actual 6-month sprint cadence; DEC-1 + DEC-3 + DEC-5 locked indefinitely.

## Alternatives considered

1. **Per-surface duplication of hygiene rules in each file header.** Rejected. TODO.md preamble (L26-29) already has partial inline rules; sprint file template would need its own; CHANGELOG would need its own; Roadmap would need its own. 5 update points; rule drift across files near-certain over time. Contradicts ADR-026 single-source-of-truth principle and mirrors exact failure mode that ADR-033 Output Discipline solved 1 sprint prior.

2. **Inline rules in each affected SKILL.md (lean-doc-generator + others).** Rejected. SKILL.md ≤100 line cap pressure (per Sprint 055b T1 token audit); inline rule blocks would force structural rewrites or cap raises. Pointer-line pattern (CONTEXT.md → SKILL.md ref) is the established pattern post-ADR-033; reuse beats new pattern shape (per Sprint 055c plan red flag).

3. **Behavioral-only via memory `feedback_history_hygiene.md`.** Rejected. Memory entries decay across sessions; not durable like ADR + CONTEXT.md. Sprint 052b release-debt recurrence (10-sprint chain) and Sprint 055b Output Discipline drift both demonstrated behavioral-only enforcement insufficient for cross-session contracts. Same risk class. ADR + CONTEXT.md pair = durable enforcement substrate.

4. **Defer codification to post-v1 (post-Sprint-056).** Rejected. v1 ship Sprint 056 inherits whatever bloat baseline TODO.md + CHANGELOG + sprint files carry at ship time. Pre-v1 codification = cheap window (current sprint cycle); post-v1 = breaking baseline + adopter-facing artifacts harder to retroactively prune (other repos may have copied via init scaffold). Pre-v1 is the correct codification window; same logic that drove ADR-033 timing.

5. **Automated lint instead of principle (skip ADR, write lint directly into TASK-116-v2 acceptance harness).** Rejected. Lint enforces; principle DEFINES what to enforce. Without DEC-2 surface rules locked, TASK-116-v2 lint has no contract to check. Behavioral-first principle (ADR-034) → lint automation (TASK-116-v2 follow-up) = correct ordering. Same precedence used for Output Discipline (ADR-033 first, lint deferred to TASK-116-v2).

## Consequences

**Positive:**
- TODO.md Active Sprint ribbon stays bounded (≤3 narratives) → new-session render cost bounded; ~200 lines saved per sprint cadence.
- v1 ship (Sprint 056) baseline = clean (not inherited 8-narrative + 15-verbose-row state); adopter init scaffold copies clean baseline.
- Single canonical update point for hygiene rules; reviewer hunt eliminated; cross-surface consistency guaranteed.
- Pointer-line pattern reusable from ADR-033 (both ADRs target plugin-wide drift; same pattern shape = predictable for future principles per Sprint 055b T1 audit Bloat Rank #2-#4 candidates).
- Two-trigger apply-when (Sprint Close + Sprint Promote 1.5c) closes drift loop bidirectionally — Output Discipline (ADR-033) one-end-only enforcement learned forward.

**Negative (trade-offs accepted):**
- Apply-time cost at every Sprint Close + Promote (~10 min hygiene sweep per cycle); ~20 min per sprint added overhead.
- Cross-ref breakage risk during T2 bulk apply (15 closed-row collapses + ribbon trim) — mitigated via grep verify before commit (Sprint 055c T2 acceptance criteria item 6).
- Older closed-task verbose AC details archived to git history only (not browseable in TODO.md after collapse) — accepted; `git show <sha>` retrieves on demand; CHANGELOG row preserves headline.
- DEC-3 Step 1.5c insertion in lean-doc-generator/references/SPRINT_PROTOCOLS.md = NEW protocol step; minor SKILL.md churn risk (acceptance harness may need to re-validate post-T2).

**Neutral:**
- ADR-034 file at `docs/adr/ADR-034-history-hygiene.md` per locked convention (Sprint 043 DEC-7 + Sprint 047 DEC-6). ID verified non-colliding (max ADR was 033 post-Sprint-055b).
- Existing TODO.md L26-29 inline backlog hygiene rules PRESERVED as concrete instances of broader principle; ADR-034 supersets and codifies plugin-wide. No removal needed; coexist as scoped instance + plugin-wide principle.
- Sprint 055c T1 (this codification) + T2 (apply rules to existing surfaces) + T3+T4 (TASK-134b legacy-doc scan, paired sprint) implement the principle end-to-end — codify + apply + test against real artifacts in same cycle.
- Caveman-mode behavior independent — History Hygiene targets persistent doc artifacts regardless of any active output-compression mode the user has configured externally.

## References

- ISSUE origin: Sprint 055b session 2026-05-10 T3 close surfaced compounding doc-history bloat across 5 surfaces; Mid-Sprint Friction Protocol DEFER → TASK-134a + TASK-134b paired (Sprint 055c).
- ADR-019 — CONTEXT.md frontmatter + cap absence (justifies CONTEXT.md as canonical home).
- ADR-026 — User-Project Outcome lens (O2 doc-rot prevention + O8 plugin reliability anchors).
- ADR-031 — anti-slip discipline at G1 (DEC-5 re-litigation lock derives from lock 5 focus discipline).
- ADR-033 — Output Discipline (pattern source for plugin-wide principle CONTEXT.md + pointer-line propagation; same shape reused).
- TASK-134a (Sprint 055c) — this codification + apply scope.
- TASK-134b (Sprint 055c paired) — legacy-doc scan applying broader hygiene principle to repo-root deprecated artifacts.
- TASK-116-v2 (Sprint 055) — acceptance harness; lint automation for History Hygiene pattern adherence (deferred per Sprint 055c plan OUT scope).
- Memory: `feedback_plugin_principle_pattern.md` (cross-skill drift fix pattern source — same as ADR-033).
- Re-evaluation cadence: post-v1 ship (Sprint 056) — DEC-2 per-surface thresholds eligible for re-tune if sprint cadence changes; DEC-1 + DEC-3 + DEC-5 locked indefinitely (re-litigation lock).
