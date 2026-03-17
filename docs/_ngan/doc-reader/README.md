# Screens/Flow Inventory — Doc Reader

**Version:** 1.0.0
**Last Updated:** 2026-03-17 by Ngan

A local document reader that renders markdown and HTML artifacts with Mermaid diagrams, table of contents, and screenshot popups.

## Quick Start

```bash
pnpm dev:doc-reader
```

This builds the HTML and opens it in your browser.

## How to Use

### Add documents

Drop `.md` or `.html` files into this folder (`docs/_ngan/doc-reader/`), then rebuild:

```bash
pnpm dev:doc-reader
```

### Features

| Toggle | What it does |
|--------|-------------|
| **TOC** | Shows a floating table of contents panel (top-right) |
| **Diagrams** | Shows only Mermaid flowcharts, hides all text |

- Click a document in the left sidebar to view it
- Mermaid flowcharts render automatically as visual diagrams
- If a diagram node has a linked screenshot, click the node to open it in a popup

### Screenshots

To make diagram nodes clickable, add `click` directives in your Mermaid code pointing to PNG files:

```
click MCR_010 "/full/path/to/screenshot.png" "Open screenshot"
```

The build script embeds found images into the HTML. Missing files are skipped silently.

## Requirements

- Node.js >= 18 (for running the build script)
- Internet connection (fonts and libraries load from CDN)
