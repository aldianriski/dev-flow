# dev-flow — Out of Scope

"We considered this and said no" surface. Each pointer file = one negative-space decision discoverable at the repo root, with a re-evaluation trigger so the decision is not silent forever.

## Convention

- File name: `<kebab-case-slug>.md`
- Frontmatter: `date`, `sourcing_adr`, `re_eval_trigger`
- Body: 1 paragraph context + 1 paragraph re-eval criteria
- Length cap: ≤20 lines per pointer

## Relationship to `docs/adr/`

ADRs record DECISIONS (Context / Decision / Alternatives / Consequences). `.out-of-scope/` pointers are DISCOVERABLE INDEX entries that point back to the relevant ADR's rejection rationale. ADR is the source-of-truth; pointer is the discovery surface.

## How to add

1. Identify the negative-space decision and its sourcing ADR.
2. Define the re-evaluation trigger (specific condition that should reopen the decision).
3. Create `.out-of-scope/<slug>.md` with frontmatter + ≤2 paragraphs.
4. Cross-link from the sourcing ADR's Consequences section.

## Lineage

Convention adapted from `mattpocock/skills/.out-of-scope/` (MIT, upstream `b843cb5ea74b`). dev-flow seed = 3 pointers from prior EPIC-Audit ADRs (021 + 020).
