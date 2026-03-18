import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import type Database from 'better-sqlite3'
import { setupTestDb, seedMinimalData } from '../helpers.js'

let db: Database.Database

beforeEach(() => {
  db = setupTestDb()
  seedMinimalData(db)
})

afterEach(() => db.close())

describe('treatment_case CRUD', () => {
  it('creates a treatment case with practice_id', () => {
    db.prepare(`INSERT INTO treatment_case (id, patient_id, practice_id, doctor_id, patient_insurance_id, quarter, schein_type, opened_at)
      VALUES ('tc-1', 'pat-t', 'prc-t', 'usr-t', 'pi-t', '2026-Q1', '0101', '2026-01-15')`).run()
    const row = db.prepare("SELECT * FROM treatment_case WHERE id = 'tc-1'").get() as any
    expect(row.practice_id).toBe('prc-t')
    expect(row.quarter).toBe('2026-Q1')
    expect(row.status).toBe('open')
  })

  it('RESTRICT prevents deleting treatment_case with encounters', () => {
    db.exec(`
      INSERT INTO treatment_case (id, patient_id, practice_id, doctor_id, patient_insurance_id, quarter, schein_type, opened_at)
      VALUES ('tc-1', 'pat-t', 'prc-t', 'usr-t', 'pi-t', '2026-Q1', '0101', '2026-01-15');
      INSERT INTO encounter (id, treatment_case_id, practice_id, doctor_id, encounter_date)
      VALUES ('enc-1', 'tc-1', 'prc-t', 'usr-t', '2026-01-20');
    `)
    expect(() => {
      db.prepare("DELETE FROM treatment_case WHERE id = 'tc-1'").run()
    }).toThrow()
  })
})
