import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import type Database from 'better-sqlite3'
import { setupTestDb, seedMinimalData } from '../helpers.js'

let db: Database.Database

beforeEach(() => {
  db = setupTestDb()
  seedMinimalData(db)
  db.exec(`
    INSERT INTO treatment_case (id, patient_id, practice_id, doctor_id, patient_insurance_id, quarter, schein_type, opened_at)
    VALUES ('tc-1', 'pat-t', 'prc-t', 'usr-t', 'pi-t', '2026-Q1', '0101', '2026-01-15')
  `)
})

afterEach(() => db.close())

describe('encounter CRUD', () => {
  it('creates an encounter with practice_id', () => {
    db.prepare(`INSERT INTO encounter (id, treatment_case_id, practice_id, doctor_id, encounter_date, chief_complaint)
      VALUES ('enc-1', 'tc-1', 'prc-t', 'usr-t', '2026-01-20', 'Rückenschmerzen')`).run()
    const row = db.prepare("SELECT * FROM encounter WHERE id = 'enc-1'").get() as any
    expect(row.practice_id).toBe('prc-t')
    expect(row.chief_complaint).toBe('Rückenschmerzen')
  })

  it('links diagnosis to encounter (optional FK)', () => {
    db.prepare("INSERT INTO encounter (id, treatment_case_id, practice_id, doctor_id, encounter_date) VALUES ('enc-1', 'tc-1', 'prc-t', 'usr-t', '2026-01-20')").run()
    db.prepare("INSERT INTO diagnosis (id, treatment_case_id, encounter_id, icd_code, certainty, diagnosed_at) VALUES ('d-1', 'tc-1', 'enc-1', 'M54.5', 'G', '2026-01-20')").run()
    const row = db.prepare("SELECT encounter_id FROM diagnosis WHERE id = 'd-1'").get() as any
    expect(row.encounter_id).toBe('enc-1')
  })

  it('allows diagnosis without encounter (Dauerdiagnose)', () => {
    db.prepare("INSERT INTO diagnosis (id, treatment_case_id, icd_code, certainty, is_permanent, diagnosed_at) VALUES ('d-perm', 'tc-1', 'I10', 'G', 1, '2026-01-15')").run()
    const row = db.prepare("SELECT encounter_id, is_permanent FROM diagnosis WHERE id = 'd-perm'").get() as any
    expect(row.encounter_id).toBeNull()
    expect(row.is_permanent).toBe(1)
  })
})
