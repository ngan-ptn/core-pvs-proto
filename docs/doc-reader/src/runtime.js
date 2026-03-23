mermaid.initialize({
  startOnLoad: false,
  theme: 'default',
  securityLevel: 'loose',
  flowchart: { htmlLabels: true, curve: 'basis' },
});

let currentIndex = -1;
let tocVisible = false;
let diagramsOnly = false;
let sortMode = 'modified';
let sortedIndices = [];
const folderState = {};

function buildSortedIndices() {
  sortedIndices = DOCUMENTS.map((_, index) => index);
  if (sortMode === 'name') {
    sortedIndices.sort((a, b) => DOCUMENTS[a].filename.localeCompare(DOCUMENTS[b].filename));
    return;
  }
  sortedIndices.sort((a, b) => DOCUMENTS[b].mtime - DOCUMENTS[a].mtime);
}

function toggleSort() {
  sortMode = sortMode === 'modified' ? 'name' : 'modified';
  document.getElementById('sort-label').textContent = sortMode === 'modified' ? 'Modified' : 'Name';
  populateSidebar();
}

function makeDocButton(docIndex) {
  return makeDocButtonForPlacement(docIndex, 'main');
}

function makeDocButtonForPlacement(docIndex, placement) {
  const doc = DOCUMENTS[docIndex];
  const button = document.createElement('button');
  button.className = doc.folder ? 'doc-item doc-item-nested' : 'doc-item';
  if (placement === 'footer') {
    button.classList.add('doc-item-footer');
  }
  if (docIndex === currentIndex) button.classList.add('active');
  button.textContent = doc.navLabel || doc.filename.replace(/\.md$/i, '').replace(/\.html$/i, '');
  button.title = doc.filename;
  button.onclick = () => selectDocument(docIndex);
  return button;
}

function appendSection(container, section, sectionDocIndices) {
  if (sectionDocIndices.length === 0) return;

  if (section.isSingleItem) {
    container.appendChild(makeDocButtonForPlacement(sectionDocIndices[0], section.placement));
    return;
  }

  const expanded = folderState[section.label] !== false;
  const header = document.createElement('div');
  header.className = 'folder-header';
  if (section.placement === 'footer') {
    header.classList.add('folder-header-footer');
  }
  header.innerHTML = `<span class="folder-toggle">${expanded ? '&#9662;' : '&#9656;'}</span><span class="folder-name">${section.label}</span>`;
  header.onclick = () => {
    folderState[section.label] = !expanded;
    populateSidebar();
  };
  container.appendChild(header);

  if (expanded) {
    sectionDocIndices.forEach((docIndex) => {
      container.appendChild(makeDocButtonForPlacement(docIndex, section.placement));
    });
  }
}

function populateSidebar() {
  buildSortedIndices();
  const list = document.getElementById('doc-list');
  const footer = document.getElementById('sidebar-footer');
  list.innerHTML = '';
  footer.innerHTML = '';

  NAV_SECTIONS.forEach((section) => {
    const sectionDocIndices = sortedIndices.filter((docIndex) => section.docIndices.includes(docIndex));
    appendSection(section.placement === 'footer' ? footer : list, section, sectionDocIndices);
  });
}

function getInitialDocumentIndex() {
  buildSortedIndices();

  for (const section of NAV_SECTIONS) {
    if (section.placement === 'footer') continue;

    const mainSectionDocIndices = sortedIndices.filter((docIndex) => section.docIndices.includes(docIndex));
    if (mainSectionDocIndices.length > 0) {
      return mainSectionDocIndices[0];
    }
  }

  return -1;
}

function selectDocument(index) {
  currentIndex = index;
  populateSidebar();
  renderDocument();
}

function generateTocHtml(content, isHtml) {
  const items = [];
  let match;

  if (isHtml) {
    const htmlHeadingRegex = /<h([1-4])[^>]*>([\s\S]*?)<\/h\1>/gi;
    match = htmlHeadingRegex.exec(content);
    while (match !== null) {
      const level = Number.parseInt(match[1], 10);
      const text = match[2].replace(/<[^>]+>/g, '').trim();
      const id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
      items.push({ level, text, id });
      match = htmlHeadingRegex.exec(content);
    }
  } else {
    const headingRegex = /^(#{1,4})\s+(.+)$/gm;
    match = headingRegex.exec(content);
    while (match !== null) {
      const level = match[1].length;
      const text = match[2].trim();
      const id = text.toLowerCase().replace(/<[^>]+>/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
      items.push({ level, text, id });
      match = headingRegex.exec(content);
    }
  }

  if (items.length === 0) return '';

  let html = '<div class="toc">';
  html += '<div class="toc-title">Table of Contents</div><ul class="toc-list">';
  items.forEach((item) => {
    html += `<li class="toc-h${item.level}"><a href="#${item.id}">${item.text}</a></li>`;
  });
  html += '</ul></div>';
  return html;
}

function renderDocument() {
  if (currentIndex < 0 || currentIndex >= DOCUMENTS.length) return;

  const doc = DOCUMENTS[currentIndex];
  const main = document.getElementById('main-content');
  const isHtml = doc.filename.toLowerCase().endsWith('.html');

  if (diagramsOnly) {
    renderDiagramsOnly(doc, main);
    return;
  }

  const parsedHtml = isHtml ? doc.content : marked.parse(doc.content);
  const html = isHtml
    ? parsedHtml
    : parsedHtml.replace(/<(h[1-4])(?=[^>]*>)((?:(?!\bid=)[^>])*)>(.*?)<\/\1>/gi, (match, tag, attrs, text) => {
      if (match.includes('id=')) return match;
      const id = text.toLowerCase().replace(/<[^>]+>/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
      return `<${tag}${attrs} id="${id}">${text}</${tag}>`;
    });

  const tocHtml = tocVisible && !isHtml ? generateTocHtml(doc.content, false) : '';

  if (isHtml) {
    main.style.padding = '0';
    main.style.overflow = 'hidden';
    main.innerHTML = '<iframe class="doc-iframe" id="doc-iframe" title="Document" style="width:100%;height:100%;border:0;display:block;"></iframe>';
    const frame = document.getElementById('doc-iframe');
    frame.srcdoc = doc.content;
    return;
  }

  main.style.padding = '';
  main.style.overflow = '';
  main.innerHTML = `${tocHtml}<div class="content">${html}</div>`;

  document.querySelectorAll('body > .detail-panel').forEach((modal) => modal.remove());
  main.querySelectorAll('script').forEach((oldScript) => {
    const script = document.createElement('script');
    script.textContent = oldScript.textContent;
    oldScript.parentNode.replaceChild(script, oldScript);
  });
  main.querySelectorAll('.detail-panel').forEach((modal) => document.body.appendChild(modal));

  main.querySelectorAll('a[href$=".md"]').forEach((link) => {
    const href = link.getAttribute('href');
    const targetName = href.split('/').pop();
    const targetIndex = DOCUMENTS.findIndex((document) => document.filename === href || document.filename === targetName);
    if (targetIndex === -1) return;
    link.href = 'javascript:void(0)';
    link.onclick = (event) => {
      event.preventDefault();
      selectDocument(targetIndex);
    };
  });

  renderMermaidDiagrams();
}

function renderDiagramsOnly(doc, main) {
  const lines = doc.content.split('\n');
  const diagrams = [];

  for (let i = 0; i < lines.length; i += 1) {
    if (lines[i].trimEnd() !== '```mermaid') continue;

    let heading = '';
    for (let j = i - 1; j >= 0; j -= 1) {
      const headingMatch = lines[j].match(/^(#{1,4})\s+(.+)$/);
      if (headingMatch) {
        heading = headingMatch[2].trim();
        break;
      }
    }

    const codeLines = [];
    i += 1;
    while (i < lines.length && lines[i].trimEnd() !== '```') {
      codeLines.push(lines[i]);
      i += 1;
    }

    const code = codeLines.join('\n');
    const yamlMatch = code.match(/^---[\r\n]+title:\s*(.+?)[\r\n]+---/);
    const diagramTitle = yamlMatch ? yamlMatch[1].trim() : '';
    diagrams.push({ heading, diagramTitle, code });
  }

  if (diagrams.length === 0) {
    main.innerHTML = '<div class="empty-state">No diagrams found in this document</div>';
    return;
  }

  let html = '<div class="content">';
  diagrams.forEach((diagram, index) => {
    const title = diagram.diagramTitle || diagram.heading;
    if (title) html += `<h2>${title}</h2>`;
    html += `<div class="mermaid-container" id="diagonly-${index}"></div>`;
  });
  html += '</div>';
  main.innerHTML = html;

  diagrams.forEach((diagram, index) => {
    const container = document.getElementById(`diagonly-${index}`);
    mermaid.render(`diagonly-svg-${index}`, diagram.code).then((result) => {
      container.innerHTML = result.svg;
    }).catch(() => {
      const errDiv = document.createElement('div');
      errDiv.className = 'mermaid-error';
      errDiv.innerHTML = `<pre>${diagram.code.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</pre>`;
      container.replaceWith(errDiv);
    });
  });
}

function renderMermaidDiagrams() {
  let diagramIndex = 0;
  document.querySelectorAll('code.language-mermaid').forEach((block) => {
    const pre = block.parentElement;
    const code = block.textContent;
    const container = document.createElement('div');
    container.className = 'mermaid-container';
    container.id = `mermaid-diagram-${diagramIndex}`;
    diagramIndex += 1;
    pre.parentNode.replaceChild(container, pre);

    mermaid.render(`${container.id}-svg`, code).then((result) => {
      container.innerHTML = result.svg;
    }).catch(() => {
      const errDiv = document.createElement('div');
      errDiv.className = 'mermaid-error';
      errDiv.innerHTML = `<pre>${code.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</pre>`;
      container.replaceWith(errDiv);
    });
  });
}

function toggleToc() {
  tocVisible = !tocVisible;
  document.getElementById('btn-toc').classList.toggle('active', tocVisible);
  renderDocument();
}

function toggleDiagrams() {
  diagramsOnly = !diagramsOnly;
  document.getElementById('btn-diagrams').classList.toggle('active', diagramsOnly);
  renderDocument();
}

window.toggleToc = toggleToc;
window.toggleDiagrams = toggleDiagrams;
window.toggleSort = toggleSort;
window.showScreenshot = (nodeId) => {
  const src = SCREENSHOTS[nodeId];
  const modal = document.getElementById('modal');
  const modalTitle = document.getElementById('modal-title');
  const modalBody = document.getElementById('modal-body');
  if (!src) {
    modalTitle.textContent = 'Screenshot not found';
    modalBody.innerHTML = `<p style="color:#a3a3a3;font-size:13px;">No screenshot available for node: ${nodeId}</p>`;
  } else {
    modalTitle.textContent = nodeId;
    modalBody.innerHTML = `<img src="${src}" style="max-width:100%;height:auto;display:block;" />`;
  }
  modal.style.display = 'flex';
};

window.closeModal = (event) => {
  if (event && event.target !== event.currentTarget) return;
  document.getElementById('modal').style.display = 'none';
};

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    document.getElementById('modal').style.display = 'none';
  }
});

populateSidebar();
const initialDocumentIndex = getInitialDocumentIndex();
if (initialDocumentIndex !== -1) {
  selectDocument(initialDocumentIndex);
}
