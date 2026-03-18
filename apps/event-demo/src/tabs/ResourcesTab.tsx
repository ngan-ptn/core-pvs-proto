import { HorizontalBarChart } from '../components/HorizontalBarChart'
import { SlotsTable } from '../components/SlotsTable'
import { RecommendationCard } from '../components/RecommendationCard'
import { EmptyState } from '../components/EmptyState'
import { useDashboardData } from '../hooks/useDashboardData'
import { useTranslation } from '../i18n/useTranslation'
import { locationNames } from '../data/fixtures'

export function ResourcesTab() {
  const { t } = useTranslation()
  const { deviceUtilizations, availableSlots, recommendationData } = useDashboardData()

  const barData = [...deviceUtilizations]
    .sort((a, b) => b.utilization - a.utilization)
    .map(d => ({
      name: `${d.device} (${locationNames[d.location]?.split(' ')[1] ?? d.location})`,
      value: d.utilization,
      status: d.status,
    }))

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-base font-semibold leading-6 tracking-figma text-[var(--color-text-primary)] mb-4">{t('resources.barTitle')}</h2>
        {barData.length > 0 ? (
          <HorizontalBarChart
            data={barData}
            referenceLine={{ value: 40, label: t('resources.underutilizedThreshold') }}
            unit="%"
            colorFn={(d) => d.value < 40 ? 'var(--status-normal)' : 'var(--chart-1)'}
          />
        ) : (
          <EmptyState />
        )}
      </div>

      <div>
        <h2 className="text-base font-semibold leading-6 tracking-figma text-[var(--color-text-primary)] mb-4">{t('resources.slotsTitle')}</h2>
        {availableSlots.length > 0 ? (
          <SlotsTable data={availableSlots} />
        ) : (
          <EmptyState titleKey="empty.noSlots" messageKey="empty.noSlotsMessage" />
        )}
      </div>

      <RecommendationCard data={recommendationData} />
    </div>
  )
}
