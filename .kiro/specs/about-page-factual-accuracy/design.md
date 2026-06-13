# Design: About Page Factual Accuracy Fix

## Architecture Overview

This fix involves updates across 4 layers:
1. **Content Layer**: i18n locale JSON files
2. **Component Layer**: AboutPage React component
3. **Build Artifacts**: Compiled manifest file
4. **Cache Layer**: Translation cache cleanup

## Implementation Strategy

### Phase 1: Email Replacement (CRITICAL)
**Priority:** P0 - Security/Brand Risk  
**Approach:** Automated find-replace across all files

#### Script Approach
Create a Node.js script to:
1. Find all locale JSON files
2. Parse each as JSON
3. Deep search for `ars.jobs2019@gmail.com` or `ars_jobs2019_gmail_com`
4. Replace with `contact@jigyasu.app` / `contact_jigyasu_app`
5. Re-stringify with proper formatting
6. Write back to file

**Why script vs manual:**
- 24 locale files × multiple occurrences = high error risk
- Ensures consistent formatting
- Atomic operation per file
- Easier to verify completion

#### Files Affected
```
apps/hub/src/learnos/i18n/locales/
├── as.json
├── bn.json
├── brx.json
├── doi.json
├── en.json (most important)
├── es.json
├── fr.json
├── gu.json
├── hi.json
├── kn.json
├── ks.json (CRITICAL: corrupted with repeated emails)
├── mai.json
├── ml.json
├── mni.json
├── mr.json
├── ne.json
├── od.json
├── pa.json
├── sa.json
├── sat.json
├── sd.json
├── ta.json
├── te.json
└── ur.json

translation_cache.json
```

**Special Case: ks.json (Kashmiri)**
- Has malformed repeated email strings
- Needs extra validation after replacement
- May require manual inspection

---

### Phase 2: Language Count Correction
**Priority:** P0 - Factual Accuracy

#### Content Updates

**1. AboutPage.tsx Component**
```tsx
// BEFORE (line ~50)
const DIFF_EMOJIS = ['🌐', '📱', '🗣️', '📴', '👨‍👩‍👧', '🫀'];

differences: [
  // ...
  {
    emoji: '🗣️',
    title: '22 Indian Languages',
    desc: 'Assamese, Bengali, Bodo, Dogri, Gujarati, Hindi, Kannada, Kashmiri, Maithili, Malayalam, Manipuri, Marathi, Nepali, Odia, Punjabi, Sanskrit, Santali, Sindhi, Tamil, Telugu, and Urdu from day one. Understanding begins in the language closest to the learner.',
  },
  // ...
]

// AFTER
differences: [
  // ...
  {
    emoji: '🗣️',
    title: '21 Indian Languages',
    desc: 'Assamese, Bengali, Bodo, Dogri, Gujarati, Hindi, Kannada, Kashmiri, Maithili, Malayalam, Manipuri, Marathi, Nepali, Odia, Punjabi, Sanskrit, Santali, Sindhi, Tamil, Telugu, and Urdu from day one. Plus English, Spanish, and French (24 total languages). Understanding begins in the language closest to the learner.',
  },
  // ...
]
```

**2. en.json Locale**
```json
{
  "about": {
    "differences": {
      "2": {
        "title": "21 Indian Languages",
        "desc": "Assamese, Bengali, Bodo, Dogri, Gujarati, Hindi, Kannada, Kashmiri, Maithili, Malayalam, Manipuri, Marathi, Nepali, Odia, Punjabi, Sanskrit, Santali, Sindhi, Tamil, Telugu, and Urdu from day one. Plus English, Spanish, and French (24 total languages). Understanding begins in the language closest to the learner."
      }
    },
    "indian_context": {
      "5": {
        "text": "21 Indian languages from day one",
        "interpolate": {
          "count": true
        }
      }
    },
    "languages": [
      "Assamese", "Bengali", "Bodo", "Dogri", "Gujarati", "Hindi", 
      "Kannada", "Kashmiri", "Maithili", "Malayalam", "Manipuri", 
      "Marathi", "Nepali", "Odia", "Punjabi", "Sanskrit", "Santali", 
      "Sindhi", "Tamil", "Telugu", "Urdu", "English", "Spanish", "French"
    ]
  }
}
```

**3. Manifest Files**
```json
// apps/hub/public/manifest.webmanifest
// dist/manifest.webmanifest
{
  "name": "Jigyasu",
  "short_name": "Jigyasu",
  "description": "Free visual STEM learning for every child in India. Works offline. 21 Indian languages.",
  // ... rest unchanged
}
```

**4. Meta Description**
```tsx
// AboutPage.tsx useEffect
meta.setAttribute('content', 
  'Jigyasu is a free, visual, multilingual learning platform built for every Indian child and adult. 21 Indian languages. Works offline. No sign-up required.'
);
```

---

### Phase 3: Content Completion
**Priority:** P1 - User Experience

#### Source Mapping
Use `src/learnos/crosscutting/AboutPage.tsx` as reference for complete descriptions, then delete it.

**Extraction Process:**
1. Read crosscutting AboutPage.tsx
2. Extract DIFFERENCES, VALUES, SUPPORT_QUESTIONS arrays
3. Map to corresponding en.json structure
4. Validate completeness (no ellipsis)
5. Apply to en.json
6. Delete crosscutting file

#### Complete Values (from crosscutting file)
```typescript
const VALUES = [
  {
    emoji: '✨',
    title: 'Wonder',
    desc: 'We begin with questions, not answers. Curiosity drives every lesson. The 'why' matters more than the 'what'.',
  },
  {
    emoji: '⚖️',
    title: 'Equity',
    desc: 'One platform for everyone. No premium tiers. The child in a village in Odisha and the child in an apartment in Bengaluru see the same beautiful concept.',
  },
  {
    emoji: '🤝',
    title: 'Respect',
    desc: 'No grades. No timers. No judgment. Every learner moves at their own pace. Understanding cannot be rushed.',
  },
  {
    emoji: '🌱',
    title: 'Patience',
    desc: 'Learning takes time. Mastery is not instant. We celebrate the journey, not just the destination.',
  },
  {
    emoji: '🎉',
    title: 'Joy',
    desc: 'If learning is not joyful, we've failed. Education should spark delight, not dread.',
  },
  {
    emoji: '🇮🇳',
    title: 'Identity',
    desc: 'Indian scientists, Indian context, Indian languages. We learn through examples that feel like home.',
  },
];
```

#### Complete Differences
```typescript
const DIFFERENCES = [
  {
    emoji: '🌐',
    title: 'Free by Design',
    desc: 'There is no 'poor version' and 'premium version'. Everyone gets the same platform. Always free. No ads. No upsells.',
  },
  {
    emoji: '📱',
    title: 'Website First',
    desc: 'A link shared on WhatsApp works instantly. No app store. No waiting. No storage required. Just open and learn.',
  },
  {
    emoji: '🗣️',
    title: '21 Indian Languages',
    desc: 'Assamese, Bengali, Bodo, Dogri, Gujarati, Hindi, Kannada, Kashmiri, Maithili, Malayalam, Manipuri, Marathi, Nepali, Odia, Punjabi, Sanskrit, Santali, Sindhi, Tamil, Telugu, and Urdu from day one. Plus English, Spanish, and French. Understanding begins in the language closest to the learner.',
  },
  {
    emoji: '📴',
    title: 'Offline First',
    desc: 'Designed to work on 2G connections and after the internet goes away. Because in rural India, learning cannot wait for reliable internet.',
  },
  {
    emoji: '👨‍👩‍👧',
    title: 'For Every Age',
    desc: 'Ages 2 to 80+. Children, parents, grandparents, adults who left school early but never stopped wondering. There is no age limit on understanding.',
  },
  {
    emoji: '🫀',
    title: 'Visual and Interactive',
    desc: 'You do not just watch. You wonder, test, discover, and explain. Every concept moves, responds, and connects to real life.',
  },
];
```

#### Complete Support Questions
```typescript
const SUPPORT_QUESTIONS = [
  {
    emoji: '👤',
    label: 'The Who',
    desc: 'A brief intro about yourself or your organization',
  },
  {
    emoji: '💡',
    label: 'The Why',
    desc: 'Why does Jigyasu's mission resonate with you?',
  },
  {
    emoji: '🛤️',
    label: 'The How',
    desc: 'How do you envision supporting or partnering with us?',
  },
];
```

#### Additional Content to Add
```json
{
  "about": {
    "hero_quote": "Every child is born curious. We built a platform to keep that wonder alive.",
    
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
    
    "mission_statement": "To make visual, conceptual, joyful learning available to every person in India—regardless of age, income, location, or language.",
    "mission_closing": "We are building the learning platform India deserves.",
    
    "built_for_india_statement": "Jigyasu is designed for Indian learners, with Indian context, Indian scientists, and Indian languages at its heart.",
    
    "support_statement": "Jigyasu is built with love, patience, and the belief that every child deserves wonder.",
    "relationships_title": "Relationships Before Transactions",
    "relationships_body": "We believe in building genuine partnerships, not just vendor relationships. If our mission resonates with you, let's talk.",
    "relationships_closing": "Whether you're an individual contributor, a corporate CSR team, or an NGO—your support helps us reach more learners.",
    
    "closing_body": "Thank you for believing in a future where wonder is not a privilege, but a right."
  }
}
```

---

### Phase 4: Dead Code Removal
**Priority:** P2 - Technical Debt

#### File to Delete
```
apps/hub/src/learnos/crosscutting/AboutPage.tsx
```

#### Validation Steps
1. **Search for imports:**
   ```bash
   grep -r "learnos/crosscutting/AboutPage" apps/hub/src/
   ```
   Expected: No results (unreachable)

2. **Check routing:**
   - Verify `apps/hub/src/learnos/App.tsx` line 108 route is unreachable
   - Verify `apps/hub/src/App.tsx` line 143 is the active route

3. **Delete file:**
   ```bash
   rm apps/hub/src/learnos/crosscutting/AboutPage.tsx
   ```

4. **Test:**
   - Navigate to `/about` → should load active AboutPage
   - No console errors
   - No broken imports

---

## Data Flow Diagram

```
┌─────────────────────────────────────────────────────────┐
│ Phase 1: Email Replacement Script                      │
│                                                         │
│  ┌──────────────┐     ┌──────────────┐                │
│  │ Locale Files │────▶│ Replace      │                │
│  │ (24 files)   │     │ Script       │                │
│  └──────────────┘     └──────┬───────┘                │
│                              │                         │
│                              ▼                         │
│                       ┌──────────────┐                │
│                       │ Updated      │                │
│                       │ JSON Files   │                │
│                       └──────────────┘                │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│ Phase 2: Language Count Update                         │
│                                                         │
│  ┌──────────────┐     ┌──────────────┐                │
│  │ AboutPage    │────▶│ Update       │                │
│  │ Component    │     │ hardcoded    │                │
│  └──────────────┘     │ arrays       │                │
│                       └──────┬───────┘                │
│  ┌──────────────┐           │                         │
│  │ en.json      │───────────┤                         │
│  └──────────────┘           │                         │
│                              │                         │
│  ┌──────────────┐           │                         │
│  │ manifest     │───────────┘                         │
│  └──────────────┘                                     │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│ Phase 3: Content Completion                            │
│                                                         │
│  ┌──────────────────┐                                  │
│  │ crosscutting/    │                                  │
│  │ AboutPage.tsx    │                                  │
│  │ (source)         │                                  │
│  └────────┬─────────┘                                  │
│           │ Extract complete arrays                    │
│           ▼                                            │
│  ┌──────────────────┐     ┌──────────────┐            │
│  │ en.json          │────▶│ Update       │            │
│  │ (destination)    │     │ descriptions │            │
│  └──────────────────┘     └──────────────┘            │
│                                                         │
│           ▼                                            │
│  ┌──────────────────┐                                  │
│  │ Delete source    │                                  │
│  │ file             │                                  │
│  └──────────────────┘                                  │
└─────────────────────────────────────────────────────────┘
```

---

## File Structure Impact

### Before
```
apps/hub/src/
├── components/
│   └── AboutPage.tsx ✅ (active, incomplete content)
├── learnos/
│   ├── crosscutting/
│   │   └── AboutPage.tsx ❌ (dead code, better content)
│   └── i18n/
│       └── locales/
│           ├── en.json (incomplete, wrong email)
│           ├── hi.json (wrong email)
│           └── ... (22 more with wrong email)
└── ...

apps/hub/public/
└── manifest.webmanifest (says "6 languages")

dist/
└── manifest.webmanifest (says "6 languages")

translation_cache.json (wrong email)
```

### After
```
apps/hub/src/
├── components/
│   └── AboutPage.tsx ✅ (active, complete content)
├── learnos/
│   ├── crosscutting/
│   │   [AboutPage.tsx deleted]
│   └── i18n/
│       └── locales/
│           ├── en.json (complete, correct email, 21 languages)
│           ├── hi.json (correct email)
│           └── ... (22 more with correct email)
└── ...

apps/hub/public/
└── manifest.webmanifest (says "21 Indian languages")

dist/
└── manifest.webmanifest (says "21 Indian languages")

translation_cache.json (correct email)
```

---

## Edge Cases & Error Handling

### Edge Case 1: Malformed JSON in ks.json
**Issue:** Kashmiri locale has repeated email strings (translation error)

**Detection:**
```javascript
const content = fs.readFileSync('ks.json', 'utf8');
const emailCount = (content.match(/ars\.jobs2019@gmail\.com/g) || []).length;
if (emailCount > 100) {
  console.warn('⚠️  ks.json appears corrupted with repeated emails');
}
```

**Handling:**
1. Replace all instances normally
2. Parse JSON to validate structure
3. If parse fails, flag for manual review
4. Check character count of replaced value (should be ~50 chars, not 5000)

### Edge Case 2: Cached Translations
**Issue:** Browser/CDN may cache old translations

**Solution:**
1. Update version number in manifest to bust cache
2. Add cache-busting query param to locale file imports
3. Document cache clear instructions for users

### Edge Case 3: Mid-flight Translations
**Issue:** Someone may be working on translations when we update

**Prevention:**
1. Update EN locale first
2. Communicate with translation team
3. Provide clear diff of changes
4. Other locales can be updated via normal translation workflow

---

## Testing Strategy

### Unit Tests
Not applicable (content changes, no logic)

### Integration Tests
1. **Email Validation**
   ```bash
   # Should return 0 results
   grep -r "ars.jobs2019@gmail.com" apps/hub/src/
   grep -r "ars_jobs2019_gmail_com" apps/hub/src/
   
   # Should return expected results
   grep -r "contact@jigyasu.app" apps/hub/src/
   ```

2. **Language Count Validation**
   ```bash
   # Should find "21 Indian Languages" not "22"
   grep -r "22 Indian Languages" apps/hub/src/
   grep -r "21 Indian Languages" apps/hub/src/
   ```

3. **File Deletion Validation**
   ```bash
   # Should not exist
   ls apps/hub/src/learnos/crosscutting/AboutPage.tsx
   
   # Should not be imported
   grep -r "learnos/crosscutting/AboutPage" apps/hub/src/
   ```

### Manual Tests
1. Navigate to `/about` in browser
2. Verify email shows `contact@jigyasu.app`
3. Verify language count shows "21 Indian Languages"
4. Verify all content sections are complete (no ellipsis)
5. Verify no console errors
6. Test in EN, HI, TA locales (spot check)

### Acceptance Tests
- [ ] Personal email replaced in all files
- [ ] Language count updated in all locations
- [ ] Manifest updated
- [ ] Content complete and readable
- [ ] Crosscutting AboutPage deleted
- [ ] No broken imports
- [ ] About page loads successfully
- [ ] All email links work

---

## Rollback Plan

### If Email Replacement Fails
1. Git revert commit
2. Restore from backup (if script creates backups)
3. Manual fix critical files (en.json, AboutPage.tsx)

### If Language Count Update Causes Issues
1. Revert to "22 languages" temporarily
2. Add Konkani locale as empty file
3. Update documentation to clarify status

### If Content Completion Breaks i18n
1. Revert en.json to previous version
2. Use fallback strings in AboutPage component
3. Fix i18n keys incrementally

---

## Dependencies

### Tools Required
- Node.js (for replacement script)
- Git (for version control)
- Text editor with find-replace (fallback)

### External Dependencies
None - all changes are internal to codebase

### Team Dependencies
- Translation team (for propagating EN changes to other locales later)
- QA team (for manual testing)
- DevOps (for cache invalidation if needed)

---

## Implementation Order

1. ✅ Create replacement script for email
2. ✅ Run script on all locale files + translation cache
3. ✅ Update AboutPage.tsx component (language count + hardcoded arrays)
4. ✅ Update en.json with complete content
5. ✅ Update manifest.webmanifest files
6. ✅ Delete crosscutting/AboutPage.tsx
7. ✅ Run validation tests
8. ✅ Manual QA testing
9. ✅ Commit changes
10. ✅ Deploy

**Estimated Time:** 2-3 hours total
