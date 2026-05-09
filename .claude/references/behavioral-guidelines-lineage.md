---
owner: Tech Lead (Aldian Rizki)
last_updated: 2026-05-08
update_trigger: Karpathy upstream CLAUDE.md substantive change
status: current
---

# Behavioral Guidelines Lineage

The four principles in [`.claude/CLAUDE.md`](../CLAUDE.md) § Behavioral Guidelines (Think Before Acting · Simplicity First · Surgical Changes · Goal-Driven Execution) derive from `forrestchang/andrej-karpathy-skills` `CLAUDE.md` (MIT License). Verified against upstream commit `2c606141936f` on **2026-05-04**.

**Adaptation type:** intentional rewording for meta-repo context — dev-flow has no app-code domain; principles distilled from karpathy's bulleted format to single-paragraph form.

| Principle | Karpathy headline | dev-flow headline | Adaptation |
|---|---|---|---|
| 1 | Think Before **Coding** | Think Before **Acting** | "Coding" → "Acting" (meta-repo: doc/skill work, no code) |
| 2 | Simplicity First | Simplicity First | "code" → "content"; drops "200 lines" specifics |
| 3 | Surgical Changes | Surgical Changes | "code" → "task"; drops orphan-removal subsection (covered by Sprint 039 retro pattern) |
| 4 | Goal-Driven Execution | Goal-Driven Execution | distilled prose; transform examples + verify-step format are out (T3 decides whether to re-add) |

**License:** MIT. Attribution: `forrestchang/andrej-karpathy-skills` (Andrej Karpathy patterns). When the upstream `CLAUDE.md` substantively changes, re-diff and bump the verified-at SHA + date here. ADR-019 (Sprint 040) records the adoption decision.

## Provenance

Originally co-located in [`.claude/CONTEXT.md`](../CONTEXT.md) § Behavioral Guidelines Lineage. Relocated to this references file in Sprint 048 (T5) to free CONTEXT.md cap space for new content (User-Project Lens principle + G1 outcome item + vocab entry per ADR-026). Content moved verbatim — SHA pin and verified-at date unchanged.
