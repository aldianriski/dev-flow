# CONTEXT.md — dev-flow Shared Domain Language

All agents and skills read this file. Single source of truth for vocabulary, principles, gates, and modes.

---

## Vocabulary

| Term | Definition |
|---|---|
| **gate** | Human checkpoint; must pass before proceeding |
| **mode** | Operational context: `init` / `quick` / `mvp` |
| **skill** | Slash command loaded on demand from `.claude/skills/` |
| **agent** | Specialist worker spawned by orchestrator for targeted analysis |
| **red flag** | Condition that hard-stops a skill; listed inline per skill |
| **vertical slice** | Independently demoable end-to-end behavior unit |
| **deep module** | Module whose interface is simple relative to its implementation; high leverage |
| **grill** | One-question-at-a-time interview to stress-test a plan before committing |

---

## Agentic Engineering Principles

- **Orchestration over coding** — design, direct, oversee; agents execute
- **Human in loop** — humans set goals, approve gates, review outputs; agents never self-approve
- **Context first** — right context → right output; agents must read CONTEXT.md before acting
- **Minimal footprint** — agents read, plan, report; humans approve writes
- **Feedback rate = speed** — fast feedback loops beat fast feature development
- **Vertical slices** — decompose work into independently demoable units, not horizontal layers

---

## Gates

### G1 — Scope *(required: `quick` + `mvp`)*
- [ ] Goal stated as verifiable outcome
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

---

## Agent Roster

| Agent | Trigger | Spawned by |
|---|---|---|
| `orchestrator` | `/dev-flow` | user |
| `design-analyst` | G2 always | orchestrator (auto) |
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
