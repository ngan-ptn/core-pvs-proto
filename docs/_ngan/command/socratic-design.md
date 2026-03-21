---
description: Run a Socratic design session to collaboratively build a design document through structured Q&A
argument-hint: [TOPIC="feature or product area"] [CONTEXT_DIR="optional path to context files"] [OUTPUT_PATH="optional output file path"]
---

## Socratic Design Session

Guide the user through a collaborative design document creation process using structured dialogue. Lock in every decision before writing anything.

---

## When to Use

- **New feature or product area** — you have a rough idea but need to work through scope, users, flows, and edge cases before writing a spec.
- **Design concept doc** — turning requirements, compliance obligations, or stakeholder input into a structured screen-by-screen design document.
- **Strategy exploration** — comparing multiple approaches to a problem (e.g., Strategy A vs B) where tradeoffs need to be surfaced and decided explicitly.
- **Cross-team alignment artifact** — producing a document that design, engineering, and PM can all reference, with every decision traceable to a rationale.
- **Refining an existing draft** — when a document has too many TBDs or open questions and needs a structured pass to lock in decisions.

**Not for:** bug fixes, code refactoring, one-off file edits, or tasks where the output is already well-defined. Use this when you need to *think through* the design, not just execute it.

---

## Phase 1: Orientation

1. **Read context** — If `$CONTEXT_DIR` is provided, read all markdown files in that directory. Otherwise, ask the user which files to review for background.
2. **Summarize understanding** — In 3–5 bullets, state what you understand about the topic from context files and the user's prompt.
3. **Ask**: "Is this understanding correct? Anything to add or correct before we start?"

Do NOT proceed until the user confirms.

---

## Phase 2: Decision Discovery

1. **List all open design decisions** as a numbered checklist. Group them by category (e.g., Scope, Users, Data, UI, Flows, Compliance, Edge Cases).
2. **Ask the user**: "Are these the right decisions to lock in? Add, remove, or reorder?"
3. Wait for confirmation before proceeding.

---

## Phase 3: Decision Lock-In (one at a time)

For each decision in the checklist:

1. **Present the decision** with a brief framing sentence.
2. **Offer 2–4 options** with tradeoffs. Each option gets:
   - A short label
   - One sentence explaining what it means
   - Pros and cons (1–2 bullets each)
   - If any option is supported or contradicted by context files, cite the file and relevant section.
3. **Ask**: "Which option, or something else?"
4. **Wait** for the user's answer. Do NOT assume or proceed without explicit confirmation.
5. **Record the locked decision** — repeat it back in one sentence: "Locked: [decision summary]"
6. Move to the next decision.

### Rules for this phase

- Ask ONE decision at a time. Never batch multiple decisions.
- Never hallucinate dates, metrics, or facts — cite source files or say "I don't have data on this."
- If the user gives an answer that contradicts an earlier locked decision, flag the conflict and ask which one to keep.
- If the user says "you decide" or "your call", pick the option you'd recommend and explain why in one sentence. Still wait for confirmation.

---

## Phase 4: Decision Summary

After all decisions are locked:

1. **Present a decision table**:

```markdown
| # | Category | Decision | Choice | Rationale |
|---|----------|----------|--------|-----------|
| 1 | Scope | ... | ... | ... |
| 2 | Users | ... | ... | ... |
```

2. **Ask**: "All correct? Any changes before I generate the document?"
3. Wait for final confirmation.

---

## Phase 5: Document Generation

Generate the design document based on all locked decisions.

### Document structure

```markdown
# [Title]

**Version:** 1.0
**Date:** [today]
**Status:** Draft
**Scope:** [from Phase 1]

---

## 1. Context & Background
[From context files and Phase 1 summary]

## 2. Goals & Non-Goals
[Derived from locked decisions]

## 3. Users & Roles
[Who this serves, from locked decisions]

## 4. Design Decisions
[Decision table from Phase 4]

## 5. Screen-by-Screen Breakdown
[For each screen/surface:]
### [Screen ID]: [Screen Name]
- **Purpose:** [one sentence]
- **Primary role:** [MFA / Doctor / Admin / All]
- **States:** [table of states and triggers]
- **Components:** [table of components and descriptions]
- **User can:** [bulleted list of actions]

## 6. User Flows
[Mermaid flowchart TD diagrams with labeled edges]

## 7. Compliance Mapping
[If applicable — map screens/flows to compliance refs]

## 8. Open Questions
[Anything that came up but was deferred]

## 9. Decision Log
[Full decision table with rationale]
```

### Document rules

- Follow the repo's naming convention for the output file.
- If `$OUTPUT_PATH` is provided, save there. Otherwise, ask the user where to save.
- Use Mermaid `flowchart TD` for all diagrams.
- Keep language simple, clear, designer-friendly.
- Do NOT remove or modify any existing files unless explicitly asked.
- Do NOT add content beyond what was discussed in the session.

---

## Guardrails

- **NEVER skip phases.** Even if the user says "just write it", run through at least Phase 2 and Phase 4 to confirm decisions.
- **NEVER remove existing content** in any file unless explicitly asked to delete it.
- **NEVER invent requirements, dates, or metrics.** Cite sources or flag as unknown.
- **ONE decision at a time.** This is non-negotiable.
- If the user provides feedback mid-session that changes a prior locked decision, update the decision log and flag any downstream impacts.

---

Topic: $TOPIC
Context directory: $CONTEXT_DIR
Output path: $OUTPUT_PATH
All arguments: $ARGUMENTS
