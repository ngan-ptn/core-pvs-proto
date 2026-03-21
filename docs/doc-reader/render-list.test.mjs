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

test('render-list.json uses forward slashes in file paths', () => {
  const renderList = JSON.parse(readFileSync(manifestPath, 'utf8'));

  for (const section of renderList.sections) {
    for (const filePath of section.files) {
      assert.ok(
        !filePath.includes('\\'),
        `Expected forward slashes in render-list.json path: ${filePath}`,
      );
    }
  }
});

test('render-list.json points to existing files', () => {
  const renderList = JSON.parse(readFileSync(manifestPath, 'utf8'));
  const repoRoot = join(__dirname, '..', '..');

  for (const section of renderList.sections) {
    for (const filePath of section.files) {
      const docReaderPath = join(__dirname, filePath);
      const repoPath = join(repoRoot, filePath);

      assert.ok(
        existsSync(docReaderPath) || existsSync(repoPath),
        `Expected render-list.json path to exist: ${filePath}`,
      );
    }
  }
});
