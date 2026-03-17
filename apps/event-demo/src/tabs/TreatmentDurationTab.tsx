import { useState } from 'react'
import { Card, CardContent, Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@tini/ui'
import { Info } from 'lucide-react'
import { HorizontalBarChart } from '../components/HorizontalBarChart'
import { DotPlot } from '../components/DotPlot'
import { useDashboardData } from '../hooks/useDashboardData'
import { useTranslation } from '../i18n/useTranslation'

export function TreatmentDurationTab() {
  const { t } = useTranslation()
  const { specialtyDurations, practitioners } = useDashboardData()
  const [selectedSpecialty, setSelectedSpecialty] = useState(specialtyDurations[0].specialty)

  const barData = specialtyDurations.map(s => ({
    name: s.specialty,
    value: s.avg,
    status: s.status,
  }))

  const mvzAvg = Math.round(specialtyDurations.reduce((s, d) => s + d.avg, 0) / specialtyDurations.length)

  const currentSpecialty = specialtyDurations.find(s => s.specialty === selectedSpecialty)
  const currentPractitioners = practitioners[selectedSpecialty] ?? []

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-base font-semibold leading-6 tracking-figma text-[var(--color-text-primary)] mb-4">{t('treatment.barTitle')}</h2>
        <HorizontalBarChart
          data={barData}
          referenceLine={{ value: mvzAvg, label: `${t('common.mvzAverage')} ${mvzAvg} min` }}
          unit=" min"
        />
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold leading-6 tracking-figma text-[var(--color-text-primary)]">{t('treatment.dotPlotTitle')}</h2>
          <Select value={selectedSpecialty} onValueChange={setSelectedSpecialty}>
            <SelectTrigger className="w-[200px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {specialtyDurations.map(s => (
                <SelectItem key={s.specialty} value={s.specialty}>
                  {s.specialty}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        {currentPractitioners.length > 0 && currentSpecialty && (
          <DotPlot data={currentPractitioners} benchmark={currentSpecialty.benchmark} />
        )}
        <div className="flex justify-between text-xs tracking-figma text-[var(--color-text-placeholder)] mt-1 px-[100px]">
          <span>{t('treatment.shorterLabel')}</span>
          <span>{t('treatment.longerLabel')}</span>
        </div>
      </div>

      <Card className="bg-[var(--color-surface-muted)]">
        <CardContent className="p-4 flex items-start gap-3">
          <Info className="w-5 h-5 text-[var(--color-text-muted-icon)] mt-0.5 shrink-0" />
          <p className="text-sm tracking-figma text-[var(--color-text-placeholder)]">{t('treatment.disclaimer')}</p>
        </CardContent>
      </Card>
    </div>
  )
}
