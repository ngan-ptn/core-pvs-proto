import { KpiCard } from '../components/KpiCard'
import { LocationCard } from '../components/LocationCard'
import { useDashboardData } from '../hooks/useDashboardData'
import { useTranslation } from '../i18n/useTranslation'
import type { TabId } from '../data/types'

interface OverviewTabProps {
  onNavigate: (tab: TabId) => void
}

const kpiConfigs: { key: 'noShow' | 'treatmentDuration' | 'deviceUtilization' | 'availableSlots'; labelKey: string; tooltipKey: string; tab: TabId }[] = [
  { key: 'noShow', labelKey: 'kpis.noShowRate.label', tooltipKey: 'kpis.noShowRate.tooltip', tab: 'noShow' },
  { key: 'treatmentDuration', labelKey: 'kpis.treatmentDuration.label', tooltipKey: 'kpis.treatmentDuration.tooltip', tab: 'treatmentDuration' },
  { key: 'deviceUtilization', labelKey: 'kpis.deviceUtilization.label', tooltipKey: 'kpis.deviceUtilization.tooltip', tab: 'resources' },
  { key: 'availableSlots', labelKey: 'kpis.availableSlots.label', tooltipKey: 'kpis.availableSlots.tooltip', tab: 'resources' },
]

export function OverviewTab({ onNavigate }: OverviewTabProps) {
  const { t } = useTranslation()
  const { aggregateKpis, locationKpis } = useDashboardData()

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-4 gap-4">
        {kpiConfigs.map(({ key, labelKey, tooltipKey, tab }) => (
          <KpiCard
            key={key}
            label={t(labelKey)}
            kpi={aggregateKpis[key]}
            tooltipText={t(tooltipKey)}
            onClick={() => onNavigate(tab)}
          />
        ))}
      </div>

      <div>
        <h2 className="text-lg font-semibold mb-4">{t('overview.locationsTitle')}</h2>
        <div className="grid grid-cols-2 gap-4">
          {locationKpis.map(loc => (
            <LocationCard key={loc.id} location={loc} onNavigate={onNavigate} />
          ))}
        </div>
      </div>
    </div>
  )
}
