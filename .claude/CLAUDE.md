# Personal Project Instructions (Ngan)

This file contains personal workflow rules for daily tasks in core-pvs-proto. It complements the root `CLAUDE.md` (shared team instructions) — do not duplicate what's already there.

## My Work Areas

| Area | Frequency | Key Files |
|------|-----------|-----------|
| Compliance documentation & gap analysis | High | `docs/compliances/`, `docs/_ngan/garrioPRO/` |
| Product context & strategy docs | High | `docs/` product context, PRD, empathy docs |
| UX guidelines & content standards | Medium | `docs/_ngan/` UX anti-patterns, copy guidelines |
| Doc-reader tool | Low | `docs/doc-reader/` |

## Document Editing Rules

These rules address recurring friction patterns specific to my workflow:

1. **Never remove content unless I say "delete".** "Rephrase", "update", and "refine" all mean preserve the section and change wording only.
2. **Confirm which file before editing.** This repo has similarly-named files across `docs/compliances/`, `docs/_ngan/`, and `docs/`. Always confirm the exact path.
3. **When I say "rename"**, update all of: filename, internal slug/ID, headings, frontmatter, and cross-references in other files.
4. **Copy obligation text verbatim** from compliance inventory — never paraphrase compliance items.

## Sub-Agents

Three specialist agents are available in `.claude/agents/`:

| Agent | When to use |
|-------|-------------|
| `inventory-reader` | Search, filter, or extract data from compliance or screen inventory files |
| `gap-analyst` | Cross-reference compliance items against screens, flows, or implementations |
| `report-writer` | Format analyzed data into a final structured output document |

**Chain:** `inventory-reader` → `gap-analyst` → `report-writer`. Run in parallel when tasks are independent.

## Compliance Workflow Shortcuts

### KV scope filter

When I say "V1 KV only" or "KV scope", apply these rules:
- **Exclude entirely:** Section 3.3 VERT (43 items), Section 3.4 VERE (25 items)
- **Exclude within shared sections:** HZV/FAV-specific items (ABRD675, ABRD834, ABRD1544, ABRD1681, VSST1555-1574, ALLG658, ALLG1385, ALLG1685, ALLG1871)
- **Reference:** `docs/_ngan/garrioPRO/DATA260319-gpro-v1-kv-compliance-gap.md` Section 1

### Key source files

| File | What it is |
|------|-----------|
| `docs/compliances/compliance-inventory.md` | Master compliance inventory (604 items, ~340KB — use offset/limit) |
| `docs/compliances/FLOW260318-master-compliance-workflows.md` | 14 compliance workflow diagrams |
| `docs/_ngan/templates/master-screen-inventory.md` | 88 master PVS screens |
| `docs/_ngan/garrioPRO/IA260319-gpro-screen-inventory.md` | 12 gPRO TUI screens |
| `docs/_ngan/garrioPRO/DATA260319-gpro-v1-kv-compliance-gap.md` | V1 KV gap matrix |

## Preferred Style

- Simple, clear, designer-friendly language
- Mermaid `flowchart TD` for all diagrams
- Structured markdown tables over prose
- Follow the repo's artifact naming convention: `[CODE][YYMMDD]-[slug].md`
