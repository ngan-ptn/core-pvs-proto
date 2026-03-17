import type { SharedResources } from '@pvs/shared'
import type enApp from './locales/en/app.json'

interface AppResources extends SharedResources {
  app: typeof enApp
}

declare module 'react-i18next' {
  interface CustomTypeOptions {
    defaultNS: 'common'
    resources: AppResources
  }
}
