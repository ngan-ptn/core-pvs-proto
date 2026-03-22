import { existsSync, readdirSync, statSync } from 'node:fs';
import { basename, dirname, extname, isAbsolute, join } from 'node:path';

const SUPPORTED_EXTENSIONS = new Set(['.md', '.html']);

function shouldIncludeFile(filename) {
  const ext = extname(filename).toLowerCase();
  if (!SUPPORTED_EXTENSIONS.has(ext)) return false;
  if (filename.startsWith('_')) return false;
  const normalized = filename.toLowerCase();
  return normalized !== 'readme.md' && normalized !== 'index.html';
}

function resolvePath(pathValue, { docReaderDir, repoRoot }) {
  if (isAbsolute(pathValue)) return pathValue;

  const localPath = join(docReaderDir, pathValue);
  if (existsSync(localPath)) return localPath;

  return join(repoRoot, pathValue);
}

function resolveGlob(pathPattern, context) {
  const dirPattern = dirname(pathPattern);
  const suffix = basename(pathPattern).replace('*', '');
  const resolvedDir = resolvePath(dirPattern, context);
  if (!existsSync(resolvedDir)) return [];

  return readdirSync(resolvedDir)
    .filter((name) => name.endsWith(suffix))
    .map((name) => join(resolvedDir, name))
    .filter((fullPath) => statSync(fullPath).isFile())
    .filter((fullPath) => shouldIncludeFile(basename(fullPath)))
    .sort((a, b) => statSync(b).mtimeMs - statSync(a).mtimeMs);
}

function resolveFile(pathValue, context) {
  if (pathValue.includes('*')) return resolveGlob(pathValue, context);
  const fullPath = resolvePath(pathValue, context);
  if (!existsSync(fullPath) || !statSync(fullPath).isFile()) return [];
  if (!shouldIncludeFile(basename(fullPath))) return [];
  return [fullPath];
}

function resolveFolder(pathValue, context) {
  const fullPath = resolvePath(pathValue, context);
  if (!existsSync(fullPath) || !statSync(fullPath).isDirectory()) return [];

  return readdirSync(fullPath)
    .map((entry) => join(fullPath, entry))
    .filter((entryPath) => statSync(entryPath).isFile())
    .filter((entryPath) => shouldIncludeFile(basename(entryPath)))
    .sort((a, b) => statSync(b).mtimeMs - statSync(a).mtimeMs);
}

export function resolveSectionFiles(section, context) {
  if (section.file) return resolveFile(section.file, context);
  if (section.folder) return resolveFolder(section.folder, context);

  if (Array.isArray(section.files)) {
    return section.files.flatMap((filePath) => resolveFile(filePath, context));
  }

  return [];
}
