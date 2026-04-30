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

## Execution Log

- TASK-111 done 2026-04-30: marketplace.json schema fixed (name, owner, source); README install flow updated to two-step claude CLI command; CC_SPEC.md gains marketplace.json schema section

---

## Files Changed

| File | Task | Change | Risk | Test added |\n|:-----|:-----|:-------|:-----|:----------|\n| `.claude-plugin/marketplace.json` | TASK-111 | schema fixed: name, owner, source simplified to "." | low | no |\n| `README.md` | TASK-111 | install steps updated to two-step claude CLI flow | low | no |\n| `context/research/CC_SPEC.md` | TASK-111 | marketplace.json schema section added | low | no |
|:-----|:-----|:-------|:-----|:-----------|

---

## Decisions

*(append during sprint)*

---

## Open Questions for Review

*(append during sprint)*

---

## Retro

*(fill at sprint close — Worked / Friction / Pattern candidate)*
