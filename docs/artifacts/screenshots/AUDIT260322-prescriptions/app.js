const patient = {
  initials: "AS",
  name: "Anna Schneider",
  dob: "16 Oct 1996",
  insurance: "AOK Baden-Wurttemberg",
  patientId: "P-100037",
  bsnr: "521111100",
  lanr: "999999901",
  doctor: "Dr. Max Mustermann",
  quarter: "Q1 / 2026",
  encounter: "Medication review and ePrescription follow-up",
};

const medicines = [
  {
    name: "Aspirin 500 mg",
    pzn: "03428402",
    manufacturer: "Bayer",
    group: "Analgesics",
    quantity: "5",
    intake: "1-0-1-0",
    info: "After meals for 5 days",
    formType: "K-Rez",
  },
  {
    name: "Ramipril 5 mg",
    pzn: "12345678",
    manufacturer: "Hexal",
    group: "ACE inhibitors",
    quantity: "2",
    intake: "1-0-0-0",
    info: "Continue chronic medication",
    formType: "ePrescription",
  },
];

const patientBanner = `
  <div class="patient-banner">
    <div class="banner-card">
      <div class="patient-main">
        <div class="avatar">${patient.initials}</div>
        <div>
          <div class="eyebrow">Patient record</div>
          <div class="patient-name">${patient.name}</div>
          <div class="muted">DOB ${patient.dob} · ${patient.insurance}</div>
        </div>
      </div>
    </div>
    <div class="banner-card">
      <div class="grid-2">
        <div class="kv"><span>Patient ID</span><span>${patient.patientId}</span></div>
        <div class="kv"><span>Quarter</span><span>${patient.quarter}</span></div>
        <div class="kv"><span>BSNR</span><span>${patient.bsnr}</span></div>
        <div class="kv"><span>LANR</span><span>${patient.lanr}</span></div>
      </div>
    </div>
    <div class="banner-card">
      <div class="grid-2">
        <div class="kv"><span>Selected doctor</span><span>${patient.doctor}</span></div>
        <div class="kv"><span>Encounter</span><span>Open</span></div>
        <div class="kv"><span>Medication context</span><span>KBV + E-Rezept</span></div>
        <div class="kv"><span>Current task</span><span>${patient.encounter}</span></div>
      </div>
    </div>
  </div>
`;

function shell({ screenId, title, subtitle, main, rail, navActive = "medication" }) {
  return `
    <div class="shell">
      <div class="topbar">
        <div class="brand">
          <div class="brand-mark">P</div>
          <div class="brand-copy">
            <h1>Prescription Flow Capture</h1>
            <p>Derived from AUDIT260322-prescriptions and pvs-base-1 medication sources</p>
          </div>
        </div>
        <div class="topbar-meta">
          <div class="screen-label">${screenId}</div>
          <div class="pill"><strong>Mode</strong> Full coverage</div>
          <div class="pill"><strong>Source</strong> repo-derived / reconstructed</div>
        </div>
      </div>
      ${patientBanner}
      <div class="workspace">
        <aside class="sidebar">
          <div class="nav-group">
            <div class="nav-title">Patient workspace</div>
            ${navItem("overview", "Overview", navActive === "overview")}
            ${navItem("encounter", "Encounter", navActive === "encounter")}
            ${navItem("medication", "Medication", navActive === "medication")}
            ${navItem("timeline", "Timeline", navActive === "timeline")}
            ${navItem("documents", "Documents", navActive === "documents")}
          </div>
          <div class="nav-group">
            <div class="nav-title">Prescription states</div>
            ${navItem("authoring", "Authoring", ["S002", "S003", "S003B", "S004"].includes(screenId))}
            ${navItem("preview", "Print preview", screenId === "S005")}
            ${navItem("history", "Readback", screenId === "S006")}
            ${navItem("erp", "ERP lifecycle", ["S007", "S008", "S009"].includes(screenId))}
          </div>
        </aside>
        <main class="main">
          <div class="panel">
            <div class="panel-header">
              <div class="panel-title">
                <h2>${title}</h2>
                <p>${subtitle}</p>
              </div>
              <div class="tabs">
                <div class="tab ${screenId === "S003B" ? "" : "active"}">Prescribed Medication</div>
                <div class="tab ${screenId === "S003B" ? "active" : ""}">Medication Plan</div>
              </div>
            </div>
            <div class="panel-body">
              ${main}
            </div>
          </div>
        </main>
        <aside class="right-rail">
          ${rail}
        </aside>
      </div>
    </div>
  `;
}

function navItem(key, label, active) {
  return `<div class="nav-item ${active ? "active" : ""}"><span class="nav-dot"></span><span>${label}</span></div>`;
}

function searchBar() {
  return `
    <div class="search-bar">
      <div class="field">Input any search criteria</div>
      <div class="select">Trade name</div>
      <div class="select">Substance search</div>
      <div class="button">Search</div>
    </div>
  `;
}

function shoppingBagRail() {
  return `
    <div class="rail-card">
      <div class="rail-header"><h3>Prescription summary</h3><div class="status-chip info">2 items</div></div>
      <div class="rail-body">
        <div class="summary-line"><span>Aspirin 500 mg</span><span>5 packs</span></div>
        <div class="summary-line"><span>Ramipril 5 mg</span><span>2 packs</span></div>
        <div class="summary-line"><span>Validation</span><span>Ready to prescribe</span></div>
      </div>
    </div>
    <div class="rail-card">
      <div class="rail-header"><h3>Readiness</h3></div>
      <div class="rail-body">
        <div class="badge-row">
          <div class="status-chip success">Dosage complete</div>
          <div class="status-chip success">Quantity valid</div>
          <div class="status-chip info">1 ePrescription</div>
        </div>
        <div class="note-box">This right rail mirrors the audit conclusion that shopping bag validation decides whether the user can continue to print or create ERP bundles.</div>
      </div>
    </div>
  `;
}

function authoringResults() {
  return `
    <div class="columns-2">
      <div class="stack">
        <div class="group-card">
          <div class="eyebrow">Group selected</div>
          <h3>Analgesics</h3>
          <p>Structured medication group from KBV medication search</p>
          <div class="result-meta">
            <div class="status-chip">OTC</div>
            <div class="status-chip">Package sizes</div>
            <div class="status-chip">Alternatives</div>
          </div>
        </div>
        <div class="group-card">
          <div class="eyebrow">Secondary information</div>
          <h3>Warnings and alternatives</h3>
          <p>Price comparison, red-hand letters, and medication directive surfaces are reachable from this layer.</p>
          <div class="result-meta">
            <div class="status-chip warning">Priscus warning</div>
            <div class="status-chip info">Price comparison</div>
            <div class="status-chip info">Technical information</div>
          </div>
        </div>
      </div>
      <div class="card-list">
        ${medicines
          .map(
            (medicine) => `
          <div class="result-row">
            <div class="eyebrow">${medicine.group}</div>
            <h3>${medicine.name}</h3>
            <p>PZN ${medicine.pzn} · ${medicine.manufacturer}</p>
            <div class="result-meta">
              <div class="status-chip">${medicine.formType}</div>
              <div class="status-chip">Price comparison</div>
              <div class="status-chip">Add to prescription</div>
            </div>
          </div>`
          )
          .join("")}
      </div>
    </div>
  `;
}

function bagRows() {
  return medicines
    .map(
      (medicine) => `
        <div class="bag-row">
          <div class="eyebrow">${medicine.formType}</div>
          <h3>${medicine.name}</h3>
          <p>PZN ${medicine.pzn} · ${medicine.manufacturer}</p>
          <div class="bag-meta">
            <div class="status-chip">Quantity ${medicine.quantity}</div>
            <div class="status-chip">Intake ${medicine.intake}</div>
            <div class="status-chip">${medicine.info}</div>
            <div class="status-chip success">As needed off</div>
          </div>
          <div class="action-row">
            <div class="mini-button secondary">Edit</div>
            <div class="mini-button secondary">Remove</div>
          </div>
        </div>
      `
    )
    .join("");
}

function printPreviewContent() {
  return `
    <div class="columns-2">
      <div class="stack">
        <div class="group-card">
          <div class="eyebrow">Print settings</div>
          <h3>Form selection and output</h3>
          <p>Select prescription type, review patient data, and choose save vs print action.</p>
          <div class="result-meta">
            <div class="status-chip success">Muster 16</div>
            <div class="status-chip">Blue prescription</div>
            <div class="status-chip">Green prescription</div>
            <div class="status-chip">ePrescription</div>
          </div>
        </div>
        <table class="table">
          <thead>
            <tr>
              <th>Field</th>
              <th>Value</th>
            </tr>
          </thead>
          <tbody>
            <tr><td>Patient</td><td>${patient.name}</td></tr>
            <tr><td>Insurance</td><td>${patient.insurance}</td></tr>
            <tr><td>Doctor</td><td>${patient.doctor}</td></tr>
            <tr><td>BSNR / LANR</td><td>${patient.bsnr} / ${patient.lanr}</td></tr>
          </tbody>
        </table>
      </div>
      <div class="group-card">
        <div class="eyebrow">Form preview</div>
        <h3>Muster 16 / ePrescription preview</h3>
        <p>Form payload generated from selected medicines and current patient context.</p>
        <table class="table">
          <thead>
            <tr>
              <th>Medication</th>
              <th>Qty</th>
              <th>Intake</th>
            </tr>
          </thead>
          <tbody>
            <tr><td>Aspirin 500 mg</td><td>5</td><td>1-0-1-0</td></tr>
            <tr><td>Ramipril 5 mg</td><td>2</td><td>1-0-0-0</td></tr>
          </tbody>
        </table>
        <div class="footer-actions">
          <div class="button secondary">Back to prescription</div>
          <div class="button">Save</div>
        </div>
      </div>
    </div>
  `;
}

function timelineContent() {
  return `
    <div class="columns-2">
      <div class="stack">
        <div class="timeline-row">
          <div class="eyebrow">Timeline</div>
          <h3>Medication history</h3>
          <p>Read-back surface after saving a prescription form.</p>
          <div class="timeline">
            <div class="timeline-item"><strong>Prescription saved</strong><span>2026-03-23 10:24 · Muster 16 created</span></div>
            <div class="timeline-item"><strong>ePrescription stored</strong><span>2026-03-23 10:26 · ERP metadata persisted</span></div>
            <div class="timeline-item"><strong>Medication reviewed</strong><span>2026-03-23 10:12 · Encounter updated</span></div>
          </div>
        </div>
      </div>
      <div class="group-card">
        <div class="eyebrow">Medication form detail</div>
        <h3>Prescription detail</h3>
        <p>Saved medication form reopened from timeline/history.</p>
        <table class="table">
          <thead>
            <tr>
              <th>Medication</th>
              <th>Form</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr><td>Aspirin 500 mg</td><td>Muster 16</td><td>Saved</td></tr>
            <tr><td>Ramipril 5 mg</td><td>ePrescription</td><td>Stored</td></tr>
          </tbody>
        </table>
        <div class="action-row">
          <div class="mini-button secondary">Open PDF</div>
          <div class="mini-button secondary">Reopen context</div>
        </div>
      </div>
    </div>
  `;
}

function erpBundleContent() {
  return `
    <div class="stack">
      <div class="split-callout">
        <strong>ERP bundle creation</strong>
        <span class="muted">Transitional state after the shopping bag is valid and the user chooses the ePrescription path.</span>
      </div>
      <div class="group-card">
        <div class="eyebrow">Bundle creation in progress</div>
        <h3>Preparing ERP bundles from form infos</h3>
        <div class="progress">
          <div class="progress-step complete"><div class="dot">1</div><div><div class="label">Validate shopping bag</div><div class="hint">Quantity, dosage, and freetext checks passed</div></div><div class="status-chip success">Done</div></div>
          <div class="progress-step active"><div class="dot">2</div><div><div class="label">Create ERP bundle</div><div class="hint">FHIR payload generation and bundle assembly</div></div><div class="status-chip info">Running</div></div>
          <div class="progress-step"><div class="dot">3</div><div><div class="label">Prepare sign/send</div><div class="hint">Ready state after successful bundle creation</div></div><div class="status-chip">Queued</div></div>
        </div>
      </div>
      <div class="note-box">This screen is reconstructed from the audited ERP branch and the createBundles behavior in the shopping bag source.</div>
    </div>
  `;
}

function erpSendContent() {
  return `
    <div class="columns-2">
      <div class="group-card">
        <div class="eyebrow">ePrescription transmission</div>
        <h3>Sign and send ERP</h3>
        <p>Dedicated branch for sign, send, retry, and abort behaviors.</p>
        <div class="progress">
          <div class="progress-step complete"><div class="dot">1</div><div><div class="label">Bundle created</div><div class="hint">ERP payload stored locally</div></div><div class="status-chip success">Done</div></div>
          <div class="progress-step complete"><div class="dot">2</div><div><div class="label">Sign request</div><div class="hint">PIN confirmation requested on card terminal</div></div><div class="status-chip success">Signed</div></div>
          <div class="progress-step failed"><div class="dot">3</div><div><div class="label">Send to ERP service</div><div class="hint">Transmission failed once and can be retried</div></div><div class="status-chip danger">Failed</div></div>
        </div>
        <div class="action-row">
          <div class="mini-button">Retry send</div>
          <div class="mini-button secondary">Abort</div>
        </div>
      </div>
      <div class="group-card">
        <div class="eyebrow">Transmission log</div>
        <h3>Send failed / retry path</h3>
        <table class="table">
          <thead>
            <tr><th>Time</th><th>Event</th><th>Result</th></tr>
          </thead>
          <tbody>
            <tr><td>10:29</td><td>Qualified signature</td><td>Success</td></tr>
            <tr><td>10:30</td><td>Activate task</td><td>Queued</td></tr>
            <tr><td>10:31</td><td>Send ERP</td><td>Recoverable failure</td></tr>
          </tbody>
        </table>
      </div>
    </div>
  `;
}

function erpListContent() {
  return `
    <div class="stack">
      <table class="table">
        <thead>
          <tr>
            <th>Medication</th>
            <th>Created</th>
            <th>Status</th>
            <th>Artifacts</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Ramipril 5 mg</td>
            <td>2026-03-23 10:26</td>
            <td><span class="status-chip success">Sent</span></td>
            <td>PDF, task id, bundle</td>
            <td>Open PDF · Resend · Remove</td>
          </tr>
          <tr>
            <td>Aspirin 500 mg</td>
            <td>2026-03-23 10:31</td>
            <td><span class="status-chip warning">Resend pending</span></td>
            <td>PDF pending</td>
            <td>Retry · Abort</td>
          </tr>
        </tbody>
      </table>
      <div class="note-box">This retrieval surface is reconstructed from the audited status branch: sent status, PDF access, resend, abort, and removal actions.</div>
    </div>
  `;
}

const screens = {
  S001: {
    title: "Patient Record",
    subtitle: "Entry point where the user reaches the medication workflow.",
    navActive: "overview",
    main: `
      <div class="stack">
        <div class="group-card">
          <div class="eyebrow">Current patient context</div>
          <h3>Open patient chart</h3>
          <p>The medication workflow starts from the patient record, where chart context, insurance, encounter, and care-provider identity are already resolved.</p>
          <div class="badge-row">
            <div class="status-chip success">Patient record loaded</div>
            <div class="status-chip">Timeline available</div>
            <div class="status-chip">Medication tab available</div>
          </div>
        </div>
        <table class="table">
          <thead>
            <tr><th>Section</th><th>Status</th><th>Next action</th></tr>
          </thead>
          <tbody>
            <tr><td>Encounter</td><td>Open</td><td>Continue documentation</td></tr>
            <tr><td>Medication</td><td>Needs review</td><td>Open medication tab</td></tr>
            <tr><td>Timeline</td><td>3 recent entries</td><td>Review prior prescriptions</td></tr>
          </tbody>
        </table>
      </div>
    `,
    rail: `
      <div class="rail-card">
        <div class="rail-header"><h3>Quick actions</h3></div>
        <div class="rail-body">
          <div class="button">Open Medication</div>
          <div class="button secondary">Open Timeline</div>
        </div>
      </div>
      <div class="rail-card">
        <div class="rail-header"><h3>Audit mapping</h3></div>
        <div class="rail-body">
          <div class="summary-line"><span>State</span><span>patient_record_loaded</span></div>
          <div class="note-box">This reconstructed screen represents the audited entry surface before switching into the medication container.</div>
        </div>
      </div>
    `,
  },
  S002: {
    title: "Medication Tab",
    subtitle: "Container surface for medication-related work.",
    navActive: "medication",
    main: `
      <div class="stack">
        <div class="group-card">
          <div class="eyebrow">Medication workspace</div>
          <h3>Shared medication context is loaded</h3>
          <p>This screen represents the medication container before the user commits to either prescribing or reviewing the medication plan.</p>
          <div class="badge-row">
            <div class="status-chip success">medication_tab_loaded</div>
            <div class="status-chip info">prescribed_medication_active</div>
            <div class="status-chip">medication_plan_active</div>
          </div>
        </div>
        ${searchBar()}
        <div class="split-callout">
          <strong>Available paths</strong>
          <span class="muted">Switch to Prescribed Medication for search and authoring, or Medication Plan for review and reconciliation.</span>
        </div>
      </div>
    `,
    rail: shoppingBagRail(),
  },
  S003: {
    title: "Prescribed Medication",
    subtitle: "Search, selection, grouped results, and secondary medication detail flows.",
    navActive: "medication",
    main: `
      <div class="stack">
        ${searchBar()}
        ${authoringResults()}
      </div>
    `,
    rail: shoppingBagRail(),
  },
  S003B: {
    title: "Medication Plan",
    subtitle: "Adjacent medication-management surface reviewed from the medication tab.",
    navActive: "medication",
    main: `
      <div class="stack">
        <div class="group-card">
          <div class="eyebrow">Medication plan (BMP)</div>
          <h3>Existing medication overview</h3>
          <p>This supplemental capture covers the tenth audited surface that appears in the state diagram but is not given its own screen number in the swimlane.</p>
        </div>
        <table class="table">
          <thead>
            <tr><th>Medication</th><th>Intake</th><th>Status</th><th>Source</th></tr>
          </thead>
          <tbody>
            <tr><td>Ramipril 5 mg</td><td>1-0-0-0</td><td>Permanent</td><td>BMP</td></tr>
            <tr><td>Metformin 850 mg</td><td>1-0-1-0</td><td>Permanent</td><td>BMP</td></tr>
            <tr><td>Aspirin 500 mg</td><td>as needed</td><td>Recent</td><td>Prescription history</td></tr>
          </tbody>
        </table>
      </div>
    `,
    rail: `
      <div class="rail-card">
        <div class="rail-header"><h3>Plan actions</h3></div>
        <div class="rail-body">
          <div class="button secondary">Return to prescribing</div>
          <div class="button">Import BMP</div>
        </div>
      </div>
      <div class="rail-card">
        <div class="rail-header"><h3>Audit mapping</h3></div>
        <div class="rail-body">
          <div class="summary-line"><span>State</span><span>medication_plan_active</span></div>
          <div class="note-box">Supplemental capture added because the audit summary lists ten surfaces including Medication Plan.</div>
        </div>
      </div>
    `,
  },
  S004: {
    title: "Shopping Bag / Recipe Pool",
    subtitle: "Selected medicines with editable quantity, intake interval, and further information.",
    navActive: "medication",
    main: `
      <div class="stack">
        <div class="group-card">
          <div class="eyebrow">Prescription overview</div>
          <h3>All prescriptions</h3>
          <p>This surface corresponds to the Prescription / Recipe pool behavior referenced by the pvs-base-1 shopping bag source and page object.</p>
          <div class="badge-row">
            <div class="status-chip success">shopping_bag_with_items</div>
            <div class="status-chip success">prescribe_able</div>
            <div class="status-chip">remove_all_confirm_open</div>
          </div>
        </div>
        <div class="card-list">
          ${bagRows()}
        </div>
        <div class="footer-actions">
          <div class="button secondary">Remove all</div>
          <div class="button">Prescribe</div>
        </div>
      </div>
    `,
    rail: shoppingBagRail(),
  },
  S005: {
    title: "Print Preview / Print Settings",
    subtitle: "Form-oriented review surface for save, print, and prescription-form generation.",
    navActive: "medication",
    main: printPreviewContent(),
    rail: `
      <div class="rail-card">
        <div class="rail-header"><h3>Form states</h3></div>
        <div class="rail-body">
          <div class="badge-row">
            <div class="status-chip success">print_settings_open</div>
            <div class="status-chip">saving_prescription</div>
            <div class="status-chip">prescription_saved</div>
          </div>
          <div class="note-box">Labels are taken from the pvs-base-1 medication locales, including Print settings, Prescription saved, and ePrescription variants.</div>
        </div>
      </div>
      <div class="rail-card">
        <div class="rail-header"><h3>Available actions</h3></div>
        <div class="rail-body">
          <div class="button">Save</div>
          <div class="button secondary">Print</div>
        </div>
      </div>
    `,
  },
  S006: {
    title: "Timeline Medication Form Detail",
    subtitle: "Read-back detail surface for saved medication prescription entries.",
    navActive: "timeline",
    main: timelineContent(),
    rail: `
      <div class="rail-card">
        <div class="rail-header"><h3>Detail state</h3></div>
        <div class="rail-body">
          <div class="summary-line"><span>State</span><span>timeline_detail_view</span></div>
          <div class="badge-row">
            <div class="status-chip success">Prescription saved</div>
            <div class="status-chip info">Reopen available</div>
          </div>
        </div>
      </div>
      <div class="rail-card">
        <div class="rail-header"><h3>Action rail</h3></div>
        <div class="rail-body">
          <div class="button secondary">Return to prescribing</div>
          <div class="button">Open PDF</div>
        </div>
      </div>
    `,
  },
  S007: {
    title: "ERP Bundle Creation",
    subtitle: "Transitional ePrescription state between prepared form info and sign/send readiness.",
    navActive: "medication",
    main: erpBundleContent(),
    rail: `
      <div class="rail-card">
        <div class="rail-header"><h3>Bundle states</h3></div>
        <div class="rail-body">
          <div class="badge-row">
            <div class="status-chip info">bundle_creation_in_progress</div>
            <div class="status-chip">bundle_created</div>
            <div class="status-chip danger">bundle_creation_failed</div>
            <div class="status-chip">erezept_ready_to_sign_send</div>
          </div>
        </div>
      </div>
      <div class="rail-card">
        <div class="rail-header"><h3>Downstream path</h3></div>
        <div class="rail-body">
          <div class="button">Continue to sign/send</div>
          <div class="button secondary">Return to shopping bag</div>
        </div>
      </div>
    `,
  },
  S008: {
    title: "E-Rezept Send / Transmission",
    subtitle: "Sign, send, retry, and abort behaviors for the ERP branch.",
    navActive: "medication",
    main: erpSendContent(),
    rail: `
      <div class="rail-card">
        <div class="rail-header"><h3>Transmission states</h3></div>
        <div class="rail-body">
          <div class="badge-row">
            <div class="status-chip">erezept_created</div>
            <div class="status-chip success">erezept_sent</div>
            <div class="status-chip danger">send_failed</div>
            <div class="status-chip warning">erezept_resend_pending</div>
            <div class="status-chip">erezept_aborted</div>
          </div>
        </div>
      </div>
      <div class="rail-card">
        <div class="rail-header"><h3>Actions</h3></div>
        <div class="rail-body">
          <div class="button">Retry send</div>
          <div class="button secondary">Abort</div>
        </div>
      </div>
    `,
  },
  S009: {
    title: "E-Rezept List / Retrieval Surface",
    subtitle: "Status, retrieval, resend, and removal actions for existing ePrescription items.",
    navActive: "timeline",
    main: erpListContent(),
    rail: `
      <div class="rail-card">
        <div class="rail-header"><h3>List states</h3></div>
        <div class="rail-body">
          <div class="badge-row">
            <div class="status-chip success">erezept_sent</div>
            <div class="status-chip warning">erezept_resend_pending</div>
            <div class="status-chip danger">erezept_removed</div>
          </div>
          <div class="note-box">This screen closes the audited ERP status branch with PDF retrieval and resend / remove options.</div>
        </div>
      </div>
      <div class="rail-card">
        <div class="rail-header"><h3>Follow-up</h3></div>
        <div class="rail-body">
          <div class="button secondary">Reopen prescription</div>
          <div class="button">Open PDF</div>
        </div>
      </div>
    `,
  },
};

function render() {
  const url = new URL(window.location.href);
  const screenId = (url.searchParams.get("screen") || "S001").toUpperCase();
  const screen = screens[screenId] || screens.S001;
  document.body.dataset.screen = screenId;
  document.getElementById("app").innerHTML = shell({
    screenId,
    title: screen.title,
    subtitle: screen.subtitle,
    main: screen.main,
    rail: screen.rail,
    navActive: screen.navActive,
  });
  document.body.dataset.ready = "true";
}

render();
