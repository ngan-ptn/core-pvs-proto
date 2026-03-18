import { Button, Popover, PopoverTrigger, PopoverContent, cn } from '@tini/ui'
import { ChevronDown, Check } from 'lucide-react'
import { useFilters, ALL_LOCATIONS } from '../hooks/useFilters'
import { useTranslation } from '../i18n/useTranslation'
import type { DatePreset } from '../data/types'

const datePresets: DatePreset[] = ['thisMonth', 'thisQuarter', 'lastQuarter']

export function FilterBar() {
  const { t } = useTranslation()
  const { datePreset, setDatePreset, selectedLocations, toggleLocation, isAllLocations, setSelectedLocations } = useFilters()

  return (
    <div className="flex items-center gap-3 px-4 py-3 divider-bottom">
      <div className="flex gap-1">
        {datePresets.map(p => (
          <Button
            key={p}
            variant={datePreset === p ? 'default' : 'outline'}
            size="sm"
            className="tracking-figma"
            onClick={() => setDatePreset(p)}
          >
            {t(`filters.${p}`)}
          </Button>
        ))}
      </div>

      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm" className="ml-2 tracking-figma">
            {isAllLocations ? t('filters.allLocations') : t('filters.locationCount', { count: selectedLocations.length })}
            <ChevronDown className="w-3.5 h-3.5 ml-1" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-56 p-2" align="start">
          <button
            className="flex items-center gap-2 w-full px-2 py-1.5 text-sm tracking-figma rounded hover:bg-accent transition-colors"
            onClick={() => setSelectedLocations(ALL_LOCATIONS)}
          >
            <Check className={cn('w-3.5 h-3.5', isAllLocations ? 'opacity-100' : 'opacity-0')} />
            {t('filters.allLocations')}
          </button>
          {ALL_LOCATIONS.map(id => (
            <button
              key={id}
              className="flex items-center gap-2 w-full px-2 py-1.5 text-sm tracking-figma rounded hover:bg-accent transition-colors"
              onClick={() => toggleLocation(id)}
            >
              <Check className={cn('w-3.5 h-3.5', selectedLocations.includes(id) ? 'opacity-100' : 'opacity-0')} />
              {t(`locations.${id}`)}
            </button>
          ))}
        </PopoverContent>
      </Popover>
    </div>
  )
}
