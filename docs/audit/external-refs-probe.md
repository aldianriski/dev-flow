---
owner: Tech Lead (Aldian Rizki)
last_updated: 2026-05-01
purpose: Anchor for Phases 4a-d external-ref deep audits
status: current
---

# External References Probe

Surface-level scan of 4 external repos cited as influences. Findings drive deep-dive sprints (Phases 4a-d, Sprints 38-41). Per repo: 5 adopt candidates, 3 reject candidates, deep-audit scope. Cap was ~5 fetches per repo; actual usage 1-2 fetches per repo (6 fetches total) — depth limited but sufficient for shortlist.

## Repo: forrestchang/andrej-karpathy-skills

- **URL**: https://github.com/forrestchang/andrej-karpathy-skills
- **License**: MIT
- **Summary**: A `CLAUDE.md` guideline file encoding four behavioral principles attributed to Andrej Karpathy — Think Before Coding, Simplicity First, Surgical Changes, Goal-Driven Execution — packaged as a Claude Code plugin and Cursor rule.

**Structure:**
```
.claude-plugin/
.cursor/rules/karpathy-guidelines.mdc
skills/karpathy-guidelines/
CLAUDE.md
CURSOR.md
EXAMPLES.md
README.md / README.zh.md
```

**Adopt candidates:**
1. **"Verify step" template** — `1. [Step] -> verify: [check]` micro-protocol for goal-driven execution. Cheap to fold into dev-flow's task-decomposer or G2 design output.
2. **"Surgical changes test" wording** — *"Every changed line should trace directly to the user's request"* as a one-line gate phrase. Add to pr-reviewer skill checklist.
3. **EXAMPLES.md pattern** — companion file showing principles applied to before/after code. dev-flow has zero example artifacts; one EXAMPLES.md per major skill could improve trigger accuracy.
4. **`.cursor/rules/*.mdc` mirror** — same content emitted as Cursor rule. Low-cost cross-IDE reach if dev-flow ever wants to ship beyond Claude Code.
5. **README.zh.md bilingual mirror** — pattern of localizing guideline files. Defer; only relevant if dev-flow targets non-English users.

**Reject candidates:**
1. The four principles themselves — already verbatim in `.claude/CLAUDE.md` "Behavioral Guidelines" block. Re-adopting is duplication.
2. Plugin marketplace listing — dev-flow already publishes its own marketplace.json.
3. Per-project file appending install method — dev-flow uses scaffold (`bin/dev-flow-init.js`); appending is weaker.

**Phase 4a deep-audit scope:**
- Read `EXAMPLES.md` end-to-end; assess whether per-skill examples warrant a new `examples/` convention.
- Compare karpathy CLAUDE.md exact wording vs dev-flow's; reconcile any drift in attribution/phrasing.
- Decide on the verify-step micro-protocol as a G2 design-doc field.

## Repo: juliusbrussee/caveman

- **URL**: https://github.com/juliusbrussee/caveman
- **License**: MIT
- **Summary**: A multi-agent (Claude Code, Cursor, Codex, Gemini, Windsurf, ...) skill plugin that compresses LLM output ~65-75% via terse "caveman-speak" and ships a real eval harness measuring token reduction against controls.

**Structure:**
```
.claude-plugin/, .cursor/, .codex/, .windsurf/
agents/         benchmarks/      caveman/
caveman-compress/   commands/    docs/
evals/          hooks/           mcp-servers/caveman-shrink/
plugins/        skills/          tools/
install.sh / install.ps1
```

**Adopt candidates:**
1. **Three-arm eval harness** (`evals/llm_run.py`, `evals/measure.py`, `evals/snapshots/results.json`) — baseline vs terse-control vs skill-arm. The terse control is the load-bearing piece: it isolates *skill* contribution from generic "be brief" effects. Direct fit for TASK-115 minimal eval harness.
2. **Snapshotted results in repo** — deterministic CI by committing `snapshots/results.json`; analysis script (`measure.py`) runs offline with tiktoken. Fits dev-flow's no-API-key-in-CI posture.
3. **`caveman-compress` tool pattern** — rewrites memory file in place, saves `FILE.original.md` backup. dev-flow already has `dev-flow-compress` skill; cross-check that backup-on-write semantics match.
4. **Statusline savings badge** (`CAVEMAN_STATUSLINE_SAVINGS` env var) — surfaces token savings to the human. Cheap UX win if dev-flow adopts compress flow.
5. **Install flag matrix** (`--with-hooks`, `--with-mcp-shrink`, `--with-init`, `--minimal`, `--dry-run`, `--only`, `--force`) — explicit opt-in for invasive features. dev-flow's `bin/dev-flow-init.js` should expose similar flags rather than all-or-nothing scaffold.

**Reject candidates:**
1. 30+ agent target matrix (`AGENTS.md`) — dev-flow is single-agent (Claude Code); cross-IDE breadth is scope creep for a single-engineer scaffold.
2. MCP middleware proxy (`caveman-shrink`) — additional process to maintain; dev-flow has no MCP layer and shouldn't add one for token shaving.
3. Classical Chinese (文言文) intensity mode — pure overshoot for a doc-governance plugin.

**Phase 4b deep-audit scope** *(side-by-side w/ mattpocock/skills caveman variant)*:
- Diff `juliusbrussee/caveman/skills/caveman/SKILL.md` vs `mattpocock/skills/skills/productivity/caveman/SKILL.md` line-by-line — caveman plugin is locally installed and contains both upstreams.
- Audit `evals/llm_run.py` + `measure.py` for 1:1 port to `dev-flow/scripts/eval-harness.js` (TASK-115).
- Decide adoption of statusline savings badge contract.
- Confirm rejection rationale for caveman-shrink MCP server (record as ADR).

## Repo: obra/superpowers

- **URL**: https://github.com/obra/superpowers
- **License**: MIT
- **Summary**: An "agentic skills framework & software development methodology" — composable skills + hooks + agents covering design refinement, planning, TDD, and review across Claude Code, Codex, Cursor, OpenCode, Gemini.

**Structure:**
```
.claude-plugin/   .codex-plugin/   .cursor-plugin/   .opencode/
agents/   assets/   commands/   docs/   hooks/
skills/   scripts/   tests/
package.json   AGENTS.md   CLAUDE.md   GEMINI.md
gemini-extension.json
```

**Adopt candidates:**
1. **`hooks/hooks.json` SessionStart contract** — `{ "matcher": "startup|clear|compact", "command": "${CLAUDE_PLUGIN_ROOT}/hooks/run-hook.cmd session-start", "async": false }`. dev-flow's existing hooks.json should match this matcher exactly — `clear|compact` are easy to forget.
2. **`hooks/run-hook.cmd` shim** — single dispatcher script that routes to named scripts (e.g. `session-start`). dev-flow currently calls `scripts/session-start.js` directly; a shim layer simplifies adding hooks without editing hooks.json.
3. **Acceptance harness pattern** — *"new IDE/CLI integrations must include a session transcript proving the brainstorming skill auto-triggers when given: 'Let's make a react todo list'"*. dev-flow has zero auto-trigger acceptance tests for its skills. Concrete, copyable.
4. **`.github/PULL_REQUEST_TEMPLATE.md` mandatory checklist** — gates PR submission with explicit "have you done X" items. Suits dev-flow's Definition-of-Done discipline.
5. **`tests/` directory at plugin root** — dev-flow has none. Even smoke tests for hook/scripts (session-start, read-guard) would be a dignity floor.

**Reject candidates:**
1. Multi-IDE plugin variants (`.codex-plugin/`, `.cursor-plugin/`, `.opencode/`, `gemini-extension.json`) — single-author scope.
2. `package.json` Node manifest — dev-flow ships markdown + 2 scripts; pulling npm dep tree adds maintenance.
3. The "94% PR rejection rate" maintainer-frustration framing — irrelevant to a single-author repo with no external contributors.

**Phase 4c deep-audit scope:**
- Read `hooks/run-hook.cmd` and `hooks/session-start` source verbatim; design dev-flow shim equivalent (`scripts/run-hook.cmd` or `.js` dispatcher).
- Reconcile dev-flow's `hooks/hooks.json` matcher with `startup|clear|compact` — confirm whether `clear` and `compact` are wired.
- Evaluate skill-auto-trigger acceptance test pattern; pick 3 dev-flow skills to gain test coverage.
- Lift `.github/PULL_REQUEST_TEMPLATE.md` checklist as starter.

## Repo: mattpocock/skills

- **URL**: https://github.com/mattpocock/skills
- **License**: MIT
- **Summary**: A categorized library of agent skills for Claude Code — engineering, productivity, misc — explicitly grounded in software engineering fundamentals, with `CONTEXT.md` domain language reference and `docs/adr/` for decisions.

**Structure:**
```
.claude-plugin/
.out-of-scope/
docs/adr/
scripts/
skills/{engineering,productivity,misc,personal,deprecated}/
CLAUDE.md
CONTEXT.md
README.md
```

**Adopt candidates:**
1. **Skill bucket convention** — `engineering/`, `productivity/`, `misc/`, plus excluded `personal/` and `deprecated/`. dev-flow has 14 flat skills; bucketing improves discoverability and signals lifecycle (deprecated bucket = graceful retirement instead of deletion).
2. **Bucket-level README.md indexing** — each bucket folder has its own README listing skills with one-line descriptions, linking to SKILL.md. Mechanical to generate; aids new-contributor onboarding.
3. **`.out-of-scope/` directory** — explicit "we considered this and said no" surface. Pairs naturally with dev-flow's ADR practice for negative-space decisions.
4. **`docs/adr/` co-located with skills repo** — dev-flow already has adr-writer skill but has no central `docs/adr/` directory pattern enforced. Copying mattpocock's location convention closes that loop.
5. **TDD skill structure** — `name`, `description`, trigger phrases (`"red-green-refactor"`, `"test-first development"`, `"integration tests"`); ~1100 words; cross-references (`tests.md`, `mocking.md`, `deep-modules.md`, `interface-design.md`, `refactoring.md`). dev-flow's `tdd` skill should sanity-check trigger-phrase coverage and reference graph against this.

**Reject candidates:**
1. Skill word counts ~1100 — exceeds dev-flow's 100-line SKILL.md cap. Mattpocock's verbosity is the anti-pattern dev-flow exists to avoid.
2. `npx skills@latest add` install flow — requires npm publishing pipeline; not worth the maintenance for a personal plugin.
3. `setup-matt-pocock-skills/` per-repo configuration scaffolding — dev-flow already has `bin/dev-flow-init.js`.

**Phase 4d deep-audit scope:**
- Diff dev-flow's `tdd`, `diagnose`, `zoom-out`, `task-decomposer` skills against mattpocock's same-named skills; capture trigger-phrase deltas.
- Evaluate skill-bucketing migration cost vs benefit (14 skills, 7 agents — small enough that buckets may be premature).
- Read `mattpocock/skills/CONTEXT.md` end-to-end vs dev-flow's; pick reconciliation strategy.
- Adopt `.out-of-scope/` directory; seed with 3 negative-space ADR pointers.

## Cross-repo synthesis

Patterns appearing in multiple repos = higher-priority adopt:

1. **Karpathy four principles** appear verbatim or near-verbatim in karpathy-skills, are echoed in mattpocock CLAUDE.md philosophy, and are already in dev-flow CLAUDE.md. **Already adopted; lock wording in CONTEXT.md to prevent drift.**

2. **Eval harness with control arms** appears explicitly in juliusbrussee/caveman (`evals/`) and is mandated structurally by obra/superpowers (acceptance harness for skill auto-trigger). dev-flow has zero. **Highest-priority adopt; aligns with existing TASK-115.**

3. **Plugin manifest + hooks.json + run-hook dispatcher** appears in obra/superpowers and juliusbrussee/caveman. **Direct lift candidate for dev-flow's `hooks/`.**

4. **CLAUDE.md + CONTEXT.md split** appears in mattpocock/skills exactly as in dev-flow. **Convergent design; no change needed but document the lineage in CONTEXT.md to credit prior art.**

5. **ADR directory** (`docs/adr/`) explicit in mattpocock; absent in others. dev-flow has an adr-writer skill but no enforced directory. **Adopt path convention.**

6. **Bucketed skills + deprecated/ folder** unique to mattpocock — pairs with dev-flow's release-manager and lifecycle stance. **Adopt only when skill count exceeds ~20.**

7. **Token-savings statusline badge** unique to caveman; **defer until dev-flow-compress flow is hardened.**

8. **Multi-IDE breadth** (Cursor, Codex, OpenCode, Gemini, Windsurf) appears in 3 of 4 repos. dev-flow is single-IDE. **Reject across the board for single-author scope.**

**Recommended phase ordering**: 4c (obra hooks contract — fastest, lowest-risk) -> 4b (caveman eval harness — unblocks TASK-115) -> 4d (mattpocock skill structure — biggest scope) -> 4a (karpathy verify-step — smallest delta, polish).
