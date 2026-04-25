 Prompt: @AI_WORKFLOW_BLUEPRINT.md this project repository is dedicated for univesal starter repo for any kind of system project. to adopt the AI WORKFLOW BLUEPRINT. please inspect all we already    make in the docs, is still any line need to improvement, or any detail need to fix. please criticize and for the output make a plan to scafold all we want to build with proper guideline     to longterm maintain. ask me if need clarify of this task, pretend you are a expert System Orchestrator, System analys and best in AI Workflow journey 
 
 Session 1.
 read the full 3317-line AI_WORKFLOW_BLUEPRINT.md (v1.7.0). Putting on the System Orchestrator / Workflow Architect hat, here is the honest critique and a scaffolding plan — followed by  
  clarifying questions before I commit to detail.                                                                                                                                             
                                                                                                                                                                                              
  ---                                                                                                                                                                                         
  Critique — what's wrong with the current state                                                                                                                                                 
  1. The repo is doc-only. Zero scaffold exists.                                                                                                                                                The blueprint describes .claude/skills/, .claude/agents/, .claude/scripts/*.js, MANIFEST.json, CLAUDE.md, TODO.md, docs/* — but none of these files are materialized. A "universal starter"   that requires every adopter to hand-copy 3,317 lines of markdown into 25+ files is not a starter; it's a spec. Adoption friction is huge.                                                                                                                                                                                                                                                   2. Internal inconsistencies that will break enforcement.                                                                                                                                    
  - Phase numbering disagrees between Section 1 (Parse=1) and Section 3 (Parse=0). The read-guard.js allowlist and .claude/.phase contract depend on phase names matching exactly — current
  state is ambiguous.
  - Section 4 subagent payload enum lists design|implement|test|review|security|docs but omits parse, clarify, validate, close.
  - lean-doc-generator-version: ">=1.1.0" field appears in frontmatter but is defined nowhere.
  - INIT-mode says init-analyst "preloads system-design-reviewer" but the agent body in §16 has its own discovery prompt — which one wins?

  3. Hook contracts are unverified against actual Claude Code spec.
  - read-guard.js reads process.env.CLAUDE_TOOL_INPUT_FILE_PATH. Real CC PreToolUse hooks pass JSON via stdin, not env vars. As written, the hook will silently allow every read — defeating  
  the headline v1.7.0 feature.
  - track-change.js PostToolUse hook has the same env-var assumption.
  - skills: and context: background frontmatter fields are project conventions, not Claude Code subagent spec. The actual subagent fields are name, description, tools, model. Need to either 
  bridge these or document them as project conventions parsed by our own scripts.

  4. Cross-platform is hand-waved.
  You're on Windows. session-start.js Check 6 runs ls, the migration scan has dir /b as a comment fallback, globSkills() shells to PowerShell first. None of this is actually tested. Will    
  fail Day 1.

  5. Monolithic doc is unmaintainable.
  3,317 lines in one file means: no per-section ownership, no per-section update_trigger (ironic given the lean-doc rule the blueprint itself defines), no diffs that humans can review, and  
  no targeted changelog. The blueprint violates its own §8 Lean Documentation laws.

  6. No governance on the blueprint itself.
  No CHANGELOG.md, no CONTRIBUTING.md, no version-bump protocol, no LICENSE, no validation CI. v1.5.0→1.6.0→1.7.0 lives only in frontmatter prose.

  7. Skill duplication risk.
  You already have ~25 user-level skills installed (adr-writer, refactor-advisor, pr-reviewer, lean-doc-generator, etc. — visible in the available-skills list). The blueprint says skills    
  must be project-local and git-tracked. Decision needed: ship project-local copies, reference user-level, or hybrid? Currently undefined.

  8. No bootstrap script.
  "Setup time: 2–4 hours" is honest but unacceptable for a starter. There should be init script that materializes the scaffold into a target repo in <60s.

  ---
  Proposed scaffold plan (high level, five phases)

  Phase 0 — Decisions (this conversation) → resolve ambiguities below
  Phase 1 — Doc refactor → split blueprint into docs/blueprint/0X-*.md, add root README.md (what/why/how-to-adopt), CHANGELOG.md, CONTRIBUTING.md, fix all inconsistencies
  Phase 2 — Materialize scaffold → real files for .claude/{settings.json, settings.local.example.json, scripts/*.js, agents/*.md, skills/*/SKILL.md, skills/MANIFEST.json},
  CLAUDE.md.template, TODO.md.template, docs/*.md.template, .gitignore
  Phase 3 — Validate hooks against actual CC spec → confirm hook input format (stdin JSON vs env), rewrite read-guard.js / track-change.js correctly, add a __tests__/ folder for the scripts 
  Phase 4 — Bootstrap tool → bin/dev-flow-init (Node) that copies scaffold into a target repo with stack prompts
  Phase 5 — Long-term maintenance → semver bump rules, skill staleness CI check, blueprint cross-reference validator, one worked example (e.g. Node/Express or Nuxt) committed as examples/   

  ---
  Clarifying questions (please answer before I commit detail)

  1. Skill source-of-truth: ship full project-local SKILL.md copies of the 25 user-level skills, OR keep them user-level and only ship the project-specific ones (dev-flow, task-decomposer,  
  customized pr-reviewer/security-auditor)? The first is heavier but truly portable; the second is lean but couples adoption to the user's ~/.claude/.
  

  2. Stack scope: is the v1 deliverable stack-agnostic templates only, or do you want one concrete worked example (which stack — Nuxt 3? Next.js? NestJS? Go? Python FastAPI?) committed under
   examples/ to prove the workflow end-to-end?
    

  3. Bootstrap distribution: should dev-flow-init be a (a) shell script in this repo people clone+run, (b) npx @aldian/dev-flow-init package, or (c) a git clone + manual cp -r .claude/      
  workflow? This shapes Phase 4 heavily.
  3. 
  4. Hook spec verification: do you want me to consult Claude Code docs (via the claude-code-guide agent) to confirm the exact PreToolUse/PostToolUse input contract before I rewrite
  read-guard.js? I think this is mandatory but flagging because it's a separate research step.
  5. Doc split granularity: split blueprint into ~10 files (one per major section group), or keep as one file and only fix inconsistencies + add governance? My recommendation is split — but 
  it's a one-way door for downstream readers who already bookmarked sections.

  Once you answer 1–5 I'll produce the detailed, ordered scaffold plan with file-by-file deliverables and a sequencing that respects the dev-flow workflow itself (i.e., we'd dogfood
  /dev-flow init on this very repo).

  answer : 
  1. ship full project local to shareable and can be reuse
  2. for base line is best for agnostic or we specific to stack ? please chose the lite first, and plan for grow letter as note
  3. i think for now i prefer git clone manual to be simple
  4. yes please refer to actual documentation to be relevant usage, about agent, skills, command, script ,etc.
  5. i also prefer split to be more readable and proper maintain
  if still need clarify and if i miss several question to answer please ask again


  Session 2
  Decisions locked. Confirming back:

  ┌─────┬─────────────────────────────────────────────────────────────────────────────────────────────────────┐
  │  #  │                                              Decision                                               │                                                                                 ├─────┼─────────────────────────────────────────────────────────────────────────────────────────────────────┤
  │ 1   │ Project-local skill copies (full SKILL.md content) — git-tracked, no ~/.claude dependency           │                                                                                 ├─────┼─────────────────────────────────────────────────────────────────────────────────────────────────────┤                                                                                 │ 2   │ Agnostic baseline first; stack-specific examples deferred (noted for v2)                            │                                                                                 ├─────┼─────────────────────────────────────────────────────────────────────────────────────────────────────┤                                                                                 │ 3   │ git clone + manual copy adoption — no installer in v1                                               │                                                                               
  ├─────┼─────────────────────────────────────────────────────────────────────────────────────────────────────┤
  │ 4   │ Verify against real Claude Code docs (hooks, agents, skills, slash commands) before writing scripts │
  ├─────┼─────────────────────────────────────────────────────────────────────────────────────────────────────┤
  │ 5   │ Split blueprint into modular files                                                                  │
  └─────┴─────────────────────────────────────────────────────────────────────────────────────────────────────┘

  Three small sub-decisions I'll assume defaults for — correct me inline if wrong:

  - License: MIT (most permissive for a "starter")
  - Repo visibility: assume public on GitHub eventually (affects README tone)
  - Delivery cadence: I'll produce the plan only in this turn. We then dogfood /dev-flow init (or a manual variant) over follow-up sessions to actually build it. We do not start writing     
  files this turn.

  ---
  Scaffold Plan — dev-flow Universal Starter

  Phase 0 — Research & Calibration (must run first)

  Goal: lock the actual Claude Code spec before any script/agent/skill files are written, so we don't ship broken hooks again.

  - Spawn claude-code-guide agent (you have it) with these specific lookups:
    a. PreToolUse / PostToolUse hook input contract — stdin JSON shape, env vars actually populated, exit-code semantics for blocking
    b. Subagent frontmatter — exact accepted fields (name, description, tools, model, anything else); does skills: preloading exist or is it our convention?
    c. Skill frontmatter — context: fork vs alternatives; allowed-tools; progressive disclosure of supporting files
    d. Slash command resolution — file vs directory, namespacing, args parsing
    e. SessionStart hook — output injection mechanism, blocking behavior
  - Deliverable: docs/research/CC_SPEC.md (≤200 lines) — single source of truth used by Phase 2/3
  - Gate: human reviews CC_SPEC.md before Phase 1 starts. Anything in the blueprint that contradicts CC_SPEC.md gets a [FIX] marker for Phase 1.

  Phase 1 — Documentation Refactor & Governance

  Split target (10 files under docs/blueprint/):

  ┌────────────────────────────┬───────────────────────────────────────────────────────────────────────────────────────┐
  │            File            │                                    Source sections                                    │
  ├────────────────────────────┼───────────────────────────────────────────────────────────────────────────────────────┤
  │ 01-philosophy.md           │ §1                                                                                    │
  ├────────────────────────────┼───────────────────────────────────────────────────────────────────────────────────────┤
  │ 02-repo-structure.md       │ §2                                                                                    │
  ├────────────────────────────┼───────────────────────────────────────────────────────────────────────────────────────┤
  │ 03-workflow-phases.md      │ §3                                                                                    │
  ├────────────────────────────┼───────────────────────────────────────────────────────────────────────────────────────┤
  │ 04-agents.md               │ §4                                                                                    │
  ├────────────────────────────┼───────────────────────────────────────────────────────────────────────────────────────┤
  │ 05-skills.md               │ §5, §13                                                                               │
  ├────────────────────────────┼───────────────────────────────────────────────────────────────────────────────────────┤
  │ 06-harness.md              │ §6, §7                                                                                │
  ├────────────────────────────┼───────────────────────────────────────────────────────────────────────────────────────┤
  │ 07-todo-format.md          │ §8                                                                                    │
  ├────────────────────────────┼───────────────────────────────────────────────────────────────────────────────────────┤
  │ 08-orchestrator-prompts.md │ §9 (Gates 0/1/2, TDD)                                                                 │
  ├────────────────────────────┼───────────────────────────────────────────────────────────────────────────────────────┤
  │ 09-customization.md        │ §10, §11, §14, §15                                                                    │
  ├────────────────────────────┼───────────────────────────────────────────────────────────────────────────────────────┤
  │ 10-modes.md                │ §16 INIT, §18 Resume, §19 Migration, §20 Performance, §21 Hotfix, §22 Task-Decomposer │
  └────────────────────────────┴───────────────────────────────────────────────────────────────────────────────────────┘

  Fixes inside the split (every one tracked as a [FIX-N] marker):
  - Phase numbering: pick 0–10 (current §3 contract) and propagate to §1, §4, read-guard.js allowlist
  - scope.phase enum in Subagent Dispatch: add missing parse|clarify|validate|close
  - Drop or define lean-doc-generator-version frontmatter
  - Resolve init-analyst preloading vs body-prompt conflict
  - Reconcile context: background, skills:, agent: against Phase 0 CC_SPEC.md findings (rename/adapt where they're ours-not-Claude's)

  Governance files (new, repo root):
  - README.md — what this is, who it's for, how to adopt (≤80 lines, lean-doc-compliant)
  - CHANGELOG.md — for the blueprint itself; semver bump rules documented inline
  - CONTRIBUTING.md — how to propose blueprint changes; what triggers a major bump
  - LICENSE — MIT
  - .gitignore — covers .claude/settings.local.json, .claude/.session-changes.txt, .claude/.phase, node_modules/

  Versioning rule (locks future churn):
  - MAJOR: phase model change, gate model change, hook contract change
  - MINOR: new mode, new agent, new skill, new hard stop
  - PATCH: doc clarification, prompt rewording, fix

  Phase 2 — Materialize .claude/ Scaffold (file shells)

  Just empty/template versions — no content beyond placeholders that point to docs/blueprint/*:

  .claude/
  ├── CLAUDE.md.template
  ├── settings.json
  ├── settings.local.example.json
  ├── scripts/
  │   ├── session-start.js
  │   ├── read-guard.js
  │   ├── track-change.js
  │   └── ci-status.js
  ├── agents/
  │   ├── design-analyst.md
  │   ├── init-analyst.md
  │   ├── code-reviewer.md
  │   ├── security-analyst.md
  │   ├── migration-analyst.md
  │   ├── performance-analyst.md
  │   └── scope-analyst.md
  └── skills/
      ├── MANIFEST.json
      ├── dev-flow/SKILL.md
      ├── task-decomposer/SKILL.md
      ├── adr-writer/SKILL.md
      ├── refactor-advisor/SKILL.md
      ├── lean-doc-generator/SKILL.md
      ├── release-manager/SKILL.md
      ├── system-design-reviewer/SKILL.md
      ├── pr-reviewer/SKILL.md
      └── security-auditor/SKILL.md

  Phase 2 stops at structure + frontmatter only. Bodies filled in Phase 3/4.

  Phase 3 — Scripts (correctly wired against CC_SPEC.md)

  For each script: rewrite using the real hook contract from Phase 0, plus a __tests__/ folder with a Node test (no framework — plain node --test) that simulates the hook input and asserts  
  the script's behavior.

  - session-start.js — keep all 9 checks, fix Windows ls/find/PowerShell mess with a single Node-only readdirSync walk
  - read-guard.js — rewrite from scratch based on real hook input contract
  - track-change.js — same
  - ci-status.js — keep, add CI_PROVIDER=skip as default for the starter

  Cross-platform commitment: scripts are pure Node, no shell-outs except git/gh/glab. Tested under Git Bash on Windows + plain Node on Linux.

  Phase 4 — Skills + Agents (content)

  - Copy from user-level (~/.claude/skills/) into project-local with frontmatter normalized to our spec: adr-writer, refactor-advisor, lean-doc-generator (+ reference/), release-manager,    
  system-design-reviewer, pr-reviewer, security-auditor
  - Author fresh (project-specific): dev-flow/SKILL.md, task-decomposer/SKILL.md, MANIFEST.json
  - Author all 7 agent .md files using the verified subagent frontmatter from Phase 0
  - Agents and skills get last-validated: 2026-04-20 on first commit

  Phase 5 — Templates (project-root + docs/)

  - CLAUDE.md.template — agnostic skeleton with [CUSTOMIZE] markers
  - TODO.md.template — exactly the §8 unified format, with one example sprint
  - docs/README.md.template, docs/ARCHITECTURE.md.template, docs/DECISIONS.md.template, docs/SETUP.md.template, docs/AI_CONTEXT.md.template, docs/CHANGELOG.md.template
  - All include the lean-doc ownership header

  Phase 6 — Validation (light, defer worked example)

  - One smoke-test script scripts/validate-scaffold.js that runs in any target repo and asserts: required files present, frontmatter valid, MANIFEST.json schema matches, doc line counts     
  within limits, CLAUDE.md ≤200 lines
  - Defer to v2: full Node/Express or Nuxt worked example under examples/. Document this as a v2 line item in CHANGELOG.md.

  Phase 7 — Long-term Maintenance Protocol

  Codified in CONTRIBUTING.md:
  - Quarterly skill staleness audit (cron-able via the loop skill you already have)
  - Blueprint cross-reference validator script (scripts/validate-blueprint.js) that checks: every skill referenced in §5 matrix exists in .claude/skills/, every agent referenced in §4 exists
   in .claude/agents/, all phase numbers are 0–10
  - GitHub Actions workflow (when public): run validate-scaffold.js + validate-blueprint.js on every PR
  - Annual major-version review

  ---
  Recommended Execution Sequencing

  This starter is the perfect dogfood candidate. Once Phase 0 is done, the actual building should run as /dev-flow init dev-flow-starter with each Phase 1–7 above becoming a sprint. That    
  tests the workflow on itself before any external project adopts it.

  Concretely, recommended task batching for Sprint 0–4:
  - Sprint 0: Phase 0 (research) + Phase 1 (doc split + governance) — proves the spec
  - Sprint 1: Phase 2 + Phase 3 (scaffold + scripts) — proves the harness
  - Sprint 2: Phase 4 (skills + agents) — proves the orchestration
  - Sprint 3: Phase 5 + Phase 6 (templates + validator) — proves adoption-readiness
  - Sprint 4: Phase 7 (governance & CI) — proves long-term viability

  ---
  Remaining clarifying questions (please answer before I start Phase 0)

  1. Phase 0 research scope: should I also have the agent verify Claude Agent SDK behavior, or is Claude Code CLI enough? (You're using CC; SDK only matters if you ever want to embed        
  dev-flow programmatically.)
  for detail what i want is this repo will handle more expert and detail than the https://github.com/obra/superpowers was already use full. please refer this as a baseline because that repo is already proven with 160K starts on github


  2. Skill copy provenance: should I preserve attribution / origin notes on the copied user-level skills (since they're yours), or rewrite them clean as repo-original content?
    

  3. MANIFEST.json — generated or hand-maintained? v1.7.0 says it's the source of truth. If hand-maintained, drift is guaranteed. I'd recommend a scripts/regenerate-manifest.js that walks   
  .claude/skills/*/SKILL.md frontmatter — agree?

  
  4. TODO.md for THIS repo: do you want me to draft Sprints 0–4 above as actual TODO.md entries when we begin execution, so dev-flow can drive the build? Or keep planning out of TODO until  
  later?
  
  Once 1–4 are answered I'll either kick off Phase 0 (spawning claude-code-guide) or hand the plan back as a frozen artifact for you to execute later — your call.

  1. for detail what i want is this repo will handle more expert and detail than the https://github.com/obra/superpowers was already use full. please refer this as a baseline because that repo is already proven with 160K starts on github
  2. you can copy for fast start, next we will audit again to have original and relevant
  3. i agree with your recommend
  4. yes you can draft from now

  if still need clarify or i miss question please ask again

  Compare with superpower repo

   Synthesis complete. Key findings before drafting TODO.md.                                                                                                                                   
                                                                                                                                                                                              
  Gap analysis: dev-flow vs superpowers                                                                                                                                                       
                                                                                                                                                                                              
  ┌──────────────────────────┬─────────────────────────────────────────────────────────┬───────────────────────────────────────────────┬─────────────────────────────────────────────────┐    
  │           Area           │                       superpowers                       │           dev-flow blueprint v1.7.0           │                     Action                      │      ├──────────────────────────┼─────────────────────────────────────────────────────────┼───────────────────────────────────────────────┼─────────────────────────────────────────────────┤    
  │ Distribution             │ Plugin marketplace + multi-platform (.claude-plugin,    │ Single repo, manual copy                      │ Adopt — add multi-platform layout to backlog    │      │                          │ .codex, .cursor-plugin, .opencode, GEMINI.md)           │                                               │ (v2)                                            │      ├──────────────────────────┼─────────────────────────────────────────────────────────┼───────────────────────────────────────────────┼─────────────────────────────────────────────────┤      │                          │ Spec-compliant (name + description only required, per   │ Adds custom version, stack-version,           │ Reconcile — keep our extras as documented       │      │ Skill frontmatter        │ agentskills.io)                                         │ last-validated, context: fork, agent,         │ project conventions, mark required/optional     │      │                          │                                                         │ skills:, spawns:                              │ clearly                                         │      ├──────────────────────────┼─────────────────────────────────────────────────────────┼───────────────────────────────────────────────┼─────────────────────────────────────────────────┤      │ Skill description        │ "Use when…" third-person, ≤500 chars, NEVER summarizes  │ Verbose, sometimes mixes what+when            │ Audit all our skill descriptions in Sprint 3    │      │                          │ process                                                 │                                               │                                                 │    
  ├──────────────────────────┼─────────────────────────────────────────────────────────┼───────────────────────────────────────────────┼─────────────────────────────────────────────────┤
  │ Decision logic in skills │ GraphViz dot flowcharts (machine-parseable)             │ Markdown tables only                          │ Adopt dot diagrams in our skill template        │    
  ├──────────────────────────┼─────────────────────────────────────────────────────────┼───────────────────────────────────────────────┼─────────────────────────────────────────────────┤    
  │ Anti-rationalization     │ "Red Flags" tables ("This is just a simple question" →  │ Hard stop catalog (good) but no per-skill Red │ Adopt Red Flags pattern in dev-flow &           │    
  │                          │ "Questions are tasks. Check for skills.")               │  Flags                                        │ task-decomposer skills                          │    
  ├──────────────────────────┼─────────────────────────────────────────────────────────┼───────────────────────────────────────────────┼─────────────────────────────────────────────────┤    
  │ Examples                 │ <Good>/<Bad> paired blocks                              │ Mostly prose                                  │ Adopt Good/Bad pattern                          │    
  ├──────────────────────────┼─────────────────────────────────────────────────────────┼───────────────────────────────────────────────┼─────────────────────────────────────────────────┤    
  │ Skill type label         │ Rigid (TDD) vs Flexible (patterns) — explicit           │ Implicit                                      │ Adopt — add type: rigid|flexible to our skill   │    
  │                          │                                                         │                                               │ frontmatter                                     │    
  ├──────────────────────────┼─────────────────────────────────────────────────────────┼───────────────────────────────────────────────┼─────────────────────────────────────────────────┤    
  │ Implementer status       │ Enum: DONE / DONE_WITH_CONCERNS / NEEDS_CONTEXT /       │ Just done | failed                            │ Adopt richer enum                               │    
  │                          │ BLOCKED                                                 │                                               │                                                 │    
  ├──────────────────────────┼─────────────────────────────────────────────────────────┼───────────────────────────────────────────────┼─────────────────────────────────────────────────┤    
  │ Model selection          │ Per-task complexity guidance                            │ Not addressed                                 │ Adopt in subagent dispatch spec                 │    
  │                          │ (cheap/standard/most-capable)                           │                                               │                                                 │    
  ├──────────────────────────┼─────────────────────────────────────────────────────────┼───────────────────────────────────────────────┼─────────────────────────────────────────────────┤    
  │ Hook structure           │ matcher, ${CLAUDE_PLUGIN_ROOT}, async: false, .cmd      │ Inline node commands                          │ Verify in Phase 0 — adopt matcher/plugin-root   │    
  │                          │ dispatcher (Windows-aware)                              │                                               │ variable                                        │    
  ├──────────────────────────┼─────────────────────────────────────────────────────────┼───────────────────────────────────────────────┼─────────────────────────────────────────────────┤    
  │ Skill TDD                │ Pressure-test scenarios with subagents                  │ Skill staleness check only                    │ Adopt as Sprint 5+ backlog                      │    
  │                          │ (RED-GREEN-REFACTOR for skills)                         │                                               │                                                 │    
  ├──────────────────────────┼─────────────────────────────────────────────────────────┼───────────────────────────────────────────────┼─────────────────────────────────────────────────┤    
  │ Gate model               │ Light human checkpoints                                 │ 3 explicit gates + 6 modes + 27 hard stops    │ Keep — dev-flow is stronger here                │    
  ├──────────────────────────┼─────────────────────────────────────────────────────────┼───────────────────────────────────────────────┼─────────────────────────────────────────────────┤    
  │ Migration / Performance  │ None                                                    │ Full protocols                                │ Keep — dev-flow goes further                    │    
  │ / Hotfix                 │                                                         │                                               │                                                 │    
  ├──────────────────────────┼─────────────────────────────────────────────────────────┼───────────────────────────────────────────────┼─────────────────────────────────────────────────┤    
  │ INIT mode                │ None (informal)                                         │ 4-phase greenfield bootstrap                  │ Keep — dev-flow goes further                    │    
  ├──────────────────────────┼─────────────────────────────────────────────────────────┼───────────────────────────────────────────────┼─────────────────────────────────────────────────┤    
  │ Lean doc methodology     │ None                                                    │ HOW filter + 4 laws                           │ Keep — dev-flow goes further                    │    
  ├──────────────────────────┼─────────────────────────────────────────────────────────┼───────────────────────────────────────────────┼─────────────────────────────────────────────────┤    
  │ Subagent two-stage       │ spec → quality with re-dispatch loop                    │ Single review (Section 9 has 2 stages but no  │ Strengthen review agent prompt with re-dispatch │    
  │ review                   │                                                         │ re-dispatch loop)                             │  loop                                           │    
  ├──────────────────────────┼─────────────────────────────────────────────────────────┼───────────────────────────────────────────────┼─────────────────────────────────────────────────┤    
  │ references/ subfolder    │ Heavy reference offloaded (e.g.                         │ Used for lean-doc-generator only              │ Standardize for any skill >500 lines            │    
  │ pattern                  │ testing-anti-patterns.md)                               │                                               │                                                 │    
  └──────────────────────────┴─────────────────────────────────────────────────────────┴───────────────────────────────────────────────┴─────────────────────────────────────────────────┘    

  Net: dev-flow's workflow architecture is more rigorous than superpowers (gates, modes, safety protocols). Superpowers' skill craftsmanship (description discipline, dot flowcharts, Red     
  Flags, Good/Bad, TDD-for-skills) is sharper than dev-flow's. We adopt the craft, keep our architecture.



   TODO.md is on disk at D:/Project/dev-flow/TODO.md. Sprint 0 is active with 3 tasks (TASK-001..003); Sprints 1–5 are organized in Backlog by priority with TASK-004..031 as one-liners until
  promoted.
                                                                                                                                                                                                Summary of what just happened
                                                                                                                                                                                                1. Researched obra/superpowers — pulled the README, full skill list (14 skills), agents list (1: code-reviewer), commands (3), hooks structure, and read 4 critical SKILL.md files            (using-superpowers, subagent-driven-development, test-driven-development, writing-skills)                                                                                                     2. Produced gap-analysis table above — superpowers wins on skill craftsmanship; dev-flow wins on workflow architecture; we adopt the craft, keep our architecture                             3. Drafted TODO.md following blueprint §8 format precisely — owner header, sprint sizing rules, Active Sprint with full 6-field tasks, P0/P1/P2/P3 backlog, Changelog scaffold, Quick Rules 
  tailored to this meta-repo, informational Roadmap

  Critical findings that already changed the plan

  - v1.7.0's read-guard.js and track-change.js are definitively broken — they assume process.env.CLAUDE_TOOL_INPUT_FILE_PATH but Claude Code hooks pass JSON via stdin. Confirmed via
  superpowers' actual hooks.json (which uses ${CLAUDE_PLUGIN_ROOT} and matchers we're missing). TASK-001 is now risk: high because of this.
  - Skill frontmatter — name and description are the only spec-required fields per agentskills.io. All our extras (version, stack-version, last-validated, context: fork, agent, skills:,     
  spawns:) are project conventions, not Claude Code spec. Need explicit documentation in Sprint 1.
  - Skill description discipline (third-person, "Use when…", ≤500 chars, never summarizes process) — every existing user-level skill we plan to copy needs auditing in Sprint 3.

  What I'm not doing yet (awaiting your go)

  - Spawning the claude-code-guide agent for TASK-001 (Phase 0 research)
  - Writing any scaffold files
  - Splitting the blueprint

  Final clarifying questions before we kick off Sprint 0

  1. TASK-001 execution: shall I spawn the claude-code-guide agent next turn to start Phase 0 research, or do you want to review TODO.md and the gap analysis first?
  2. Doc location for research artifacts: I planned docs/research/CC_SPEC.md and docs/research/ADAPTATION_NOTES.md. The blueprint reserves docs/ for the lean-doc set
  (README/ARCHITECTURE/DECISIONS/SETUP/AI_CONTEXT/CHANGELOG/TEST_SCENARIOS). Is docs/research/ an acceptable extension, or do you want these elsewhere (e.g. context/research/)?
  3. Single big-bang Sprint 1 vs incremental commits: when we split the blueprint, do you want one large commit ("blueprint split into 10 files + governance added") or per-file commits? I   
  lean per-file for review-ability — confirm?

  Once you answer, I'll mark Sprint 0 in_progress and dispatch the research agent.

  1. yes please you can start task-001
  2. i chose in context research, because the docs we want to make all in there lean, and what big references heavy docs in context. this related with Context Engineering also
  3. yes i aggree with your suggestion

   All clear. Three quick adjustments before dispatch:

  - Path correction: research artifacts move to context/research/ (CC_SPEC, ADAPTATION_NOTES) and DESIGN_PHILOSOPHY moves to context/workflow/ — aligns with the blueprint's existing           context/workflow/AGENTS.md slot and your context-engineering principle (lean docs/, heavy references in context/)
  - Sprint 0 in_progress, TASK-001 starting now                                                                                                                                                 - Updating TODO.md and dispatching claude-code-guide in one shot  