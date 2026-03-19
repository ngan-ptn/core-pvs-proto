import './i18n'
import { StrictMode, Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import './app.css'
import { App } from './app'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Suspense fallback={null}>
      <App />
    </Suspense>
  </StrictMode>,
)
