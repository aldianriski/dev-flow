# dev-flow Design Philosophy

---
owner: Tech Lead
last_updated: 2026-04-20
update_trigger: A non-negotiable is challenged, relaxed, or replaced; new rejection rationale added
status: current
related: AI_WORKFLOW_BLUEPRINT.md · context/research/ADAPTATION_NOTES.md · context/research/CC_SPEC.md
---

> **Why this file exists.** dev-flow is an opinionated starter. The opinions below are the reason it exists — a less opinionated starter is just a skill pack. This file names the three non-negotiables and the patterns we deliberately refused. If a PR argues "let's just do it like superpowers," reviewers answer by citing a row here. If the row no longer convinces, update the row; do not quietly change the code.

---

## The three non-negotiables

### 1. Gate-driven (not skill-driven)

Every substantial task passes three gates: **Gate 0 Scope** → **Gate 1 Design** → **Gate 2 Review + Security**. Skills execute inside the gates; skills never replace a gate.

**Why.** In production workflows, the expensive failures happen at the *seams*: a scope misread poisons every later phase; a skipped security review ships a CVE. Gates are where the orchestrator (and the human) gets a mechanical chance to stop. A skill-centric model trusts each skill individually; that's fine for prototyping, but it turns the human into a passive reviewer of confident output.

**Consequence for contributors.** A new skill does not earn the right to bypass a gate. If a gate feels redundant for a specific mode (e.g. `hotfix`), the mode is defined to skip it explicitly — the gate is never implicitly optional.

### 2. Mode-modal (not single-entry)

There are six modes — `init`, `full`, `quick`, `hotfix`, `review`, `resume` — and each has its own gate configuration, context budget, and allowed subagents. Users invoke the mode; the mode decides the shape of the workflow.

**Why.** The adopter is one repo; the work inside that repo is not uniform. A 90-second typo fix and a 3-hour migration should not run through the same prompt. Single-entry starters (superpowers' pattern) either over-process the small task or under-process the big one. The mode dispatch is the first place we pay attention to *what kind of work* is being requested.

**Consequence for contributors.** Adding a seventh mode is a **MAJOR** blueprint bump and requires a CHANGELOG entry with the rationale (per `CONTRIBUTING.md` semver rules, to be written in TASK-006). Adding a *skill* that partially overlaps an existing mode is fine; adding a mode is not a casual change.

### 3. Hard-stop catalog (27 named triggers)

A finite, numbered list of refusal conditions that no skill, agent, or prompt can silently relax. Secrets in logs, destructive DB operations without dry-run, production deploys without Gate 2 approval, etc.

**Why.** Skills can be rewritten; the hard stops are the last line of defense when they are. If the list is finite and numbered, we can grep it, audit it, and test it. If it's cultural ("be careful with destructive ops"), it drifts. Gate 2 validation literally iterates the catalog.

**Consequence for contributors.** A hard stop is added by **MINOR** bump + CHANGELOG + a test in `.claude/scripts/__tests__/` (Sprint 2 onwards) that proves the stop fires. Removing a hard stop is a MAJOR bump and requires a written post-mortem showing the stop never fires in practice. Stops do not get silently loosened to make a skill convenient.

---

## What we deliberately do NOT adopt from superpowers

The full import plan is in `context/research/ADAPTATION_NOTES.md`. This section lists only what we refused, with one-line why.

| Pattern | Refused because |
|:---|:---|
| **Skills orchestrating each other freely** | violates the thin-coordinator rule and the gate model; in dev-flow, skills are invoked BY the orchestrator, never by each other |
| **Single entry point for all task shapes** | conflates hotfix, migration, review, and init under one prompt — the mode dispatch exists exactly to prevent this |
| **Spawn-everything-in-parallel as default** | tiered context cost means we pick the cheapest agent that can answer the question; parallel-by-default inflates tokens without gate discipline |
| **`.cmd` + `.sh` dispatcher pair for hooks** | pure Node ≥18 is already cross-platform; two scripts per hook doubles the surface that can drift |
| **Hardcoded model choices inside SKILL.md** | model selection belongs in subagent frontmatter and blueprint §4 guidance; skills must stay model-agnostic |
| **No semver on the methodology** | the blueprint is a contract adopters depend on; changes must be traceable. superpowers can skip this because their contract is per-skill, not workflow-shaped |
| **No lean-doc rule / no line caps** | docs rot faster than code; without caps they become the bottleneck the workflow cannot fix |
| **No task tracker convention (no TODO.md §8)** | the orchestrator must be able to find "what's next" without a project-management tool. superpowers defers this; we don't |

---

## Guardrails this philosophy imposes on reviewers

1. **"Just copy superpowers"** is not a reviewable argument. Point to the specific pattern, read the table above, and propose either (a) adding a row with a concrete home, or (b) overturning a rejection with new evidence.
2. **New skill without a gate owner** ≠ new capability. First declare which gate it runs inside, or propose a mode change. Skills that live "outside the flow" silently become un-gated dependencies.
3. **"This gate slows me down"** is the signal the gate is working, not failing. Propose a new *mode* if a task shape genuinely shouldn't cross that gate; do not weaken the gate for every mode.
4. **Hard stop friction** gets a post-mortem, not a bypass. If a hard stop fires incorrectly, the fix is a more precise trigger, never a disabled trigger.

---

## What could change this document

- A hard stop that empirically never fires for 4+ quarters — candidate for removal (MAJOR bump, documented).
- A mode that has no distinct gate/budget/agent configuration vs another mode — candidate for merge (MAJOR bump).
- A repeated contributor complaint about a rejection in the table above — re-open the row with new evidence; reject or adopt explicitly.
- Upstream Claude Code spec changes that invalidate an assumption (CC_SPEC owns that).

A year-long silence on any guardrail means it's working, not irrelevant. Don't interpret quiet as stale.
