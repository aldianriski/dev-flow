# LEAN DOCUMENTATION STANDARD — Reference

> Version 2.0 — compressed for v2-rewrite. WHY/WHERE only. Never HOW.

---

## §1 — The 4 Laws

| Law | Name | Rule |
|---|---|---|
| LAW 1 | Minimal by Default | No doc created unless absence causes repeated interruptions or mistakes |
| LAW 2 | Owned, Not Shared | Every doc has exactly one owner role; shared = no ownership |
| LAW 3 | Lifecycle-Bound | Every doc has defined create / update / archive triggers |
| LAW 4 | Signal-Dense | Every line carries unique info not already in code; repeating code = delete |

---

## §2 — Core Files

| File | Reader | Max Lines | Update Trigger | Canonical template |
|---|---|---|---|---|
| `README.md` | Anyone | 50 | Project scope changes | `templates/README.md.template` |
| `ARCHITECTURE.md` | Tech lead | 150 | Major structural change — use `docs/blueprint/11-lean-architecture.md` for CA+DDD canonical render (per ADR-029) | `templates/ARCHITECTURE.md.template` (CA+DDD via per-stack substitutions) |
| `DECISIONS.md` | Team | Unlimited | Every significant decision | `templates/DECISIONS.md.template` |
| `SETUP.md` | New dev / CI | 100 | Setup process changes | `templates/SETUP.md.template` |
| `AI_CONTEXT.md` / `CONTEXT.md` | AI assistant | 100 | Patterns or conventions change | `templates/AI_CONTEXT.md.template` |
| `CLAUDE.md` (project AI context) | AI assistant | 80 | Project shape / Session Workflow / anti-patterns change | `templates/CLAUDE.md.template` (CA+DDD + Session Workflow per ADR-029) |
| `TODO.md` | Dev / AI | Unlimited | Backlog change · sprint promote/close · TD section change | `templates/TODO.md.template` (incl. Tech Debt section per TASK-123 F5) |
| `CHANGELOG.md` | Reviewer | Unlimited (append-only) | Sprint closed | `templates/CHANGELOG.md.template` |
| `TEST_SCENARIOS.md` | Dev / QA | Unlimited | New test, coverage gap, suite restructure | — (no template; format inline this guide) |
| `docs/sprint/SPRINT-NNN-<slug>.md` | AI mid-sprint | 400 hard cap | Append during sprint; retro at close | — (format inline this guide §3.9) |
| Per-module `README.md` | Dev | 10 | Module purpose changes | — (no template) |

**Template-as-canonical-format rule:** when a template exists for a doc type, the template IS the canonical format source — NOT this guide's inline format examples. lean-doc-generator MUST consult `templates/<X>.md.template` before generating to verify section ordering, frontmatter shape, and substitution tokens. Templates use bracket-style placeholders (`[Project Name]`, `[source-root]`, `[app-root-line]`, `[test-root-line]`, layer-block) per `bin/dev-flow-init.js applySubstitutions`. If template and inline format diverge → template wins; raise the divergence as a friction item at sprint close.

Rule: before creating any new file → ask "can this live in code comments?" If yes → code.

---

## §3 — Ownership Header (mandatory on every doc)

```yaml
---
owner: [role, not person name]
last_updated: YYYY-MM-DD
update_trigger: [specific event that triggers update]
status: current | needs-review | stale
---
```

Flag if: `status: stale`, `status: needs-review`, `last_updated` >60 days, or no header present.

---

## §4 — ADR Format (DECISIONS.md entries)

```
## ADR-[NNN]: [title]
Date: YYYY-MM-DD | Status: Proposed | Accepted | Deprecated | Superseded by ADR-NNN
Context: [problem + options evaluated]
Decision: [what was decided]
Rationale: [why this over alternatives]
Consequences: + [positive] / - [trade-off]
Reference: [code location]
```

Write ADR when: choosing between non-trivial options · adopting team-wide pattern · reversing prior decision · constraining future choices.
Skip ADR when: single-module choice · no team-wide ripple · implementation detail.

---

## §5 — HOW Filter

| KEEP (WHY / WHERE) | DISCARD (HOW → belongs in code) |
|---|---|
| System purpose, scope boundaries | Implementation details, algorithm steps |
| Component names, single responsibility | Step-by-step code flow, function logic |
| Architectural decisions and trade-offs | Internal library behavior |
| External dependencies, setup commands | What each function does internally |

Discard log: "Skipped: '[detail]' explains HOW → add as comment in `[file]`."

---

## §6 — Tiered Scale Model

| Tier | Team size | Files |
|---|---|---|
| Tier 1 | Solo | README · SETUP · AI_CONTEXT |
| Tier 2 | Small team | + ARCHITECTURE · DECISIONS · TODO · CHANGELOG · TEST_SCENARIOS · sprint/ |
| Tier 3+ | Multi-service | + SERVICE_REGISTRY.yaml · DEPENDENCY_MAP.md · GLOBAL_DECISIONS.md |

---

## §7 — Anti-Patterns

| Anti-Pattern | Response |
|---|---|
| HOW Documentation | Redirect to code comments |
| Orphan Docs (no ownership header) | Add header before touching file |
| Person Ownership ("Alice") | Reassign to role |
| Mega Doc (over line limit) | Split by Core Files spec; never raise limit |
| Concurrent Active Sprints | Block — one at a time |
| Sprint File Bloat (>400 lines) | Block — split the sprint |
| Stale doc used as source | Run staleness scan first |
| File outside core set | Redirect to code or existing Core File |

---

## §8 — Pre-Delivery Checklist

Before delivering any document, verify:
- [ ] Ownership header present and complete
- [ ] No HOW content (every line passes the HOW filter)
- [ ] Under line limit for this file type
- [ ] No person names as owners
- [ ] Status field set correctly
- [ ] All referenced files exist
- [ ] No stale content used as source without flag
