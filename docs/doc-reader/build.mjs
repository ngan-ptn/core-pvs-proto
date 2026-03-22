import { writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadManifest } from './src/manifest.mjs';
import { collectDocuments } from './src/document-loader.mjs';
import { buildHtml } from './src/template.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

function parseArgs(argv) {
  const args = { manifestPath: join(__dirname, 'render-list.json'), outputPath: join(__dirname, 'index.html') };

  for (let i = 2; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === '--manifest' && argv[i + 1]) {
      args.manifestPath = resolve(process.cwd(), argv[i + 1]);
      i += 1;
      continue;
    }
    if (arg === '--output' && argv[i + 1]) {
      args.outputPath = resolve(process.cwd(), argv[i + 1]);
      i += 1;
      continue;
    }
  }

  return args;
}

function main() {
  const { manifestPath, outputPath } = parseArgs(process.argv);
  const manifest = loadManifest(manifestPath);
  const { documents, navSections, screenshots } = collectDocuments({
    manifest,
    docReaderDir: __dirname,
    repoRoot: join(__dirname, '..', '..'),
  });

  const html = buildHtml({
    title: manifest.title,
    theme: manifest.theme,
    documents,
    navSections,
    screenshots,
  });

  writeFileSync(outputPath, html, 'utf8');

  console.log(`Built: ${outputPath}`);
  console.log(`Theme: ${manifest.theme}`);
  console.log(`Documents embedded: ${documents.length}`);
  documents.forEach((doc) => {
    console.log(`  - ${doc.filename}`);
  });
}

main();
