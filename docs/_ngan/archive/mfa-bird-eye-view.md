# MFA Bird-Eye User Flow

**Source attachment:** `/Users/nganpham/Downloads/bird-eye-view-MFA.png`

## Scope

This flow translates the MFA bird-eye board into a readable left-to-right user flow. The image exposed most section titles clearly, but many lower-level notes were not legible at export size, so some step descriptions below are inferred from the visible lane names and the current CorePVS product context.

## Interpretation Notes

- The MFA board appears to cover the full patient-operations journey, not only front-desk work.
- Compared with the doctor board, the MFA view prominently includes `Refill forms` and shows `BMP` inside prescription.
- Any step marked as inferred is based on the board title plus current repo terminology for MFA tasks.

## End-to-End Flow

1. **Refill forms**
   The flow can start with repeat administrative paperwork or repeat-order preparation before the appointment is handled.

2. **Schedule appointment**
   The MFA books or updates the appointment in the calendar.

3. **Day preparation**
   The MFA prepares the daily operational view across calendar and waiting-room contexts.

4. **Daily list / to-do list**
   The MFA manages the queue of patients, visit reasons, and open operational tasks.

5. **Offline to-do**
   Items that cannot be completed immediately stay in a separate work queue.

6. **Patient registration: calendar / waiting room**
   The patient is surfaced in the registration workflow through the calendar and waiting-room context.

7. **Patient registration: card reading**
   The MFA reads the eGK card or starts the equivalent registration input flow.

8. **Patient registration: check documents**
   The MFA verifies the required documents before the encounter continues.

9. **Patient registration: create patient**
   If the patient does not yet exist in the system, the MFA creates the patient record.

10. **Patient registration: create schein**
    The billing case is created as part of the intake workflow.

11. **Enrollment**
    Participation or enrollment checks are handled after the patient and schein context exist.

12. **Patient-related to-do's**
    The MFA resolves patient-specific tasks before the doctor consultation starts.

13. **MFA examination**
    Pre-consultation assessment or intake measurements are captured here.

14. **Waiting room assignment**
    The patient is assigned to the correct waiting-room state to support handoff and flow control.

15. **Scanning and saving external documents**
    External paperwork and incoming records are attached to the patient context.

16. **Primary anamnesis**
    The MFA supports structured intake before the doctor consultation.

17. **Doctor preparation for consultation**
    The flow transitions into doctor-facing preparation with the patient context already assembled.

18. **Get understanding about patient's problems**
    The patient problem statement and visit context become clear enough for consultation to start.

19. **Schein documentation**
    Administrative documentation remains available during the visit.

20. **DMP documentation**
    If applicable, DMP-related data is entered or checked.

21. **Examination**
    Encounter-related examination work proceeds after intake.

22. **Laboratory**
    Lab tasks branch from the encounter as needed.

23. **Diagnoses and findings**
    The clinical record is updated with structured findings.

24. **Therapy**
    Treatment planning is documented.

25. **Prescription**
    The MFA board explicitly groups prescription work as:
    - Medication
    - BMP
    - HEIMI
    - HIMI

26. **Forms**
    Forms handling continues as a dedicated workspace after treatment decisions.

27. **Doctor search**
    Provider lookup supports referrals or coordination.

28. **Doctor letter / documents**
    Outgoing and stored documents are prepared or managed here.

29. **Forms / referral letter**
    Referral generation appears as its own follow-on step.

30. **Follow-up processing**
    Remaining post-visit work is handled after the active encounter.

31. **Edit schein**
    The schein can be reopened when corrections are needed.

32. **Billing correction**
    Billing issues are reviewed and corrected.

33. **Stats / report**
    The workflow ends in reporting and operational review surfaces.

## Role Lens

From the MFA perspective, the highest-value part of this journey is the intake and orchestration layer: appointment setup, registration, document checks, waiting-room control, intake support, and downstream corrections. The later clinical sections are still visible because the board appears to map the full connected patient journey across handoffs rather than isolating only MFA-owned screens.
