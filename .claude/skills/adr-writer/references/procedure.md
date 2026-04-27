# ADR Writer — Execution Procedure

1. Ask the user: "What decision should I record? Describe the context, what was chosen, and what alternatives were rejected."
2. Determine the next ADR number by reading `docs/DECISIONS.md` (or create the file with ownership header if missing).
3. Write the ADR using the format in `../SKILL.md`.
4. Append to `docs/DECISIONS.md` — do NOT regenerate the file from scratch.
5. Update `docs/DECISIONS.md` ownership header: set `last_updated` to today.
