import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import type Database from 'better-sqlite3'
import { setupTestDb, seedMinimalData } from '../helpers.js'

let db: Database.Database

beforeEach(() => {
  db = setupTestDb()
  seedMinimalData(db)
})

afterEach(() => db.close())

describe('v_patient_search VIEW', () => {
  it('returns one row per active patient', () => {
    const rows = db.prepare('SELECT * FROM v_patient_search').all()
    expect(rows).toHaveLength(1) // only pat-t from seedMinimalData
  })

  it('expands umlauts in search_name', () => {
    db.prepare("INSERT INTO patient (id, first_name, last_name, date_of_birth) VALUES ('pat-u', 'Jürgen', 'Müller', '1970-01-01')").run()
    const row = db.prepare("SELECT search_name FROM v_patient_search WHERE id = 'pat-u'").get() as any
    expect(row.search_name).toBe('Juergen Mueller')
  })

  it('includes insurance info from joined tables', () => {
    const row = db.prepare("SELECT insurance_name FROM v_patient_search WHERE id = 'pat-t'").get() as any
    expect(row.insurance_name).toBe('Test GKV')
  })

  it('excludes inactive patients', () => {
    db.prepare("INSERT INTO patient (id, first_name, last_name, date_of_birth, is_active) VALUES ('pat-inactive', 'Gone', 'Away', '1990-01-01', 0)").run()
    const rows = db.prepare("SELECT * FROM v_patient_search WHERE id = 'pat-inactive'").all()
    expect(rows).toHaveLength(0)
  })
})

describe('v_medication_search VIEW', () => {
  it('includes strength in display_name', () => {
    db.prepare("INSERT INTO medication (id, pzn, name, strength) VALUES ('med-1', '1111111', 'Ibuprofen', '400mg')").run()
    const row = db.prepare("SELECT display_name FROM v_medication_search WHERE id = 'med-1'").get() as any
    expect(row.display_name).toBe('Ibuprofen 400mg')
  })

  it('handles medication without strength', () => {
    db.prepare("INSERT INTO medication (id, pzn, name) VALUES ('med-2', '2222222', 'Vitamin D3')").run()
    const row = db.prepare("SELECT display_name FROM v_medication_search WHERE id = 'med-2'").get() as any
    expect(row.display_name).toBe('Vitamin D3')
  })
})
