---
owner: Tech Lead (Aldian Rizki)
last_updated: 2026-05-10
update_trigger: Vocab, gate, mode, or agent roster change
status: current
---

# CONTEXT.md — dev-flow Shared Domain Language

All agents and skills read this file. Single source of truth for vocabulary, principles, gates, and modes.

---

## Vocabulary

| Term | Definition |
|---|---|
| **gate** | Human checkpoint; must pass before proceeding |
| **mode** | Operational context: `init` / `quick` / `mvp` / `sprint-bulk` |
| **skill** | Slash command loaded on demand from `skills/` (plugin install) or `.claude/skills/` (scaffold copy) |
| **agent** | Specialist worker spawned by dispatcher for targeted analysis |
| **red flag** | Condition that hard-stops a skill; listed inline per skill |
| **vertical slice** | Independently demoable end-to-end behavior unit |
| **deep module** | Module whose interface is simple relative to its implementation; high leverage |
| **grill** | Question-driven interview to stress-test a plan before committing. Two variants: strict 1-per-turn (`/architecture-grill` for high-stakes design where Q dependence is the norm) · batched + follow-up (Flow Grill for routine planning convergence; ≤5 independent Qs/turn + follow-up on ambiguous answer per ADR-036 DEC-3) |
| **flow grill** | Terminal-first iterative Q&A loop converging sprint planning OQs BEFORE sprint doc write; collapses 3-stage planning handoff (decompose → Sprint Promote → orchestrator G1+G2) into one. Anchor: ADR-036 · canonical: `lean-doc-generator/references/FLOW_GRILL.md` |
| **user-project outcome** | Measurable benefit dev-flow delivers to a project that adopts it (8 canonical: onboard · doc-rot · architecture · rework · flow · correction · template · reliability per `docs/USER-OUTCOMES.md`) |

_Avoid: confusing **skill** with **agent** — skills are user-invokable slash commands; agents are dispatcher-spawned specialists._
_Avoid: confusing **mode** with **gate** — modes are operational context (init/quick/mvp/sprint-bulk); gates are checkpoints within a mode (G1/G2)._
_Avoid: confusing **red flag** with `BLOCKED` finding — red flags hard-stop a skill mid-execution; `BLOCKED` is an analyst output that stops sprint progression._

---

## Agentic Engineering Principles

- **Orchestration over coding** — design, direct, oversee; agents execute (the dispatcher agent owns this role)
- **Human in loop** — humans set goals, approve gates, review outputs; agents never self-approve
- **Context first** — right context → right output; agents must read CONTEXT.md before acting
- **Minimal footprint** — agents read, plan, report; humans approve writes
- **Feedback rate = speed** — fast feedback loops beat fast feature development
- **Vertical slices** — decompose work into independently demoable units, not horizontal layers
- **User-Project Lens** — every component states a user-project outcome (onboard · doc-rot · architecture · rework · flow · correction · template · reliability). Registry: `docs/USER-OUTCOMES.md`. Anchor: ADR-026

---

## Gates

### G1 — Scope *(required: `quick` + `mvp`)*
- [ ] Goal stated as verifiable outcome
- [ ] User-project outcome named (≥1 per `docs/USER-OUTCOMES.md`)
- [ ] Size estimated: **S** ≤2h / **M** ≤1d / **L** >1d → must split
- [ ] Constraints and dependencies named
- [ ] Skill red flags checked

### G2 — Design *(required: `mvp` only)*
- [ ] Approach documented (≤10 bullets)
- [ ] `design-analyst` returned `DONE` or `DONE_WITH_CONCERNS`
- [ ] Hard-to-reverse decision → ADR written via `adr-writer`
- [ ] No `BLOCKED` findings

---

## Modes

| Mode | Gates | Use when |
|---|---|---|
| `init` | none | first-time project scaffold |
| `quick` | G1 | single task, low risk, S size |
| `mvp` | G1 + G2 | feature work, multi-task, M+ size |
| `sprint-bulk` | G1+G2 (resolved upstream via Flow Grill — ADR-036) | multi-task sprint; sequential default; parallel only when file-overlap == ∅ |

---

## Relationships

- **mode → gate** — each mode declares which gates fire (`init` none / `quick` G1 / `mvp` G1+G2 / `sprint-bulk` G1+G2 resolved upstream via Flow Grill per ADR-036).
- **gate → agent** — G1 may auto-spawn `scope-analyst` (size unclear); G2 always auto-spawns `design-analyst`.
- **dispatcher → specialist** — the orchestrator skill (which IS the dispatcher role per ADR-037) is the only thing that spawns specialist agents; specialists return to orchestrator (one-way, depth ≤2 per ADR-015).
- **skill → agent** — skills do NOT spawn agents directly; orchestrator dispatch-table maps work to agents via dispatcher.
- **CONTEXT.md → all** — every agent + skill reads CONTEXT.md before acting (`Context first` principle).

---

## Agent Roster

> Dispatcher role lives in `skills/orchestrator/SKILL.md` (per ADR-037 R3 — agent file removed in v4.0.0; role description folded into orchestrator skill).

| Agent | Trigger | Spawned by |
|---|---|---|
| `design-analyst` | G2 always (default) · `--grill` flag for strict 1-Q-at-a-time mode (ADR-037) | orchestrator (auto) |
| `code-reviewer` | post-implementation | orchestrator (auto) |
| `scope-analyst` | G1 if size unclear | orchestrator (auto) |
| `security-analyst` | separate `/security-review` session | user |
| `performance-analyst` | high-risk + api/db layers | orchestrator (propose → human approves) |
| `migration-analyst` | DB schema change detected | orchestrator (propose → human approves) |

---

## Skill Authoring Standards

- `SKILL.md` ≤ 100 lines; overflow → `references/` files
- Description field < 1,024 characters; must start with `Use when…`
- Red flags: 3–5 inline, not in a separate doc
- Add scripts only for deterministic, repeatedly-generated operations
- Trigger phrase must be specific enough to avoid false positives

---

## Output Discipline

Plugin-wide principle for protocol-output style. Applies to all 16 skills + 7 agents in `dev-flow:`. Anchor: ADR-033. **User-Project Outcome:** O8 plugin reliability (`docs/USER-OUTCOMES.md`).

**Rules:**
- Status = one-line verdict per step (e.g. `Step N — <result>`); no narrated walkthrough.
- No decorative emoji checkmarks (✅/❌) in protocol output. Plain-text verdicts only.
- Lists render compactly: `TASK-NNN — title (P0)` per row; no per-row paragraph.
- HALT prompts ≤ 4 lines + option list. No re-explanation of options already in the skill body.
- No preamble fluff: skip phrases like "I have data needed", "Let me emit", "I'll wait for your pick".
- Code blocks, commit messages, ADR text, security warnings, and irreversible-action confirmations: write normal (Auto-Clarity rule).

**Apply when:** any skill or agent emits protocol-mediated output — sprint-promote step verdicts, decompose Q&A, gate decisions, halt prompts, status reports.

**Why:** Verbose narration wastes tokens (~400/sprint per Sprint 055b T1 audit) and buries actionable signal under prose. Codified plugin-wide to prevent per-skill drift; single canonical source + pointer-line propagation across 23 components beats per-file duplication.

---

## History Hygiene

Plugin-wide principle for doc-history pruning. Applies to TODO.md + sprint files + CHANGELOG + Roadmap. Anchor: ADR-034. **User-Project Outcome:** O2 doc-rot prevention + O8 plugin reliability (`docs/USER-OUTCOMES.md`).

**Per-surface rules:**
- **TODO.md Active Sprint ribbon:** ≤3 most-recent closed-sprint narrative pointers; older → archive narrative to CHANGELOG row.
- **TODO.md closed task rows (P0/P1):** verbose AC summaries collapse to 1-line pointer (`closed Sprint NNN <sha> — <one-line summary>`) after 1-sprint cooldown; rows >2 sprints old DELETE entirely (history in CHANGELOG + sprint file + `git log`).
- **Sprint files retro:** Worked / Friction / Pattern sub-sections capped at ≤6 bullets each; older surprise-log entries archive at close.
- **CHANGELOG.md:** per-sprint row cap ~12 lines headline + 6 bullets max; deeper detail lives in sprint file.
- **Roadmap (TODO.md):** done-cluster blocks (≥5 consecutive done sprints in same EPIC/theme) collapse to 1-line summary pointing to CHANGELOG range.

**Apply when:** at Sprint Close (lean-doc Sprint Close protocol) AND at Sprint Promote (lean-doc Step 1.5c hygiene sweep — pre-plan-write eligibility check).

**Why:** Doc-bloat compounds linearly per sprint; new-session render cost grows; v1 ship inherits bloat baseline. Codified plugin-wide to prevent per-skill drift; mirrors Output Discipline (ADR-033) plugin-principle pattern (single canonical CONTEXT.md source + pointer-line propagation).

---

## Behavioral Guidelines Lineage

Lineage + adaptation notes live at [`.claude/references/behavioral-guidelines-lineage.md`](references/behavioral-guidelines-lineage.md). Re-diff cadence + SHA pin contract unchanged (ADR-019).

---

## Flagged Ambiguities

Resolved naming/concept ambiguities — pointer surface for new contributors.

- **skill `dev-flow` vs plugin `dev-flow`** (resolved Sprint 035 ADR-014) — skill was renamed to `orchestrator`; plugin name preserved. `/orchestrator` invokes the workflow skill; `dev-flow:` is the plugin namespace prefix.
- **agent `orchestrator` vs skill `orchestrator`** (resolved Sprint 035 ADR-014) — agent was renamed to `dispatcher`; skill `orchestrator` is the workflow command; agent `dispatcher` spawns specialists.
- **`codemap-refresh` skill vs `scripts/codemap-refresh.ps1`** (resolved Sprint 039) — skill is the manual `/codemap-refresh` slash command for human invocation; PS script is the auto-fired post-commit hook target. Both regenerate `docs/codemap/CODEMAP.md` + `handoff.json`.
- **research note vs ADR vs sprint plan** (resolved Sprint 040+) — research notes (`docs/research/<topic>-<date>.md`) are evaluation findings; ADRs (`docs/adr/ADR-NNN-*.md`) are decisions with Context/Decision/Alternatives/Consequences; sprint plans (`docs/sprint/SPRINT-NNN-*.md`) are execution containers. Decisions cross-link to research; sprints cross-link to ADRs.
