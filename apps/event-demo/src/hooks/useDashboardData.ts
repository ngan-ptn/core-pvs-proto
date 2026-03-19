import { useMemo } from 'react'
import { useFilters } from './useFilters'
import {
  aggregateKpis,
  locationKpis,
  noShowHeatmap,
  specialtyDurations,
  practitioners,
  deviceUtilizations,
  availableSlots,
  patternData,
  recommendationData,
} from '../data/fixtures'
import type { AggregateKpis, LocationKpis } from '../data/types'

export function useDashboardData() {
  const { selectedLocations, isAllLocations } = useFilters()

  const filteredLocations = useMemo(
    () => locationKpis.filter(l => selectedLocations.includes(l.id)),
    [selectedLocations]
  )

  const filteredAggregateKpis = useMemo<AggregateKpis>(() => {
    if (isAllLocations) return aggregateKpis
    return computeAggregate(filteredLocations)
  }, [isAllLocations, filteredLocations])

  const filteredDeviceUtilizations = useMemo(
    () => deviceUtilizations.filter(d => selectedLocations.includes(d.location)),
    [selectedLocations]
  )

  const filteredAvailableSlots = useMemo(
    () => availableSlots.filter(s => selectedLocations.includes(s.location)),
    [selectedLocations]
  )

  return {
    aggregateKpis: filteredAggregateKpis,
    locationKpis: filteredLocations,
    noShowHeatmap,
    specialtyDurations,
    practitioners,
    deviceUtilizations: filteredDeviceUtilizations,
    availableSlots: filteredAvailableSlots,
    patternData,
    recommendationData,
  }
}

function computeAggregate(locations: LocationKpis[]): AggregateKpis {
  if (locations.length === 0) return aggregateKpis
  const n = locations.length
  const avg = (fn: (l: LocationKpis) => number) =>
    Math.round((locations.reduce((s, l) => s + fn(l), 0) / n) * 10) / 10

  return {
    noShow: { ...aggregateKpis.noShow, value: avg(l => l.noShow.value) },
    treatmentDuration: { ...aggregateKpis.treatmentDuration, value: avg(l => l.treatmentDuration.value) },
    deviceUtilization: { ...aggregateKpis.deviceUtilization, value: avg(l => l.deviceUtilization.value) },
    availableSlots: {
      ...aggregateKpis.availableSlots,
      value: locations.reduce((s, l) => s + l.availableSlots.value, 0),
    },
  }
}
