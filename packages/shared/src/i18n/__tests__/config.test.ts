import { describe, it, expect } from 'vitest'
import { createI18nConfig, sharedResources } from '../config'

describe('createI18nConfig', () => {
  it('returns a valid i18next config with shared resources', () => {
    const config = createI18nConfig()

    expect(config.fallbackLng).toBe('en')
    expect(config.defaultNS).toBe('common')
    expect(config.ns).toEqual(['common', 'medical'])
    expect(config.interpolation).toEqual({ escapeValue: false })
    expect(config.returnNull).toBe(false)
    expect(config.returnEmptyString).toBe(false)
  })

  it('includes en and de shared resources', () => {
    const config = createI18nConfig()
    const resources = config.resources as Record<string, Record<string, unknown>>

    expect(resources.en).toBeDefined()
    expect(resources.de).toBeDefined()
    expect(resources.en.common).toBeDefined()
    expect(resources.en.medical).toBeDefined()
    expect(resources.de.common).toBeDefined()
    expect(resources.de.medical).toBeDefined()
  })

  it('merges app-specific resources without overwriting shared ones', () => {
    const appResources = {
      en: { app: { title: 'My App' } },
      de: { app: { title: 'Meine App' } },
    }

    const config = createI18nConfig(appResources)
    const resources = config.resources as Record<string, Record<string, unknown>>

    expect(resources.en.app).toEqual({ title: 'My App' })
    expect(resources.de.app).toEqual({ title: 'Meine App' })
    // shared namespaces still present
    expect(resources.en.common).toBeDefined()
    expect(resources.de.medical).toBeDefined()
  })

  it('works without app resources', () => {
    const config = createI18nConfig()
    const resources = config.resources as Record<string, Record<string, unknown>>

    expect(Object.keys(resources)).toEqual(['en', 'de'])
  })
})

describe('sharedResources', () => {
  it('has matching keys between en and de for common namespace', () => {
    const enKeys = Object.keys(
      sharedResources.en.common as Record<string, unknown>,
    ).sort()
    const deKeys = Object.keys(
      sharedResources.de.common as Record<string, unknown>,
    ).sort()
    expect(enKeys).toEqual(deKeys)
  })

  it('has matching keys between en and de for medical namespace', () => {
    const enKeys = Object.keys(
      sharedResources.en.medical as Record<string, unknown>,
    ).sort()
    const deKeys = Object.keys(
      sharedResources.de.medical as Record<string, unknown>,
    ).sort()
    expect(enKeys).toEqual(deKeys)
  })
})
