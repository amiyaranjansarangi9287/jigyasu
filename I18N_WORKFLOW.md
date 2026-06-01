# i18n Workflow for Adding New Languages

## Overview

This guide explains how to add a new language to Jigyasu. Jigyasu currently supports 6 languages: English, Hindi, Tamil, Telugu, Kannada, and Odia.

## Prerequisites

Before adding a new language:

1. **Market Research**: Verify there's sufficient demand for the language
2. **Translator Access**: Ensure access to native speakers for translation
3. **Font Support**: Verify fonts support the language's script
4. **RTL/LTR**: Determine if language is right-to-left (RTL) or left-to-right (LTR)
5. **Character Encoding**: Ensure UTF-8 support throughout the platform

## Step-by-Step Process

### Step 1: Add Language Code

**File:** `src/i18n.ts`

Add the new language code to the language object:

```typescript
const resources = {
  en: {
    translation: {
      // English translations
    }
  },
  hi: {
    translation: {
      // Hindi translations
    }
  },
  // ... existing languages
  [newLangCode]: {
    translation: {
      // New language translations
    }
  }
};
```

**Language Codes:**
- Use ISO 639-1 two-letter codes (e.g., `bn` for Bengali)
- For regional variants, use ISO 639-1 + ISO 3166-1 (e.g., `bn-IN` for Bengali in India)

### Step 2: Translate Core UI Strings

Create a translation spreadsheet with the following structure:

| Key | English | New Language | Notes |
|-----|---------|--------------|-------|
| welcome_title | Welcome to Jigyasu! | [Translation] | Main welcome message |
| start_learning | Start Learning | [Translation] | Button text |
| ... | ... | ... | ... |

**Translation Guidelines:**
- Use natural, conversational language
- Avoid literal translations
- Consider cultural context
- Keep similar length to English (for UI layout)
- Test with native speakers

### Step 3: Add Translations to i18n.ts

Add the translated strings to the language object:

```typescript
[newLangCode]: {
  translation: {
    welcome_title: 'Translated welcome message',
    start_learning: 'Translated button text',
    // ... all other keys
  }
}
```

### Step 4: Update Language Selector

**File:** `src/components/LanguageSelector.tsx` (or equivalent)

Add the new language to the selector:

```typescript
const languages = [
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'hi', name: 'हिंदी', flag: '🇮🇳' },
  // ... existing languages
  { code: 'newLangCode', name: 'Language Name', flag: '🏳️' },
];
```

### Step 5: Update Content Translations

**Files:** All module files, AboutPage.tsx, etc.

Add translations for content-specific strings:

```typescript
const { t } = useTranslation();

// In component
<h1>{t('module_title', 'Default Title')}</h1>
<p>{t('module_description', 'Default Description')}</p>
```

**Content Translation Guidelines:**
- Translate module titles and descriptions
- Translate festival names and descriptions
- Translate scientist names (transliterate if needed)
- Translate instructions and hints
- Keep technical terms in English where appropriate

### Step 6: Test Language Switching

1. **Manual Testing:**
   - Select new language from language selector
   - Verify all UI elements are translated
   - Check for missing translations (fallback to English)
   - Test on different pages and modules

2. **Automated Testing:**
   ```typescript
   // e2e/i18n.spec.ts
   test('language switching works', async ({ page }) => {
     await page.goto('/');
     await page.click('[data-testid="language-selector"]');
     await page.click(`[data-testid="lang-newLangCode"]`);
     await expect(page.locator('text=Translated Text')).toBeVisible();
   });
   ```

### Step 7: Add RTL Support (if needed)

If the new language is RTL (e.g., Arabic, Urdu):

**File:** `src/App.tsx` or global CSS

```css
[dir="rtl"] {
  direction: rtl;
  text-align: right;
}

[dir="rtl"] .flex-row {
  flex-direction: row-reverse;
}
```

**Update i18n.ts:**

```typescript
i18n.init({
  // ... existing config
  rtl: {
    ar: true,
    ur: true,
    // Add new RTL language
  }
});
```

### Step 8: Update Documentation

**Files to update:**
- README.md - Add language to supported languages list
- CONTRIBUTOR_GUIDE.md - Add language to language support section
- PARENT_GUIDE.md - Add parent guide in new language
- AMBASSADOR_PROGRAM_GUIDE.md - Add language to resources

### Step 9: Create Language-Specific Resources

**Parent Guide:** Create `PARENT_GUIDE_[lang].md` with translations
- Follow the structure of existing parent guides
- Adapt examples to cultural context
- Use appropriate tone and formality

**Email Templates:** Create translated versions of ambassador email templates
- Maintain professional tone
- Adapt cultural references
- Ensure formatting is preserved

### Step 10: Quality Assurance

**Translation Quality Checklist:**
- [ ] All UI strings translated
- [ ] No missing translations
- [ ] Natural language flow
- [ ] Cultural appropriateness
- [ ] Technical terms handled correctly
- [ ] Text fits in UI elements
- [ ] No broken layouts due to text length
- [ ] RTL support (if applicable)
- [ ] Font renders correctly
- [ ] Special characters display properly

**Testing Checklist:**
- [ ] Language selector works
- [ ] All pages display correctly
- [ ] Modules work in new language
- [ ] Progress tracking works
- [ ] Offline functionality works
- [ ] Accessibility features work
- [ ] Screen reader reads correctly
- [ ] Keyboard navigation works
- [ ] No console errors

## Translation Management

### Using Translation Management Tools

**Recommended Tools:**
- **Crowdin**: Cloud-based translation platform
- **POEditor**: Translation management
- **Lokalise**: Translation and localization platform
- **SimpleLocalize**: Developer-friendly translation tool

**Workflow with Crowdin:**

1. Upload source strings to Crowdin
2. Invite translators to the project
3. Translators work in Crowdin interface
4. Download translated files
5. Integrate into codebase

### Maintaining Translations

**When Adding New Features:**
1. Add new translation keys to English (source)
2. Mark as "needs translation" in translation tool
3. Notify translators
4. Update all languages before release

**When Updating Existing Strings:**
1. Update English source
2. Mark as "needs review" in translation tool
3. Translators review and update
4. Test all languages

## Common Issues and Solutions

### Issue: Text Overflow

**Cause:** Translated text is longer than English

**Solutions:**
- Use shorter translations
- Allow text wrapping
- Use ellipsis for long text
- Adjust font size for specific languages

### Issue: Missing Translations

**Cause:** New key added but not translated

**Solutions:**
- Use English as fallback
- Add missing translation indicator
- Prioritize translation of missing keys

### Issue: Font Doesn't Support Characters

**Cause:** Font doesn't have glyphs for language

**Solutions:**
- Use system fonts that support the language
- Include web font for the language
- Use Unicode font fallback

### Issue: Cultural Inappropriateness

**Cause:** Literal translation doesn't work culturally

**Solutions:**
- Use cultural equivalents
- Adapt examples to local context
- Consult native speakers

## Language-Specific Considerations

### Bengali
- Script: Bengali
- Direction: LTR
- Font: Use Noto Sans Bengali or similar
- Cultural: Adapt examples to Bengali culture

### Marathi
- Script: Devanagari
- Direction: LTR
- Font: Use Noto Sans Devanagari
- Cultural: Adapt to Maharashtra context

### Gujarati
- Script: Gujarati
- Direction: LTR
- Font: Use Noto Sans Gujarati
- Cultural: Adapt to Gujarat context

### Malayalam
- Script: Malayalam
- Direction: LTR
- Font: Use Noto Sans Malayalam
- Cultural: Adapt to Kerala context

### Punjabi
- Script: Gurmukhi
- Direction: LTR
- Font: Use Noto Sans Gurmukhi
- Cultural: Adapt to Punjab context

### Assamese
- Script: Assamese
- Direction: LTR
- Font: Use Noto Sans Assamese
- Cultural: Adapt to Assam context

## Release Process

### Before Release

1. **Translation Review:**
   - All translations reviewed by native speakers
   - No missing translations
   - Cultural appropriateness verified

2. **Testing:**
   - Full manual testing in new language
   - Automated i18n tests pass
   - Accessibility testing in new language

3. **Documentation:**
   - All documentation updated
   - Parent guide created
   - Release notes mention new language

### Release Checklist

- [ ] All translations complete
- [ ] Language selector updated
- [ ] RTL support (if needed)
- [ ] Documentation updated
- [ ] Parent guide created
- [ ] Testing complete
- [ ] No critical bugs
- [ ] Performance acceptable
- [ ] Accessibility verified

### Post-Release

1. **Monitor:**
   - Track language adoption
   - Monitor for translation issues
   - Collect user feedback

2. **Iterate:**
   - Fix translation errors
   - Improve cultural adaptation
   - Add missing translations

## Resources

### Translation Services
- **Professional**: Gengo, One Hour Translation
- **Community**: Transifex Community, Crowdin Community
- **Volunteer**: Local university language departments

### Fonts
- **Google Fonts**: Noto Sans family (covers many scripts)
- **Adobe Fonts**: Source Sans Pro
- **System Fonts**: Use system fonts where possible

### Documentation
- [i18next Documentation](https://www.i18next.com/)
- [MDN Internationalization](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl)
- [W3C Internationalization](https://www.w3.org/International/)

---

*Adding a new language requires careful planning and testing. Work with native speakers throughout the process to ensure quality and cultural appropriateness. Last updated: May 2026*
