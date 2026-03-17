import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import type Database from 'better-sqlite3'
import { setupTestDb, seedMinimalData } from '../helpers.js'

let db: Database.Database

beforeEach(() => {
  db = setupTestDb()
  seedMinimalData(db)
})

afterEach(() => db.close())

describe('user-practice M:N', () => {
  it('allows a user to belong to multiple practices with different roles', () => {
    db.prepare("INSERT INTO practice (id, organization_id, name, bsnr) VALUES ('prc-t2', 'org-t', 'Practice 2', '999999902')").run()
    db.prepare("INSERT INTO user_practice (id, user_id, practice_id, role, is_primary) VALUES ('up-t2', 'usr-t', 'prc-t2', 'standard', 0)").run()

    const practices = db.prepare(`
      SELECT up.role, p.name FROM user_practice up
      JOIN practice p ON up.practice_id = p.id
      WHERE up.user_id = 'usr-t' ORDER BY p.name
    `).all() as any[]

    expect(practices).toHaveLength(2)
    expect(practices[0].role).toBe('standard')
    expect(practices[1].role).toBe('admin')
  })

  it('queries all doctors at a practice', () => {
    db.prepare("INSERT INTO user (id, user_type, first_name, last_name) VALUES ('usr-t2', 'doctor', 'Doc', 'Two')").run()
    db.prepare("INSERT INTO user_practice (id, user_id, practice_id, role) VALUES ('up-t3', 'usr-t2', 'prc-t', 'standard')").run()

    const doctors = db.prepare(`
      SELECT u.first_name, u.last_name FROM user u
      JOIN user_practice up ON u.id = up.user_id
      WHERE up.practice_id = 'prc-t' AND u.user_type = 'doctor'
    `).all() as any[]

    expect(doctors).toHaveLength(2)
  })

  it('queries all practices for a user', () => {
    db.prepare("INSERT INTO practice (id, organization_id, name, bsnr) VALUES ('prc-t2', 'org-t', 'P2', '999999902')").run()
    db.prepare("INSERT INTO practice (id, organization_id, name, bsnr) VALUES ('prc-t3', 'org-t', 'P3', '999999903')").run()
    db.prepare("INSERT INTO user_practice (id, user_id, practice_id, role) VALUES ('up-t2', 'usr-t', 'prc-t2', 'billing')").run()
    db.prepare("INSERT INTO user_practice (id, user_id, practice_id, role) VALUES ('up-t3', 'usr-t', 'prc-t3', 'view_only')").run()

    const practices = db.prepare(`
      SELECT p.name, up.role FROM user_practice up
      JOIN practice p ON up.practice_id = p.id
      WHERE up.user_id = 'usr-t'
    `).all() as any[]

    expect(practices).toHaveLength(3)
  })
})
