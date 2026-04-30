---
owner: Tech Lead (Aldian Rizki)
last_updated: 2026-04-30
update_trigger: sprint open / close / status change
status: active
plan_commit: —
close_commit: —
---

# Sprint 027 — marketplace-schema-fix

**Theme:** Plugin marketplace schema fix
**PRD:** Internal — BUG-007 confirmed via user error paste 2026-04-30

---

## Plan

### T1 — TASK-111: Fix .claude-plugin/marketplace.json schema + README install flow

**Why:** `claude plugin marketplace add` fails with schema error — marketplace.json missing required top-level fields and URL references wrong repo.

**Acceptance:**
1. `.claude-plugin/marketplace.json` has top-level `name` (string), `owner` object (`name` + `email`), `plugins` array with `name`, `source: "."`, `description`, `version`
2. URL corrected to `aldianriski/dev-flow`
3. `claude plugin marketplace add https://github.com/aldianriski/dev-flow` succeeds without schema error
4. README install steps updated to two-step marketplace flow
5. `CC_SPEC.md` marketplace.json schema section added

**Files (likely):** `.claude-plugin/marketplace.json` · `README.md` · `docs/CC_SPEC.md`

**Tests:** none (doc-only)

**Risk:** low

**Depends on:** none

**ADR needed:** no

**DoD:**
- [x] marketplace.json has correct top-level fields
- [ ] URL corrected to aldianriski/dev-flow
- [ ] README install steps updated
- [ ] CC_SPEC.md gains marketplace.json schema section

**Confidence:** 90%

---

### T2 — TASK-112: Fix marketplace.json source type — "source type not supported" error

**Why:** `claude plugin marketplace add` fails with "This plugin uses a source type your Claude Code version does not support." `"source": "."` (string) is a newer CC feature; older CC only handles explicit object sources.

**Acceptance:**
1. `marketplace.json` `source` changed from `"."` to `{"source": "github", "repo": "aldianriski/dev-flow"}`
2. Install succeeds on CC versions that support `schema_version: "1.0"`
3. `CC_SPEC.md` source types table updated with all formats + BUG-008 note

**Files:** `.claude-plugin/marketplace.json` · `context/research/CC_SPEC.md`

**Tests:** none (doc/config-only)

**Risk:** low

**Depends on:** TASK-111

**ADR needed:** no

**DoD:**
- [x] marketplace.json source changed to explicit github object
- [x] CC_SPEC.md source types table updated + BUG-008 note added

**Confidence:** 85%

---

## Execution Log

- TASK-111 done 2026-04-30: marketplace.json schema fixed (name, owner, source); README install flow updated to two-step claude CLI command; CC_SPEC.md gains marketplace.json schema section
- TASK-112 done 2026-05-01: marketplace.json source changed to explicit github object; CC_SPEC.md gains source types table + BUG-008

---

## Files Changed

| File | Task | Change | Risk | Test added |
|:-----|:-----|:-------|:-----|:-----------|
| `.claude-plugin/marketplace.json` | TASK-111 | schema fixed: name, owner, source | low | no |
| `README.md` | TASK-111 | install steps updated to two-step claude CLI flow | low | no |
| `context/research/CC_SPEC.md` | TASK-111 | marketplace.json schema section added | low | no |
| `.claude-plugin/marketplace.json` | TASK-112 | source changed to explicit github object (BUG-008) | low | no |
| `context/research/CC_SPEC.md` | TASK-112 | source types table + BUG-008 note | low | no |

---

## Decisions

*(append during sprint)*

---

## Open Questions for Review

*(append during sprint)*

---

## Retro

*(fill at sprint close — Worked / Friction / Pattern candidate)*
