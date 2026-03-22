import assert from 'node:assert/strict';
import test from 'node:test';
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const manifestPath = join(__dirname, 'render-list.json');

test('render-list.json is valid JSON', () => {
  const manifest = readFileSync(manifestPath, 'utf8');
  assert.doesNotThrow(() => JSON.parse(manifest));
});

test('render-list.json sections use exactly one source type', () => {
  const renderList = JSON.parse(readFileSync(manifestPath, 'utf8'));

  for (const section of renderList.sections) {
    const sourceKeys = ['file', 'files', 'folder'].filter((key) => section[key] !== undefined);
    assert.equal(
      sourceKeys.length,
      1,
      `Section "${section.label}" must define exactly one of: file, files, folder`,
    );
  }
});

test('render-list.json uses forward slashes in source paths', () => {
  const renderList = JSON.parse(readFileSync(manifestPath, 'utf8'));

  const collectPaths = (section) => {
    if (section.file) return [section.file];
    if (section.folder) return [section.folder];
    if (Array.isArray(section.files)) return section.files;
    return [];
  };

  for (const section of renderList.sections) {
    for (const sourcePath of collectPaths(section)) {
      assert.ok(
        !sourcePath.includes('\\'),
        `Expected forward slashes in render-list.json path: ${sourcePath}`,
      );
    }
  }
});

test('render-list.json points to existing files/folders', () => {
  const renderList = JSON.parse(readFileSync(manifestPath, 'utf8'));
  const repoRoot = join(__dirname, '..', '..');

  const collectPaths = (section) => {
    if (section.file) return [section.file];
    if (section.folder) return [section.folder];
    if (Array.isArray(section.files)) return section.files;
    return [];
  };

  for (const section of renderList.sections) {
    for (const sourcePath of collectPaths(section)) {
      const docReaderPath = join(__dirname, sourcePath);
      const repoPath = join(repoRoot, sourcePath);

      assert.ok(
        existsSync(docReaderPath) || existsSync(repoPath),
        `Expected render-list.json path to exist: ${sourcePath}`,
      );
    }
  }
});
