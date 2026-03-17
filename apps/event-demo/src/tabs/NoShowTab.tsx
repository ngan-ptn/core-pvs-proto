import { HorizontalBarChart } from '../components/HorizontalBarChart'
import { Heatmap } from '../components/Heatmap'
import { PatternCard } from '../components/PatternCard'
import { useDashboardData } from '../hooks/useDashboardData'
import { useTranslation } from '../i18n/useTranslation'

const days = ['Mo', 'Di', 'Mi', 'Do', 'Fr']
const hours = ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00']

export function NoShowTab() {
  const { t } = useTranslation()
  const { locationKpis, noShowHeatmap, patternData } = useDashboardData()

  const barData = [...locationKpis]
    .sort((a, b) => b.noShow.value - a.noShow.value)
    .map(l => ({
      name: l.name,
      value: l.noShow.value,
      status: l.noShow.status,
    }))

  const mvzAvg = locationKpis.reduce((s, l) => s + l.noShow.value, 0) / locationKpis.length

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold mb-4">{t('noShowTab.barTitle')}</h2>
        <HorizontalBarChart
          data={barData}
          referenceLine={{ value: Math.round(mvzAvg * 10) / 10, label: `${t('common.mvzAverage')} ${Math.round(mvzAvg * 10) / 10}%` }}
          unit="%"
          tooltipFormatter={(d) => `${d.name}: ${d.value}% | ${t('common.mvzAverage')}: ${Math.round(mvzAvg * 10) / 10}% | ${t('common.critical')}`}
        />
      </div>

      <div>
        <h2 className="text-lg font-semibold mb-1">{t('noShowTab.heatmapTitle')}</h2>
        <p className="text-sm text-muted-foreground mb-4">{t('noShowTab.heatmapSubtitle')}</p>
        <Heatmap data={noShowHeatmap} days={days} hours={hours} />
      </div>

      <PatternCard data={patternData} />
    </div>
  )
}
