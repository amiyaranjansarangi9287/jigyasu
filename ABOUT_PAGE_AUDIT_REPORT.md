# JIGYASU ABOUT PAGE — IN-DEPTH AUDIT REPORT
**Scope:** `apps/hub/src/components/AboutPage.tsx` + `apps/hub/src/learnos/crosscutting/AboutPage.tsx` + i18n (`en.json`)
**Date:** June 11, 2026

---

## EXECUTIVE SUMMARY

The About page exists in **two parallel implementations** that have critically diverged. The active version (`src/components/AboutPage.tsx`) contains severe content truncation bugs, navigation stacking issues, and missing accessibility/SEO foundations. The secondary version (`src/learnos/crosscutting/AboutPage.tsx`) contains corrupted Unicode characters, an exposed personal email address, and unreachable dead code.

**Severity Breakdown:**
- **Critical:** 5 issues
- **High:** 6 issues
- **Medium:** 9 issues
- **Low:** 6 issues

---

## CRITICAL ISSUES

### CRIT-1: Duplicate & Divergent AboutPage Components (Dead Code + Content Drift)
**Location:** `src/components/AboutPage.tsx` vs `src/learnos/crosscutting/AboutPage.tsx`

Main `App.tsx` @ line 143 mounts `src/components/AboutPage.tsx` at `/about`. `learnos/App.tsx` @ line 108 also defines an `/about` route pointing to `src/learnos/crosscutting/AboutPage.tsx`, but because `App.tsx` defines `/about` *before* the `*` catch-all, the crosscutting variant is **never reached**.

Result: the crosscutting file has accumulated **more complete default copy** (full descriptions) but is orphaned. The active file has **only ellipsis-truncated fallbacks**.

**Fix:** Delete `src/learnos/crosscutting/AboutPage.tsx`. Migrate any unique improved copy into the active component and i18n files.

---

### CRIT-2: Truncated Content in Active Page Fallbacks AND i18n File
**Location:** `src/components/AboutPage.tsx` lines 19-83; `src/learnos/i18n/locales/en.json` lines 6360-6410

Users see incomplete, broken-sentence descriptions for core value propositions.

Example:
```tsx
desc: t('about.values.0.desc', 'We begin with questions...')
```
```json
"desc": "We begin with questions..."
```

The live page renders **"We begin with questions..."** instead of the full paragraph.

**Affected:** All 6 Value cards, all 6 Difference cards, all 3 Support question descriptions.

**Fix:** Replace all fallback strings with complete copy. Update `en.json` (and all locales) with full translations.

---

### CRIT-3: Personal Email Address Exposed in Orphaned Component
**Location:** `src/learnos/crosscutting/AboutPage.tsx` lines 458, 552

A personal Gmail address (`ars.jobs2019@gmail.com`) is hardcoded in the unreachable component and present in repository history.

**Fix:** Remove the crosscutting file. Ensure active component uses branded `contact@jigyasu.app`.

---

### CRIT-4: Corrupted Unicode / Broken Emoji in Orphaned Component
**Location:** `src/learnos/crosscutting/AboutPage.tsx` lines 125, 150, 536

Renders as replacement character `` or nonsensical "dY".

```tsx
<span className="text-xl"></span>       // should be 🦚
<div className="text-7xl">dY</div>        // should be 🦚
```

**Fix:** Delete the orphaned file.

---

### CRIT-5: Missing Konkani from "22 Languages" List
**Location:** `src/components/AboutPage.tsx` line 66

The card claims 22 languages but enumerates only 21. Listed: Assamese, Bengali, Bodo, Dogri, Gujarati, Hindi, Kannada, Kashmiri, Maithili, Malayalam, Manipuri, Marathi, Nepali, Odia, Punjabi, Sanskrit, Santali, Sindhi, Tamil, Telugu, and Urdu. **Konkani is missing.**

**Fix:** Add "Konkani" to the list.

---

## HIGH PRIORITY ISSUES

### HIGH-1: Section Title Swapped in Orphaned Component
**Location:** `src/learnos/crosscutting/AboutPage.tsx` lines 207-209, 287-288

If this file were reached, it would show "Our Values" under the Mission heading and "How we are different" under the Values heading.

**Fix:** Delete the file.

---

### HIGH-2: Double Navigation Stack on About Page
**Location:** `src/components/AboutPage.tsx` lines 111-127 + `src/App.tsx` lines 181-182

Users see **three** navigation layers: `TopNav`, `GlobalNav`, AND the internal sticky About nav. Creates visual clutter, z-index conflicts, and confusing UX.

**Fix:** Remove the internal sticky nav from `AboutPage.tsx`. Add anchor links to global nav if needed.

---

### HIGH-3: Missing Semantic HTML Landmarks
**Location:** `src/components/AboutPage.tsx` lines 106-553

No `<main>` element. No `<article>`. Screen readers and search engines see a flat `<div>` soup.

**Fix:** Wrap content in `<main>`. Use `<article>` or `<section>` semantics properly.

---

### HIGH-4: i18n Keys Use Auto-Generated Truncated Slugs
**Location:** Both AboutPage files

Unmaintainable keys like `auto.aboutpage.in_many_parts_of_india_educati`, `auto.aboutpage.people_do_not_hate_learning_th`.

**Fix:** Replace with semantic keys: `about.why_we_build.intro`, `about.why_we_build.adult_questions`, etc.

---

### HIGH-5: No `prefers-reduced-motion` Support
**Location:** `src/components/AboutPage.tsx` lines 9-14

```tsx
const FADE_UP = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.55, ease: 'easeOut' as const },
};
```

Applied unconditionally to ~12 sections. Violates WCAG 2.2.2.

**Fix:** Use Framer Motion's `useReducedMotion()` hook.

---

### HIGH-6: Missing Page-Level SEO / `<title>` / Meta Tags
**Location:** `src/components/AboutPage.tsx`

No `<title>`, no `<meta name="description">`, no Open Graph tags.

**Fix:** Add `react-helmet-async` with page-specific metadata.

---

## MEDIUM PRIORITY ISSUES

### MED-1: Redundant `overflow-hidden` with `break-words`
**Location:** `src/components/AboutPage.tsx` lines 254, 278, 308, 356

`overflow-hidden` can clip focus rings or translated text longer than English.

**Fix:** Remove `overflow-hidden` from text containers.

---

### MED-2: Emoji Without Accessibility Attributes
**Location:** `src/components/AboutPage.tsx` throughout

30+ emoji uses; none have `aria-hidden` or `role="img"`.

**Fix:** Add `aria-hidden="true"` to decorative emoji.

---

### MED-3: Anchor Links May Conflict with React Router
**Location:** `src/components/AboutPage.tsx` lines 123-125

`<a href="#mission">` triggers hash changes that may conflict with router scroll behavior.

**Fix:** Use smooth-scroll utility with `scrollIntoView`.

---

### MED-4: 2-Column Grid on Very Narrow Mobile
**Location:** `src/components/AboutPage.tsx` lines 492-510

`grid-cols-2` for support ways becomes cramped on screens <360px.

**Fix:** Use `grid-cols-1 sm:grid-cols-2`.

---

### MED-5: Index-Based React Keys for Static Lists
**Location:** `src/components/AboutPage.tsx` throughout

Some maps use `key={index}`; inconsistent with others that use `key={v.title}`.

**Fix:** Standardize on stable string keys.

---

### MED-6: Unwanted Whitespace from Multi-Line `Trans` Fallbacks
**Location:** `src/components/AboutPage.tsx` lines 158-178

Literal newlines and indentation inside `<Trans>` tags create irregular spacing.

**Fix:** Move fallback text to i18n files only, or use `defaults` prop.

---

### MED-7: Footer Copyright Hydration Risk
**Location:** `src/components/AboutPage.tsx` line 542

`new Date().getFullYear()` causes SSR hydration mismatch.

**Fix:** Hardcode the year or compute in `useEffect`.

---

### MED-8: Inconsistent Navigation Target
**Location:** Crosscutting uses `/home`; active uses `/`.

**Fix:** Delete orphaned file.

---

### MED-9: Orange Theme Low Contrast Risk
**Location:** `src/components/AboutPage.tsx` lines 327-362

`text-orange-400` checkmarks on `bg-orange-50` may fail WCAG AA.

**Fix:** Darken to `text-orange-600`.

---

## LOW PRIORITY ISSUES

1. **Raw Unicode Arrows:** `→` in mission bullets may be announced inconsistently by screen readers.
2. **No `rel` on mailto:** Good practice gap; minimal impact.
3. **Missing JSON-LD:** No structured data for search engines.
4. **No Sitemap Reference:** `/about` may not be indexed without static HTML fallback.
5. **`auto.aboutpage.dy` Artifact:** Corrupted peacock emoji key in orphaned file.
6. **Contact Form Uncertainty:** No inline preview of what the `/contact` form requires.

---

## CONTENT AUDIT SUMMARY

| Section | Status | Notes |
|---|---|---|
| Hero / Tagline | Good | "Install Wonder." is punchy and on-brand. |
| Problem Statement | Good | Empathetic, well-written, India-specific. |
| Mission | Needs Work | Heading lacks a clear value prop statement before bullets. |
| Who It's For | Excellent | Persona-driven copy is specific and emotionally resonant. |
| Values | **Broken** | All 6 cards have truncated descriptions (3-7 words). |
| Differences | **Broken** | Same truncation issue. Key differentiators are not explained. |
| Built for India | Good | Culturally grounded examples. |
| Sustainability | Good | Transparent, mission-first language. |
| Support / CTA | Good | "Relationships before transactions" is strong positioning. |
| Closing | Good | Reinforces brand. |

---

## RECOMMENDED ACTION PLAN

1. **Delete** `src/learnos/crosscutting/AboutPage.tsx` immediately.
2. **Restore** full descriptions from the orphaned file into `src/components/AboutPage.tsx` fallbacks and `en.json`.
3. **Add** Konkani to the 22 languages list.
4. **Remove** the internal sticky nav from the active AboutPage; rely on global navigation.
5. **Add** semantic HTML (`<main>`, etc.).
6. **Refactor** i18n keys to human-readable slugs.
7. **Implement** `useReducedMotion()` for all Framer Motion animations.
8. **Add** page-level SEO metadata (title, description, Open Graph).
9. **Audit** contrast ratios and emoji accessibility attributes.
10. **Verify** all 22 locale files contain full `about.*` translations, not truncated copies.
