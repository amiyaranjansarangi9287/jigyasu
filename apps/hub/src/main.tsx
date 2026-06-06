/// <reference types="vite-plugin-pwa/client" />
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { I18nextProvider } from 'react-i18next'
import i18n from './i18n'
import './index.css'
import App from './App.tsx'
import { ErrorBoundary } from '@jigyasu/ui'
import { SentryService } from './learnos/services/sentry'
import { registerSW } from 'virtual:pwa-register'


// Initialize Sentry before React renders so startup crashes are captured.
// No-op when VITE_SENTRY_DSN is not set (local dev without .env).
SentryService.init()

// Register service worker for PWA/offline support with auto-update
if ('serviceWorker' in navigator && import.meta.env.PROD) {
  registerSW({
    immediate: true,
    onNeedRefresh() {
      // Hard reload to ensure the new service worker takes over and serves fresh assets
      window.location.reload();
    },
    onRegisterError(error: Error) {
      console.error('Service worker registration failed:', error);
    }
  });
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <I18nextProvider i18n={i18n}>
        <App />
      </I18nextProvider>
    </ErrorBoundary>
  </StrictMode>,
)
