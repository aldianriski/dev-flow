---
owner: Tech Lead (Aldian Rizki)
last_updated: 2026-05-04
update_trigger: vocabulary added/changed; gate or mode count changes; agent roster changes; behavioral guidelines lineage updates
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
| **grill** | One-question-at-a-time interview to stress-test a plan before committing |

---

## Agentic Engineering Principles

- **Orchestration over coding** — design, direct, oversee; agents execute (the dispatcher agent owns this role)
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
| `sprint-bulk` | G1 + G2 (batched once per sprint) | multi-task sprint; sequential default; parallel only when file-overlap == ∅ |

---

## Agent Roster

| Agent | Trigger | Spawned by |
|---|---|---|
| `dispatcher` | `/orchestrator` | user |
| `design-analyst` | G2 always | dispatcher (auto) |
| `code-reviewer` | post-implementation | dispatcher (auto) |
| `scope-analyst` | G1 if size unclear | dispatcher (auto) |
| `security-analyst` | separate `/security-review` session | user |
| `performance-analyst` | high-risk + api/db layers | dispatcher (propose → human approves) |
| `migration-analyst` | DB schema change detected | dispatcher (propose → human approves) |

---

## Skill Authoring Standards

- `SKILL.md` ≤ 100 lines; overflow → `references/` files
- Description field < 1,024 characters; must start with `Use when…`
- Red flags: 3–5 inline, not in a separate doc
- Add scripts only for deterministic, repeatedly-generated operations
- Trigger phrase must be specific enough to avoid false positives

---

## Behavioral Guidelines Lineage

The four principles in `.claude/CLAUDE.md` § Behavioral Guidelines (Think Before Acting · Simplicity First · Surgical Changes · Goal-Driven Execution) derive from `forrestchang/andrej-karpathy-skills` `CLAUDE.md` (MIT License). Verified against upstream commit `2c606141936f` on **2026-05-04**.

**Adaptation type:** intentional rewording for meta-repo context — dev-flow has no app-code domain; principles distilled from karpathy's bulleted format to single-paragraph form.

| Principle | Karpathy headline | dev-flow headline | Adaptation |
|---|---|---|---|
| 1 | Think Before **Coding** | Think Before **Acting** | "Coding" → "Acting" (meta-repo: doc/skill work, no code) |
| 2 | Simplicity First | Simplicity First | "code" → "content"; drops "200 lines" specifics |
| 3 | Surgical Changes | Surgical Changes | "code" → "task"; drops orphan-removal subsection (covered by Sprint 039 retro pattern) |
| 4 | Goal-Driven Execution | Goal-Driven Execution | distilled prose; transform examples + verify-step format are out (T3 decides whether to re-add) |

**License:** MIT. Attribution: `forrestchang/andrej-karpathy-skills` (Andrej Karpathy patterns). When the upstream `CLAUDE.md` substantively changes, re-diff and bump the verified-at SHA + date here. ADR-019 (Sprint 040) records the adoption decision.
