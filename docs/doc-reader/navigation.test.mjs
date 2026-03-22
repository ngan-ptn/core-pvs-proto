import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const buildScriptPath = join(__dirname, 'build.mjs');
const outputPath = join(__dirname, 'index.html');
const manifestPath = join(__dirname, 'render-list.json');

function extractJsonBetween(html, startMarker, endMarker) {
  const startIndex = html.indexOf(startMarker);
  assert.notEqual(startIndex, -1, `Expected to find ${startMarker} in the generated HTML`);

  const jsonStart = startIndex + startMarker.length;
  const endIndex = html.indexOf(endMarker, jsonStart);
  assert.notEqual(endIndex, -1, `Expected to find ${endMarker} after ${startMarker}`);

  return JSON.parse(html.slice(jsonStart, endIndex));
}

test('single-file sections render as direct menu items in manifest order', () => {
  execFileSync(process.execPath, [buildScriptPath], { stdio: 'ignore' });

  const html = readFileSync(outputPath, 'utf8');
  const renderList = JSON.parse(readFileSync(manifestPath, 'utf8'));
  const documents = extractJsonBetween(html, 'const DOCUMENTS = ', ';\nconst SCREENSHOTS = ');
  const navSections = extractJsonBetween(html, 'const NAV_SECTIONS = ', ';\n\nconst THEME_NAME = ');

  assert.equal(navSections.length, renderList.sections.length);
  assert.deepEqual(
    navSections.map(({ label }) => label),
    renderList.sections.map(({ label }) => label),
  );
  assert.equal(navSections[0].isSingleItem, true);
  assert.deepEqual(navSections[0].docIndices, [0]);
  assert.equal(documents[0].navLabel, renderList.sections[0].label);
});

test('multi-file sections are rendered as collapsible groups', () => {
  execFileSync(process.execPath, [buildScriptPath], { stdio: 'ignore' });

  const html = readFileSync(outputPath, 'utf8');
  const navSections = extractJsonBetween(html, 'const NAV_SECTIONS = ', ';\n\nconst THEME_NAME = ');

  assert.equal(navSections[1].isSingleItem, false);
  assert.ok(navSections[1].docIndices.length >= 2);
});

test('theme is loaded from render-list.json', () => {
  execFileSync(process.execPath, [buildScriptPath], { stdio: 'ignore' });

  const html = readFileSync(outputPath, 'utf8');

  assert.ok(html.includes('const THEME_NAME = "classic";'));
  assert.ok(html.includes('--bg-app: #f8fafb;'));
  assert.ok(html.includes('family=JetBrains+Mono:wght@400;700&family=Inter:wght@400;500'));
});

test('folder toggle glyphs are emitted with encoding-safe HTML entities', () => {
  execFileSync(process.execPath, [buildScriptPath], { stdio: 'ignore' });

  const html = readFileSync(outputPath, 'utf8');

  assert.ok(html.includes("&#9662;"));
  assert.ok(html.includes("&#9656;"));
  assert.ok(!html.includes("â–¾"));
  assert.ok(!html.includes("â–¸"));
});

test('active navigation items keep a 16px horizontal inset', () => {
  execFileSync(process.execPath, [buildScriptPath], { stdio: 'ignore' });

  const html = readFileSync(outputPath, 'utf8');

  assert.match(
    html,
    /\.doc-item\.active\s*\{[\s\S]*width:\s*calc\(100% - 32px\);[\s\S]*margin:\s*0 16px;[\s\S]*background:\s*var\(--bg-selected\);[\s\S]*\}/,
  );
});
