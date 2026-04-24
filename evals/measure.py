#!/usr/bin/env python3
# python evals/measure.py <snapshot.json>          -- single snapshot
# python evals/measure.py <snapshots-dir/>         -- all *.json recursively
"""Three-arm skill eval harness. Reads committed snapshot fixtures; no API calls."""

import json
import re
import sys
from pathlib import Path

# Procedural openers that signal HOW content
_HOW_PATTERN = re.compile(
    r"^\s*(first[,\s]|then[,\s]|next[,\s]|run |execute |install |copy |apply |start |call |invoke |send |create |open )",
    re.IGNORECASE,
)

ARMS = ("baseline", "terse_control", "skill")
COL = 18


def _metrics(text: str) -> dict:
    words = len(text.split())
    lines = len([l for l in text.splitlines() if l.strip()])
    how_hits = sum(1 for line in text.splitlines() if _HOW_PATTERN.match(line))
    return {"word_count": words, "line_count": lines, "how_content_flag": how_hits}


def _delta(a: int, b: int) -> str:
    if b == 0:
        return "n/a"
    pct = (a - b) / b * 100
    return f"{pct:+.1f}%"


def measure(path: Path) -> None:
    try:
        data = json.loads(path.read_text(encoding="utf-8"))
    except (json.JSONDecodeError, OSError) as e:
        print(f"WARNING: skipping {path} — {e}", file=sys.stderr)
        return
    arms = data.get("arms", {})
    skill = data.get("skill", "?")
    version = data.get("skill_version", "?")
    date = data.get("date", "?")

    m = {arm: _metrics(arms[arm].get("output", "")) for arm in ARMS if arm in arms}

    print(f"\n{'-' * 60}")
    print(f"  {skill} v{version}  [{date}]  {path.name}")
    print(f"{'-' * 60}")
    header = f"{'metric':<{COL}}" + "".join(f"{a:>{COL}}" for a in ARMS)
    print(header)
    print("-" * len(header))

    for metric in ("word_count", "line_count", "how_content_flag"):
        row = f"{metric:<{COL}}"
        for arm in ARMS:
            val = m.get(arm, {}).get(metric, "-")
            row += f"{str(val):>{COL}}"
        print(row)

    # Derived deltas (skill vs baseline, skill vs terse_control)
    if "baseline" in m and "skill" in m:
        bd = _delta(m["skill"]["word_count"], m["baseline"]["word_count"])
        print(f"\n  brevity_delta       (skill vs baseline):       {bd}")
    if "terse_control" in m and "skill" in m:
        td = _delta(m["skill"]["word_count"], m["terse_control"]["word_count"])
        print(f"  terse_isolation_delta (skill vs terse_control): {td}")

    missing = [a for a in ARMS if a not in arms]
    if missing:
        print(f"\n  WARNING: missing arms: {', '.join(missing)}")


_PROJECT_ROOT = Path(__file__).resolve().parent.parent


def main() -> None:
    if len(sys.argv) < 2:
        print("Usage: measure.py <snapshot.json | snapshots-dir/>", file=sys.stderr)
        sys.exit(1)

    target = Path(sys.argv[1])
    if not target.resolve().is_relative_to(_PROJECT_ROOT):
        print(f"Error: path must be within project root ({_PROJECT_ROOT})", file=sys.stderr)
        sys.exit(1)

    if target.is_dir():
        snapshots = sorted(target.rglob("*.json"))
        if not snapshots:
            print(f"No *.json snapshots found in {target}", file=sys.stderr)
            sys.exit(1)
        for snap in snapshots:
            measure(snap)
    elif target.is_file():
        measure(target)
    else:
        print(f"Path not found: {target}", file=sys.stderr)
        sys.exit(1)

    print()


if __name__ == "__main__":
    main()
