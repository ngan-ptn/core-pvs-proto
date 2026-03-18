import { describe, it, expect } from 'vitest'
import { setupTestDb } from './helpers.js'

describe('migrations', () => {
  it('applies all migrations without error', () => {
    const db = setupTestDb()
    db.close()
  })

  it('creates all 26 tables', () => {
    const db = setupTestDb()
    const tables = db
      .prepare("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%' AND name != '_migrations' ORDER BY name")
      .all() as { name: string }[]
    const names = tables.map((t) => t.name)

    const expected = [
      'address', 'audit_log', 'diagnosis', 'doctor_letter', 'document',
      'encounter', 'encounter_note', 'encounter_service', 'imaging_order',
      'insurance_provider', 'lab_order', 'medication', 'organization',
      'patient', 'patient_consent', 'patient_contact', 'patient_history',
      'patient_insurance', 'patient_note', 'practice', 'prescription',
      'referral', 'treatment_case', 'user', 'user_practice', 'vital_signs',
    ]
    for (const t of expected) {
      expect(names).toContain(t)
    }
    db.close()
  })

  it('creates all 3 views', () => {
    const db = setupTestDb()
    const views = db
      .prepare("SELECT name FROM sqlite_master WHERE type='view' ORDER BY name")
      .all() as { name: string }[]
    const names = views.map((v) => v.name)

    expect(names).toContain('patient_timeline')
    expect(names).toContain('v_medication_search')
    expect(names).toContain('v_patient_search')
    db.close()
  })

  it('records all migrations in _migrations table', () => {
    const db = setupTestDb()
    const rows = db.prepare('SELECT name FROM _migrations ORDER BY name').all() as { name: string }[]
    expect(rows.length).toBeGreaterThanOrEqual(10)
    expect(rows[0].name).toBe('001_initial_schema.sql')
    expect(rows[rows.length - 1].name).toBe('010_search_views.sql')
    db.close()
  })
})
