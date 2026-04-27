"""compress.py — compress a Markdown file in-place to caveman-style prose.
Creates <stem>.original.md backup before overwriting.
"""
import argparse
import os
import re
import shutil
import sys
from pathlib import Path

ARTICLES = re.compile(r'\b(a|an|the)\b ', re.IGNORECASE)
FILLERS  = re.compile(
    r'\b(just|really|basically|actually|simply|very|quite|rather|fairly)\b ',
    re.IGNORECASE,
)
# path pattern: word-chars on both sides of / or \ (avoids bare '/' catching fractions)
_PATH_RE = re.compile(r'[A-Za-z0-9_.\-]+[/\\][A-Za-z0-9_.\-]')


def backup_path(target: str) -> str:
    root, ext = os.path.splitext(target)
    return root + '.original' + ext


def _is_passthrough(line: str, in_fence: bool) -> bool:
    """Return True if the line must be copied verbatim."""
    if in_fence:
        return True
    s = line.rstrip('\r\n')
    if not s.strip():
        return True
    if s.lstrip().startswith('#'):
        return True
    if s.lstrip().startswith('```'):
        return True
    if 'http://' in s or 'https://' in s:
        return True
    if _PATH_RE.search(s):
        return True
    if '`' in s:
        return True
    if re.search(r'\d+\.\d+', s):
        return True
    return False


def _compress_line(line: str) -> str:
    """Strip articles and filler adverbs from a prose line."""
    nl = ''
    text = line
    if text.endswith('\r\n'):
        nl, text = '\r\n', text[:-2]
    elif text.endswith('\n'):
        nl, text = '\n', text[:-1]

    text = ARTICLES.sub('', text)
    text = FILLERS.sub('', text)
    text = re.sub(r' {2,}', ' ', text)
    text = text.rstrip(' ')
    return text + nl


def compress_file(target: str) -> dict:
    # Guard: .md only
    if not target.lower().endswith('.md'):
        raise ValueError(f'target must be a .md file: {target}')

    # Guard: confine to cwd to prevent path traversal
    cwd = Path.cwd().resolve()
    resolved = Path(target).resolve()
    try:
        resolved.relative_to(cwd)
    except ValueError:
        raise ValueError(f'target must be inside {cwd}: {target}')

    if not resolved.is_file():
        raise FileNotFoundError(f'file not found: {target}')

    with open(target, 'r', encoding='utf-8', errors='replace', newline='') as f:
        lines = f.readlines()

    bak = backup_path(target)
    if os.path.exists(bak):
        print(f'warning: overwriting existing backup: {bak}', file=sys.stderr)
    shutil.copy2(target, bak)

    out = []
    in_fence = False
    in_frontmatter = False
    passthrough_count = 0

    for i, line in enumerate(lines):
        s = line.rstrip('\r\n')

        # frontmatter block — first --- pair only
        if i == 0 and s.strip() == '---':
            in_frontmatter = True
            out.append(line)
            passthrough_count += 1
            continue
        if in_frontmatter:
            out.append(line)
            passthrough_count += 1
            if s.strip() == '---':
                in_frontmatter = False
            continue

        # fence toggle
        if s.lstrip().startswith('```'):
            in_fence = not in_fence
            out.append(line)
            passthrough_count += 1
            continue

        if _is_passthrough(line, in_fence):
            out.append(line)
            passthrough_count += 1
        else:
            out.append(_compress_line(line))

    with open(target, 'w', encoding='utf-8', newline='') as f:
        f.writelines(out)

    return {
        'original_lines': len(lines),
        'compressed_lines': len(out),
        'passthrough_lines': passthrough_count,
        'backup': bak,
    }


def main() -> None:
    parser = argparse.ArgumentParser(
        description='Compress a Markdown file to caveman prose in-place.'
    )
    parser.add_argument('--target', required=True, help='Path to .md file to compress')
    args = parser.parse_args()

    try:
        result = compress_file(args.target)
    except (ValueError, FileNotFoundError) as e:
        print(f'error: {e}', file=sys.stderr)
        sys.exit(1)

    print(f"compressed: {result['original_lines']} → {result['compressed_lines']} lines")
    print(f"pass-through: {result['passthrough_lines']} lines")
    print(f"backup: {result['backup']}")


if __name__ == '__main__':
    main()
