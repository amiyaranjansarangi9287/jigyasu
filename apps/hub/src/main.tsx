import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './i18n'
import './index.css'
import App from './App.tsx'
import { ErrorBoundary } from '@jigyasu/ui'
import { SentryService } from './learnos/services/sentry'

// Initialize global i18n only; LearnOS module registration is lazy-loaded with LearnOS.
import './learnos/i18n'

// Initialize Sentry before React renders so startup crashes are captured.
// No-op when VITE_SENTRY_DSN is not set (local dev without .env).
SentryService.init()

// Register service worker for PWA/offline support
if ('serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch((error) => {
      console.error('Service worker registration failed:', error)
    })
  })
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
)
