# Decision Trees — Remaining Tasks

**Last updated:** 2026-03-17
**Status:** Phase 1 complete (Patient Record View). Phase 2+ pending.

---

## Phase 2: Extend Inventory Mappings

Add a `[surface-name]-mapping.md` file for each surface below. Same format as `patient-record-mapping.md`. Check the patient-record-mapping first — many components are shared and already mapped.

| Priority | Surface | ID | Components | Complexity | Notes |
|----------|---------|-----|-----------|-----------|-------|
| 1 | Schein / Billing Record View | S008 | 60 | 260.0 | Extended by 9 phases. Most overlap with Patient Record View. |
| 2 | Card Read / Check-In Screen | S001 | 18 | 127.5 | Extended by 3 phases. MFA-primary. |
| 3 | Prescription Builder | S039 | 9 | 43.0 | Clean workflow, good candidate for a second complete mapping. |
| 4 | Quarter Transition Dashboard | S009 | 7 | 45.5 | Shares components with Card Read and Schein. |
| 5 | TE Form (Enrollment Declaration) | S011 | 9 | 43.0 | HZV/FAV specialty. Shares TE Overview List and Enrollment Settings. |

To add a mapping: open the surface entry in `master-screen-inventory.md`, list all components, then check `selection-matrices.md` to classify each.

---

## Phase 3: Selection Matrix Gaps

The current 4 matrices cover the most common component categories. These needs are not yet covered:

| Gap | Description | Suggested location |
|-----|-------------|-------------------|
| Layout patterns | How to structure a full surface (sidebar + main, two-column, panel stacks) | New Table E in selection-matrices.md |
| Navigation patterns | Breadcrumb depth, Tabs vs sidebar nav, Pagination placement | New Table F |
| Loading states | Which surfaces need Skeleton, Progress, or spinner; where to place them | Add to existing tables as a "Loading State" row |
| Print/PDF surfaces | Form Print Preview, eAU Print Preview — special layout rules | New section or separate file |

---

## Phase 4: Validation

Walk through each new surface mapping using the decision trees as a checklist to confirm:
- No anti-pattern violations in recommendations
- Custom build flags are accurate
- All 4+ states per surface (empty, loading, error, populated) have component coverage

---

## Known Limitations

- `patient-record-mapping.md` covers S002 only. Other surfaces need their own mapping files.
- Selection matrices do not yet cover layout/structural decisions (sidebar width, column ratios, scroll regions).
- No mapping for the 4 gap surfaces (S085 Waiting Room Board, S086 Clinical Note Editor, S087 GDT Device Data Review, MVZ Dashboard) — these need user stories written first.
