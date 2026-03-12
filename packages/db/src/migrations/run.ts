import { readdirSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import type Database from 'better-sqlite3'
import { openDatabase } from '../connection.js'

const MIGRATIONS_DIR = resolve(import.meta.dirname, '.')

function ensureMetaTable(db: Database.Database): void {
  db.exec(`
    CREATE TABLE IF NOT EXISTS _migrations (
      name       TEXT PRIMARY KEY,
      applied_at TEXT NOT NULL
    )
  `)
}

function getAppliedMigrations(db: Database.Database): Set<string> {
  const rows = db
    .prepare('SELECT name FROM _migrations ORDER BY name')
    .all() as { name: string }[]
  return new Set(rows.map((r) => r.name))
}

function discoverMigrations(): string[] {
  return readdirSync(MIGRATIONS_DIR)
    .filter((f) => f.endsWith('.sql'))
    .sort()
}

export function runMigrations(db: Database.Database): string[] {
  ensureMetaTable(db)

  const applied = getAppliedMigrations(db)
  const files = discoverMigrations()
  const newlyApplied: string[] = []

  for (const file of files) {
    if (applied.has(file)) continue

    const sql = readFileSync(resolve(MIGRATIONS_DIR, file), 'utf-8')

    db.transaction(() => {
      db.exec(sql)
      db.prepare('INSERT INTO _migrations (name, applied_at) VALUES (?, ?)').run(
        file,
        new Date().toISOString(),
      )
    })()

    newlyApplied.push(file)
  }

  return newlyApplied
}

// CLI entry point
if (process.argv[1] && resolve(process.argv[1]) === resolve(import.meta.filename)) {
  const { mkdirSync } = await import('node:fs')
  const dataDir = resolve(import.meta.dirname, '../../../data')
  mkdirSync(dataDir, { recursive: true })

  const db = openDatabase()
  const migrated = runMigrations(db)

  if (migrated.length === 0) {
    console.log('No new migrations to apply.')
  } else {
    console.log(`Applied ${migrated.length} migration(s):`)
    for (const m of migrated) {
      console.log(`  ✓ ${m}`)
    }
  }

  db.close()
}
