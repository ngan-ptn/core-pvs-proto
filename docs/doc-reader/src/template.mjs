import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '..');

const runtimeSource = readFileSync(join(__dirname, 'runtime.js'), 'utf8');
const baseCss = readFileSync(join(rootDir, 'themes', 'base.css'), 'utf8');
const themeCssByName = {
  classic: readFileSync(join(rootDir, 'themes', 'classic.css'), 'utf8'),
  shell: readFileSync(join(rootDir, 'themes', 'shell.css'), 'utf8'),
};

function safeJson(value) {
  return JSON.stringify(value).replace(/<\//g, '<\\/');
}

export function buildHtml({ title, theme, documents, navSections, screenshots }) {
  const css = `${baseCss}\n${themeCssByName[theme] || themeCssByName.classic}`;
  const script = [
    `const DOCUMENTS = ${safeJson(documents)};`,
    `const SCREENSHOTS = ${safeJson(screenshots)};`,
    `const NAV_SECTIONS = ${safeJson(navSections)};`,
    '',
    `const THEME_NAME = ${JSON.stringify(theme)};`,
    '',
    runtimeSource,
  ].join('\n');

  return [
    '<!DOCTYPE html>',
    '<html lang="en">',
    '<head>',
    '  <meta charset="UTF-8">',
    '  <meta name="viewport" content="width=device-width, initial-scale=1.0">',
    `  <title>${title}</title>`,
    '  <style>',
    css,
    '  </style>',
    '</head>',
    '<body>',
    '  <div class="topbar">',
    `    <div class="topbar-title">${title}</div>`,
    '    <div class="topbar-actions">',
    '      <div class="toggle-switch" id="btn-toc" onclick="toggleToc()">',
    '        <span class="toggle-switch-label">TOC</span>',
    '        <div class="toggle-track"><div class="toggle-thumb"></div></div>',
    '      </div>',
    '      <div class="toggle-switch" id="btn-diagrams" onclick="toggleDiagrams()">',
    '        <span class="toggle-switch-label">Diagrams</span>',
    '        <div class="toggle-track"><div class="toggle-thumb"></div></div>',
    '      </div>',
    '    </div>',
    '  </div>',
    '  <div class="layout">',
    '    <nav class="sidebar">',
    '      <div class="sidebar-header">',
    '        <div class="sidebar-label">Sort by</div>',
    '        <button class="sort-btn" onclick="toggleSort()" title="Toggle sort order">',
    '          <span class="sort-icon">&#x21C5;</span> <span id="sort-label">Modified</span>',
    '        </button>',
    '      </div>',
    '      <div id="doc-list" class="sidebar-list"></div>',
    '      <div id="sidebar-footer" class="sidebar-footer"></div>',
    '    </nav>',
    '    <main class="main" id="main-content">',
    '      <div class="empty-state">Select a document to begin</div>',
    '    </main>',
    '  </div>',
    '  <div class="modal-overlay" id="modal" onclick="closeModal(event)">',
    '    <div class="modal" onclick="event.stopPropagation()">',
    '      <div class="modal-header">',
    '        <div class="modal-title" id="modal-title"></div>',
    '        <button class="modal-close" onclick="closeModal()">&times;</button>',
    '      </div>',
    '      <div class="modal-body" id="modal-body"></div>',
    '    </div>',
    '  </div>',
    '  <script src="https://cdn.jsdelivr.net/npm/marked@15/marked.min.js"></script>',
    '  <script src="https://cdn.jsdelivr.net/npm/mermaid@11/dist/mermaid.min.js"></script>',
    '  <script>',
    script,
    '  </script>',
    '</body>',
    '</html>',
  ].join('\n');
}
