import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import type Database from 'better-sqlite3'
import { setupTestDb, seedMinimalData } from '../helpers.js'

let db: Database.Database

beforeEach(() => {
  db = setupTestDb()
  seedMinimalData(db)
})

afterEach(() => db.close())

describe('referral bidirectional', () => {
  it('creates an incoming referral', () => {
    db.prepare(`INSERT INTO referral (id, patient_id, direction, from_external_name, from_external_id, to_practice_id, to_doctor_id, urgency, status, referred_at)
      VALUES ('ref-in', 'pat-t', 'incoming', 'Uniklinikum Frankfurt', 'IK-001', 'prc-t', 'usr-t', 'routine', 'accepted', '2026-01-15')`).run()
    const row = db.prepare("SELECT * FROM referral WHERE id = 'ref-in'").get() as any
    expect(row.direction).toBe('incoming')
    expect(row.from_external_name).toBe('Uniklinikum Frankfurt')
    expect(row.to_practice_id).toBe('prc-t')
  })

  it('creates an outgoing referral', () => {
    db.prepare(`INSERT INTO referral (id, patient_id, direction, from_practice_id, from_doctor_id, to_external_name, reason, urgency, status, referred_at)
      VALUES ('ref-out', 'pat-t', 'outgoing', 'prc-t', 'usr-t', 'Radiologiepraxis Süd', 'MRT Knie', 'routine', 'pending', '2026-02-01')`).run()
    const row = db.prepare("SELECT * FROM referral WHERE id = 'ref-out'").get() as any
    expect(row.direction).toBe('outgoing')
    expect(row.from_practice_id).toBe('prc-t')
    expect(row.to_external_name).toBe('Radiologiepraxis Süd')
  })

  it('tracks status transitions', () => {
    db.prepare(`INSERT INTO referral (id, patient_id, direction, from_external_name, urgency, status, referred_at)
      VALUES ('ref-s', 'pat-t', 'incoming', 'Hospital', 'urgent', 'pending', '2026-01-01')`).run()
    db.prepare("UPDATE referral SET status = 'accepted', accepted_at = '2026-01-02' WHERE id = 'ref-s'").run()
    db.prepare("UPDATE referral SET status = 'in_treatment' WHERE id = 'ref-s'").run()
    db.prepare("UPDATE referral SET status = 'completed', completed_at = '2026-02-15' WHERE id = 'ref-s'").run()
    const row = db.prepare("SELECT status, completed_at FROM referral WHERE id = 'ref-s'").get() as any
    expect(row.status).toBe('completed')
    expect(row.completed_at).toBe('2026-02-15')
  })
})
