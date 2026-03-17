import { useTranslation } from 'react-i18next'
import { Button } from '@tini/ui'
import { LanguageSwitcher } from './components/LanguageSwitcher'

export function App() {
  const { t } = useTranslation('app')

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border px-6 py-4 flex items-center justify-between">
        <h1 className="text-xl font-semibold">{t('title')}</h1>
        <div className="flex items-center gap-2">
          <LanguageSwitcher />
          <Button variant="outline" size="sm">
            {t('nav.toggleTheme')}
          </Button>
        </div>
      </header>

      <main className="p-6 max-w-4xl mx-auto">
        <p className="text-muted-foreground">{t('description')}</p>
      </main>
    </div>
  )
}
