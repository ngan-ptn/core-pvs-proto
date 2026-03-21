# Doctor Bird-Eye User Flow

**Source attachment:** `/Users/nganpham/Downloads/bird-eye-view-Doctor.png`

## Scope

This flow translates the doctor bird-eye board into a readable left-to-right user flow. It reflects the visible section titles and the legible task notes from the image.

## Interpretation Notes

- The board mixes doctor-owned steps with upstream and downstream handoffs from MFA and admin workflows.
- Where small labels were readable, they are included directly.
- Where the image only exposed the section title, the step below is inferred from the section name and current CorePVS terminology in `product-context/`.

## End-to-End Flow

1. **Schedule appointment**
   The journey can begin from appointment scheduling in the calendar.

2. **Day preparation**
   Before consultation starts, the doctor reviews the calendar and waiting-room context.

3. **Daily list / to-do list**
   The doctor works from a daily operational queue.
   Visible tasks:
   - Waiting room
   - To-do
   - Patient list with visit reason
   - Patient profile
   - Timeline

4. **Offline to-do**
   Work that cannot yet be completed in the live encounter stays in a separate follow-up queue.

5. **Patient registration handoff**
   The doctor flow receives patients after registration steps are completed.
   Visible registration sections:
   - Patient registration `(Calendar, Waiting room)`
   - Patient registration `(Card reading)`
   - Patient registration `(Check documents)`
   - Patient registration `(Create patient)`
   - Patient registration `(Create schein)`

6. **Enrollment and patient-related tasks**
   Once the patient is present in the system, enrollment and patient-specific to-dos are resolved before or around the encounter.

7. **MFA examination and waiting-room assignment**
   The doctor depends on pre-consultation intake work being completed and the patient being placed in the correct waiting-room state.

8. **Scanning and saving external documents**
   External records are attached before or during the encounter so the doctor can review them in context.

9. **Primary anamnesis**
   Clinical intake begins with structured history capture.

10. **Doctor preparation for consultation**
    The doctor opens the patient context and prepares the visit.
    Visible items:
    - Waiting room
    - Patient profile
    - Sidebar `(Medical Data)`
    - Timeline

11. **Get understanding about patient's problems**
    The consultation moves into problem understanding using the same patient context surfaces.
    Visible items:
    - Patient profile
    - Sidebar `(Medical Data)`
    - Timeline

12. **Schein documentation**
    Administrative documentation remains accessible during the visit.
    Visible items:
    - Schein management
    - Composer
    - View schein details
    - Patient profile: next gen

13. **DMP documentation**
    If relevant, the doctor enters or reviews DMP information.
    Visible items:
    - eDMP `(Sidebar)`
    - Enrollment
    - Documentation `(plausibility check)`
    - Patient list

14. **Examination**
    The doctor documents findings from the examination and any connected device workflow.
    Visible items:
    - Examination `(GDT) ... hardware devices`
    - Patient profile
    - Timeline
    - Composer

15. **Laboratory**
    Lab-related tasks are handled as a separate module or subflow.

16. **Diagnoses and findings**
    The doctor records diagnoses and clinical findings.
    Visible items:
    - Timeline
    - Composer

17. **Therapy**
    Treatment decisions are documented in a dedicated therapy workspace.
    Visible items:
    - Composer
    - Text module

18. **Prescription**
    Medication and remedy prescribing happens after assessment and treatment planning.
    Visible items:
    - HIMI
    - HEIMI
    - Prescribed medication
    - Medication plan
    - Medication search
    - KBV Medication

19. **Forms**
    The doctor completes visit-related forms in a separate forms area.

20. **Doctor search**
    If coordination is needed, the doctor can search for other providers.
    Visible items:
    - Doctor KBV search
    - House doctor search
    - Specialist search

21. **Doctor letter / documents**
    Documents and doctor letters are created or reviewed after the encounter.

22. **Forms / referral letter**
    Referral creation appears as a dedicated handoff step.
    Visible items:
    - Waiting room
    - To-do list

23. **Follow-up processing**
    Remaining post-visit work is handled in a follow-up stage.

24. **Edit schein**
    The doctor or downstream admin can reopen schein data when corrections are needed.
    Visible items:
    - Schein management
    - View schein details
    - Patient profile: next gen

25. **Billing correction**
    Billing-related issues are resolved after documentation review.

26. **Stats / report**
    The flow ends with reporting and overview surfaces for review or monitoring.

## Summary

At a high level, the doctor board describes a continuous journey from scheduled visit, through consultation and medical documentation, into treatment, referral, correction, and reporting. The central working context is the patient profile plus medical-data sidebar, while specialized tasks branch into DMP, examination, laboratory, prescription, forms, and follow-up modules.
