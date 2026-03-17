export type Status = 'critical' | 'warning' | 'normal' | 'neutral'

export interface KpiValue {
  value: number
  unit: string
  delta: number
  deltaUnit: string
  status: Status
  sparkline: number[]
}

export interface LocationKpis {
  id: string
  name: string
  noShow: KpiValue
  treatmentDuration: KpiValue
  deviceUtilization: KpiValue
  availableSlots: KpiValue
}

export interface AggregateKpis {
  noShow: KpiValue
  treatmentDuration: KpiValue
  deviceUtilization: KpiValue
  availableSlots: KpiValue
}

export interface HeatmapCell {
  day: string
  hour: string
  value: number
}

export interface SpecialtyDuration {
  specialty: string
  avg: number
  benchmark: number
  delta: number
  status: Status
}

export interface Practitioner {
  id: string
  avg: number
  benchmark: number
  delta: number
}

export interface DeviceUtilization {
  device: string
  location: string
  utilization: number
  status: Status
}

export interface AvailableSlot {
  location: string
  specialty: string
  timeWindow: string
  count: number
}

export interface PatternData {
  messageKey: string
  confidence: string
  basedOnWeeks: number
  location: string
  threshold: string
}

export interface RecommendationData {
  messageKey: string
  impact: string
  factors: { labelKey: string; value: string; check: boolean }[]
  disclaimerKey: string
}

export type TabId = 'overview' | 'noShow' | 'treatmentDuration' | 'resources'

export type DatePreset = 'thisMonth' | 'thisQuarter' | 'lastQuarter'
