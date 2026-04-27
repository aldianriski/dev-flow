---
owner: Tech Lead (Aldian Rizki)
last_updated: 2026-04-27
update_trigger: One-time dogfood record — do not edit after commit
status: current
source: dogfood-session-notes.md (TASK-076)
---

# Dogfood Friction Log — TASK-077 / EPIC-C

Compiled from `docs/research/dogfood-session-notes.md`. Task: TASK-001 (error
handler middleware), mode: full, project: examples/node-express/.

---

## Friction Items

| Phase | Description | Severity | Suggested fix |
|:------|:------------|:---------|:--------------|
| 0 — Parse | `tracker: "none — reason"` format is ambiguous. Phase 0 hard stop fires on `tracker "none" without justification` — the justification is inline but the rule doesn't specify the format. | Low | Add a note to phases.md Phase 0: `tracker "none — <reason>"` satisfies the justification requirement. |
| Gate 0 | Typing 'design' prompt feels slow for single-layer tasks. Teams in a pairing session may find the confirmation overhead high for obvious-scope tasks. | Low | Consider adding a `--fast` flag to Gate 0 for tasks already marked `scope: quick` + `risk: low`. Not needed for v1. |
| 3 — Implement | `set-phase.js` path resolution in a subdirectory project requires explicit `CLAUDE_PLUGIN_ROOT` or relative path from project root. Easy to misconfigure if the orchestrator doesn't know the project root. | Medium | Document the correct invocation in `phases.md` Phase 3 with the `${CLAUDE_PLUGIN_ROOT:-.claude}/scripts/set-phase.js` pattern and a note that this path is relative to the project root, not the dev-flow repo root. |
| 4 — Validate | No lint config in examples/node-express makes Phase 4 vacuously pass. Reduces enforcement value. | Medium | Add minimal `package.json` scripts entry: `"lint": "node --check src/**/*.js"` (Node built-in syntax check) or add ESLint config. Do this before TASK-091 team validation so lint is meaningful. |
| Gate 2 | 'commit' prompt confused with 'yes' by muscle memory. Correctly rejected by orchestrator, but caused one unnecessary re-prompt. | Low | Add a note to phases.md Gate 2 callout box reminding: `'commit' not 'yes'`. |
| 8 — Docs | lean-doc-generator has no fast-exit path for tasks with no doc impact. Phase 8 runs and produces "no changes needed" — adds overhead to simple tasks. | Low | Add a quick-exit rule to phases.md Phase 8: "If no architectural decision made and no public API changed, log reason and close phase." |
| 9 — Commit | Phase 9b CI poll is a no-op when no CI pipeline exists. Requires explicit skip acknowledgment, which disrupts flow. | Low | phases.md Phase 9b: add note "If project has no CI, skip 9b explicitly and note it in session close." |

---

## What Worked Well

- **Gate 1 design plan format** was clear and unambiguous. Micro-task list (file, action, verification) gave precise implementation guidance.
- **code-reviewer + security-analyst** correctly handled a 4-arity Express signature without false-positive flagging. Accurate domain knowledge.
- **Session Close format** was complete and easy to execute. Changelog row format (File | Change | ADR) worked well.
- **Acceptance criteria** on TASK-001 were precise enough to skip Phase 1 (Clarify) entirely — a signal of a well-written task spec.
- **Hard stop: no false positives**. No hard stops fired incorrectly during the session. All guards behaved as expected.
- **TDD contract (Phase 5)** worked correctly even with zero prior tests: RED test failed as expected before file creation.

---

## Recommended Follow-up Tasks

- **TASK-NEW-A** (P2): Add minimal lint config to `examples/node-express/` — `package.json` scripts.lint entry or `.eslintrc.json`. Makes Phase 4 non-vacuous. Do before TASK-091.
- **TASK-NEW-B** (P2): Add Phase 0 clarification to `phases.md`: `tracker "none — <reason>"` satisfies the justification rule. One-line addition.
- **TASK-NEW-C** (P3): Investigate Gate 0 fast-exit for `scope: quick` + `risk: low` tasks. Potential `quick` mode improvement for v2.
- **TASK-NEW-D** (P2): phases.md Phase 8 quick-exit rule for no-doc-impact tasks. Reduces overhead for simple middleware/utility tasks.
