-- Foundation tables: organization, practice, user, user_practice, patient, address

-- organization (Klinikkette / Praxisgruppe — parent entity for clinic chain)
CREATE TABLE organization (
  id              TEXT PRIMARY KEY,
  name            TEXT NOT NULL,
  short_name      TEXT,
  contact_email   TEXT,
  contact_phone   TEXT,
  created_at      TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
  updated_at      TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now'))
);

-- practice (Praxis/MVZ — individual clinic location)
CREATE TABLE practice (
  id              TEXT PRIMARY KEY,
  organization_id TEXT NOT NULL REFERENCES organization(id) ON DELETE RESTRICT,
  name            TEXT NOT NULL,
  bsnr            TEXT NOT NULL UNIQUE,             -- Betriebsstaettennummer, 9-digit
  street          TEXT,
  postal_code     TEXT,                             -- PLZ
  city            TEXT,
  phone           TEXT,
  email           TEXT,
  is_active       INTEGER NOT NULL DEFAULT 1,
  created_at      TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
  updated_at      TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now'))
);

-- user (Benutzer: doctors with specialty/LANR, MFAs)
CREATE TABLE user (
  id              TEXT PRIMARY KEY,
  user_type       TEXT NOT NULL CHECK (user_type IN ('doctor','mfa')),
  first_name      TEXT NOT NULL,
  last_name       TEXT NOT NULL,
  lanr            TEXT,                             -- Lebenslange Arztnummer, 9-digit, doctors only
  specialty       TEXT,                             -- Fachrichtung, doctors only (free text)
  email           TEXT,
  is_active       INTEGER NOT NULL DEFAULT 1,
  created_at      TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
  updated_at      TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now'))
);

-- user_practice (M:N junction — role is per practice, not global)
CREATE TABLE user_practice (
  id              TEXT PRIMARY KEY,
  user_id         TEXT NOT NULL REFERENCES user(id) ON DELETE CASCADE,
  practice_id     TEXT NOT NULL REFERENCES practice(id) ON DELETE CASCADE,
  role            TEXT NOT NULL CHECK (role IN ('admin','billing','view_only','standard')),
  is_primary      INTEGER NOT NULL DEFAULT 0,
  created_at      TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
  updated_at      TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
  UNIQUE(user_id, practice_id)
);

-- patient (Stammdaten — with external system references)
CREATE TABLE patient (
  id                      TEXT PRIMARY KEY,
  egk_versichertennummer  TEXT,                     -- KVNR from eGK, 10-char
  external_patient_id     TEXT,                     -- Reference ID from hospital HIS
  source_system           TEXT NOT NULL DEFAULT 'pvs'
                          CHECK (source_system IN ('pvs','hospital_his','referral','migration')),
  salutation              TEXT CHECK (salutation IN ('herr','frau','divers','kind')),  -- Anrede
  title                   TEXT,                     -- Dr., Prof., etc.
  first_name              TEXT NOT NULL,
  last_name               TEXT NOT NULL,
  birth_name              TEXT,                     -- Geburtsname
  date_of_birth           TEXT NOT NULL,            -- ISO 8601
  gender                  TEXT CHECK (gender IN ('M','W','D','X')),
  phone                   TEXT,
  mobile                  TEXT,
  email                   TEXT,
  employer_name           TEXT,                     -- Arbeitgeber
  employer_address        TEXT,
  blood_type              TEXT CHECK (blood_type IN ('A+','A-','B+','B-','AB+','AB-','0+','0-')),  -- Blutgruppe
  allergies               TEXT,                     -- JSON array, e.g. '["Penicillin","Latex"]'
  notes                   TEXT,
  is_active               INTEGER NOT NULL DEFAULT 1,
  created_at              TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
  updated_at              TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now'))
);

-- address (Adresse — multiple per patient: home, billing, additional)
CREATE TABLE address (
  id              TEXT PRIMARY KEY,
  patient_id      TEXT NOT NULL REFERENCES patient(id) ON DELETE CASCADE,
  address_type    TEXT NOT NULL DEFAULT 'home'
                  CHECK (address_type IN ('home','billing','additional')),
  label           TEXT,                             -- Optional label, e.g. "Ferienhaus", "Eltern"
  street          TEXT,
  house_number    TEXT,
  postal_code     TEXT,                             -- PLZ
  city            TEXT,
  country_code    TEXT NOT NULL DEFAULT 'DE',       -- ISO 3166-1 alpha-2
  is_primary      INTEGER NOT NULL DEFAULT 1,
  created_at      TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
  updated_at      TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now'))
);

CREATE INDEX idx_practice_org ON practice(organization_id);
CREATE INDEX idx_user_practice_user ON user_practice(user_id);
CREATE INDEX idx_user_practice_practice ON user_practice(practice_id);
CREATE INDEX idx_patient_external ON patient(external_patient_id);
CREATE INDEX idx_patient_source ON patient(source_system);
CREATE INDEX idx_address_patient ON address(patient_id);
