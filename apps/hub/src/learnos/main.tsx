// src/main.tsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

// i18n must be imported before App to ensure translations are ready
import './i18n';
import './index.css';
import App from './App';
import { SentryService } from './services/sentry';
import { initPerformance } from './services/performance';
import { registerAllModules } from './core/modules';
import { moduleRegistry } from './core/ModuleRegistry';

// Register all modules at startup
registerAllModules();

// Enable Wonder-First feature flag by default
moduleRegistry.setFeatureFlag('wonder-first', true);

// Initialize Sentry (non-blocking)
SentryService.init().catch(() => {});

// Initialize performance metrics
initPerformance();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
