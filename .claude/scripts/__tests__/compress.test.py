"""compress.test.py — unit tests for compress.py
Run: python .claude/scripts/__tests__/compress.test.py
"""
import os
import shutil
import subprocess
import sys
import tempfile
import unittest

SCRIPT = os.path.join(os.path.dirname(__file__), '..', 'compress.py')


def run_script(target: str, cwd: str = None):
    return subprocess.run(
        [sys.executable, SCRIPT, '--target', target],
        capture_output=True,
        text=True,
        cwd=cwd,
    )


class TestBackup(unittest.TestCase):
    def setUp(self):
        self.dir = tempfile.mkdtemp()

    def tearDown(self):
        shutil.rmtree(self.dir, ignore_errors=True)

    def _write(self, name: str, content: str) -> str:
        path = os.path.join(self.dir, name)
        with open(path, 'w', encoding='utf-8') as f:
            f.write(content)
        return path

    def test_backup_created(self):
        path = self._write('test.md', 'This is a sentence.\n')
        run_script(path, cwd=self.dir)
        bak = os.path.join(self.dir, 'test.original.md')
        self.assertTrue(os.path.isfile(bak), 'backup file not created')

    def test_backup_equals_original_content(self):
        content = 'This is the original content.\n'
        path = self._write('test.md', content)
        run_script(path, cwd=self.dir)
        bak = os.path.join(self.dir, 'test.original.md')
        with open(bak, encoding='utf-8') as f:
            self.assertEqual(f.read(), content)

    def test_file_overwritten_in_place(self):
        path = self._write('test.md', 'This is a very long sentence.\n')
        run_script(path, cwd=self.dir)
        with open(path, encoding='utf-8') as f:
            result = f.read()
        self.assertNotEqual(result, 'This is a very long sentence.\n')

    def test_missing_file_exits_nonzero_no_backup(self):
        missing = os.path.join(self.dir, 'nonexistent.md')
        result = run_script(missing, cwd=self.dir)
        self.assertNotEqual(result.returncode, 0)
        bak = os.path.join(self.dir, 'nonexistent.original.md')
        self.assertFalse(os.path.isfile(bak), 'backup must not be created when file missing')

    def test_backup_overwrite_warns_stderr(self):
        path = self._write('test.md', 'This is prose.\n')
        bak = os.path.join(self.dir, 'test.original.md')
        with open(bak, 'w', encoding='utf-8') as f:
            f.write('old backup\n')
        result = run_script(path, cwd=self.dir)
        self.assertIn('warning', result.stderr.lower())


class TestGuards(unittest.TestCase):
    def setUp(self):
        self.dir = tempfile.mkdtemp()

    def tearDown(self):
        shutil.rmtree(self.dir, ignore_errors=True)

    def _write(self, name: str, content: str = 'test\n') -> str:
        path = os.path.join(self.dir, name)
        with open(path, 'w', encoding='utf-8') as f:
            f.write(content)
        return path

    def test_non_md_extension_rejected(self):
        path = self._write('test.txt')
        result = run_script(path, cwd=self.dir)
        self.assertNotEqual(result.returncode, 0)
        self.assertIn('error', result.stderr.lower())

    def test_path_traversal_rejected(self):
        # target pointing outside cwd should be rejected
        outside = os.path.join(tempfile.gettempdir(), 'outside.md')
        try:
            with open(outside, 'w', encoding='utf-8') as f:
                f.write('This is outside content.\n')
            result = run_script(outside, cwd=self.dir)
            self.assertNotEqual(result.returncode, 0)
            self.assertIn('error', result.stderr.lower())
        finally:
            if os.path.isfile(outside):
                os.remove(outside)


class TestPassthrough(unittest.TestCase):
    def setUp(self):
        self.dir = tempfile.mkdtemp()

    def tearDown(self):
        shutil.rmtree(self.dir, ignore_errors=True)

    def _compress(self, content: str) -> str:
        path = os.path.join(self.dir, 'test.md')
        with open(path, 'w', encoding='utf-8') as f:
            f.write(content)
        run_script(path, cwd=self.dir)
        with open(path, encoding='utf-8') as f:
            return f.read()

    def test_heading_passes_through(self):
        line = '## This is a heading\n'
        result = self._compress(line)
        self.assertEqual(result, line)

    def test_fenced_code_block_passes_through(self):
        content = '```\nthe quick brown fox\na cat sat\n```\n'
        result = self._compress(content)
        self.assertEqual(result, content)

    def test_url_line_passes_through(self):
        line = 'See https://example.com for details.\n'
        result = self._compress(line)
        self.assertEqual(result, line)

    def test_version_string_passes_through(self):
        line = 'Requires Node 18.0 or higher.\n'
        result = self._compress(line)
        self.assertEqual(result, line)

    def test_blank_line_passes_through(self):
        content = '\n'
        result = self._compress(content)
        self.assertEqual(result, content)

    def test_frontmatter_passes_through(self):
        content = '---\nname: test\nversion: "1.0"\n---\n'
        result = self._compress(content)
        self.assertEqual(result, content)

    def test_crlf_preserved(self):
        path = os.path.join(self.dir, 'test.md')
        with open(path, 'wb') as f:
            f.write(b'This is prose.\r\n')
        run_script(path, cwd=self.dir)
        with open(path, 'rb') as f:
            result = f.read()
        self.assertTrue(result.endswith(b'\r\n'), 'CRLF line ending must be preserved')


class TestCompression(unittest.TestCase):
    def setUp(self):
        self.dir = tempfile.mkdtemp()

    def tearDown(self):
        shutil.rmtree(self.dir, ignore_errors=True)

    def _compress(self, content: str) -> str:
        path = os.path.join(self.dir, 'test.md')
        with open(path, 'w', encoding='utf-8') as f:
            f.write(content)
        run_script(path, cwd=self.dir)
        with open(path, encoding='utf-8') as f:
            return f.read()

    def test_articles_stripped(self):
        result = self._compress('The cat sat on a mat.\n')
        self.assertLess(len(result), len('The cat sat on a mat.\n'))

    def test_filler_stripped(self):
        result = self._compress('This is basically done.\n')
        self.assertNotIn('basically', result)

    def test_prose_shorter_than_input(self):
        original = 'The quick brown fox is basically a very fast animal.\n'
        result = self._compress(original)
        self.assertLess(len(result), len(original))


if __name__ == '__main__':
    unittest.main()
