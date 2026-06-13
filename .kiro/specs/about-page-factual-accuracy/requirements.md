# About Page Factual Accuracy & Critical Issues Fix

## Overview
Fix critical factual discrepancies, security issues, and content gaps identified in the comprehensive audit of the Jigyasu About Us page and related marketing content.

## Problem Statement
The About Us page and related content contain several critical issues:
1. Personal email address (`ars.jobs2019@gmail.com`) exposed across 24+ locale files
2. Incorrect language count claims (states 22, should be 21 since Konkani not supported)
3. Outdated manifest.webmanifest with wrong language count ("6 Indian languages")
4. Duplicate/dead AboutPage component creating maintenance issues
5. Truncated/incomplete content with ellipsis placeholders

These issues undermine credibility, pose security risks, and create confusion about actual product capabilities.

## User Stories

### US-1: Professional Contact Information
**As a** potential partner or user  
**I want to** see professional branded email addresses  
**So that** I trust the platform and can contact the team appropriately

**Acceptance Criteria:**
- All instances of `ars.jobs2019@gmail.com` replaced with `contact@jigyasu.app`
- Applies to: 24 locale JSON files, translation cache, AboutPage components
- Privacy/legal emails remain: `privacy@jigyasu.app`, `legal@jigyasu.app`

---

### US-2: Accurate Language Count
**As a** user reading the About page  
**I want to** see accurate information about supported languages  
**So that** I understand what's actually available

**Acceptance Criteria:**
- About page states "21 Indian Languages" (not 22)
- Enumerated list includes exactly 21 scheduled Indian languages (excluding Konkani)
- List: Assamese, Bengali, Bodo, Dogri, Gujarati, Hindi, Kannada, Kashmiri, Maithili, Malayalam, Manipuri, Marathi, Nepali, Odia, Punjabi, Sanskrit, Santali, Sindhi, Tamil, Telugu, Urdu
- Additional note: "Plus English, Spanish, and French (24 total languages)"
- Manifest description updated to reflect current count

---

### US-3: Complete Mission Content
**As a** visitor to the About page  
**I want to** read complete mission statements and values  
**So that** I understand Jigyasu's vision and purpose

**Acceptance Criteria:**
- All value descriptions complete (no "..." ellipsis)
- All "differences" descriptions complete
- Mission statement fully written
- Sustainability paragraphs complete
- "Why We Build" section complete
- Support questions fully described

---

### US-4: Single Source of Truth
**As a** developer maintaining the codebase  
**I want** only one AboutPage component  
**So that** content doesn't drift and maintenance is straightforward

**Acceptance Criteria:**
- Delete `src/learnos/crosscutting/AboutPage.tsx` (unreachable dead code)
- Keep only `src/components/AboutPage.tsx` as active
- Migrate any unique improved copy to active component
- Update routing if needed

---

## Technical Requirements

### TR-1: Email Replacement
**Files to update:**
- `apps/hub/src/learnos/i18n/locales/*.json` (all 24 files)
- `translation_cache.json`
- Search for any hardcoded instances in components

**Find:** `ars.jobs2019@gmail.com` or `ars_jobs2019_gmail_com`  
**Replace with:** `contact@jigyasu.app` or `contact_jigyasu_app`

---

### TR-2: Language Count Update
**Files to update:**
1. **AboutPage.tsx**
   - Line referencing "22 Indian Languages" → "21 Indian Languages"
   - Enumerated language list (ensure exactly 21, no Konkani)
   
2. **manifest.webmanifest** (`apps/hub/public/manifest.webmanifest` and `dist/manifest.webmanifest`)
   - Description: "Works offline. 6 Indian languages" → "Works offline. 21 Indian languages."

3. **en.json locale**
   - Update `about.differences.2.title` and `about.differences.2.desc` to reflect accurate count

---

### TR-3: Content Completion
**Source for complete content:** Use `src/learnos/crosscutting/AboutPage.tsx` as reference (it has fuller descriptions)

**Content to complete in `en.json`:**

```json
"about": {
  "values": {
    "0": {
      "title": "Wonder",
      "desc": "We begin with questions, not answers. Curiosity drives every lesson. The 'why' matters more than the 'what'."
    },
    "1": {
      "title": "Equity",
      "desc": "One platform for everyone. No premium tiers. The child in a village in Odisha and the child in an apartment in Bengaluru see the same beautiful concept."
    },
    "2": {
      "title": "Respect",
      "desc": "No grades. No timers. No judgment. Every learner moves at their own pace. Understanding cannot be rushed."
    },
    "3": {
      "title": "Patience",
      "desc": "Learning takes time. Mastery is not instant. We celebrate the journey, not just the destination."
    },
    "4": {
      "title": "Joy",
      "desc": "If learning is not joyful, we've failed. Education should spark delight, not dread."
    },
    "5": {
      "title": "Identity",
      "desc": "Indian scientists, Indian context, Indian languages. We learn through examples that feel like home."
    }
  },
  "title": "Jigyasu",
  "tagline": "Install Wonder.",
  "hero_quote": "Every child is born curious. We built a platform to keep that wonder alive.",
  
  "why_we_build_title": "Why We Are Building This",
  "why_we_build_paragraphs": {
    "0": {
      "text": "In India, education has become a race. Coaching institutes cost ₹50,000 a year. Tuition fees keep rising. The child who cannot afford this falls behind.",
      "emphasis": false
    },
    "1": {
      "text": "We believe understanding should not depend on your parents' income.",
      "emphasis": true
    },
    "2": {
      "text": "Jigyasu is not a replacement for school. It is a patient, visual, always-available teacher that works on 2G internet and asks for nothing in return.",
      "emphasis": false
    }
  },
  
  "mission_title": "Our Mission",
  "mission_statement": "To make visual, conceptual, joyful learning available to every person in India—regardless of age, income, location, or language.",
  "mission_closing": "We are building the learning platform India deserves.",
  
  "who_it_is_for_title": "Who Jigyasu Is For",
  
  "values_title": "What We Believe",
  
  "differences_title": "What We Built — and Why",
  "differences": {
    "0": {
      "title": "Free by Design",
      "desc": "There is no 'poor version' and 'premium version'. Everyone gets the same platform. Always free. No ads. No upsells."
    },
    "1": {
      "title": "Website First",
      "desc": "A link shared on WhatsApp works instantly. No app store. No waiting. No storage required. Just open and learn."
    },
    "2": {
      "title": "21 Indian Languages",
      "desc": "Assamese, Bengali, Bodo, Dogri, Gujarati, Hindi, Kannada, Kashmiri, Maithili, Malayalam, Manipuri, Marathi, Nepali, Odia, Punjabi, Sanskrit, Santali, Sindhi, Tamil, Telugu, and Urdu from day one. Plus English, Spanish, and French. Understanding begins in the language closest to the learner."
    },
    "3": {
      "title": "Offline First",
      "desc": "Designed to work on 2G connections and after the internet goes away. Because in rural India, learning cannot wait for reliable internet."
    },
    "4": {
      "title": "For Every Age",
      "desc": "Ages 2 to 80+. Children, parents, grandparents, adults who left school early but never stopped wondering. There is no age limit on understanding."
    },
    "5": {
      "title": "Visual and Interactive",
      "desc": "You do not just watch. You wonder, test, discover, and explain. Every concept moves, responds, and connects to real life."
    }
  },
  
  "built_for_india_title": "Built for India",
  "built_for_india_statement": "Jigyasu is designed for Indian learners, with Indian context, Indian scientists, and Indian languages at its heart.",
  
  "languages": ["Assamese", "Bengali", "Bodo", "Dogri", "Gujarati", "Hindi", "Kannada", "Kashmiri", "Maithili", "Malayalam", "Manipuri", "Marathi", "Nepali", "Odia", "Punjabi", "Sanskrit", "Santali", "Sindhi", "Tamil", "Telugu", "Urdu", "English", "Spanish", "French"],
  
  "indian_context": {
    "0": {
      "text": "Rupees, not dollars"
    },
    "1": {
      "text": "Rotis and chai, not only pizzas"
    },
    "2": {
      "text": "Monsoons, ISRO, cricket, Indian markets"
    },
    "3": {
      "text": "Aryabhata, Ramanujan, C.V. Raman, J.C. Bose"
    },
    "4": {
      "text": "APJ Abdul Kalam, Sushruta, Brahmagupta"
    },
    "5": {
      "text": "21 Indian languages from day one",
      "interpolate": {
        "count": true
      }
    },
    "6": {
      "text": "Designed for 2G and shared phones"
    },
    "7": {
      "text": "Offline-first for rural learners"
    }
  },
  
  "sustainability_title": "How We Plan to Sustain This",
  "sustainability_paragraphs": {
    "0": {
      "text": "Jigyasu will always be free for learners. No paywalls. No premium features. No ads.",
      "style": "highlight"
    },
    "1": {
      "text": "We are exploring partnerships with corporations, NGOs, and philanthropic organizations who share our mission.",
      "style": "followup"
    },
    "2": {
      "text": "If you represent an organization that values education equity, we would love to talk."
    }
  },
  
  "support_title": "Join the Mission",
  "support_statement": "Jigyasu is built with love, patience, and the belief that every child deserves wonder.",
  
  "relationships_title": "Relationships Before Transactions",
  "relationships_body": "We believe in building genuine partnerships, not just vendor relationships. If our mission resonates with you, let's talk.",
  "relationships_closing": "Whether you're an individual contributor, a corporate CSR team, or an NGO—your support helps us reach more learners.",
  
  "contact_label": "Reach out to us at:",
  "contact_form": "Contact Us via Form",
  "email_us": "Email Us Directly",
  "contact_email": "contact@jigyasu.app",
  "contact_desc": "When you write to us, we would love to know:",
  
  "support_questions": {
    "0": {
      "emoji": "👤",
      "label": "The Who",
      "desc": "A brief intro about yourself or your organization"
    },
    "1": {
      "emoji": "💡",
      "label": "The Why",
      "desc": "Why does Jigyasu's mission resonate with you?"
    },
    "2": {
      "emoji": "🛤️",
      "label": "The How",
      "desc": "How do you envision supporting or partnering with us?"
    }
  },
  
  "support_ways_title": "Ways you can support us:",
  
  "support_closing": "Every contribution—big or small—brings us closer to our mission of making learning accessible to every Indian.",
  
  "closing_body": "Thank you for believing in a future where wonder is not a privilege, but a right.",
  "closing_tagline": "Install Wonder.",
  "copyright_name": "Jigyasu",
  
  "page_title": "About Jigyasu — Install Wonder",
  "meta_description": "Jigyasu is a free, visual, multilingual learning platform built for every Indian child and adult. 21 Indian languages. Works offline. No sign-up required."
}
```

---

### TR-4: Delete Dead Code
**File to delete:** `apps/hub/src/learnos/crosscutting/AboutPage.tsx`

**Validation:**
- Ensure no imports reference this file
- Route `/about` only defined once (in main App.tsx)
- No broken imports after deletion

---

## Non-Functional Requirements

### NFR-1: SEO Optimization
- Update meta description with accurate language count
- Ensure page title reflects current state
- Add JSON-LD structured data (optional enhancement)

### NFR-2: Accessibility
- Ensure emojis have proper aria-labels or are aria-hidden
- Heading hierarchy remains logical
- Links have descriptive text

### NFR-3: Internationalization
- All content changes must be reflected in EN locale first
- Other locale files can be updated via translation workflow
- Maintain consistent i18n key structure

---

## Risks & Assumptions

### Risks
1. **Translation propagation delay**: Fixing EN locale won't immediately fix other 23 languages
2. **Cache invalidation**: Users may see old email/counts until cache clears
3. **External references**: Email may be referenced in external documentation

### Assumptions
1. Konkani (kok) is definitively not supported and won't be added soon
2. `contact@jigyasu.app` email is active and monitored
3. Language count of 21 is accurate and stable

---

## Success Metrics
- ✅ Zero instances of personal email in production code
- ✅ Language count matches actual locale file count (21 Indian + 3 international)
- ✅ About page loads with complete, non-truncated content
- ✅ Single AboutPage component in codebase
- ✅ Manifest description updated
- ✅ No broken routes after deletion

---

## Out of Scope
- Translation of updated content to other 23 languages (separate workflow)
- Design changes to About page layout
- Adding new content sections
- SEO schema markup (nice-to-have, not critical)
- Fixing other non-critical issues from audit report
