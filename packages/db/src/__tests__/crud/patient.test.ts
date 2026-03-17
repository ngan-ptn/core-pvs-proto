import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import type Database from 'better-sqlite3'
import { setupTestDb, seedMinimalData } from '../helpers.js'

let db: Database.Database

beforeEach(() => {
  db = setupTestDb()
  seedMinimalData(db)
})

afterEach(() => db.close())

describe('patient CRUD', () => {
  it('inserts a valid patient', () => {
    db.prepare(`INSERT INTO patient (id, first_name, last_name, date_of_birth, gender, source_system)
      VALUES ('pat-new', 'Max', 'Müller', '1990-01-01', 'M', 'pvs')`).run()
    const row = db.prepare("SELECT * FROM patient WHERE id = 'pat-new'").get() as any
    expect(row.first_name).toBe('Max')
    expect(row.last_name).toBe('Müller')
    expect(row.source_system).toBe('pvs')
    expect(row.is_active).toBe(1)
  })

  it('soft-deletes a patient', () => {
    db.prepare("UPDATE patient SET is_active = 0 WHERE id = 'pat-t'").run()
    const row = db.prepare("SELECT is_active FROM patient WHERE id = 'pat-t'").get() as any
    expect(row.is_active).toBe(0)
  })

  it('stores external patient ID and source system', () => {
    db.prepare(`INSERT INTO patient (id, first_name, last_name, date_of_birth, source_system, external_patient_id)
      VALUES ('pat-ext', 'Hans', 'Weber', '1970-05-15', 'hospital_his', 'HIS-001')`).run()
    const row = db.prepare("SELECT external_patient_id, source_system FROM patient WHERE id = 'pat-ext'").get() as any
    expect(row.external_patient_id).toBe('HIS-001')
    expect(row.source_system).toBe('hospital_his')
  })

  it('stores blood type and allergies', () => {
    db.prepare(`INSERT INTO patient (id, first_name, last_name, date_of_birth, blood_type, allergies)
      VALUES ('pat-v', 'Vital', 'Test', '1985-03-14', 'AB+', '["Penicillin","Latex"]')`).run()
    const row = db.prepare("SELECT blood_type, allergies FROM patient WHERE id = 'pat-v'").get() as any
    expect(row.blood_type).toBe('AB+')
    expect(JSON.parse(row.allergies)).toEqual(['Penicillin', 'Latex'])
  })
})
