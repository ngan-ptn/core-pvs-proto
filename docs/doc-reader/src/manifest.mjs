import { existsSync, readFileSync, statSync } from 'node:fs';
import { dirname, isAbsolute, join } from 'node:path';

const SUPPORTED_THEMES = new Set(['classic', 'shell']);
const SUPPORTED_PLACEMENTS = new Set(['main', 'footer']);

function resolvePath(baseDir, rawPath) {
  if (isAbsolute(rawPath)) return rawPath;
  return join(baseDir, rawPath);
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function collectSourcePaths(section) {
  if (section.file) return [section.file];
  if (section.folder) return [section.folder];
  if (Array.isArray(section.files)) return section.files;
  return [];
}

export function loadManifest(manifestPath) {
  const manifestRaw = readFileSync(manifestPath, 'utf8');
  let manifest;

  try {
    manifest = JSON.parse(manifestRaw);
  } catch (error) {
    const hint = manifestRaw.includes('\\')
      ? ' Use forward slashes (/) in JSON paths, or escape backslashes (\\\\).'
      : '';
    throw new Error(`Invalid JSON in ${manifestPath}.${hint} Original error: ${error.message}`);
  }

  const manifestDir = dirname(manifestPath);

  assert(typeof manifest.title === 'string' && manifest.title.trim().length > 0, 'render-list.json: "title" must be a non-empty string.');
  if (!manifest.theme) manifest.theme = 'classic';
  assert(SUPPORTED_THEMES.has(manifest.theme), `render-list.json: "theme" must be one of ${Array.from(SUPPORTED_THEMES).join(', ')}.`);
  assert(Array.isArray(manifest.sections) && manifest.sections.length > 0, 'render-list.json: "sections" must be a non-empty array.');

  manifest.sections.forEach((section, index) => {
    const sectionId = section.label || `#${index + 1}`;
    assert(typeof section.label === 'string' && section.label.trim().length > 0, `render-list.json: section ${sectionId} must have a non-empty "label".`);
    if (section.placement === undefined) section.placement = 'main';
    assert(
      SUPPORTED_PLACEMENTS.has(section.placement),
      `render-list.json: section "${section.label}" placement must be one of ${Array.from(SUPPORTED_PLACEMENTS).join(', ')}.`,
    );

    const sourceKeys = ['file', 'files', 'folder'].filter((key) => section[key] !== undefined);
    assert(sourceKeys.length === 1, `render-list.json: section "${section.label}" must define exactly one of "file", "files", or "folder".`);
    if (section.placement === 'footer') {
      assert(section.file !== undefined, `render-list.json: footer section "${section.label}" must define a single "file" source.`);
    }

    if (section.file !== undefined) {
      assert(typeof section.file === 'string' && section.file.trim().length > 0, `render-list.json: section "${section.label}" has invalid "file".`);
    }
    if (section.folder !== undefined) {
      assert(typeof section.folder === 'string' && section.folder.trim().length > 0, `render-list.json: section "${section.label}" has invalid "folder".`);
    }
    if (section.files !== undefined) {
      assert(Array.isArray(section.files) && section.files.length > 0, `render-list.json: section "${section.label}" has invalid "files".`);
      section.files.forEach((filePath) => {
        assert(typeof filePath === 'string' && filePath.trim().length > 0, `render-list.json: section "${section.label}" contains invalid entry in "files".`);
      });
    }

    collectSourcePaths(section).forEach((sourcePath) => {
      assert(!sourcePath.includes('\\'), `render-list.json: section "${section.label}" must use forward slashes in paths: ${sourcePath}`);

      const resolvedPath = resolvePath(manifestDir, sourcePath);
      const repoResolvedPath = resolvePath(join(manifestDir, '..', '..'), sourcePath);
      assert(
        existsSync(resolvedPath) || existsSync(repoResolvedPath),
        `render-list.json: section "${section.label}" path does not exist: ${sourcePath}`,
      );

      const checkPath = existsSync(resolvedPath) ? resolvedPath : repoResolvedPath;
      if (section.folder !== undefined) {
        assert(statSync(checkPath).isDirectory(), `render-list.json: section "${section.label}" folder path is not a directory: ${sourcePath}`);
      }
    });
  });

  return manifest;
}
