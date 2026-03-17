import { Card, CardContent, Badge, Button } from '@tini/ui'
import { AlertTriangle } from 'lucide-react'
import type { PatternData } from '../data/types'
import { useTranslation } from '../i18n/useTranslation'

interface PatternCardProps {
  data: PatternData
}

const confidenceVariant: Record<string, 'default' | 'secondary' | 'warning'> = {
  high: 'default',
  medium: 'warning',
  low: 'secondary',
}

export function PatternCard({ data }: PatternCardProps) {
  const { t } = useTranslation()

  return (
    <Card>
      <CardContent className="p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-[var(--status-warning)]" />
            <span className="font-semibold text-sm">{t('patterns.title')}</span>
          </div>
          <Badge variant={confidenceVariant[data.confidence] ?? 'secondary'}>
            {t(`patterns.${data.confidence}`)}
          </Badge>
        </div>
        <p className="text-sm italic">
          &ldquo;{t(data.messageKey)}&rdquo;
        </p>
        <div className="text-xs text-muted-foreground space-y-1">
          <p>{t('patterns.basedOn', { weeks: data.basedOnWeeks, location: t(`locations.${data.location}`) })}</p>
          <p>{t('patterns.threshold', { value: data.threshold })}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">{t('patterns.viewData')}</Button>
          <Button variant="ghost" size="sm">{t('patterns.dismiss')}</Button>
        </div>
      </CardContent>
    </Card>
  )
}
