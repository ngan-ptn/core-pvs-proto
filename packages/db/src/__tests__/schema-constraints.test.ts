import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import type Database from 'better-sqlite3'
import { setupTestDb, seedMinimalData } from './helpers.js'

let db: Database.Database

beforeEach(() => {
  db = setupTestDb()
  seedMinimalData(db)
})

afterEach(() => {
  db.close()
})

describe('CHECK constraints', () => {
  it('rejects invalid user_type', () => {
    expect(() => {
      db.prepare("INSERT INTO user (id, user_type, first_name, last_name) VALUES ('u2', 'invalid', 'A', 'B')").run()
    }).toThrow()
  })

  it('rejects invalid diagnosis certainty', () => {
    db.exec(`
      INSERT INTO treatment_case (id, patient_id, practice_id, doctor_id, patient_insurance_id, quarter, schein_type, opened_at)
      VALUES ('tc-t', 'pat-t', 'prc-t', 'usr-t', 'pi-t', '2026-Q1', '0101', '2026-01-01')
    `)
    expect(() => {
      db.prepare("INSERT INTO diagnosis (id, treatment_case_id, icd_code, certainty, diagnosed_at) VALUES ('d1', 'tc-t', 'J06.9', 'X', '2026-01-01')").run()
    }).toThrow()
  })

  it('rejects invalid referral direction', () => {
    expect(() => {
      db.prepare("INSERT INTO referral (id, patient_id, direction, urgency, referred_at) VALUES ('r1', 'pat-t', 'sideways', 'routine', '2026-01-01')").run()
    }).toThrow()
  })

  it('rejects invalid source_system', () => {
    expect(() => {
      db.prepare("INSERT INTO patient (id, first_name, last_name, date_of_birth, source_system) VALUES ('p2', 'A', 'B', '2000-01-01', 'invalid')").run()
    }).toThrow()
  })

  it('rejects invalid insurance_type', () => {
    expect(() => {
      db.prepare("INSERT INTO insurance_provider (id, ik_number, name, insurance_type) VALUES ('i2', '000', 'X', 'INVALID')").run()
    }).toThrow()
  })
})

describe('UNIQUE constraints', () => {
  it('prevents duplicate user_practice', () => {
    expect(() => {
      db.prepare("INSERT INTO user_practice (id, user_id, practice_id, role) VALUES ('up-dup', 'usr-t', 'prc-t', 'standard')").run()
    }).toThrow()
  })

  it('prevents duplicate patient_consent per type', () => {
    db.prepare("INSERT INTO patient_consent (id, patient_id, consent_type, is_granted) VALUES ('c1', 'pat-t', 'data_usage', 1)").run()
    expect(() => {
      db.prepare("INSERT INTO patient_consent (id, patient_id, consent_type, is_granted) VALUES ('c2', 'pat-t', 'data_usage', 0)").run()
    }).toThrow()
  })

  it('prevents duplicate practice bsnr', () => {
    expect(() => {
      db.prepare("INSERT INTO practice (id, organization_id, name, bsnr) VALUES ('p2', 'org-t', 'Dup', '999999901')").run()
    }).toThrow()
  })

  it('prevents duplicate insurance_provider ik_number', () => {
    expect(() => {
      db.prepare("INSERT INTO insurance_provider (id, ik_number, name, insurance_type) VALUES ('i2', '999999999', 'Dup', 'GKV')").run()
    }).toThrow()
  })
})

describe('NOT NULL constraints', () => {
  it('rejects patient without first_name', () => {
    expect(() => {
      db.prepare("INSERT INTO patient (id, last_name, date_of_birth) VALUES ('p2', 'B', '2000-01-01')").run()
    }).toThrow()
  })

  it('rejects treatment_case without quarter', () => {
    expect(() => {
      db.prepare("INSERT INTO treatment_case (id, patient_id, practice_id, doctor_id, patient_insurance_id, schein_type, opened_at) VALUES ('tc-2', 'pat-t', 'prc-t', 'usr-t', 'pi-t', '0101', '2026-01-01')").run()
    }).toThrow()
  })
})

describe('FK constraints', () => {
  it('rejects treatment_case with non-existent patient_id', () => {
    expect(() => {
      db.prepare("INSERT INTO treatment_case (id, patient_id, practice_id, doctor_id, patient_insurance_id, quarter, schein_type, opened_at) VALUES ('tc-bad', 'ghost', 'prc-t', 'usr-t', 'pi-t', '2026-Q1', '0101', '2026-01-01')").run()
    }).toThrow()
  })

  it('rejects user_practice with non-existent user_id', () => {
    expect(() => {
      db.prepare("INSERT INTO user_practice (id, user_id, practice_id, role) VALUES ('up-bad', 'ghost', 'prc-t', 'admin')").run()
    }).toThrow()
  })
})

describe('FK RESTRICT prevents deletion', () => {
  it('prevents deleting patient with consent records', () => {
    db.prepare("INSERT INTO patient_consent (id, patient_id, consent_type, is_granted) VALUES ('c1', 'pat-t', 'data_usage', 1)").run()
    expect(() => {
      db.prepare("DELETE FROM patient WHERE id = 'pat-t'").run()
    }).toThrow()
  })

  it('prevents deleting patient with treatment_case', () => {
    db.exec(`
      INSERT INTO treatment_case (id, patient_id, practice_id, doctor_id, patient_insurance_id, quarter, schein_type, opened_at)
      VALUES ('tc-t', 'pat-t', 'prc-t', 'usr-t', 'pi-t', '2026-Q1', '0101', '2026-01-01')
    `)
    expect(() => {
      db.prepare("DELETE FROM patient WHERE id = 'pat-t'").run()
    }).toThrow()
  })
})

describe('FK CASCADE for owned children', () => {
  it('cascades address deletion when patient deleted', () => {
    // pat-t has no RESTRICT children except address (CASCADE) — need a clean patient
    db.prepare("INSERT INTO patient (id, first_name, last_name, date_of_birth) VALUES ('pat-del', 'Del', 'Me', '2000-01-01')").run()
    db.prepare("INSERT INTO address (id, patient_id, address_type, city, is_primary) VALUES ('adr-del', 'pat-del', 'home', 'X', 1)").run()
    db.prepare("DELETE FROM patient WHERE id = 'pat-del'").run()
    const count = (db.prepare("SELECT count(*) as c FROM address WHERE patient_id = 'pat-del'").get() as { c: number }).c
    expect(count).toBe(0)
  })

  it('cascades user_practice deletion when user deleted', () => {
    db.prepare("INSERT INTO user (id, user_type, first_name, last_name) VALUES ('usr-del', 'mfa', 'Del', 'Me')").run()
    db.prepare("INSERT INTO user_practice (id, user_id, practice_id, role) VALUES ('up-del', 'usr-del', 'prc-t', 'standard')").run()
    db.prepare("DELETE FROM user WHERE id = 'usr-del'").run()
    const count = (db.prepare("SELECT count(*) as c FROM user_practice WHERE user_id = 'usr-del'").get() as { c: number }).c
    expect(count).toBe(0)
  })
})
