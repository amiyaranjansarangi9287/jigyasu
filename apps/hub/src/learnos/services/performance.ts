// Web Vitals performance metrics: reports LCP, CLS, INP, FCP, and TTFB.

import { onLCP, onINP, onCLS, onFCP, onTTFB, type Metric } from 'web-vitals';

function sendToAnalytics(metric: Metric) {
  const body = {
    name: metric.name,
    value: metric.value,
    delta: metric.delta,
    rating: metric.rating,
    id: metric.id,
    navigationType: metric.navigationType,
    url: window.location.href,
    timestamp: Date.now(),
  };

  if (import.meta.env.DEV) {
  }

  const consent = localStorage.getItem('learnos-consent');
  if (consent === 'accepted' && navigator.onLine) {
    try {
      navigator.sendBeacon('/api/analytics/performance', JSON.stringify(body));
    } catch {
      // Beacon failed; silently ignore.
    }
  }
}

export function initPerformance() {
  // Largest Contentful Paint: loading performance.
  onLCP(sendToAnalytics);

  // Interaction to Next Paint: responsiveness.
  onINP(sendToAnalytics);

  // Cumulative Layout Shift: visual stability.
  onCLS(sendToAnalytics);

  // First Contentful Paint: initial load.
  onFCP(sendToAnalytics);

  // Time to First Byte: server response.
  onTTFB(sendToAnalytics);
}
