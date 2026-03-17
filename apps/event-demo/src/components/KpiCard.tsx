import { Card, CardContent, Tooltip, TooltipTrigger, TooltipContent } from '@tini/ui'
import { StatusDot } from './StatusDot'
import { Sparkline } from './Sparkline'
import type { KpiValue } from '../data/types'
import { useTranslation } from '../i18n/useTranslation'

interface KpiCardProps {
  label: string
  kpi: KpiValue
  tooltipText: string
  onClick?: () => void
}

export function KpiCard({ label, kpi, tooltipText, onClick }: KpiCardProps) {
  const { t } = useTranslation()
  const deltaPrefix = kpi.delta > 0 ? '▲ ' : kpi.delta < 0 ? '▼ ' : '─ '
  const deltaText = `${deltaPrefix}${Math.abs(kpi.delta)}${kpi.deltaUnit}`

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Card
          className="cursor-pointer transition-shadow hover:shadow-md"
          onClick={onClick}
        >
          <CardContent className="p-4 space-y-2">
            <div className="flex items-center gap-2">
              <StatusDot status={kpi.status} />
              <span className="text-xs font-semibold tracking-figma text-[var(--color-text-secondary)] truncate">{label}</span>
            </div>
            <div className="text-2xl font-bold tracking-figma text-[var(--color-text-primary)]">
              {kpi.value}{kpi.unit}
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs tracking-figma text-[var(--color-text-placeholder)]">
                {deltaText} {t('common.vsLastQuarter')}
              </span>
              <Sparkline data={kpi.sparkline} color="var(--color-text-muted-icon)" />
            </div>
          </CardContent>
        </Card>
      </TooltipTrigger>
      <TooltipContent side="bottom" className="max-w-xs">
        <p className="text-sm tracking-figma">{tooltipText}</p>
        <p className="text-xs tracking-figma text-[var(--color-text-placeholder)] mt-1">
          {kpi.value}{kpi.unit} | {deltaText} | {t('common.threshold')}
        </p>
      </TooltipContent>
    </Tooltip>
  )
}
