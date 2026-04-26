# BASELINE_ASPECT.md
## Multi-Agent AI Orchestration — Production Readiness Audit

**Purpose:** A recurring checklist to audit whether your multi-agent system is on track for production reliability, cost efficiency, and maintainability. Run this audit monthly, before major releases, and after any architectural change.

**How to use:**
- Mark each item: `[x]` Done · `[~]` Partial · `[ ]` Missing · `[N/A]` Not applicable
- For Partial/Missing items in **Critical** sections, open a tracked issue immediately.
- Track scores over time. A regression in any Critical category blocks release.

**Scoring guide (per section):**
- **90–100% Done** → Production-grade
- **70–89%** → Acceptable for staging, risky for production
- **<70%** → Prototype-grade. Do not put in front of users at scale.

---

## 0. Foundational Honesty (Critical)

> If you cannot answer YES to all of these, every other section is built on assumptions, not facts.

- [ ] I have run the system 50+ times on representative inputs and recorded the actual success rate (not perceived).
- [ ] I can draw the agent topology (who calls whom, what tools, in what order) on one page.
- [ ] I know the average and p95 number of LLM calls per user request.
- [ ] I know the average and p95 cost per user request in USD.
- [ ] I know the average and p95 latency per user request.
- [ ] I have a documented loop-termination strategy (max steps, token budget, confidence gate) — not "the agent decides."
- [ ] I can name the top 3 ways my system fails in production today.

---

## 1. Evaluation Foundation (Critical)

> Without evals, "reliability" is undefined. This section gates everything else.

### 1.1 Golden Dataset
- [ ] Golden dataset exists with at least 30 hand-curated examples (target: 200+).
- [ ] Dataset covers happy paths, known edge cases, adversarial inputs, and ambiguous cases.
- [ ] Each example includes the *expected trajectory* (which tools, in roughly what order), not just final output.
- [ ] Dataset is version-controlled and reviewed quarterly for staleness.
- [ ] Interesting production traces are periodically promoted into the eval set.

### 1.2 Metrics at Three Levels
- [ ] **Task-level:** Did the agent accomplish the user's goal? Measured automatically.
- [ ] **Step-level:** Did each tool call have valid arguments and reasonable outputs?
- [ ] **Trajectory-level:** Was the path efficient? Loops, wandering, redundant calls flagged.
- [ ] Deterministic checks used wherever possible (schema validation, exact match, tool selection).
- [ ] LLM-as-judge used for subjective quality, with the judge prompt itself versioned.
- [ ] Human review covers a sampled percentage of production traffic.

### 1.3 CI Integration
- [ ] Eval suite runs automatically on every prompt change.
- [ ] Eval suite runs automatically on every model version change.
- [ ] Eval suite runs automatically on every tool definition change.
- [ ] Regressions block merge — not just warn.
- [ ] Eval scores tracked over time on a visible dashboard.
- [ ] Eval runtime is fast enough to actually run in CI (<15 min for the smoke set).

---

## 2. Observability for Non-Determinism (Critical)

> Standard APM is insufficient for agents. You need trace-level, replayable telemetry.

### 2.1 Trace Capture
- [ ] Every LLM call captures: input, output, model version, prompt version, tokens in/out, latency, cost.
- [ ] Every tool call captures: arguments, return value, duration, errors.
- [ ] Full agent trajectory is captured as a tree/DAG, not flat logs.
- [ ] One observability backend chosen and committed to (Langfuse, Arize, LangSmith, OTEL, etc.) — no fragmentation.
- [ ] Traces are queryable by user, session, feature, agent, and tool.

### 2.2 Replay & Debug
- [ ] Any production trace can be replayed in dev with one command.
- [ ] Replay includes the same model version, prompt version, and tool definitions used in prod.
- [ ] Engineers can step through an agent trajectory like a debugger.

### 2.3 Cost Attribution
- [ ] Every user-facing request has a total cost tag.
- [ ] Costs aggregate by user, feature, agent, tool, and model.
- [ ] Top 10 most expensive request types are known and reviewed monthly.

### 2.4 Alerting on the Right Things
- [ ] Alert on eval score regression (not just error rate).
- [ ] Alert on agents hitting max-step or max-token limits.
- [ ] Alert on cost-per-request anomalies (e.g., 3x baseline).
- [ ] Alert on structured output validation failure rate spikes.
- [ ] Alert on unusual tool-call patterns (loops, never-called tools, new tool combos).

---

## 3. Reliability & Architectural Discipline (Critical)

> Apply the deterministic / non-deterministic separation principle hard.

### 3.1 Constrained Autonomy
- [ ] System is designed as a workflow with LLM decision points, not free-roaming agents — UNLESS task genuinely requires open-ended autonomy.
- [ ] If multi-agent: each agent has a narrow, well-defined responsibility.
- [ ] Tool sets are scoped per phase/agent, not "every tool available always."
- [ ] State machine or explicit phases govern progression.
- [ ] Single-agent baseline has been benchmarked against multi-agent design (with evals).

### 3.2 Output Validation
- [ ] Every LLM output that crosses a boundary is validated against a schema (JSON Schema, Pydantic, tool-use schema).
- [ ] Invalid outputs trigger bounded retry, not silent acceptance.
- [ ] No unvalidated LLM output is ever passed to a state-mutating tool.

### 3.3 Hard Limits (Loud Failures)
- [ ] Max steps per agent run — enforced and alerted.
- [ ] Max total tokens per request — enforced and alerted.
- [ ] Max wallclock time per request — enforced and alerted.
- [ ] Max recursive depth for sub-agents — enforced.
- [ ] Max parallel tool calls — enforced.
- [ ] Hitting any limit escalates to human review or degraded path, not silent truncation.

### 3.4 Idempotency & State Safety
- [ ] All tool calls that mutate state are idempotent OR guarded by a deduplication layer.
- [ ] Agents can safely retry without double-charging, double-sending, double-writing.
- [ ] External side effects (emails, payments, posts) have an explicit approval gate or dry-run mode for testing.

### 3.5 Failure Isolation
- [ ] One sub-agent crashing does not crash the whole workflow.
- [ ] Per-agent timeouts are set.
- [ ] Circuit breakers exist for unreliable downstream tools.
- [ ] Graceful degradation paths exist (e.g., fall back to simpler agent or human handoff).

### 3.6 Prompt Injection Defense
- [ ] All retrieved content (web, docs, tool outputs) is treated as untrusted input.
- [ ] Retrieved content cannot elevate agent permissions or override system instructions.
- [ ] Tool execution is sandboxed where feasible (no shell access from arbitrary LLM output).
- [ ] System prompts and user content are clearly delimited in the message structure.

---

## 4. Cost Engineering (High Priority)

> Optimize only after correctness is measured. Track cost per *successful task*, not cost per token.

### 4.1 Model Routing
- [ ] Cheap models used for routing, classification, and easy subtasks.
- [ ] Expensive models reserved for genuinely hard reasoning steps.
- [ ] Routing decisions are eval-validated (not vibes).
- [ ] Top-tier model usage is justified per call site.

### 4.2 Caching
- [ ] Prompt caching enabled for stable prefixes (system prompts, tool definitions, large context).
- [ ] Cacheable parts of prompts are structurally separated from variable parts.
- [ ] Semantic caching for repeated queries — with explicit staleness/correctness review.
- [ ] Cache hit rates are monitored.

### 4.3 Context Management
- [ ] Long agent trajectories are summarized, not accumulated indefinitely.
- [ ] Old tool outputs are pruned or compressed when no longer relevant.
- [ ] Scratchpad pattern used instead of full history where appropriate.
- [ ] Context size per request is monitored, with anomaly alerts.

### 4.4 Parallelism & Batching
- [ ] Independent tool calls run in parallel where dependencies allow.
- [ ] Async/batch APIs used for non-realtime work (e.g., Anthropic Message Batches for ~50% discount).

### 4.5 Cost Discipline
- [ ] Cost per successful task (not per token) is the headline cost metric.
- [ ] Monthly cost review identifies top spenders and optimization candidates.
- [ ] Budget alerts exist at user, feature, and total levels.

---

## 5. Engineering Velocity & Maintainability (High Priority)

### 5.1 Versioning Everything
- [ ] Prompts versioned in source control (not hardcoded strings scattered across files).
- [ ] Model IDs pinned, not floating to "latest."
- [ ] Tool definitions versioned.
- [ ] Retrieval indices versioned.
- [ ] Every production trace tagged with versions of all of the above.

### 5.2 Code Quality Fundamentals
- [ ] Type safety enforced (TypeScript, Python type hints + mypy/pyright).
- [ ] LLM provider access is behind an abstraction layer (not direct SDK calls everywhere).
- [ ] Dependency injection used for testability (mock LLMs, mock tools in tests).
- [ ] Integration tests exist for the orchestration layer.
- [ ] Code review covers prompt changes, not just code changes.

### 5.3 Framework Discipline
- [ ] Framework choice is justified, not cargo-culted from Twitter.
- [ ] Heavy framework lock-in is avoided in core orchestration logic.
- [ ] Boring, battle-tested infrastructure preferred (e.g., Temporal, Postgres, plain state machines) over weekly-changing trendy frameworks.

### 5.4 Documentation
- [ ] Agent topology diagram exists and is current.
- [ ] Each agent's responsibility, inputs, outputs, and tools are documented.
- [ ] Runbooks exist for common failure modes (see section 7).
- [ ] New engineers can onboard in <1 week using existing docs.

---

## 6. Safety, Compliance & Human Oversight (High Priority)

> Reordered up: for systems that take *actions*, this is closer to Critical than the original ranking suggests.

### 6.1 Human-in-the-Loop
- [ ] Decision matrix exists: which agent actions are fully autonomous, which require async human review, which require synchronous approval.
- [ ] High-stakes actions (financial, irreversible, external communication) require human approval.
- [ ] Approval UI exists — built before it was urgently needed.

### 6.2 Auditability
- [ ] Every agent action is reconstructable: who triggered it, what context, which prompts, which model, what output, what side effect.
- [ ] Audit logs are tamper-evident and retained per compliance requirements.

### 6.3 Safety Guardrails
- [ ] Output filtering for sensitive content categories relevant to your domain.
- [ ] PII handling reviewed: what gets sent to model providers, what gets logged, what gets retained.
- [ ] Data residency requirements satisfied (region-pinned model endpoints if needed).
- [ ] User data deletion path includes traces, eval datasets, and cached outputs.

### 6.4 Adversarial Robustness
- [ ] Red-team exercises run against the agent (jailbreaks, prompt injection, tool misuse).
- [ ] Findings are added to the eval suite as regression tests.

---

## 7. Production Operations (High Priority)

### 7.1 Deployment Safety
- [ ] Canary deploys for prompt and model changes (e.g., 5% traffic).
- [ ] Live evals run on canary; auto-rollback on regression.
- [ ] Feature flags allow per-user or per-cohort rollout.

### 7.2 Model Provider Risk
- [ ] Provider abstraction layer allows switching models with minimal code change.
- [ ] Fallback model configured for provider outages.
- [ ] Model deprecation calendar tracked; migration playbook exists.
- [ ] Shadow-mode testing process exists for new model versions.

### 7.3 Runbooks (Each Should Exist)
- [ ] "Agent stuck in loop"
- [ ] "Tool returning malformed data"
- [ ] "Eval scores dropped overnight"
- [ ] "Costs spiked 3x"
- [ ] "Model provider outage"
- [ ] "Prompt injection incident"
- [ ] "Customer reports bad agent behavior"

### 7.4 On-Call Readiness
- [ ] On-call rotation defined for the AI system specifically (not bundled with general infra).
- [ ] On-call has dashboard access, replay tools, and runbook access.
- [ ] Escalation path defined for safety incidents vs. reliability incidents.

---

## 8. Common Blind Spots (Self-Check)

> Re-read these every audit. Teams keep falling into the same traps.

- [ ] Have I justified the multi-agent design against a single-agent baseline using evals? (Inter-agent chatter is often pure cost with little quality gain.)
- [ ] Do I have a memory/state management strategy that survives long conversations and context overflow?
- [ ] Has the eval set been refreshed in the last 90 days?
- [ ] Am I optimizing the right metric — cost per *successful task*, not cost per token or per request?
- [ ] Am I confusing "the demo worked" with "the system is reliable"? (Run the 50-trial test from section 0 again.)
- [ ] Is there any prompt that exists only in production, not in source control?
- [ ] Is there any tool the agent can call that I would not be comfortable letting it call 1,000 times in a row at 3 AM?

---

## Audit Summary Template

Fill out at the end of each audit cycle.

```
Audit date:
Auditor:
Release/version:

Section scores:
  0. Foundational Honesty:           __ / __
  1. Evaluation Foundation:          __ / __
  2. Observability:                  __ / __
  3. Reliability & Architecture:     __ / __
  4. Cost Engineering:               __ / __
  5. Engineering Velocity:           __ / __
  6. Safety & Compliance:            __ / __
  7. Production Operations:          __ / __
  8. Blind Spot Self-Check:          __ / __

Critical gaps (must fix before next release):
  -

Top 3 improvement priorities for next cycle:
  1.
  2.
  3.

Trend vs. last audit (improving / stable / regressing):

Notes:
```

---

## Guiding Principles (Re-read Before Each Audit)

1. **Workflows beat agents whenever possible.** Reach for full autonomy only when the task genuinely requires it.
2. **Every action is auditable.** If you can't reconstruct exactly what happened and why, you can't operate it in production.
3. **Evals are the contract.** They define what your system is supposed to do. Treat them like an API contract.
4. **The bill is a quality signal.** Cost spikes usually mean runaway loops or bad routing — not just success.
5. **Boring beats clever for orchestration.** Prefer battle-tested infrastructure over trendy frameworks.
6. **Reliability without correctness is worse than unreliability.** A system that confidently does the wrong thing is the most dangerous failure mode of all.