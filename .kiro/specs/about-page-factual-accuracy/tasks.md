# Tasks: About Page Factual Accuracy Fix

## Task 1: Create Email Replacement Script
**Status:** not_started  
**Assignee:** unassigned  
**Dependencies:** none

Create a Node.js script to replace all instances of the personal email across locale files.

**Sub-tasks:**
- [x] Create `scripts/fix-about-email.js` script
- [x] Implement JSON parsing with proper error handling
- [x] Add deep object traversal to find all email instances
- [x] Add backup creation before modifications
- [x] Add validation to check replacement success
- [x] Test on a single locale file first

**Acceptance Criteria:**
- Script replaces `ars.jobs2019@gmail.com` with `contact@jigyasu.app`
- Script handles both string formats: `ars.jobs2019@gmail.com` and `ars_jobs2019_gmail_com`
- Script creates backup files (.bak)
- Script validates JSON integrity after replacement
- Script logs all changes made
- Script handles ks.json corruption gracefully

**Files:**
- `scripts/fix-about-email.js` (new)

---

## Task 2: Run Email Replacement Across All Locales
**Status:** not_started  
**Assignee:** unassigned  
**Dependencies:** Task 1

Execute the replacement script on all 24 locale files and translation cache.

**Sub-tasks:**
- [ ] Run script on `apps/hub/src/learnos/i18n/locales/*.json`
- [ ] Run script on `translation_cache.json`
- [ ] Verify ks.json (Kashmiri) fixed correctly
- [ ] Validate all JSON files parse correctly
- [ ] Check git diff for unexpected changes
- [ ] Commit changes with clear message

**Acceptance Criteria:**
- All 24 locale files updated
- Translation cache updated
- Zero instances of `ars.jobs2019@gmail.com` remain
- All `contact@jigyasu.app` instances present
- All JSON files are valid
- ks.json corruption resolved

**Files:**
- `apps/hub/src/learnos/i18n/locales/*.json` (24 files)
- `translation_cache.json`

---

## Task 3: Update Language Count in AboutPage Component
**Status:** not_started  
**Assignee:** unassigned  
**Dependencies:** none

Update hardcoded language references in the active AboutPage component.

**Sub-tasks:**
- [ ] Update DIFFERENCES array title: "22" → "21 Indian Languages"
- [ ] Update DIFFERENCES array description to list 21 languages + note about 3 international
- [ ] Add "(24 total languages)" clarification
- [ ] Verify emoji alignment still correct
- [ ] Update any comments referencing language count

**Acceptance Criteria:**
- Title reads "21 Indian Languages"
- Description lists all 21 scheduled Indian languages (no Konkani)
- Description adds "Plus English, Spanish, and French (24 total languages)"
- No references to "22 languages" remain
- Component compiles without errors

**Files:**
- `apps/hub/src/components/AboutPage.tsx`

---

## Task 4: Update Language Count in en.json Locale
**Status:** not_started  
**Assignee:** unassigned  
**Dependencies:** none

Update English locale file with corrected language count and complete content.

**Sub-tasks:**
- [ ] Update `about.differences.2.title` to "21 Indian Languages"
- [ ] Update `about.differences.2.desc` with full list + 24 total note
- [ ] Update `about.indian_context.5.text` to reference 21 languages
- [ ] Update `about.languages` array to list all 24 languages
- [ ] Verify all keys match component expectations

**Acceptance Criteria:**
- `about.differences.2.title`: "21 Indian Languages"
- `about.differences.2.desc`: Full description with 21 Indian + 3 international clarification
- `about.languages` array: 24 language names
- `about.indian_context.5.text`: "21 Indian languages from day one"
- JSON is valid and properly formatted

**Files:**
- `apps/hub/src/learnos/i18n/locales/en.json`

---

## Task 5: Complete Truncated Content in en.json
**Status:** not_started  
**Assignee:** unassigned  
**Dependencies:** Task 6 (extract from crosscutting first)

Add complete descriptions for all values, differences, and support sections.

**Sub-tasks:**
- [ ] Add complete `about.values` descriptions (6 values)
- [ ] Add complete `about.differences` descriptions (6 differences)
- [ ] Add complete `about.support_questions` descriptions (3 questions)
- [ ] Add `about.hero_quote`
- [ ] Add `about.why_we_build_paragraphs` (3 paragraphs)
- [ ] Add `about.mission_statement`
- [ ] Add `about.mission_closing`
- [ ] Add `about.built_for_india_statement`
- [ ] Add `about.support_statement`
- [ ] Add `about.relationships_title`, `relationships_body`, `relationships_closing`
- [ ] Add `about.closing_body`
- [ ] Update `about.meta_description` with correct language count

**Acceptance Criteria:**
- No ellipsis (...) in any description
- All content complete and grammatically correct
- Content matches vision from design doc
- JSON structure valid
- All i18n keys referenced by component exist

**Files:**
- `apps/hub/src/learnos/i18n/locales/en.json`

---

## Task 6: Extract Complete Content from Crosscutting AboutPage
**Status:** not_started  
**Assignee:** unassigned  
**Dependencies:** none

Extract the better content from the dead code file before deletion.

**Sub-tasks:**
- [ ] Open `apps/hub/src/learnos/crosscutting/AboutPage.tsx`
- [ ] Extract VALUES array (complete descriptions)
- [ ] Extract DIFFERENCES array (complete descriptions)
- [ ] Extract SUPPORT_QUESTIONS array (complete descriptions)
- [ ] Extract any unique content not in active component
- [ ] Document extracted content in design doc reference

**Acceptance Criteria:**
- All complete descriptions documented
- Comparison done between active and crosscutting versions
- Best content identified for Task 5
- Ready for deletion after content migration

**Files:**
- `apps/hub/src/learnos/crosscutting/AboutPage.tsx` (read-only)

---

## Task 7: Update Manifest Files
**Status:** not_started  
**Assignee:** unassigned  
**Dependencies:** none

Update PWA manifest description with correct language count.

**Sub-tasks:**
- [ ] Update `apps/hub/public/manifest.webmanifest`
- [ ] Update `dist/manifest.webmanifest` (if different)
- [ ] Change "6 Indian languages" to "21 Indian languages"
- [ ] Validate JSON structure
- [ ] Test manifest loads correctly

**Acceptance Criteria:**
- Description: "Free visual STEM learning for every child in India. Works offline. 21 Indian languages."
- Both manifest files updated
- Valid JSON
- No other fields changed unintentionally

**Files:**
- `apps/hub/public/manifest.webmanifest`
- `dist/manifest.webmanifest`

---

## Task 8: Delete Crosscutting AboutPage Component
**Status:** not_started  
**Assignee:** unassigned  
**Dependencies:** Task 5, Task 6

Remove the dead code AboutPage after content has been migrated.

**Sub-tasks:**
- [ ] Verify content migration complete (Task 5 done)
- [ ] Search for any imports of this file
- [ ] Verify routing doesn't reference this file
- [ ] Delete `apps/hub/src/learnos/crosscutting/AboutPage.tsx`
- [ ] Test `/about` route still works
- [ ] Verify no console errors

**Acceptance Criteria:**
- File deleted from repository
- No imports reference this file
- `/about` route loads active AboutPage
- No broken imports
- No console errors
- Application builds successfully

**Files:**
- `apps/hub/src/learnos/crosscutting/AboutPage.tsx` (delete)

---

## Task 9: Validation Testing
**Status:** not_started  
**Assignee:** unassigned  
**Dependencies:** Tasks 1-8

Run comprehensive validation tests to ensure all fixes are correct.

**Sub-tasks:**
- [ ] Run email validation grep searches
- [ ] Run language count validation searches
- [ ] Verify crosscutting file deleted
- [ ] Check for import errors
- [ ] Build application successfully
- [ ] Manual test: Load `/about` page
- [ ] Manual test: Verify email links work
- [ ] Manual test: Check language count displays
- [ ] Manual test: Read all content sections
- [ ] Spot check: Test in HI locale
- [ ] Spot check: Test in TA locale

**Acceptance Criteria:**
- ✅ `grep -r "ars.jobs2019@gmail.com"` returns 0 results
- ✅ `grep -r "22 Indian Languages"` returns 0 results (or only in comments/docs)
- ✅ `grep -r "21 Indian Languages"` finds AboutPage and en.json
- ✅ Crosscutting file doesn't exist
- ✅ Application builds without errors
- ✅ About page renders correctly
- ✅ All content complete (no ellipsis)
- ✅ Email links functional
- ✅ Language switching works
- ✅ No console errors

---

## Task 10: Documentation Update
**Status:** not_started  
**Assignee:** unassigned  
**Dependencies:** Task 9

Update documentation and close out the fix.

**Sub-tasks:**
- [ ] Update CHANGELOG.md with fixes
- [ ] Update FULL_SITE_AUDIT_REPORT.md to mark issues as fixed
- [ ] Document changes in commit message
- [ ] Update any README references to language count
- [ ] Notify translation team of EN locale changes (optional)

**Acceptance Criteria:**
- CHANGELOG.md entry created
- Audit report updated
- Clear commit message written
- Documentation accurate
- Translation team notified (if applicable)

**Files:**
- `CHANGELOG.md`
- `FULL_SITE_AUDIT_REPORT.md`
- Any README files

---

## Summary

**Total Tasks:** 10  
**Estimated Time:** 2-3 hours  
**Priority:** P0 (Critical)

**Task Dependencies:**
```
Task 1 ──▶ Task 2
           
Task 6 ──▶ Task 5 ──▶ Task 8
           
Task 3, Task 4, Task 7 (parallel)

Tasks 1-8 ──▶ Task 9 ──▶ Task 10
```

**Critical Path:**
1. Task 1: Create script
2. Task 2: Run email replacement
3. Task 6: Extract content
4. Task 5: Complete content
5. Task 9: Validation
6. Task 10: Documentation

**Parallelizable Tasks:**
- Tasks 3, 4, 7 can be done simultaneously
- Task 8 can be done after Task 5 completes
