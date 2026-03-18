-- Referral table: bidirectional (incoming + outgoing)

-- referral (Ueberweisung — tracks hospital/external referrals in both directions)
CREATE TABLE referral (
  id                      TEXT PRIMARY KEY,
  patient_id              TEXT NOT NULL REFERENCES patient(id) ON DELETE RESTRICT,
  treatment_case_id       TEXT REFERENCES treatment_case(id),
  direction               TEXT NOT NULL CHECK (direction IN ('incoming','outgoing')),
  -- Source (who is sending)
  from_practice_id        TEXT REFERENCES practice(id),  -- NULL if external
  from_doctor_id          TEXT REFERENCES user(id),      -- NULL if external
  from_external_name      TEXT,                          -- hospital/clinic name if external
  from_external_id        TEXT,                          -- IK or BSNR of external institution
  -- Target (who is receiving)
  to_practice_id          TEXT REFERENCES practice(id),  -- NULL if external
  to_doctor_id            TEXT REFERENCES user(id),      -- NULL if external
  to_external_name        TEXT,
  to_external_id          TEXT,
  -- Clinical
  reason                  TEXT,
  diagnosis_at_referral   TEXT,                          -- ICD code or free text
  specialty               TEXT,                          -- target Fachrichtung
  urgency                 TEXT NOT NULL DEFAULT 'routine'
                          CHECK (urgency IN ('routine','urgent','emergency')),
  status                  TEXT NOT NULL DEFAULT 'pending'
                          CHECK (status IN ('pending','accepted','in_treatment','completed','declined')),
  referred_at             TEXT NOT NULL,
  accepted_at             TEXT,
  completed_at            TEXT,
  notes                   TEXT,
  created_at              TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
  updated_at              TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now'))
);

CREATE INDEX idx_referral_patient ON referral(patient_id);
CREATE INDEX idx_referral_direction ON referral(direction);
CREATE INDEX idx_referral_status ON referral(status);
