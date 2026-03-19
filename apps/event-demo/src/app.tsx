import { I18nProvider } from './i18n/I18nProvider'
import { FilterProvider } from './hooks/useFilters'
import { DashboardShell } from './layout/DashboardShell'

export function App() {
  return (
    <I18nProvider>
      <FilterProvider>
        <DashboardShell />
      </FilterProvider>
    </I18nProvider>
  )
}
