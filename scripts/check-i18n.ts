import fs from 'node:fs'
import path from 'node:path'

const LOCALE_DIRS = [
  'packages/shared/src/i18n/locales',
  'apps/main-app/src/i18n/locales',
  'apps/event-demo/src/i18n/locales',
]

const LANGUAGES = ['en', 'de']

interface CheckResult {
  file: string
  issues: string[]
}

function flattenKeys(obj: Record<string, unknown>, prefix = ''): string[] {
  const keys: string[] = []
  for (const [key, value] of Object.entries(obj)) {
    const fullKey = prefix ? `${prefix}.${key}` : key
    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      keys.push(...flattenKeys(value as Record<string, unknown>, fullKey))
    } else {
      keys.push(fullKey)
    }
  }
  return keys.sort()
}

function findLocaleFiles(dir: string): Map<string, Map<string, string>> {
  // Map<namespace, Map<lang, filepath>>
  const result = new Map<string, Map<string, string>>()
  const absDir = path.resolve(dir)

  for (const lang of LANGUAGES) {
    const langDir = path.join(absDir, lang)
    if (!fs.existsSync(langDir)) continue

    const files = fs.readdirSync(langDir).filter((f) => f.endsWith('.json'))
    for (const file of files) {
      const ns = path.basename(file, '.json')
      if (!result.has(ns)) result.set(ns, new Map())
      result.get(ns)!.set(lang, path.join(langDir, file))
    }
  }

  return result
}

function checkFile(filePath: string): CheckResult {
  const issues: string[] = []

  // Check valid JSON
  let data: Record<string, unknown>
  try {
    const raw = fs.readFileSync(filePath, 'utf-8')
    data = JSON.parse(raw)
  } catch {
    issues.push('Invalid JSON')
    return { file: filePath, issues }
  }

  // Check for empty string values
  const keys = flattenKeys(data)
  for (const key of keys) {
    const value = key.split('.').reduce<unknown>((obj, k) => {
      if (obj && typeof obj === 'object') return (obj as Record<string, unknown>)[k]
      return undefined
    }, data)

    if (value === '') {
      issues.push(`Empty value for key "${key}"`)
    }
  }

  return { file: filePath, issues }
}

let hasErrors = false

for (const dir of LOCALE_DIRS) {
  const absDir = path.resolve(dir)
  if (!fs.existsSync(absDir)) {
    console.log(`⚠ Skipping ${dir} (not found)`)
    continue
  }

  const namespaces = findLocaleFiles(dir)

  for (const [ns, langs] of namespaces) {
    // Check all languages exist for this namespace
    for (const lang of LANGUAGES) {
      if (!langs.has(lang)) {
        console.error(`✗ Missing ${lang}/${ns}.json in ${dir}`)
        hasErrors = true
      }
    }

    // Check key parity between languages
    if (langs.size === LANGUAGES.length) {
      const keysByLang = new Map<string, string[]>()

      for (const [lang, filePath] of langs) {
        // Check individual file
        const result = checkFile(filePath)
        if (result.issues.length > 0) {
          for (const issue of result.issues) {
            console.error(`✗ ${filePath}: ${issue}`)
          }
          hasErrors = true
        }

        const raw = fs.readFileSync(filePath, 'utf-8')
        const data = JSON.parse(raw)
        keysByLang.set(lang, flattenKeys(data))
      }

      // Compare key sets
      const refLang = LANGUAGES[0]
      const refKeys = new Set(keysByLang.get(refLang)!)

      for (const lang of LANGUAGES.slice(1)) {
        const langKeys = new Set(keysByLang.get(lang)!)

        for (const key of refKeys) {
          if (!langKeys.has(key)) {
            console.error(
              `✗ Missing key "${key}" in ${lang}/${ns}.json (exists in ${refLang}) — ${dir}`,
            )
            hasErrors = true
          }
        }

        for (const key of langKeys) {
          if (!refKeys.has(key)) {
            console.error(
              `✗ Extra key "${key}" in ${lang}/${ns}.json (not in ${refLang}) — ${dir}`,
            )
            hasErrors = true
          }
        }
      }
    }
  }
}

if (hasErrors) {
  console.error('\n✗ i18n check failed. Fix the issues above.')
  process.exit(1)
} else {
  console.log('✓ i18n check passed. All locale files are in sync.')
}
