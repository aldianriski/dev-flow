---
owner: Tech Lead (Aldian Rizki)
last_updated: 2026-05-09
update_trigger: Replace at next pre-ship audit (TASK-128 follow-up)
status: current
sprint: 055b
task: TASK-128
---

# Token Usage Audit — 2026-05-09

> Pre-v1 quality gate per TASK-128 + Sprint 055b T1. Six-item acceptance per sprint plan.
> Tokenizer: gpt-tokenizer (cl100k_base / o200k default). Raw counts: `docs/audit/token-counts-2026-05-09.json`.
> All trim recommendations DEFERRED — this is read-only audit. User decides post-T1.

---

## 1. Per-file scan

**Totals:** 37 files · 35,549 tokens · 2,951 lines.

| Group | Files | Tokens | % |
|---|---:|---:|---:|
| skill-references | 12 | 17,137 | 48% |
| skills (SKILL.md) | 16 | 14,227 | 40% |
| agents | 7 | 1,715 | 5% |
| project-context (CONTEXT.md) | 1 | 1,632 | 5% |
| project-claude (CLAUDE.md) | 1 | 838 | 2% |

**Top 9 files (≥1k tokens):**

| Rank | File | Tokens | Lines | Cap | Headroom |
|---:|---|---:|---:|---:|---:|
| 1 | `skills/orchestrator/references/phases.md` | 3,544 | 282 | — | — |
| 2 | `skills/lean-doc-generator/references/SPRINT_PROTOCOLS.md` | 3,527 | 235 | — | — |
| 3 | `skills/lean-doc-generator/references/VALIDATED_PATTERNS.md` | 3,089 | 203 | — | — |
| 4 | `skills/release-patch/references/version-detection.md` | 2,121 | 184 | — | — |
| 5 | `.claude/CONTEXT.md` | 1,632 | 122 | — | — |
| 6 | `skills/lean-doc-generator/references/DOCS_Guide.md` | 1,580 | 126 | — | — |
| 7 | `skills/orchestrator/SKILL.md` | 1,478 | 97 | 100 | 3 |
| 8 | `skills/prime/SKILL.md` | 1,394 | 87 | 100 | 13 |
| 9 | `skills/release-patch/SKILL.md` | 1,371 | 100 | 100 | **0** |

**Cap-pressure files (≤3-line headroom):**

| File | Lines | Cap | Headroom | Status |
|---|---:|---:|---:|---|
| `skills/release-patch/SKILL.md` | 100 | 100 | 0 | EXACT cap |
| `agents/design-analyst.md` | 28 | 30 | 2 | tight |
| `agents/scope-analyst.md` | 28 | 30 | 2 | tight |
| `skills/orchestrator/SKILL.md` | 97 | 100 | 3 | tight |
| `agents/dispatcher.md` | 26 | 30 | 4 | OK |
| `.claude/CLAUDE.md` | 79 | 80 | 1 | tight |

**Density anomalies (tokens-per-line ≥15 may indicate dense tables OR high info density — not auto-bloat):**

| File | t/l | Note |
|---|---:|---|
| `skills/task-decomposer/references/procedure.md` | 21.8 | very dense; check structure |
| `skills/orchestrator/references/skill-dispatch.md` | 16.5 | table-heavy (Always-On rows) |
| `skills/release-manager/references/procedure.md` | 16.1 | dense |
| `skills/orchestrator/SKILL.md` | 15.1 | tables + inline commands |
| `skills/codemap-refresh/SKILL.md` | 15.4 | tables |
| `skills/lean-doc-generator/references/VALIDATED_PATTERNS.md` | 15.2 | example-heavy |
| `skills/lean-doc-generator/references/SPRINT_PROTOCOLS.md` | 15.0 | protocol blocks |

---

## 2. Default session-start context load

**dev-flow contribution per session start (~):**

| Component | Tokens | Source |
|---|---:|---|
| `.claude/CLAUDE.md` (project memory) | 838 | this audit |
| MEMORY.md (auto-memory index + lazy entries) | ~732 | `/context` view 2026-05-09 |
| 23 skill descriptions (frontmatter only — bodies load on invoke) | ~2,600 | `/context` Skills section |
| 7 agent descriptions | ~508 | `/context` Custom agents |
| SessionStart hook output (PowerShell session-start.ps1) | ~50 | runtime measurement |
| **Subtotal dev-flow** | **~4,728** | |

**Plus harness (out-of-scope for trim):**

| Component | Tokens |
|---:|---:|
| System prompt | 8,700 |
| System tools (built-in) | 19,600 |
| MCP tools (deferred) | 8,900 |
| System tools (deferred) | 17,200 |

**Note:** Skill BODIES load on demand when triggered. SPRINT_PROTOCOLS.md (3,527) loads only when a sprint command fires, not session-start.

**Trim candidates (session-start scope):**
- MEMORY.md 9 entries · 732 tokens. 3 entries on Windows-specific gh/hook quoting could collapse to one "Windows shell quirks" entry. Est. savings: ~150 tokens.
- CLAUDE.md at 79/80 cap (cap-pressure). Cannot trim without restructure. Codemap L0 line + Definition of Done block are candidates if truly stale.
- Skill descriptions: 23 × ~110 tokens avg. Could trim verbose `Use when X — also when Y — do not use for Z` pattern to single-clause "Use when X." across the board. Est. savings: ~700 tokens (30% × 2,600).

---

## 3. Caveman plugin removal feasibility

**Caveman scope:** ALL user-facing output (default `full` mode). Compresses prose; preserves code/commits/security verbatim.
**Output Discipline (TASK-133, T3) scope:** protocol meta-output only — sprint-promote step verdicts, halt prompts, decompose Q&A, status reports.

**Overlap matrix:**

| Output type | Caveman handles | Output Discipline handles | Overlap |
|---|:-:|:-:|:-:|
| User prose (general chat) | YES | NO | none |
| Protocol step verdicts | YES (terse) | YES (terse) | redundant |
| Halt prompts | YES | YES (≤4 lines) | redundant |
| Decompose Q&A | YES | YES (compact) | redundant |
| Code blocks / commits / security warnings | NO (defers) | NO (defers) | both defer |

**Verdict: KEEP caveman.** Reasons:
1. Caveman is **user-toggle UX layer** — user controls intensity (`/caveman lite|full|ultra`). Output Discipline is **mandatory protocol layer** — fires regardless of user mode.
2. Removing caveman breaks user UX preference; Output Discipline only enforces protocol terseness, not all-output compression.
3. Caveman footprint is small (~5 skill descriptions × ~85 tokens = ~425 tokens session-start). Removal ROI ≈ 400 tokens. Not worth the UX regression.
4. Both can coexist: caveman wraps user prose; Output Discipline wraps protocol meta-output. CONTEXT.md § Output Discipline scope clause clarifies non-overlap.

**Counter-recommendation:** Document the layered relationship in CONTEXT.md § Output Discipline § Scope (T3.1) so future readers don't conflate.

---

## 4. Sprint-close commit-ID fan-out

**Trace (per sprint close, e.g. Sprint 054b `65e74c5`):**

| # | Location | Field | Token cost |
|---:|---|---|---:|
| 1 | `TODO.md` frontmatter | `sprint: NNN → none` | ~5 |
| 2 | `TODO.md` Active Sprint pointer | "Sprint NNN closed `<sha>`" | ~30 |
| 3 | `TODO.md` Backlog rows | "(closed Sprint NNN `<sha>`)" per task | ~25 × N |
| 4 | `docs/sprint/SPRINT-NNN-*.md` frontmatter | `close_commit: <sha>` | ~5 |
| 5 | `docs/sprint/SPRINT-NNN-*.md` Execution Log | "### YYYY-MM-DD HH:MM \| sprint close — `<sha>`" | ~30 |
| 6 | `docs/CHANGELOG.md` row | `Plan commit:` + `Close commit:` | ~30 |
| 7 | `TODO.md` Roadmap row | `(done — \`<sha>\`)` | ~10 |
| 8 | `docs/sprint/SPRINT-NNN-*.md` Files Changed | row references in narrative | ~5 (sometimes) |

**Per-close fan-out: ~140 tokens (single SHA appears 6–8 times) + ~25 × N tasks for backlog rows.**

**Redundancy:**
- SHA appears in close_commit frontmatter (canonical) AND Execution Log (narrative) AND CHANGELOG row (audit trail) AND TODO Active Sprint pointer (transient) AND TODO Backlog row (closure marker) AND Roadmap (roadmap audit).
- Each location has different consumer: frontmatter → tooling; narrative → reader; CHANGELOG → release notes; TODO → state; Roadmap → planning.

**Canonical-source proposal:**
1. **Sprint file frontmatter `close_commit:`** = single source of truth.
2. CHANGELOG.md derives via build script (`scripts/changelog-from-sprints.js` — does not exist; defer).
3. TODO.md keeps SHA in Active Sprint pointer + Roadmap (human-readable nav); Backlog rows keep "(closed Sprint NNN)" without SHA — Sprint NNN is sufficient pointer.
4. Execution Log narrative keeps SHA only in `sprint close` block — drop from intermediate `T<N> done — \`<sha>\`` blocks (those SHAs aren't referenced post-close).

**ROI estimate:** ~50 tokens saved per close + ~25 × N task-row trim. For 5-task sprint = ~175 tokens. Across 50 sprints/year = ~9k tokens. Modest absolute. **Bigger win = maintenance cost** (no more manual SHA sync across 6 locations; one source).

**Recommendation: defer to follow-up sprint (post-055b).** Codify canonical-source rule in `SPRINT_PROTOCOLS.md § Sprint Close` first; refactor existing sprints opportunistically (no backfill).

---

## 5. Sprint planner protocol cost

**Step 3 Decompose template** (`SPRINT_PROTOCOLS.md` lines 65-80): 10-row Q&A per task.

| # | Question | Tokens (template) | Tokens (typical answer) | Total per task |
|---:|---|---:|---:|---:|
| 1 | Scope: in-scope vs out-of-scope? | 8 | 80 | 88 |
| 2 | Acceptance: observable outcome? | 8 | 60 | 68 |
| 3 | Edge cases: empty/null/large/concurrent/error? | 12 | 50 | 62 |
| 4 | Files (likely): paths or "tbd"? | 8 | 40 | 48 |
| 5 | Tests: scenarios add to TEST_SCENARIOS.md? | 10 | 30 | 40 |
| 6 | Risk: low/med/high — reason? | 10 | 25 | 35 |
| 7 | Depends on: other task? | 6 | 15 | 21 |
| 8 | ADR needed: yes/no/maybe — topic? | 10 | 20 | 30 |
| 9 | Definition of done: code + tests + docs? | 14 | 40 | 54 |
| 10 | Existing pattern to mirror: file or —? | 10 | 20 | 30 |
|  | + confidence + uncertainty | 12 | 25 | 37 |
| **Subtotal per task** | | **108** | **405** | **~513** |

**3-task sprint decompose alone: ~1,540 tokens.**

**Plus per-sprint structural cost:**

| Section | Tokens |
|---|---:|
| Sprint file frontmatter + Theme/Mode/Driver block | ~120 |
| `## Why this sprint exists` (4-6 sentence narrative) | ~250 |
| `## Plan` per-task block (Acceptance + Scope + Files + Risk + DoD + Confidence) | ~300 × N |
| `## G1 (anti-slip)` block (8 fields) | ~400 |
| Empty stubs (Execution Log + Files Changed + Decisions + Open Questions + Retro) | ~80 |
| **Subtotal (3-task sprint)** | **~1,750** |

**Plus protocol-output cost during execution:**

| Step | Tokens |
|---|---:|
| Sprint Promote step-by-step status (Step 0a/0b/0/1/1.2/1.5/2/3/4/5/6/7/8/9) | ~600 |
| HALT prompts + 3-option presentations | ~400 |
| Per-task decompose answer (already counted above) | — |
| Plan-locked commit message | ~150 |
| Sprint close protocol output (verify steps + retro prompts + close commit) | ~600 |
| **Subtotal protocol-output (one full sprint)** | **~1,750** |

**Per-sprint total: 1,540 (decompose) + 1,750 (sprint file structure) + 1,750 (protocol output) = ~5,040 tokens of pure protocol overhead.**

**Compression candidates:**

| Candidate | Saved | Risk |
|---|---:|---|
| Drop Q10 "Existing pattern to mirror" (low signal — rarely actionable) | ~30/task | low |
| Collapse Q3+Q6 "Edge cases" + "Risk" into single line | ~30/task | low |
| Merge G1 fields `focus` + `done-confirmation` (redundant) | ~80/sprint | low |
| Drop empty stubs in sprint file (let tooling create on first append) | ~80/sprint | medium — reader expectation |
| Promote Step status output to single-line verdicts (Output Discipline T3.1) | ~400/sprint | low — already part of T3 |
| Decompose answers — char limit per field (≤80 chars per answer enforced) | ~150/sprint | medium — risk under-spec |
| Drop "Mode/Driver/AI" header line (constant across all sprints) | ~30/sprint | low |

**Estimated compression: ~30-40% per-sprint protocol tokens (~1,500-2,000 tokens saved).**

**Recommendation: defer template revisions to follow-up sprint. T3 Output Discipline (Sprint 055b) addresses protocol-output side. Decompose template + sprint file template revisions = own task post-055b.**

---

## 6. Bloat candidates ranked by ROI

| Rank | Candidate | Est. saved | Effort | Triage |
|---:|---|---:|---|---|
| 1 | Output Discipline rollout (T3 in-sprint) | ~400/sprint | M (23 files) | **Sprint 055b T3** |
| 2 | Sprint planner template compression | ~1,500/sprint | M | **NEW TASK** post-055b |
| 3 | Skill description trim (verbose `Use when X — also Y — not Z`) | ~700 (one-time) | S | **NEW TASK** post-055b |
| 4 | Sprint-close commit-ID canonical-source codify | ~175/sprint | S | **NEW TASK** post-055b |
| 5 | MEMORY.md Windows-quirk consolidation | ~150 (one-time) | S | inline in next memory edit |
| 6 | references/VALIDATED_PATTERNS.md prune (>6-month-old patterns) | ~300 (one-time) | S | **TASK-116-v2 lint candidate** |
| 7 | references/SPRINT_PROTOCOLS.md "Observed drift Sprint 30-33" historical narrative compress | ~200 (one-time) | S | inline in T2 (DEC-3 codify) |
| 8 | Cap-breach fix `release-patch/SKILL.md` 100/100 (script counts 101 due to trailing newline; wc says 100) | 0 (verify only) | S | **T3 prerequisite** |

**One-time savings: ~1,150 tokens.**
**Per-sprint recurring savings (after rollout): ~2,075 tokens.**

---

## 7. Triage to TD rows / TASK-116-v2 lint scope

**New TD candidates (defer to user confirm at retro):**
- TD-NEW-A — Skill description trim verbose pattern (medium · audit-finding-7 · Sprint 055b T1)
- TD-NEW-B — Sprint planner template compression (medium · audit-finding-2 · Sprint 055b T1)
- TD-NEW-C — Sprint-close commit-ID canonical-source codify (minor · audit-finding-4 · Sprint 055b T1)

**TASK-116-v2 lint candidates:**
- VALIDATED_PATTERNS.md staleness (>6-month patterns auto-flag)
- Skill description shape lint (single-clause `Use when X` pattern)
- SPRINT_PROTOCOLS.md historical-narrative bloat detector

**Sprint 055b T3 scope-expansion candidate:**
- Output Discipline rollout already covers protocol-output side (~400/sprint).
- DOES NOT cover decompose template OR sprint file structure compression — those are separate.

---

## Verdicts (user decision required at sprint review before T2 starts)

| Verdict | Default | User accepts? |
|---|---|---:|
| Caveman plugin | KEEP (user-toggle UX layer; OD is protocol layer; coexist) | y / n |
| Sprint-close commit-ID flow refactor | DEFER post-055b (codify canonical-source first) | y / n |
| Sprint planner template compression | DEFER post-055b (own task, ~1,500/sprint ROI) | y / n |
| Skill description trim | DEFER post-055b (one-time ~700 tokens) | y / n |
| Output Discipline T3 in-sprint | PROCEED (already planned) | confirmed |
| Convert audit findings to 3 NEW TD rows at sprint close | y / n | (retro decision) |

---

## Footnotes

- **Cap measurement nuance:** script counts `lines = content.split('\\n').length` which yields N+1 for files with trailing newline. `wc -l` counts newlines (N). For files ending with `\\n` (POSIX-clean), wc is canonical. `release-patch/SKILL.md` reads as 101 in script vs 100 in wc — actually at exact cap (100/100), zero headroom confirmed. Same applies to other tight files.
- **Tokenizer note:** gpt-tokenizer default uses cl100k_base / o200k. Claude tokenization differs slightly; absolute counts ±10–15%. Relative ranking + ROI proportions are reliable.
- **No actual trim performed.** This audit is read-only per T1 scope. All recommendations gated on user verdict at sprint review.
