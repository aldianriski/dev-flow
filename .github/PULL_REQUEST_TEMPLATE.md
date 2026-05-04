<!--
PR template adapted from obra/superpowers (MIT) — Sprint 042 T4 / ADR-021.
Lifted: structure (problem → change → alternatives → rigor → review).
Dropped: maintainer-frustration framing, superpowers-specific bootstrap acceptance test.
Added: dev-flow sprint reference, DoD checklist, ADR-016 skill-change rule, layer values.
-->

## Sprint reference

<!-- Which sprint does this PR close or contribute to? Use sprint number + task ID.
     Example: "Sprint 042 T4 — PR template lift". If unrelated to any sprint, say so. -->

## What problem are you trying to solve?

<!-- Describe the specific problem encountered. If this came from a session, include:
     what you were doing, what went wrong, the model's exact failure mode, and a
     transcript or session log if possible. "Improving X" is not a problem statement —
     what broke? what failed? what was the user experience that motivated this? -->

## What does this PR change?

<!-- 1–3 sentences. WHAT, not WHY (the why belongs above). -->

## What alternatives did you consider?

<!-- Other approaches tried or evaluated. Why were they worse? "I didn't consider
     alternatives" is acceptable for trivial fixes; flagged for non-trivial changes. -->

## Does this PR contain multiple unrelated changes?

<!-- If yes: split into separate PRs. If you believe the changes are related,
     explain the dependency chain. -->

## Layers touched

<!-- From CLAUDE.md layer values: governance, docs, scripts, skills, agents, templates,
     examples, ci. List all that apply. -->

- Layer(s):

## Definition of Done (per CLAUDE.md)

- [ ] Acceptance criteria verified
- [ ] Code review: 0 blocking issues (or noted exceptions)
- [ ] CONTEXT.md updated if vocabulary or agent roster changed
- [ ] ADR written for hard-to-reverse decisions
- [ ] Line limits respected: CLAUDE.md ≤80 · SKILL.md ≤100 · agents ≤30

## Skill or agent behavior change? (per ADR-016)

- [ ] **Not applicable** — this PR does NOT change skill or agent behavior
- [ ] **Eval evidence attached** — paste skill-triggering acceptance harness output below or link to it. Skill-description rewordings, agent prompt changes, and Red Flags additions all count as behavior changes.

<details>
<summary>Eval evidence (if applicable)</summary>

```
paste run-test.ps1 output, or describe manual acceptance run, or link to log file
```

</details>

## Rigor

- [ ] Tested adversarially (not just the happy path)
- [ ] If hooks/scripts touched: tested on Windows path-with-spaces (per `feedback_windows_hook_quoting`)
- [ ] If gh CLI invoked: leading-slash dropped (per `feedback_gh_cli_no_leading_slash`)

## Human review

- [ ] A human has reviewed the COMPLETE proposed diff before submission

## ADR or sprint follow-up

<!-- If this PR makes a hard-to-reverse decision, link the ADR (or note "ADR pending
     in next commit"). If it adds a backlog task, list the TASK ID. -->
