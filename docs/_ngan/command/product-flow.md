---
description: Create a product flow artifact from a Figma flow
argument-hint: [FIGMA_LINK="https://..."] [NOTES="optional scope or constraints"]
---
Inspect the Figma link I provide and create a Markdown flow artifact for it.

Requirements:
- Follow this repo’s naming convention and visual artifact rules
- Save it in the correct artifact location
- Keep updates additive by default; do not replace content unless I explicitly ask

Document structure:
- Title
- Version
- Last Updated
- User Flow
- Screenshot Assets
- Product Flow
- Main Screens Or Major UI States

User Flow:
- Put near the top
- Use Mermaid `flowchart TD`
- Include date, scope, and status
- Use unique screen IDs
- Label edges with user actions
- Group related nodes when helpful
- Keep main screens/states in the main flow
- Put `The user can` details outside the main blocks, but still visually tied to the corresponding blocks

Screenshot Assets:
- Add this section directly under each flow diagram
- List screenshot filenames as flat bullets
- Use version-prefixed names when the file contains multiple versions, for example `v1-...` and `v2-...`
- Keep filenames aligned with the screen IDs used in the flow when possible

Product Flow:
- Write short numbered high-level steps

Main Screens Or Major UI States:
- List numbered screens/states
- For each one:
  - explain it in plain language
  - list what the user can do

Writing style:
- simple, clear, designer-friendly
- smaller incremental explanations
- avoid unnecessary jargon

Figma link: $FIGMA_LINK
Notes: $NOTES
All arguments: $ARGUMENTS
