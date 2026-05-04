---
owner: Tech Lead (Aldian Rizki)
last_updated: 2026-05-04
update_trigger: sprint open / close / status change / phase scope change
status: active
plan_commit: 87bb523
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

### 2026-05-04 | T1 done — pending commit
SKILL.md diff complete via local plugin cache (`84cc3c14fa1e/skills/caveman/SKILL.md`, 67 lines, juliusbrussee SHA `ef6050c5e184`) + gh CLI raw fetch (`mattpocock/skills/contents/skills/productivity/caveman/SKILL.md`, 49 lines, mattpocock SHA `b843cb5ea74b`). Both MIT verified via `gh api repos/.../license`.

Output: `docs/research/caveman-skill-diff-2026-05-04.md` (section-level matrix + winner-per-axis + net assessment).

**Key findings:**
- juliusbrussee superior for daily use (intensity levels + wenyan + plugin integration).
- mattpocock superior as minimal-skill reference (49 vs 67 lines).
- Lead paragraph + Pattern line + Wrong/Right examples are byte-identical between variants.
- Hooks/MCP/statusline live OUTSIDE SKILL.md in juliusbrussee (plugin layer); mattpocock has none.
- caveman-shrink MCP rejection rationale strengthened: transport-level rewrite conflates skill discipline with message rewriting.

No new caveman skill in dev-flow recommended — both freely installable; cloning = maintenance burden with no value. Lineage credit only via ADR-020.

### 2026-05-04 | T2 done — pending commit
Eval-harness audit complete. Sources: local plugin cache `84cc3c14fa1e/evals/{llm_run.py,measure.py}` (juliusbrussee SHA `ef6050c5e184`, 105 + 107 lines).

Output: `docs/research/caveman-eval-harness-port-notes-2026-05-04.md` (file-by-file walkthrough + tokenizer parity matrix + snapshot schema + 5 risks for TASK-115).

**Key findings:**
- `llm_run.py` 3-arm runner: baseline / terse-control / per-skill via `claude -p --system-prompt`. Snapshot schema is straight JSON (`metadata` + `prompts` + `arms`).
- `measure.py` uses tiktoken `o200k_base` — OpenAI tokenizer, approximation of Claude BPE; ratios meaningful, absolutes "approximate output-length reduction."
- Node port path: `gpt-tokenizer` (preferred, pure JS, ~1.2M weekly downloads) → `js-tiktoken` fallback → `@dqbd/tiktoken` WASM last resort. Pre-verification step required for byte parity.
- Snapshot schema lock 1:1 with caveman so cross-tool validation works (caveman `measure.py` can read dev-flow snapshots; vice versa).
- 5 risks for TASK-115: tokenizer parity (medium), `claude -p` non-determinism (medium), spawn test coverage (low), Windows space-in-PATH (low), snapshot file growth (low).

**Decision:** Adopt 3-arm pattern (DEC-3); port plan ready (DEC-4); TASK-115 backlog annotation queued for sprint close.

### 2026-05-04 | T3 done — pending commit
ADR-020 written at `docs/adr/ADR-020-caveman-patterns.md`. Status: Accepted. Captures 5 decisions:
- D1: no caveman fork in dev-flow (DEC-1)
- D2: lineage credit to both variants with SHA pins (DEC-2)
- D3: adopt 3-arm eval methodology — port shape locked (DEC-3 + DEC-4)
- D4: reject caveman-shrink MCP middleware (transport-level rewrite conflates skill discipline with bytes-on-wire mutation; loss of code-review signal)
- D5: defer statusline-badge per probe direction (OQ1)

Format follows ADR-019 precedent. Both upstreams MIT confirmed via `gh api repos/.../license`. ADR-020 sequential per Sprint 040 retro pattern; max-ADR check confirmed = 019 before allocation.

---

## Files Changed

| File | Task | Change | Risk | Test added |
|:-----|:-----|:-------|:-----|:-----------|
| `docs/research/caveman-skill-diff-2026-05-04.md` | T1 | NEW (~70 lines) — section-level matrix + winner-per-axis + net assessment | low | — |
| `docs/sprint/SPRINT-041-caveman-compare.md` | T1 | Execution Log + § Decisions DEC-1, DEC-2 rows | low | — |
| `docs/research/caveman-eval-harness-port-notes-2026-05-04.md` | T2 | NEW (~110 lines) — file walkthrough + tokenizer parity + snapshot schema + 5-risk matrix for TASK-115 | low | — |
| `docs/sprint/SPRINT-041-caveman-compare.md` | T2 | Execution Log + § Decisions DEC-3, DEC-4 rows | low | — |
| `docs/adr/ADR-020-caveman-patterns.md` | T3 | NEW (~75 lines) — 5-decision ADR (no fork / lineage / 3-arm port / caveman-shrink reject / statusline defer) | low | — |
| `docs/sprint/SPRINT-041-caveman-compare.md` | T3 | Execution Log + § Decisions DEC-5, DEC-6 rows | low | — |

---

## Decisions

| ID | Decision | Reason | ADR |
|:---|:---------|:-------|:----|
| DEC-1 (T1) | Do NOT fork caveman into dev-flow; document as external reference only | Both juliusbrussee + mattpocock variants freely installable (MIT); cloning creates maintenance burden without value. juliusbrussee already in local plugin cache | ADR-020 |
| DEC-2 (T1) | Lineage credit to BOTH variants in ADR-020 (juliusbrussee primary, mattpocock minimal-skill reference); SHAs pinned `ef6050c5e184` + `b843cb5ea74b` | Two licensed lineages; both MIT; future re-diff needs SHA anchors | ADR-020 |
| DEC-3 (T2) | Adopt caveman 3-arm eval methodology for dev-flow (port shape locked) | Sprint 034 ADR-001 already adopted in spirit; T2 audit confirms portability + locks Node tokenizer choice (`gpt-tokenizer` primary) + snapshot schema 1:1 with caveman | ADR-020 |
| DEC-4 (T2) | TASK-115 implementation deferred to its own sprint; backlog annotation links to T2 research note | Implementation = real-code sprint with separate test surface; out of scope for this decision-only sprint | ADR-020 |
| DEC-5 (T3) | Reject caveman-shrink MCP middleware for dev-flow | Transport-level rewrite conflates skill-internalization discipline with mechanical bytes-on-wire mutation; commit-diff signal lost; review unreviewable | ADR-020 |
| DEC-6 (T3) | Defer statusline-badge contract per Sprint 034 probe direction (line 165); revisit when `dev-flow-compress` hardened | Coupling badge to a not-yet-hardened compression skill is premature; OQ1 carries it forward | ADR-020 |

---

## Open Questions for Review

*(empty — OQ1 + OQ2 land here at close.)*

---

## Retro

*(empty — populate at close.)*
