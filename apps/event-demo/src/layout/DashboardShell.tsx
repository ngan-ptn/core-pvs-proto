import { useState, useCallback, lazy, Suspense } from 'react'
import { TooltipProvider } from '@tini/ui'
import { NavRail } from './NavRail'
import { FilterBar } from './FilterBar'
import { TabBar } from './TabBar'
import { OverviewTab } from '../tabs/OverviewTab'
import { LanguageToggle } from '../components/LanguageToggle'
import { ErrorBoundary } from '../components/ErrorBoundary'
import { TabSkeleton } from '../components/DashboardSkeleton'
import type { TabId } from '../data/types'
import { useTranslation } from '../i18n/useTranslation'

const NoShowTab = lazy(() => import('../tabs/NoShowTab').then(m => ({ default: m.NoShowTab })))
const TreatmentDurationTab = lazy(() => import('../tabs/TreatmentDurationTab').then(m => ({ default: m.TreatmentDurationTab })))
const ResourcesTab = lazy(() => import('../tabs/ResourcesTab').then(m => ({ default: m.ResourcesTab })))

export function DashboardShell() {
  const { t } = useTranslation()
  const [activeTab, setActiveTab] = useState<TabId>('overview')

  const handleTabChange = useCallback((tab: TabId) => {
    setActiveTab(tab)
  }, [])

  const tabContent = () => {
    switch (activeTab) {
      case 'overview': return <OverviewTab onNavigate={handleTabChange} />
      case 'noShow': return <NoShowTab />
      case 'treatmentDuration': return <TreatmentDurationTab />
      case 'resources': return <ResourcesTab />
    }
  }

  return (
    <TooltipProvider>
      <div className="flex h-screen bg-background text-[var(--color-text-primary)]">
        <NavRail />
        <div className="flex-1 flex flex-col min-w-0">
          <header className="px-4 py-4 divider-bottom">
            <h1 className="text-lg font-bold leading-6 tracking-figma">{t('dashboard.title')}</h1>
            <p className="text-sm text-[var(--color-text-placeholder)] tracking-figma leading-[22px]">{t('dashboard.subtitle')}</p>
          </header>
          <FilterBar />
          <TabBar activeTab={activeTab} onTabChange={handleTabChange} />
          <main className="flex-1 overflow-auto p-4" aria-label={t('dashboard.title')}>
            <ErrorBoundary
              title={t('error.title')}
              message={t('error.message')}
              retryLabel={t('error.retry')}
            >
              <Suspense fallback={<TabSkeleton />}>
                {tabContent()}
              </Suspense>
            </ErrorBoundary>
          </main>
        </div>
        <LanguageToggle />
      </div>
    </TooltipProvider>
  )
}
