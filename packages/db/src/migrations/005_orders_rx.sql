-- Orders & prescriptions: medication, prescription, lab_order, imaging_order, document, doctor_letter

-- medication (Arzneimittel-Katalog, small demo subset)
CREATE TABLE medication (
  id              TEXT PRIMARY KEY,
  pzn             TEXT NOT NULL UNIQUE,             -- Pharmazentralnummer
  name            TEXT NOT NULL,                    -- Handelsname
  active_ingredient TEXT,                           -- Wirkstoff
  dosage_form     TEXT,                             -- Darreichungsform (Tablette, Tropfen, etc.)
  strength        TEXT,                             -- e.g. '500mg', '10mg/ml'
  created_at      TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
  updated_at      TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now'))
);

-- prescription (Rezept)
CREATE TABLE prescription (
  id                  TEXT PRIMARY KEY,
  treatment_case_id   TEXT NOT NULL REFERENCES treatment_case(id) ON DELETE RESTRICT,
  doctor_id           TEXT NOT NULL REFERENCES user(id),
  medication_id       TEXT REFERENCES medication(id),  -- optional FK to catalog
  medication_name     TEXT NOT NULL,                    -- denormalized for display
  medication_pzn      TEXT,
  dosage_instructions TEXT,                             -- Dosieranweisung
  quantity            TEXT,
  prescription_type   TEXT NOT NULL DEFAULT 'kassenrezept'
                      CHECK (prescription_type IN ('kassenrezept','privatrezept','btm')),
  status              TEXT NOT NULL DEFAULT 'draft'
                      CHECK (status IN ('draft','signed','dispensed','cancelled')),
  prescribed_at       TEXT NOT NULL,
  created_at          TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
  updated_at          TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now'))
);

-- lab_order (Laborauftrag)
CREATE TABLE lab_order (
  id                  TEXT PRIMARY KEY,
  treatment_case_id   TEXT NOT NULL REFERENCES treatment_case(id) ON DELETE RESTRICT,
  doctor_id           TEXT NOT NULL REFERENCES user(id),
  description         TEXT NOT NULL,
  status              TEXT NOT NULL DEFAULT 'ordered'
                      CHECK (status IN ('ordered','in_progress','completed','cancelled')),
  result_summary      TEXT,
  result_details      TEXT,                         -- JSON blob for structured results
  ordered_at          TEXT NOT NULL,
  completed_at        TEXT,
  created_at          TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
  updated_at          TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now'))
);

-- imaging_order (Bildgebungsauftrag)
CREATE TABLE imaging_order (
  id                  TEXT PRIMARY KEY,
  treatment_case_id   TEXT NOT NULL REFERENCES treatment_case(id) ON DELETE RESTRICT,
  doctor_id           TEXT NOT NULL REFERENCES user(id),
  modality            TEXT CHECK (modality IN ('xray','ct','mri','ultrasound','other')),  -- Bildgebungsverfahren
  body_region         TEXT,
  description         TEXT NOT NULL,
  status              TEXT NOT NULL DEFAULT 'ordered'
                      CHECK (status IN ('ordered','in_progress','completed','cancelled')),
  result_summary      TEXT,
  result_details      TEXT,                         -- JSON blob
  ordered_at          TEXT NOT NULL,
  completed_at        TEXT,
  created_at          TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
  updated_at          TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now'))
);

-- document (Dokument: forms, reports, letters)
CREATE TABLE document (
  id                  TEXT PRIMARY KEY,
  patient_id          TEXT NOT NULL REFERENCES patient(id) ON DELETE RESTRICT,
  treatment_case_id   TEXT REFERENCES treatment_case(id) ON DELETE SET NULL,
  document_type       TEXT NOT NULL CHECK (document_type IN (
    'form','lab_report','imaging_report','prescription_print','letter','referral_letter','arztbrief'
  )),
  title               TEXT NOT NULL,
  content             TEXT,                         -- Markdown/HTML for demo rendering
  generated_by        TEXT REFERENCES user(id),
  generated_at        TEXT NOT NULL,
  created_at          TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
  updated_at          TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now'))
);

-- doctor_letter (Arztbrief — structured letter extending document)
CREATE TABLE doctor_letter (
  id                      TEXT PRIMARY KEY,
  document_id             TEXT NOT NULL UNIQUE REFERENCES document(id) ON DELETE CASCADE,
  encounter_id            TEXT REFERENCES encounter(id),
  treatment_case_id       TEXT REFERENCES treatment_case(id),
  recipient_name          TEXT NOT NULL,
  recipient_institution   TEXT,
  recipient_address       TEXT,
  recipient_lanr          TEXT,              -- if recipient is a known physician
  recipient_bsnr          TEXT,              -- if recipient is a known practice
  purpose                 TEXT NOT NULL,     -- 'befundbericht', 'arztbrief', 'ueberweisung_bericht'
  sent_via                TEXT CHECK (sent_via IN ('kim','print','fax','email')),
  sent_at                 TEXT,
  status                  TEXT NOT NULL DEFAULT 'draft'
                          CHECK (status IN ('draft','finalized','sent')),
  created_at              TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
  updated_at              TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now'))
);

CREATE INDEX idx_prescription_case ON prescription(treatment_case_id);
CREATE INDEX idx_lab_order_case ON lab_order(treatment_case_id);
CREATE INDEX idx_imaging_order_case ON imaging_order(treatment_case_id);
CREATE INDEX idx_document_patient ON document(patient_id);
CREATE INDEX idx_document_case ON document(treatment_case_id);
CREATE INDEX idx_doctor_letter_document ON doctor_letter(document_id);
