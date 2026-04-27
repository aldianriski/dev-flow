---
owner: Tech Lead (Aldian Rizki)
last_updated: 2026-04-21
update_trigger: New pattern promoted from Session Close; pattern found to be wrong or outdated
status: current
---

# Validated Documentation Patterns

Patterns promoted from Session Close corrections. Each entry was validated in a real session and captures a non-obvious rule that saved a correction later.

---

## Pattern: Sprint Changelog Row Format

**Context**: End of every completed task — Phase 8 / Session Close.

**Format**:
```
| `filename` | [brief description of change made] | [ADR-NNN or "none"] |
```

**Why this works**: Keeps CHANGELOG scannable at a glance without reading prose. The ADR link makes every significant change traceable to its decision record.

---

## Pattern: ADR Context Block — Jobs-to-be-Done Framing

**Context**: Writing the Context section of any ADR.

**Format**: "We need [capability] because [user/business need]. Without it, [consequence]."

**Why this works**: Forces specificity. Prevents generic context like "we wanted to improve scalability" that tells future maintainers nothing.

**Anti-pattern**: "We decided to use X because it is better than Y." — "Better" is undefined and not falsifiable.

---

## Pattern: Ownership Header — Specific `update_trigger`

**Context**: Writing the `update_trigger` field in any ownership header.

**Anti-pattern**: `update_trigger: "When things change"` — too vague to act on.

**Pattern**: `update_trigger: "New endpoint added; auth strategy changes; dependency major version bump"`

**Why this works**: Specific triggers give maintainers a scannable checklist. Vague triggers get ignored and docs go stale.

---

## Pattern: SETUP.md — Version Pinning in Prerequisites

**Context**: Listing prerequisites in `docs/SETUP.md`.

**Format**: `Node.js >= 18.0.0 (tested on 20.11.0)` — minimum version + tested version.

**Why this works**: The minimum version tells CI what to enforce. The tested version tells developers what won't have surprises. They are rarely the same number.

---

## Pattern: ARCHITECTURE.md — Layer Diagram Before Directory Tree

**Context**: Authoring or updating `docs/ARCHITECTURE.md`.

**Order**: Layer diagram first (dependency rule visible immediately), directory tree second.

**Why this works**: Reviewers need to orient to the architecture rule before navigating the file tree. Putting the tree first buries the rule.

---

## Pattern: README.md — "What it is not" Section

**Context**: Writing or updating `README.md` for a library, framework, or tool.

**Pattern**: Include a short "What it is not" paragraph adjacent to "What it is".

**Why this works**: Explicit non-goals prevent misuse and incorrect adoption. Users who need what it is NOT should find that out in 30 seconds, not after installing.

---

## Anti-Pattern: HOW Content in DECISIONS.md Context Block

**What it looks like**: "The AuthService validates JWT tokens by calling `verifyToken()` which decodes the payload using the RS256 key loaded from..."

**Why it fails**: HOW content in ADRs rots as implementation changes. An ADR written about a design choice should survive 3 refactors of the implementation.

**Correction**: "The AuthService is responsible for session validation. See `src/auth/AuthService.ts` for implementation details."

---

## Anti-Pattern: Using README.md as an Architecture Document

**What it looks like**: README.md contains full layer diagrams, dependency rules, and file structure listings that push it past the 50-line limit.

**Why it fails**: README is for adoption ("should I use this / how do I start?"). Architecture detail belongs in `docs/ARCHITECTURE.md`.

**Correction**: README.md should link to `docs/ARCHITECTURE.md` for structure. Keep README to: description, what it is/isn't, how to adopt (3–5 commands), license.
