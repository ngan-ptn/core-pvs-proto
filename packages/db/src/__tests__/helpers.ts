import type Database from 'better-sqlite3'
import { openMemoryDatabase } from '../connection.js'
import { runMigrations } from '../migrations/run.js'

export function setupTestDb(): Database.Database {
  const db = openMemoryDatabase()
  runMigrations(db)
  return db
}

/** Insert minimal required entities so FK-dependent tables can be tested */
export function seedMinimalData(db: Database.Database) {
  db.exec(`
    INSERT INTO organization (id, name) VALUES ('org-t', 'Test Org');
    INSERT INTO practice (id, organization_id, name, bsnr) VALUES ('prc-t', 'org-t', 'Test Practice', '999999901');
    INSERT INTO user (id, user_type, first_name, last_name) VALUES ('usr-t', 'doctor', 'Test', 'Doctor');
    INSERT INTO user_practice (id, user_id, practice_id, role, is_primary) VALUES ('up-t', 'usr-t', 'prc-t', 'admin', 1);
    INSERT INTO patient (id, first_name, last_name, date_of_birth) VALUES ('pat-t', 'Test', 'Patient', '2000-01-01');
    INSERT INTO address (id, patient_id, address_type, city, is_primary) VALUES ('adr-t', 'pat-t', 'home', 'Teststadt', 1);
    INSERT INTO insurance_provider (id, ik_number, name, insurance_type) VALUES ('ins-t', '999999999', 'Test GKV', 'GKV');
    INSERT INTO patient_insurance (id, patient_id, insurance_provider_id, is_primary) VALUES ('pi-t', 'pat-t', 'ins-t', 1);
  `)
}
