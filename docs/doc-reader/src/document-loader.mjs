import { existsSync, readFileSync, statSync } from 'node:fs';
import { basename, dirname, extname, isAbsolute, join } from 'node:path';
import { resolveSectionFiles } from './file-resolver.mjs';

const IMAGE_EXTENSIONS = new Set(['.png', '.jpg', '.jpeg', '.gif', '.webp']);

function getMimeType(imagePath) {
  const ext = extname(imagePath).toLowerCase();
  if (ext === '.jpg' || ext === '.jpeg') return 'image/jpeg';
  if (ext === '.png') return 'image/png';
  if (ext === '.gif') return 'image/gif';
  return 'image/webp';
}

function resolveImagePath(rawImagePath, sourceDir, repoRoot) {
  if (isAbsolute(rawImagePath)) return rawImagePath;

  const inSourceDir = join(sourceDir, rawImagePath);
  if (existsSync(inSourceDir)) return inSourceDir;

  const inRepo = join(repoRoot, rawImagePath);
  if (existsSync(inRepo)) return inRepo;

  return rawImagePath;
}

function embedScreenshots(content, sourceDir, repoRoot, screenshots) {
  const clickRegex = /click\s+(\S+)\s+"([^"]+\.(?:png|jpg|jpeg|gif|webp))"\s+"[^"]*"/g;
  let match = clickRegex.exec(content);

  while (match !== null) {
    const nodeId = match[1];
    const rawImagePath = match[2];
    const imagePath = resolveImagePath(rawImagePath, sourceDir, repoRoot);
    const ext = extname(imagePath).toLowerCase();

    if (existsSync(imagePath) && IMAGE_EXTENSIONS.has(ext)) {
      const imageData = readFileSync(imagePath);
      const mimeType = getMimeType(imagePath);
      screenshots[nodeId] = `data:${mimeType};base64,${imageData.toString('base64')}`;
      console.log(`  Screenshot embedded: ${nodeId} <- ${imagePath}`);
    } else {
      console.log(`  Screenshot not found (skipping): ${rawImagePath}`);
    }

    match = clickRegex.exec(content);
  }

  return content.replace(
    /click\s+(\S+)\s+"([^"]+\.(?:png|jpg|jpeg|gif|webp))"\s+"[^"]*"/g,
    (_, nodeId) => (screenshots[nodeId] ? `click ${nodeId} callback "showScreenshot"` : ''),
  );
}

function loadDocument(fullPath, options) {
  const sourceDir = options.sourceDir;
  const originalContent = readFileSync(fullPath, 'utf8');
  const content = embedScreenshots(originalContent, sourceDir, options.repoRoot, options.screenshots);
  const filename = basename(fullPath);
  const mtime = statSync(fullPath).mtimeMs;

  return {
    filename,
    content,
    mtime,
    sourcePath: fullPath,
    folder: options.folder,
    navLabel: options.navLabel,
  };
}

export function collectDocuments({ manifest, docReaderDir, repoRoot }) {
  const documents = [];
  const navSections = [];
  const screenshots = {};

  for (const section of manifest.sections) {
    const sectionFiles = resolveSectionFiles(section, { docReaderDir, repoRoot });
    if (sectionFiles.length === 0) {
      console.log(`  WARNING: section "${section.label}" has no renderable files (skipping)`);
      continue;
    }

    const isSingleItem = section.file !== undefined;
    const docIndices = [];

    for (const fullPath of sectionFiles) {
      const docIndex = documents.length;
      const document = loadDocument(fullPath, {
        sourceDir: dirname(fullPath),
        repoRoot,
        screenshots,
        folder: isSingleItem ? null : section.label,
        navLabel: isSingleItem ? section.label : null,
      });

      documents.push(document);
      docIndices.push(docIndex);
    }

    navSections.push({
      label: section.label,
      isSingleItem,
      docIndices,
    });
  }

  return { documents, navSections, screenshots };
}
