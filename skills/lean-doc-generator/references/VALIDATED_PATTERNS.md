---
owner: Tech Lead
last_updated: 2026-04-29
update_trigger: New pattern promoted from Session Close; pattern found wrong or outdated
status: current
---

# Validated Session Patterns — History & Rationale

> WHY each rule in SKILL.md exists. Distilled from real session corrections.
> The rules themselves are embedded in the execution steps (SKILL.md Steps 0–7, Pre-delivery checklist).
> This file exists ONLY to explain the rationale so future maintainers understand the origin.

---

## Session: Sprint Lifecycle Upgrade (2026-04-29) — Paxel payment-aggregator-client, Tier 2

**Background:** Original skill had sprint *planning* (TODO.md Active Sprint) but no sprint *execution* artifact. Mid-sprint decisions, file changes, deviations, and review handoff scattered across git diff and chat. Reviewer could not audit AI work without re-reading every commit. CHANGELOG `File | Change | ADR` table also too compressed — stripped the WHY needed for review.

**Upgrade — Per-sprint file as source of truth**
Original TODO.md held inline sprint plans. Reviewer had no structured place to read WHY each change was made.
→ Rule: New file type `docs/sprint/SPRINT-NNN-<slug>.md`. Lifecycle: planning → active → closed. Plan frozen at kickoff. Execution Log + Files Changed + Decisions + Open Questions + Retro append-only during sprint.
→ Rule: Sprint = one slice of one PRD (PRD external, link only). Multiple sprints if PRD complex.
→ Rule: One sprint = two commits: `sprint(NNN): plan locked` at promote, squash `sprint(NNN): <summary>` at close. PR = when full PRD done (may span multi-sprint).

**Upgrade — TODO.md slim down**
TODO.md had a `## Changelog` section that grew unbounded, and an `## Active Sprint` section with inline plan duplication.
→ Rule: Drop `## Changelog` section entirely from TODO.md — CHANGELOG.md owns it.
→ Rule: `## Active Sprint` = single pointer line `→ docs/sprint/SPRINT-NNN-<slug>.md` or `— none —`. NO inline plan duplication.
→ Rule: Backlog stays raw `[ ] task — why`. Decomposition JIT at sprint promote, not at backlog-add.

**Upgrade — CHANGELOG.md becomes pointer index**
Old CHANGELOG had file-by-file tables that duplicated sprint file detail and went stale.
→ Rule: CHANGELOG.md = one block per sprint with sprint file link, plan/close commits, summary, docs updated, ADRs, file/test counts. NO file-by-file table.
→ Rule: Detail lives in sprint file forever. Reviewer clicks sprint file link for full context.

**Upgrade — 3 new lifecycle protocols (Sprint Promote / Execute / Close)**
Moved to `reference/SPRINT_PROTOCOLS.md`. Step 7 Sprint Promote — pick backlog → decompose with clarify questions (acceptance, edges, files, tests, risk, deps, ADR-needed, DoD, confidence) → write sprint file `status: planning` → user approve → flip `status: active` → commit `plan locked`. Plan frozen post-approval.
Step 8 Sprint Execute — append Execution Log on decisions/surprises/task-done. Append Files Changed row per file touched. Sync TEST_SCENARIOS.md on test add. Refuse plan edits and HOW prose.
Step 9 Sprint Close — verify all DoD ticked + git diff covered + docs synced → fill Retro → flip `status: closed` → prepend CHANGELOG pointer row → clear TODO Active Sprint → squash-commit.

**Upgrade — context-load discipline**
AI auto-pulled all sprint files, burning context on closed history.
→ Rule: AI_CONTEXT.md Context Load Order declare active sprint file as L2 conditional. Closed sprint files = L3 (lazy load only when query references past sprint). Context cost stays flat as sprint count grows.

**New anti-patterns added:**
HOW in Sprint File · Frozen Plan Edited · Sprint File Bloat (>400 lines) · CHANGELOG Detail Regression · Concurrent Active Sprints · Undecomposed Promotion · Closed Without Retro · Orphan Sprint Pointer.

**Confirmed user choices:**
1. Sprint = per PRD (external link), multi-sprint if PRD large
2. Team usage, AI primary coder
3. One sprint = two commits (plan + squash close), PR = PRD done
4. PRD external (Linear/Notion/etc), no in-repo PRD doc type
5. JIT decomposition at promote, not backlog-add

---

## Session: OpenViking Alignment (2026-03-13) — Skill upgrade, all tiers

Deep analysis of OpenViking's 4 core philosophies against the lean doc standard revealed 7 structural gaps. All 7 were incorporated into SKILL.md and DOCS_Guide.md.

**Gap A — AI_CONTEXT.md lacked a 4-line abstract header**
No L0 entry point existed. AI had to read the whole file to understand its purpose.
→ Rule: Always generate `## Context Abstract` as the first section of AI_CONTEXT.md. 4 lines: system, phase, stack, load_next.

**Gap B — No load-order contract declared**
AI assistants had no instruction on which file to open first. Default behavior = load everything.
→ Rule: Always generate `## Context Load Order` in AI_CONTEXT.md. Declare L0 → L1 → L2 sequence explicitly with per-file load conditions.

**Gap C — No query routing table**
AI guessed which file to open for which question type. Wrong file first = wasted context window.
→ Rule: Always generate `## Navigation Guide` in AI_CONTEXT.md. A routing table: question type → file → escalation path.

**Gap D — ARCHITECTURE.md had no load-trigger declaration**
AI loaded ARCHITECTURE.md for routine tasks that only needed AI_CONTEXT.md.
→ Rule: ARCHITECTURE.md template header now declares its load trigger conditions. Add "Load this file when:" to the first section of every generated ARCHITECTURE.md.

**Gap E — No cross-file scope map**
AI had no compact reference for what exclusively lives in each of the 5 core files.
→ Rule: Always generate `## Doc Scope Map` in AI_CONTEXT.md. One line per file. What lives there exclusively.

**Gap F — No session-end extract step**
Self-evolution only triggered on user correction. No proactive "what changed this session" summary.
→ Rule: Step 7 is now mandatory. Always run session close summary before ending any generation session.

**Gap G — No session-start staleness scan**
Stale docs (status: stale / needs-review) entered generation as source of truth without challenge.
→ Rule: Step 0 is now mandatory. Always scan ownership headers before generating from existing docs.

---

## Session: Keloola (2026-03-01) — Next.js PWA, Tier 2

**Correction 1 — Never assume npm**
Skill defaulted to npm in every command. User rejected: "please use pnpm not npm."
→ Rule: Always ask package manager in Step 5 Q1. Never write any install/run command before confirmed.

**Correction 2 — Never assume Docker for local dev**
Skill included `docker-compose` in SETUP.md. User rejected: "we not use docker."
→ Rule: Ask Step 5 Q2. Remote managed services (Supabase, PlanetScale, Neon) = env-var-only setup. No `docker` commands.

**Correction 3 — MVP phase scope must be confirmed before documenting services**
Skill included Arcjet, Zenziva, Resend, Sentry from planning docs. User rejected: "for early not use that, this phase will be MVP we with minimal cost."
→ Rule: Ask Step 5 Q3. Any service in planning docs not confirmed in-scope for this phase must be omitted. If a free replacement exists, document that instead and write an ADR for the deferral decision.

**Correction 4 — Frontend stack must be explicitly confirmed**
Skill had no frontend detail until user said: "please add Tailwind CSS + shadcn/ui + Semantic Tokens, TanStack Query + Zustand + TanStack Table + Zod, Lucide React, Framer Motion."
→ Rule: Ask Step 5 Q4. Package manifests rarely contain the full design system or animation choices. Always ask before writing AI_CONTEXT.md stack line or ARCHITECTURE.md patterns.

**Correction 5 — Multi-layer data access must be scoped explicitly**
Skill didn't initially capture the Prisma (data) / Supabase JS (auth+storage+realtime) split.
→ Rule: Ask Step 5 Q5 whenever two DB/auth clients appear in the stack. Document the exclusive responsibility of each in ARCHITECTURE.md Security Boundaries and AI_CONTEXT.md Patterns.

**Correction 6 — Line limits exceeded multiple times before delivery**
README.md exceeded 50 lines twice. SETUP.md exceeded 100 lines once.
→ Rule: Use the Line Budget Rule (DOCS_Guide.md §11). Count lines explicitly before finalizing. Never estimate.

---

## Session: Keloola (2026-03-13) — AI_CONTEXT.md Current Focus bloat

**Correction 9 — § Current Focus accumulated 41 sprints of history**
Every sprint appended to `§ Current Focus` because the instruction said "update AI_CONTEXT.md when new patterns are introduced" but never said where. History accumulated until the file hit 149 lines (50% over limit).
Root cause: two missing rules — no cap on § Current Focus, no rule against duplication between § Current Focus and § Patterns.
→ Rule: § Current Focus is **3 lines max**: `status` (phase), `active` (current sprint), `history` (pointer to TODO.md + git log). Never write sprint history there.
→ Rule: New patterns from a sprint go into § Patterns / § Conventions / § Do Not ONLY. If already captured there, it is covered — never duplicate into § Current Focus.
→ Anti-patterns added: "Current Focus Creep" and "Duplicate Truth (cross-doc)".

---

## Session: Keloola (2026-03-13) — TODO.md template alignment

**Correction 7 — TODO.md template was missing Changelog rule and Sprint sizing rules**
Keloola's TODO.md evolved during sprints to include two blocks not in the skill template:
(a) An explicit "Changelog rule" bullet in the How to use header.
(b) A "Sprint sizing rules" block — without it, AI defaulted to single-task sprints or mismatched groupings.
→ Rule: Always include "Changelog rule" bullet and "Sprint sizing rules" block in the How to use header. Use "Sprint completed" not "Task completed".

**Correction 8 — Minor wording improvements**
"update backlog with new findings" → "any new findings".
"note it in the Changelog" → "note it in the next Changelog entry".

---

## General — TODO.md Lifecycle Rules

**Rule 1 — TODO.md is a session protocol, not just a task list**
→ Always generate the full "How to use" header block. Never omit it.

**Rule 2 — Completed tasks must be cleaned immediately, not accumulated**
→ The "Task completed" instruction is mandatory: remove from Active Sprint → add Changelog row → update the relevant doc.

**Rule 3 — Changelog rows capture the doc sync, not just the task**
→ Changelog table must have columns: `File | Change | ADR`. Never use plain prose.

**Rule 4 — Quick Rules section eliminates doc-switching during coding**
→ Always generate a Quick Rules section. Populate from AI_CONTEXT.md Patterns + Conventions sections.

**Rule 5 — README.md must link to TODO.md as the session entry point**
→ Update README.md template to include a "Working on This Project" section linking to TODO.md whenever TODO.md is generated.

---

## Patterns: Document Writing Quality

These patterns were validated across multiple sessions and apply to all generated documents.

**Pattern: Sprint Changelog Row Format**
Format: `| \`filename\` | [brief description of change] | [ADR-NNN or "none"] |`
Why: Keeps CHANGELOG scannable without reading prose. ADR link makes every change traceable.

**Pattern: ADR Context Block — Jobs-to-be-Done Framing**
Format: "We need [capability] because [user/business need]. Without it, [consequence]."
Why: Forces specificity. Prevents generic context like "we wanted to improve scalability" that tells future maintainers nothing.
Anti-pattern: "We decided to use X because it is better than Y." — "Better" is undefined and not falsifiable.

**Pattern: Ownership Header — Specific `update_trigger`**
Anti-pattern: `update_trigger: "When things change"` — too vague to act on.
Pattern: `update_trigger: "New endpoint added; auth strategy changes; dependency major version bump"`
Why: Specific triggers give maintainers a scannable checklist. Vague triggers get ignored and docs go stale.

**Pattern: SETUP.md — Version Pinning in Prerequisites**
Format: `Node.js >= 18.0.0 (tested on 20.11.0)` — minimum version + tested version.
Why: The minimum version tells CI what to enforce. The tested version tells developers what won't have surprises.

**Pattern: ARCHITECTURE.md — Layer Diagram Before Directory Tree**
Order: Layer diagram first (dependency rule visible immediately), directory tree second.
Why: Reviewers need to orient to the architecture rule before navigating the file tree.

**Pattern: README.md — "What it is not" Section**
For libraries, frameworks, or tools: include a short "What it is not" paragraph adjacent to "What it is".
Why: Explicit non-goals prevent misuse. Users who need what it is NOT should find that out in 30 seconds.

**Anti-Pattern: HOW Content in DECISIONS.md Context Block**
Example: "The AuthService validates JWT tokens by calling `verifyToken()` which decodes the payload using the RS256 key loaded from..."
Fix: "The AuthService is responsible for session validation. See `src/auth/AuthService.ts` for implementation details."
Why: HOW content in ADRs rots as implementation changes. ADRs should survive 3 refactors of the implementation.

**Anti-Pattern: Using README.md as an Architecture Document**
Symptom: README.md contains full layer diagrams and file structure listings past 50-line limit.
Fix: README.md links to ARCHITECTURE.md for structure. Keep README to: description, what it is/isn't, 3–5 setup commands, license.
Why: README is for adoption. Architecture detail belongs in ARCHITECTURE.md.
