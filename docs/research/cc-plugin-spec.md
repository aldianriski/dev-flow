---
owner: Tech Lead (Aldian Rizki)
last_updated: 2026-04-27
update_trigger: CC plugin spec changes; TASK-066 manifest needs update; assumption corrected
status: current
source: distilled from context/research/CC_SPEC.md §5 (research dated 2026-04-20)
---

# CC Plugin Layout Contract — dev-flow EPIC-A reference

> **Why this file**: TASK-065 deliverable. Distilled, plugin-only contract that downstream EPIC-A tasks (TASK-066 manifest, TASK-067 path rewrite, TASK-068 README, TASK-069 E2E smoke) consume as their stable referent.
> **Canonical research**: [`context/research/CC_SPEC.md`](../../context/research/CC_SPEC.md). This file does not re-research CC — it scopes CC_SPEC to plugin packaging only.

---

## 1. `plugin.json` schema

| Field | Required? | Type | Source |
|:---|:---|:---|:---|
| `name` | yes | string | CC_SPEC L91 |
| `description` | yes | string | CC_SPEC L91 |
| `version` | yes | string (semver) | CC_SPEC L91 |
| `author` | no | object | CC_SPEC L91 |
| `homepage` | no | string (URL) | CC_SPEC L91 |
| `repository` | no | string (URL) | CC_SPEC L91 |
| `license` | no | string (SPDX) | CC_SPEC L91 |

**Path**: `.claude-plugin/plugin.json` at plugin root.

**dev-flow project conventions** (NOT CC spec — declared in TASK-066, documented as project-only):
- `skills[]` — explicit skill manifest list, mirrors filesystem under `skills/`.
- `agents[]` — explicit agent manifest list, mirrors filesystem under `agents/`.
- `hooks` — reference path to `hooks/hooks.json`.

These extras give `validate-scaffold.js` (or new `validate-plugin.js`) deterministic targets to check; CC itself ignores them.

---

## 2. Plugin tree layout

```
<plugin-root>/
├── .claude-plugin/
│   └── plugin.json            # manifest (required)
├── skills/                    # at plugin root, NOT inside .claude-plugin/
│   └── <name>/
│       ├── SKILL.md
│       └── references/        # heavy reference content
├── agents/                    # at plugin root
│   └── <name>.md
├── hooks/
│   └── hooks.json             # at plugin root
├── commands/                  # at plugin root if present
├── scripts/                   # dev-flow harness scripts (project convention)
├── .mcp.json                  # at plugin root if present
└── .lsp.json                  # at plugin root if present
```

[Source: CC_SPEC L95.]

**Critical**: every primitive directory (`skills/`, `agents/`, `hooks/`, `commands/`) sits at the plugin root, **not** inside `.claude-plugin/`. The `.claude-plugin/` subdirectory holds only `plugin.json`.

dev-flow today uses `.claude/skills/`, `.claude/agents/`, `.claude/scripts/` rooted at the consumer project. Plugin layout drops the `.claude/` prefix because the plugin root **is** the equivalent of `.claude/`. TASK-067 carries out the path rewrite; TASK-065 only fixes the contract.

---

## 3. Path variable resolution

| Variable | Scope | Resolves to | Source |
|:---|:---|:---|:---|
| `${CLAUDE_PLUGIN_ROOT}` | hook contexts | plugin root directory | CC_SPEC L23, L93 |
| `${CLAUDE_SKILL_DIR}` | skill contexts | the skill's own directory (e.g. `skills/<name>/`) | CC_SPEC L61 |
| `${CLAUDE_PLUGIN_DATA}` | hook contexts | plugin runtime data directory | CC_SPEC L23 |
| `$CLAUDE_PROJECT_DIR` | hook contexts | adopter's project root (NOT plugin root) | CC_SPEC L23 |

**Migration mapping for TASK-067**:

| Current ref | Plugin-relative form | Notes |
|:---|:---|:---|
| `.claude/skills/<n>/references/foo.md` (from a skill) | `${CLAUDE_SKILL_DIR}/references/foo.md` | per-skill var |
| `.claude/scripts/<x>.js` (from a hook command line) | `${CLAUDE_PLUGIN_ROOT}/scripts/<x>.js` | hook-context var |
| `.claude/agents/<a>.md` (referenced by name) | no path var needed | agents loaded by name, not path |
| Adopter project files (e.g. `TODO.md`) | `$CLAUDE_PROJECT_DIR/TODO.md` | distinct from plugin root |

---

## 4. Assumptions registry (EPIC-A)

| # | Statement | Status | Source | Note |
|:---|:---|:---|:---|:---|
| 1 | CC plugin spec bundles hooks + skills + agents in one distributable unit | CONFIRMED | CC_SPEC §5 L91-95 | All three primitives sit at plugin root under one `plugin.json`. EPIC-A premise holds. |
| 4 | Plugin-relative path vars exist + stable enough for TASK-067 rewrite | CONFIRMED with one benign gap | CC_SPEC L23, L61, L93 | `${CLAUDE_PLUGIN_ROOT}` (hooks) and `${CLAUDE_SKILL_DIR}` (skill assets) are both spec-supported. Agent `.md` files have no documented path var, but agents are loaded by name not by path — so the gap does not block TASK-067. |

**Source for assumption text**: reconstructed from `STRATEGY_REVIEW.md#R-1` ("confirm CC plugin spec covers hooks + skills + agents bundles") and the acceptance bodies of TASK-065..069. The EPIC-A decomposition commit (`7f89e22`) did not commit a separate assumption registry; this section formalizes what was implicit.

---

## 5. Open gaps inherited from CC_SPEC.md

- `[GAP-1]` SessionStart hook output max length undocumented. Does not block EPIC-A.
- `[GAP-3]` Agent invocation parameter name (`subagent_name` vs `subagent_type`) unverified. Orthogonal to plugin packaging.
- `[GAP-5]` obra/superpowers as reference behavior — informational only.

If any of these get tightened by future CC docs, refresh `CC_SPEC.md` first, then propagate here.

---

## 6. Implications for downstream EPIC-A tasks

- **TASK-066** (manifest): include `name`, `description`, `version` from §1 required fields. Add project-convention `skills[]` / `agents[]` / `hooks` so `validate-scaffold.js` has deterministic checks. Manifest path = `.claude-plugin/plugin.json`.
- **TASK-067** (path rewrite): apply §3 mapping table. Skill internal asset refs → `${CLAUDE_SKILL_DIR}/...`. Hook script refs → `${CLAUDE_PLUGIN_ROOT}/...`. Agent files exempt. Existing `bin/dev-flow-init.js` scaffold-copy path stays on `.claude/`-rooted layout (adopters not on plugin install must keep working).
- **TASK-068** (README): plugin install is the primary path; `bin/dev-flow-init.js` becomes the documented fallback. Verify exact CC plugin install command syntax against current CC docs at TASK-068 execution time (this file does not pin command syntax — that is README's job).

---

## 7. Validation

Contract document, not executable code. TASK-066 author reads §1 + writes manifest; TASK-067 reads §3 + rewrites paths; TASK-068 reads §6 for install framing. No automated check here — TASK-066 adds manifest validation; TASK-069 adds E2E smoke.
