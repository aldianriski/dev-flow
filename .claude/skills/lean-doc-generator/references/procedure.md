# Lean Doc Generator — Execution Procedure

## Phase 8 Procedure

1. Read the Gate 2 output to identify what was implemented and any decisions made.
2. Apply HOW filter to all proposed content.
3. For each doc touched: update `last_updated` in the ownership header to today.
4. Update `TODO.md`: mark task `[x]`, add Changelog row (File | Change | ADR).
5. If an architectural decision was made → invoke `/adr-writer` to append to `docs/DECISIONS.md`.
6. Extend or append — never regenerate docs from scratch.

## Line Limit Enforcement

If a file is at its limit and new content is needed:
1. Apply HOW filter — remove HOW content first
2. Compress existing prose into bullets
3. Move non-WHY/WHERE content to code comments
4. If still over limit → split into a linked sub-doc

Never raise the line limit. The constraint enforces discipline.
