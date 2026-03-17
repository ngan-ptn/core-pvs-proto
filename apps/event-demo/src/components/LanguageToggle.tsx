import { cn } from '@tini/ui'
import { useTranslation } from '../i18n/useTranslation'

export function LanguageToggle() {
  const { locale, setLocale } = useTranslation()

  return (
    <div className="fixed bottom-4 right-4 z-50 flex rounded-full bg-background/80 backdrop-blur border shadow-sm text-sm overflow-hidden">
      <button
        className={cn(
          'px-3 py-1.5 transition-colors',
          locale === 'de' ? 'bg-primary text-primary-foreground font-medium' : 'text-muted-foreground hover:text-foreground'
        )}
        onClick={() => setLocale('de')}
      >
        DE
      </button>
      <button
        className={cn(
          'px-3 py-1.5 transition-colors',
          locale === 'en' ? 'bg-primary text-primary-foreground font-medium' : 'text-muted-foreground hover:text-foreground'
        )}
        onClick={() => setLocale('en')}
      >
        EN
      </button>
    </div>
  )
}
