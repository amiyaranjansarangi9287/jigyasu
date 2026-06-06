import os

file_path = 'D:/vision_agentic/jigyasu/apps/hub/src/components/AboutPage.tsx'
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

replacements = {
    'What We Believe': "{t('about.headings.what_we_believe', 'What We Believe')}",
    'What We Built — and Why': "{t('about.headings.what_we_built', 'What We Built — and Why')}",
    'Built for India': "{t('about.headings.built_for_india', 'Built for India')}",
    'This is not a global platform lightly translated for India.\\n            It is built from India, for Indian learners — and open to everyone.': "{t('about.text.built_for_india_desc', 'This is not a global platform lightly translated for India. It is built from India, for Indian learners — and open to everyone.')}",
    "'Rupees, not dollars'": "t('about.indian_context.0', 'Rupees, not dollars')",
    "'Rotis and chai, not only pizzas'": "t('about.indian_context.1', 'Rotis and chai, not only pizzas')",
    "'Monsoons, ISRO, cricket, Indian markets'": "t('about.indian_context.2', 'Monsoons, ISRO, cricket, Indian markets')",
    "'Aryabhata, Ramanujan, C.V. Raman, J.C. Bose'": "t('about.indian_context.3', 'Aryabhata, Ramanujan, C.V. Raman, J.C. Bose')",
    "'APJ Abdul Kalam, Sushruta, Brahmagupta'": "t('about.indian_context.4', 'APJ Abdul Kalam, Sushruta, Brahmagupta')",
    "'22 Indian languages from day one'": "t('about.indian_context.5', '22 Indian languages from day one')",
    "'Designed for 2G and shared phones'": "t('about.indian_context.6', 'Designed for 2G and shared phones')",
    'The Team': "{t('about.headings.the_team', 'The Team')}",
    'Built by volunteers. Open to the world.': "{t('about.text.team_desc', 'Built by volunteers. Open to the world.')}",
    'Contact Us': "{t('about.headings.contact_us', 'Contact Us')}",
    'When you write to us, we would love to know:': "{t('about.text.contact_desc', 'When you write to us, we would love to know:')}",
    'Email Us': "{t('about.buttons.email_us', 'Email Us')}",
    'Open Source': "{t('about.buttons.open_source', 'Open Source')}",
    'Documentation': "{t('about.buttons.documentation', 'Documentation')}",
    'Design System': "{t('about.buttons.design_system', 'Design System')}"
}

for old, new in replacements.items():
    if old in content:
        content = content.replace(old, new)
        print(f"Replaced: {old[:20]}...")

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)
