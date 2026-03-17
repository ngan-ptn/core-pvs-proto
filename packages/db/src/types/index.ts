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

// 004_clinical
export type ScheinType = '0101' | '0102' | '0103' | '0104'
export type CaseStatus = 'open' | 'billed' | 'cancelled'
export type DiagnosisCertainty = 'V' | 'G' | 'A' | 'Z'

// 005_orders_rx
export type PrescriptionType = 'kassenrezept' | 'privatrezept' | 'btm'
export type PrescriptionStatus = 'draft' | 'signed' | 'dispensed' | 'cancelled'
export type OrderStatus = 'ordered' | 'in_progress' | 'completed' | 'cancelled'
export type ImagingModality = 'xray' | 'ct' | 'mri' | 'ultrasound' | 'other'
export type DocumentType = 'form' | 'lab_report' | 'imaging_report' | 'prescription_print' | 'letter' | 'referral_letter' | 'arztbrief'
export type LetterSentVia = 'kim' | 'print' | 'fax' | 'email'
export type LetterStatus = 'draft' | 'finalized' | 'sent'

// 006_referral
export type ReferralDirection = 'incoming' | 'outgoing'
export type ReferralUrgency = 'routine' | 'urgent' | 'emergency'
export type ReferralStatus = 'pending' | 'accepted' | 'in_treatment' | 'completed' | 'declined'

// 007_patient_details
export type ConsentType = 'data_usage' | 'data_sharing' | 'living_will' | 'contact_agreement' | 'billing_submission' | 'medical_history'
export type ContactRelationship = 'spouse' | 'parent' | 'child' | 'sibling' | 'guardian' | 'other'
export type HistoryType = 'past_diagnosis' | 'past_procedure' | 'past_medication' | 'pregnancy'

// 008_encounter_extensions
export type ServiceStatus = 'documented' | 'billed' | 'cancelled'
export type NoteType = 'soap_s' | 'soap_o' | 'soap_a' | 'soap_p' | 'free_text' | 'clinical'

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

// 004_clinical

export interface TreatmentCase {
  id: string
  patient_id: string
  practice_id: string
  doctor_id: string
  patient_insurance_id: string
  quarter: string
  schein_type: ScheinType
  status: CaseStatus
  opened_at: string
  closed_at: string | null
  created_at: string
  updated_at: string
}

export interface Encounter {
  id: string
  treatment_case_id: string
  practice_id: string
  doctor_id: string
  encounter_date: string
  chief_complaint: string | null
  notes: string | null
  created_at: string
  updated_at: string
}

export interface Diagnosis {
  id: string
  treatment_case_id: string
  encounter_id: string | null
  icd_code: string
  icd_display: string | null
  certainty: DiagnosisCertainty
  is_permanent: number
  diagnosed_at: string
  notes: string | null
  created_at: string
  updated_at: string
}

export interface VitalSigns {
  id: string
  patient_id: string
  encounter_id: string | null
  measured_at: string
  height_cm: number | null
  weight_kg: number | null
  bmi: number | null
  systolic_bp: number | null
  diastolic_bp: number | null
  heart_rate: number | null
  temperature_c: number | null
  respiratory_rate: number | null
  oxygen_saturation: number | null
  notes: string | null
  measured_by: string | null
  created_at: string
  updated_at: string
}

// 005_orders_rx

export interface Medication {
  id: string
  pzn: string
  name: string
  active_ingredient: string | null
  dosage_form: string | null
  strength: string | null
  created_at: string
  updated_at: string
}

export interface Prescription {
  id: string
  treatment_case_id: string
  doctor_id: string
  medication_id: string | null
  medication_name: string
  medication_pzn: string | null
  dosage_instructions: string | null
  quantity: string | null
  prescription_type: PrescriptionType
  status: PrescriptionStatus
  prescribed_at: string
  created_at: string
  updated_at: string
}

export interface LabOrder {
  id: string
  treatment_case_id: string
  doctor_id: string
  description: string
  status: OrderStatus
  result_summary: string | null
  result_details: string | null
  ordered_at: string
  completed_at: string | null
  created_at: string
  updated_at: string
}

export interface ImagingOrder {
  id: string
  treatment_case_id: string
  doctor_id: string
  modality: ImagingModality | null
  body_region: string | null
  description: string
  status: OrderStatus
  result_summary: string | null
  result_details: string | null
  ordered_at: string
  completed_at: string | null
  created_at: string
  updated_at: string
}

export interface Document {
  id: string
  patient_id: string
  treatment_case_id: string | null
  document_type: DocumentType
  title: string
  content: string | null
  generated_by: string | null
  generated_at: string
  created_at: string
  updated_at: string
}

export interface DoctorLetter {
  id: string
  document_id: string
  encounter_id: string | null
  treatment_case_id: string | null
  recipient_name: string
  recipient_institution: string | null
  recipient_address: string | null
  recipient_lanr: string | null
  recipient_bsnr: string | null
  purpose: string
  sent_via: LetterSentVia | null
  sent_at: string | null
  status: LetterStatus
  created_at: string
  updated_at: string
}

// 006_referral

export interface Referral {
  id: string
  patient_id: string
  treatment_case_id: string | null
  direction: ReferralDirection
  from_practice_id: string | null
  from_doctor_id: string | null
  from_external_name: string | null
  from_external_id: string | null
  to_practice_id: string | null
  to_doctor_id: string | null
  to_external_name: string | null
  to_external_id: string | null
  reason: string | null
  diagnosis_at_referral: string | null
  specialty: string | null
  urgency: ReferralUrgency
  status: ReferralStatus
  referred_at: string
  accepted_at: string | null
  completed_at: string | null
  notes: string | null
  created_at: string
  updated_at: string
}

// 007_patient_details

export interface PatientConsent {
  id: string
  patient_id: string
  consent_type: ConsentType
  is_granted: number
  granted_at: string | null
  revoked_at: string | null
  notes: string | null
  created_at: string
  updated_at: string
}

export interface PatientContact {
  id: string
  patient_id: string
  relationship: ContactRelationship
  first_name: string
  last_name: string
  phone: string | null
  mobile: string | null
  email: string | null
  is_emergency: number
  notes: string | null
  created_at: string
  updated_at: string
}

export interface PatientHistory {
  id: string
  patient_id: string
  history_type: HistoryType
  description: string
  icd_code: string | null
  date_recorded: string | null
  date_resolved: string | null
  details: string | null
  created_at: string
  updated_at: string
}

export interface PatientNote {
  id: string
  patient_id: string
  author_id: string | null
  content: string
  is_pinned: number
  created_at: string
  updated_at: string
}

// 008_encounter_extensions

export interface EncounterService {
  id: string
  encounter_id: string
  gop_code: string
  description: string | null
  quantity: number
  status: ServiceStatus
  performed_by: string | null
  performed_at: string | null
  created_at: string
  updated_at: string
}

export interface EncounterNote {
  id: string
  encounter_id: string
  note_type: NoteType
  content: string
  author_id: string | null
  created_at: string
  updated_at: string
}
