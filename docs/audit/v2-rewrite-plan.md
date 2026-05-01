---
owner: Aldian Rizki
created: 2026-05-01
status: approved
branch: v2-rewrite
---

# dev-flow v2 — Rewrite Plan

## Problem

v1 is too heavy. 1,126 files, 14 scripts, MANIFEST registry, 7 modes, 24 hard stops, evals/, 10 blueprint docs. Context budget consumed before work starts. Agentic engineering flow blocked by overhead.

## North Star

Skills-first. Minimal context. Orchestrator delegates. Humans gate. Agents execute.

---

## Architecture Change

| Dimension | v1 | v2 |
|---|---|---|
| Modes | 7 | 3 (`init`, `quick`, `mvp`) |
| Gates | 3 | 2 (scope, design) |
| Hard stops | 24 in separate doc | 3–5 red flags per skill |
| Scripts | 14 | 2 (`session-start`, `read-guard`) |
| Agent trigger | auto per phase | orchestrator dispatches; human approves others |
| Registry | MANIFEST.json | none — skills are files |
| Domain vocab | scattered | `CONTEXT.md` single source |
| Security gate | Gate 3 | separate `/security-review` session |
| Docs | 10 blueprint files | compressed into `CONTEXT.md` reference sections |

---

## New File Structure

```
.claude/
  CLAUDE.md              # ≤80 lines
  CONTEXT.md             # NEW: shared vocab + agentic principles + compressed blueprint
  agents/
    orchestrator.md      # NEW: lead agent, dispatches workers
    design-analyst.md    # slimmed ≤25 lines
    code-reviewer.md     # slimmed ≤25 lines
    security-analyst.md  # slimmed ≤25 lines (separate session)
    performance-analyst.md
    migration-analyst.md
    scope-analyst.md
  skills/
    dev-flow/            # core: 3 modes, 2 gates, agent dispatch
    task-decomposer/     # + vertical-slice pattern (from to-issues/to-prd)
    system-design-reviewer/ # + grill-with-docs pattern
    pr-reviewer/
    security-auditor/
    refactor-advisor/    # + improve-codebase-architecture pattern
    release-manager/
    adr-writer/
    lean-doc-generator/
    dev-flow-compress/
    diagnose/            # NEW from Matt: systematic 6-phase debugging
    tdd/                 # NEW from Matt: behavior-driven testing
    zoom-out/            # NEW from Matt: architecture context overview (small)
    write-a-skill/       # NEW from Matt: meta-skill for authoring new skills
  scripts/
    session-start.js     # keep, slimmed
    read-guard.js        # keep
  hooks/
    session-start hook   # keep
```

**Deleted:**
- `MANIFEST.json`
- `evals/`
- `scripts/` (12 scripts removed)
- `docs/blueprint/` (compressed into CONTEXT.md)
- agents: `init-analyst.md` (→ `/init` mode)
- All phase-tracking machinery

---

## Skills Plan

### Keep + Slim (10)
| Skill | Change |
|---|---|
| `dev-flow` | rewrite: 3 modes, 2 gates, orchestrator dispatch, red flags inline |
| `task-decomposer` | add vertical-slice pattern from `to-issues`; fold `to-prd` behavior |
| `system-design-reviewer` | add `grill-with-docs` interview pattern |
| `pr-reviewer` | slim, no change to logic |
| `security-auditor` | slim, mark as separate-session skill |
| `refactor-advisor` | add `improve-codebase-architecture` deep-module pattern |
| `release-manager` | slim |
| `adr-writer` | slim |
| `lean-doc-generator` | slim, compress DOCS_Guide.md (999→≤150 lines) |
| `dev-flow-compress` | keep as-is |

### New (4 from Matt Pocock)
| Skill | Purpose | Source |
|---|---|---|
| `diagnose` | 6-phase debugging: reproduce → hypothesize → instrument → fix → regression test | new skill |
| `tdd` | behavior-driven: tracer bullet → incremental red-green-refactor | new skill |
| `zoom-out` | bird's-eye module map before diving into unfamiliar code | new skill (small) |
| `write-a-skill` | guide creating new skills: size limits, trigger phrases, when to add scripts | new skill (meta) |

### Reference Updates (not new skills — fold into existing)
| Source (Matt) | Target skill | What it adds |
|---|---|---|
| `to-prd` | `task-decomposer` | PRD template (problem→user stories→impl decisions→test decisions) + deep-module framing for large features |
| `grill-me` | `dev-flow` G2 | one-question-at-a-time interview phase when requirements unclear before design-analyst spawns |
| `grill-with-docs` | `system-design-reviewer` | domain glossary challenge pattern; update CONTEXT.md as terms emerge |
| `improve-codebase-architecture` | `refactor-advisor` | deletion test + deep-module opportunity identification |

**Total: 14 skills**

---

## CONTEXT.md Design

Single file. All agents read it. Sections:

```
# Domain Vocabulary        — gate, mode, skill, agent, red flag, vertical slice
# Agentic Engineering      — orchestration principles, human-in-loop constraints
# Gates Reference          — G1 Scope checklist, G2 Design checklist
# Modes Reference          — init/quick/mvp behavior
# Compressed Blueprint     — key decisions from v1 blueprint (no procedural HOW)
```

---

## Orchestrator Agent

`orchestrator.md` — lead agent for agentic swarm:
- Reads task → picks mode → runs G1
- Dispatches `design-analyst` auto at G2
- Dispatches `code-reviewer` auto post-implementation
- Other specialists (`performance-analyst`, `migration-analyst`, `security-analyst`) → proposes to human before spawn
- Never skips gates

---

## Gates (Lean)

**G1 — Scope**
- Task stated as verifiable goal
- Size estimated (S/M/L)
- Constraints identified
- Red flags checked

**G2 — Design** (`mvp` mode only, skip in `quick`)
- Approach documented
- `design-analyst` reviewed
- No blockers
- ADR written if hard-to-reverse decision

---

## Modes

| Mode | Gates | When |
|---|---|---|
| `init` | none | first-time scaffold |
| `quick` | G1 only | single task, low risk |
| `mvp` | G1 + G2 | feature work, multi-task |

---

## Implementation Phases

### Phase 1 — Foundation
1. Write `CONTEXT.md`
2. Rewrite `CLAUDE.md` (≤80 lines)
3. Create `orchestrator.md`
4. Slim all 6 existing agents to ≤25 lines

### Phase 2 — Core Skill Rewrite
5. Rewrite `dev-flow/SKILL.md` (3 modes, 2 gates, dispatch logic, red flags)
6. Compress `dev-flow/references/` (phases.md 205→≤60, hard-stops→inline, kill mode-hotfix/mode-resume)

### Phase 3 — Skill Enhancements
7. Enhance `task-decomposer` with vertical-slice pattern
8. Enhance `system-design-reviewer` with grill-with-docs
9. Enhance `refactor-advisor` with deep-module pattern
10. Slim `lean-doc-generator/reference/DOCS_Guide.md` (999→≤150 lines)

### Phase 4 — New Skills
11. Create `diagnose/SKILL.md`
12. Create `tdd/SKILL.md`
13. Create `zoom-out/SKILL.md`
14. Create `write-a-skill/SKILL.md`

### Phase 5 — Cleanup
14. Slim `session-start.js` (remove phase-tracking calls)
15. Delete: MANIFEST.json, evals/, 12 scripts, blueprint docs, init-analyst agent
16. Update `README.md` for v2

---

## Success Criteria

- [ ] CLAUDE.md ≤ 80 lines
- [ ] CONTEXT.md exists and covers all vocabulary
- [ ] 2 gates enforced in `dev-flow` skill
- [ ] 3 modes only
- [ ] All agents ≤ 25 lines
- [ ] 0 MANIFEST.json references
- [ ] `session-start` + `read-guard` only scripts
- [ ] All 14 skills have inline red flags (no global hard-stops doc)
- [ ] `lean-doc-generator` DOCS_Guide ≤ 150 lines
- [ ] v1 master branch preserved as reference
