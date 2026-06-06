/**
 * Sentry Error Tracking Configuration
 * Production-ready error tracking and performance monitoring
 */

import * as Sentry from '@sentry/browser';

/**
 * Initialize Sentry for error tracking
 * Only initializes in production
 */
export function initSentry() {
  if (import.meta.env.PROD) {
    Sentry.init({
      dsn: import.meta.env.VITE_SENTRY_DSN || '',
      environment: import.meta.env.MODE,
      release: import.meta.env.VITE_APP_VERSION || '1.0.0',
      
      // Performance monitoring
      tracesSampleRate: 0.1, // 10% of transactions for performance monitoring
      
      // Session replay
      replaysSessionSampleRate: 0.1, // 10% of sessions
      replaysOnErrorSampleRate: 1.0, // 100% of sessions with errors
      
      // Integrations
      integrations: [
        Sentry.replayIntegration({
          maskAllText: true,
          blockAllMedia: true,
        }),
        Sentry.browserTracingIntegration(),
      ],
      
      // Filter errors and add user context
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      beforeSend(event: any, hint: any) {
        // Ignore errors from browser extensions
        if (event.exception?.values?.[0]?.stacktrace?.frames?.[0]?.filename?.includes('extension')) {
          return null;
        }
        
        // Ignore network errors that are expected in offline mode
        if (event.exception?.values?.[0]?.type === 'TypeError' && 
            event.exception?.values?.[0]?.value?.includes('NetworkError')) {
          return null;
        }
        
        // Add user context
        const userId = localStorage.getItem('jigyasu_user_id');
        if (userId) {
          event.user = { id: userId };
        }
        
        return event;
      },
      
      // Add custom tags
      initialScope: {
        tags: {
          platform: 'web',
          app: 'jigyasu',
        },
      },
    });
  }
}

/**
 * Set user context for error tracking
 */
export function setUserContext(userId: string, email?: string, ageGroup?: string) {
  Sentry.setUser({
    id: userId,
    email,
    extra: {
      ageGroup,
    },
  });
}

/**
 * Clear user context
 */
export function clearUserContext() {
  Sentry.setUser(null);
}

/**
 * Track custom error with additional context
 */
export function captureError(error: Error, context?: Record<string, any>) {
  Sentry.captureException(error, {
    extra: context,
  });
}

/**
 * Track custom message
 */
export function captureMessage(message: string, level: 'info' | 'warning' | 'error' = 'info') {
  Sentry.captureMessage(message, level);
}

/**
 * Add breadcrumb for user actions
 */
export function addBreadcrumb(category: string, message: string, data?: Record<string, any>) {
  Sentry.addBreadcrumb({
    category,
    message,
    level: 'info',
    data,
  });
}

/**
 * Track performance transaction
 */
export function startTransaction(name: string, op: string) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return Sentry.startSpan({ name, op }, (span: any) => span);
}
