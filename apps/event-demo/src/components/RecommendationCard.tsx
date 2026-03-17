import { Card, CardContent, Badge, Button } from '@tini/ui'
import { Lightbulb, Check, Info } from 'lucide-react'
import type { RecommendationData } from '../data/types'
import { useTranslation } from '../i18n/useTranslation'

interface RecommendationCardProps {
  data: RecommendationData
}

const impactVariant: Record<string, 'default' | 'secondary' | 'warning'> = {
  high: 'default',
  medium: 'warning',
  low: 'secondary',
}

export function RecommendationCard({ data }: RecommendationCardProps) {
  const { t } = useTranslation()

  return (
    <Card>
      <CardContent className="p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Lightbulb className="w-4 h-4 text-[var(--status-warning)]" />
            <span className="font-semibold text-sm">{t('recommendations.title')}</span>
          </div>
          <Badge variant={impactVariant[data.impact] ?? 'secondary'}>
            {t(`recommendations.${data.impact}`)}
          </Badge>
        </div>
        <p className="text-sm italic">
          &ldquo;{t(data.messageKey)}&rdquo;
        </p>
        <div className="space-y-1.5">
          <p className="text-xs font-medium text-muted-foreground">{t('recommendations.factors.title')}:</p>
          {data.factors.map((f, i) => (
            <div key={i} className="flex items-center gap-2 text-xs">
              {f.check ? (
                <Check className="w-3.5 h-3.5 text-[var(--status-normal)]" />
              ) : (
                <Info className="w-3.5 h-3.5 text-muted-foreground" />
              )}
              <span>
                {t(f.labelKey)}{f.value ? `: ${f.value}` : ''}
                {!f.check && f.value ? ` ${t('common.crossover')}` : ''}
              </span>
            </div>
          ))}
        </div>
        <div className="rounded bg-muted p-2 text-xs text-muted-foreground">
          {t(data.disclaimerKey)}
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">{t('recommendations.viewDetails')}</Button>
          <Button variant="ghost" size="sm">{t('recommendations.defer')}</Button>
          <Button variant="ghost" size="sm">{t('recommendations.dismiss')}</Button>
        </div>
      </CardContent>
    </Card>
  )
}
