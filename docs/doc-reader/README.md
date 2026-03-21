# Compliance Reader — Doc Reader

**Version:** 2.0.0
**Last Updated:** 2026-03-20 by Ngan

A local document reader that renders markdown and HTML artifacts with Mermaid diagrams, table of contents, and screenshot popups. Files to render are defined in `render-list.json`.

## Quick Start

```bash
pnpm dev:doc-reader
```

This builds the HTML and opens it in your browser.

To serve it locally for sharing with your team:

```bash
npx serve docs/doc-reader
```

## How to Use

### Add or remove documents

Edit `render-list.json` to control which files appear and how they are grouped:

```json
{
  "title": "Compliance Reader",
  "sections": [
    {
      "label": "Discover",
      "files": [
        "docs/discover/FLOW260318-master-compliance-workflows.md"
      ]
    },
    {
      "label": "garrioPRO",
      "files": [
        "garrioPRO/FLOW260319-gpro-user-workflow-detail.md"
      ]
    }
  ]
}
```

- **title** — displayed in the top bar and browser tab
- **sections** — each becomes a collapsible group in the sidebar
- **files** — paths relative to the `docs/doc-reader/` folder

Use forward slashes in JSON paths, even on Windows: `docs/artifacts/file.html`
If a section resolves to exactly one file, its label becomes a direct left-nav menu item.
Section order in `render-list.json` is preserved in the left navigation.

Then rebuild with `pnpm dev:doc-reader`.

### File naming rules

- Files starting with `_` are excluded from rendering (use for drafts/notes)
- `README.md` and `index.html` are always excluded

### Features

| Toggle | What it does |
|--------|-------------|
| **TOC** | Shows a floating table of contents panel (top-right) |
| **Diagrams** | Shows only Mermaid flowcharts (with diagram title or section heading as label), hides all text |
| **Sort** | Toggle between modified-date and alphabetical order |

- Click a document in the left sidebar to view it
- Mermaid flowcharts render automatically as visual diagrams
- Links to `.md` files navigate within the reader instead of opening raw files
- If a diagram node has a linked screenshot, click the node to open it in a popup

### Screenshots

To make diagram nodes clickable, add `click` directives in your Mermaid code pointing to image files:

```
click MCR_010 "/full/path/to/screenshot.png" "Open screenshot"
```

The build script embeds found images into the HTML. Missing files are skipped silently.

## Requirements

- Node.js >= 18 (for running the build script)
- Internet connection (fonts and libraries load from CDN)
