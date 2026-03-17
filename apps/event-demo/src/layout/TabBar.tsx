import { Tabs, TabsList, TabsTrigger } from '@tini/ui'
import type { TabId } from '../data/types'
import { useTranslation } from '../i18n/useTranslation'

interface TabBarProps {
  activeTab: TabId
  onTabChange: (tab: TabId) => void
}

const tabs: { id: TabId; labelKey: string }[] = [
  { id: 'overview', labelKey: 'tabs.overview' },
  { id: 'noShow', labelKey: 'tabs.noShow' },
  { id: 'treatmentDuration', labelKey: 'tabs.treatmentDuration' },
  { id: 'resources', labelKey: 'tabs.resources' },
]

export function TabBar({ activeTab, onTabChange }: TabBarProps) {
  const { t } = useTranslation()

  return (
    <Tabs value={activeTab} onValueChange={(v) => onTabChange(v as TabId)}>
      <TabsList className="w-full justify-start px-6 border-b rounded-none bg-transparent h-auto py-0">
        {tabs.map(tab => (
          <TabsTrigger
            key={tab.id}
            value={tab.id}
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:shadow-none px-4 py-2.5"
          >
            {t(tab.labelKey)}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  )
}
