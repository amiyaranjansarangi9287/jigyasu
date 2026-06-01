# Persona-Based Testing Setup

## Overview

Persona-based testing ensures Jigyasu works for our target learners across different contexts, abilities, and backgrounds. This document defines test personas and testing scenarios.

## Test Personas

### Persona 1: Rural Primary Student (Age 8)
**Name:** Priya
**Location:** Village in Uttar Pradesh
**Device:** Low-end Android phone (2GB RAM, 16GB storage)
**Connection:** 2G/3G, intermittent
**Language:** Hindi
**Literacy:** Basic Hindi, limited English
**Context:** Studies in government school, shares phone with siblings

**Testing Scenarios:**
- Can complete a module with slow internet
- Can navigate without reading English
- Can resume learning after interruption
- Can use shared phone mode
- Can understand instructions in Hindi

**Success Criteria:**
- Module loads within 5 seconds on 2G
- Hindi translations are accurate and natural
- Progress is saved locally
- UI is simple enough for 8-year-old
- Works with limited storage

---

### Persona 2: Urban Middle School Student (Age 12)
**Name:** Arjun
**Location:** City in Karnataka
**Device:** Mid-range Android phone (4GB RAM, 64GB storage)
**Connection:** 4G, stable
**Language:** Kannada and English
**Literacy:** Fluent in both languages
**Context:** Studies in private school, has own device

**Testing Scenarios:**
- Can switch between Kannada and English
- Can explore multiple modules in one session
- Can use keyboard shortcuts
- Can share progress on WhatsApp
- Can access advanced features

**Success Criteria:**
- Language switching works seamlessly
- Module completion is celebrated
- WhatsApp share works correctly
- Progress dashboard is accessible
- Performance is smooth on mid-range device

---

### Persona 3: Adult Learner (Age 35)
**Name:** Meena
**Location:** Small town in Tamil Nadu
**Device:** Budget smartphone (3GB RAM, 32GB storage)
**Connection:** 3G, occasional 4G
**Language:** Tamil
**Literacy:** Tamil, basic English
**Context:** Homemaker, learning for personal growth

**Testing Scenarios:**
- Can learn at own pace without pressure
- Can use accessibility features (screen reader, high contrast)
- Can understand content in Tamil
- Can navigate without prior tech experience
- Can track progress over time

**Success Criteria:**
- Content is age-appropriate
- Screen reader announcements work
- High-contrast mode is usable
- Tamil translations are culturally appropriate
- No judgment or grading pressure

---

### Persona 4: Teacher (Age 28)
**Name:** Rahul
**Location:** City in Maharashtra
**Device:** Laptop and smartphone
**Connection:** WiFi at school, 4G on phone
**Language:** Marathi, Hindi, English
**Literacy:** Fluent in all three
**Context:** Uses Jigyasu as teaching aid in classroom

**Testing Scenarios:**
- Can project modules on screen for class
- Can use modules aligned to curriculum
- Can track student progress
- Can access teacher resources
- Can recommend modules to students

**Success Criteria:**
- Modules work on laptop
- Content aligns with NCERT standards
- Teacher dashboard is functional
- Resources are downloadable
- Can share with students easily

---

### Persona 5: NGO Field Worker (Age 30)
**Name:** Sunita
**Location:** Rural area in Odisha
**Device:** Tablet (shared with team)
**Connection:** Hotspot from phone, variable
**Language:** Odia
**Literacy:** Odia, basic English
**Context:** Runs learning sessions in community center

**Testing Scenarios:**
- Can use on shared device
- Can work offline after initial load
- Can set up multiple learner profiles
- Can demonstrate modules to group
- Can track impact for reporting

**Success Criteria:**
- Shared phone mode works reliably
- Offline functionality is complete
- Profile switching is smooth
- Content works for group demonstration
- Impact data is accessible

---

### Persona 6: Student with Visual Impairment (Age 10)
**Name:** Kabir
**Location:** City in Gujarat
**Device:** Smartphone with screen reader
**Connection:** 4G
**Language:** Gujarati
**Literacy:** Braille, screen reader user
**Context:** Attends special school, uses assistive technology

**Testing Scenarios:**
- Can navigate using screen reader
- Can understand content through audio
- Can complete modules without visual cues
- Can use keyboard navigation
- Can access all features independently

**Success Criteria:**
- All interactive elements have ARIA labels
- Screen reader announcements are clear
- Keyboard navigation is complete
- No content is screen-reader-only
- Alt text is descriptive and accurate

---

### Persona 7: Low-End Device User (Age 14)
**Name:** Deepak
**Location:** Village in Bihar
**Device:** Old Android phone (1GB RAM, 8GB storage)
**Connection:** 2G, very slow
**Language:** Hindi
**Literacy:** Hindi
**Context:** Limited device storage, slow internet

**Testing Scenarios:**
- Can install app within storage limits
- Can use with very slow connection
- Can navigate with laggy interface
- Can complete module without crashing
- Can clear cache to free space

**Success Criteria:**
- App size is under 50MB
- Works with 1GB RAM
- Handles network timeouts gracefully
- No memory leaks
- Cache management is available

---

## Testing Matrix

| Persona | Device | Connection | Language | Key Scenarios | Priority |
|---------|--------|------------|----------|---------------|----------|
| Priya | Low-end Android | 2G/3G | Hindi | Slow internet, shared phone | High |
| Arjun | Mid-range Android | 4G | Kannada/English | Language switch, WhatsApp | Medium |
| Meena | Budget smartphone | 3G | Tamil | Accessibility, adult learning | High |
| Rahul | Laptop + Phone | WiFi/4G | Marathi/Hindi/English | Classroom use | Medium |
| Sunita | Tablet | Variable | Odia | Offline, shared device | High |
| Kabir | Smartphone + Screen Reader | 4G | Gujarati | Screen reader, keyboard | High |
| Deepak | Old Android | 2G | Hindi | Low-end device, storage | High |

## Test Scenarios by Feature

### Onboarding
- [ ] Priya can create profile in Hindi
- [ ] Arjun can switch language during onboarding
- [ ] Meena can use screen reader during onboarding
- [ ] Deepak can complete onboarding on slow connection

### Module Navigation
- [ ] Priya can navigate without reading English
- [ ] Arjun can use keyboard shortcuts
- [ ] Kabir can navigate using screen reader
- [ ] Meena can use high-contrast mode

### Wonder-First Modules
- [ ] Priya can complete module on 2G
- [ ] Arjun can complete module with animations
- [ ] Meena can complete with screen reader announcements
- [ ] Deepak can complete without crashing

### Progress Tracking
- [ ] Priya's progress saves on shared device
- [ ] Arjun can see progress dashboard
- [ ] Sunita can track multiple learners
- [ ] Rahul can view class progress

### Accessibility
- [ ] Kabir can use screen reader throughout
- [ ] Meena can use keyboard navigation
- [ ] All personas can use high-contrast mode
- [ ] All personas can use reduced motion

### Offline Functionality
- [ ] Sunita can use offline after initial load
- [ ] Priya can resume after connection loss
- [ ] Deepak can use with intermittent connection
- [ ] All personas can clear cache

### Performance
- [ ] Priya: Module loads in <5s on 2G
- [ ] Arjun: Smooth animations on 4G
- [ ] Deepak: No crashes on 1GB RAM
- [ ] Meena: Responsive interface on 3G

## Testing Tools

### Device Farm
- **BrowserStack**: Cross-device testing
- **AWS Device Farm**: Real device testing
- **Local Testing**: Physical devices from team

### Network Simulation
- **Chrome DevTools**: Network throttling
- **Charles Proxy**: Advanced network simulation
- **Network Link Conditioner**: macOS network simulation

### Accessibility Testing
- **NVDA**: Windows screen reader
- **JAWS**: Windows screen reader
- **VoiceOver**: macOS/iOS screen reader
- **TalkBack**: Android screen reader
- **WAVE**: Web accessibility evaluation tool
- **axe DevTools**: Accessibility testing browser extension

### Performance Testing
- **Lighthouse**: Performance auditing
- **WebPageTest**: Real-world performance
- **Chrome DevTools**: Performance profiling
- **Bundle Analyzer**: Bundle size analysis

## Test Execution Plan

### Weekly Testing
- Test high-priority personas (Priya, Kabir, Deepak, Sunita)
- Run automated tests for core functionality
- Test on latest device farm devices

### Monthly Testing
- Test all personas
- Full accessibility audit
- Performance budget review
- Network simulation testing

### Quarterly Testing
- New feature testing with all personas
- Device farm expansion
- Accessibility compliance audit
- Performance regression testing

## Success Metrics

### Overall
- 95% of test scenarios pass for all personas
- No critical bugs blocking any persona
- Accessibility score > 90 for all pages
- Performance score > 90 for all pages

### Per Persona
- **Priya**: 100% of rural scenarios pass
- **Arjun**: 100% of urban scenarios pass
- **Meena**: 100% of accessibility scenarios pass
- **Rahul**: 100% of teacher scenarios pass
- **Sunita**: 100% of offline scenarios pass
- **Kabir**: 100% of screen reader scenarios pass
- **Deepak**: 100% of low-end device scenarios pass

## Bug Triage

### Critical (Fix Immediately)
- Any persona cannot complete a module
- Screen reader completely unusable
- App crashes on any supported device
- Data loss for any persona

### High (Fix Within 1 Week)
- Significant accessibility issue
- Performance degradation for any persona
- Language translation errors
- Offline functionality broken

### Medium (Fix Within 2 Weeks)
- Minor accessibility issue
- Performance not meeting budget
- UI element hard to use for specific persona
- Feature not working for specific persona

### Low (Fix in Next Sprint)
- Cosmetic issue
- Nice-to-have improvement
- Edge case scenario
- Documentation update needed

## Continuous Improvement

### Persona Updates
- Review personas quarterly
- Add new personas based on user feedback
- Update device specifications as technology changes
- Adjust connection speeds based on real-world data

### Test Scenario Updates
- Add new scenarios for new features
- Remove obsolete scenarios
- Update success criteria based on feedback
- Expand test coverage for edge cases

### Tool Updates
- Evaluate new testing tools quarterly
- Update device farm subscriptions
- Upgrade accessibility testing tools
- Refresh performance baselines

---

*Persona-based testing should be integrated into the development process. Every feature should be tested against relevant personas before release. Last updated: May 2026*
