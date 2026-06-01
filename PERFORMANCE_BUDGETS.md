# Jigyasu Performance Budgets for 2G Optimization

## Overview

Jigyasu is designed to work on 2G connections. This document defines performance budgets to ensure the platform remains accessible to learners with slow internet.

## Performance Budgets

### Core Budgets

| Metric | Budget | Target | Measurement |
|--------|--------|--------|-------------|
| Initial Load Time | 3s | 2s | Time to Interactive (TTI) |
| First Contentful Paint | 1.5s | 1s | LCP (Largest Contentful Paint) |
| Time to Interactive | 3s | 2s | TTI |
| Cumulative Layout Shift | 0.1 | 0.05 | CLS |
| First Input Delay | 100ms | 50ms | FID |
| Total Bundle Size | 200KB | 150KB | Gzipped JavaScript |
| Total CSS Size | 50KB | 30KB | Gzipped CSS |
| Total Image Size | 100KB | 50KB | Optimized images |
| Number of Requests | 20 | 15 | Total HTTP requests |

### Per-Module Budgets

| Module Type | Budget | Target | Notes |
|-------------|--------|--------|-------|
| Wonder-First Module | 50KB | 30KB | Including all assets |
| Interactive Module | 100KB | 70KB | Canvas-heavy modules |
| Static Content Module | 20KB | 15KB | Text-only modules |

### Asset-Specific Budgets

#### Images
- **Hero Images**: Max 30KB (WebP, progressive)
- **Illustrations**: Max 20KB (SVG preferred)
- **Icons**: Max 5KB (SVG or optimized PNG)
- **Photos**: Max 40KB (WebP, lazy-loaded)

#### Fonts
- **Total Font Size**: Max 50KB (WOFF2)
- **Font Variants**: Max 2 per family
- **Font Loading**: Use font-display: swap

#### JavaScript
- **Core Bundle**: Max 100KB (gzipped)
- **Lazy-loaded Chunks**: Max 50KB each
- **Third-party Libraries**: Minimize, use CDN

#### CSS
- **Critical CSS**: Inline, max 10KB
- **Non-critical CSS**: Lazy-load, max 40KB
- **Tailwind CSS**: Purge unused styles

## Implementation Strategies

### 1. Code Splitting

```typescript
// Lazy load modules
const GravityModule = lazy(() => import('./modules/GravityModule'));
const PhotosynthesisModule = lazy(() => import('./modules/PhotosynthesisModule'));

// Lazy load heavy components
const CanvasExploration = lazy(() => import('./components/CanvasExploration'));
```

### 2. Asset Optimization

```typescript
// Use WebP images with fallbacks
<picture>
  <source srcSet="image.webp" type="image/webp" />
  <img src="image.jpg" alt="Description" loading="lazy" />
</picture>

// Use SVG for icons
import { IconName } from 'lucide-react';
```

### 3. Bundle Analysis

```bash
# Analyze bundle size
pnpm build -- --report

# Check for large dependencies
pnpm why <package-name>
```

### 4. Performance Monitoring

```typescript
// Add performance monitoring
if (process.env.NODE_ENV === 'production') {
  const observer = new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      console.log(entry.name, entry.duration);
      // Log to analytics if exceeds budget
      if (entry.duration > BUDGET) {
        trackPerformanceIssue(entry.name, entry.duration);
      }
    }
  });
  observer.observe({ entryTypes: ['navigation', 'resource', 'measure'] });
}
```

## 2G-Specific Optimizations

### Connection Detection

```typescript
function detectConnectionType(): ConnectionType {
  const nav = navigator as Navigator & {
    connection?: { effectiveType?: string };
  };
  const conn = nav.connection?.effectiveType;
  
  if (!navigator.onLine) return 'offline';
  if (conn === '2g') return '2g';
  if (conn === '3g') return '3g';
  if (conn === '4g') return '4g';
  return 'wifi';
}
```

### Adaptive Loading

```typescript
const { shouldLoadAnimations, shouldLoadImages } = useConnectionOptimization();

// Disable animations on 2G
const animationConfig = shouldLoadAnimations
  ? { initial: { opacity: 0 }, animate: { opacity: 1 } }
  : { initial: { opacity: 1 }, animate: { opacity: 1 } };

// Load low-res images on 2G
const imageUrl = shouldLoadImages
  ? '/images/high-res.jpg'
  : '/images/low-res.jpg';
```

### Offline-First Design

```typescript
// Service Worker for offline caching
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open('jigyasu-v1').then((cache) => {
      return cache.addAll([
        '/',
        '/offline.html',
        '/manifest.json',
        // Core assets
      ]);
    })
  );
});
```

## Testing Performance

### Lighthouse CI

```yaml
# .github/workflows/lighthouse.yml
name: Lighthouse CI
on: [push]
jobs:
  lighthouse:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: treosh/lighthouse-ci-action@v8
        with:
          urls: |
            http://localhost:3000
          budgetPath: ./budget.json
          uploadArtifacts: true
```

### Budget Configuration

```json
// budget.json
{
  "budgets": [
    {
      "path": "index.html",
      "timings": [
        {
          "metric": "interactive",
          "budget": 3000
        },
        {
          "metric": "first-contentful-paint",
          "budget": 1500
        }
      ]
    },
    {
      "path": "*.js",
      "resourceSizes": [
        {
          "resourceType": "script",
          "budget": 100
        }
      ]
    }
  ]
}
```

### Manual Testing Checklist

- [ ] Test on 2G connection (Chrome DevTools throttling)
- [ ] Test on 3G connection
- [ ] Test offline functionality
- [ ] Test on low-end Android device
- [ ] Test on old iPhone (iPhone 6 or older)
- [ ] Test with 50% packet loss
- [ ] Test with 500ms latency
- [ ] Measure bundle size before and after changes
- [ ] Run Lighthouse audit (score > 90)
- [ ] Test with slow CPU throttling (4x slowdown)

## Monitoring & Alerts

### Performance Metrics to Track

1. **Page Load Time**: Time from navigation start to complete
2. **Time to Interactive**: Time until page is fully interactive
3. **First Contentful Paint**: Time to first content render
4. **Cumulative Layout Shift**: Visual stability score
5. **Bundle Size**: Total JavaScript/CSS size
6. **Image Load Time**: Time to load all images
7. **API Response Time**: Time for API calls

### Alert Thresholds

- **Critical**: Load time > 5s (immediate action)
- **Warning**: Load time > 3s (investigate within 24h)
- **Info**: Load time > 2s (monitor trend)

### Performance Budget Violation Handling

```typescript
// Check budget on build
if (bundleSize > BUDGET) {
  console.error(`Bundle size ${bundleSize} exceeds budget ${BUDGET}`);
  process.exit(1);
}

// Runtime monitoring
if (performance.now() > BUDGET) {
  trackPerformanceIssue('load_time', performance.now());
  // Show user-friendly message
  showSlowConnectionWarning();
}
```

## Best Practices

### Development

1. **Test on slow connections during development**
   ```typescript
   // Chrome DevTools: Network throttling → Slow 3G
   ```

2. **Use performance profiling tools**
   ```bash
   pnpm build -- --profile
   ```

3. **Optimize before adding features**
   - Check bundle impact before adding new dependencies
   - Use bundle analyzer regularly
   - Review performance budgets in PRs

### Deployment

1. **Enable compression**
   ```nginx
   gzip on;
   gzip_types text/css application/javascript image/svg+xml;
   ```

2. **Use CDN for static assets**
   - Serve images from CDN
   - Use CDN for JavaScript/CSS
   - Enable HTTP/2

3. **Implement caching headers**
   ```nginx
   location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|webp)$ {
     expires 1y;
     add_header Cache-Control "public, immutable";
   }
   ```

### Maintenance

1. **Regular performance audits**
   - Run Lighthouse weekly
   - Monitor bundle size trends
   - Review performance budgets monthly

2. **Optimize legacy code**
   - Refactor large bundles
   - Remove unused dependencies
   - Update to lighter alternatives

3. **Stay updated on best practices**
   - Follow web performance blogs
   - Attend performance conferences
   - Review new optimization techniques

## Resources

### Tools
- **Lighthouse**: Performance auditing
- **Webpack Bundle Analyzer**: Bundle size visualization
- **Chrome DevTools**: Performance profiling
- **WebPageTest**: Real-world performance testing

### Documentation
- [Web.dev Performance](https://web.dev/performance/)
- [MDN Performance](https://developer.mozilla.org/en-US/docs/Web/Performance)
- [Performance Budgets](https://web.dev/performance-budgets-101/)

### Communities
- [Web Performance Working Group](https://www.w3.org/webperf/)
- [r/webdev on Reddit](https://reddit.com/r/webdev)
- [Performance Slack](https://perf.slack.com/)

---

*Performance budgets should be reviewed quarterly and adjusted based on real-world usage data. Last updated: May 2026*
