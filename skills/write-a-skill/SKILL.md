---
name: write-a-skill
description: Use when creating a new skill for the dev-flow ecosystem. Guides requirements gathering, drafting, and validation. Enforces size limits, trigger phrase quality, and reference file structure.
user-invocable: true
argument-hint: "[skill name or domain]"
version: "1.0.0"
last-validated: "2026-05-01"
type: flexible
---

# Write a Skill

Meta-skill for authoring new dev-flow skills. Produces SKILL.md (+ reference files if needed) that passes all quality constraints.

---

## Phase 1 — Requirements

Ask in one message (skip questions already answered by context):
1. What specific task or situation triggers this skill?
2. What does the skill produce? (output contract)
3. Does it need scripts? (only if output is deterministic + repeated — e.g., MANIFEST generation)
4. What are 3–5 conditions that should hard-stop or flag a problem? (red flags)
5. Are there existing skills it overlaps with?

Wait for answers before drafting.

## Phase 2 — Draft

Produce `SKILL.md` following these constraints:

**Frontmatter (required fields):**
```yaml
name: kebab-case
description: "Use when [specific trigger]. [What it produces]. Do not use when [exclusion]."
user-invocable: true
version: "1.0.0"
last-validated: YYYY-MM-DD
type: rigid | flexible
```

**Size rules:**
- `SKILL.md` ≤ 100 lines total
- Description field < 1,024 characters
- If body exceeds 100 lines → move heavy content to `references/<topic>.md`
- Reference file: load on demand, not auto-loaded

**Required sections:** trigger, phases/steps, red flags (3–5 inline)
**Optional sections:** output format, hard rules, anti-patterns

**Scripts:** add only if the operation is deterministic AND will be called repeatedly. No scripts for one-off generation.

## Phase 3 — Review

Present draft to human. Ask:
- Does the trigger description correctly exclude adjacent skills?
- Are all red flags observable (not vague)?
- Is there overlap with an existing skill that should be a reference update instead?

Await explicit approval before writing files.

---

## Skill Quality Checklist

- [ ] Description starts with `"Use when..."`
- [ ] Description < 1,024 characters
- [ ] SKILL.md ≤ 100 lines
- [ ] 3–5 inline red flags (not a separate doc)
- [ ] No HOW content in description (trigger + output contract only)
- [ ] Overlap with existing skills checked and resolved

---

## Red Flags

❌ **Description too broad** — triggers on everything; narrows to nothing; make the exclusion explicit
❌ **Skill duplicates existing skill** — update the existing skill with a reference instead of creating new
❌ **No red flags** — every skill has failure modes; name them before shipping
❌ **Script for non-deterministic output** — scripts are for reliable, repeatable ops only
