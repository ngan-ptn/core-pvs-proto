import type {
  AggregateKpis,
  LocationKpis,
  HeatmapCell,
  SpecialtyDuration,
  Practitioner,
  DeviceUtilization,
  AvailableSlot,
  PatternData,
  RecommendationData,
} from './types'

export const aggregateKpis: AggregateKpis = {
  noShow: {
    value: 14.2,
    unit: '%',
    delta: 2.1,
    deltaUnit: 'pp',
    status: 'warning',
    sparkline: [10, 11, 11.5, 12, 12.8, 13, 13.5, 14, 14.2],
  },
  treatmentDuration: {
    value: 22,
    unit: 'min',
    delta: 0,
    deltaUnit: 'min',
    status: 'normal',
    sparkline: [22, 21, 22, 23, 22, 22, 21, 22, 22],
  },
  deviceUtilization: {
    value: 71,
    unit: '%',
    delta: -4,
    deltaUnit: '%',
    status: 'normal',
    sparkline: [78, 77, 76, 75, 74, 73, 72, 71, 71],
  },
  availableSlots: {
    value: 47,
    unit: '',
    delta: 12,
    deltaUnit: '',
    status: 'normal',
    sparkline: [30, 32, 34, 36, 38, 40, 42, 45, 47],
  },
}

export const locationKpis: LocationKpis[] = [
  {
    id: 'mitte',
    name: 'Standort Mitte',
    noShow: { value: 11.5, unit: '%', delta: -0.5, deltaUnit: 'pp', status: 'normal', sparkline: [12, 11.8, 11.5, 11.5] },
    treatmentDuration: { value: 21, unit: 'min', delta: -1, deltaUnit: 'min', status: 'normal', sparkline: [22, 22, 21, 21] },
    deviceUtilization: { value: 76, unit: '%', delta: 1, deltaUnit: '%', status: 'normal', sparkline: [74, 75, 76, 76] },
    availableSlots: { value: 8, unit: '', delta: 2, deltaUnit: '', status: 'normal', sparkline: [5, 6, 7, 8] },
  },
  {
    id: 'nord',
    name: 'Standort Nord',
    noShow: { value: 23.1, unit: '%', delta: 5.2, deltaUnit: 'pp', status: 'critical', sparkline: [15, 17, 19, 23.1] },
    treatmentDuration: { value: 24, unit: 'min', delta: 2, deltaUnit: 'min', status: 'warning', sparkline: [22, 23, 23, 24] },
    deviceUtilization: { value: 82, unit: '%', delta: 3, deltaUnit: '%', status: 'normal', sparkline: [78, 80, 81, 82] },
    availableSlots: { value: 5, unit: '', delta: -3, deltaUnit: '', status: 'warning', sparkline: [9, 7, 6, 5] },
  },
  {
    id: 'sued',
    name: 'Standort Süd',
    noShow: { value: 9.8, unit: '%', delta: -1.2, deltaUnit: 'pp', status: 'normal', sparkline: [12, 11, 10, 9.8] },
    treatmentDuration: { value: 20, unit: 'min', delta: -1, deltaUnit: 'min', status: 'normal', sparkline: [21, 21, 20, 20] },
    deviceUtilization: { value: 52, unit: '%', delta: -8, deltaUnit: '%', status: 'normal', sparkline: [62, 58, 55, 52] },
    availableSlots: { value: 18, unit: '', delta: 6, deltaUnit: '', status: 'normal', sparkline: [10, 12, 15, 18] },
  },
  {
    id: 'west',
    name: 'Standort West',
    noShow: { value: 13.2, unit: '%', delta: 0.8, deltaUnit: 'pp', status: 'normal', sparkline: [12, 12.5, 13, 13.2] },
    treatmentDuration: { value: 23, unit: 'min', delta: 1, deltaUnit: 'min', status: 'warning', sparkline: [22, 22, 23, 23] },
    deviceUtilization: { value: 74, unit: '%', delta: -2, deltaUnit: '%', status: 'normal', sparkline: [76, 75, 74, 74] },
    availableSlots: { value: 9, unit: '', delta: 3, deltaUnit: '', status: 'normal', sparkline: [5, 6, 8, 9] },
  },
  {
    id: 'ost',
    name: 'Standort Ost',
    noShow: { value: 12.8, unit: '%', delta: 0.3, deltaUnit: 'pp', status: 'normal', sparkline: [12, 12.2, 12.5, 12.8] },
    treatmentDuration: { value: 22, unit: 'min', delta: 0, deltaUnit: 'min', status: 'normal', sparkline: [22, 22, 22, 22] },
    deviceUtilization: { value: 68, unit: '%', delta: -3, deltaUnit: '%', status: 'normal', sparkline: [72, 70, 69, 68] },
    availableSlots: { value: 7, unit: '', delta: 1, deltaUnit: '', status: 'normal', sparkline: [5, 6, 6, 7] },
  },
]

const days = ['Mo', 'Di', 'Mi', 'Do', 'Fr']
const hours = ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00']

const heatmapRaw: number[][] = [
  [10, 12, 11, 9, 10, 11, 10, 9, 8],
  [28, 26, 19, 12, 11, 13, 10, 9, 8],
  [11, 10, 12, 10, 9, 10, 11, 10, 9],
  [12, 13, 11, 11, 10, 9, 10, 8, 7],
  [9, 10, 10, 8, 9, 8, 9, 7, 6],
]

export const noShowHeatmap: HeatmapCell[] = days.flatMap((day, di) =>
  hours.map((hour, hi) => ({ day, hour, value: heatmapRaw[di][hi] }))
)

export const specialtyDurations: SpecialtyDuration[] = [
  { specialty: 'Orthopädie', avg: 28, benchmark: 25, delta: 3, status: 'warning' },
  { specialty: 'Innere Medizin', avg: 24, benchmark: 22, delta: 2, status: 'normal' },
  { specialty: 'Allgemeinmedizin', avg: 21, benchmark: 20, delta: 1, status: 'normal' },
  { specialty: 'Dermatologie', avg: 19, benchmark: 18, delta: 1, status: 'normal' },
  { specialty: 'HNO', avg: 17, benchmark: 18, delta: -1, status: 'normal' },
]

export const practitioners: Record<string, Practitioner[]> = {
  'Orthopädie': [
    { id: 'Behandler A', avg: 33, benchmark: 25, delta: 8 },
    { id: 'Behandler B', avg: 22, benchmark: 25, delta: -3 },
    { id: 'Behandler C', avg: 24, benchmark: 25, delta: -1 },
    { id: 'Behandler D', avg: 30, benchmark: 25, delta: 5 },
    { id: 'Behandler E', avg: 26, benchmark: 25, delta: 1 },
  ],
  'Innere Medizin': [
    { id: 'Behandler F', avg: 26, benchmark: 22, delta: 4 },
    { id: 'Behandler G', avg: 21, benchmark: 22, delta: -1 },
    { id: 'Behandler H', avg: 23, benchmark: 22, delta: 1 },
  ],
  'Allgemeinmedizin': [
    { id: 'Behandler I', avg: 23, benchmark: 20, delta: 3 },
    { id: 'Behandler J', avg: 19, benchmark: 20, delta: -1 },
    { id: 'Behandler K', avg: 21, benchmark: 20, delta: 1 },
  ],
  'Dermatologie': [
    { id: 'Behandler L', avg: 21, benchmark: 18, delta: 3 },
    { id: 'Behandler M', avg: 17, benchmark: 18, delta: -1 },
  ],
  'HNO': [
    { id: 'Behandler N', avg: 18, benchmark: 18, delta: 0 },
    { id: 'Behandler O', avg: 16, benchmark: 18, delta: -2 },
  ],
}

export const deviceUtilizations: DeviceUtilization[] = [
  { device: 'Ultraschall 1', location: 'nord', utilization: 88, status: 'normal' },
  { device: 'CT', location: 'mitte', utilization: 81, status: 'normal' },
  { device: 'Röntgen', location: 'west', utilization: 74, status: 'normal' },
  { device: 'MRT', location: 'ost', utilization: 68, status: 'normal' },
  { device: 'EKG', location: 'mitte', utilization: 65, status: 'normal' },
  { device: 'Ultraschall 2', location: 'sued', utilization: 35, status: 'normal' },
]

export const availableSlots: AvailableSlot[] = [
  { location: 'sued', specialty: 'Allgemeinmedizin', timeWindow: 'Mo–Fr VM', count: 8 },
  { location: 'sued', specialty: 'Innere Medizin', timeWindow: 'Di, Do NM', count: 6 },
  { location: 'sued', specialty: 'Dermatologie', timeWindow: 'Mi VM', count: 4 },
  { location: 'mitte', specialty: 'HNO', timeWindow: 'Fr VM', count: 3 },
  { location: 'west', specialty: 'Allgemeinmedizin', timeWindow: 'Do NM', count: 2 },
]

export const patternData: PatternData = {
  messageKey: 'patterns.tuesdayMorning',
  confidence: 'medium',
  basedOnWeeks: 12,
  location: 'nord',
  threshold: '>15%',
}

export const recommendationData: RecommendationData = {
  messageKey: 'recommendations.capacityRedistribution',
  impact: 'high',
  factors: [
    { labelKey: 'recommendations.factors.proximity', value: '4 km', check: true },
    { labelKey: 'recommendations.factors.specialtyMatch', value: '', check: true },
    { labelKey: 'recommendations.factors.deviceAvailability', value: '', check: true },
    { labelKey: 'recommendations.factors.historicalFlow', value: '12%', check: false },
  ],
  disclaimerKey: 'recommendations.disclaimer',
}

export const locationNames: Record<string, string> = {
  mitte: 'Standort Mitte',
  nord: 'Standort Nord',
  sued: 'Standort Süd',
  west: 'Standort West',
  ost: 'Standort Ost',
}
