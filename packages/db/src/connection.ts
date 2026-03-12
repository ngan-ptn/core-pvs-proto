import Database from 'better-sqlite3'
import { resolve } from 'node:path'

const DEFAULT_DB_PATH = resolve(
  import.meta.dirname,
  '../../../data/pvs.db',
)

export function openDatabase(dbPath?: string): Database.Database {
  const path = dbPath ?? DEFAULT_DB_PATH

  const db = new Database(path)

  // WAL mode for better concurrent read performance
  db.pragma('journal_mode = WAL')
  // Enforce foreign key constraints
  db.pragma('foreign_keys = ON')

  return db
}

export function openMemoryDatabase(): Database.Database {
  const db = new Database(':memory:')
  db.pragma('foreign_keys = ON')
  return db
}
