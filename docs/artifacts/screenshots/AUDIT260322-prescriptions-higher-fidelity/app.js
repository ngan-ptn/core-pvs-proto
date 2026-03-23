const patient = {
  initials: "AS",
  name: "Anna Schneider",
  dob: "16.10.1996",
  insurance: "AOK Baden-Wurttemberg",
  patientId: "P-100037",
  quarter: "1/2026",
  bsnr: "521111100",
  lanr: "999999901",
  doctor: "Dr. Max Mustermann",
  encounter: "Medication review",
  schein: "KV Schein - active",
};

const medicationRows = [
  {
    group: "Analgesics",
    title: "Aspirin 500 mg",
    detail: "PZN 03428402 · Bayer",
    tags: ["K-Rez", "Price comparison", "Alternatives"],
  },
  {
    group: "ACE inhibitors",
    title: "Ramipril 5 mg",
    detail: "PZN 12345678 · Hexal",
    tags: ["ePrescription", "Technical information", "Add to prescription"],
  },
];

const patientTabs = ["Timeline", "Medication", "Himi", "Heimi", "DiGA", "Forms", "Lab"];
const medicationTabs = ["Prescribed Medication", "Medication plan (BMP)"];

function h(tag, attrs = "", content = "") {
  return `<${tag} ${attrs}>${content}</${tag}>`;
}

function chips(items, cls = "chip") {
  return items.map((item) => `<span class="${cls}">${item}</span>`).join("");
}

function patientSidebar(active = "Medication") {
  return `
    <aside class="sidebar">
      <div class="sidebar-card">
        <div class="patient-head">
          <div class="avatar">${patient.initials}</div>
          <div>
            <div class="eyebrow">Patient file</div>
            <div class="patient-name">${patient.name}</div>
            <div class="subtle">${patient.dob} · ${patient.insurance}</div>
          </div>
        </div>
        <div class="info-grid">
          <div class="kv"><span>Patient ID</span><span>${patient.patientId}</span></div>
          <div class="kv"><span>Quarter</span><span>${patient.quarter}</span></div>
          <div class="kv"><span>BSNR / LANR</span><span>${patient.bsnr} / ${patient.lanr}</span></div>
          <div class="kv"><span>Treatment doctor</span><span>${patient.doctor}</span></div>
        </div>
      </div>

      <div class="sidebar-card">
        <h3>Patient information</h3>
        <div class="sidebar-list">
          <div class="sidebar-item">Encounter: ${patient.encounter}</div>
          <div class="sidebar-item">Selected Schein: ${patient.schein}</div>
          <div class="sidebar-item">Medication tab enabled</div>
        </div>
      </div>

      <div class="sidebar-card">
        <h3>Schein history</h3>
        <div class="sidebar-list">
          <div class="sidebar-item">Q1/2026 · KV Schein · selected</div>
          <div class="sidebar-item">Q4/2025 · KV Schein</div>
          <div class="sidebar-item">Create Schein</div>
        </div>
      </div>

      <div class="sidebar-card">
        <h3>Permanent diagnose</h3>
        <div class="sidebar-list">
          <div class="sidebar-item">I10 Essential hypertension</div>
          <div class="sidebar-item">E11 Type 2 diabetes mellitus</div>
        </div>
      </div>
    </aside>
  `;
}

function tabs(activePatientTab = "Medication", activeMedicationTab = "Prescribed Medication") {
  return `
    <div class="patient-tabs">
      ${patientTabs
        .map((tab) => `<div class="tab ${tab === activePatientTab ? "active" : ""}">${tab}</div>`)
        .join("")}
    </div>
    ${activePatientTab === "Medication"
      ? `<div class="med-tabs">
          ${medicationTabs
            .map((tab) => `<div class="tab ${tab === activeMedicationTab ? "active" : ""}">${tab}</div>`)
            .join("")}
        </div>`
      : ""}
  `;
}

function shell({ screenId, title, subtitle, patientTab = "Medication", medicationTab = "Prescribed Medication", body }) {
  return `
    <div class="app-shell">
      <div class="topbar">
        <div class="brand">
          <div class="brand-mark">P</div>
          <div>
            <h1>Prescription Audit Capture - Higher Fidelity</h1>
            <div class="subtle">Screen ${screenId} aligned more tightly to pvs-base-1 source structure</div>
          </div>
        </div>
        <div class="tag-row">
          <span class="pill"><strong>Mode</strong> Higher fidelity</span>
          <span class="pill"><strong>Set</strong> Separate comparison folder</span>
        </div>
      </div>
      <div class="workspace">
        ${patientSidebar(patientTab)}
        <main class="main">
          ${tabs(patientTab, medicationTab)}
          <div class="panel">
            <div class="screen-header">
              <div>
                <div class="eyebrow">${screenId}</div>
                <h2>${title}</h2>
                <p>${subtitle}</p>
              </div>
              <div class="tag-row">
                <span class="status info">source-driven</span>
                <span class="status ${screenId === "S007" || screenId === "S008" || screenId === "S009" ? "warning" : "success"}">
                  ${screenId === "S007" || screenId === "S008" || screenId === "S009" ? "mocked state" : "repo-derived shell"}
                </span>
              </div>
            </div>
            <div class="panel-body">
              ${body}
            </div>
          </div>
        </main>
      </div>
    </div>
  `;
}

function medicationSearchArea() {
  return `
    <div class="section">
      <div class="eyebrow">Medication Search</div>
      <div class="search-row" style="margin-top:10px">
        <div class="input">Input any search criteria</div>
        <div class="input">Trade name</div>
        <div class="input">Substance name</div>
        <div class="button">Search</div>
      </div>
      <div class="meta-row" style="margin-top:12px">
        ${chips(["Search in", "Trade name", "Substance name", "Manufacturer"])}
      </div>
    </div>
  `;
}

function prescribedResults() {
  return `
    <div class="split">
      <div class="section">
        <div class="eyebrow">SearchMedicationBox</div>
        <h3 style="margin-top:6px">Medication Search</h3>
        <p>Structured search with grouped medication results and links to secondary information, alternatives, and price comparison.</p>
        <div class="item-list" style="margin-top:12px">
          <div class="item">
            <div class="eyebrow">Group selected</div>
            <h4>Analgesics</h4>
            <p>Secondary information, Price comparison, Alternatives, G-BA decision</p>
            <div class="meta-row">${chips(["Secondary information", "Price comparison", "Alternatives"])}</div>
          </div>
          <div class="item">
            <div class="eyebrow">SecondLayerDialog</div>
            <h4>Access other view</h4>
            <p>Price comparison, Technical information, Alternatives, G-BA decision, Practice specialities.</p>
          </div>
        </div>
      </div>
      <div class="item-list">
        ${medicationRows
          .map(
            (row) => `
            <div class="item">
              <div class="eyebrow">${row.group}</div>
              <h4>${row.title}</h4>
              <p>${row.detail}</p>
              <div class="meta-row">${chips(row.tags)}</div>
            </div>
          `
          )
          .join("")}
      </div>
    </div>
  `;
}

function medicationPlanTable() {
  return `
    <div class="section">
      <div class="eyebrow">Medication plan (BMP)</div>
      <h3 style="margin-top:6px">Medication plan (BMP)</h3>
      <p>Source-aligned companion tab to Prescribed Medication inside MedicationKBV.</p>
      <div class="table-shell" style="margin-top:12px">
        <table class="table">
          <thead>
            <tr><th>Medication</th><th>Intake interval</th><th>As needed</th><th>Status</th></tr>
          </thead>
          <tbody>
            <tr><td>Ramipril 5 mg</td><td>1-0-0-0</td><td>No</td><td>Permanent</td></tr>
            <tr><td>Metformin 850 mg</td><td>1-0-1-0</td><td>No</td><td>Permanent</td></tr>
            <tr><td>Aspirin 500 mg</td><td>as needed</td><td>Yes</td><td>Recent</td></tr>
          </tbody>
        </table>
      </div>
    </div>
  `;
}

function shoppingBag() {
  return `
    <div class="section">
      <div class="eyebrow">MedicationShoppingBag</div>
      <h3 style="margin-top:6px">All prescriptions</h3>
      <p>Overlay-like shopping bag using source labels: Prescription, Prescribe, Remove all, Go to print preview.</p>
      <div class="item-list" style="margin-top:12px">
        <div class="item">
          <div class="eyebrow">Prescription</div>
          <h4>Aspirin 500 mg</h4>
          <p>PZN 03428402 · Quantity 5 · Intake interval e.g. 0-0-0-0 -> 1-0-1-0</p>
          <div class="meta-row">${chips(["Quantity 5", "Intake 1-0-1-0", "Further information", "As needed"])}</div>
        </div>
        <div class="item">
          <div class="eyebrow">Prescription</div>
          <h4>Ramipril 5 mg</h4>
          <p>PZN 12345678 · Quantity 2 · Continue chronic medication</p>
          <div class="meta-row">${chips(["ePrescription", "Quantity 2", "Intake 1-0-0-0"])}</div>
        </div>
      </div>
      <div class="actions-bar" style="margin-top:12px">
        <div class="tag-row">
          <span class="status success">Ready to prescribe</span>
          <span class="status info">Go to print preview</span>
        </div>
        <div class="action-row">
          <div class="ghost-button">Remove all</div>
          <div class="button">Prescribe</div>
        </div>
      </div>
    </div>
  `;
}

function printPreview() {
  return `
    <div class="split">
      <div class="section">
        <div class="eyebrow">MedicationPrintPreview</div>
        <h3 style="margin-top:6px">Print preview</h3>
        <p>Source-driven print-preview shell using Print preview, Print settings, and prescription save cues from the medication/common locales.</p>
        <div class="table-shell" style="margin-top:12px">
          <table class="table">
            <thead>
              <tr><th>Field</th><th>Value</th></tr>
            </thead>
            <tbody>
              <tr><td>Patient</td><td>${patient.name}</td></tr>
              <tr><td>Prescribing doctor</td><td>${patient.doctor}</td></tr>
              <tr><td>Prescription</td><td>Muster 16 + ePrescription</td></tr>
              <tr><td>Status</td><td>Prescription saved</td></tr>
            </tbody>
          </table>
        </div>
      </div>
      <div class="section">
        <div class="eyebrow">Print settings</div>
        <h3 style="margin-top:6px">Print settings</h3>
        <div class="item-list" style="margin-top:12px">
          <div class="item"><h4>Printer settings</h4><p>Printer profile, printer, print as duplex, print as blank form.</p></div>
          <div class="item"><h4>Form output</h4><p>Muster 16, Blue prescription, Green prescription, ePrescription.</p></div>
        </div>
        <div class="actions-bar" style="margin-top:12px">
          <div class="tag-row">
            <span class="status success">Prescription saved</span>
            <span class="status info">ePrescription stored</span>
          </div>
          <div class="action-row">
            <div class="ghost-button">Back</div>
            <div class="button">Save</div>
          </div>
        </div>
      </div>
    </div>
  `;
}

function timelineDetail() {
  return `
    <div class="split">
      <div class="section">
        <div class="eyebrow">Timeline</div>
        <h3 style="margin-top:6px">TIME_LINE_TAB</h3>
        <p>PatientPage-aligned timeline surface with medication form readback.</p>
        <div class="timeline" style="margin-top:12px">
          <div class="timeline-entry"><strong>Forms - ePrescription</strong><span>Created on 23.03.2026 10:26 · Status Saved</span></div>
          <div class="timeline-entry"><strong>Forms - Muster 16</strong><span>Created on 23.03.2026 10:24 · Status Saved</span></div>
          <div class="timeline-entry"><strong>Medication updated</strong><span>Read-back available from timeline entry actions</span></div>
        </div>
      </div>
      <div class="section">
        <div class="eyebrow">View ePrescription</div>
        <h3 style="margin-top:6px">Medication form detail</h3>
        <div class="table-shell" style="margin-top:12px">
          <table class="table">
            <thead>
              <tr><th>Prescription</th><th>Prescribing doctor</th><th>Status</th><th>Action</th></tr>
            </thead>
            <tbody>
              <tr><td>Aspirin 500 mg</td><td>${patient.doctor}</td><td>Saved</td><td>View ePrescription</td></tr>
              <tr><td>Ramipril 5 mg</td><td>${patient.doctor}</td><td>Created</td><td>Preview ePrescription</td></tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `;
}

function eRezeptTable(rows, bulkActions, note) {
  return `
    <div class="actions-bar">
      <div class="tag-row">${chips(bulkActions, "chip")}</div>
      <div class="subtle">eMuster-Center / ePrescription</div>
    </div>
    <div class="table-shell">
      <table class="table">
        <thead>
          <tr>
            <th>Created on</th>
            <th>Patient</th>
            <th>Prescribing doctor</th>
            <th>Prescription</th>
            <th>Sent On</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          ${rows}
        </tbody>
      </table>
    </div>
    <div class="right-note">${note}</div>
  `;
}

const screens = {
  S001: {
    title: "Patient Record",
    subtitle: "Patient file shell aligned to PatientPage and Schein-centric workflow.",
    patientTab: "Medication",
    medicationTab: "Prescribed Medication",
    body: `
      <div class="section">
        <div class="eyebrow">PatientPage / PatientFile</div>
        <h3 style="margin-top:6px">Patient file workspace</h3>
        <p>Left sidebar with patient information and Schein history, plus the horizontal patient tabs that gate Timeline and Medication content.</p>
        <div class="meta-row" style="margin-top:12px">
          <span class="status success">Patient loaded</span>
          <span class="status success">Selected Schein</span>
          <span class="status info">Medication tab available</span>
        </div>
      </div>
      <div class="table-shell">
        <table class="table">
          <thead><tr><th>Patient area</th><th>State</th><th>Cue from source</th></tr></thead>
          <tbody>
            <tr><td>PatientInformation</td><td>Visible</td><td>Sidebar card with patient summary</td></tr>
            <tr><td>ScheinHistory</td><td>Selected</td><td>Create / select Schein before meaningful content</td></tr>
            <tr><td>Tabs</td><td>Medication active</td><td><code>#timeline</code>, <code>#medication</code> from ID_TABS</td></tr>
          </tbody>
        </table>
      </div>
    `,
  },
  S002: {
    title: "Medication Tab",
    subtitle: "PatientPage shell with Medication tab active and MedicationKBV nested inside.",
    patientTab: "Medication",
    medicationTab: "Prescribed Medication",
    body: `
      <div class="section">
        <div class="eyebrow">ID_TABS.MEDICATION</div>
        <h3 style="margin-top:6px">Medication tab active</h3>
        <p>Matches the PatientPage pattern where Medication is a top-level patient-file tab, gated by an active Schein.</p>
        <div class="meta-row" style="margin-top:12px">
          <span class="status success">#medication</span>
          <span class="status info">MedicationKBV mounted</span>
          <span class="status">Schein required</span>
        </div>
      </div>
      ${medicationSearchArea()}
      <div class="right-note">This screen keeps the patient-file shell visible because source structure places MedicationKBV inside PatientPage, not on an isolated full-page route.</div>
    `,
  },
  S003: {
    title: "Prescribed Medication",
    subtitle: "MedicationKBV sub-tab with search, grouped results, and second-layer access.",
    patientTab: "Medication",
    medicationTab: "Prescribed Medication",
    body: `
      ${medicationSearchArea()}
      ${prescribedResults()}
    `,
  },
  S003B: {
    title: "Medication Plan",
    subtitle: "Companion MedicationKBV sub-tab for Medication plan (BMP).",
    patientTab: "Medication",
    medicationTab: "Medication plan (BMP)",
    body: medicationPlanTable(),
  },
  S004: {
    title: "Shopping Bag / Recipe Pool",
    subtitle: "MedicationShoppingBag-aligned state using source wording and actions.",
    patientTab: "Medication",
    medicationTab: "Prescribed Medication",
    body: shoppingBag(),
  },
  S005: {
    title: "Print Preview / Print Settings",
    subtitle: "MedicationPrintPreview and Common PrintPreviewDialog cues combined into a source-driven review surface.",
    patientTab: "Medication",
    medicationTab: "Prescribed Medication",
    body: printPreview(),
  },
  S006: {
    title: "Timeline Medication Form Detail",
    subtitle: "Timeline-focused readback with form-entry and view-form cues anchored to patient-file structure.",
    patientTab: "Timeline",
    medicationTab: "Prescribed Medication",
    body: timelineDetail(),
  },
  S007: {
    title: "ERP Bundle Creation",
    subtitle: "ePrescription processing state shown in an ERezept-style workflow shell.",
    patientTab: "Medication",
    medicationTab: "Prescribed Medication",
    body: eRezeptTable(
      `
        <tr>
          <td>23.03.2026 10:26</td>
          <td>${patient.name}<br><span class="subtle">${patient.dob}</span></td>
          <td>${patient.doctor}</td>
          <td>Ramipril 5 mg</td>
          <td>-</td>
          <td><span class="status info">Processing</span></td>
          <td>Preview ePrescription · Sign and send</td>
        </tr>
      `,
      ["Sign and send", "Delete"],
      "This screen keeps the ERezept table shell and status-tag model from source, while mocking the earlier bundle-creation phase as a Processing row."
    ),
  },
  S008: {
    title: "E-Rezept Send / Transmission",
    subtitle: "ERezept-style send/resend/sign flow using source actions and status tags.",
    patientTab: "Medication",
    medicationTab: "Prescribed Medication",
    body: eRezeptTable(
      `
        <tr>
          <td>23.03.2026 10:26</td>
          <td>${patient.name}<br><span class="subtle">${patient.dob}</span></td>
          <td>${patient.doctor}</td>
          <td>Ramipril 5 mg</td>
          <td>23.03.2026 10:31</td>
          <td><span class="status danger">Failed to send</span></td>
          <td>Resend · Sign and send · Delete</td>
        </tr>
        <tr>
          <td>23.03.2026 10:24</td>
          <td>${patient.name}<br><span class="subtle">${patient.dob}</span></td>
          <td>${patient.doctor}</td>
          <td>Aspirin 500 mg</td>
          <td>-</td>
          <td><span class="status warning">Signing...</span></td>
          <td>Sign and send · Delete</td>
        </tr>
      `,
      ["Resend", "Sign and send", "Delete"],
      "Actions and status text come directly from EDocuments locale and ERezept table flow: Resend, Sign and send, Failed to send, Signing..."
    ),
  },
  S009: {
    title: "E-Rezept List / Retrieval Surface",
    subtitle: "ERezept list view using real column labels and retrieval actions from the source component.",
    patientTab: "Timeline",
    medicationTab: "Prescribed Medication",
    body: eRezeptTable(
      `
        <tr>
          <td>23.03.2026 10:26</td>
          <td>${patient.name}<br><span class="subtle">${patient.dob}</span></td>
          <td>${patient.doctor}</td>
          <td>Ramipril 5 mg</td>
          <td>23.03.2026 10:32</td>
          <td><span class="status success">Sent</span></td>
          <td>View ePrescription · View QR Code · Print · Delete</td>
        </tr>
        <tr>
          <td>23.03.2026 10:24</td>
          <td>${patient.name}<br><span class="subtle">${patient.dob}</span></td>
          <td>${patient.doctor}</td>
          <td>Aspirin 500 mg</td>
          <td>23.03.2026 10:33</td>
          <td><span class="status warning">Created</span></td>
          <td>Preview ePrescription · Sign and send · Delete</td>
        </tr>
      `,
      ["Print", "Delete"],
      "This screen is the closest to actual ERezept source structure: eMuster-Center action bar, Created on / Patient / Prescribing doctor / Prescription / Sent On / Status columns, and row actions such as View ePrescription, View QR Code, Print, and Delete."
    ),
  },
};

function render() {
  const url = new URL(window.location.href);
  const screenId = (url.searchParams.get("screen") || "S001").toUpperCase();
  const screen = screens[screenId] || screens.S001;
  document.getElementById("app").innerHTML = shell({
    screenId,
    title: screen.title,
    subtitle: screen.subtitle,
    patientTab: screen.patientTab,
    medicationTab: screen.medicationTab,
    body: screen.body,
  });
  document.body.dataset.ready = "true";
}

render();
