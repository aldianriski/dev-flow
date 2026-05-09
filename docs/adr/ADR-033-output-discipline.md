---
owner: Tech Lead (Aldian Rizki)
last_updated: 2026-05-10
update_trigger: ADR status change
status: decided
sprint: 055b
---

# ADR-033: Output Discipline as Plugin-Wide Principle — `.claude/CONTEXT.md` canonical source + 23-file pointer propagation

**Date**: 2026-05-10
**Status**: Accepted
**Deciders**: Tech Lead (Aldian Rizki)

## Context

Sprint 055b session 2026-05-09 surfaced cross-skill protocol-output verbosity. `/lean-doc-generator` Sprint Promote run emitted preamble fluff ("I have data needed", "Let me emit the report"), decorative emoji checkmarks (✅/❌), per-row paragraph rendering of backlog/TD lists, and meta-narration ("I'll wait for your pick before running Step 3"). Verdict: pattern repeats across `/orchestrator`, `/task-decomposer`, `/prime`, and other skill protocol output — same drift surface, same root cause (no canonical guard).

**Symptoms (recon-first 2026-05-09):**

- TASK-128 token-audit T1 measured per-sprint protocol-output overhead at ~1,750 tokens (out of ~5,040/sprint total protocol cost). Decorative narration is the majority slice.
- 16 skills + 7 agents have no shared style contract for protocol output. Each skill's verbosity drifts independently.
- Per-skill rules would drift faster (16 places to update, 16 places to forget).
- Output Discipline conflicts with neither code/commits/security normal-mode writing nor user-facing prose; scope is *protocol meta-output only*.

User explicit lock at Sprint 055b promote 2026-05-09 (3 questions answered): (1) principle home = `.claude/CONTEXT.md` § Output Discipline; (2) sprint placement = Sprint 055b paired with TASK-128 + TASK-NEW DEC-3 codify; (3) ADR required (hard-to-reverse once 23+ files reference).

## Decision

**DEC-1: Output Discipline = plugin-wide principle in `.claude/CONTEXT.md` § Output Discipline.** Single canonical source. Lives alongside Gates / Modes / Skill Authoring Standards as cross-cutting principle. Six rules + apply-when + rationale. ≤25 lines. Read by all agents + skills per existing `Context first` principle (CONTEXT.md line 38).

**DEC-2: Pointer-line propagation, not per-file rule duplication.** All 16 skills + 7 agents reference the principle via single canonical pointer line: `> Output Discipline: see [`.claude/CONTEXT.md` § Output Discipline].` Identical wording across 23 files. Per-file rule duplication = drift surface; pointer = mechanical fan-out, single update point.

**DEC-3: User-Project Outcome anchor = O8 plugin reliability** (`docs/USER-OUTCOMES.md` per ADR-026). Verbose protocol output degrades plugin reliability via (a) burned tokens reducing context budget for actual work, (b) actionable signal buried under prose. Output Discipline is the protocol-output reliability contract. Internal to dev-flow plugin; no dependency on external output-compression mechanisms.

**DEC-4: Zero-headroom-file handling = trim adjacent line first; ADR scope-exception fallback.** `release-patch/SKILL.md` measured at 100/100 EXACT cap (sole zero-headroom skill per Sprint 055b T1 audit). T3.3 verify-per-file pass attempts adjacent-line trim before write; if no clean trim available, file is documented in this ADR § Consequences as scope-exception (principle still applies behaviorally; pointer line skipped). No cap raise (CLAUDE.md "Trim before commit — do not raise caps" anti-pattern).

**DEC-5: Re-litigation lock per ADR-031 anti-slip.** Per-skill principle wording variation = HARD STOP per ADR-031 lock 5 (focus discipline). Pointer-line wording is non-negotiable canonical form; consistency across 23 files matters more than per-file phrasing. Future re-evaluation requires new sprint promote + new ADR.

## Alternatives considered

1. **Per-skill duplication of Output Discipline rules.** Rejected. 16 skills + 7 agents = 23 update points; rule drift across files near-certain over time; reviewer must hunt. Contradicts ADR-026 single-source-of-truth principle.

2. **Inline rules in each SKILL.md body.** Rejected. Cap pressure violation — SKILL.md ≤100 line cap is tight (3 skills already at ≤3-line headroom per T1 audit); inline rules would force structural rewrites or cap raises. Pointer line ≤2 lines fits all but `release-patch` (sole exception, DEC-4).

3. **Behavioral-only via memory `feedback_output_discipline.md`.** Rejected. Memory entries decay across sessions; not durable like ADR + CONTEXT.md. Sprint 052b release-debt recurrence (10-sprint chain) demonstrated behavioral-only enforcement insufficient for cross-session contracts. Same risk class.

4. **Defer codification to post-v1 (post-Sprint-056).** Rejected. Output Discipline produces ~400 tokens saved per sprint protocol output. Across remaining v1 prereq sprints (055 + 055-2 + 056) = ~1,200 tokens compounding; pre-v1 codification is the cheap window. Post-v1 = breaking-change risk (existing skill consumers expect current verbosity).

5. **Single inline rule in CLAUDE.md (project memory) without CONTEXT.md section.** Rejected. CLAUDE.md is at 79/80 cap (1-line headroom per T1 audit); cannot hold 25-line rule block. CONTEXT.md is the cross-cutting domain-language file by design (`Context first` principle line 38) and has no formal cap (verified ADR-019 line 58).

## Consequences

**Positive:**
- ~400 tokens saved per sprint protocol output (Sprint 055b T1 audit projection); compounding across 50 sprints/year ≈ 20k tokens recovered annually.
- Single canonical update point for protocol-output style; reviewer hunt eliminated.
- Plugin reliability outcome (O8) directly anchored — protocol verbosity reduction = larger context window for actual sprint work.
- Pointer-line pattern reusable for future plugin-wide principles (e.g., Sprint 055b T1 audit Bloat Rank #2-#4 candidates may follow this pattern).

**Negative (trade-offs accepted):**
- 23-file fan-out cost at codification (verify-per-file, ~46 tool calls T3.3). One-time cost.
- `release-patch/SKILL.md` documented as zero-headroom scope-exception if no adjacent-line trim available; principle applies behaviorally without inline pointer. T3.3 attempts trim first; verdict recorded at T3.4 close.
- Re-litigation lock (DEC-5) means future per-skill exception requests require new ADR — friction acceptable per ADR-031 anti-slip pattern.

**Neutral:**
- ADR-033 file at `docs/adr/ADR-033-output-discipline.md` per locked convention (Sprint 043 DEC-7 + Sprint 047 DEC-6). ID verified non-colliding (max ADR was 032 post-Sprint-052b).
- Sprint 055b T3.1+T3.2+T3.3+T3.4 implement decisions; T3.4 cap-validation gate confirms zero cap breach before sprint close.
- Caveman-mode behavior is independent — Output Discipline targets protocol meta-output regardless of any active output-compression mode the user has configured externally.

## References

- ISSUE origin: Sprint 055b session 2026-05-09 lean-doc-generator verbose Sprint Promote output flagged by user; cross-skill drift risk identified.
- ADR-019 — CONTEXT.md frontmatter + cap absence (justifies CONTEXT.md as canonical home).
- ADR-026 — User-Project Outcome lens (O8 reliability anchor for DEC-3).
- ADR-030 — template canonical ownership (single-source pattern reused for Output Discipline).
- ADR-031 — anti-slip discipline at G1 (DEC-5 re-litigation lock derives from lock 5 focus discipline).
- TASK-128 (Sprint 055b T1) — token usage audit measuring ~1,750/sprint protocol-output overhead.
- TASK-133 (Sprint 055b T3) — Output Discipline plugin principle codification (this ADR scope).
- TASK-116-v2 (Sprint 055) — acceptance harness; lint automation for Output Discipline pattern adherence (deferred per Sprint 055b T3 OUT scope).
- Memory: `feedback_plugin_principle_pattern.md` (cross-skill drift fix pattern source).
- Re-evaluation cadence: post-v1 ship (Sprint 056) — DEC-4 (zero-headroom exception list) eligible for re-evaluation if cap-pressure landscape changes; DEC-2 pointer-line wording locked indefinitely (re-litigation lock).
