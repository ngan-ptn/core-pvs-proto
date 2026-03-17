import { mkdirSync } from 'node:fs'
import { resolve } from 'node:path'
import { openDatabase } from './connection.js'
import { runMigrations } from './migrations/run.js'

// Ensure data directory exists
const dataDir = resolve(import.meta.dirname, '../../data')
mkdirSync(dataDir, { recursive: true })

const db = openDatabase()
runMigrations(db)

// ─── Helpers ────────────────────────────────────────────────────────

function now() {
  return new Date().toISOString()
}

function pastDate(daysAgo: number) {
  const d = new Date()
  d.setDate(d.getDate() - daysAgo)
  return d.toISOString().split('T')[0]
}

function quarter(daysAgo: number) {
  const d = new Date()
  d.setDate(d.getDate() - daysAgo)
  const q = Math.ceil((d.getMonth() + 1) / 3)
  return `${d.getFullYear()}-Q${q}`
}

// ─── Seed data ──────────────────────────────────────────────────────

const seed = db.transaction(() => {
  // Organization
  db.prepare(`INSERT INTO organization (id, name, short_name, contact_email, contact_phone) VALUES (?, ?, ?, ?, ?)`).run(
    'org-001', 'Gesundheitszentrum Rhein-Main GmbH', 'GZ Rhein-Main', 'info@gz-rheinmain.de', '+49 69 12345678',
  )

  // Practices
  const practices = [
    ['prc-001', 'org-001', 'MVZ Musterstadt Zentrum', '123456701', 'Hauptstr. 1', '60311', 'Frankfurt', '+49 69 11111111', 'zentrum@gz-rheinmain.de'],
    ['prc-002', 'org-001', 'MVZ Musterstadt Süd', '123456702', 'Südring 45', '60599', 'Frankfurt', '+49 69 22222222', 'sued@gz-rheinmain.de'],
    ['prc-003', 'org-001', 'MVZ Musterstadt Nord', '123456703', 'Nordallee 12', '60435', 'Frankfurt', '+49 69 33333333', 'nord@gz-rheinmain.de'],
  ] as const
  const insertPractice = db.prepare(`INSERT INTO practice (id, organization_id, name, bsnr, street, postal_code, city, phone, email) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`)
  for (const p of practices) insertPractice.run(...p)

  // Users
  const users = [
    ['usr-001', 'doctor', 'Thomas', 'Müller', '123456789', 'allgemeinmedizin', 'mueller@gz-rheinmain.de'],
    ['usr-002', 'doctor', 'Sarah', 'Weber', '234567890', 'innere_medizin', 'weber@gz-rheinmain.de'],
    ['usr-003', 'doctor', 'Klaus', 'Hoffmann', '345678901', 'orthopaedie', 'hoffmann@gz-rheinmain.de'],
    ['usr-004', 'mfa', 'Lisa', 'Schmidt', null, null, 'schmidt@gz-rheinmain.de'],
    ['usr-005', 'mfa', 'Maria', 'Fischer', null, null, 'fischer@gz-rheinmain.de'],
    ['usr-006', 'mfa', 'Anna', 'Braun', null, null, 'braun@gz-rheinmain.de'],
    ['usr-007', 'mfa', 'Jan', 'Becker', null, null, 'becker@gz-rheinmain.de'],
  ] as const
  const insertUser = db.prepare(`INSERT INTO user (id, user_type, first_name, last_name, lanr, specialty, email) VALUES (?, ?, ?, ?, ?, ?, ?)`)
  for (const u of users) insertUser.run(...u)

  // User-Practice assignments (M:N with role per practice)
  const userPractices = [
    ['up-001', 'usr-001', 'prc-001', 'admin', 1],     // Dr. Müller: admin at Zentrum (primary)
    ['up-002', 'usr-001', 'prc-003', 'standard', 0],   // Dr. Müller: standard at Nord
    ['up-003', 'usr-002', 'prc-001', 'standard', 1],   // Dr. Weber: standard at Zentrum
    ['up-004', 'usr-003', 'prc-002', 'standard', 1],   // Dr. Hoffmann: standard at Süd (primary)
    ['up-005', 'usr-003', 'prc-003', 'standard', 0],   // Dr. Hoffmann: standard at Nord
    ['up-006', 'usr-004', 'prc-001', 'standard', 1],   // Lisa: Zentrum
    ['up-007', 'usr-005', 'prc-002', 'billing', 1],    // Maria: Süd (billing)
    ['up-008', 'usr-006', 'prc-003', 'standard', 1],   // Anna: Nord
    ['up-009', 'usr-007', 'prc-001', 'view_only', 1],  // Jan: Zentrum (view only)
  ] as const
  const insertUP = db.prepare(`INSERT INTO user_practice (id, user_id, practice_id, role, is_primary) VALUES (?, ?, ?, ?, ?)`)
  for (const up of userPractices) insertUP.run(...up)

  // Insurance providers (8 GKV + 2 PKV)
  const insurers = [
    ['ins-001', '100000001', 'Techniker Krankenkasse', 'TK', 'GKV'],
    ['ins-002', '100000002', 'AOK Bayern', 'AOK BY', 'GKV'],
    ['ins-003', '100000003', 'Barmer', 'Barmer', 'GKV'],
    ['ins-004', '100000004', 'DAK-Gesundheit', 'DAK', 'GKV'],
    ['ins-005', '100000005', 'IKK classic', 'IKK', 'GKV'],
    ['ins-006', '100000006', 'AOK Nordost', 'AOK NO', 'GKV'],
    ['ins-007', '100000007', 'HEK', 'HEK', 'GKV'],
    ['ins-008', '100000008', 'KKH', 'KKH', 'GKV'],
    ['ins-009', '100000009', 'Debeka', 'Debeka', 'PKV'],
    ['ins-010', '100000010', 'Allianz Private', 'Allianz', 'PKV'],
  ] as const
  const insertInsurer = db.prepare(`INSERT INTO insurance_provider (id, ik_number, name, short_name, insurance_type) VALUES (?, ?, ?, ?, ?)`)
  for (const i of insurers) insertInsurer.run(...i)

  // Medications (~20)
  const meds = [
    ['med-001', '01234501', 'Ibuprofen', 'Ibuprofen', 'Filmtablette', '400mg'],
    ['med-002', '01234502', 'Metformin', 'Metformin', 'Filmtablette', '500mg'],
    ['med-003', '01234503', 'Ramipril', 'Ramipril', 'Tablette', '5mg'],
    ['med-004', '01234504', 'Amoxicillin', 'Amoxicillin', 'Filmtablette', '1000mg'],
    ['med-005', '01234505', 'Pantoprazol', 'Pantoprazol', 'Tablette', '40mg'],
    ['med-006', '01234506', 'L-Thyroxin', 'Levothyroxin', 'Tablette', '75µg'],
    ['med-007', '01234507', 'Metoprolol', 'Metoprolol', 'Retardtablette', '47.5mg'],
    ['med-008', '01234508', 'Simvastatin', 'Simvastatin', 'Filmtablette', '20mg'],
    ['med-009', '01234509', 'ASS', 'Acetylsalicylsäure', 'Tablette', '100mg'],
    ['med-010', '01234510', 'Diclofenac', 'Diclofenac', 'Filmtablette', '75mg'],
    ['med-011', '01234511', 'Omeprazol', 'Omeprazol', 'Kapsel', '20mg'],
    ['med-012', '01234512', 'Bisoprolol', 'Bisoprolol', 'Filmtablette', '5mg'],
    ['med-013', '01234513', 'Torasemid', 'Torasemid', 'Tablette', '10mg'],
    ['med-014', '01234514', 'Prednisolon', 'Prednisolon', 'Tablette', '5mg'],
    ['med-015', '01234515', 'Cetirizin', 'Cetirizin', 'Filmtablette', '10mg'],
    ['med-016', '01234516', 'Salbutamol', 'Salbutamol', 'Dosieraerosol', '100µg'],
    ['med-017', '01234517', 'Novaminsulfon', 'Metamizol', 'Tropfen', '500mg/ml'],
    ['med-018', '01234518', 'Tamsulosin', 'Tamsulosin', 'Retardkapsel', '0.4mg'],
    ['med-019', '01234519', 'Clopidogrel', 'Clopidogrel', 'Filmtablette', '75mg'],
    ['med-020', '01234520', 'Vitamin D3', 'Colecalciferol', 'Tablette', '1000IE'],
  ] as const
  const insertMed = db.prepare(`INSERT INTO medication (id, pzn, name, active_ingredient, dosage_form, strength) VALUES (?, ?, ?, ?, ?, ?)`)
  for (const m of meds) insertMed.run(...m)

  // Patients (25)
  const patientData = [
    { id: 'pat-001', kvnr: 'A100000001', src: 'pvs', sal: 'herr', fn: 'Max', ln: 'Müller', dob: '1985-03-14', g: 'M', phone: '+49 170 1111111', blood: 'A+', allergies: '["Penicillin"]' },
    { id: 'pat-002', kvnr: 'A100000002', src: 'pvs', sal: 'frau', fn: 'Anna', ln: 'Schmidt', dob: '1990-07-22', g: 'W', phone: '+49 170 2222222', blood: 'B+', allergies: null },
    { id: 'pat-003', kvnr: 'A100000003', src: 'pvs', sal: 'herr', fn: 'Peter', ln: 'Schneider', dob: '1958-11-03', g: 'M', phone: '+49 170 3333333', blood: '0+', allergies: '["Latex","Jod"]' },
    { id: 'pat-004', kvnr: 'A100000004', src: 'pvs', sal: 'frau', fn: 'Maria', ln: 'Fischer', dob: '1972-01-18', g: 'W', phone: '+49 170 4444444', blood: null, allergies: null },
    { id: 'pat-005', kvnr: 'A100000005', src: 'hospital_his', sal: 'herr', fn: 'Klaus', ln: 'Weber', dob: '1965-09-30', g: 'M', phone: '+49 170 5555555', blood: 'AB-', allergies: '["ASS"]', extId: 'HIS-2024-0815' },
    { id: 'pat-006', kvnr: 'A100000006', src: 'pvs', sal: 'frau', fn: 'Sabine', ln: 'Meyer', dob: '1948-05-12', g: 'W', phone: '+49 170 6666666', blood: 'A-', allergies: null },
    { id: 'pat-007', kvnr: 'A100000007', src: 'referral', sal: 'herr', fn: 'Thomas', ln: 'Wagner', dob: '1995-12-01', g: 'M', phone: '+49 170 7777777', blood: null, allergies: null, extId: 'REF-2025-001' },
    { id: 'pat-008', kvnr: 'A100000008', src: 'pvs', sal: 'frau', fn: 'Claudia', ln: 'Becker', dob: '1980-04-25', g: 'W', phone: '+49 170 8888888', blood: 'B-', allergies: null },
    { id: 'pat-009', kvnr: 'A100000009', src: 'hospital_his', sal: 'herr', fn: 'Heinrich', ln: 'Schulz', dob: '1942-08-07', g: 'M', phone: '+49 170 9999999', blood: '0-', allergies: '["Kontrastmittel"]', extId: 'HIS-2024-1023' },
    { id: 'pat-010', kvnr: 'A100000010', src: 'pvs', sal: 'frau', fn: 'Erika', ln: 'Hoffmann', dob: '1975-06-19', g: 'W', phone: '+49 171 1111111', blood: null, allergies: null },
    { id: 'pat-011', kvnr: 'A100000011', src: 'pvs', sal: 'herr', fn: 'Wolfgang', ln: 'Schäfer', dob: '1960-02-14', g: 'M', phone: '+49 171 2222222', blood: 'A+', allergies: null },
    { id: 'pat-012', kvnr: 'A100000012', src: 'pvs', sal: 'kind', fn: 'Lena', ln: 'Koch', dob: '2018-10-05', g: 'W', phone: '+49 171 3333333', blood: null, allergies: null },
    { id: 'pat-013', kvnr: 'A100000013', src: 'referral', sal: 'herr', fn: 'Jürgen', ln: 'Bauer', dob: '1970-03-28', g: 'M', phone: '+49 171 4444444', blood: null, allergies: null, extId: 'REF-2025-002' },
    { id: 'pat-014', kvnr: 'A100000014', src: 'pvs', sal: 'frau', fn: 'Monika', ln: 'Richter', dob: '1988-09-15', g: 'W', phone: '+49 171 5555555', blood: 'AB+', allergies: null },
    { id: 'pat-015', kvnr: 'A100000015', src: 'hospital_his', sal: 'herr', fn: 'Dieter', ln: 'Klein', dob: '1955-12-20', g: 'M', phone: '+49 171 6666666', blood: null, allergies: null, extId: 'HIS-2025-0102' },
    { id: 'pat-016', kvnr: 'A100000016', src: 'pvs', sal: 'frau', fn: 'Ingrid', ln: 'Wolf', dob: '1945-07-04', g: 'W', phone: '+49 171 7777777', blood: '0+', allergies: null },
    { id: 'pat-017', kvnr: 'A100000017', src: 'pvs', sal: 'herr', fn: 'Stefan', ln: 'Neumann', dob: '1992-11-11', g: 'M', phone: '+49 171 8888888', blood: null, allergies: null },
    { id: 'pat-018', kvnr: 'A100000018', src: 'pvs', sal: 'frau', fn: 'Petra', ln: 'Schwarz', dob: '1968-01-30', g: 'W', phone: '+49 171 9999999', blood: null, allergies: null },
    { id: 'pat-019', kvnr: 'A100000019', src: 'referral', sal: 'herr', fn: 'Markus', ln: 'Zimmermann', dob: '1983-05-22', g: 'M', phone: '+49 172 1111111', blood: null, allergies: null, extId: 'REF-2025-003' },
    { id: 'pat-020', kvnr: 'A100000020', src: 'pvs', sal: 'frau', fn: 'Brigitte', ln: 'Braun', dob: '1950-08-16', g: 'W', phone: '+49 172 2222222', blood: null, allergies: null },
    { id: 'pat-021', kvnr: 'A100000021', src: 'hospital_his', sal: 'herr', fn: 'Ralf', ln: 'Hartmann', dob: '1978-04-09', g: 'M', phone: '+49 172 3333333', blood: null, allergies: null, extId: 'HIS-2025-0203' },
    { id: 'pat-022', kvnr: 'A100000022', src: 'pvs', sal: 'frau', fn: 'Susanne', ln: 'Lange', dob: '1997-02-28', g: 'W', phone: '+49 172 4444444', blood: null, allergies: null },
    // 3 PKV patients
    { id: 'pat-023', kvnr: null, src: 'pvs', sal: 'herr', fn: 'Friedrich', ln: 'Werner', dob: '1962-10-12', g: 'M', phone: '+49 172 5555555', blood: 'B+', allergies: null, pkv: true },
    { id: 'pat-024', kvnr: null, src: 'hospital_his', sal: 'frau', fn: 'Katharina', ln: 'Krüger', dob: '1986-06-03', g: 'W', phone: '+49 172 6666666', blood: null, allergies: null, pkv: true, extId: 'HIS-2025-0305' },
    { id: 'pat-025', kvnr: null, src: 'pvs', sal: 'herr', fn: 'Alexander', ln: 'König', dob: '1974-08-21', g: 'M', phone: '+49 172 7777777', blood: null, allergies: null, pkv: true },
  ]
  const insertPatient = db.prepare(`INSERT INTO patient (id, egk_versichertennummer, external_patient_id, source_system, salutation, first_name, last_name, date_of_birth, gender, phone, blood_type, allergies) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`)
  for (const p of patientData) {
    insertPatient.run(p.id, p.kvnr, (p as any).extId ?? null, p.src, p.sal, p.fn, p.ln, p.dob, p.g, p.phone, p.blood, p.allergies)
  }

  // Addresses (1-2 per patient, at least home)
  const insertAddress = db.prepare(`INSERT INTO address (id, patient_id, address_type, street, house_number, postal_code, city, is_primary) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`)
  const streets = ['Hauptstr.', 'Berliner Str.', 'Gartenweg', 'Schillerstr.', 'Mozartstr.', 'Bahnhofstr.', 'Ringstr.', 'Waldweg', 'Kirchstr.', 'Rosenstr.']
  for (let i = 0; i < patientData.length; i++) {
    const pid = patientData[i].id
    const num = String(i + 1)
    insertAddress.run(`adr-${num.padStart(3, '0')}-h`, pid, 'home', streets[i % streets.length], String((i + 1) * 3), `6${String(i).padStart(4, '0')}`, 'Frankfurt', 1)
    // ~10 patients get a billing address
    if (i < 10) {
      insertAddress.run(`adr-${num.padStart(3, '0')}-b`, pid, 'billing', 'Postfach ' + (100 + i), null, `6${String(i).padStart(4, '0')}`, 'Frankfurt', 0)
    }
  }

  // Patient insurance (each patient gets one; PKV patients get PKV insurer)
  const insertPI = db.prepare(`INSERT INTO patient_insurance (id, patient_id, insurance_provider_id, vknr, insurance_status, valid_from, is_primary) VALUES (?, ?, ?, ?, ?, ?, ?)`)
  for (let i = 0; i < patientData.length; i++) {
    const p = patientData[i]
    const isPKV = (p as any).pkv
    const insurerId = isPKV ? (i % 2 === 0 ? 'ins-009' : 'ins-010') : `ins-${String((i % 8) + 1).padStart(3, '0')}`
    const status = isPKV ? null : (['1', '1', '1', '3', '5'] as const)[i % 5]
    insertPI.run(`pi-${String(i + 1).padStart(3, '0')}`, p.id, insurerId, p.kvnr ? `V${p.kvnr.slice(1)}` : null, status, '2024-01-01', 1)
  }

  // Patient consents (6 types per patient)
  const consentTypes = ['data_usage', 'data_sharing', 'living_will', 'contact_agreement', 'billing_submission', 'medical_history'] as const
  const insertConsent = db.prepare(`INSERT INTO patient_consent (id, patient_id, consent_type, is_granted, granted_at, revoked_at) VALUES (?, ?, ?, ?, ?, ?)`)
  let consentIdx = 0
  for (const p of patientData) {
    for (const ct of consentTypes) {
      consentIdx++
      const granted = consentIdx % 7 !== 0 ? 1 : 0 // most granted, some revoked
      const revokedAt = granted === 0 ? pastDate(30) : null
      insertConsent.run(`con-${String(consentIdx).padStart(3, '0')}`, p.id, ct, granted, granted ? pastDate(180) : null, revokedAt)
    }
  }

  // Patient contacts (~15 patients get 1-2 contacts)
  const insertContact = db.prepare(`INSERT INTO patient_contact (id, patient_id, relationship, first_name, last_name, phone, is_emergency) VALUES (?, ?, ?, ?, ?, ?, ?)`)
  const contactData = [
    ['pct-001', 'pat-001', 'spouse', 'Petra', 'Müller', '+49 170 1111112', 1],
    ['pct-002', 'pat-002', 'parent', 'Hans', 'Schmidt', '+49 170 2222223', 1],
    ['pct-003', 'pat-003', 'child', 'Michael', 'Schneider', '+49 170 3333334', 1],
    ['pct-004', 'pat-003', 'spouse', 'Helga', 'Schneider', '+49 170 3333335', 0],
    ['pct-005', 'pat-004', 'spouse', 'Karl', 'Fischer', '+49 170 4444445', 1],
    ['pct-006', 'pat-005', 'sibling', 'Bernd', 'Weber', '+49 170 5555556', 1],
    ['pct-007', 'pat-006', 'child', 'Frank', 'Meyer', '+49 170 6666667', 1],
    ['pct-008', 'pat-008', 'parent', 'Renate', 'Becker', '+49 170 8888889', 1],
    ['pct-009', 'pat-009', 'spouse', 'Gerda', 'Schulz', '+49 170 9999990', 1],
    ['pct-010', 'pat-010', 'guardian', 'Robert', 'Hoffmann', '+49 171 1111112', 0],
    ['pct-011', 'pat-012', 'parent', 'Sandra', 'Koch', '+49 171 3333334', 1],
    ['pct-012', 'pat-012', 'parent', 'Martin', 'Koch', '+49 171 3333335', 1],
    ['pct-013', 'pat-014', 'spouse', 'Lars', 'Richter', '+49 171 5555556', 1],
    ['pct-014', 'pat-016', 'child', 'Ute', 'Wolf', '+49 171 7777778', 1],
    ['pct-015', 'pat-020', 'child', 'Andrea', 'Braun', '+49 172 2222223', 1],
  ] as const
  for (const c of contactData) insertContact.run(...c)

  // Patient history (~10 patients)
  const insertHistory = db.prepare(`INSERT INTO patient_history (id, patient_id, history_type, description, icd_code, date_recorded, date_resolved, details) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`)
  const historyData: [string, string, string, string, string | null, string, string | null, string | null][] = [
    ['ph-001', 'pat-001', 'past_procedure', 'Appendektomie', null, '2010-05-15', '2010-06-01', null],
    ['ph-002', 'pat-003', 'past_diagnosis', 'Myokardinfarkt', 'I21.9', '2019-11-20', '2020-02-15', null],
    ['ph-003', 'pat-003', 'past_procedure', 'Koronarstent', null, '2019-11-21', '2019-12-15', null],
    ['ph-004', 'pat-005', 'past_medication', 'Langzeit-Antibiotikatherapie', null, '2023-03-01', '2023-06-30', null],
    ['ph-005', 'pat-006', 'past_procedure', 'Hüft-TEP links', null, '2021-09-10', '2021-12-01', null],
    ['ph-006', 'pat-008', 'pregnancy', 'Erste Schwangerschaft', null, '2015-01-15', '2015-09-20', '{"gravida":1,"para":1}'],
    ['ph-007', 'pat-008', 'pregnancy', 'Zweite Schwangerschaft', null, '2018-03-10', '2018-11-05', '{"gravida":2,"para":2}'],
    ['ph-008', 'pat-009', 'past_diagnosis', 'Prostatakarzinom', 'C61', '2020-06-01', null, null],
    ['ph-009', 'pat-010', 'pregnancy', 'Erste Schwangerschaft, Fehlgeburt', null, '2012-04-01', '2012-07-15', '{"gravida":1,"para":0}'],
    ['ph-010', 'pat-011', 'past_procedure', 'Knie-TEP rechts', null, '2022-03-15', '2022-06-01', null],
    ['ph-011', 'pat-014', 'past_diagnosis', 'Tonsillektomie im Kindesalter', null, '2000-01-01', '2000-02-01', null],
    ['ph-012', 'pat-015', 'past_medication', 'Chemotherapie (Kolonkarzinom)', null, '2023-01-15', '2023-08-30', null],
  ]
  for (const h of historyData) insertHistory.run(...h)

  // Patient notes (~8 patients)
  const insertNote = db.prepare(`INSERT INTO patient_note (id, patient_id, author_id, content, is_pinned) VALUES (?, ?, ?, ?, ?)`)
  const noteData: [string, string, string, string, number][] = [
    ['pn-001', 'pat-001', 'usr-004', 'Patient bevorzugt Vormittagstermine', 1],
    ['pn-002', 'pat-003', 'usr-001', 'Herzpatient — immer Blutdruck kontrollieren', 1],
    ['pn-003', 'pat-003', 'usr-004', 'Hört schlecht auf dem linken Ohr', 0],
    ['pn-004', 'pat-005', 'usr-002', 'Überweisung vom Uniklinikum Frankfurt — Nachsorge beachten', 1],
    ['pn-005', 'pat-009', 'usr-001', 'Palliativpatient — Schmerztherapie Priorität', 1],
    ['pn-006', 'pat-012', 'usr-004', 'Kind — Eltern bei Behandlung dabei', 0],
    ['pn-007', 'pat-016', 'usr-006', 'Sturzgefahr — Rollator nutzen', 1],
    ['pn-008', 'pat-020', 'usr-005', 'Schwerhörig — laut und deutlich sprechen', 0],
    ['pn-009', 'pat-001', 'usr-001', 'Penicillin-Allergie bestätigt', 1],
    ['pn-010', 'pat-006', 'usr-003', 'Hüft-TEP links 2021 — Belastung eingeschränkt', 0],
    ['pn-011', 'pat-014', 'usr-002', 'Kinderwunschbehandlung geplant', 0],
    ['pn-012', 'pat-022', 'usr-004', 'Flexible Terminwünsche — kann kurzfristig kommen', 0],
  ]
  for (const n of noteData) insertNote.run(...n)

  // Treatment cases (15 patients, spanning 2025-Q4 through 2026-Q1)
  const insertTC = db.prepare(`INSERT INTO treatment_case (id, patient_id, practice_id, doctor_id, patient_insurance_id, quarter, schein_type, status, opened_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`)
  const tcData: [string, string, string, string, string, string, string, string, string][] = [
    ['tc-001', 'pat-001', 'prc-001', 'usr-001', 'pi-001', '2026-Q1', '0101', 'open', pastDate(30)],
    ['tc-002', 'pat-002', 'prc-001', 'usr-002', 'pi-002', '2026-Q1', '0101', 'open', pastDate(25)],
    ['tc-003', 'pat-003', 'prc-001', 'usr-001', 'pi-003', '2026-Q1', '0101', 'open', pastDate(20)],
    ['tc-004', 'pat-004', 'prc-002', 'usr-003', 'pi-004', '2026-Q1', '0101', 'open', pastDate(18)],
    ['tc-005', 'pat-005', 'prc-001', 'usr-002', 'pi-005', '2026-Q1', '0102', 'open', pastDate(15)],
    ['tc-006', 'pat-006', 'prc-002', 'usr-003', 'pi-006', '2025-Q4', '0101', 'billed', pastDate(120)],
    ['tc-007', 'pat-007', 'prc-003', 'usr-001', 'pi-007', '2026-Q1', '0102', 'open', pastDate(12)],
    ['tc-008', 'pat-008', 'prc-001', 'usr-002', 'pi-008', '2026-Q1', '0101', 'open', pastDate(10)],
    ['tc-009', 'pat-009', 'prc-001', 'usr-001', 'pi-009', '2025-Q4', '0101', 'billed', pastDate(100)],
    ['tc-010', 'pat-010', 'prc-003', 'usr-001', 'pi-010', '2026-Q1', '0101', 'open', pastDate(8)],
    ['tc-011', 'pat-011', 'prc-002', 'usr-003', 'pi-011', '2026-Q1', '0101', 'open', pastDate(22)],
    ['tc-012', 'pat-012', 'prc-001', 'usr-002', 'pi-012', '2026-Q1', '0101', 'open', pastDate(5)],
    ['tc-013', 'pat-013', 'prc-003', 'usr-001', 'pi-013', '2026-Q1', '0102', 'open', pastDate(14)],
    ['tc-014', 'pat-014', 'prc-001', 'usr-002', 'pi-014', '2025-Q4', '0101', 'billed', pastDate(110)],
    ['tc-015', 'pat-015', 'prc-002', 'usr-003', 'pi-015', '2026-Q1', '0101', 'open', pastDate(7)],
  ]
  for (const tc of tcData) insertTC.run(...tc)

  // Encounters (1-3 per treatment case)
  const insertEnc = db.prepare(`INSERT INTO encounter (id, treatment_case_id, practice_id, doctor_id, encounter_date, chief_complaint, notes) VALUES (?, ?, ?, ?, ?, ?, ?)`)
  const encData: [string, string, string, string, string, string, string | null][] = [
    ['enc-001', 'tc-001', 'prc-001', 'usr-001', pastDate(30), 'Rückenschmerzen seit 2 Wochen', 'Lumbalgie, kein radikuläres Syndrom'],
    ['enc-002', 'tc-001', 'prc-001', 'usr-001', pastDate(14), 'Kontrolltermin Rücken', 'Besserung unter Therapie'],
    ['enc-003', 'tc-002', 'prc-001', 'usr-002', pastDate(25), 'Husten und Schnupfen', 'Grippaler Infekt'],
    ['enc-004', 'tc-003', 'prc-001', 'usr-001', pastDate(20), 'Kontrolluntersuchung Herz', 'Stabile Angina pectoris'],
    ['enc-005', 'tc-003', 'prc-001', 'usr-001', pastDate(5), 'Blutdruckkontrolle', 'Blutdruck gut eingestellt'],
    ['enc-006', 'tc-004', 'prc-002', 'usr-003', pastDate(18), 'Knieschmerzen rechts', 'V.a. Gonarthrose'],
    ['enc-007', 'tc-005', 'prc-001', 'usr-002', pastDate(15), 'Nachsorge nach stationärem Aufenthalt', 'Wundheilung unauffällig'],
    ['enc-008', 'tc-006', 'prc-002', 'usr-003', pastDate(120), 'Hüftschmerzen links', 'Z.n. Hüft-TEP, Nachsorge'],
    ['enc-009', 'tc-007', 'prc-003', 'usr-001', pastDate(12), 'Sportverletzung Sprunggelenk', 'Distorsion OSG links'],
    ['enc-010', 'tc-008', 'prc-001', 'usr-002', pastDate(10), 'Kopfschmerzen, Müdigkeit', 'V.a. Eisenmangel'],
    ['enc-011', 'tc-009', 'prc-001', 'usr-001', pastDate(100), 'Schmerztherapie', 'Opioidrotation besprochen'],
    ['enc-012', 'tc-010', 'prc-003', 'usr-001', pastDate(8), 'Vorsorgeuntersuchung', 'Check-up 35'],
    ['enc-013', 'tc-011', 'prc-002', 'usr-003', pastDate(22), 'Schulter-Arm-Syndrom', 'Impingement rechts'],
    ['enc-014', 'tc-012', 'prc-001', 'usr-002', pastDate(5), 'Fieber und Halsschmerzen', 'Akute Tonsillitis'],
    ['enc-015', 'tc-013', 'prc-003', 'usr-001', pastDate(14), 'LWS-Beschwerden nach Überweisung', 'Bandscheibenprotrusion L4/L5'],
    ['enc-016', 'tc-015', 'prc-002', 'usr-003', pastDate(7), 'Postoperative Nachsorge', 'Koloskopie-Befund besprechen'],
  ]
  for (const e of encData) insertEnc.run(...e)

  // Diagnoses (1-4 per treatment case)
  const insertDiag = db.prepare(`INSERT INTO diagnosis (id, treatment_case_id, encounter_id, icd_code, icd_display, certainty, is_permanent, diagnosed_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`)
  const diagData: [string, string, string | null, string, string, string, number, string][] = [
    ['diag-001', 'tc-001', 'enc-001', 'M54.5', 'Kreuzschmerz', 'G', 0, pastDate(30)],
    ['diag-002', 'tc-002', 'enc-003', 'J06.9', 'Akute Infektion der oberen Atemwege', 'G', 0, pastDate(25)],
    ['diag-003', 'tc-003', null, 'I25.1', 'Atherosklerotische Herzkrankheit', 'G', 1, pastDate(20)],
    ['diag-004', 'tc-003', null, 'I10', 'Essentielle Hypertonie', 'G', 1, pastDate(20)],
    ['diag-005', 'tc-004', 'enc-006', 'M17.1', 'Sonstige primäre Gonarthrose', 'V', 0, pastDate(18)],
    ['diag-006', 'tc-005', 'enc-007', 'Z09', 'Nachuntersuchung nach Behandlung', 'G', 0, pastDate(15)],
    ['diag-007', 'tc-006', 'enc-008', 'M16.1', 'Sonstige primäre Koxarthrose', 'Z', 0, pastDate(120)],
    ['diag-008', 'tc-007', 'enc-009', 'S93.4', 'Verstauchung des oberen Sprunggelenkes', 'G', 0, pastDate(12)],
    ['diag-009', 'tc-008', 'enc-010', 'D50.9', 'Eisenmangelanämie', 'V', 0, pastDate(10)],
    ['diag-010', 'tc-008', 'enc-010', 'R51', 'Kopfschmerz', 'G', 0, pastDate(10)],
    ['diag-011', 'tc-009', null, 'C61', 'Prostatakarzinom', 'G', 1, pastDate(100)],
    ['diag-012', 'tc-010', 'enc-012', 'Z00.0', 'Allgemeinuntersuchung', 'G', 0, pastDate(8)],
    ['diag-013', 'tc-011', 'enc-013', 'M75.1', 'Impingement-Syndrom der Schulter', 'G', 0, pastDate(22)],
    ['diag-014', 'tc-012', 'enc-014', 'J03.9', 'Akute Tonsillitis', 'G', 0, pastDate(5)],
    ['diag-015', 'tc-013', 'enc-015', 'M51.1', 'Lumbale Bandscheibendegeneration', 'G', 0, pastDate(14)],
    ['diag-016', 'tc-003', null, 'E78.0', 'Reine Hypercholesterinämie', 'G', 1, pastDate(20)],
    ['diag-017', 'tc-015', 'enc-016', 'Z09', 'Nachuntersuchung nach Behandlung', 'G', 0, pastDate(7)],
  ]
  for (const d of diagData) insertDiag.run(...d)

  // Prescriptions
  const insertRx = db.prepare(`INSERT INTO prescription (id, treatment_case_id, doctor_id, medication_id, medication_name, medication_pzn, dosage_instructions, quantity, prescription_type, status, prescribed_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`)
  const rxData: [string, string, string, string, string, string, string, string, string, string, string][] = [
    ['rx-001', 'tc-001', 'usr-001', 'med-001', 'Ibuprofen', '01234501', '3x täglich 1 Tablette', 'N2 (50 Stk)', 'kassenrezept', 'signed', pastDate(30)],
    ['rx-002', 'tc-002', 'usr-002', 'med-017', 'Novaminsulfon', '01234517', 'Bei Bedarf 20 Tropfen', 'N1 (30ml)', 'kassenrezept', 'dispensed', pastDate(25)],
    ['rx-003', 'tc-003', 'usr-001', 'med-003', 'Ramipril', '01234503', '1x morgens 1 Tablette', 'N3 (100 Stk)', 'kassenrezept', 'signed', pastDate(20)],
    ['rx-004', 'tc-003', 'usr-001', 'med-008', 'Simvastatin', '01234508', '1x abends 1 Tablette', 'N3 (100 Stk)', 'kassenrezept', 'signed', pastDate(20)],
    ['rx-005', 'tc-003', 'usr-001', 'med-009', 'ASS', '01234509', '1x morgens 1 Tablette', 'N3 (100 Stk)', 'kassenrezept', 'signed', pastDate(20)],
    ['rx-006', 'tc-004', 'usr-003', 'med-010', 'Diclofenac', '01234510', '2x täglich 1 Tablette', 'N2 (50 Stk)', 'kassenrezept', 'signed', pastDate(18)],
    ['rx-007', 'tc-008', 'usr-002', 'med-006', 'L-Thyroxin', '01234506', '1x morgens nüchtern', 'N3 (100 Stk)', 'kassenrezept', 'draft', pastDate(10)],
    ['rx-008', 'tc-012', 'usr-002', 'med-004', 'Amoxicillin', '01234504', '3x täglich 1 Tablette, 7 Tage', 'N1 (20 Stk)', 'kassenrezept', 'signed', pastDate(5)],
  ]
  for (const r of rxData) insertRx.run(...r)

  // Lab orders
  const insertLab = db.prepare(`INSERT INTO lab_order (id, treatment_case_id, doctor_id, description, status, result_summary, ordered_at, completed_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`)
  const labData: [string, string, string, string, string, string | null, string, string | null][] = [
    ['lab-001', 'tc-003', 'usr-001', 'Großes Blutbild, Lipidprofil, HbA1c', 'completed', 'Cholesterin leicht erhöht (LDL 145), sonst unauffällig', pastDate(20), pastDate(17)],
    ['lab-002', 'tc-008', 'usr-002', 'Kleines Blutbild, Ferritin, Transferrin', 'completed', 'Ferritin 8 ng/ml (erniedrigt), Hb 10.2 g/dl', pastDate(10), pastDate(7)],
    ['lab-003', 'tc-010', 'usr-001', 'Check-up Labor: Blutbild, Leber, Niere, Schilddrüse', 'in_progress', null, pastDate(8), null],
    ['lab-004', 'tc-009', 'usr-001', 'PSA, Kreatinin, Elektrolyte', 'completed', 'PSA 4.2 ng/ml (grenzwertig), Kreatinin normal', pastDate(100), pastDate(97)],
    ['lab-005', 'tc-015', 'usr-003', 'Tumormarker CEA, Blutbild', 'ordered', null, pastDate(7), null],
  ]
  for (const l of labData) insertLab.run(...l)

  // Imaging orders
  const insertImaging = db.prepare(`INSERT INTO imaging_order (id, treatment_case_id, doctor_id, modality, body_region, description, status, result_summary, ordered_at, completed_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`)
  const imgData: [string, string, string, string, string, string, string, string | null, string, string | null][] = [
    ['img-001', 'tc-001', 'usr-001', 'xray', 'LWS', 'Röntgen LWS in 2 Ebenen', 'completed', 'Leichte degenerative Veränderungen L4/L5', pastDate(30), pastDate(28)],
    ['img-002', 'tc-004', 'usr-003', 'xray', 'Knie rechts', 'Röntgen Knie rechts in 2 Ebenen', 'completed', 'Gelenkspaltverschmälerung medial', pastDate(18), pastDate(16)],
    ['img-003', 'tc-013', 'usr-001', 'mri', 'LWS', 'MRT LWS', 'completed', 'Bandscheibenprotrusion L4/L5 ohne Nervenkompression', pastDate(14), pastDate(10)],
  ]
  for (const i of imgData) insertImaging.run(...i)

  // Vital signs (~10 encounters)
  const insertVitals = db.prepare(`INSERT INTO vital_signs (id, patient_id, encounter_id, measured_at, height_cm, weight_kg, bmi, systolic_bp, diastolic_bp, heart_rate, temperature_c, measured_by) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`)
  const vitalsData: [string, string, string, string, number, number, number, number, number, number, number | null, string][] = [
    ['vs-001', 'pat-001', 'enc-001', pastDate(30), 182, 85, 25.7, 130, 85, 72, null, 'usr-004'],
    ['vs-002', 'pat-001', 'enc-002', pastDate(14), 182, 84, 25.4, 125, 80, 70, null, 'usr-004'],
    ['vs-003', 'pat-003', 'enc-004', pastDate(20), 175, 92, 30.0, 145, 90, 78, null, 'usr-004'],
    ['vs-004', 'pat-003', 'enc-005', pastDate(5), 175, 91, 29.7, 135, 82, 74, null, 'usr-004'],
    ['vs-005', 'pat-005', 'enc-007', pastDate(15), 178, 76, 24.0, 120, 75, 68, 36.8, 'usr-004'],
    ['vs-006', 'pat-006', 'enc-008', pastDate(120), 165, 68, 25.0, 140, 88, 80, null, 'usr-005'],
    ['vs-007', 'pat-008', 'enc-010', pastDate(10), 170, 58, 20.1, 105, 65, 82, 36.5, 'usr-004'],
    ['vs-008', 'pat-009', 'enc-011', pastDate(100), 180, 70, 21.6, 110, 70, 66, 37.0, 'usr-004'],
    ['vs-009', 'pat-012', 'enc-014', pastDate(5), 120, 22, 15.3, 95, 60, 100, 38.5, 'usr-004'],
    ['vs-010', 'pat-010', 'enc-012', pastDate(8), 168, 65, 23.0, 118, 74, 70, 36.6, 'usr-006'],
  ]
  for (const v of vitalsData) insertVitals.run(...v)

  // Documents
  const insertDoc = db.prepare(`INSERT INTO document (id, patient_id, treatment_case_id, document_type, title, content, generated_by, generated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`)
  const docData: [string, string, string | null, string, string, string | null, string, string][] = [
    ['doc-001', 'pat-001', 'tc-001', 'imaging_report', 'Röntgenbefund LWS', 'Leichte degenerative Veränderungen L4/L5, kein Hinweis auf Fraktur.', 'usr-001', pastDate(28)],
    ['doc-002', 'pat-003', 'tc-003', 'lab_report', 'Laborbefund Lipidprofil', 'LDL 145 mg/dl, HDL 55 mg/dl, Triglyceride 120 mg/dl.', 'usr-001', pastDate(17)],
    ['doc-003', 'pat-005', 'tc-005', 'arztbrief', 'Arztbrief an Hausarzt', null, 'usr-002', pastDate(10)],
    ['doc-004', 'pat-009', 'tc-009', 'letter', 'Befundbericht Onkologie', null, 'usr-001', pastDate(95)],
  ]
  for (const d of docData) insertDoc.run(...d)

  // Doctor letters (for arztbrief documents)
  const insertLetter = db.prepare(`INSERT INTO doctor_letter (id, document_id, encounter_id, treatment_case_id, recipient_name, recipient_institution, purpose, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`)
  insertLetter.run('dl-001', 'doc-003', 'enc-007', 'tc-005', 'Dr. Hans Meier', 'Hausarztpraxis Meier', 'arztbrief', 'sent')
  insertLetter.run('dl-002', 'doc-004', 'enc-011', 'tc-009', 'Prof. Dr. Keller', 'Onkologisches Zentrum Frankfurt', 'befundbericht', 'finalized')

  // Referrals (5 incoming + 3 outgoing)
  const insertRef = db.prepare(`INSERT INTO referral (id, patient_id, treatment_case_id, direction, from_practice_id, from_doctor_id, from_external_name, from_external_id, to_practice_id, to_doctor_id, to_external_name, to_external_id, reason, urgency, status, referred_at, accepted_at, completed_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`)
  // Incoming
  insertRef.run('ref-001', 'pat-005', 'tc-005', 'incoming', null, null, 'Universitätsklinikum Frankfurt', 'IK-UKF-001', 'prc-001', 'usr-002', null, null, 'Postoperative Nachsorge', 'routine', 'accepted', pastDate(15), pastDate(15), null)
  insertRef.run('ref-002', 'pat-007', 'tc-007', 'incoming', null, null, 'Klinikum Darmstadt', 'IK-KDA-001', 'prc-003', 'usr-001', null, null, 'Sportverletzung — konservative Therapie', 'urgent', 'in_treatment', pastDate(12), pastDate(12), null)
  insertRef.run('ref-003', 'pat-009', 'tc-009', 'incoming', null, null, 'St. Josefs-Krankenhaus', 'IK-SJK-001', 'prc-001', 'usr-001', null, null, 'Palliative Betreuung', 'routine', 'completed', pastDate(100), pastDate(100), pastDate(95))
  insertRef.run('ref-004', 'pat-013', 'tc-013', 'incoming', null, null, 'Universitätsklinikum Frankfurt', 'IK-UKF-001', 'prc-003', 'usr-001', null, null, 'LWS-Beschwerden — konservative Therapie', 'routine', 'accepted', pastDate(14), pastDate(14), null)
  insertRef.run('ref-005', 'pat-015', 'tc-015', 'incoming', null, null, 'Klinikum Darmstadt', 'IK-KDA-001', 'prc-002', 'usr-003', null, null, 'Postoperative Tumornachsorge', 'routine', 'in_treatment', pastDate(7), pastDate(7), null)
  // Outgoing
  insertRef.run('ref-006', 'pat-004', 'tc-004', 'outgoing', 'prc-002', 'usr-003', null, null, null, null, 'Radiologiepraxis Frankfurt Süd', 'BSNR-RAD-001', 'MRT Knie rechts bei V.a. Meniskusläsion', 'routine', 'pending', pastDate(18), null, null)
  insertRef.run('ref-007', 'pat-008', 'tc-008', 'outgoing', 'prc-001', 'usr-002', null, null, null, null, 'Hämatologische Praxis Dr. Stein', 'BSNR-HAE-001', 'Abklärung Eisenmangelanämie', 'routine', 'accepted', pastDate(10), pastDate(8), null)
  insertRef.run('ref-008', 'pat-011', 'tc-011', 'outgoing', 'prc-002', 'usr-003', null, null, null, null, 'Physiotherapie Zentrum Frankfurt', null, 'Physiotherapie bei Impingement-Syndrom', 'routine', 'completed', pastDate(22), pastDate(20), pastDate(5))
})

seed()

// Print summary
const counts = [
  'organization', 'practice', 'user', 'user_practice', 'patient', 'address',
  'insurance_provider', 'patient_insurance', 'patient_consent', 'patient_contact',
  'patient_history', 'patient_note', 'treatment_case', 'encounter', 'diagnosis',
  'vital_signs', 'prescription', 'lab_order', 'imaging_order', 'document',
  'doctor_letter', 'referral',
].map((table) => {
  const count = (db.prepare(`SELECT count(*) as c FROM ${table}`).get() as { c: number }).c
  return `  ${table}: ${count}`
})

console.log('Seed complete:')
console.log(counts.join('\n'))

db.close()
