import { useState, useCallback, useEffect } from 'react'
import { TooltipProvider } from '@tini/ui'
import { NavRail } from './NavRail'
import { FilterBar } from './FilterBar'
import { TabBar } from './TabBar'
import { OverviewTab } from '../tabs/OverviewTab'
import { NoShowTab } from '../tabs/NoShowTab'
import { TreatmentDurationTab } from '../tabs/TreatmentDurationTab'
import { ResourcesTab } from '../tabs/ResourcesTab'
import { LanguageToggle } from '../components/LanguageToggle'
import { OverviewSkeleton, TabSkeleton } from '../components/DashboardSkeleton'
import type { TabId } from '../data/types'
import { useTranslation } from '../i18n/useTranslation'

export function DashboardShell() {
  const { t } = useTranslation()
  const [activeTab, setActiveTab] = useState<TabId>('overview')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 300)
    return () => clearTimeout(timer)
  }, [])

  const handleTabChange = useCallback((tab: TabId) => {
    setLoading(true)
    setActiveTab(tab)
    setTimeout(() => setLoading(false), 300)
  }, [])

  const tabContent = () => {
    if (loading) {
      return activeTab === 'overview' ? <OverviewSkeleton /> : <TabSkeleton />
    }
    switch (activeTab) {
      case 'overview': return <OverviewTab onNavigate={handleTabChange} />
      case 'noShow': return <NoShowTab />
      case 'treatmentDuration': return <TreatmentDurationTab />
      case 'resources': return <ResourcesTab />
    }
  }

  return (
    <TooltipProvider>
      <div className="flex h-screen bg-background text-foreground">
        <NavRail />
        <div className="flex-1 flex flex-col min-w-0">
          <header className="px-6 py-4 border-b">
            <h1 className="text-xl font-semibold">{t('dashboard.title')}</h1>
            <p className="text-sm text-muted-foreground">{t('dashboard.subtitle')}</p>
          </header>
          <FilterBar />
          <TabBar activeTab={activeTab} onTabChange={handleTabChange} />
          <main className="flex-1 overflow-auto p-6">
            {tabContent()}
          </main>
        </div>
        <LanguageToggle />
      </div>
    </TooltipProvider>
  )
}
