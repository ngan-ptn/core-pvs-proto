import { useTranslation } from 'react-i18next'
import { Button } from '@tini/ui'

export function LanguageSwitcher() {
  const { i18n } = useTranslation()
  const currentLang = i18n.language

  function toggleLanguage() {
    const next = currentLang === 'de' ? 'en' : 'de'
    i18n.changeLanguage(next)
    localStorage.setItem('pvs-language', next)
  }

  return (
    <Button variant="outline" size="sm" onClick={toggleLanguage}>
      {currentLang === 'de' ? 'EN' : 'DE'}
    </Button>
  )
}
