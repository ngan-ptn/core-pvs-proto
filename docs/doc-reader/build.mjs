// Screens/Flow Inventory — Build Script
// Version: 1.0.0
// Last Updated: 2026-03-17 by Ngan
//
// Scans *.md files in this directory and generates a self-contained index.html.
// Run: node docs/_ngan/doc-reader/build.mjs

import { readFileSync, readdirSync, writeFileSync, existsSync, statSync } from 'fs';
import { join, dirname, basename } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Read each file and process screenshots, returning a document object
const screenshots = {};

function loadFile(dir, filename, options) {
  const folder = options && options.folder ? options.folder : null;
  const navLabel = options && options.navLabel ? options.navLabel : null;
  let content = readFileSync(join(dir, filename), 'utf8');
  const clickRegex = /click\s+(\S+)\s+"([^"]+\.(?:png|jpg|jpeg|gif|webp))"\s+"[^"]*"/g;
  let match;
  while ((match = clickRegex.exec(content)) !== null) {
    const nodeId = match[1];
    const imagePath = match[2];
    if (existsSync(imagePath)) {
      const imageData = readFileSync(imagePath);
      const ext = imagePath.split('.').pop().toLowerCase();
      const mimeType = ext === 'jpg' || ext === 'jpeg' ? 'image/jpeg'
        : ext === 'png' ? 'image/png'
        : ext === 'gif' ? 'image/gif'
        : 'image/webp';
      screenshots[nodeId] = 'data:' + mimeType + ';base64,' + imageData.toString('base64');
      console.log('  Screenshot embedded: ' + nodeId + ' <- ' + imagePath);
    } else {
      console.log('  Screenshot not found (skipping): ' + imagePath);
    }
  }
  content = content.replace(
    /click\s+(\S+)\s+"([^"]+\.(?:png|jpg|jpeg|gif|webp))"\s+"[^"]*"/g,
    function(_, nodeId) {
      return screenshots[nodeId] ? 'click ' + nodeId + ' callback "showScreenshot"' : '';
    }
  );
  const mtime = statSync(join(dir, filename)).mtimeMs;
  return { filename, content, mtime, folder, navLabel };
}

function loadRenderList() {
  const manifestPath = join(__dirname, 'render-list.json');
  const manifest = readFileSync(manifestPath, 'utf8');

  try {
    return JSON.parse(manifest);
  } catch (error) {
    const separatorHint = manifest.includes('\\')
      ? ' Use forward slashes (/) in JSON paths, or escape backslashes (\\\\).'
      : '';
    throw new Error(
      'Invalid JSON in ' + manifestPath + '.' + separatorHint + ' Original error: ' + error.message,
      { cause: error },
    );
  }
}

// Read render-list.json manifest
const renderList = loadRenderList();
const repoRoot = join(__dirname, '..', '..');
const documents = [];
const navSections = [];

function resolveFiles(filePath) {
  // Expand glob patterns like "some/dir/*.md"
  if (filePath.includes('*')) {
    const dir = dirname(filePath);
    const pattern = basename(filePath);
    // Resolve directory relative to doc-reader folder or repo root
    let fullDir = join(__dirname, dir);
    if (!existsSync(fullDir)) fullDir = join(repoRoot, dir);
    if (!existsSync(fullDir)) return [];
    const ext = pattern.replace('*', ''); // e.g. "*.md" → ".md"
    return readdirSync(fullDir)
      .filter(f => f.endsWith(ext) && !f.startsWith('_') && f.toLowerCase() !== 'readme.md')
      .sort((a, b) => statSync(join(fullDir, b)).mtimeMs - statSync(join(fullDir, a)).mtimeMs)
      .map(f => ({ dir: fullDir, filename: f }));
  }
  // Single file — try relative to doc-reader folder first, then repo root
  let fullPath = join(__dirname, filePath);
  if (!existsSync(fullPath)) fullPath = join(repoRoot, filePath);
  if (!existsSync(fullPath)) return [];
  return [{ dir: dirname(fullPath), filename: basename(fullPath) }];
}

for (const section of renderList.sections) {
  const sectionFiles = [];
  for (const filePath of section.files) {
    const resolved = resolveFiles(filePath);
    if (resolved.length === 0) {
      console.log('  WARNING: file not found (skipping): ' + filePath);
      continue;
    }
    for (const r of resolved) {
      sectionFiles.push(r);
    }
  }

  if (sectionFiles.length === 0) continue;

  const isSingleItem = sectionFiles.length === 1;
  const docIndices = [];

  for (const file of sectionFiles) {
    const docIndex = documents.length;
    documents.push(loadFile(file.dir, file.filename, {
      folder: isSingleItem ? null : section.label,
      navLabel: isSingleItem ? section.label : null,
    }));
    docIndices.push(docIndex);
  }

  navSections.push({
    label: section.label,
    isSingleItem: isSingleItem,
    docIndices: docIndices,
  });
}

// Build embedded JavaScript as a string (not template literals) to avoid backtick conflicts
const jsLines = [
  'const DOCUMENTS = ' + JSON.stringify(documents).replace(/<\//g, '<\\/') + ';',
  'const SCREENSHOTS = ' + JSON.stringify(screenshots).replace(/<\//g, '<\\/') + ';',
  'const NAV_SECTIONS = ' + JSON.stringify(navSections).replace(/<\//g, '<\\/') + ';',
  '',
  'mermaid.initialize({',
  '  startOnLoad: false,',
  "  theme: 'default',",
  "  securityLevel: 'loose',",
  '  flowchart: { htmlLabels: true, curve: \'basis\' },',
  '});',
  '',
  'let currentIndex = -1;',
  'let tocVisible = false;',
  'let diagramsOnly = false;',
  'let sortMode = \'modified\';',
  'let sortedIndices = [];',
  'let folderState = {};',
  '',
  'function buildSortedIndices() {',
  '  sortedIndices = DOCUMENTS.map(function(_, i) { return i; });',
  '  if (sortMode === \'name\') {',
  '    sortedIndices.sort(function(a, b) {',
  '      return DOCUMENTS[a].filename.localeCompare(DOCUMENTS[b].filename);',
  '    });',
  '  } else {',
  '    sortedIndices.sort(function(a, b) {',
  '      return DOCUMENTS[b].mtime - DOCUMENTS[a].mtime;',
  '    });',
  '  }',
  '}',
  '',
  'function toggleSort() {',
  '  sortMode = sortMode === \'modified\' ? \'name\' : \'modified\';',
  '  document.getElementById(\'sort-label\').textContent = sortMode === \'modified\' ? \'Modified\' : \'Name\';',
  '  populateSidebar();',
  '}',
  '',
  'function makeDocBtn(docIndex) {',
  '  const doc = DOCUMENTS[docIndex];',
  '  const btn = document.createElement(\'button\');',
  '  btn.className = doc.folder ? \'doc-item doc-item-nested\' : \'doc-item\';',
  '  if (docIndex === currentIndex) btn.classList.add(\'active\');',
  "  btn.textContent = doc.navLabel || doc.filename.replace(/\\.md$/, '').replace(/\\.html$/, '');",
  '  btn.title = doc.filename;',
  '  btn.onclick = function() { selectDocument(docIndex); };',
  '  return btn;',
  '}',
  '',
  'function populateSidebar() {',
  '  buildSortedIndices();',
  '  const list = document.getElementById(\'doc-list\');',
  '  list.innerHTML = \'\';',
  '  NAV_SECTIONS.forEach(function(section) {',
  '    var sectionDocIndices = sortedIndices.filter(function(docIndex) {',
  '      return section.docIndices.indexOf(docIndex) !== -1;',
  '    });',
  '    if (sectionDocIndices.length === 0) return;',
  '    if (section.isSingleItem) {',
  '      list.appendChild(makeDocBtn(sectionDocIndices[0]));',
  '      return;',
  '    }',
  '    var expanded = folderState[section.label] !== false;',
  '    var header = document.createElement(\'div\');',
  '    header.className = \'folder-header\';',
  '    header.innerHTML = \'<span class="folder-toggle">\' + (expanded ? \'â–¾\' : \'â–¸\') + \'</span><span class="folder-name">\' + section.label + \'</span>\';',
  '    header.onclick = function() { folderState[section.label] = !expanded; populateSidebar(); };',
  '    list.appendChild(header);',
  '    if (expanded) {',
  '      sectionDocIndices.forEach(function(docIndex) {',
  '        list.appendChild(makeDocBtn(docIndex));',
  '      });',
  '    }',
  '  });',
  '  return;',
  '  // Root documents',
  '  sortedIndices.filter(function(i) { return !DOCUMENTS[i].folder; }).forEach(function(docIndex) {',
  '    list.appendChild(makeDocBtn(docIndex));',
  '  });',
  '  // Subfolder sections',
  '  var folderNames = [];',
  '  DOCUMENTS.forEach(function(d) { if (d.folder && folderNames.indexOf(d.folder) === -1) folderNames.push(d.folder); });',
  '  folderNames.sort();',
  '  folderNames.forEach(function(folder) {',
  '    var expanded = folderState[folder] !== false;',
  '    var header = document.createElement(\'div\');',
  '    header.className = \'folder-header\';',
  '    header.innerHTML = \'<span class="folder-toggle">\' + (expanded ? \'▾\' : \'▸\') + \'</span><span class="folder-name">\' + folder + \'</span>\';',
  '    header.onclick = function() { folderState[folder] = !expanded; populateSidebar(); };',
  '    list.appendChild(header);',
  '    if (expanded) {',
  '      sortedIndices.filter(function(i) { return DOCUMENTS[i].folder === folder; }).forEach(function(docIndex) {',
  '        list.appendChild(makeDocBtn(docIndex));',
  '      });',
  '    }',
  '  });',
  '}',
  '',
  'function selectDocument(index) {',
  '  currentIndex = index;',
  '  populateSidebar();',
  '  renderDocument();',
  '}',
  '',
  'function generateTocHtml(content, isHtml) {',
  '  var match;',
  '  var items = [];',
  '  if (isHtml) {',
  '    var htmlHeadingRegex = /<h([1-4])[^>]*>([\\s\\S]*?)<\\/h\\1>/gi;',
  '    while ((match = htmlHeadingRegex.exec(content)) !== null) {',
  '      var level = parseInt(match[1]);',
  '      var text = match[2].replace(/<[^>]+>/g, \'\').trim();',
  '      var id = text.toLowerCase().replace(/[^a-z0-9]+/g, \'-\').replace(/^-|-$/g, \'\');',
  '      items.push({ level: level, text: text, id: id });',
  '    }',
  '  } else {',
  '    var headingRegex = /^(#{1,4})\\s+(.+)$/gm;',
  '    while ((match = headingRegex.exec(content)) !== null) {',
  '      var level = match[1].length;',
  '      var text = match[2].trim();',
  '      var id = text.toLowerCase().replace(/<[^>]+>/g, \'\').replace(/[^a-z0-9]+/g, \'-\').replace(/^-|-$/g, \'\');',
  '      items.push({ level: level, text: text, id: id });',
  '    }',
  '  }',
  '  if (items.length === 0) return \'\';',
  "  let html = '<div class=\"toc\">';",
  "  html += '<div class=\"toc-title\">Table of Contents</div>';",
  "  html += '<ul class=\"toc-list\">';",
  '  items.forEach(function(item) {',
  '    const cls = \'toc-h\' + item.level;',
  '    html += \'<li class="\' + cls + \'"><a href="#\' + item.id + \'">\' + item.text + \'</a></li>\';',
  '  });',
  "  html += '</ul></div>';",
  '  return html;',
  '}',
  '',
  'function renderDocument() {',
  '  if (currentIndex < 0 || currentIndex >= DOCUMENTS.length) return;',
  '  const doc = DOCUMENTS[currentIndex];',
  "  const main = document.getElementById('main-content');",
  '',
  '  if (diagramsOnly) {',
  '    renderDiagramsOnly(doc, main);',
  '    return;',
  '  }',
  '',
  '  var isHtml = doc.filename.endsWith(\'.html\');',
  '  var html = isHtml ? doc.content : marked.parse(doc.content);',
  '  // Add IDs to headings for TOC linking (markdown only)',
  '  if (!isHtml) {',
  "    html = html.replace(/<(h[1-4])(?=[^>]*>)((?:(?!\\bid=)[^>])*)>(.*?)<\\/\\1>/gi, function(match, tag, attrs, text) {",
  "      if (match.indexOf('id=') !== -1) return match;",
  "      var id = text.toLowerCase().replace(/<[^>]+>/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');",
  '      return \'<\' + tag + attrs + \' id="\' + id + \'">\' + text + \'</\' + tag + \'>\';',
  '    });',
  '  }',
  '',
  '  var tocHtml = \'\';',
  '  if (tocVisible && !isHtml) {',
  '    tocHtml = generateTocHtml(doc.content, isHtml);',
  '  }',
  '',
  '  if (isHtml) {',
  '    // Avoid CSS collisions (and weird layout) by rendering HTML artifacts in an iframe.',
  '    main.style.padding = \'0\';',
  '    main.style.overflow = \'hidden\';',
  '    main.innerHTML = \'<iframe class="doc-iframe" id="doc-iframe" title="Document" style="width:100%;height:100%;border:0;display:block;"></iframe>\';',
  '    var frame = document.getElementById(\'doc-iframe\');',
  '    var srcdoc = doc.content;',
  "    if (doc.filename === 'design-pipeline.html') {",
  "      var normalizeCss = '<style>html,body{margin:0!important;padding:0!important;} .page{padding-top:0!important;} .topbar{margin-bottom:24px!important;}</style>';",
  '      if (/<head[^>]*>/i.test(srcdoc)) {',
  '        srcdoc = srcdoc.replace(/<head[^>]*>/i, function(m) { return m + \"\\n\" + normalizeCss; });',
  '      } else {',
  '        srcdoc = normalizeCss + srcdoc;',
  '      }',
  '    }',
  '    frame.srcdoc = srcdoc;',
  '    return;',
  '  }',
  '',
  '  // Reset any iframe-specific inline styles',
  '  main.style.padding = \'\';',
  '  main.style.overflow = \'\';',
  '',
  '  main.innerHTML = tocHtml + \'<div class="content">\' + html + \'</div>\';',
  '  // Clean up modals from previous document',
  '  document.querySelectorAll(\'body > .detail-panel\').forEach(function(m) { m.remove(); });',
  '  // Scripts inserted via innerHTML do not execute — re-create them',
  '  var scripts = main.querySelectorAll(\'script\');',
  '  scripts.forEach(function(old) {',
  '    var s = document.createElement(\'script\');',
  '    s.textContent = old.textContent;',
  '    old.parentNode.replaceChild(s, old);',
  '  });',
  '  // Move modals out of .content to body so they overlay everything',
  '  main.querySelectorAll(\'.detail-panel\').forEach(function(m) { document.body.appendChild(m); });',
  '  // Intercept links to .md files — navigate in-app instead of opening the file',
  '  main.querySelectorAll(\'a[href$=".md"]\').forEach(function(link) {',
  '    var target = link.getAttribute(\'href\');',
  '    var idx = DOCUMENTS.findIndex(function(d) { return d.filename === target; });',
  '    if (idx !== -1) {',
  '      link.href = \'javascript:void(0)\';',
  '      link.onclick = function(e) { e.preventDefault(); selectDocument(idx); };',
  '    }',
  '  });',
  '  renderMermaidDiagrams();',
  '}',
  '',
  'function renderDiagramsOnly(doc, main) {',
  '  const bt = String.fromCharCode(96, 96, 96);',
  '  const blockRegex = new RegExp(bt + \'mermaid\\\\n([\\\\s\\\\S]*?)\' + bt, \'g\');',
  '  const headingRegex = /^#{1,4}\\s+(.+)$/m;',
  '  const lines = doc.content.split(\'\\n\');',
  '  let diagrams = [];',
  '  let i = 0;',
  '  while (i < lines.length) {',
  '    if (lines[i].trimEnd() === bt + \'mermaid\') {',
  '      // Find nearest preceding heading',
  '      let heading = \'\';',
  '      for (let j = i - 1; j >= 0; j--) {',
  '        const hm = lines[j].match(/^(#{1,4})\\s+(.+)$/);',
  '        if (hm) { heading = hm[2].trim(); break; }',
  '      }',
  '      // Collect block content',
  '      let codeLines = [];',
  '      i++;',
  '      while (i < lines.length && lines[i].trimEnd() !== bt) {',
  '        codeLines.push(lines[i]);',
  '        i++;',
  '      }',
  '      const codeStr = codeLines.join(\'\\n\');',
  '      const yamlMatch = codeStr.match(/^---[\\r\\n]+title:\\s*(.+?)[\\r\\n]+---/);',
  '      const diagramTitle = yamlMatch ? yamlMatch[1].trim() : \'\';',
  '      diagrams.push({ heading: heading, diagramTitle: diagramTitle, code: codeStr });',
  '    }',
  '    i++;',
  '  }',
  '',
  '  if (diagrams.length === 0) {',
  '    main.innerHTML = \'<div class="empty-state">No diagrams found in this document</div>\';',
  '    return;',
  '  }',
  '',
  '  let html = \'<div class="content">\';',
  '  diagrams.forEach(function(d, idx) {',
  '    const label = d.diagramTitle || d.heading;',
  '    if (label) {',
  '      html += \'<h2>\' + label + \'</h2>\';',
  '    }',
  '    html += \'<div class="mermaid-container" id="diagonly-\' + idx + \'"></div>\';',
  '  });',
  '  html += \'</div>\';',
  '  main.innerHTML = html;',
  '',
  '  diagrams.forEach(function(d, idx) {',
  '    const container = document.getElementById(\'diagonly-\' + idx);',
  '    mermaid.render(\'diagonly-svg-\' + idx, d.code).then(function(result) {',
  '      container.innerHTML = result.svg;',
  '    }).catch(function(err) {',
  '      const errDiv = document.createElement(\'div\');',
  '      errDiv.className = \'mermaid-error\';',
  '      errDiv.innerHTML = \'<pre>\' + d.code.replace(/</g, \'&lt;\').replace(/>/g, \'&gt;\') + \'</pre>\';',
  '      container.replaceWith(errDiv);',
  '    });',
  '  });',
  '}',
  '',
  'function renderMermaidDiagrams() {',
  "  const blocks = document.querySelectorAll('code.language-mermaid');",
  '  let diagramIndex = 0;',
  '  blocks.forEach(function(block) {',
  '    const pre = block.parentElement;',
  '    const code = block.textContent;',
  "    const container = document.createElement('div');",
  "    container.className = 'mermaid-container';",
  '    const id = \'mermaid-diagram-\' + diagramIndex++;',
  "    container.id = id;",
  '    pre.parentNode.replaceChild(container, pre);',
  '    mermaid.render(id + \'-svg\', code).then(function(result) {',
  '      container.innerHTML = result.svg;',
  '    }).catch(function(err) {',
  "      const errDiv = document.createElement('div');",
  "      errDiv.className = 'mermaid-error';",
  "      errDiv.innerHTML = '<pre>' + code.replace(/</g, '&lt;').replace(/>/g, '&gt;') + '</pre>';",
  '      container.replaceWith(errDiv);',
  '    });',
  '  });',
  '}',
  '',
  'function toggleToc() {',
  '  tocVisible = !tocVisible;',
  "  document.getElementById('btn-toc').classList.toggle('active', tocVisible);",
  '  renderDocument();',
  '}',
  '',
  'function toggleDiagrams() {',
  '  diagramsOnly = !diagramsOnly;',
  "  document.getElementById('btn-diagrams').classList.toggle('active', diagramsOnly);",
  '  renderDocument();',
  '}',
  '',
  'window.showScreenshot = function(nodeId) {',
  '  const src = SCREENSHOTS[nodeId];',
  "  const modal = document.getElementById('modal');",
  "  const modalTitle = document.getElementById('modal-title');",
  "  const modalBody = document.getElementById('modal-body');",
  '  if (!src) {',
  "    modalTitle.textContent = 'Screenshot not found';",
  "    modalBody.innerHTML = '<p style=\"color:#a3a3a3;font-size:13px;\">No screenshot available for node: ' + nodeId + '</p>';",
  '  } else {',
  '    modalTitle.textContent = nodeId;',
  "    modalBody.innerHTML = '<img src=\"' + src + '\" style=\"max-width:100%;height:auto;display:block;\" />';",
  '  }',
  "  modal.style.display = 'flex';",
  '};',
  '',
  'function closeModal(event) {',
  '  if (event && event.target !== event.currentTarget) return;',
  "  document.getElementById('modal').style.display = 'none';",
  '}',
  '',
  'document.addEventListener(\'keydown\', function(e) {',
  "  if (e.key === 'Escape') {",
  "    document.getElementById('modal').style.display = 'none';",
  '  }',
  '});',
  '',
  'populateSidebar();',
  'if (DOCUMENTS.length > 0) { selectDocument(0); }',
];

const embeddedJs = jsLines.join('\n');

// Build the CSS
const cssLines = [
  '@import url(\'https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;700&display=swap\');',
  '',
  ':root {',
  '  --shell-bg: #09111d;',
  '  --shell-bg-2: #0b1628;',
  '  --shell-panel: rgba(15, 23, 42, 0.74);',
  '  --shell-panel-2: rgba(2, 6, 23, 0.82);',
  '  --shell-line: rgba(148, 163, 184, 0.14);',
  '  --shell-line-strong: rgba(20, 184, 166, 0.28);',
  '  --shell-text: #e2e8f0;',
  '  --shell-muted: #94a3b8;',
  '  --shell-accent: #14b8a6;',
  '  --shell-accent-strong: #2dd4bf;',
  '  --surface: #f8fafc;',
  '  --surface-text: #0f172a;',
  '  --surface-muted: #334155;',
  '  --surface-line: rgba(15, 23, 42, 0.08);',
  '  --shadow-lg: 0 24px 64px rgba(2, 6, 23, 0.56);',
  '  --shadow-md: 0 16px 44px rgba(2, 6, 23, 0.5);',
  '}',
  '',
  '*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }',
  '',
  'html, body {',
  '  min-height: 100%;',
  '  font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;',
  '  color: var(--shell-text);',
  '  background:',
  '    radial-gradient(circle at top left, rgba(20, 184, 166, 0.18), transparent 42%),',
  '    radial-gradient(circle at top right, rgba(148, 163, 184, 0.1), transparent 36%),',
  '    linear-gradient(180deg, var(--shell-bg-2) 0%, var(--shell-bg) 100%);',
  '  -webkit-font-smoothing: antialiased;',
  '  -moz-osx-font-smoothing: grayscale;',
  '  scroll-behavior: smooth;',
  '}',
  '',
  'body {',
  '  display: flex;',
  '  flex-direction: column;',
  '  position: relative;',
  '  overflow: hidden;',
  '}',
  '',
  'body::before {',
  '  content: \'\';',
  '  position: fixed;',
  '  inset: 0;',
  '  background-image:',
  '    linear-gradient(rgba(226, 232, 240, 0.035) 1px, transparent 1px),',
  '    linear-gradient(90deg, rgba(226, 232, 240, 0.035) 1px, transparent 1px);',
  '  background-size: 40px 40px;',
  '  opacity: 0.22;',
  '  pointer-events: none;',
  '  z-index: 0;',
  '}',
  '',
  '.topbar, .layout { position: relative; z-index: 1; }',
  '',
  '.topbar {',
  '  display: flex;',
  '  align-items: center;',
  '  justify-content: space-between;',
  '  gap: 20px;',
  '  padding: 16px 22px;',
  '  background: var(--shell-panel);',
  '  backdrop-filter: blur(16px);',
  '  border-bottom: 1px solid var(--shell-line);',
  '  box-shadow: 0 1px 0 rgba(255, 255, 255, 0.04);',
  '  flex-shrink: 0;',
  '}',
  '',
  '.topbar-title {',
  '  font-family: \'JetBrains Mono\', monospace;',
  '  font-weight: 700;',
  '  font-size: 12px;',
  '  letter-spacing: 0.18em;',
  '  text-transform: uppercase;',
  '  color: var(--shell-accent-strong);',
  '}',
  '',
  '.topbar-actions {',
  '  display: flex;',
  '  flex-wrap: wrap;',
  '  gap: 12px;',
  '  align-items: center;',
  '}',
  '',
  '.toggle-switch {',
  '  display: inline-flex;',
  '  align-items: center;',
  '  gap: 10px;',
  '  cursor: pointer;',
  '  user-select: none;',
  '  padding: 8px 12px;',
  '  border-radius: 999px;',
  '  border: 1px solid var(--shell-line);',
  '  background: rgba(15, 23, 42, 0.62);',
  '  transition: transform 0.18s ease, border-color 0.18s ease, background 0.18s ease;',
  '}',
  '',
  '.toggle-switch:hover {',
  '  transform: translateY(-1px);',
  '  border-color: var(--shell-line-strong);',
  '  background: rgba(15, 23, 42, 0.78);',
  '}',
  '',
  '.toggle-switch-label {',
  '  font-family: \'JetBrains Mono\', monospace;',
  '  font-size: 11px;',
  '  font-weight: 500;',
  '  letter-spacing: 0.08em;',
  '  text-transform: uppercase;',
  '  color: var(--shell-muted);',
  '  transition: color 0.18s ease;',
  '}',
  '',
  '.toggle-switch.active {',
  '  border-color: rgba(45, 212, 191, 0.34);',
  '  background: rgba(20, 184, 166, 0.14);',
  '}',
  '',
  '.toggle-switch.active .toggle-switch-label { color: var(--shell-accent-strong); }',
  '',
  '.toggle-track {',
  '  width: 34px;',
  '  height: 18px;',
  '  background: rgba(148, 163, 184, 0.26);',
  '  border-radius: 999px;',
  '  position: relative;',
  '  transition: background 0.18s ease;',
  '}',
  '',
  '.toggle-switch.active .toggle-track { background: rgba(20, 184, 166, 0.36); }',
  '',
  '.toggle-thumb {',
  '  width: 14px;',
  '  height: 14px;',
  '  background: #e2e8f0;',
  '  border-radius: 50%;',
  '  position: absolute;',
  '  top: 2px;',
  '  left: 2px;',
  '  box-shadow: 0 4px 12px rgba(2, 6, 23, 0.42);',
  '  transition: transform 0.18s ease, background 0.18s ease;',
  '}',
  '',
  '.toggle-switch.active .toggle-thumb {',
  '  transform: translateX(16px);',
  '  background: var(--shell-accent-strong);',
  '}',
  '',
  '.layout {',
  '  display: flex;',
  '  flex: 1;',
  '  gap: 16px;',
  '  padding: 16px;',
  '  overflow: hidden;',
  '}',
  '',
  '.sidebar {',
  '  width: 288px;',
  '  flex-shrink: 0;',
  '  background: linear-gradient(180deg, rgba(15, 23, 42, 0.86) 0%, rgba(2, 6, 23, 0.86) 100%);',
  '  border: 1px solid var(--shell-line);',
  '  border-radius: 22px;',
  '  overflow-y: auto;',
  '  display: flex;',
  '  flex-direction: column;',
  '  box-shadow: var(--shadow-md);',
  '}',
  '',
  '.sidebar-header {',
  '  display: flex;',
  '  align-items: center;',
  '  justify-content: space-between;',
  '  gap: 12px;',
  '  padding: 18px 18px 14px;',
  '  border-bottom: 1px solid var(--shell-line);',
  '}',
  '',
  '.sidebar-label {',
  '  font-family: \'JetBrains Mono\', monospace;',
  '  font-size: 11px;',
  '  font-weight: 500;',
  '  color: var(--shell-accent-strong);',
  '  text-transform: uppercase;',
  '  letter-spacing: 0.12em;',
  '}',
  '',
  '.sort-btn {',
  '  display: inline-flex;',
  '  align-items: center;',
  '  gap: 6px;',
  '  background: rgba(15, 23, 42, 0.7);',
  '  border: 1px solid var(--shell-line);',
  '  border-radius: 999px;',
  '  padding: 6px 10px;',
  '  font-family: \'JetBrains Mono\', monospace;',
  '  font-size: 10px;',
  '  letter-spacing: 0.08em;',
  '  text-transform: uppercase;',
  '  color: var(--shell-muted);',
  '  cursor: pointer;',
  '  transition: color 0.18s ease, border-color 0.18s ease, transform 0.18s ease;',
  '}',
  '',
  '.sort-btn:hover {',
  '  color: var(--shell-accent-strong);',
  '  border-color: var(--shell-line-strong);',
  '  transform: translateY(-1px);',
  '}',
  '',
  '.sort-icon { font-size: 12px; line-height: 1; }',
  '',
  '#doc-list { padding: 10px 10px 14px; }',
  '',
  '.doc-item {',
  '  display: block;',
  '  width: 100%;',
  '  text-align: left;',
  '  margin: 2px 0;',
  '  padding: 12px 14px;',
  '  background: transparent;',
  '  border: 1px solid transparent;',
  '  border-radius: 14px;',
  '  cursor: pointer;',
  '  font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;',
  '  font-size: 13px;',
  '  font-weight: 600;',
  '  color: var(--shell-text);',
  '  white-space: nowrap;',
  '  overflow: hidden;',
  '  text-overflow: ellipsis;',
  '  transition: background 0.18s ease, border-color 0.18s ease, color 0.18s ease, transform 0.18s ease;',
  '}',
  '',
  '.doc-item:hover {',
  '  background: rgba(20, 184, 166, 0.08);',
  '  border-color: rgba(45, 212, 191, 0.16);',
  '  transform: translateX(2px);',
  '}',
  '',
  '.doc-item.active {',
  '  background: rgba(20, 184, 166, 0.16);',
  '  border-color: rgba(45, 212, 191, 0.32);',
  '  color: var(--shell-text);',
  '  box-shadow: inset 0 0 0 1px rgba(45, 212, 191, 0.08);',
  '}',
  '',
  '.doc-item-nested {',
  '  margin-left: 18px;',
  '  width: calc(100% - 18px);',
  '  font-weight: 500;',
  '  color: var(--shell-muted);',
  '}',
  '',
  '.doc-item-nested.active { color: var(--shell-text); }',
  '',
  '.folder-header {',
  '  display: flex;',
  '  align-items: center;',
  '  gap: 8px;',
  '  margin-top: 14px;',
  '  padding: 10px 12px 8px;',
  '  cursor: pointer;',
  '  user-select: none;',
  '  border-radius: 14px;',
  '  transition: background 0.18s ease;',
  '}',
  '',
  '.folder-header:hover { background: rgba(20, 184, 166, 0.1); }',
  '.folder-toggle { font-size: 10px; color: var(--shell-accent-strong); width: 12px; text-align: center; }',
  '.folder-name {',
  '  font-family: \'JetBrains Mono\', monospace;',
  '  font-size: 11px;',
  '  font-weight: 500;',
  '  color: var(--shell-accent-strong);',
  '  text-transform: uppercase;',
  '  letter-spacing: 0.12em;',
  '}',
  '',
  '.main {',
  '  flex: 1;',
  '  padding: 4px 4px 20px 0;',
  '  overflow-y: auto;',
  '  position: relative;',
  '}',
  '',
  '.content {',
  '  max-width: 1040px;',
  '  background: linear-gradient(180deg, rgba(255, 255, 255, 0.98) 0%, rgba(249, 251, 250, 0.98) 100%);',
  '  color: var(--surface-text);',
  '  border: 1px solid var(--surface-line);',
  '  border-radius: 24px;',
  '  padding: 36px 40px;',
  '  box-shadow: var(--shadow-lg);',
  '}',
  '',
  '.content h1 { font-size: 36px; line-height: 1.08; font-weight: 700; margin-bottom: 20px; color: var(--surface-text); }',
  '.content h2 { font-size: 26px; line-height: 1.15; font-weight: 700; margin-top: 34px; margin-bottom: 12px; color: var(--surface-text); }',
  '.content h3 { font-size: 19px; line-height: 1.24; font-weight: 700; margin-top: 26px; margin-bottom: 10px; color: var(--surface-text); }',
  '.content h4 { font-size: 13px; line-height: 1.3; font-weight: 700; margin-top: 18px; margin-bottom: 8px; color: var(--surface-muted); text-transform: uppercase; letter-spacing: 0.08em; }',
  '.content p { font-size: 15px; line-height: 1.72; margin-bottom: 14px; color: var(--surface-text); }',
  '.content ul, .content ol { font-size: 15px; line-height: 1.66; margin-bottom: 16px; padding-left: 24px; }',
  '.content li { margin-bottom: 6px; }',
  '.content a { color: var(--shell-accent); text-decoration: none; font-weight: 600; }',
  '.content a:hover { color: var(--shell-accent); text-decoration: underline; text-underline-offset: 0.14em; }',
  '.content code { font-family: \'JetBrains Mono\', monospace; font-size: 12px; background: rgba(20, 184, 166, 0.1); padding: 3px 7px; border-radius: 8px; border: 1px solid rgba(20, 184, 166, 0.16); color: #0f766e; }',
  '.content pre { background: #0f172a; color: #e2e8f0; padding: 18px; border-radius: 18px; overflow-x: auto; margin-bottom: 20px; border: 1px solid rgba(148, 163, 184, 0.14); box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.04); }',
  '.content pre code { background: none; padding: 0; border: none; border-radius: 0; color: inherit; }',
  '.content blockquote { border-left: 3px solid var(--shell-accent); background: rgba(20, 184, 166, 0.08); padding: 14px 18px; border-radius: 0 14px 14px 0; margin-bottom: 16px; color: var(--surface-muted); }',
  '.content strong { font-weight: 700; }',
  '',
  '.content table { width: 100%; border-collapse: collapse; margin-bottom: 24px; font-size: 13px; line-height: 1.55; overflow: hidden; border-radius: 16px; border: 1px solid var(--surface-line); }',
  '.content thead { position: sticky; top: 0; }',
  '.content th { background: #0f172a; color: #e2e8f0; font-family: \'JetBrains Mono\', monospace; font-size: 10px; font-weight: 500; text-transform: uppercase; letter-spacing: 0.12em; padding: 12px 14px; text-align: left; white-space: nowrap; }',
  '.content td { padding: 10px 14px; border-bottom: 1px solid rgba(15, 23, 42, 0.06); color: var(--surface-text); vertical-align: top; background: rgba(255, 255, 255, 0.94); }',
  '.content tbody tr:nth-child(odd) td { background: rgba(226, 232, 240, 0.24); }',
  '.content tbody tr:hover td { background: rgba(20, 184, 166, 0.07); }',
  '.content td code { font-size: 11px; padding: 2px 6px; }',
  '',
  '.mermaid-container {',
  '  background: linear-gradient(180deg, #ffffff 0%, #f7fbfa 100%);',
  '  border: 1px solid var(--surface-line);',
  '  border-radius: 20px;',
  '  padding: 24px;',
  '  margin-bottom: 24px;',
  '  overflow-x: auto;',
  '  box-shadow: 0 10px 24px rgba(148, 163, 184, 0.14);',
  '}',
  '',
  '.mermaid-error {',
  '  background: #fff4f4;',
  '  border: 1px solid rgba(220, 38, 38, 0.18);',
  '  border-radius: 18px;',
  '  padding: 24px;',
  '  margin-bottom: 24px;',
  '  color: #b42318;',
  '  font-size: 13px;',
  '}',
  '',
  '.empty-state {',
  '  display: flex;',
  '  align-items: center;',
  '  justify-content: center;',
  '  min-height: 220px;',
  '  border-radius: 22px;',
  '  border: 1px dashed rgba(148, 163, 184, 0.26);',
  '  background: rgba(255, 255, 255, 0.78);',
  '  color: var(--shell-muted);',
  '  font-family: \'JetBrains Mono\', monospace;',
  '  font-size: 12px;',
  '  letter-spacing: 0.08em;',
  '  text-transform: uppercase;',
  '}',
  '',
  '.toc {',
  '  position: sticky;',
  '  top: 0;',
  '  float: right;',
  '  margin-left: 18px;',
  '  margin-bottom: 18px;',
  '  width: 236px;',
  '  max-height: calc(100vh - 140px);',
  '  overflow-y: auto;',
  '  border: 1px solid rgba(15, 23, 42, 0.08);',
  '  border-radius: 18px;',
  '  background: rgba(255, 255, 255, 0.92);',
  '  padding: 16px 18px;',
  '  z-index: 10;',
  '  box-shadow: 0 16px 32px rgba(148, 163, 184, 0.16);',
  '}',
  '',
  '.toc-title {',
  '  font-family: \'JetBrains Mono\', monospace;',
  '  font-size: 11px;',
  '  font-weight: 500;',
  '  text-transform: uppercase;',
  '  letter-spacing: 0.12em;',
  '  color: var(--shell-accent-strong);',
  '  margin-bottom: 14px;',
  '}',
  '',
  '.toc a {',
  '  display: block;',
  '  font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;',
  '  font-size: 13px;',
  '  font-weight: 500;',
  '  color: var(--surface-muted);',
  '  text-decoration: none;',
  '  padding: 4px 0;',
  '}',
  '',
  '.toc a:hover { color: var(--shell-accent-strong); }',
  '.toc-list { list-style: none; padding: 0; }',
  '.toc-h1 { font-weight: 700; }',
  '.toc-h2 { padding-left: 0; }',
  '.toc-h3 { padding-left: 14px; }',
  '.toc-h4 { padding-left: 28px; }',
  '',
  '.modal-overlay {',
  '  display: none;',
  '  position: fixed;',
  '  inset: 0;',
  '  background: rgba(2, 8, 23, 0.66);',
  '  backdrop-filter: blur(6px);',
  '  align-items: center;',
  '  justify-content: center;',
  '  z-index: 100;',
  '  padding: 24px;',
  '}',
  '',
  '.modal {',
  '  background: #ffffff;',
  '  border-radius: 22px;',
  '  border: 1px solid var(--surface-line);',
  '  max-width: min(1040px, 92vw);',
  '  max-height: 90vh;',
  '  overflow: hidden;',
  '  display: flex;',
  '  flex-direction: column;',
  '  box-shadow: 0 28px 72px rgba(15, 23, 42, 0.24);',
  '}',
  '',
  '.modal-header {',
  '  display: flex;',
  '  align-items: center;',
  '  justify-content: space-between;',
  '  gap: 16px;',
  '  padding: 16px 20px;',
  '  border-bottom: 1px solid var(--surface-line);',
  '}',
  '',
  '.modal-title {',
  '  font-size: 15px;',
  '  font-weight: 700;',
  '  color: var(--surface-text);',
  '}',
  '',
  '.modal-close {',
  '  background: rgba(15, 23, 42, 0.06);',
  '  border: 1px solid rgba(15, 23, 42, 0.08);',
  '  width: 34px;',
  '  height: 34px;',
  '  border-radius: 999px;',
  '  font-size: 18px;',
  '  cursor: pointer;',
  '  color: var(--surface-muted);',
  '  line-height: 1;',
  '  transition: color 0.18s ease, border-color 0.18s ease, background 0.18s ease;',
  '}',
  '',
  '.modal-close:hover { color: #0f766e; border-color: rgba(15, 118, 110, 0.18); background: rgba(15, 118, 110, 0.08); }',
  '',
  '.modal-body {',
  '  padding: 24px;',
  '  overflow-y: auto;',
  '  flex: 1;',
  '  background: #fbfdfc;',
  '}',
  '',
  '::selection { background: rgba(13, 148, 136, 0.18); color: var(--surface-text); }',
  '',
  '@media (max-width: 980px) {',
  '  .layout { padding: 14px; gap: 14px; }',
  '  .sidebar { width: 248px; }',
  '  .main { padding: 0 0 18px; }',
  '  .content { padding: 30px 28px; }',
  '  .toc { float: none; width: auto; max-height: none; margin-left: 0; }',
  '}',
  '',
  '@media (max-width: 720px) {',
  '  .topbar { padding: 16px; align-items: flex-start; }',
  '  .layout { flex-direction: column; overflow: auto; }',
  '  .sidebar { width: 100%; max-height: 42vh; }',
  '  .doc-item-nested { margin-left: 10px; width: calc(100% - 10px); }',
  '  .content { border-radius: 20px; padding: 24px 20px; }',
  '  .content h1 { font-size: 30px; }',
  '  .content h2 { font-size: 23px; }',
  '  .modal-overlay { padding: 12px; }',
  '  .modal-body { padding: 18px; }',
  '}',
];

const embeddedCssLegacy = cssLines.join('\n');

// Reference style: C:\Users\phamn\Downloads\doc-reader\doc-reader\index.html
const embeddedCss = `@import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;700&family=Inter:wght@400;500&display=swap');

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

html, body {
  height: 100%;
  font-family: Inter, sans-serif;
  background: #f8fafb;
  color: #1a3a47;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

body { display: flex; flex-direction: column; }

.topbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 24px;
  background: #ffffff;
  border-bottom: 1px solid #e1e8f0;
  flex-shrink: 0;
}

.topbar-title {
  font-family: 'JetBrains Mono', monospace;
  font-weight: 700;
  font-size: 14px;
  color: #0f2633;
}

.topbar-actions { display: flex; gap: 16px; align-items: center; }

.toggle-switch {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  user-select: none;
}

.toggle-switch-label {
  font-family: 'JetBrains Mono', monospace;
  font-size: 12px;
  color: #8db4c0;
  transition: color 0.5s ease;
}

.toggle-switch.active .toggle-switch-label {
  color: #1a3a47;
}

.toggle-track {
  width: 36px;
  height: 20px;
  background: #d2dfe9;
  border-radius: 10px;
  position: relative;
  transition: background 0.5s ease;
}

.toggle-switch.active .toggle-track {
  background: #5a8fa3;
}

.toggle-thumb {
  width: 16px;
  height: 16px;
  background: #ffffff;
  border-radius: 50%;
  position: absolute;
  top: 2px;
  left: 2px;
  transition: transform 0.15s ease;
}

.toggle-switch.active .toggle-thumb {
  transform: translateX(16px);
}

.layout { display: flex; flex: 1; overflow: hidden; }

.sidebar {
  width: 260px;
  flex-shrink: 0;
  background: #ffffff;
  border-right: 1px solid #e1e8f0;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
}

.sidebar-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px 8px;
}

.sidebar-label {
  font-family: 'JetBrains Mono', monospace;
  font-size: 11px;
  font-weight: 700;
  color: #5a8fa3;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.sort-btn {
  display: flex;
  align-items: center;
  gap: 3px;
  background: none;
  border: 1px solid #e1e8f0;
  border-radius: 6px;
  padding: 2px 8px;
  font-family: 'JetBrains Mono', monospace;
  font-size: 10px;
  color: #8db4c0;
  cursor: pointer;
  transition: color 0.5s, border-color 0.5s;
}
.sort-btn:hover { color: #1a3a47; border-color: #c3d6e2; }
.sort-icon { font-size: 12px; }

.doc-item {
  display: block;
  width: 100%;
  text-align: left;
  padding: 8px 16px;
  background: transparent;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-family: 'JetBrains Mono', monospace;
  font-size: 12px;
  color: #1a3a47;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  transition: background 0.5s;
}

.doc-item:hover { background: #f0f3f7; }
.doc-item.active { background: #e1e8f0; font-weight: 700; color: #0f2633; }
.doc-item-nested { padding-left: 28px; color: #5a8fa3; }
.doc-item-nested.active { color: #0f2633; }

.folder-header {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px 4px;
  margin-top: 12px;
  cursor: pointer;
  user-select: none;
  border-radius: 6px;
  transition: background 0.5s;
}
.folder-header:hover { background: #f0f3f7; }
.folder-toggle { font-size: 10px; color: #8db4c0; width: 10px; }
.folder-name {
  font-family: 'JetBrains Mono', monospace;
  font-size: 11px;
  font-weight: 700;
  color: #5a8fa3;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.main {
  flex: 1;
  padding: 32px 48px;
  overflow-y: auto;
}

.content h1 { font-family: 'JetBrains Mono', monospace; font-size: 28px; font-weight: 500; margin-bottom: 16px; color: #0f2633; }
.content h2 { font-family: 'JetBrains Mono', monospace; font-size: 20px; font-weight: 500; margin-top: 32px; margin-bottom: 12px; color: #0f2633; }
.content h3 { font-family: 'JetBrains Mono', monospace; font-size: 16px; font-weight: 500; margin-top: 24px; margin-bottom: 8px; color: #1a3a47; }
.content h4 { font-family: 'JetBrains Mono', monospace; font-size: 14px; font-weight: 500; margin-top: 16px; margin-bottom: 8px; color: #1a3a47; }
.content p { font-family: Inter, sans-serif; font-size: 14px; line-height: 1.7; margin-bottom: 12px; }
.content ul, .content ol { font-size: 14px; line-height: 1.7; margin-bottom: 12px; padding-left: 24px; }
.content li { margin-bottom: 4px; }
.content a { color: #5a8fa3; text-decoration: none; transition: color 0.5s; }
.content a:hover { color: #1a3a47; }
.content code { font-family: 'JetBrains Mono', monospace; font-size: 12px; background: #f0f3f7; padding: 3px 6px; border-radius: 6px; border: 1px solid #e1e8f0; color: #5a8fa3; }
.content pre { background: #f0f3f7; padding: 16px; border-radius: 6px; overflow-x: auto; margin-bottom: 16px; border: 1px solid #e1e8f0; }
.content pre code { background: none; padding: 0; border: none; }
.content blockquote { border-left: 3px solid #c3d6e2; padding-left: 16px; color: #5a8fa3; margin-bottom: 12px; }
.content strong { font-weight: 700; }

.content table { width: 100%; border-collapse: collapse; margin-bottom: 20px; font-size: 13px; line-height: 1.5; }
.content thead { position: sticky; top: 0; }
.content th { background: #0f2633; color: #fff; font-family: 'JetBrains Mono', monospace; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; padding: 10px 12px; text-align: left; white-space: nowrap; }
.content td { padding: 8px 12px; border-bottom: 1px solid #e8ecf0; color: #1a3a47; vertical-align: top; }
.content tbody tr:hover { background: #f4f7fa; }
.content td code { font-size: 11px; padding: 2px 5px; }
.content td a { color: #5a8fa3; text-decoration: none; font-weight: 500; }
.content td a:hover { color: #0f2633; text-decoration: underline; }

.mermaid-container {
  background: #ffffff;
  border: 1px solid #e1e8f0;
  border-radius: 8px;
  padding: 24px;
  margin-bottom: 24px;
  overflow-x: auto;
  box-shadow: 0 1px 3px rgba(15,38,51,0.04);
}

.mermaid-error {
  background: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 8px;
  padding: 24px;
  margin-bottom: 24px;
  color: #dc2626;
  font-size: 13px;
}

.empty-state {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #8db4c0;
  font-family: 'JetBrains Mono', monospace;
  font-size: 13px;
}

.main { position: relative; }

.toc {
  position: sticky;
  top: 0;
  float: right;
  margin-left: 16px;
  margin-bottom: 16px;
  width: 220px;
  max-height: calc(100vh - 120px);
  overflow-y: auto;
  border: 1px solid #e1e8f0;
  border-radius: 8px;
  background: #fff;
  padding: 16px 20px;
  z-index: 10;
  box-shadow: 0 4px 12px rgba(15,38,51,0.06);
}

.toc-title {
  font-family: 'JetBrains Mono', monospace;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #8db4c0;
  margin-bottom: 12px;
}

.toc a {
  display: block;
  font-family: 'JetBrains Mono', monospace;
  font-size: 13px;
  color: #5a8fa3;
  text-decoration: none;
  padding: 4px 0;
}

.toc a:hover { color: #1a3a47; }

.toc-list { list-style: none; padding: 0; }
.toc-h1 { font-weight: 700; }
.toc-h2 { padding-left: 0; }
.toc-h3 { padding-left: 16px; }
.toc-h4 { padding-left: 32px; }

.modal-overlay {
  display: none;
  position: fixed;
  inset: 0;
  background: rgba(15,38,51,0.5);
  align-items: center;
  justify-content: center;
  z-index: 100;
}

.modal {
  background: #ffffff;
  border-radius: 12px;
  max-width: 90vw;
  max-height: 90vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  box-shadow: 0 20px 60px rgba(15,38,51,0.2);
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 24px;
  border-bottom: 1px solid #e1e8f0;
}

.modal-title {
  font-family: 'JetBrains Mono', monospace;
  font-size: 14px;
  font-weight: 700;
  color: #0f2633;
}

.modal-close {
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
  color: #8db4c0;
  line-height: 1;
  transition: color 0.5s;
}
.modal-close:hover { color: #1a3a47; }

.modal-body {
  padding: 24px;
  overflow-y: auto;
  flex: 1;
}`;

// Build the full HTML
const htmlParts = [
  '<!DOCTYPE html>',
  '<html lang="en">',
  '<head>',
  '  <meta charset="UTF-8">',
  '  <meta name="viewport" content="width=device-width, initial-scale=1.0">',
  '  <title>' + renderList.title + '</title>',
  '  <style>',
  embeddedCss,
  '  </style>',
  '</head>',
  '<body>',
  '  <div class="topbar">',
  '    <div class="topbar-title">' + renderList.title + '</div>',
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
  '        <div class="sidebar-label">Documents</div>',
  '        <button class="sort-btn" onclick="toggleSort()" title="Toggle sort order">',
  '          <span class="sort-icon">&#x21C5;</span> <span id="sort-label">Modified</span>',
  '        </button>',
  '      </div>',
  '      <div id="doc-list"></div>',
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
  embeddedJs,
  '  </script>',
  '</body>',
  '</html>',
];

const html = htmlParts.join('\n')
  .replace(/Ã¢â€“Â¾|â–¾/g, '&#9662;')
  .replace(/Ã¢â€“Â¸|â–¸/g, '&#9656;');

const outputPath = join(__dirname, 'index.html');
writeFileSync(outputPath, html, 'utf8');

console.log('Built: ' + outputPath);
console.log('Documents embedded: ' + documents.length);
documents.forEach(function(doc) {
  console.log('  - ' + doc.filename);
});
