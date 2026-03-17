import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import { createI18nConfig } from '@pvs/shared'

import enApp from './locales/en/app.json'
import deApp from './locales/de/app.json'

const config = createI18nConfig({
  en: { app: enApp },
  de: { app: deApp },
})

i18n.use(initReactI18next).init({
  ...config,
  ns: [...(config.ns as string[]), 'app'],
})

i18n.on('languageChanged', (lng) => {
  document.documentElement.lang = lng
})

export default i18n
