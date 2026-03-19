import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import type Database from 'better-sqlite3'
import { openMemoryDatabase } from '../connection.js'
import { runMigrations } from '../migrations/run.js'

// We re-execute seed logic inline since the seed script is a CLI entry point.
// This test validates that seeding an in-memory DB produces expected counts.

let db: Database.Database

function count(table: string): number {
  return (db.prepare(`SELECT count(*) as c FROM ${table}`).get() as { c: number }).c
}

beforeAll(async () => {
  db = openMemoryDatabase()
  runMigrations(db)

  // Dynamically import and eval the seed transaction
  // Since seed.ts uses openDatabase() (file-based), we replicate core logic here
  const { execSeedData } = await import('./seed-data.js')
  execSeedData(db)
})

afterAll(() => db.close())

describe('seed data validation', () => {
  it('creates expected organization count', () => expect(count('organization')).toBe(1))
  it('creates expected practice count', () => expect(count('practice')).toBe(3))
  it('creates expected user count', () => expect(count('user')).toBe(7))
  it('creates expected user_practice count', () => expect(count('user_practice')).toBeGreaterThanOrEqual(9))
  it('creates expected patient count', () => expect(count('patient')).toBe(25))
  it('creates expected insurance_provider count', () => expect(count('insurance_provider')).toBe(10))
  it('creates expected medication count', () => expect(count('medication')).toBe(20))
  it('creates expected referral count', () => expect(count('referral')).toBeGreaterThanOrEqual(8))
  it('creates expected patient_consent count', () => expect(count('patient_consent')).toBe(150))
  it('creates expected vital_signs count', () => expect(count('vital_signs')).toBeGreaterThanOrEqual(10))

  it('has at least 2 multi-practice users', () => {
    const multiPractice = db.prepare(`
      SELECT user_id, count(*) as pc FROM user_practice GROUP BY user_id HAVING pc > 1
    `).all()
    expect(multiPractice.length).toBeGreaterThanOrEqual(2)
  })

  it('has both incoming and outgoing referrals', () => {
    const directions = db.prepare('SELECT DISTINCT direction FROM referral').all() as { direction: string }[]
    const dirs = directions.map((d) => d.direction)
    expect(dirs).toContain('incoming')
    expect(dirs).toContain('outgoing')
  })

  it('patient_timeline returns data', () => {
    const events = db.prepare("SELECT count(*) as c FROM patient_timeline WHERE patient_id = 'pat-001'").get() as { c: number }
    expect(events.c).toBeGreaterThan(0)
  })

  it('v_patient_search returns all active patients', () => {
    expect(count('v_patient_search')).toBe(25)
  })
})
