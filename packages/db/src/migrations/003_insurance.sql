-- Insurance tables: insurance_provider, patient_insurance

-- insurance_provider (Krankenkassen-Katalog)
CREATE TABLE insurance_provider (
  id              TEXT PRIMARY KEY,
  ik_number       TEXT NOT NULL UNIQUE,             -- Institutionskennzeichen
  name            TEXT NOT NULL,
  short_name      TEXT,
  insurance_type  TEXT NOT NULL CHECK (insurance_type IN ('GKV','PKV','BG','SZ')),  -- Kassenart
  is_active       INTEGER NOT NULL DEFAULT 1,
  successor_id    TEXT REFERENCES insurance_provider(id),  -- Kassenfusion target
  created_at      TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
  updated_at      TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now'))
);

-- patient_insurance (Versicherungsverhaeltnis)
CREATE TABLE patient_insurance (
  id                    TEXT PRIMARY KEY,
  patient_id            TEXT NOT NULL REFERENCES patient(id) ON DELETE RESTRICT,
  insurance_provider_id TEXT NOT NULL REFERENCES insurance_provider(id),
  vknr                  TEXT,                       -- Versichertenkarten-Nr
  insurance_status      TEXT CHECK (insurance_status IN ('1','3','5')),  -- 1=Mitglied, 3=Familie, 5=Rentner
  valid_from            TEXT,
  valid_to              TEXT,                       -- NULL = still active
  is_primary            INTEGER NOT NULL DEFAULT 1,
  created_at            TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
  updated_at            TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now'))
);

CREATE INDEX idx_patient_insurance_patient ON patient_insurance(patient_id);
CREATE INDEX idx_patient_insurance_provider ON patient_insurance(insurance_provider_id);
