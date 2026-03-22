# Wireframe — Prescription Unified Workspace

## Overall Desktop Wireframe

```text
+====================================================================================================================+
| PATIENT HEADER                                                                                                     |
| Name | DOB | Insurance | Schein | Allergies | Chronic conditions | Current meds | ERP mode                         |
+====================================================================================================================+
| SEARCH / QUICK PICKS            | PRESCRIPTION WORKSPACE                                    | READINESS / STATUS    |
|---------------------------------|-----------------------------------------------------------|-----------------------|
| [ Search medication........ ]   | [ Row 1 ] Ibuprofen 400mg                        [Ready]   | Readiness Checklist   |
|                                 | Form: E-Rezept   Qty: 1   Intake: 1-0-1-0                | - patient ok          |
| Recent                          | Notes: with food                                      v   | - form complete       |
| - Metformin                     |-----------------------------------------------------------| - bundle prepared     |
| - Ramipril                      | Expanded Row                                            | - signed              |
|                                 | Dosage .................... [___________]                | - sent                |
| Frequent                        | Instructions .............. [___________]                |                       |
| - Pantoprazol                   | Quantity .................. [ 1 ]                        | Safety                |
| - Novaminsulfon                 | Timing / interval ......... [___________]                | [Yellow] interaction  |
|                                 | Notes ..................... [___________]                | [Green] allergy check |
| Results                         | Aut-idem [ ]   As needed [ ]                            |                       |
| > Ibuprofen 400mg               |-----------------------------------------------------------| Recommendation        |
|   tablet | N1 | warning icon    | [ Row 2 ] Free-text medication                  [Draft]   | Cheapest generic      |
| > Aspirin 500mg                 | Form: Muster 16   Qty: 1   Intake: missing               | Contract note         |
| > Add free-text                 |-----------------------------------------------------------|                       |
|                                 |                                                           | Bundle / Sign / Send  |
|                                 |                                                           | Bundle: Ready         |
|                                 |                                                           | Sign: Not started     |
|                                 |                                                           | Send: Not started     |
|                                 |                                                           |                       |
|                                 |                                                           | Status Timeline       |
|                                 |                                                           | Draft -> Signed ->    |
|                                 |                                                           | Sent -> Dispensed     |
+--------------------------------------------------------------------------------------------------------------------+
| [Save draft] [Prepare E-Rezept] [Sign] [Send to Fachdienst] [Print patient copy] [Cancel if allowed]             |
+--------------------------------------------------------------------------------------------------------------------+
```

## State Variant A — Incomplete

```text
+--------------------------------------------------------------------------------------------------------------+
| Row status: [Incomplete]                                                                                    |
| Missing: intake interval, form-specific required field                                                      |
| Right rail: checklist shows red items                                                                       |
| Action bar: `Prepare E-Rezept`, `Sign`, and `Send` disabled                                                 |
+--------------------------------------------------------------------------------------------------------------+
```

## State Variant B — Ready To Sign

```text
+--------------------------------------------------------------------------------------------------------------+
| Row status: [Ready to sign]                                                                                 |
| Right rail: checklist all green, bundle prepared                                                            |
| Action bar primary: [Sign]                                                                                  |
+--------------------------------------------------------------------------------------------------------------+
```

## State Variant C — Signing In Progress

```text
+--------------------------------------------------------------------------------------------------------------+
| Workspace stays visible                                                                                     |
| Right rail shows: `Signing... connect eHBA / comfort signature`                                             |
| Main rows temporarily read-only                                                                             |
| Action bar primary disabled until result                                                                    |
+--------------------------------------------------------------------------------------------------------------+
```

## State Variant D — Send Failed

```text
+--------------------------------------------------------------------------------------------------------------+
| Right rail error card                                                                                       |
| `Transmission failed: connector timeout`                                                                    |
| Actions: [Retry send] [Save draft] [Print paper fallback if policy allows]                                 |
| User stays in the same workspace                                                                            |
+--------------------------------------------------------------------------------------------------------------+
```

## State Variant E — Post-Send Status

```text
+--------------------------------------------------------------------------------------------------------------+
| Workspace header chip: [Sent]                                                                               |
| Right rail timeline: Draft -> Bundle prepared -> Signed -> Sent                                             |
| Follow-up actions: [Print patient copy] [View PDF] [Resend] [Cancel if allowed]                            |
+--------------------------------------------------------------------------------------------------------------+
```

## Layout Notes
- Left rail stays narrow and optimized for search throughput.
- Main workspace is the dominant region and should support multiple rows.
- Right rail is persistent and acts as the system-awareness column.
- Sticky footer keeps the next action visible throughout the workflow.

## UX Intent
- Keep the doctor in one mental workspace.
- Treat bundle, sign, and send as state transitions inside the same flow, not navigation events.
- Keep post-send status in the same surface so the workflow feels complete instead of handed off.
