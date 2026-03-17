# Visual Artifacts Rules (Canonical)

Single source of truth for generating and updating visual artifacts in this project.

Do not duplicate rules across skills or templates. Link here. If any other file conflicts with this doc, this doc wins.

## Artifact Types

This project uses three artifact types, all stored in `docs/artifacts/`:

| Code | Format | Purpose | Example |
|------|--------|---------|---------|
| `FLOW` | Mermaid flowchart | User flows, state machines | `FLOW260210-as-built.md` |
| `IA` | ASCII tree | Information architecture, screen list | `IA260210-as-built.md` |
| `OOUX` | Markdown tables | Object-oriented UX dot map | `OOUX260210-dot-map.md` |

## File Naming

Follow `docs/guidelines/naming-conventions.md`. Pattern:

```
[ARTIFACT-CODE][YYMMDD]-[slug].md
```

Examples: `FLOW260210-as-built.md`, `IA260210-as-built.md`, `OOUX260210-dot-map.md`

## Related Guidelines

Apply by default unless a specific artifact explicitly overrides:

- Design system (visual guidelines & tokens): [tini-library](https://github.com/tini-works/tini-library)

## Common Rules

**Goals:**
- Visualize relationships, flow, or structure clearly
- Enable quick comprehension of system behavior
- Serve as communication tool between design and implementation

**Non-goals:**
- Replacing written specifications
- Pixel-perfect UI mockups

**Naming conventions:**
- Use clear, descriptive node labels (verb + noun: "Submit Order", not "SO")
- Be specific: "Payment Failed" not "Error"
- Match terminology in codebase/design docs

**Screen IDs:**
- Reference format: `AUTH_000_WELCOME`, `HOME_010_DASHBOARD`, etc.
- Must be unique within artifact
- Match component names in codebase where possible

**Quality bar:**
- Max 15-20 nodes per diagram (split if exceeding)
- All relationships labeled when adding clarity
- Logical grouping applied
- No orphaned nodes

**Metadata:**
- Include date and scope at top of each artifact
- Track what the artifact documents (as-built vs aspirational)

**Versioning:**
- Single-source artifacts (IA): update in-place, use git history
- Dated artifacts (FLOW, OOUX): create new dated file for scope changes
- Minor fixes (typos, styling): update in-place for all types

## FLOW — Mermaid Flowcharts

User flows rendered as Mermaid `flowchart TD` diagrams.

**Structure:**
- Use `flowchart TD` (top-down) for vertical flow
- Group related screens with Mermaid subgraphs
- Label edges with user actions

**Versioned flows:**
- When a single artifact documents multiple versions, list the latest version first on the page
- Treat each newer version as inheriting the previous version by default unless explicitly noted otherwise
- For each newer version, include a short `What's New/Modified` summary relative to the prior version
- Reflect those deltas in the Mermaid diagram with visual highlighting
- Use this color mapping for version deltas: `New` = green, `Modified` = yellow, `Unchanged` = white, `Info/Reference` = blue

**Node shapes:**
- Rounded rectangle `([...])`: start/end states
- Rectangle `[...]`: screens/views
- Diamond `{...}`: decision points
- Stadium `([...])`: user actions

**Edge styles:**
- `-->` solid arrow (main flow)
- `-.->` dotted arrow (optional/conditional)
- `==>` thick arrow (critical path)
- Label edges: `-->|"Tap Sign In"|`

## IA — ASCII Tree

Information architecture as indented ASCII tree with screen IDs.

**Structure:**
```
App Name
│
├── Section ··················· SCREEN_ID
│   ├── Sub-screen ··········· SCREEN_ID
│   └── Sub-screen ··········· SCREEN_ID
```

**Rules:**
- Use box-drawing characters (`│`, `├──`, `└──`)
- Dot-leaders (`···`) to align screen IDs on the right
- Indent nested screens consistently
- Group by navigation sections (Auth, Main tabs, Modals)

## OOUX — Dot Map

Object-oriented UX analysis as markdown tables.

**Structure:**
- Primary objects: things the user directly interacts with
- Each object lists attributes (name, type, status)
- Relationships between objects documented
- Calls-to-action (CTAs) per object

**Rules:**
- One table per object
- Include attribute type and required/optional status
- Document object relationships in a separate section
