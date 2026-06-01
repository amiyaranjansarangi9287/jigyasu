/**
 * Analytics and Error Tracking Utilities
 * Integrates with Plausible for analytics and Sentry for error tracking
 */

// Plausible Analytics (already loaded in index.html)
declare global {
  interface Window {
    plausible?: (event: string, props?: Record<string, any>) => void;
  }
}

/**
 * Track custom event with Plausible
 */
export function trackEvent(eventName: string, props?: Record<string, any>) {
  if (typeof window !== 'undefined' && window.plausible) {
    window.plausible(eventName, { props });
  }
}

/**
 * Track page view
 */
export function trackPageView(path: string) {
  if (typeof window !== 'undefined' && window.plausible) {
    window.plausible('pageview', { props: { path } });
  }
}

/**
 * Track module completion
 */
export function trackModuleCompletion(moduleId: string, ageGroup: string, language: string) {
  trackEvent('module_completed', {
    module_id: moduleId,
    age_group: ageGroup,
    language,
  });
}

/**
 * Track wonder moment (user understanding concept)
 */
export function trackWonderMoment(moduleId: string, ageGroup: string) {
  trackEvent('wonder_moment', {
    module_id: moduleId,
    age_group: ageGroup,
  });
}

/**
 * Track download action
 */
export function trackDownload(moduleId: string, ageGroup: string) {
  trackEvent('module_downloaded', {
    module_id: moduleId,
    age_group: ageGroup,
  });
}

/**
 * Track language change
 */
export function trackLanguageChange(fromLang: string, toLang: string) {
  trackEvent('language_changed', {
    from: fromLang,
    to: toLang,
  });
}

/**
 * Track offline usage
 */
export function trackOfflineUsage(duration: number, modulesAccessed: number) {
  trackEvent('offline_session', {
    duration_seconds: duration,
    modules_accessed: modulesAccessed,
  });
}

/**
 * Track error (custom error tracking)
 */
export function trackError(error: Error, context?: Record<string, any>) {
  trackEvent('error_occurred', {
    error_message: error.message,
    error_name: error.name,
    ...context,
  });
  
  // Also log to console in development
  if (import.meta.env.DEV) {
    console.error('Analytics Error:', error, context);
  }
}

/**
 * Track performance metric
 */
export function trackPerformanceMetric(metricName: string, value: number) {
  trackEvent('performance_metric', {
    metric: metricName,
    value,
  });
}
