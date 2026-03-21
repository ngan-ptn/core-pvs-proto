---
description: Generate a compliance flow diagram from a workflow diagram section against the compliance inventory
---

## How to Run

Copy and paste this prompt into Claude Code:

```
Read the file docs/_ngan/command/flow-diagram.md and follow its instructions to generate a flow diagram for: [Section Name]
```

**Examples:**
```
Read the file docs/_ngan/command/flow-diagram.md and follow its instructions to generate a flow diagram for: Section 2 — Contract Participation Management — HZV/FAV Only
```
```
Read the file docs/_ngan/command/flow-diagram.md and follow its instructions to generate a flow diagram for: Section 4 — Billing Documentation — KV vs HZV/FAV Divergence
```
```
Read the file docs/_ngan/command/flow-diagram.md and follow its instructions to generate a flow diagram for: Section 5 — Billing Process — KV vs HZV/FAV Submission
```

**Available sections** (see Workflow Diagram Index in `docs/discover/FLOW260318-master-compliance-workflows.md`):
1. Patient Check-In — Compliance Gates *(Done)*
2. Contract Participation Management — HZV/FAV Only
3. Patient Enrollment — HZV/FAV Only
4. Billing Documentation — KV vs HZV/FAV Divergence
5. Billing Process — KV vs HZV/FAV Submission
6. Diagnosis Entry & Coding Validation
7. Service Documentation — KVDT Compliance
8. Prescription & Drug Safety
9. Form Management — KV vs HZV/FAV Forms
10. Practice Software (VSST) — Hilfsmittel Path
11. eDMP & Chronic Care Compliance
12. eArztbrief, eAU & ePA Compliance
13. IT Connectivity & Infrastructure
14. Compliance Obligation Summary by Path

---

Generate a compliance flow diagram for: $ARGUMENTS

## Instructions

1. **Read the workflow diagram** from `/Users/nganpham/core-pvs-proto/docs/discover/FLOW260318-master-compliance-workflows.md` — find the section matching the user's argument (e.g., "Section 2" or "Contract Participation Management").

2. **Extract all obligation IDs** referenced in that diagram's mermaid nodes (e.g., VERT641, ABRD456).

3. **Search the compliance inventory** at `/Users/nganpham/core-pvs-proto/docs/discover/compliance-inventory.md` for:
   - All obligations already referenced in the diagram (these are "Covered")
   - All related obligations NOT in the diagram (these are "Gaps") — search by keyword patterns from the workflow topic (e.g., card read, VSDM, participation, billing, diagnosis, etc.)

4. **Generate the flow diagram** as a new markdown file following the naming convention `FLOW[YYMMDD]-[slug]-flow-diagram.md` in `docs/discover/`. Use the exact structure from the reference file below.

## Output Structure

Follow the structure of `/Users/nganpham/core-pvs-proto/docs/discover/FLOW260318-patient-checkin-flow-diagram.md`:

```
---
Version: 1.0
Last Updated: [today's date]
Scope: [Section name from workflow diagrams]
Source: FLOW260318-master-compliance-workflows.md vs compliance-inventory.md
---

# Flow Diagram: [Section Title]

## [Section Number]. [Section Name]

### Diagram
[Copy the mermaid diagram from the workflow file]

### Covered Obligations ([count])
[Table with inventory columns: # | ID | Obligation | Requirement Type | Ext. Source | Status | Verification Method | User Story & AC | Design Match | Engineer Status | Engineer Ref | QA Status | QA Ref | Reported Issues | Goals | Track]

### Gaps — [Section Name] ([count] missing)
[Same table format, only obligations NOT in the diagram but related to this workflow]

[Repeat for each sub-diagram if applicable]

---

## Summary
[Table: Section | Covered | Gaps | Total]

## Recommendations

### 1. Quick Wins — Extend Existing Nodes (Low Effort)
[Table + workflow diagram showing where gaps plug into existing diagrams]

### 2. Guard Rails — Add Decision Gates (Medium Effort)
[Table with insertion points + workflow diagram showing new gates]

### 3. New Flows (Higher Effort)
[Table + workflow diagram for new user paths]

### Recommended Sequence
[Phase table]

### Suggested Next Step
[One paragraph]
```

## Rules

- **ONLY** use data from the compliance inventory file. Do NOT invent obligations, user stories, or acceptance criteria.
- Keep table columns identical to the inventory file: `# | ID | Obligation | Requirement Type | Ext. Source | Status | Verification Method | User Story & AC | Design Match | Engineer Status | Engineer Ref | QA Status | QA Ref | Reported Issues | Goals | Track`
- Copy obligation text verbatim from the inventory — do not paraphrase.
- Every recommendation diagram must reference specific diagram nodes and show insertion points.
- Add file header with Version and Last Updated metadata.
