---
owner: Tech Lead (Aldian Rizki)
last_updated: 2026-05-04
update_trigger: sprint open / close / status change / phase scope change
status: planning
plan_commit: pending
close_commit: pending
---

# Sprint 041 — EPIC-Audit Phase 4b (Caveman compare)

**Theme:** Compare `juliusbrussee/caveman` plugin vs `mattpocock/skills/.../caveman` skill — diff SKILL.md, audit eval-harness for future port (TASK-115), reject caveman-shrink MCP, lock decisions in ADR-020. Defer statusline-badge contract per probe direction.
**Mode:** mvp · **Driver:** Tech Lead · **AI:** Claude Opus 4.7
**Predecessor:** Sprint 040 closed `3fec973`.
**Successor:** Sprint 042 (EPIC-Audit Phase 4c — Superpowers patterns).

---

## Why this sprint exists

Sprint 034 external-refs probe (`docs/audit/external-refs-probe.md`) classified caveman patterns as the highest-leverage external ref — three open questions remain after the cached probe:

1. **Two caveman variants.** `juliusbrussee/caveman` (full plugin: hooks, MCP, statusline) and `mattpocock/skills/skills/productivity/caveman/SKILL.md` (skill-only). dev-flow has caveman plugin installed locally — line-by-line diff missing.
2. **Eval harness shape.** `juliusbrussee/caveman` ships `evals/llm_run.py` + `measure.py` — 3-arm methodology (baseline / terse-control / skill-arm) already adopted in spirit (Sprint 034 ADR-001). dev-flow has structural-only `scripts/eval-skills.js`. Port to behavioral 3-arm is reserved as TASK-115 in its own sprint — Sprint 041 audits the source for port readiness.
3. **caveman-shrink MCP.** Caveman ships an optional MCP middleware that compresses Claude Code messages on-the-fly. Probe rejected adoption (line 71); ADR needed to lock the decision so future contributors don't re-litigate.

Sprint 041 lands all three as research notes + ADR-020. Statusline-badge contract (probe line 165) deferred to OQ1 — wait until `dev-flow-compress` hardened.

This is Sprint 040's twin: decision-only sprint, gh CLI primary for any github fetches, ADR-020 sequential after ADR-019.

---

## Open Questions (lock at promote)

*(All decompose answers accepted on user approval 2026-05-04. Resolutions:)*
- (a) **Local plugin cache stability** — caveman plugin at `C:/Users/HYPE AMD/.claude/plugins/cache/caveman/caveman/84cc3c14fa1e/` may rotate. Fallback chain: local cache → gh CLI fetch of `juliusbrussee/caveman`. Note actual source per task.
- (b) **mattpocock caveman path** — probe references `mattpocock/skills/skills/productivity/caveman/SKILL.md`. Verify path via `gh api repos/mattpocock/skills/contents/skills/productivity` first; if moved, fall back to repo-tree search.
- (c) **Statusline-badge decision (OQ1)** — explicitly deferred to retro per probe direction. Re-evaluate in Sprint 042+ once `dev-flow-compress` hardened.
- (d) **Backup-on-write semantics (OQ2)** — `dev-flow-compress` creates `<stem>.original.md` (SKILL.md line 14). Caveman-compress backup convention may diverge — surface as P2 backlog item if found, do not decide in 041.

---

## Plan

### T1 — Diff caveman-plugin vs mattpocock-caveman SKILL.md (line-by-line)
**Scope:** quick · **Layers:** docs, governance · **Risk:** low · **AFK**
**Acceptance:** `docs/research/caveman-skill-diff-2026-05-04.md` exists with: (a) source paths + commit SHAs for both variants, (b) section-level present/absent matrix, (c) intensity-mode support diff, (d) hooks-contract diff, (e) winner-per-axis with rationale. § Decisions row in sprint file: divergences summary + winner-per-axis.
**Source:** local caveman plugin cache (primary) + gh CLI raw fetch (mattpocock, plus juliusbrussee verification SHA).
**Depends on:** none.
**Note:** Verify mattpocock path via `gh api repos/mattpocock/skills/contents/skills/productivity` first. If path moved, search repo tree.

### T2 — Audit caveman `evals/llm_run.py` + `measure.py` for 1:1 port to JS
**Scope:** quick · **Layers:** docs, scripts (research only) · **Risk:** low · **AFK**
**Acceptance:** `docs/research/caveman-eval-harness-port-notes-2026-05-04.md` exists with: (a) file-by-file walkthrough of `llm_run.py` + `measure.py` (WHAT each does), (b) tiktoken→`gpt-tokenizer`/`js-tiktoken` Node substitution plan + token-count parity risk, (c) snapshot-JSON schema for dev-flow port, (d) gaps/risks for TASK-115. § Decisions row: "Adopt 3-arm pattern Y/N + port plan ready Y/N."
**Source:** local caveman plugin cache (primary, Python files) + gh CLI raw fetch as fallback.
**Depends on:** none (parallel with T1).
**Note:** READ-ONLY audit. No code written. Implementation lands in TASK-115's own sprint with reference back to this research note.

### T3 — ADR-020: Caveman patterns adoption decisions
**Scope:** quick · **Layers:** governance, docs · **Risk:** low · **HITL** *(reviewer must verify ADR completeness)*
**Acceptance:** `docs/adr/ADR-020-caveman-patterns.md` exists, status Accepted, format follows ADR-019 precedent (Context / Decision / Alternatives / Consequences / References). Captures: (a) T1 winner-per-axis + lineage credit (juliusbrussee/caveman MIT + mattpocock variant if licensed); (b) T2 port plan acceptance; (c) caveman-shrink MCP rejection rationale; (d) statusline-badge defer rationale (cross-link OQ1).
**Depends on:** T1, T2.
**Note:** ADR file convention `docs/adr/ADR-NNN-*.md` per Sprint 039 ADR-016 + Sprint 040 ADR-019 precedent. Sequential numbering — ADR-020 confirmed via grep `docs/adr/` + `docs/DECISIONS.md` (max = 019).

---

## Dependency Chain

```
T1 ─┐
    ├─→ T3
T2 ─┘
```

T1 + T2 parallelizable (independent sources: T1 = SKILL.md files, T2 = Python eval scripts; separate output files). Sprint-bulk overlap-gate would clear them as parallel candidates. Executed sequentially in this single-conversation session (interleavable in principle). T3 depends on both.

---

## Cross-task risks

- **gh CLI primary policy** (Sprint 040 codified). Drop leading slash on Git Bash (Sprint 040 retro). Fallback: WebFetch → cached probe summary.
- **Local plugin cache rotation** — if `C:/Users/HYPE AMD/.claude/plugins/cache/caveman/caveman/84cc3c14fa1e/` is gone at execution, fall back to gh CLI fetch of `juliusbrussee/caveman`. Lock SHA in research notes regardless of source.
- **mattpocock variant path drift** — probe path may be stale. Verify via gh CLI dir-list before raw fetch.
- **tiktoken parity (T2)** — Node tokenizer must match Python tiktoken counts for snapshot determinism. Surface as port-risk in T2 research note; not in scope to resolve here.
- **Decision-only sprint** — no skill/agent/hook/code changes. Routing: T1+T2 → `docs/research/`, T3 → `docs/adr/`. release-patch should skip-bump per docs-only diff.
- **ADR-020 sequential numbering** — max ADR = 019 (Sprint 040 just landed). ADR-020 confirmed safe.

---

## Sprint DoD

- [ ] T1 `docs/research/caveman-skill-diff-2026-05-04.md` exists with section-level diff + winner-per-axis. § Decisions row landed.
- [ ] T2 `docs/research/caveman-eval-harness-port-notes-2026-05-04.md` exists with file walkthrough + tiktoken parity risk + snapshot schema. § Decisions row landed.
- [ ] T3 `docs/adr/ADR-020-caveman-patterns.md` exists, status Accepted, captures T1+T2 + caveman-shrink reject + statusline defer cross-link.
- [ ] Plan-lock commit landed before any T1..T3 commit.
- [ ] Close commit + CHANGELOG row + TODO update + retro.
- [ ] OQ1 (statusline-badge) and OQ2 (backup-on-write divergence) recorded in § Open Questions for Review.

---

## Execution Log

*(empty — populate per task close.)*

---

## Files Changed

*(empty — populate at close.)*

---

## Decisions

*(empty — T1, T2 land rows here; T3 ADR pointer.)*

---

## Open Questions for Review

*(empty — OQ1 + OQ2 land here at close.)*

---

## Retro

*(empty — populate at close.)*
