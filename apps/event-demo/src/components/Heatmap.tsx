import { cn, Tooltip, TooltipTrigger, TooltipContent } from '@tini/ui'
import type { HeatmapCell } from '../data/types'
import { useTranslation } from '../i18n/useTranslation'

interface HeatmapProps {
  data: HeatmapCell[]
  days: string[]
  hours: string[]
}

function getSeverityClass(value: number): string {
  if (value >= 25) return 'bg-[var(--severity-10)]'
  if (value >= 20) return 'bg-[var(--severity-8)]'
  if (value >= 15) return 'bg-[var(--severity-6)]'
  if (value >= 12) return 'bg-[var(--severity-4)]'
  if (value >= 10) return 'bg-[var(--severity-2)]'
  return 'bg-[var(--severity-0)]'
}

function getTextClass(value: number): string {
  return value >= 20 ? 'text-white' : 'text-[var(--color-text-primary)]'
}

export function Heatmap({ data, days, hours }: HeatmapProps) {
  const { t } = useTranslation()
  const dataMap = new Map(data.map(d => [`${d.day}-${d.hour}`, d.value]))
  const avgValue = data.length > 0
    ? Math.round(data.reduce((s, d) => s + d.value, 0) / data.length * 10) / 10
    : 0

  return (
    <div className="overflow-x-auto" role="grid" aria-label={t('noShowTab.heatmapTitle')}>
      <div
        className="grid gap-1"
        style={{ gridTemplateColumns: `60px repeat(${hours.length}, 1fr)` }}
      >
        <div role="columnheader" />
        {hours.map(h => (
          <div key={h} role="columnheader" className="text-xs font-semibold tracking-figma text-[var(--color-text-placeholder)] text-center py-1 uppercase">
            {h}
          </div>
        ))}

        {days.map(day => (
          <div key={day} role="row" className="contents">
            <div role="rowheader" className="text-xs font-semibold tracking-figma text-[var(--color-text-primary)] flex items-center">
              {day}
            </div>
            {hours.map(hour => {
              const value = dataMap.get(`${day}-${hour}`) ?? 0
              const isCritical = value >= 20
              return (
                <Tooltip key={`${day}-${hour}`}>
                  <TooltipTrigger asChild>
                    <div
                      role="gridcell"
                      tabIndex={0}
                      aria-label={`${day} ${hour}: ${value}%${isCritical ? ` — ${t('common.critical')}` : ''}`}
                      className={cn(
                        'rounded text-xs font-semibold tracking-figma text-center py-2 cursor-default transition-transform hover:scale-105 focus-visible:scale-105',
                        getSeverityClass(value),
                        getTextClass(value),
                        isCritical && 'ring-2 ring-[var(--status-critical)]'
                      )}
                    >
                      {value}%
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="text-sm font-semibold tracking-figma">{day} {hour}: {value}%</p>
                    <p className="text-xs tracking-figma text-[var(--color-text-placeholder)]">
                      {t('common.mvzAverage')}: {avgValue}%{isCritical ? ` | ${t('common.critical')}` : ''}
                    </p>
                  </TooltipContent>
                </Tooltip>
              )
            })}
          </div>
        ))}
      </div>
    </div>
  )
}
