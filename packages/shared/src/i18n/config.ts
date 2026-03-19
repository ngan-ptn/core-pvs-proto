import type { InitOptions, Resource, ResourceLanguage } from 'i18next'

import enCommon from './locales/en/common.json'
import enMedical from './locales/en/medical.json'
import deCommon from './locales/de/common.json'
import deMedical from './locales/de/medical.json'

const sharedResources: Resource = {
  en: { common: enCommon, medical: enMedical },
  de: { common: deCommon, medical: deMedical },
}

/**
 * Returns an i18next config object. Each app calls i18next.init() exactly once
 * with the result of this function, merging in app-specific resources.
 */
export function createI18nConfig(
  appResources?: Record<string, ResourceLanguage>,
): InitOptions {
  const resources: Resource = { ...sharedResources }

  if (appResources) {
    for (const lang of Object.keys(appResources)) {
      resources[lang] = { ...resources[lang], ...appResources[lang] }
    }
  }

  return {
    resources,
    fallbackLng: 'en',
    defaultNS: 'common',
    ns: ['common', 'medical'],
    interpolation: { escapeValue: false },
    returnNull: false,
    returnEmptyString: false,
  }
}

export { sharedResources }
