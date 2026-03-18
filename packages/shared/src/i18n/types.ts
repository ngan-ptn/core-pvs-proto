import type enCommon from './locales/en/common.json'
import type enMedical from './locales/en/medical.json'

export interface SharedResources {
  common: typeof enCommon
  medical: typeof enMedical
}
