---
owner: Tech Lead (Aldian Rizki)
last_updated: 2026-05-04
update_trigger: research input changes
status: current
---

# Caveman SKILL.md diff — juliusbrussee vs mattpocock

**Sprint:** 041 T1 · **Date:** 2026-05-04 · **Author:** Claude Opus 4.7

## Sources

| Variant | Source | SHA pin | Lines | License |
|:--------|:-------|:--------|------:|:--------|
| `juliusbrussee/caveman` | local plugin cache `C:/Users/HYPE AMD/.claude/plugins/cache/caveman/caveman/84cc3c14fa1e/skills/caveman/SKILL.md` | `ef6050c5e184` (upstream main) | 67 | MIT |
| `mattpocock/skills` | gh CLI raw `repos/mattpocock/skills/contents/skills/productivity/caveman/SKILL.md` | `b843cb5ea74b` (upstream main) | 49 | MIT |

Both fetched 2026-05-04. Local-cache hash matches `gh api repos/juliusbrussee/caveman/commits/main`.

## Section-level present/absent matrix

| Section | juliusbrussee | mattpocock | Notes |
|:--------|:------:|:------:|:-----|
| Frontmatter `name` | ✓ | ✓ | both `caveman` |
| Frontmatter `description` | ✓ | ✓ | juliusbrussee enumerates intensity levels (lite/full/ultra/wenyan-{lite,full,ultra}); mattpocock generic |
| Lead paragraph | ✓ | ✓ | identical wording: "Respond terse like smart caveman. All technical substance stay. Only fluff die." |
| Persistence | ✓ | ✓ | juliusbrussee adds "Default: full. Switch: /caveman lite\|full\|ultra" |
| Rules (drop list) | ✓ | ✓ | mattpocock collapses abbrev/arrows/conjunctions INTO main Rules; juliusbrussee splits into separate Intensity table |
| Pattern line | ✓ | ✓ | identical: `[thing] [action] [reason]. [next step].` |
| Wrong/Right examples | ✓ | ✓ | identical: auth-middleware bug fix Wrong/Right pair |
| Intensity table | ✓ | ✗ | juliusbrussee: 6-row table (3 English + 3 wenyan); mattpocock: NONE |
| Examples (multi-question × levels) | ✓ (12+ rows) | ✓ (2 rows) | juliusbrussee: 2 questions × 5-6 levels; mattpocock: 2 questions × 1 level |
| Auto-Clarity | ✓ | ✓ | nearly identical wording (mattpocock: "Auto-Clarity Exception"); same destructive-op example |
| Boundaries | ✓ | ✗ | juliusbrussee: explicit "Code/commits/PRs: write normal" + level persistence; mattpocock: no Boundaries section |
| Wenyan (Classical Chinese) | ✓ | ✗ | juliusbrussee only |
| Hooks/MCP/statusline | ✗ (in plugin, not SKILL.md) | ✗ (n/a — pure skill) | both keep SKILL.md hook-free; juliusbrussee plugin layer adds them externally |

## Winner-per-axis

| Axis | Winner | Why |
|:-----|:-------|:----|
| **Brevity** (line count) | mattpocock | 49 vs 67 lines — 27% shorter |
| **Mode flexibility** | juliusbrussee | intensity levels = killer feature for token-budget tuning per response |
| **Multi-language** | juliusbrussee | wenyan adds ~3× compression for Chinese-speaking users; mattpocock English-only |
| **Examples richness** | juliusbrussee | 12+ examples vs 2 — useful for AI internalization |
| **Plugin integration** | juliusbrussee | full plugin: hooks (statusline, hint), MCP middleware, eval harness |
| **Skill-isolation purity** | mattpocock | pure SKILL.md, no plugin sprawl — easier drop-in for skill libraries |
| **Description trigger phrase** | tied | both start with "Use when…" per CC convention |
| **Lead paragraph wording** | tied | byte-identical |

## Net assessment

- **Daily user**: juliusbrussee. Intensity switching + wenyan + plugin integration give superior runtime experience.
- **Skill-library reference**: mattpocock. Pure skill, no plugin overhead, fits a clean skills-only repo (e.g. for static eval/comparison).
- **For dev-flow consumption**: juliusbrussee is already installed locally. mattpocock variant superseded by juliusbrussee for end-user purposes; mattpocock useful only as a reference for "minimal pure-skill" form.

## Recommendation feeding T3 (ADR-020)

1. **No new caveman skill in dev-flow.** Both variants are MIT-licensed and freely installable; cloning would create maintenance burden without value (caveman plugin already in user's local cache).
2. **Document caveman as an external reference, not a fork.** Lineage credit to both upstreams in ADR-020. Pin SHAs for re-diff cadence.
3. **No statusline-badge decision in this sprint** (OQ1 deferred per probe).
4. **Reject caveman-shrink MCP** (per probe line 71): MCP middleware injects compression at message-send time; conflates skill-level discipline with transport-level rewrite; unreviewable diffs in commits where caveman-shrink fired vs not.
5. **Adopt 3-arm eval methodology in spirit** (already done — Sprint 034 ADR-001) and port the harness behavior to JS in TASK-115 (see T2 research note).

## Re-diff cadence

Re-fetch via gh CLI when either upstream main SHA changes. Bump SHA pins in this file + ADR-020.
