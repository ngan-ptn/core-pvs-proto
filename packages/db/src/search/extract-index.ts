import { writeFileSync, mkdirSync } from 'node:fs'
import { resolve } from 'node:path'
import { openDatabase } from '../connection.js'
import type { PatientSearchRecord, MedicationSearchRecord, SearchIndex } from '../types/index.js'

const db = openDatabase()

// Query search views and map to camelCase
const patients = db.prepare('SELECT * FROM v_patient_search').all().map((row: any): PatientSearchRecord => ({
  id: row.id,
  first_name: row.first_name,
  last_name: row.last_name,
  display_name: row.display_name,
  search_name: row.search_name,
  date_of_birth: row.date_of_birth,
  kvnr: row.kvnr,
  external_patient_id: row.external_patient_id,
  source_system: row.source_system,
  phone: row.phone,
  email: row.email,
  postal_code: row.postal_code,
  city: row.city,
  insurance_name: row.insurance_name,
  ik_number: row.ik_number,
}))

const medications = db.prepare('SELECT * FROM v_medication_search').all().map((row: any): MedicationSearchRecord => ({
  id: row.id,
  name: row.name,
  display_name: row.display_name,
  active_ingredient: row.active_ingredient,
  pzn: row.pzn,
  dosage_form: row.dosage_form,
  strength: row.strength,
}))

const index: SearchIndex = { patients, medications }
const json = JSON.stringify(index, null, 2)

// Write to both app public directories
const targets = [
  resolve(import.meta.dirname, '../../../../apps/main-app/public/search-index.json'),
  resolve(import.meta.dirname, '../../../../apps/event-demo/public/search-index.json'),
]

for (const target of targets) {
  mkdirSync(resolve(target, '..'), { recursive: true })
  writeFileSync(target, json, 'utf-8')
  console.log(`Written: ${target}`)
}

console.log(`Search index: ${patients.length} patients, ${medications.length} medications`)

db.close()
