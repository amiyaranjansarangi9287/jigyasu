# Jigyasu — Sprint 6 Production Readiness Plan
## Fresh Audit: May 29, 2026

> **Mission**: Every child in India — and every adult who missed their chance — deserves to experience the joy of truly understanding something. Not memorizing. Understanding.
>
> The platform is **free, offline-first, 2G-compatible, and multilingual** (6 Indian languages). Every production decision is tested against one question: *"Does this work for a child in rural India on a shared Android phone?"*

---

## Current State — What's Already Fixed

The following issues from the original audit have been resolved:

| Item | Evidence |
|------|----------|
| **Workspace** | `apps/hub` is in `pnpm-workspace.yaml` |
| **Progress Key — Lab** | `PROGRESS_KEY = 'lab-world-progress'`, loads AND saves with same key |
| **Progress Key — Discovery** | `PROGRESS_KEY = 'discovery-world-progress'`, consistent |
| **Progress Key — Explorer** | `PROGRESS_KEY = 'explorer-world-progress'`, consistent |
| **CircuitBuilder stale state** | Completion logic in `useEffect([comps, wires, isOn, ...])` — correct |
| **ErrorBoundary — child safety** | "Copy Error" and technical details only shown in `DEV` mode |
| **ErrorBoundary — Sentry wired** | `SentryService.captureException()` called in `componentDidCatch` |
| **ErrorBoundary — per-world isolation** | `WorldRoute` wrapper gives each world its own `ErrorBoundary + Suspense` |
| **KidFriendlyNotFound** | `<Route path="*">` — no silent redirects to home |
| **MathContext timer cleanup** | `timerIds = useRef([])` + cleanup `useEffect` present |
| **MathContext aria-live** | `role="status" aria-live="polite" aria-atomic="true"` on toast overlay |
| **DynamicRoutes lazy hoisting** | `lazyModules` map built once at module scope, not inside render |
| **TimeCapsule sanitization** | `privateInfoRegex` validates + rejects; `maxLength={280}` set |
| **Math touch targets** | `min-height: 44px` — WCAG 2.5.8 compliant |
| **Sentry PII scrub** | `beforeSend` deletes `email` and `ip_address` |
| **Web Vitals production gating** | Logs only in `DEV`; production sends via `sendBeacon` consent-gated |

---

## What Still Needs to Ship

### MISSING — Production Blockers

| # | Item | Impact |
|---|------|--------|
| 1 | `SentryService.init()` never called in `main.tsx` | Sentry service exists but never activates; crashes invisible |
| 2 | `VITE_SENTRY_DSN` undocumented — no `.env.example` | Team can't onboard; Sentry stays off permanently |
| 3 | `setUserData` in `sentry.ts` sends `ip_address: '{{auto}}'` | Contradicts the `beforeSend` PII scrub |
| 4 | No security headers (`_headers` file missing) | Children's app exposed to XSS and clickjacking |
| 5 | No CI pipeline (`.github/workflows/` missing) | Broken code can reach production undetected |

### MISSING — Required for Launch

| # | Item | Impact |
|---|------|--------|
| 6 | No `robots.txt` or `sitemap.xml` | App invisible to search; WhatsApp share has no preview |
| 7 | `index.html` has no Open Graph / Twitter Card meta | Shared link looks like a bare URL on WhatsApp |
| 8 | No PWA icons (`pwa-192x192.png`, `pwa-512x512.png`) | Android install prompt broken; Lighthouse PWA audit fails |
| 9 | No `offline.html` fallback | Uncached URL offline = browser error screen |
| 10 | `typecheck` script missing in `package.json` | CI can't run type check without knowing the full `tsc` flags |

### MISSING — Trust and Compliance

| # | Item | Impact |
|---|------|--------|
| 11 | No parent awareness step in `OnboardingWizard` | Child profile created with no parental awareness |

---

## Sprint 6 — Task List with Saarthi Mentor Lessons

---

### S6-T1: Wire Sentry Init + Fix ip_address PII Leak

**Files:** `src/main.tsx`, `src/learnos/services/sentry.ts`

Call `SentryService.init()` in `main.tsx` before React renders. Remove `ip_address: '{{auto}}'` from `setUserData` in `sentry.ts`.

```ts
// main.tsx — add before createRoot:
import { SentryService } from './learnos/services/sentry';
SentryService.init();
```

```ts
// sentry.ts — setUserData: remove ip_address line
Sentry.setUser({ id: userId }); // Anonymous ID only
```

---
**MENTOR LESSON — S6-T1**

WHAT WE DID: Called `SentryService.init()` so the event queue flushes. Removed `ip_address: '{{auto}}'` which re-introduced PII that `beforeSend` was already deleting.

WHY IT MATTERS FOR JIGYASU: If Sentry never initializes, every crash on a child's phone is invisible to us. The `ip_address` field contradicts India's DPDP Act: you cannot collect location-linked identifiers from a service used by children without explicit consent. `beforeSend` was correct — but `setUserData` was undoing it through a different path.

THE PRINCIPLE: **Consistency** — a security policy is only as strong as its weakest bypass. Audit ALL paths that write user data, not just the primary one.

NEXT TIME: When you add a privacy scrub in one place, search the entire codebase for other places that write the same fields.

---

### S6-T2: Create `.env.example`

**File:** `apps/hub/.env.example`

```
# Sentry — Error monitoring (sign up free at sentry.io → New Project → Browser JavaScript)
VITE_SENTRY_DSN=https://your-public-dsn@o0.ingest.sentry.io/0

# API Backend (leave empty for local dev — Vite proxy handles /api routes)
VITE_API_BASE_URL=https://api.jigyasu.app
```

---
**MENTOR LESSON — S6-T2**

WHAT WE DID: Created `.env.example` — a committed template of required environment variables with descriptions, without actual secrets.

WHY IT MATTERS FOR JIGYASU: Without this file, a new contributor or team member clones the repo and Sentry silently stays off because nobody knows `VITE_SENTRY_DSN` exists. Documentation that lives in the repo stays up to date; documentation in a wiki or chat gets stale.

THE PRINCIPLE: **Documentation as Code** — make the right thing the easy thing.

NEXT TIME: Every new `import.meta.env.VITE_*` variable must have a corresponding `.env.example` entry with a comment.

---

### S6-T3: Add HTTP Security Headers

**File:** `apps/hub/public/_headers`

```
/*
  X-Frame-Options: DENY
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: camera=(), microphone=(), geolocation=(), payment=()
  Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline'; connect-src 'self' https://*.ingest.sentry.io; img-src 'self' data: blob:; style-src 'self' 'unsafe-inline'; font-src 'self' data:; worker-src 'self'
```

---
**MENTOR LESSON — S6-T3**

WHAT WE DID: Added a `_headers` file that tells the browser what Jigyasu is ALLOWED to do, enforced at the network layer — even if a script tries to override it.

WHY IT MATTERS FOR JIGYASU: `X-Frame-Options: DENY` prevents embedding Jigyasu in a malicious iframe to trick children. `Permissions-Policy: microphone=()` ensures no rogue script can activate a child's microphone. CSP rejects scripts not from your own domain — blocking the most common class of XSS attacks. For a children's platform, these are not optional.

THE PRINCIPLE: **Defence in Depth** — no single layer of security is enough. Headers, CSP, input sanitization, and PII scrubbing each block a different attack class.

NEXT TIME: When deploying to a cloud server with NGINX, translate each `_headers` entry to an `add_header` directive. Values are identical — only syntax changes.

---

### S6-T4: Add `robots.txt` + `sitemap.xml`

**Files:** `apps/hub/public/robots.txt`, `apps/hub/public/sitemap.xml`

```
# robots.txt
User-agent: *
Allow: /
Disallow: /api/
Sitemap: https://jigyasu.app/sitemap.xml
```

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>https://jigyasu.app/</loc><priority>1.0</priority></url>
  <url><loc>https://jigyasu.app/home</loc><priority>0.9</priority></url>
  <url><loc>https://jigyasu.app/about</loc><priority>0.7</priority></url>
</urlset>
```

---
**MENTOR LESSON — S6-T4**

WHAT WE DID: Added `robots.txt` (tells search crawlers what to index) and `sitemap.xml` (tells crawlers which pages exist and their priority).

WHY IT MATTERS FOR JIGYASU: When a parent searches "free science app Hindi India", Google needs to know Jigyasu exists. The sitemap is your introduction letter to search engines. `Disallow: /api/` protects your backend from crawlers hammering API endpoints.

THE PRINCIPLE: **Make your mission discoverable** — a free platform nobody can find is a mission unfulfilled.

NEXT TIME: Add new world URLs to the sitemap as they go live.

---

### S6-T5: Enrich `index.html` with Open Graph + Meta Tags

**File:** `apps/hub/index.html`

Add to `<head>`:
```html
<meta name="description" content="Free visual STEM learning for every child in India. Works offline. 6 Indian languages. Ages 2 to 80+." />
<meta property="og:title" content="Jigyasu — Learn With Wonder" />
<meta property="og:description" content="Free visual STEM learning. Works offline. 6 Indian languages. For every Indian child and adult." />
<meta property="og:image" content="/images/og-preview.png" />
<meta property="og:type" content="website" />
<meta property="og:url" content="https://jigyasu.app" />
<meta name="twitter:card" content="summary_large_image" />
<link rel="canonical" href="https://jigyasu.app/" />
```

---
**MENTOR LESSON — S6-T5**

WHAT WE DID: Added Open Graph tags so when a parent shares the Jigyasu link on WhatsApp, it shows a rich preview card — title, description, and image — instead of a bare URL.

WHY IT MATTERS FOR JIGYASU: Jigyasu's distribution is word-of-mouth via WhatsApp. A bare URL gets scrolled past. A preview card saying "Free visual STEM learning in Hindi — works offline" gets clicked and shared further. This is not vanity — it is mission delivery.

THE PRINCIPLE: **First impressions are product decisions** — for most users, the WhatsApp preview card IS their first experience of Jigyasu.

NEXT TIME: `og:image` should be 1200x630px, readable as a thumbnail on both mobile and desktop.

---

### S6-T6: Add PWA Icons + Harden Workbox Config

**Files:** `apps/hub/public/pwa-192x192.png`, `apps/hub/public/pwa-512x512.png`, `apps/hub/vite.config.ts`

Generate icons from Jigyasu owl logo. Update Workbox:

```js
workbox: {
  globPatterns: ['**/*.{js,css,html,ico,png,svg,mp3,woff2}'],
  navigateFallback: '/index.html',
  navigateFallbackDenylist: [/^\/api/],
  runtimeCaching: [{
    urlPattern: /\.(?:png|jpg|jpeg|svg)$/,
    handler: 'CacheFirst',
    options: { cacheName: 'images', expiration: { maxEntries: 100, maxAgeSeconds: 2592000 } }
  }]
},
manifest: {
  name: 'Jigyasu', short_name: 'Jigyasu',
  description: 'Free visual STEM learning. Works offline.',
  theme_color: '#4F46E5', background_color: '#ffffff', display: 'standalone',
  icons: [
    { src: 'pwa-192x192.png', sizes: '192x192', type: 'image/png' },
    { src: 'pwa-512x512.png', sizes: '512x512', type: 'image/png', purpose: 'any maskable' }
  ]
}
```

---
**MENTOR LESSON — S6-T6**

WHAT WE DID: Added PWA icons (required for Android install prompt) and configured Workbox with CacheFirst for images and a `navigateFallback` for offline navigation.

WHY IT MATTERS FOR JIGYASU: "Offline First" is in the mission. A child who loaded Jigyasu at school WiFi should be able to use it at home with no internet. CacheFirst means images are served from local storage — no network needed. `navigateFallback: '/index.html'` makes deep links work offline. `navigateFallbackDenylist: [/^\/api/]` prevents the SW from intercepting API calls and returning HTML, which would cause extremely confusing failures.

THE PRINCIPLE: **Progressive Enhancement** — works without internet, gets better with it.

NEXT TIME: Always add API routes to `navigateFallbackDenylist`. Without this, every API call offline returns your app shell HTML — a very hard bug to debug.

---

### S6-T7: Add CI Pipeline

**File:** `.github/workflows/ci.yml`

```yaml
name: CI
on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v3
        with: { version: 9 }
      - uses: actions/setup-node@v4
        with: { node-version: '20', cache: 'pnpm' }
      - run: pnpm install --frozen-lockfile
      - run: pnpm --filter @jigyasu/hub exec tsc -b --noEmit
      - run: pnpm --filter @jigyasu/hub build
      - run: pnpm --filter @jigyasu/hub lint
```

---
**MENTOR LESSON — S6-T7**

WHAT WE DID: Created a GitHub Actions CI pipeline that runs TypeScript checking, production build, and ESLint on every push and PR.

WHY IT MATTERS FOR JIGYASU: A child who opens Jigyasu and gets a white screen because someone pushed broken code has lost their learning session and may never come back. CI is the automated gatekeeper. `--frozen-lockfile` prevents supply chain attacks — if a dependency is compromised after you locked it, the lock file won't match and CI fails instead of silently shipping the attack.

THE PRINCIPLE: **Fail Fast** — discover problems as early and cheaply as possible, before they reach learners.

NEXT TIME: Add a `lighthouse-ci` step once you have a staging URL so performance never silently regresses.

---

### S6-T8: Add `typecheck` Script to `package.json`

**File:** `apps/hub/package.json`

Add `"typecheck": "tsc -b --noEmit"` to `scripts`. Small but important — standardizes how CI and developers run the type check.

---

### S6-T9: Add `offline.html` Fallback

**File:** `apps/hub/public/offline.html`

Child-friendly, multi-language offline message as a safety net for uncached routes.

---

### S6-T10: Add Parent Awareness Step in OnboardingWizard

**File:** `apps/hub/src/components/OnboardingWizard.tsx`

Add a simple, honest one-screen trust message before profile creation:
"Jigyasu is free for everyone. We don't collect personal data. [Start Learning]"

This is NOT a legal wall. It's a trust signal. A parent who sees this feels confident.

---
**MENTOR LESSON — S6-T10**

WHAT WE DID: Added a brief parent awareness step in onboarding.

WHY IT MATTERS FOR JIGYASU: Parents in rural India are often deeply suspicious of apps that collect their child's information. A simple honest screen — "We don't collect personal data" — builds more trust than any feature. This reflects the Jigyasu value of Respect: no judgment, no surveillance, no shame.

THE PRINCIPLE: **Trust by Design** — transparency is a product value, not just a legal requirement. Users who trust you use the product more, share it more, and stay longer.

NEXT TIME: Never collect data you don't need. Never ask permission for things you won't use. Both waste the user's most precious asset: trust.

---

## Execution Priority

| Priority | Tasks |
|----------|-------|
| P0 — First | S6-T1 (Sentry init + PII fix), S6-T2 (.env.example), S6-T3 (Security headers) |
| P1 — With launch | S6-T4 (robots + sitemap), S6-T5 (OG meta), S6-T6 (PWA + Workbox), S6-T7 (CI), S6-T8 (typecheck) |
| P2 — Before wide rollout | S6-T9 (offline.html), S6-T10 (parent awareness) |

---

## Verification Checklist

- [ ] `pnpm --filter @jigyasu/hub build` exits 0
- [ ] `pnpm --filter @jigyasu/hub exec tsc -b --noEmit` exits 0
- [ ] Sentry initializes when `VITE_SENTRY_DSN` is set
- [ ] HTTP response has `X-Frame-Options`, `X-Content-Type-Options`, `Content-Security-Policy`
- [ ] `/robots.txt` returns 200
- [ ] WhatsApp link preview shows title + description + image
- [ ] "Add to Home Screen" works on Android
- [ ] App loads offline after first visit
- [ ] CI runs and passes on push to `main`
