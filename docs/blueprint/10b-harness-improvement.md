---
owner: Tech Lead (Aldian Rizki)
last_updated: 2026-04-20
update_trigger: Blueprint MINOR version bump; new mode added; mode protocol changes
status: current
source: AI_WORKFLOW_BLUEPRINT.md §16–§22 (split TASK-004); split from 10-modes.md (TASK-059)
---

## §17 — Harness Continuous Improvement Protocol

### Channel 1: Session Close Promotions

Every Session Close includes a "Corrections worth promoting" block. When confirmed, the orchestrator:
1. Identifies which skill, agent, or CLAUDE.md section the correction applies to
2. Opens the relevant file
3. Appends the correction to a `## Validated Session Patterns` section
4. Updates `last-validated` date in frontmatter
5. Writes an entry to `.claude/IMPROVEMENT_LOG.md`

**`.claude/IMPROVEMENT_LOG.md` format** (append-only):
```markdown
## [YYYY-MM-DD] — [Skill or Agent name]

**Correction source**: Session Close — TASK-NNN
**Pattern added**: [what was added and why]
**Applied to**: [file path + section]
**Promoted by**: [human | auto]
```

### Channel 2: Skill Staleness Auto-Update

When `session-start.js` flags a skill as stale (last-validated > 6 months):
1. Ask: *"Skill [name] is stale. Shall I run a quick validation pass?"*
2. If yes: forked skill context re-reads skill + current stack version, returns diff
3. Human approves changes
4. Update `last-validated` and write IMPROVEMENT_LOG entry

**Staleness re-validation prompt**:
```markdown
You are reviewing skill [name] for staleness.
Skill last-validated: [date]
Current stack: [framework + version]

Check:
1. Are any tool names, API names, or CLI flags no longer valid for this stack version?
2. Are any blocking rules outdated given framework changes since [date]?
3. Are any referenced patterns deprecated or superseded?

Return: KEEP / UPDATE / REMOVE for each section.
```

### Channel 3: Gate Feedback Capture

Every time a human rejects a gate output and provides a correction:
```markdown
Gate [N] was rejected. Correction received: "[human correction verbatim]"

Categorize:
- Is this a scope clarification? → Update Clarify phase rules
- Is this a design quality issue? → Update design-analyst prompt
- Is this a review false positive? → Update pr-reviewer blocking rules
- Is this a security false positive? → Update security-auditor scope
- Is this an orchestrator communication issue? → Update gate output format

Propose one specific change to the relevant file. Human confirms before writing.
```

### Weekly Calibration Protocol

```bash
/refactor-advisor .claude/skills/    # Review skill quality as a whole
/refactor-advisor .claude/agents/    # Review agent prompt quality
```

Review `.claude/IMPROVEMENT_LOG.md` for patterns worth generalizing.

**Calibration questions**:
1. Which gates are being rejected most often? → That phase needs a prompt upgrade.
2. Which hard stops are triggering false positives? → Threshold needs adjustment.
3. Which skills have `last-validated` approaching 6 months? → Schedule validation pass.
4. Are context budget warnings appearing frequently? → Phases may need to be split.
5. Is CI blocking Session Close regularly? → CI pipeline may need optimization.

---
