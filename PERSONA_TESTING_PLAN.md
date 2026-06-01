# Persona-Based Testing Plan for Jigyasu (LearnOS + KidsCamp)

## Overview
This document outlines 4 persona simulations to test the Jigyasu learning platform's ability to engage learners for 2-3 hour sessions across different age groups and languages.

## Platform Context
- **LearnOS**: Structured learning paths (Tiny World 3-5, Adventure Academy 6-8, Lab Zero 9-12)
- **KidsCamp**: Maker Space (Cosmos Lab, Art Studio, Outdoor Quest)
- **Languages**: English, Hindi, Tamil, Telugu, Kannada, Odia
- **Target Audience**: Ages 2-80+
- **Mission**: Free, visual, multilingual learning for India

---

## Persona Profiles

### Persona 1: Aarav (Age 6-7, Hindi)
**Background:**
- Name: Aarav Sharma
- Age: 6 years, 7 months
- Location: Tier-2 city in Madhya Pradesh
- Language: Hindi (native), basic English recognition
- Education: Class 1 in government school
- Tech access: Shared Android phone with family (father's phone)
- Reading level: Early reader (can read simple words, struggles with complex sentences)
- Attention span: 15-20 minutes focused, needs variety

**Cognitive Characteristics:**
- Visual learner (responds to colors, animations, emojis)
- Concrete thinker (needs tangible examples)
- Curious but easily frustrated by complex instructions
- Learns through repetition and play
- Emotional connection to content matters

**Learning Goals:**
- Explore colors, shapes, basic numbers
- Understand simple science concepts (weather, plants)
- Build confidence in using technology independently

**Test Focus:**
- Can he navigate without parental help?
- Is the Hindi translation natural for a 6-year-old?
- Do visuals compensate for limited reading?
- Does he stay engaged beyond 15 minutes?

---

### Persona 2: Priya (Age 9-10, Tamil)
**Background:**
- Name: Priya Krishnan
- Age: 9 years, 10 months
- Location: Chennai, Tamil Nadu
- Language: Tamil (native), conversational English
- Education: Class 4 in private school
- Tech access: Own tablet (gift from uncle), 2-3 hours/day
- Reading level: Can read grade-level text fluently
- Attention span: 30-45 minutes focused on topics of interest

**Cognitive Characteristics:**
- Developing abstract thinking
- Enjoys experiments and hands-on activities
- Competitive (likes progress, badges, achievements)
- Social learner (likes to share discoveries)
- Questions "why" and "how"

**Learning Goals:**
- Understand basic physics (gravity, motion)
- Learn math concepts through visual problems
- Explore space and astronomy
- Build confidence in STEM subjects

**Test Focus:**
- Can she complete a full learning module independently?
- Is Tamil terminology accurate for academic concepts?
- Do labs/experiments work smoothly on her device?
- Does she feel motivated to return for more?

---

### Persona 3: Rahul (Age 15-16, Odia)
**Background:**
- Name: Rahul Kumar Sahoo
- Age: 15 years, 8 months
- Location: Rural village in Odisha
- Language: Odia (native), limited English
- Education: Class 10 in government school (first-generation learner)
- Tech access: School computer lab (1 hour/day), neighbor's phone occasionally
- Reading level: Can read complex text in Odia
- Attention span: 60+ minutes on relevant academic content

**Cognitive Characteristics:**
- Strong abstract thinking
- Exam-focused (preparing for board exams)
- Self-motivated but resource-constrained
- Values practical applications of theory
- Wants to bridge gaps in classroom learning

**Learning Goals:**
- Master Class 10 physics and chemistry concepts
- Understand mathematical formulas visually
- Prepare for competitive exams
- Access quality education despite rural location

**Test Focus:**
- Is content aligned with Class 10 curriculum?
- Does offline functionality work reliably?
- Can he download content for later study?
- Does the platform respect his maturity (not childish)?

---

### Persona 4: Sneha (Age 31-32, English)
**Background:**
- Name: Sneha Patel
- Age: 31 years, 6 months
- Location: Bengaluru, Karnataka
- Language: English (fluent), Hindi (conversational)
- Education: MBA, corporate professional
- Tech access: Personal laptop, high-speed internet
- Reading level: Advanced
- Attention span: 45-90 minutes on topics of interest

**Cognitive Characteristics:**
- Lifelong learner
- Curious about science but felt "bad at it" in school
- Wants to learn alongside her 8-year-old daughter
- Values depth and accuracy
- Appreciates Indian context and examples

**Learning Goals:**
- Understand concepts she memorized but never truly grasped
- Support her daughter's learning journey
- Reconnect with scientific curiosity
- Explore advanced topics at her own pace

**Test Focus:**
- Does the platform feel welcoming to adults (not childish)?
- Can she find content appropriate for her level?
- Is the Indian context meaningful and accurate?
- Would she recommend this to other adults?

---

## Test Scenarios

### Common Test Structure (2-3 hours per persona)

**Phase 1: Onboarding & Discovery (30 minutes)**
- Profile creation (name, avatar, language selection)
- Initial exploration of landing page
- First impressions of UI/UX
- Language switching experience

**Phase 2: Deep Dive - Learning Paths (60-90 minutes)**
- Select age-appropriate learning path
- Complete 1-2 full modules/concepts
- Test interactive elements (simulations, quizzes)
- Note comprehension and engagement levels

**Phase 3: Maker Space Exploration (30-60 minutes)**
- Try Cosmos Lab or other interactive features
- Test hands-on activities
- Assess creativity and experimentation tools
- Note technical performance

**Phase 4: Reflection & Retention (15-30 minutes)**
- Attempt to recall key concepts learned
- Test navigation back to previous content
- Note desire to continue or return
- Document overall satisfaction

---

## Success Metrics

### Attention Retention
- **Time on platform**: Target 2+ hours per session
- **Natural breaks**: Does user take breaks or exit due to frustration?
- **Return intent**: Would they come back tomorrow?

### Learning Effectiveness
- **Concept completion**: Can they finish a module end-to-end?
- **Comprehension**: Can they explain what they learned in their own words?
- **Application**: Can they apply knowledge in labs/quizzes?

### Accessibility & Inclusivity
- **Language comprehension**: Is translation natural and age-appropriate?
- **Navigation ease**: Can they find content without help?
- **Device performance**: Does it work on their tech constraints?

### Emotional Engagement
- **Joy factor**: Do they express curiosity or excitement?
- **Confidence building**: Do they feel capable and successful?
- **Identity alignment**: Does the platform feel built for them?

### Technical Performance
- **Load times**: Acceptable on 2G/limited bandwidth?
- **Offline functionality**: Works when internet cuts?
- **Error handling**: Graceful failures or confusing crashes?

---

## Testing Execution Plan

1. **Persona 1 (Aarav)**: Test with Hindi language, focus on Tiny World/Adventure Academy
2. **Persona 2 (Priya)**: Test with Tamil language, focus on Lab Zero + Cosmos Lab
3. **Persona 3 (Rahul)**: Test with Odia language, focus on advanced concepts + offline mode
4. **Persona 4 (Sneha)**: Test with English language, explore all sections + parent dashboard

Each session will be documented with:
- Timestamps and duration
- Screenshots of key interactions
- Notes on friction points
- Quotes from persona perspective
- Specific recommendations

---

## Expected Outcomes

This testing will validate:
1. Whether Jigyasu can genuinely hold attention for 2+ hours across age groups
2. Language localization quality for each target demographic
3. Technical robustness across different device contexts
4. Emotional resonance with each persona's motivations
5. Gaps between mission vision and actual user experience

Results will inform prioritization of UX improvements, content gaps, and technical optimizations.
