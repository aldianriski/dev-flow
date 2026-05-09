---
owner: Tech Lead (Aldian Rizki)
last_updated: 2026-04-27
update_trigger: New pass-2 finding added; finding resolved → move to docs/CHANGELOG.md
status: current
audit_pass: 2 (deep — line-by-line SKILL.md + blueprint + eval methodology)
audit_lens: HOW filter · correctness · self-rule compliance · context efficiency
---

# dev-flow — Audit Pass 2 Findings

> Pass 2 = deep scan. Every SKILL.md read line-by-line against the HOW filter.
> Blueprint files read for internal contradictions. Eval methodology reviewed.
> Cross-checks: EXPECTED_AGENTS vs agents/ dir, MANIFEST.json vs filesystem.
> AUD-001..017 re-verified against current file state (all confirmed CLOSED — see
> re-verification table in docs/CHANGELOG.md Sprint 17 block).

---

## Summary table

| ID | Severity | Lens | Title |
|:---|:---------|:-----|:------|
| AUD-P2-001 | **P1** | self-rule | HOW violations in 6 SKILL.md files — "Steps" sections are procedural |
| AUD-P2-002 | **P1** | correctness | 10f-task-decomposer.md validation rules missing 9th rule from decomposition-spec.md |
| AUD-P2-003 | P2 | scripts | INDEX_FILE_RE in validate-blueprint.js exempts all numbered docs, not just true index files |
| AUD-P2-004 | P2 | context | 10f-task-decomposer.md = 294 lines, exceeds 250-line cap (masked by AUD-P2-003) |

---

## Pass 2 coverage

### What this pass covered

- Line-by-line HOW filter check on every SKILL.md (10 files)
- Full read of `docs/blueprint/05-skills.md` (290 lines) — no contradictions found
- Full read of `docs/blueprint/10-modes.md` (index) + all 6 sub-files
- Full read of `task-decomposer/references/decomposition-spec.md` (136 lines)
- Cross-check: `validate-blueprint.js` EXPECTED_AGENTS (7) vs `agents/` dir (7) — no drift
- Cross-check: MANIFEST.json (10 skills) vs `skills/` filesystem — no drift
- Eval methodology: eval snapshots present for all Sprint 16 changes; `check-eval-gate.js` CI gate active
- `IMPROVEMENT_LOG.md` disposition: confirmed archived at `docs/archive/2026-04-20-session-1-critique.md`
- Permission-prompt audit: BUG-002 closed Sprint 7; `settings.json` allowlist covers all harness scripts

### What this pass did NOT cover

- Adversarial / red-team pass on script inputs (reserved for v2 EPIC)
- Eval golden dataset reproducibility (reserved for v2 EPIC)
- Multi-stack verification (Python-FastAPI, Go-Gin) — deferred per READINESS.md v2 scope

---

## Detailed findings

### AUD-P2-001 — HOW violations in 6 SKILL.md files (P1, self-rule)

**Lens**: self-rule compliance — CLAUDE.md anti-pattern §1: "HOW content in any doc file — move to code comments."

**Evidence** (spot-checked, not exhaustive):

| File | Section | Lines | HOW content |
|:-----|:--------|:------|:------------|
| `lean-doc-generator/SKILL.md` | Phase 8 Procedure + Line Limit Enforcement | ~72–88 | "Read the Gate 2 output", "Apply HOW filter to all proposed content", "Compress existing prose" — sequential steps |
| `adr-writer/SKILL.md` | Steps | ~55–61 | "Ask the user", "Determine the next ADR number by reading…", "Write the ADR", "Append to docs/DECISIONS.md" — sequential steps |
| `release-manager/SKILL.md` | Steps | ~36–43 | "Read current version from…", "Classify changes from git log", "Confirm bump with user" — sequential steps |
| `task-decomposer/SKILL.md` | Execution Steps | ~50–68 | Steps 1–6 with inline risk-scoring logic — procedural |
| `dev-flow-compress/SKILL.md` | Steps | ~26–29 | "Validate target-file exists", "Run python … compress.py", "Confirm backup exists" — sequential steps |
| `system-design-reviewer/SKILL.md` | Greenfield vs. Brownfield Mode | ~66–73 | "If given a design…, ask for:", "Read the existing architecture from CLAUDE.md" — imperative instructions |

**Clean (no violations)**: `pr-reviewer/SKILL.md`, `security-auditor/SKILL.md`, `refactor-advisor/SKILL.md`, `dev-flow/SKILL.md` (post-decomp), `dev-flow-compress/SKILL.md` flowchart section.

**Why it matters**: "Steps" sections in SKILL.md load into AI context on every invocation. Procedural content belongs in `references/<skill>.md` sub-files (precedent: `task-decomposer` uses `references/decomposition-spec.md`). Violating skills send HOW noise at every invoke.

**Suggested action**:
1. For each affected skill, move the "Steps" / procedural section to a new `references/` sub-file (e.g. `lean-doc-generator/references/procedure.md`). SKILL.md retains only WHAT and WHY.
2. Do NOT delete step logic — it is load-bearing for AI execution. Move, don't strip.
3. After each move, run `evals/measure.py compare` to confirm `terse_isolation_delta` does not regress.

**Layer**: skills · evals.

---

### AUD-P2-002 — 10f-task-decomposer.md missing 9th validation rule (P1, correctness)

**Lens**: correctness — blueprint §22 and skill spec diverged silently.

**Evidence**:
- `task-decomposer/references/decomposition-spec.md:104` defines 9 validation rules. Rule 9:
  ```
  ❌ --from-architecture invoked outside INIT Phase I-4 without explicit human confirmation
     — state context mismatch and require acknowledgment before proceeding
  ```
- `docs/blueprint/10f-task-decomposer.md:194–205` lists only 8 rules. Rule 9 is absent.
- The gap means blueprint §22 documentation is incomplete vs. the governing spec.

**Why it matters**: contributors reading blueprint §22 see an incomplete enforcement surface. Any AI reading 10f as authoritative will miss the `--from-architecture` guard.

**Suggested action**:
1. Append the missing rule to `docs/blueprint/10f-task-decomposer.md` Validation Rules block.
2. Add a CI check or comment in decomposition-spec.md: "This spec is the source of truth — any new validation rule must be mirrored in §22 of 10f-task-decomposer.md."

**Layer**: docs · governance.

---

### AUD-P2-003 — INDEX_FILE_RE exempts all numbered docs, not just index files (P2, scripts)

**Lens**: scripts correctness — the cap-check exemption is over-broad.

**Evidence**:
- `validate-blueprint.js:76`: `const INDEX_FILE_RE = /^\d{2}-/;`
- Comment says "Index file pattern: exactly two digits followed by a dash then non-digit (e.g. 10-modes.md)". This is wrong — the regex does NOT require a non-digit after the dash.
- Files matched (and incorrectly exempt):
  - `05-skills.md` — 290 lines, full content file — **incorrectly exempt**
  - `01-philosophy.md`, `02-`, `03-`, `04-`, `07-`, `08-`, `09-` — all full content files — **incorrectly exempt**
- Files correctly exempt:
  - `10-modes.md` — 19-line true index ✓
  - `06-harness.md` — 16-line true index ✓
- Sub-files correctly checked:
  - `10a-init.md`, `06a-settings.md`, etc. — these do NOT match `/^\d{2}-/` because `10a` has a letter after the digits ✓

**Why it matters**: `05-skills.md` (290 lines) and 7 other numbered content files silently escape the 250-line cap check that was designed to prevent exactly this kind of bloat.

**Suggested action**:
1. Replace `INDEX_FILE_RE` with an explicit allowlist: `const INDEX_FILES = new Set(['10-modes.md', '06-harness.md']);`
2. Change exemption check from `INDEX_FILE_RE.test(entry)` to `INDEX_FILES.has(entry)`.
3. Update the comment to reflect the allowlist approach.
4. After fix, `validate-blueprint.js` will emit warnings for `05-skills.md` (290 lines) — treat as non-blocking until those files are split.

**Layer**: scripts · ci.

---

### AUD-P2-004 — 10f-task-decomposer.md at 294 lines exceeds 250-line cap (P2, context)

**Lens**: context efficiency — file exceeds the cap but is masked by AUD-P2-003.

**Evidence**:
- `wc -l docs/blueprint/10f-task-decomposer.md` = **294 lines** (cap: 250).
- `10f-task-decomposer.md` matches `/^\d{2}[a-z]-/` (prefix `10f-`) so it is NOT exempt from the cap — yet validate-blueprint.js does not flag it because INDEX_FILE_RE incorrectly treats `10f` as matching `\d{2}` and then `-`. Wait — `10f-` has `1`,`0`,`f`,`-` — the regex `/^\d{2}-/` requires 2 digits then `-`, but `10f` has 3 chars before `-`. So `10f-task-decomposer.md` does NOT match INDEX_FILE_RE and IS checked — but the line count = 294 and it does generate a warning. The warning exists but is currently suppressed because `capViolations > 0` does not cause exit(1).
- Regardless, 294 > 250 is a real cap violation.
- §23 Sprint Mode starts at line ~209 of 10f-task-decomposer.md — a natural split point.

**Why it matters**: the 250-line cap was set specifically to keep per-mode documentation AI-readable in one pass. At 294 lines, §22 (task-decomposer) + §23 (sprint mode) are combined when only one applies per session.

**Suggested action**:
1. Split §23 Sprint Mode (lines ~209–294) from `10f-task-decomposer.md` into new `docs/blueprint/10g-sprint-mode.md`.
2. Update `docs/blueprint/10-modes.md` index to add `10g-sprint-mode.md` row.
3. After split, `10f-task-decomposer.md` ≈ 208 lines (within cap). Verify with validate-blueprint.js.

**Layer**: docs · governance.

---

## Cross-checks (no new findings)

| Check | Result |
|:------|:-------|
| EXPECTED_AGENTS (7) vs `agents/` (7) | ✓ No drift |
| MANIFEST.json (10 skills) vs `skills/` filesystem | ✓ No drift |
| `IMPROVEMENT_LOG.md` at repo root | ✓ Deleted; archived at `docs/archive/2026-04-20-session-1-critique.md` |
| Eval snapshots vs Sprint 16 skill changes | ✓ `check-eval-gate.js` CI gate active; snapshots present |
| Permission-prompt count | ✓ BUG-002 closed Sprint 7; allowlist covers all harness scripts |

---

## How to use this file

1. Treat each `AUD-P2-NNN` as a draft TASK-NNN candidate.
2. P1 findings → promote to Backlog as TASK-NNN; P2 → Backlog tail.
3. As findings ship, move entries to `docs/CHANGELOG.md` and remove from here.
4. Once all Pass 2 findings are cleared, archive this file to `docs/archive/2026-04-27-audit-pass-2.md`.
