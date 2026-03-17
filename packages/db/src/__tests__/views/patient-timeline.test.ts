import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import type Database from 'better-sqlite3'
import { setupTestDb, seedMinimalData } from '../helpers.js'

let db: Database.Database

beforeEach(() => {
  db = setupTestDb()
  seedMinimalData(db)
  // Create a treatment case + encounter + diagnosis + prescription for timeline
  db.exec(`
    INSERT INTO treatment_case (id, patient_id, practice_id, doctor_id, patient_insurance_id, quarter, schein_type, opened_at)
    VALUES ('tc-1', 'pat-t', 'prc-t', 'usr-t', 'pi-t', '2026-Q1', '0101', '2026-01-15');
    INSERT INTO encounter (id, treatment_case_id, practice_id, doctor_id, encounter_date, chief_complaint)
    VALUES ('enc-1', 'tc-1', 'prc-t', 'usr-t', '2026-01-20', 'Rückenschmerzen');
    INSERT INTO diagnosis (id, treatment_case_id, encounter_id, icd_code, icd_display, certainty, diagnosed_at)
    VALUES ('d-1', 'tc-1', 'enc-1', 'M54.5', 'Kreuzschmerz', 'G', '2026-01-20');
    INSERT INTO medication (id, pzn, name, strength) VALUES ('med-1', '9999999', 'Ibuprofen', '400mg');
    INSERT INTO prescription (id, treatment_case_id, doctor_id, medication_id, medication_name, prescribed_at)
    VALUES ('rx-1', 'tc-1', 'usr-t', 'med-1', 'Ibuprofen', '2026-01-20');
    INSERT INTO vital_signs (id, patient_id, encounter_id, measured_at, systolic_bp, diastolic_bp, heart_rate, measured_by)
    VALUES ('vs-1', 'pat-t', 'enc-1', '2026-01-20', 130, 85, 72, 'usr-t');
    INSERT INTO referral (id, patient_id, direction, from_external_name, urgency, status, referred_at)
    VALUES ('ref-1', 'pat-t', 'incoming', 'Hospital X', 'routine', 'accepted', '2026-01-10');
  `)
})

afterEach(() => db.close())

describe('patient_timeline VIEW', () => {
  it('returns events from all source tables', () => {
    const events = db.prepare("SELECT event_type FROM patient_timeline WHERE patient_id = 'pat-t'").all() as any[]
    const types = events.map((e) => e.event_type)
    expect(types).toContain('encounter')
    expect(types).toContain('diagnosis')
    expect(types).toContain('prescription')
    expect(types).toContain('vitals')
    expect(types).toContain('referral')
  })

  it('returns chronological order', () => {
    const events = db.prepare("SELECT occurred_at FROM patient_timeline WHERE patient_id = 'pat-t' ORDER BY occurred_at").all() as any[]
    for (let i = 1; i < events.length; i++) {
      expect(events[i].occurred_at >= events[i - 1].occurred_at).toBe(true)
    }
  })

  it('filters by patient_id', () => {
    db.prepare("INSERT INTO patient (id, first_name, last_name, date_of_birth) VALUES ('pat-other', 'Other', 'One', '1990-01-01')").run()
    const events = db.prepare("SELECT * FROM patient_timeline WHERE patient_id = 'pat-other'").all()
    expect(events).toHaveLength(0)
  })

  it('shows referral direction in summary', () => {
    const event = db.prepare("SELECT summary FROM patient_timeline WHERE patient_id = 'pat-t' AND event_type = 'referral'").get() as any
    expect(event.summary).toContain('Referral from Hospital X')
  })
})
