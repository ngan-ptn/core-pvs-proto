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

  return (
    <div className="overflow-x-auto">
      <div
        className="grid gap-1"
        style={{ gridTemplateColumns: `60px repeat(${hours.length}, 1fr)` }}
      >
        <div />
        {hours.map(h => (
          <div key={h} className="text-xs font-semibold tracking-figma text-[var(--color-text-placeholder)] text-center py-1 uppercase">
            {h}
          </div>
        ))}

        {days.map(day => (
          <>
            <div key={`label-${day}`} className="text-xs font-semibold tracking-figma text-[var(--color-text-primary)] flex items-center">
              {day}
            </div>
            {hours.map(hour => {
              const value = dataMap.get(`${day}-${hour}`) ?? 0
              const isCritical = value >= 20
              return (
                <Tooltip key={`${day}-${hour}`}>
                  <TooltipTrigger asChild>
                    <div
                      className={cn(
                        'rounded text-xs font-semibold tracking-figma text-center py-2 cursor-default transition-transform hover:scale-105',
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
                      {t('common.mvzAverage')}: 12% | {t('common.critical')}
                    </p>
                  </TooltipContent>
                </Tooltip>
              )
            })}
          </>
        ))}
      </div>
    </div>
  )
}
