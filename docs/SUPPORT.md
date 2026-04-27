---
owner: Tech Lead (Aldian Rizki)
last_updated: 2026-04-27
update_trigger: Support channel changes; SLA changes; friction-report template updated
status: current
---

# dev-flow — Support

## Support channel

**Slack**: `#dev-flow` — owned by Tech Lead (Aldian Rizki).

Post here for: setup blockers, phase failures, unexpected behavior, skill questions.

**First-response SLA**: 2 business days for any filed friction report or channel question.

## Friction reports

File a friction report when a dev-flow phase produces unexpected output, a gate fires unexpectedly, or the workflow slows you down without clear reason.

**Template**: [`docs/templates/friction-report.md`](templates/friction-report.md)

**Filing rule**: copy the template into a new message in `#dev-flow` (or attach as a file). Do not open a GitHub issue unless the report reveals a confirmed bug — friction reports are signal-gathering first.

**When to file**:
- A gate (Gate 0/1/2) blocked work you believe should have passed.
- A phase instruction was ambiguous or contradictory.
- Onboarding took longer than expected at any step.
- Any hard stop fired that you couldn't resolve within 10 minutes.

**SLA**: acknowledged within 2 business days. Resolution timeline depends on severity.

## Escalation

If `#dev-flow` is unresponsive within SLA, ping the owner directly: @Aldian Rizki.

P0/P1 friction (workflow-breaking): escalate immediately. Do not wait for SLA.
