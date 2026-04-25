#!/usr/bin/env python3
# python evals/measure.py <snapshot.json>                    -- single snapshot
# python evals/measure.py <snapshots-dir/>                   -- all *.json recursively
# python evals/measure.py compare <old.json> <new.json>      -- delta between two snapshots
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


def _check_inside(path: Path) -> bool:
    resolved = path.resolve()
    try:
        return resolved.is_relative_to(_PROJECT_ROOT)
    except AttributeError:
        # Python < 3.9: Path.is_relative_to unavailable
        return _PROJECT_ROOT in resolved.parents or resolved == _PROJECT_ROOT


def compare(old_path: Path, new_path: Path) -> None:
    if old_path.resolve() == new_path.resolve():
        print("WARNING: old and new paths resolve to the same file — nothing to compare", file=sys.stderr)
        return False

    try:
        old_data = json.loads(old_path.read_text(encoding="utf-8"))
    except (json.JSONDecodeError, OSError) as e:
        print(f"WARNING: skipping {old_path} — {e}", file=sys.stderr)
        return
    try:
        new_data = json.loads(new_path.read_text(encoding="utf-8"))
    except (json.JSONDecodeError, OSError) as e:
        print(f"WARNING: skipping {new_path} — {e}", file=sys.stderr)
        return

    old_skill = old_data.get("skill", "?")
    new_skill = new_data.get("skill", "?")
    if old_skill != new_skill:
        print(f"WARNING: comparing snapshots from different skills ({old_skill} vs {new_skill})", file=sys.stderr)

    old_ver = old_data.get("skill_version", "?")
    new_ver = new_data.get("skill_version", "?")
    old_date = old_data.get("date", "?")
    new_date = new_data.get("date", "?")

    print(f"\n{'-' * 60}")
    print(f"  COMPARE: {old_skill}")
    print(f"  old: v{old_ver} [{old_date}]  {old_path.name}")
    print(f"  new: v{new_ver} [{new_date}]  {new_path.name}")
    print(f"{'-' * 60}")

    old_arms = old_data.get("arms", {})
    new_arms = new_data.get("arms", {})

    for arm in ARMS:
        in_old = arm in old_arms
        in_new = arm in new_arms
        if not in_old and not in_new:
            continue
        if not in_old:
            print(f"WARNING: arm '{arm}' missing in old snapshot — skipping", file=sys.stderr)
            continue
        if not in_new:
            print(f"WARNING: arm '{arm}' missing in new snapshot — skipping", file=sys.stderr)
            continue

        m_old = _metrics(old_arms[arm].get("output", ""))
        m_new = _metrics(new_arms[arm].get("output", ""))

        print(f"\narm: {arm}  (+% = new larger, -% = new smaller)")
        header = f"{'metric':<{COL}}{'old':>{COL}}{'new':>{COL}}{'delta':>{COL}}"
        print(header)
        print("-" * len(header))
        for metric in ("word_count", "line_count", "how_content_flag"):
            v_old = m_old[metric]
            v_new = m_new[metric]
            d = _delta(v_new, v_old)
            print(f"{metric:<{COL}}{str(v_old):>{COL}}{str(v_new):>{COL}}{d:>{COL}}")


def main() -> None:
    if len(sys.argv) < 2:
        print(
            "Usage: measure.py <snapshot.json | snapshots-dir/>\n"
            "       measure.py compare <old.json> <new.json>",
            file=sys.stderr,
        )
        sys.exit(1)

    if sys.argv[1] == "compare":
        if len(sys.argv) < 4:
            print("Usage: measure.py compare <old.json> <new.json>", file=sys.stderr)
            sys.exit(1)
        paths = []
        for arg in (sys.argv[2], sys.argv[3]):
            p = Path(arg)
            if not _check_inside(p):
                print(f"Error: path must be within project root ({_PROJECT_ROOT})", file=sys.stderr)
                sys.exit(1)
            if not p.resolve().is_file():
                print(f"Path not found: {p}", file=sys.stderr)
                sys.exit(1)
            paths.append(p)
        did_compare = compare(paths[0], paths[1])
        print()
        if did_compare is False:
            sys.exit(1)
        return

    target = Path(sys.argv[1])
    if not _check_inside(target):
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
