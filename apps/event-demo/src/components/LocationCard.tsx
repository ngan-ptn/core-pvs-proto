import { Card, CardContent, cn } from '@tini/ui'
import { StatusDot } from './StatusDot'
import type { LocationKpis, TabId } from '../data/types'
import { useTranslation } from '../i18n/useTranslation'

interface LocationCardProps {
  location: LocationKpis
  onNavigate: (tab: TabId) => void
}

const kpiKeys: { key: keyof Pick<LocationKpis, 'noShow' | 'treatmentDuration' | 'deviceUtilization' | 'availableSlots'>; labelKey: string; tab: TabId }[] = [
  { key: 'noShow', labelKey: 'overview.noShow', tab: 'noShow' },
  { key: 'treatmentDuration', labelKey: 'overview.treatmentDuration', tab: 'treatmentDuration' },
  { key: 'deviceUtilization', labelKey: 'overview.deviceUtilization', tab: 'resources' },
  { key: 'availableSlots', labelKey: 'overview.availableSlots', tab: 'resources' },
]

export function LocationCard({ location, onNavigate }: LocationCardProps) {
  const { t } = useTranslation()

  const worstStatus = [location.noShow, location.treatmentDuration, location.deviceUtilization, location.availableSlots]
    .reduce((worst, kpi) => {
      const order = { critical: 0, warning: 1, normal: 2, neutral: 3 }
      return order[kpi.status] < order[worst] ? kpi.status : worst
    }, 'neutral' as 'critical' | 'warning' | 'normal' | 'neutral')

  const borderColor = {
    critical: 'border-l-[var(--status-critical)]',
    warning: 'border-l-[var(--status-warning)]',
    normal: '',
    neutral: '',
  }[worstStatus]

  return (
    <Card className={cn('border-l-4', borderColor || 'border-l-transparent')}>
      <CardContent className="p-4">
        <h3 className="font-semibold mb-3">{location.name}</h3>
        <div className="space-y-1.5">
          {kpiKeys.map(({ key, labelKey, tab }) => {
            const kpi = location[key]
            return (
              <button
                key={key}
                className="flex items-center gap-2 w-full text-left text-sm hover:bg-accent/50 rounded px-1 py-0.5 transition-colors"
                onClick={() => onNavigate(tab)}
              >
                <StatusDot status={kpi.status} className="w-2.5 h-2.5" />
                <span className="text-muted-foreground min-w-[80px]">{t(labelKey)}:</span>
                <span className="font-medium">{kpi.value}{kpi.unit}</span>
              </button>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
