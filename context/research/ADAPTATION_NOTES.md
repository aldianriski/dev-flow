# Superpowers → dev-flow Adaptation Notes

---
owner: Tech Lead
last_updated: 2026-04-20
update_trigger: New pattern discovered in superpowers; dev-flow file/skill owner changes; pattern rejected after trial
status: current
source: https://github.com/obra/superpowers (baseline study, 2026-04-20)
related: context/research/CC_SPEC.md · context/workflow/DESIGN_PHILOSOPHY.md (pending)
---

> **Purpose.** obra/superpowers is the proven baseline (≈160K ★) for AI-workflow plugins built on Claude Code. dev-flow's **workflow architecture** (gates, modes, hard stops, protocols) is stronger; superpowers' **skill craft** (flowcharts, anti-rationalization, paired examples, eval discipline) is sharper. This file is the import plan: which superpowers patterns we adopt deliberately, where each lands in dev-flow, and the one-line rationale. No implementation here — only bindings and rejections.

> **Scope rule.** A pattern lands in this table only if we have a concrete home for it in dev-flow. Patterns with no home are not adopted, even if they look nice. Patterns we reject go in §3 with the reason.

---

## 1 · Craft patterns we ADOPT

Applied during Sprint 3 (`TASK-013..019`) unless otherwise noted.

| # | Superpowers pattern | Where in dev-flow | Rationale (one line) |
|:--|:---|:---|:---|
| 1 | GraphViz `dot` flowcharts in SKILL.md for non-obvious decisions | every orchestrator/decomposer/review SKILL.md (TASK-014, 015, 018) | decision logic is the part AI gets wrong silently — diagrams remove ambiguity |
| 2 | "Red Flags" anti-rationalization table (`You think…` / `But actually…` / `Do instead`) | `dev-flow/SKILL.md`, `task-decomposer/SKILL.md`, `security-auditor/SKILL.md` (TASK-014, 015, 018) | the skills that most need discipline are the ones AI most likes to skip — name the excuse so the skill can refuse it |
| 3 | `<Good>` / `<Bad>` paired examples | every skill with ambiguous outputs — especially `adr-writer`, `lean-doc-generator`, `pr-reviewer` (TASK-018) | contrastive examples beat prose rules for reshaping model behavior |
| 4 | `type: rigid \| flexible` skill frontmatter label | `.claude/skills/*/SKILL.md` project convention (TASK-013, document in `docs/blueprint/05-skills.md`) | tells the agent whether to follow the skill verbatim or apply judgment — we already had this concept informally; give it a field |
| 5 | Model selection per task complexity (haiku / sonnet / opus) | subagent frontmatter `model:` field (TASK-016); blueprint §4 already has this — tighten guidance in `docs/blueprint/04-subagents.md` | superpowers picks per-agent; we pick per-agent **and** per-mode (hotfix uses sonnet, full review uses opus) |
| 6 | Implementer status enum: `DONE / DONE_WITH_CONCERNS / NEEDS_CONTEXT / BLOCKED` | subagent tiered-output contract (TASK-016); blueprint §4 currently returns `{severity, findings, ...}` only — add `status:` | richer than severity alone; tells orchestrator whether to gate-pass or re-queue |
| 7 | RED-GREEN-REFACTOR applied to skill authoring | `docs/blueprint/12-skill-testing.md` (new, Sprint 5 TASK-026); write failing pressure-test first, then skill | treats skills as code not prose — forces evidence before a skill can claim to work |
| 8 | Subagent pressure-test scenarios with before/after eval | same TASK-026; required for any skill change that alters agent behavior | mirrors superpowers' eval discipline; protects the gate-driven architecture from regression |
| 9 | `${CLAUDE_PLUGIN_ROOT}` for portable plugin-relative paths | `.claude/settings.json` (TASK-012), all hook command lines | verified in CC_SPEC; lets the scaffold work from both project-local and plugin-install paths |
| 10 | `when_to_use:` trigger field on SKILL.md | project-convention field (TASK-013, TASK-019) | agentskills.io `description` must stay concise + third-person; `when_to_use` carries multi-line trigger guidance without bloating description |
| 11 | SessionStart matcher `startup\|resume\|clear\|compact` | `.claude/settings.json` (TASK-012) | CC_SPEC confirms all four; superpowers only uses three (missing `resume`) — adopt the fuller set |
| 12 | `context: fork` for isolation-critical skills | `lean-doc-generator/SKILL.md`, `security-auditor/SKILL.md` (TASK-013) | CC_SPEC confirms this is a real CC extension; use it where skill output must not be polluted by caller context |
| 13 | `using-<plugin>` meta-skill (plugin entry skill that routes to others) | `dev-flow/SKILL.md` **is** this — keep the pattern, rename to `dev-flow` for clarity (TASK-014) | users type `/dev-flow <mode>`; one entry point, six modes inside |
| 14 | `writing-skills` skill (skill-authoring standards captured as an invokable skill) | `.claude/skills/writing-skills/SKILL.md` (TASK-013 or Sprint 4 TASK-020) | future contributors will author new skills — codify the standard as a skill, not buried in blueprint prose |
| 15 | `subagent-driven-development` pattern (use subagents to parallelize exploration) | already in blueprint §4; make it explicit via a `parallel-exploration` skill OR note in `dev-flow/SKILL.md` (TASK-014) | superpowers has a dedicated skill for this; decide at TASK-014 authoring time whether to split |
| 16 | `using-git-worktrees` skill for isolated parallel work | Sprint 5 `TASK-027-ext` (new) or import as-is during Sprint 3 if cheap | useful for hotfix mode running alongside long-running review mode; not on critical path |
| 17 | Separate `references/` folder next to SKILL.md for heavy content | `.claude/skills/<name>/references/*.md` (TASK-013 onwards) | keeps SKILL.md under 100 lines (lean-doc rule) while allowing deep content on demand |
| 18 | `.cmd` + `.sh` dispatcher pair for cross-platform hook scripts | deferred — we go pure-Node instead | superpowers uses shell; our CC_SPEC + Quick-Rules mandate pure Node ≥18 for Windows Git Bash parity |
| 19 | `code-reviewer` agent naming and structure | keep our `code-reviewer.md` (TASK-016); borrow their tool allow-list / output format if superior | we already planned this agent; don't reinvent if superpowers' version is solid |
| 20 | Multi-platform plugin layout (`.claude-plugin/` · `.codex/` · `.cursor-plugin/` · `.opencode/` · `GEMINI.md` · `AGENTS.md`) | Sprint 5 `TASK-027` (deferred to v2) | structure-now, populate-later so v2 adoption is non-breaking |

---

## 2 · Architecture dev-flow KEEPS (superpowers does NOT have these)

Documented here so future "just be like superpowers" refactor pressure can be rejected with citations. Full rationale → `context/workflow/DESIGN_PHILOSOPHY.md` (TASK-003).

| # | dev-flow architecture element | Why superpowers doesn't need it | Why we do |
|:--|:---|:---|:---|
| A | **3 Gates** (Scope → Design → Review+Security) | skill-centric model trusts each skill individually | we run multi-step workflows where a bad gate-0 decision poisons gates 1 and 2 — explicit gates catch drift early |
| B | **6 Modes** (init / full / quick / hotfix / review / resume) | single entry point sufficient for their use | our users adopt one starter across very different task shapes; modes stop "one-size prompt" failure |
| C | **27 Hard Stops** catalog | trusts the model + skill | production workflows need a fixed list of refusal triggers (secrets, destructive DB, etc.) that no skill can silently relax |
| D | **Migration / Performance / Hotfix protocols** | not their scope | these are the three highest-risk task shapes; baking the protocol into the starter is the core promise |
| E | **Tiered context cost (1/2/3)** + tiered severity (CRITICAL/BLOCKING/NON-BLOCKING/APPROVED) | uniform cost/severity | lets the orchestrator decide which agent to spawn at what budget — scales better than "spawn everything every time" |
| F | **Lean-doc standard with line caps + HOW filter** | no doc methodology at all | docs in every adopting project are the quiet killer of AI workflows; the lean rule is as important as any skill |
| G | **TDD Iron Law** enforced by gate, not culture | culture-only | gate refuses Gate-2 approval when Iron Law is violated — mechanical, not aspirational |
| H | **TODO.md §8 sprint format** (gated by sizing rules, changelog rotation to `docs/CHANGELOG.md`) | none — superpowers has no task-tracker convention | the adopter repo needs a tracker that the orchestrator can parse without a project-management tool |
| I | **INIT protocol** (bootstrap from empty or partially-bootstrapped repo) | n/a | dev-flow's value is the bootstrap; this cannot be a skill afterthought |
| J | **7 subagents vs their 1** | fewer specialists acceptable in their model | tiered output + gate system needs differentiated specialists (design vs migration vs perf vs security) |

---

## 3 · Superpowers patterns we deliberately REJECT or DEFER

| # | Pattern | Reject / Defer | Reason |
|:--|:---|:---|:---|
| R1 | `.cmd` / `.sh` dispatcher pair for hook scripts | **Reject** | pure-Node scripts are cross-platform already; dispatchers add a layer that must be maintained per-OS for no gain |
| R2 | Plugin marketplace as day-0 distribution | **Defer to v2** (TASK-029) | we ship via `git clone` first; marketplace submission requires multi-platform manifests we're not building yet |
| R3 | Skill-centric workflow (skills orchestrate each other freely) | **Reject** | violates our thin-coordinator rule and the gate model; skills in dev-flow are invoked BY the orchestrator, not by each other |
| R4 | "Spawn everything in parallel" default | **Reject** | tiered context cost means we spawn the cheapest agent that can answer the question; parallel-by-default inflates token cost without gate discipline |
| R5 | Hardcoded model choices inside SKILL.md body | **Reject** | model selection belongs in subagent frontmatter `model:` and blueprint §4 guidance; skills must stay model-agnostic |
| R6 | Relying on `UserPromptSubmit` hook for intent parsing | **Defer / evaluate Sprint 2** | CC_SPEC lists it as real; we plan to rely on the orchestrator skill itself for intent parsing — revisit only if skill-based parsing proves too slow |
| R7 | Skipping the CHANGELOG discipline | **Reject** | semver-tracked blueprint is a dev-flow promise; superpowers doesn't need it because they don't version a methodology |

---

## 4 · Deltas this forces on the scaffold plan

Each row is an existing TODO.md task whose acceptance criterion expands because of a pattern adopted above.

| Task | Additional acceptance criterion from this audit |
|:-----|:---|
| TASK-005 (fix blueprint inconsistencies) | add `type: rigid\|flexible`, `when_to_use:`, `context: fork` as documented project-convention fields in `docs/blueprint/05-skills.md`; add `status:` enum to §4 subagent payload |
| TASK-013 (copy 7 skills) | add `references/` folder pattern to normalized skill layout; add `when_to_use:` + `type:` fields during normalization |
| TASK-014 (dev-flow orchestrator skill) | MUST include Red Flags table, MUST include at least one `dot` flowchart (mode selection), decides whether to keep `subagent-driven-development` as separate skill |
| TASK-015 (task-decomposer skill) | Red Flags table for "I'll just guess the layers" + "I'll skip Socratic clarification" rationalizations |
| TASK-016 (7 subagents) | add `status:` enum alongside `severity:`; tiered-output contract documented in `docs/blueprint/04-subagents.md` |
| TASK-018 (apply craft patterns) | checklist form — `dot` flowchart? Red Flags? Good/Bad pairs? `type:`? `when_to_use:`? `context:` where warranted? — per skill |
| TASK-019 (audit skill descriptions) | add rule: `when_to_use` carries multi-line trigger, `description` stays third-person ≤500 char |
| TASK-026 (skill TDD framework, Sprint 5) | RED-GREEN-REFACTOR + pressure-test eval evidence; gating rule for skill-behavior-affecting changes |
| TASK-027 (multi-platform layout, Sprint 5) | `.codex/` · `.cursor-plugin/` · `.opencode/` · `GEMINI.md` · `AGENTS.md` directory stubs created — populated in v2 |

---

## 5 · Open questions (resolve before Sprint 3)

1. Should `subagent-driven-development` live as a dedicated skill (superpowers pattern) or as a paragraph inside `dev-flow/SKILL.md`? → decide during TASK-014 authoring.
2. Does `context: fork` actually isolate the skill's context window as documented, or only namespace it? → verify empirically during TASK-013; update CC_SPEC if behavior differs.
3. Superpowers' `code-reviewer` agent tool allow-list — is it tighter than what we'd naturally write? → diff during TASK-016; adopt the tighter set where safe.
4. Which of our skills genuinely need `type: rigid` (follow verbatim) vs `type: flexible` (apply judgment)? → draft a first-pass mapping during TASK-013 frontmatter normalization, then review at TASK-018.

---

## 6 · Review cadence

- Re-audit this file every minor bump of superpowers (watch their CHANGELOG).
- Re-audit when a Sprint 3 or Sprint 4 task surfaces a pattern not in §1 — add a row or explain the rejection in §3.
- Any entry in §3 (rejected) that gets raised again in a PR: reviewer closes the PR with a link to the row. Do not re-litigate without new evidence.
