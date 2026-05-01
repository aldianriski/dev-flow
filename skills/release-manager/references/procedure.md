# Release Manager — Execution Procedure

1. **Read current version** from `package.json`, `pyproject.toml`, `go.mod`, or `VERSION` file.
   If no version file found → ask user to specify before proceeding.
2. **Classify changes** from `git log` since last tag — label each commit MAJOR / MINOR / PATCH.
3. **Confirm bump** with user before writing anything.
4. **Generate CHANGELOG entry** using the CHANGELOG Entry Format in `../SKILL.md`.
5. **Update version file** (e.g., `"version"` in `package.json`).
6. **Propose tag command** — do not run it: `git tag -a v[version] -m "Release v[version]"`
