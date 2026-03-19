/**
 * Extracted seed data insertion logic for use in tests.
 * This mirrors the seed.ts script but accepts a db parameter instead of opening its own.
 */
import type Database from 'better-sqlite3'

function pastDate(daysAgo: number) {
  const d = new Date()
  d.setDate(d.getDate() - daysAgo)
  return d.toISOString().split('T')[0]
}

export function execSeedData(db: Database.Database) {
  const seed = db.transaction(() => {
    // Organization
    db.prepare(`INSERT INTO organization (id, name, short_name) VALUES (?, ?, ?)`).run('org-001', 'Gesundheitszentrum Rhein-Main GmbH', 'GZ Rhein-Main')

    // Practices
    const practices = [
      ['prc-001', 'org-001', 'MVZ Musterstadt Zentrum', '123456701'],
      ['prc-002', 'org-001', 'MVZ Musterstadt Süd', '123456702'],
      ['prc-003', 'org-001', 'MVZ Musterstadt Nord', '123456703'],
    ]
    const insertPractice = db.prepare(`INSERT INTO practice (id, organization_id, name, bsnr) VALUES (?, ?, ?, ?)`)
    for (const p of practices) insertPractice.run(...p)

    // Users
    const users = [
      ['usr-001', 'doctor', 'Thomas', 'Müller', '123456789', 'allgemeinmedizin'],
      ['usr-002', 'doctor', 'Sarah', 'Weber', '234567890', 'innere_medizin'],
      ['usr-003', 'doctor', 'Klaus', 'Hoffmann', '345678901', 'orthopaedie'],
      ['usr-004', 'mfa', 'Lisa', 'Schmidt', null, null],
      ['usr-005', 'mfa', 'Maria', 'Fischer', null, null],
      ['usr-006', 'mfa', 'Anna', 'Braun', null, null],
      ['usr-007', 'mfa', 'Jan', 'Becker', null, null],
    ]
    const insertUser = db.prepare(`INSERT INTO user (id, user_type, first_name, last_name, lanr, specialty) VALUES (?, ?, ?, ?, ?, ?)`)
    for (const u of users) insertUser.run(...u)

    // User-Practice
    const ups = [
      ['up-001', 'usr-001', 'prc-001', 'admin', 1],
      ['up-002', 'usr-001', 'prc-003', 'standard', 0],
      ['up-003', 'usr-002', 'prc-001', 'standard', 1],
      ['up-004', 'usr-003', 'prc-002', 'standard', 1],
      ['up-005', 'usr-003', 'prc-003', 'standard', 0],
      ['up-006', 'usr-004', 'prc-001', 'standard', 1],
      ['up-007', 'usr-005', 'prc-002', 'billing', 1],
      ['up-008', 'usr-006', 'prc-003', 'standard', 1],
      ['up-009', 'usr-007', 'prc-001', 'view_only', 1],
    ]
    const insertUP = db.prepare(`INSERT INTO user_practice (id, user_id, practice_id, role, is_primary) VALUES (?, ?, ?, ?, ?)`)
    for (const up of ups) insertUP.run(...up)

    // Insurance providers
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
    ]
    const insertInsurer = db.prepare(`INSERT INTO insurance_provider (id, ik_number, name, short_name, insurance_type) VALUES (?, ?, ?, ?, ?)`)
    for (const i of insurers) insertInsurer.run(...i)

    // Medications
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
    ]
    const insertMed = db.prepare(`INSERT INTO medication (id, pzn, name, active_ingredient, dosage_form, strength) VALUES (?, ?, ?, ?, ?, ?)`)
    for (const m of meds) insertMed.run(...m)

    // 25 patients (simplified — just enough for count validation)
    const insertPatient = db.prepare(`INSERT INTO patient (id, egk_versichertennummer, external_patient_id, source_system, salutation, first_name, last_name, date_of_birth, gender, phone) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`)
    const names = [
      ['Max','Müller'],['Anna','Schmidt'],['Peter','Schneider'],['Maria','Fischer'],['Klaus','Weber'],
      ['Sabine','Meyer'],['Thomas','Wagner'],['Claudia','Becker'],['Heinrich','Schulz'],['Erika','Hoffmann'],
      ['Wolfgang','Schäfer'],['Lena','Koch'],['Jürgen','Bauer'],['Monika','Richter'],['Dieter','Klein'],
      ['Ingrid','Wolf'],['Stefan','Neumann'],['Petra','Schwarz'],['Markus','Zimmermann'],['Brigitte','Braun'],
      ['Ralf','Hartmann'],['Susanne','Lange'],['Friedrich','Werner'],['Katharina','Krüger'],['Alexander','König'],
    ]
    for (let i = 0; i < 25; i++) {
      const id = `pat-${String(i + 1).padStart(3, '0')}`
      const src = i === 4 || i === 8 || i === 14 || i === 20 || i === 23 ? 'hospital_his' : i === 6 || i === 12 || i === 18 ? 'referral' : 'pvs'
      const extId = src !== 'pvs' ? `EXT-${i}` : null
      const kvnr = i < 22 ? `A${String(100000001 + i)}` : null
      insertPatient.run(id, kvnr, extId, src, i % 2 === 0 ? 'herr' : 'frau', names[i][0], names[i][1], `${1940 + i * 2}-01-15`, i % 2 === 0 ? 'M' : 'W', `+49 170 ${String(i).padStart(7, '0')}`)
    }

    // Addresses
    const insertAddr = db.prepare(`INSERT INTO address (id, patient_id, address_type, city, is_primary) VALUES (?, ?, ?, ?, ?)`)
    for (let i = 0; i < 25; i++) {
      insertAddr.run(`adr-${String(i + 1).padStart(3, '0')}`, `pat-${String(i + 1).padStart(3, '0')}`, 'home', 'Frankfurt', 1)
    }

    // Patient insurance
    const insertPI = db.prepare(`INSERT INTO patient_insurance (id, patient_id, insurance_provider_id, is_primary) VALUES (?, ?, ?, ?)`)
    for (let i = 0; i < 25; i++) {
      const insurerId = i >= 22 ? (i % 2 === 0 ? 'ins-009' : 'ins-010') : `ins-${String((i % 8) + 1).padStart(3, '0')}`
      insertPI.run(`pi-${String(i + 1).padStart(3, '0')}`, `pat-${String(i + 1).padStart(3, '0')}`, insurerId, 1)
    }

    // Patient consents (6 per patient = 150)
    const consentTypes = ['data_usage', 'data_sharing', 'living_will', 'contact_agreement', 'billing_submission', 'medical_history']
    const insertConsent = db.prepare(`INSERT INTO patient_consent (id, patient_id, consent_type, is_granted) VALUES (?, ?, ?, ?)`)
    let ci = 0
    for (let i = 0; i < 25; i++) {
      for (const ct of consentTypes) {
        ci++
        insertConsent.run(`con-${String(ci).padStart(3, '0')}`, `pat-${String(i + 1).padStart(3, '0')}`, ct, 1)
      }
    }

    // Treatment cases (15)
    const insertTC = db.prepare(`INSERT INTO treatment_case (id, patient_id, practice_id, doctor_id, patient_insurance_id, quarter, schein_type, opened_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`)
    for (let i = 0; i < 15; i++) {
      const pid = `pat-${String(i + 1).padStart(3, '0')}`
      const prcId = i % 3 === 0 ? 'prc-001' : i % 3 === 1 ? 'prc-002' : 'prc-003'
      const docId = i % 3 === 0 ? 'usr-001' : i % 3 === 1 ? 'usr-003' : 'usr-002'
      insertTC.run(`tc-${String(i + 1).padStart(3, '0')}`, pid, prcId, docId, `pi-${String(i + 1).padStart(3, '0')}`, '2026-Q1', '0101', pastDate(30 - i))
    }

    // Encounters (1 per case)
    const insertEnc = db.prepare(`INSERT INTO encounter (id, treatment_case_id, practice_id, doctor_id, encounter_date, chief_complaint) VALUES (?, ?, ?, ?, ?, ?)`)
    for (let i = 0; i < 15; i++) {
      const prcId = i % 3 === 0 ? 'prc-001' : i % 3 === 1 ? 'prc-002' : 'prc-003'
      const docId = i % 3 === 0 ? 'usr-001' : i % 3 === 1 ? 'usr-003' : 'usr-002'
      insertEnc.run(`enc-${String(i + 1).padStart(3, '0')}`, `tc-${String(i + 1).padStart(3, '0')}`, prcId, docId, pastDate(30 - i), 'Kontrolluntersuchung')
    }

    // Diagnoses
    const insertDiag = db.prepare(`INSERT INTO diagnosis (id, treatment_case_id, encounter_id, icd_code, certainty, diagnosed_at) VALUES (?, ?, ?, ?, ?, ?)`)
    for (let i = 0; i < 15; i++) {
      insertDiag.run(`diag-${String(i + 1).padStart(3, '0')}`, `tc-${String(i + 1).padStart(3, '0')}`, `enc-${String(i + 1).padStart(3, '0')}`, 'J06.9', 'G', pastDate(30 - i))
    }

    // Vital signs (10)
    const insertVS = db.prepare(`INSERT INTO vital_signs (id, patient_id, encounter_id, measured_at, systolic_bp, diastolic_bp, heart_rate, measured_by) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`)
    for (let i = 0; i < 10; i++) {
      insertVS.run(`vs-${String(i + 1).padStart(3, '0')}`, `pat-${String(i + 1).padStart(3, '0')}`, `enc-${String(i + 1).padStart(3, '0')}`, pastDate(30 - i), 120 + i, 75 + i, 70 + i, 'usr-004')
    }

    // Referrals (5 incoming + 3 outgoing)
    const insertRef = db.prepare(`INSERT INTO referral (id, patient_id, direction, from_external_name, to_practice_id, urgency, status, referred_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`)
    for (let i = 0; i < 5; i++) {
      insertRef.run(`ref-in-${i + 1}`, `pat-${String(i + 5).padStart(3, '0')}`, 'incoming', 'Hospital ' + (i + 1), 'prc-001', 'routine', 'accepted', pastDate(20 - i))
    }
    const insertRefOut = db.prepare(`INSERT INTO referral (id, patient_id, direction, from_practice_id, to_external_name, urgency, status, referred_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`)
    for (let i = 0; i < 3; i++) {
      insertRefOut.run(`ref-out-${i + 1}`, `pat-${String(i + 10).padStart(3, '0')}`, 'outgoing', 'prc-001', 'Specialist ' + (i + 1), 'routine', 'pending', pastDate(15 - i))
    }
  })

  seed()
}
