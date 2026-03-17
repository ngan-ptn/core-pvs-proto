-- Audit log and patient timeline view

-- audit_log (lightweight change tracking with practice_id for per-location compliance)
CREATE TABLE audit_log (
  id          TEXT PRIMARY KEY,
  entity_type TEXT NOT NULL,                        -- 'patient', 'treatment_case', etc.
  entity_id   TEXT NOT NULL,
  action      TEXT NOT NULL CHECK (action IN ('create','update','delete')),
  actor_id    TEXT REFERENCES user(id),
  practice_id TEXT REFERENCES practice(id),         -- per-location audit compliance
  changes     TEXT,                                 -- JSON diff
  created_at  TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now'))
  -- no updated_at: audit entries are immutable
);

CREATE INDEX idx_audit_entity ON audit_log(entity_type, entity_id);
CREATE INDEX idx_audit_practice ON audit_log(practice_id);

-- patient_timeline (aggregated view for treatment history display)
CREATE VIEW patient_timeline AS
  SELECT e.id, tc.patient_id, 'encounter' AS event_type,
         e.encounter_date AS occurred_at, e.chief_complaint AS summary,
         e.doctor_id AS actor_id, e.treatment_case_id
  FROM encounter e JOIN treatment_case tc ON e.treatment_case_id = tc.id
UNION ALL
  SELECT d.id, tc.patient_id, 'diagnosis',
         d.diagnosed_at, d.icd_code || ' – ' || COALESCE(d.icd_display, ''),
         NULL, d.treatment_case_id
  FROM diagnosis d JOIN treatment_case tc ON d.treatment_case_id = tc.id
UNION ALL
  SELECT p.id, tc.patient_id, 'prescription',
         p.prescribed_at, p.medication_name,
         p.doctor_id, p.treatment_case_id
  FROM prescription p JOIN treatment_case tc ON p.treatment_case_id = tc.id
UNION ALL
  SELECT l.id, tc.patient_id, 'lab',
         l.ordered_at, l.description,
         l.doctor_id, l.treatment_case_id
  FROM lab_order l JOIN treatment_case tc ON l.treatment_case_id = tc.id
UNION ALL
  SELECT i.id, tc.patient_id, 'imaging',
         i.ordered_at, i.description,
         i.doctor_id, i.treatment_case_id
  FROM imaging_order i JOIN treatment_case tc ON i.treatment_case_id = tc.id
UNION ALL
  SELECT doc.id, doc.patient_id, 'document',
         doc.generated_at, doc.title,
         doc.generated_by, doc.treatment_case_id
  FROM document doc
UNION ALL
  SELECT vs.id, vs.patient_id, 'vitals',
         vs.measured_at,
         'BP ' || vs.systolic_bp || '/' || vs.diastolic_bp
           || COALESCE(' HR ' || vs.heart_rate, '')
           || COALESCE(' T ' || vs.temperature_c || '°C', ''),
         vs.measured_by, NULL
  FROM vital_signs vs
UNION ALL
  SELECT r.id, r.patient_id, 'referral',
         r.referred_at,
         CASE r.direction
           WHEN 'incoming' THEN 'Referral from ' || COALESCE(r.from_external_name, 'internal')
           WHEN 'outgoing' THEN 'Referral to ' || COALESCE(r.to_external_name, 'internal')
         END || COALESCE(': ' || r.reason, ''),
         NULL, r.treatment_case_id
  FROM referral r;
