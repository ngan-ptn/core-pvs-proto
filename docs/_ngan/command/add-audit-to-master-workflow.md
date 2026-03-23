---
description: list workflows from the Flow Master index, let the user choose one or more workflows, then sync matching AUDIT variants into the master workflow artifact with comparison blocks
argument-hint: [WORKFLOWS="WF-1,WF-6"] [AUDIT_FILES="docs/artifacts/AUDIT260322-patient-checkin-registration.md,docs/artifacts/AUDIT260322-prescription-pvs-base.md"] [TARGET_FLOW_FILE="docs/artifacts/FLOW260322-master-user-workflow.md"] [SOURCE_LABEL="gpro-base"] [BASE_LABEL="research-base"]
output: docs/artifacts/FLOW260322-master-user-workflow.md
---

You are executing a workflow-variant sync task.

Goal:
- list all workflows from the `Workflow Index` in the Flow Master
- let the user choose one workflow or a few workflows
- sync the selected audited workflow variants into the matching sections of the master workflow file
- update the `No. of Screen` column in the `Workflow Index` from the matched AUDIT files
- update the `Audit` column in the `Workflow Index`
- keep the original workflow intact and add side-by-side comparison variants with `Key differences`

This command is for cases where we already have:
- an existing master workflow file at `docs/artifacts/FLOW260322-master-user-workflow.md`
- one or more audited current-state workflow files in `docs/artifacts/`
- a need to compare research/prior-model workflows against audited variants without replacing the originals

Inputs:
- Workflows: `$WORKFLOWS`
- Audit files: `$AUDIT_FILES`
- Target flow file: `$TARGET_FLOW_FILE`
- Source label for the new variants: `$SOURCE_LABEL`
- Source label for the existing variants: `$BASE_LABEL`

If any input is missing, use these defaults:
- `TARGET_FLOW_FILE = docs/artifacts/FLOW260322-master-user-workflow.md`
- `SOURCE_LABEL = gpro-base`
- `BASE_LABEL = research-base`

## What to do

### 1. Read the Flow Master and list all workflows first

- Open `$TARGET_FLOW_FILE`
- Read the `Workflow Index`
- Extract every primary workflow entry from the index
- Present the workflows back to the user as a clean selectable list

Default source of truth for workflow choices:
- the `Workflow Index` inside `docs/artifacts/FLOW260322-master-user-workflow.md`

Rules:
- do not guess the workflow names from AUDIT file names alone
- do not skip the listing step
- exclude alternate comparison variants such as `WF-1 Alt` from the selectable list unless the user explicitly asks for them
- keep the list in the same order as the Flow Master index

Expected interaction:
- if `$WORKFLOWS` is not provided, stop after listing workflows and ask the user to choose one or more workflows
- accept either workflow IDs (`WF-1`, `WF-6`) or exact workflow names from the index
- allow multi-select

Workflow Index audit-status rule:
- the `Workflow Index` should contain a `No. of Screen` column
- the `Workflow Index` should contain an `Audit` column
- use the `Total screens` value from the mapped AUDIT file `Artifact Info` to fill `No. of Screen`
- use `--` in `No. of Screen` when a workflow does not yet have a mapped AUDIT file or when the mapped AUDIT file does not provide `Total screens`
- use `--` when a workflow does not yet have a mapped AUDIT artifact
- use `View` as a Markdown link when a workflow has a mapped AUDIT artifact
- the `View` link must point to the matching AUDIT file path

Recommended presentation:

| Select | Workflow | No. of Screen | Audit |
|---|---|---|---|
| `WF-1` | Patient Check-In & Registration | `--` or `6` | `--` or `[View](path-to-audit.md)` |
| `WF-2` | Insurance & Enrollment (HZV/FAV) | `--` or `N` | `--` or `[View](path-to-audit.md)` |
| `WF-3` | Forms & Certificates | `--` or `N` | `--` or `[View](path-to-audit.md)` |
| `WF-4` | Clinical Documentation | `--` or `N` | `--` or `[View](path-to-audit.md)` |
| `WF-5` | Service & Billing Documentation | `--` or `N` | `--` or `[View](path-to-audit.md)` |
| `WF-6` | Prescriptions (Core) | `--` or `10` | `--` or `[View](path-to-audit.md)` |
| `WF-7` | Prescriptions (Specialty) | `--` or `N` | `--` or `[View](path-to-audit.md)` |
| `WF-8` | Forms & Certificates | `--` or `N` | `--` or `[View](path-to-audit.md)` |
| `WF-9` | Chronic Care Programs | `--` or `N` | `--` or `[View](path-to-audit.md)` |
| `WF-10` | Billing & Submission | `--` or `N` | `--` or `[View](path-to-audit.md)` |
| `WF-11` | ePA & Document Exchange | `--` or `N` | `--` or `[View](path-to-audit.md)` |
| `WF-12` | Practice Administration | `--` or `N` | `--` or `[View](path-to-audit.md)` |
| `WF-13` | System Infrastructure | `--` or `N` | `--` or `[View](path-to-audit.md)` |
| `WF-14` | Data Import & Sync | `--` or `N` | `--` or `[View](path-to-audit.md)` |

Then ask the user to choose:
- one workflow
- or a few workflows

### 2. Resolve the AUDIT inputs for the selected workflows

After the user chooses workflows:

- use `$AUDIT_FILES` if it was provided
- otherwise inspect `docs/artifacts/` for `AUDIT*.md` files and identify which ones match the selected workflows
- map each selected workflow to one AUDIT source file before editing the master workflow
- determine the `Audit` status for every workflow in the `Workflow Index`
- extract `Total screens` from `Artifact Info` for every confirmed mapped AUDIT file and determine the `No. of Screen` value for every workflow in the `Workflow Index`

Rules:
- prefer `docs/artifacts/` as the canonical AUDIT source location
- if both an archive copy and an artifact copy exist, use the `docs/artifacts/` version unless the user explicitly says otherwise
- do not auto-sync an AUDIT file into a workflow section unless the mapping is reasonably clear from the AUDIT title/content
- if one selected workflow has multiple plausible AUDIT files, pause and ask the user which one to use
- if a selected workflow has no matching AUDIT file, report that gap clearly and skip that workflow
- when a mapped AUDIT file includes `Artifact Info` with `Total screens`, use that exact value for `No. of Screen`
- when a mapped AUDIT file does not include `Total screens`, use `--` for `No. of Screen`
- for the `Workflow Index`, set `Audit = [View](AUDIT_FILE)` for workflows with a confirmed mapped AUDIT file
- for the `Workflow Index`, set `No. of Screen = TOTAL_SCREENS` for workflows with a confirmed mapped AUDIT file that provides `Total screens`
- for the `Workflow Index`, set `No. of Screen = --` for workflows without a confirmed mapped AUDIT file or without `Total screens`
- for the `Workflow Index`, set `Audit = --` for workflows without a confirmed mapped AUDIT file

### 2b. Update the `Workflow Index` columns

Before editing any workflow body sections:

- update the `Workflow Index` table in `$TARGET_FLOW_FILE`
- ensure the table includes the columns:
  - `Workflow`
  - `Role`
  - `No. of Screen`
  - `Audit`
- preserve the existing workflow order
- preserve existing workflow links and role values

Rules:
- do not add alternate workflows to the index
- do not remove existing primary workflows from the index
- only update the `No. of Screen` and `Audit` column values
- set `No. of Screen` from the mapped AUDIT file's `Artifact Info -> Total screens`
- use Markdown links for `View`, for example:
  - `[View](docs/artifacts/AUDIT260322-patient-checkin-registration.md)`
- use plain numeric text for `No. of Screen`, for example:
  - `6`
- use plain `--` when no audit file is mapped

### 3. Read each selected AUDIT artifact

For each mapped workflow/AUDIT pair:

- read the AUDIT file
- extract the audited workflow structure
- reuse only what is needed for comparison sync:
  - flow logic
  - branch logic
  - user journey framing
  - source-basis labeling cues

Rules:
- treat the AUDIT file as the source of truth for the new variant
- do not re-audit from scratch inside this command
- do not redesign the workflow while syncing it
- you may normalize headings and labels for consistency with the master artifact, but do not invent new branches or reinterpret the audited flow

### 4. Update the master workflow file for the selected workflows

For each selected workflow:

- find the matching workflow section in `$TARGET_FLOW_FILE`
- keep the existing workflow intact
- add or update the alternate workflow directly below the existing workflow
- clearly label the two sources:
  - existing workflow: `Source basis: $BASE_LABEL`
  - new workflow: `Source basis: $SOURCE_LABEL`

Rules:
- do not replace the original workflow
- do not add the alternate variant to the `Workflow Index` unless the user explicitly asks for it
- treat the original `$BASE_LABEL` workflow section as read-only
- do not edit the original workflow heading, `Source basis`, flowchart, or user journey
- only add or update the alternate `$SOURCE_LABEL` section and its comparison block below the original workflow
- if an alternate workflow for the same `SOURCE_LABEL` already exists under that workflow, update that section in place instead of creating a duplicate
- if no alternate workflow exists yet, create one using a heading such as:
  - `2.1b (WF-1 Alt) ... — $SOURCE_LABEL`

Required structure for each alternate workflow:
- alternate workflow heading
- `Source basis: $SOURCE_LABEL`
- `### Flowchart`
- Mermaid flowchart
- `### User Journey`
- role-based user journey
- `### Key differences — $BASE_LABEL vs $SOURCE_LABEL`
- comparison table

For the new alternate workflow:
- reflect the audited current-state flow from the AUDIT file, not a redesign

### 5. Add a comparison block for each selected workflow

Under each alternate workflow, add:

`### Key differences — $BASE_LABEL vs $SOURCE_LABEL`

Use a table with these columns:

| Area | $BASE_LABEL | $SOURCE_LABEL | Design implication |

The comparison should capture only the most material evidence-backed differences, such as:
- entry point
- matching model
- registration resolution
- existing patient handling
- insurance / Schein handling
- patient record routing
- waiting room role
- flow shape

Rules for `Design implication`:
- point toward future structured spec work
- do not jump straight into final UI design
- phrase implications as modeling / state / routing / workflow concerns
- keep implications grounded in the observed difference rather than solutioning beyond the evidence

Recommended comparison size:
- usually 5 to 8 rows

### 6. Keep the index clean

Default rule:
- do **not** add alternate comparison workflows to the `Workflow Index`
- keep the index focused on primary workflows
- allow alternate workflows to live only in the body for side-by-side comparison

Only add alternate workflows to the index if the user explicitly asks for it.

### 7. Keep file placement canonical

- The canonical master workflow file is:
  - `docs/artifacts/FLOW260322-master-user-workflow.md`
- If the old file exists at:
  - `docs/_ngan/templates/FLOW260322-user-workflow-diagram.md`
  move or rename it into the canonical location above
- After rename or move, update stale references in `docs/` if any exist

Rules:
- only update references that point to the old master workflow path
- do not rewrite archive/history documents unless the user explicitly asks

### 8. Final verification

Before finishing:
- confirm every selected AUDIT file exists
- confirm every mapped AUDIT file contributed `Total screens` to `No. of Screen` when available, otherwise `No. of Screen` remained `--`
- confirm `$TARGET_FLOW_FILE` contains for each selected workflow:
  - the original workflow
  - the alternate workflow
  - the `Key differences` block
- confirm the `Workflow Index` reflects both `No. of Screen` and `Audit` for all workflows affected by the run
- confirm the original `$BASE_LABEL` workflow section remained unchanged
- confirm no duplicate alt sections were created for the same workflow + source label
- confirm all Mermaid blocks remain properly fenced
- confirm no stale master-workflow file references remain in `docs/`

If the selected workflow sections already contain the correct alternate content and no edit is needed:
- treat that as a successful no-op
- report that verification passed with no content change required

## Output expectations

When this command is run successfully, the repo should contain:

1. A master workflow artifact at `docs/artifacts/FLOW260322-master-user-workflow.md`
2. A prompted workflow-selection step based on the `Workflow Index`
3. A `Workflow Index` whose `No. of Screen` column is populated from `Artifact Info -> Total screens` when available, otherwise `--`
4. A `Workflow Index` whose `Audit` column shows `--` for unaudited workflows and `View` links for audited workflows
5. Side-by-side alternate workflows only for the user-selected workflows
6. A `Key differences` table with `Design implication` for each synced workflow
7. Any required path-reference cleanup after renaming or moving the master file

Workflows: $WORKFLOWS
Audit files: $AUDIT_FILES
Target flow file: $TARGET_FLOW_FILE
Source label: $SOURCE_LABEL
Base label: $BASE_LABEL
All arguments: $ARGUMENTS
