-- Patient detail tables: patient_consent, patient_contact, patient_history, patient_note

-- patient_consent (Einwilligung — one row per consent type, binary yes/no)
CREATE TABLE patient_consent (
  id              TEXT PRIMARY KEY,
  patient_id      TEXT NOT NULL REFERENCES patient(id) ON DELETE RESTRICT,
  consent_type    TEXT NOT NULL CHECK (consent_type IN (
    'data_usage',          -- Datennutzung
    'data_sharing',        -- Datenweitergabe
    'living_will',         -- Patientenverfuegung
    'contact_agreement',   -- Kontaktvereinbarung
    'billing_submission',  -- Abrechnungsuebermittlung
    'medical_history'      -- Anamnese-Freigabe
  )),
  is_granted      INTEGER NOT NULL DEFAULT 0,  -- 0=no, 1=yes
  granted_at      TEXT,                        -- when consent was given
  revoked_at      TEXT,                        -- when consent was revoked (NULL if still active)
  notes           TEXT,
  created_at      TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
  updated_at      TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
  UNIQUE(patient_id, consent_type)             -- one row per type per patient
);

-- patient_contact (Kontaktperson — emergency/next-of-kin contacts)
CREATE TABLE patient_contact (
  id              TEXT PRIMARY KEY,
  patient_id      TEXT NOT NULL REFERENCES patient(id) ON DELETE CASCADE,
  relationship    TEXT NOT NULL CHECK (relationship IN (
    'spouse',     -- Ehepartner/in
    'parent',     -- Elternteil
    'child',      -- Kind
    'sibling',    -- Geschwister
    'guardian',   -- Vormund/Betreuer
    'other'       -- Sonstige
  )),
  first_name      TEXT NOT NULL,
  last_name       TEXT NOT NULL,
  phone           TEXT,
  mobile          TEXT,
  email           TEXT,
  is_emergency    INTEGER NOT NULL DEFAULT 0,  -- emergency contact flag
  notes           TEXT,
  created_at      TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
  updated_at      TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now'))
);

-- patient_history (Anamnese — past diagnoses, procedures, medications, pregnancy)
CREATE TABLE patient_history (
  id              TEXT PRIMARY KEY,
  patient_id      TEXT NOT NULL REFERENCES patient(id) ON DELETE RESTRICT,
  history_type    TEXT NOT NULL CHECK (history_type IN (
    'past_diagnosis',    -- Frueherer Befund
    'past_procedure',    -- Frueherer Eingriff
    'past_medication',   -- Fruehere Medikation
    'pregnancy'          -- Schwangerschaftshistorie
  )),
  description     TEXT NOT NULL,           -- Free text description
  icd_code        TEXT,                    -- Optional ICD-10 code (for past_diagnosis)
  date_recorded   TEXT,                    -- When it occurred (approximate OK)
  date_resolved   TEXT,                    -- When it resolved (NULL if ongoing)
  details         TEXT,                    -- JSON for structured data, e.g. pregnancy: {"gravida":2,"para":1}
  created_at      TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
  updated_at      TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now'))
);

-- patient_note (Interne Notizen — staff-only reference notes)
CREATE TABLE patient_note (
  id              TEXT PRIMARY KEY,
  patient_id      TEXT NOT NULL REFERENCES patient(id) ON DELETE RESTRICT,
  author_id       TEXT REFERENCES user(id),
  content         TEXT NOT NULL,
  is_pinned       INTEGER NOT NULL DEFAULT 0,  -- pinned notes shown at top of patient profile
  created_at      TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
  updated_at      TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now'))
);

CREATE INDEX idx_patient_consent_patient ON patient_consent(patient_id);
CREATE INDEX idx_patient_contact_patient ON patient_contact(patient_id);
CREATE INDEX idx_patient_history_patient ON patient_history(patient_id);
CREATE INDEX idx_patient_history_type ON patient_history(patient_id, history_type);
CREATE INDEX idx_patient_note_patient ON patient_note(patient_id);
