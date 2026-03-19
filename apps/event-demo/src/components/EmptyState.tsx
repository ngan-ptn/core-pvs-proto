import { Card, CardContent } from '@tini/ui'
import { Inbox } from 'lucide-react'
import { useTranslation } from '../i18n/useTranslation'

interface EmptyStateProps {
  titleKey?: string
  messageKey?: string
}

export function EmptyState({ titleKey = 'empty.defaultTitle', messageKey = 'empty.defaultMessage' }: EmptyStateProps) {
  const { t } = useTranslation()

  return (
    <Card>
      <CardContent className="p-8 flex flex-col items-center gap-3 text-center">
        <div className="w-12 h-12 rounded-full bg-[var(--color-surface-muted)] flex items-center justify-center">
          <Inbox className="w-6 h-6 text-[var(--color-text-muted-icon)]" />
        </div>
        <h3 className="text-sm font-semibold tracking-figma text-[var(--color-text-primary)]">
          {t(titleKey)}
        </h3>
        <p className="text-xs tracking-figma text-[var(--color-text-placeholder)] max-w-sm">
          {t(messageKey)}
        </p>
      </CardContent>
    </Card>
  )
}
