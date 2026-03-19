-- Encounter extension tables (Phase 2 skeletons — defined now, not seeded)

-- encounter_service (Leistungen/GOP — Phase 2 billing)
CREATE TABLE encounter_service (
  id              TEXT PRIMARY KEY,
  encounter_id    TEXT NOT NULL REFERENCES encounter(id) ON DELETE RESTRICT,
  gop_code        TEXT NOT NULL,                    -- Gebuehrenordnungsposition
  description     TEXT,
  quantity        INTEGER NOT NULL DEFAULT 1,
  status          TEXT NOT NULL DEFAULT 'documented'
                  CHECK (status IN ('documented','billed','cancelled')),
  performed_by    TEXT REFERENCES user(id),
  performed_at    TEXT,
  created_at      TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
  updated_at      TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now'))
);

-- encounter_note (structured clinical notes — supports SOAP and free text)
CREATE TABLE encounter_note (
  id              TEXT PRIMARY KEY,
  encounter_id    TEXT NOT NULL REFERENCES encounter(id) ON DELETE RESTRICT,
  note_type       TEXT NOT NULL CHECK (note_type IN (
    'soap_s',       -- Subjective
    'soap_o',       -- Objective
    'soap_a',       -- Assessment
    'soap_p',       -- Plan
    'free_text',    -- Freitext
    'clinical'      -- Klinische Notiz
  )),
  content         TEXT NOT NULL,
  author_id       TEXT REFERENCES user(id),
  created_at      TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
  updated_at      TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now'))
);

CREATE INDEX idx_encounter_service_encounter ON encounter_service(encounter_id);
CREATE INDEX idx_encounter_note_encounter ON encounter_note(encounter_id);
