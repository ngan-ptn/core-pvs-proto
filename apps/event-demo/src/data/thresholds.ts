import type { Status } from './types'

interface ThresholdRule {
  critical: number
  warning: number
  direction: 'above' | 'below'
}

const thresholds: Record<string, ThresholdRule> = {
  noShow: { critical: 20, warning: 15, direction: 'above' },
  treatmentDuration: { critical: 30, warning: 25, direction: 'above' },
  deviceUtilization: { critical: 90, warning: 85, direction: 'above' },
  availableSlots: { critical: 3, warning: 5, direction: 'below' },
}

export function getStatus(metric: string, value: number): Status {
  const rule = thresholds[metric]
  if (!rule) return 'neutral'

  if (rule.direction === 'above') {
    if (value >= rule.critical) return 'critical'
    if (value >= rule.warning) return 'warning'
    return 'normal'
  } else {
    if (value <= rule.critical) return 'critical'
    if (value <= rule.warning) return 'warning'
    return 'normal'
  }
}

export function getHeatmapStatus(value: number): Status {
  if (value >= 20) return 'critical'
  if (value >= 15) return 'warning'
  return 'normal'
}

export { thresholds }
