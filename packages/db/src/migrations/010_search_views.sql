-- Search views for global command palette (denormalized for fuse.js extraction)

-- v_patient_search: one row per active patient with flattened searchable fields
CREATE VIEW v_patient_search AS
SELECT
  p.id,
  p.first_name,
  p.last_name,
  p.first_name || ' ' || p.last_name AS display_name,
  -- Umlaut-expanded variant for fuzzy matching
  REPLACE(REPLACE(REPLACE(REPLACE(
    p.first_name || ' ' || p.last_name,
    'ä', 'ae'), 'ö', 'oe'), 'ü', 'ue'), 'ß', 'ss') AS search_name,
  p.date_of_birth,
  p.egk_versichertennummer AS kvnr,
  p.external_patient_id,
  p.source_system,
  p.phone,
  p.email,
  a.postal_code,
  a.city,
  ip.name AS insurance_name,
  ip.ik_number
FROM patient p
LEFT JOIN address a
  ON a.patient_id = p.id AND a.is_primary = 1
LEFT JOIN patient_insurance pi
  ON pi.patient_id = p.id AND pi.valid_to IS NULL AND pi.is_primary = 1
LEFT JOIN insurance_provider ip
  ON ip.id = pi.insurance_provider_id
WHERE p.is_active = 1;

-- v_medication_search: one row per medication with display name including strength
CREATE VIEW v_medication_search AS
SELECT
  m.id,
  m.name,
  m.name || COALESCE(' ' || m.strength, '') AS display_name,
  m.active_ingredient,
  m.pzn,
  m.dosage_form,
  m.strength
FROM medication m;
