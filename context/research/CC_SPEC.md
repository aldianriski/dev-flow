# Claude Code Spec — Verified Reference (CC_SPEC)

---
owner: Tech Lead
last_updated: 2026-04-20
update_trigger: Claude Code releases a new hook event, skill field, or subagent behavior; or when empirical testing contradicts a claim below
status: current
source: research conducted 2026-04-20 by claude-code-guide agent for dev-flow Sprint 0 TASK-001
---

> **Purpose**: binding reference for every dev-flow scaffold script, subagent `.md`, and skill `SKILL.md`. Every claim cites an Anthropic source URL. Gaps are marked `[GAP]`. Fields we invented are called out explicitly under "Project conventions vs Claude Code spec".
>
> **Rule**: if dev-flow code contradicts this file, the code is wrong. If this file contradicts Anthropic docs, this file is wrong — re-run TASK-001 to refresh.

---

## 1. Hook input contract

**Input mechanism**: hooks receive JSON on stdin containing session context, event metadata, and tool-specific fields. There is no single global env-var API for tool inputs. [Source: https://code.claude.com/docs/en/hooks.md — "Common Input Fields"]

**Hook events (complete list)**: SessionStart, SessionEnd, InstructionsLoaded, UserPromptSubmit, Stop, StopFailure, PreToolUse, PermissionRequest, PermissionDenied, PostToolUse, PostToolUseFailure, SubagentStart, SubagentStop, TeammateIdle, TaskCreated, TaskCompleted, Notification, ConfigChange, CwdChanged, FileChanged, WorktreeCreate, WorktreeRemove, PreCompact, PostCompact, Elicitation, ElicitationResult. [Source: https://code.claude.com/docs/en/hooks.md]

**Environment variables**: `$CLAUDE_PROJECT_DIR`, `${CLAUDE_PLUGIN_ROOT}`, `${CLAUDE_PLUGIN_DATA}`, `CLAUDE_ENV_FILE` (SessionStart / CwdChanged / FileChanged only), `CLAUDE_CODE_REMOTE`. **`CLAUDE_TOOL_INPUT_FILE_PATH` does not exist.** File paths arrive on stdin as `tool_input.file_path` for Read / Write / Edit / Glob / Grep. [Source: https://code.claude.com/docs/en/hooks.md]

**Matcher syntax**: tool events match literal names or regex (`"Bash"`, `"Edit|Write"`, `"mcp__.*"`, `"Bash(git push*)"`). SessionStart matches `"startup|resume|clear|compact"`. Other events are event-specific or matcher-less. [Source: https://code.claude.com/docs/en/hooks.md — "Matcher Patterns"]

**Exit codes**: `0` = success (JSON output is processed); `2` = blocking error (action is blocked / denied, stderr is fed to Claude as feedback); other codes = non-blocking error. For blockable events (PreToolUse, PermissionRequest, UserPromptSubmit, Stop, SubagentStop, ConfigChange, PreCompact, WorktreeCreate), exit 2 or JSON `decision: "block"` blocks the action. [Source: https://code.claude.com/docs/en/hooks.md]

**Structured JSON output** (alternative to exit code, stdout on exit 0): top-level fields `continue`, `decision`, `reason`, `systemMessage`; nested `hookSpecificOutput` with `permissionDecision`, `additionalContext`, `updatedInput`, `updatedPermissions`, `retry`, `worktreePath`. [Source: https://code.claude.com/docs/en/hooks.md]

**Async**: `"async": true` runs the command in background; `"asyncRewake": true` lets a background task wake Claude via exit 2. Default: `async: false`. [Source: https://code.claude.com/docs/en/hooks.md]

---

## 2. Subagent (`.claude/agents/<name>.md`) frontmatter

**Spec fields**: `name`, `description` (recommended), `model`, `effort` (`low|medium|high|xhigh|max`), `tools`, `system-prompt`, `preload-skills`. [Source: https://code.claude.com/docs/en/sub-agents.md]

**Tool syntax**: space-separated list or YAML list. Patterns supported: `Bash(git *)`, `Glob(src/**)`, regex. [Source: https://code.claude.com/docs/en/sub-agents.md]

**Invocation**: the Agent tool takes `subagent_name` (string) — Claude Code resolves `.claude/agents/foo.md` to the subagent named `foo`. Project-local subagents are discovered automatically. [Source: https://code.claude.com/docs/en/sub-agents.md]

**Skill preloading**: `preload-skills: [skill1, skill2]` loads full skill content at subagent startup (not just descriptions). This is the real mechanism for the "thin wrapper" pattern dev-flow uses. [Source: https://code.claude.com/docs/en/sub-agents.md]

**Non-spec conventions** (dev-flow invented, NOT supported by Claude Code): `context: background`, `skills: <name>`, `spawns: <agent>`. Replace with the spec fields above.

---

## 3. Skill frontmatter (agentskills.io + Claude Code extensions)

**Spec URL**: https://agentskills.io/specification — the open standard underlying Claude Code skills.

**Required fields (agentskills.io)**: `name`, `description`. Everything else is optional. [Source: https://agentskills.io/specification]

**Spec-defined optional fields**: `license`, `compatibility`, `metadata`, `allowed-tools`. [Source: https://agentskills.io/specification]

**Claude Code extensions** (valid in CC, not in base spec): `disable-model-invocation`, `user-invocable`, `context: fork`, `agent: <subagent-name>`, `hooks`, `paths`, `shell`, `effort`, `model`, `when_to_use`, `argument-hint`. [Source: https://code.claude.com/docs/en/skills.md]

**Skill resolution**: project `.claude/skills/` → user `~/.claude/skills/`. Same-name conflicts: **project wins**. Plugin skills are namespaced `plugin-name:skill-name`. [Source: https://code.claude.com/docs/en/skills.md]

**File references**: supporting files are addressed as `${CLAUDE_SKILL_DIR}/reference/foo.md` — variable resolves relative to the skill directory. [Source: https://code.claude.com/docs/en/skills.md]

**Description discipline** (per agentskills.io intent + superpowers in-practice): third-person, "Use when…" start, never summarizes the skill's internal process. Combined `description` + `when_to_use` caps at ~1,536 chars. [Source: https://agentskills.io/specification; empirical: obra/superpowers/skills/*/SKILL.md]

**Non-spec conventions** (dev-flow invented, NOT supported by Claude Code): `version`, `stack-version`, `last-validated`. These are project conventions — keep them for our staleness tooling, but document as such and place them AFTER the spec fields in frontmatter so they're ignored cleanly by CC.

---

## 4. Slash commands

**Commands vs skills**: both `.claude/commands/<name>.md` (legacy flat) and `.claude/skills/<name>/SKILL.md` produce `/name`. **Skills are recommended** — they support directories, frontmatter, auto-invocation on context match. Commands are legacy single-file. [Source: https://code.claude.com/docs/en/skills.md]

**Precedence when both exist**: skills take precedence over same-named commands. [Source: https://code.claude.com/docs/en/skills.md]

**Resolution order (full)**: command plugins → project commands → user commands → skills (by location precedence). [Source: https://code.claude.com/docs/en/skills.md]

**Frontmatter**: skills use YAML frontmatter; flat `.md` commands do not. [Source: https://code.claude.com/docs/en/skills.md, https://code.claude.com/docs/en/commands.md]

**Arguments**: `$ARGUMENTS` (all), `$ARGUMENTS[N]`, `$N` (0-indexed). No file-based argument passing. [Source: https://code.claude.com/docs/en/skills.md]

**dev-flow implication**: `/dev-flow`, `/task-decomposer`, `/lean-doc-generator` etc. are all skills, not commands. Keep `.claude/commands/` unused.

---

## 5. SessionStart + plugin layout

**SessionStart output injection**: stdout is captured and added to Claude's context (visible in the conversation). Max length: `[GAP]`. [Source: https://code.claude.com/docs/en/hooks.md]

**SessionStart matchers**: `"startup"` (new session), `"resume"` (resumed), `"clear"` (context cleared), `"compact"` (auto-compacted). [Source: https://code.claude.com/docs/en/hooks.md]

**Plugin manifest** (`.claude-plugin/plugin.json`): required `name`, `description`, `version`. Optional: `author` (object), `homepage`, `repository`, `license`. [Source: https://code.claude.com/docs/en/plugins.md]

**`${CLAUDE_PLUGIN_ROOT}`**: resolves to the plugin root directory inside hook contexts. [Source: https://code.claude.com/docs/en/hooks.md]

**Plugin directory layout**: `.claude-plugin/plugin.json` at plugin root; `skills/`, `agents/`, `hooks/hooks.json`, `commands/`, `.mcp.json`, `.lsp.json` all at plugin root (**not** inside `.claude-plugin/`). [Source: https://code.claude.com/docs/en/plugins.md]

**dev-flow implication**: when we ship as a plugin (backlog TASK-027 / TASK-029), we mirror this layout — not the current `.claude/` path.

---

## Project conventions vs Claude Code spec — quick table

| Field / behavior | Real CC spec? | Source | Migration note |
|:---|:---|:---|:---|
| `CLAUDE_TOOL_INPUT_FILE_PATH` env var | NO | https://code.claude.com/docs/en/hooks.md | Use stdin JSON `tool_input.file_path` |
| Subagent `skills: [name]` field | NO | invented | Rename to `preload-skills: [name]` — real spec |
| Subagent `spawns: <agent>` field | NO | invented | Drop — document as orchestrator responsibility instead |
| Subagent `context: background` | NO | invented | Drop — subagents always have isolated context |
| Skill `version`, `stack-version`, `last-validated` | NO (project convention) | not in spec | Keep as trailing project-only fields; document explicitly |
| Skill `context: fork` | YES (CC extension) | https://code.claude.com/docs/en/skills.md | Keep |
| Skill `agent: <subagent-name>` | YES (CC extension) | https://code.claude.com/docs/en/skills.md | Keep — pairs with `context: fork` |
| Skill `allowed-tools` | YES (spec) | https://agentskills.io/specification | Adopt where we currently don't set it |
| Hook matcher `"Bash(git push*)"` | YES | https://code.claude.com/docs/en/hooks.md | Keep |
| Hook `async: false` | YES | https://code.claude.com/docs/en/hooks.md | Keep |
| `${CLAUDE_PLUGIN_ROOT}` variable | YES | https://code.claude.com/docs/en/hooks.md | Adopt for plugin-mode path resolution |
| Exit code 1 to block | NO | https://code.claude.com/docs/en/hooks.md | **Use exit 2, not 1**, in read-guard.js |
| JSON `decision: "block"` + `reason` | YES | https://code.claude.com/docs/en/hooks.md | Preferred over bare exit 2 — structured feedback |
| SessionStart matcher `"startup\|clear\|compact"` | YES | https://code.claude.com/docs/en/hooks.md | Adopt; v1.7.0 omitted matcher |

---

## Gaps and contradictions

- **[GAP-1]** SessionStart hook output max length: undocumented. Test empirically; assume conservative cap (~4 KB) for `session-start.js` report.
- **[GAP-2]** `CLAUDE_TOOL_INPUT_FILE_PATH` does not exist. v1.7.0 `read-guard.js` and `track-change.js` must be rewritten to parse stdin JSON `tool_input.file_path`.
- **[GAP-3]** Agent tool parameter for invocation (`subagent_name` vs `subagent_type` vs other) is referenced in docs but exact shape `[UNVERIFIED]`. Test at integration time and refine the dev-flow `Subagent Dispatch Specification`.
- **[GAP-4]** Skill `description` hard char limit is ~1,536 chars combined with `when_to_use` — not an explicit limit per field. Treat ≤500 chars as a stylistic cap (per superpowers practice), not a spec rule.
- **[GAP-5]** obra/superpowers uses `.cmd` hooks + `${CLAUDE_PLUGIN_ROOT}` + `matcher: "startup|clear|compact"` — all spec-compliant. Their minimal frontmatter (`name` + `description` only) reflects agentskills.io base spec; they deliberately do not use CC extensions. dev-flow will use CC extensions where they add value (`context: fork`, `agent:`, `allowed-tools`) but will stay agentskills.io-compatible for portability.

---

## Immediate dev-flow implications (changes this file forces)

1. **Rewrite `read-guard.js`** (Sprint 2 TASK-009): read stdin JSON, extract `tool_input.file_path`, compare against `COMPACT_VULNERABLE` phase set, emit JSON `{"decision":"block","reason":"..."}` with exit 2.
2. **Rewrite `track-change.js`** (Sprint 2 TASK-010): same stdin-JSON pattern for Write / Edit `tool_input.file_path`.
3. **Subagent `.md` frontmatter** (Sprint 3 TASK-016): replace `context: background` / `skills:` / `spawns:` with spec fields `preload-skills`, `tools`, `system-prompt`. Drop `context: background` entirely (subagents are always isolated by design).
4. **Skill `SKILL.md` frontmatter** (Sprint 3 TASK-013/014/015): keep `context: fork` and `agent:` (real CC extensions). Keep `version`, `stack-version`, `last-validated` as trailing project-convention fields — document explicitly as "not CC spec, consumed by `session-start.js` only".
5. **Hook settings.json** (Sprint 2 TASK-012): add SessionStart `matcher: "startup|resume|clear|compact"`. Use spec exit-code / JSON output contract.
6. **Blueprint §4 Subagent Dispatch Specification** (Sprint 1 TASK-005): rename `input_payload.context.files` contract; align `budget.return_tokens` with CC's JSON output size in mind.
7. **Blueprint §5 Skills Map** (Sprint 1 TASK-005): add a "CC-spec field" column to the skill table, marking each skill's frontmatter fields as spec / CC-extension / project convention.
