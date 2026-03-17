import { describe, it, expect, beforeEach } from 'vitest'
import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import { createI18nConfig } from '@pvs/shared'

import enApp from '../locales/en/app.json'
import deApp from '../locales/de/app.json'

function initTestI18n() {
  const instance = i18n.createInstance()
  const config = createI18nConfig({
    en: { app: enApp },
    de: { app: deApp },
  })

  instance.use(initReactI18next).init({
    ...config,
    ns: [...(config.ns as string[]), 'app'],
    lng: 'en',
  })

  return instance
}

describe('event-demo i18n', () => {
  let instance: ReturnType<typeof i18n.createInstance>

  beforeEach(() => {
    instance = initTestI18n()
  })

  it('initializes with English as default', () => {
    expect(instance.language).toBe('en')
  })

  it('loads all namespaces', () => {
    expect(instance.hasResourceBundle('en', 'common')).toBe(true)
    expect(instance.hasResourceBundle('en', 'medical')).toBe(true)
    expect(instance.hasResourceBundle('en', 'app')).toBe(true)
    expect(instance.hasResourceBundle('de', 'common')).toBe(true)
    expect(instance.hasResourceBundle('de', 'medical')).toBe(true)
    expect(instance.hasResourceBundle('de', 'app')).toBe(true)
  })

  it('translates app-specific keys', () => {
    expect(instance.t('app:title')).toBe('Event Demo')
    expect(instance.t('app:description')).toContain('Event demo')
  })

  it('translates shared common keys', () => {
    expect(instance.t('common:actions.save')).toBe('Save')
    expect(instance.t('common:actions.cancel')).toBe('Cancel')
  })

  it('translates shared medical keys', () => {
    expect(instance.t('medical:patient')).toBe('Patient')
    expect(instance.t('medical:diagnosis')).toBe('Diagnosis')
  })

  it('switches to German', async () => {
    await instance.changeLanguage('de')
    expect(instance.t('app:title')).toBe('Event-Demo')
    expect(instance.t('common:actions.save')).toBe('Speichern')
    expect(instance.t('medical:diagnosis')).toBe('Diagnose')
  })

  it('supports pluralization', () => {
    expect(instance.t('medical:patient', { count: 1 })).toBe('1 patient')
    expect(instance.t('medical:patient', { count: 3 })).toBe('3 patients')
  })

  it('supports German pluralization', async () => {
    await instance.changeLanguage('de')
    expect(instance.t('medical:patient', { count: 1 })).toBe('1 Patient')
    expect(instance.t('medical:patient', { count: 3 })).toBe('3 Patienten')
  })

  it('falls back to English for missing German keys', async () => {
    instance.addResourceBundle('en', 'app', { onlyInEn: 'English only' })
    await instance.changeLanguage('de')
    expect(instance.t('app:onlyInEn')).toBe('English only')
  })
})
