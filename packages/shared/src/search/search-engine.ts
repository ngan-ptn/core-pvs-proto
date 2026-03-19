import Fuse from 'fuse.js'
import { normalizeGerman } from './german-normalize.js'
import type { PatientSearchRecord, MedicationSearchRecord, SearchRecord, SearchIndex } from '@pvs/db/types'

const patientFuseOptions: Fuse.IFuseOptions<PatientSearchRecord> = {
  keys: [
    { name: 'display_name', weight: 2.0 },
    { name: 'search_name', weight: 2.0 },
    { name: 'last_name', weight: 1.5 },
    { name: 'kvnr', weight: 1.5 },
    { name: 'external_patient_id', weight: 1.5 },
    { name: 'date_of_birth', weight: 1.0 },
    { name: 'insurance_name', weight: 0.8 },
    { name: 'city', weight: 0.5 },
    { name: 'postal_code', weight: 0.5 },
    { name: 'phone', weight: 0.3 },
    { name: 'email', weight: 0.3 },
  ],
  threshold: 0.4,
  distance: 100,
  includeScore: true,
  includeMatches: true,
  minMatchCharLength: 2,
  getFn: (obj, path) => {
    const value = Fuse.config.getFn(obj, path)
    if (typeof value === 'string') return normalizeGerman(value)
    if (Array.isArray(value)) return value.map((v) => (typeof v === 'string' ? normalizeGerman(v) : v))
    return value
  },
}

const medicationFuseOptions: Fuse.IFuseOptions<MedicationSearchRecord> = {
  keys: [
    { name: 'name', weight: 2.0 },
    { name: 'display_name', weight: 1.5 },
    { name: 'active_ingredient', weight: 1.5 },
    { name: 'pzn', weight: 1.5 },
    { name: 'dosage_form', weight: 0.5 },
    { name: 'strength', weight: 0.5 },
  ],
  threshold: 0.4,
  distance: 100,
  includeScore: true,
  includeMatches: true,
  minMatchCharLength: 2,
}

export interface SearchEngine {
  search(query: string): SearchRecord[]
}

export function createSearchEngine(index: SearchIndex): SearchEngine {
  const patientFuse = new Fuse(index.patients, patientFuseOptions)
  const medicationFuse = new Fuse(index.medications, medicationFuseOptions)

  return {
    search(query: string): SearchRecord[] {
      const normalizedQuery = normalizeGerman(query)

      const patientResults = patientFuse.search(normalizedQuery, { limit: 10 })
      const medResults = medicationFuse.search(normalizedQuery, { limit: 10 })

      const results: SearchRecord[] = [
        ...patientResults.map((r) => ({ type: 'patient' as const, data: r.item })),
        ...medResults.map((r) => ({ type: 'medication' as const, data: r.item })),
      ]

      return results
    },
  }
}
