import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'
import { createElement } from 'react'
import type { DatePreset } from '../data/types'

interface FilterState {
  datePreset: DatePreset
  selectedLocations: string[]
}

interface FilterContextValue extends FilterState {
  setDatePreset: (preset: DatePreset) => void
  toggleLocation: (locationId: string) => void
  setSelectedLocations: (locations: string[]) => void
  isAllLocations: boolean
}

const ALL_LOCATIONS = ['mitte', 'nord', 'sued', 'west', 'ost']

const FilterContext = createContext<FilterContextValue | null>(null)

export function FilterProvider({ children }: { children: ReactNode }) {
  const [datePreset, setDatePreset] = useState<DatePreset>('thisMonth')
  const [selectedLocations, setSelectedLocations] = useState<string[]>(ALL_LOCATIONS)

  const toggleLocation = useCallback((locationId: string) => {
    setSelectedLocations(prev => {
      if (prev.includes(locationId)) {
        const next = prev.filter(id => id !== locationId)
        return next.length === 0 ? ALL_LOCATIONS : next
      }
      return [...prev, locationId]
    })
  }, [])

  const isAllLocations = selectedLocations.length === ALL_LOCATIONS.length

  return createElement(
    FilterContext.Provider,
    {
      value: {
        datePreset,
        setDatePreset,
        selectedLocations,
        setSelectedLocations,
        toggleLocation,
        isAllLocations,
      },
    },
    children
  )
}

export function useFilters(): FilterContextValue {
  const ctx = useContext(FilterContext)
  if (!ctx) throw new Error('useFilters must be used within FilterProvider')
  return ctx
}

export { ALL_LOCATIONS }
