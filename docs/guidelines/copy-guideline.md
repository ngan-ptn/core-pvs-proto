# Microcopy & UX Writing Guidelines

## 1. Voice & Tone
Our users are healthcare professionals (doctors, nurses, admins) working in high-stress, fast-paced environments. The interface must be invisible, facilitating their work without distraction.

*   **Professional:** Trustworthy, clinical, and serious. Avoid slang, humor, or "cute" language.
*   **Efficient:** Direct and concise. Front-load important information.
*   **Objective:** State facts without emotion. Use "Patient requires attention" instead of "Uh oh, something is wrong."
*   **Supportive:** helpful and guiding, especially in error states, without being patronizing.

### Examples
| Context | Bad (Consumer/Playful) | Good (Clinical/Direct) |
| :--- | :--- | :--- |
| **Error** | "Oops! We couldn't save that." | "Unable to save patient data. Retry?" |
| **Success** | "You did it! Scan sent." | "CT Scan order submitted." |
| **Empty State** | "Nothing to see here yet!" | "No active treatments found." |
| **Waiting** | "Hang tight, loading..." | "Retrieving results..." |

## 2. Grammar & Mechanics

### Capitalization
*   **Sentence Case:** Use for all Headings, Subheadings, Labels, Menu items, and Button text. It is easier to scan.
    *   *Yes:* "Add new diagnosis"
    *   *No:* "Add New Diagnosis"
*   **Acronyms:** Always uppercase (CT, MVZ, ID, DOB).

### Punctuation
*   **Periods:** Avoid periods in headers, labels, or bullet points. Use periods only for full sentences in body text or helper text.
*   **Exclamation Marks:** Never use exclamation marks. They imply alarm or informality.

### Language & Localization
*   **Primary Language:** English (US) for the prototype phase.
*   **Future Proofing:** Keep strings concise to allow for German text expansion (which can be 30% longer). Avoid concatenation (building sentences with code) as it breaks translation.

## 3. Date, Time & Numbers
Critical for patient safety. Ambiguity is dangerous.

*   **Date Format:** Use unambiguous formats. Given the German context (even in English UI), prefer `DD.MM.YYYY` or `DD Mon YYYY`.
    *   *Example:* `12.04.2026` or `12 Apr 2026`
*   **Time:** 24-hour format is standard in healthcare.
    *   *Example:* `14:30` (not 2:30 PM)
*   **Names:** Display distinctively.
    *   *Format:* **Last Name**, First Name (DOB)
    *   *Example:* **Mustermann**, Erika (12.04.1985)

## 4. UI Elements

### Buttons & Actions
*   **Format:** [Verb] + [Noun] (optional).
*   **Specificity:** Be specific about the consequence.
    *   *Bad:* "OK", "Yes", "Submit"
    *   *Good:* "Order Scan", "Discharge Patient", "Save Note"

### Alerts & Notifications
*   **Danger (Red):** Critical medical alerts or destructive actions. "High risk interaction detected."
*   **Warning (Amber):** Process blocking issues. "Missing insurance information."
*   **Success (Green):** Confirmation of completed workflows. "Lab results received."
*   **Info (Blue/Gray):** Contextual help. "Last updated by Dr. Schmidt."

### Empty States
Do not dead-end the user. Explain *why* it's empty and *how* to populate it.
*   *Example:* "No documents found. Upload a file or request records from KIS."

## 5. Medical Terminology Rules
*   **Precision:** Use standard medical terminology (Appendicitis, Triage, Vitals). Do not "dumb down" terms for doctors.
*   **Abbreviations:** Use standard abbreviations (BP, HR, RR) only if space is limited and context is clear. When in doubt, spell it out.
*   **Latin vs. English:** Follow the "OrbisU" convention (usually specific clinical terms remain standard medical Latin/Germanic mix, but UI labels are English).

## 6. Domain Terminology (MVZ / PVS / KIS)
Use consistent German-market acronyms across docs and UI. Avoid introducing extra acronyms like `HIS`.

### Canonical acronyms (docs + onboarding text)
On first mention in documentation (FAQ, specs, onboarding help), use:
*   **MVZ:** `MVZ (Medizinisches Versorgungszentrum, medical care center)`
*   **PVS:** `PVS (Praxisverwaltungssystem, practice management system)`
*   **KIS:** `KIS (Krankenhausinformationssystem, hospital information system)`

After first mention, use acronym-only: `MVZ`, `PVS`, `KIS`.

### External vs internal data labels (Use case 1)
Use `KIS` and `PVS` in the UI to avoid vague labels like "hospital data" vs "clinic data".

| Concept | Badge / label | Helper text / tooltip (example) |
| :--- | :--- | :--- |
| External package (read-only) | `External (KIS)` | `Transferred from hospital. Read-only.` |
| Internal documentation (editable) | `Internal (PVS)` | `Created in MVZ. Editable.` |
| Copy/import action | `Copy to note` | `Copies value into your documentation. Does not change external record.` |
