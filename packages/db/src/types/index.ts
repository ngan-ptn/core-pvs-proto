// Domain types — browser-safe, zero dependencies
// Types are added incrementally per migration batch

// ─── Enums ──────────────────────────────────────────────────────────

// 002_foundation
export type UserType = 'doctor' | 'mfa'
export type UserRole = 'admin' | 'billing' | 'view_only' | 'standard'
export type Salutation = 'herr' | 'frau' | 'divers' | 'kind'
export type Gender = 'M' | 'W' | 'D' | 'X'
export type SourceSystem = 'pvs' | 'hospital_his' | 'referral' | 'migration'
export type BloodType = 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | '0+' | '0-'
export type AddressType = 'home' | 'billing' | 'additional'

// 003_insurance
export type InsuranceType = 'GKV' | 'PKV' | 'BG' | 'SZ'
export type InsuranceStatus = '1' | '3' | '5'

// ─── Row interfaces ─────────────────────────────────────────────────

// 002_foundation

export interface Organization {
  id: string
  name: string
  short_name: string | null
  contact_email: string | null
  contact_phone: string | null
  created_at: string
  updated_at: string
}

export interface Practice {
  id: string
  organization_id: string
  name: string
  bsnr: string
  street: string | null
  postal_code: string | null
  city: string | null
  phone: string | null
  email: string | null
  is_active: number
  created_at: string
  updated_at: string
}

export interface User {
  id: string
  user_type: UserType
  first_name: string
  last_name: string
  lanr: string | null
  specialty: string | null
  email: string | null
  is_active: number
  created_at: string
  updated_at: string
}

export interface UserPractice {
  id: string
  user_id: string
  practice_id: string
  role: UserRole
  is_primary: number
  created_at: string
  updated_at: string
}

export interface Patient {
  id: string
  egk_versichertennummer: string | null
  external_patient_id: string | null
  source_system: SourceSystem
  salutation: Salutation | null
  title: string | null
  first_name: string
  last_name: string
  birth_name: string | null
  date_of_birth: string
  gender: Gender | null
  phone: string | null
  mobile: string | null
  email: string | null
  employer_name: string | null
  employer_address: string | null
  blood_type: BloodType | null
  allergies: string | null
  notes: string | null
  is_active: number
  created_at: string
  updated_at: string
}

export interface Address {
  id: string
  patient_id: string
  address_type: AddressType
  label: string | null
  street: string | null
  house_number: string | null
  postal_code: string | null
  city: string | null
  country_code: string
  is_primary: number
  created_at: string
  updated_at: string
}

// 003_insurance

export interface InsuranceProvider {
  id: string
  ik_number: string
  name: string
  short_name: string | null
  insurance_type: InsuranceType
  is_active: number
  successor_id: string | null
  created_at: string
  updated_at: string
}

export interface PatientInsurance {
  id: string
  patient_id: string
  insurance_provider_id: string
  vknr: string | null
  insurance_status: InsuranceStatus | null
  valid_from: string | null
  valid_to: string | null
  is_primary: number
  created_at: string
  updated_at: string
}
