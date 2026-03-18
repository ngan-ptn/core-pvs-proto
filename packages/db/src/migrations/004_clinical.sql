-- Clinical tables: treatment_case, encounter, diagnosis, vital_signs

-- treatment_case (Schein / Abrechnungsfall, one per patient per quarter per doctor)
CREATE TABLE treatment_case (
  id                    TEXT PRIMARY KEY,
  patient_id            TEXT NOT NULL REFERENCES patient(id) ON DELETE RESTRICT,
  practice_id           TEXT NOT NULL REFERENCES practice(id),  -- which BSNR this Schein bills under
  doctor_id             TEXT NOT NULL REFERENCES user(id),
  patient_insurance_id  TEXT NOT NULL REFERENCES patient_insurance(id),
  quarter               TEXT NOT NULL,              -- e.g. '2026-Q1'
  schein_type           TEXT NOT NULL CHECK (schein_type IN ('0101','0102','0103','0104')),
  status                TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open','billed','cancelled')),
  opened_at             TEXT NOT NULL,
  closed_at             TEXT,
  created_at            TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
  updated_at            TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now'))
);

-- encounter (Einzelbesuch within a treatment case)
CREATE TABLE encounter (
  id                  TEXT PRIMARY KEY,
  treatment_case_id   TEXT NOT NULL REFERENCES treatment_case(id) ON DELETE RESTRICT,
  practice_id         TEXT NOT NULL REFERENCES practice(id),  -- which location visit occurred at
  doctor_id           TEXT NOT NULL REFERENCES user(id),
  encounter_date      TEXT NOT NULL,                -- ISO 8601 date
  chief_complaint     TEXT,                         -- Hauptbeschwerde
  notes               TEXT,                         -- Befund / clinical notes
  created_at          TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
  updated_at          TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now'))
);

-- diagnosis (ICD-10-GM Diagnosen)
CREATE TABLE diagnosis (
  id                  TEXT PRIMARY KEY,
  treatment_case_id   TEXT NOT NULL REFERENCES treatment_case(id) ON DELETE RESTRICT,
  encounter_id        TEXT REFERENCES encounter(id),  -- nullable: Dauerdiagnosen don't have a specific encounter
  icd_code            TEXT NOT NULL,                -- e.g. 'J06.9'
  icd_display         TEXT,                         -- Human-readable description
  certainty           TEXT NOT NULL CHECK (certainty IN ('V','G','A','Z')),  -- Diagnosensicherheit
  is_permanent        INTEGER NOT NULL DEFAULT 0,   -- Dauerdiagnose
  diagnosed_at        TEXT NOT NULL,
  notes               TEXT,
  created_at          TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
  updated_at          TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now'))
);

-- vital_signs (Vitalzeichen — per-encounter measurements)
CREATE TABLE vital_signs (
  id                  TEXT PRIMARY KEY,
  patient_id          TEXT NOT NULL REFERENCES patient(id) ON DELETE RESTRICT,
  encounter_id        TEXT REFERENCES encounter(id) ON DELETE SET NULL,  -- nullable for standalone measurements
  measured_at         TEXT NOT NULL,                -- ISO 8601 datetime
  height_cm           REAL,                         -- Koerpergroesse
  weight_kg           REAL,                         -- Gewicht
  bmi                 REAL,                         -- Body Mass Index
  systolic_bp         INTEGER,                      -- systolischer Blutdruck (mmHg)
  diastolic_bp        INTEGER,                      -- diastolischer Blutdruck (mmHg)
  heart_rate          INTEGER,                      -- Herzfrequenz (bpm)
  temperature_c       REAL,                         -- Koerpertemperatur (°C)
  respiratory_rate    INTEGER,                      -- Atemfrequenz (breaths/min)
  oxygen_saturation   INTEGER,                      -- SpO2 (%)
  notes               TEXT,
  measured_by         TEXT REFERENCES user(id),
  created_at          TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
  updated_at          TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now'))
);

CREATE INDEX idx_treatment_case_patient ON treatment_case(patient_id);
CREATE INDEX idx_treatment_case_practice ON treatment_case(practice_id);
CREATE INDEX idx_treatment_case_doctor ON treatment_case(doctor_id);
CREATE INDEX idx_encounter_case ON encounter(treatment_case_id);
CREATE INDEX idx_encounter_practice ON encounter(practice_id);
CREATE INDEX idx_diagnosis_case ON diagnosis(treatment_case_id);
CREATE INDEX idx_diagnosis_encounter ON diagnosis(encounter_id);
CREATE INDEX idx_vital_signs_patient ON vital_signs(patient_id);
CREATE INDEX idx_vital_signs_encounter ON vital_signs(encounter_id);
