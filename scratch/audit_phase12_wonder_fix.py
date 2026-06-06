import os
import re

FILE_PATH = "apps/hub/src/learnos/core/modules/WonderFirstTemplate.tsx"

def main():
    with open(FILE_PATH, 'r', encoding='utf-8') as f:
        content = f.read()

    # Inject useTranslation
    if "import { useTranslation }" not in content:
        content = re.sub(
            r"(import \{ useState, useEffect \} from 'react';)",
            r"\1\nimport { useTranslation } from 'react-i18next';",
            content
        )

    # Inject const { t } = useTranslation();
    if "const { t } = useTranslation();" not in content:
        content = re.sub(
            r"(export default function WonderFirstTemplate.*\{\n)",
            r"\1  const { t } = useTranslation();\n",
            content
        )

    # We need to correctly handle double quotes by NOT escaping them in the replacement string
    # when substituting entire tags, or we can just replace the inner text carefully.
    
    replacements = [
        (r"'Mystery phase: Starting with a question'", r"t('core.wonder_template.announcements.mystery', 'Mystery phase: Starting with a question')"),
        (r"'Exploration phase: Time to investigate and discover'", r"t('core.wonder_template.announcements.exploration', 'Exploration phase: Time to investigate and discover')"),
        (r"'Insight phase: The moment of understanding'", r"t('core.wonder_template.announcements.insight', 'Insight phase: The moment of understanding')"),
        (r"'Application phase: Connecting to real life'", r"t('core.wonder_template.announcements.application', 'Application phase: Connecting to real life')"),
        
        (r'<span className="sr-only">Keyboard shortcuts:</span>', r'<span className="sr-only">{t(\'core.wonder_template.shortcuts.label\', \'Keyboard shortcuts:\')}</span>'),
        (r'<span aria-hidden="true">N: Next \| H: Hint \| S: Skip \| ESC: Exit</span>', r'<span aria-hidden="true">{t(\'core.wonder_template.shortcuts.keys\', \'N: Next | H: Hint | S: Skip | ESC: Exit\')}</span>'),
        
        (r"What do you think\?", r"{t('core.wonder_template.mystery.what_do_you_think', 'What do you think?')}"),
        (r"Take a moment to wonder\. Don't worry about the right answer\.\s*Just let your curiosity guide you\.", r"{t('core.wonder_template.mystery.take_a_moment', 'Take a moment to wonder. Don\\'t worry about the right answer. Just let your curiosity guide you.')}"),
        
        (r'aria-label="Start exploring the mystery"', r'aria-label={t(\'core.wonder_template.mystery.btn_aria\', \'Start exploring the mystery\')}'),
        (r"<span>Let's Explore Together</span>", r"<span>{t('core.wonder_template.mystery.btn_explore', 'Let\'s Explore Together')}</span>"),
        
        (r'<h2 className="text-2xl font-bold text-indigo-900">Exploration Time</h2>', r'<h2 className="text-2xl font-bold text-indigo-900">{t(\'core.wonder_template.exploration.title\', \'Exploration Time\')}</h2>'),
        (r"Time exploring:", r"{t('core.wonder_template.exploration.time', 'Time exploring:')}"),
        
        (r"Need a hint\?", r"{t('core.wonder_template.exploration.need_hint', 'Need a hint?')}"),
        (r"Hints are here to guide you, not judge you\. Take your time\.", r"{t('core.wonder_template.exploration.hints_guide', 'Hints are here to guide you, not judge you. Take your time.')}"),
        (r"Hint \{index \+ 1\}:", r"{t('core.wonder_template.exploration.hint_prefix', 'Hint')} {index + 1}:"),
        
        (r'aria-label="Show insight and explanation"', r'aria-label={t(\'core.wonder_template.exploration.btn_aria\', \'Show insight and explanation\')}'),
        (r"<span>I Think I Understand</span>", r"<span>{t('core.wonder_template.exploration.btn_insight', 'I Think I Understand')}</span>"),
        
        (r'<h2 className="text-3xl md:text-4xl font-bold mb-4">The Insight</h2>', r'<h2 className="text-3xl md:text-4xl font-bold mb-4">{t(\'core.wonder_template.insight.title\', \'The Insight\')}</h2>'),
        (r"Here's what's happening:", r"{t('core.wonder_template.insight.happening', 'Here\'s what\'s happening:')}"),
        (r"Connection to the mystery:", r"{t('core.wonder_template.insight.connection', 'Connection to the mystery:')}"),
        
        (r'aria-label="See how this concept applies in real life"', r'aria-label={t(\'core.wonder_template.insight.btn_aria\', \'See how this concept applies in real life\')}'),
        (r"<span>See How This Applies</span>", r"<span>{t('core.wonder_template.insight.btn_apply', 'See How This Applies')}</span>"),
        
        (r'<h2 className="text-3xl md:text-4xl font-bold text-green-900 mb-4">In Real Life</h2>', r'<h2 className="text-3xl md:text-4xl font-bold text-green-900 mb-4">{t(\'core.wonder_template.application.title\', \'In Real Life\')}</h2>'),
        (r'<p className="text-xl text-green-700">Understanding connects to the world around you</p>', r'<p className="text-xl text-green-700">{t(\'core.wonder_template.application.subtitle\', \'Understanding connects to the world around you\')}</p>'),
        (r"Real World:", r"{t('core.wonder_template.application.real_world', 'Real World:')}"),
        (r"Indian Context:", r"{t('core.wonder_template.application.indian_context', 'Indian Context:')}"),
        (r"Try It:", r"{t('core.wonder_template.application.try_it', 'Try It:')}"),
        
        (r'aria-label="Complete module and return to home"', r'aria-label={t(\'core.wonder_template.application.btn_aria\', \'Complete module and return to home\')}'),
        (r"<span>I Understand!</span>", r"<span>{t('core.wonder_template.application.btn_complete', 'I Understand!')}</span>")
    ]

    for pattern, repl in replacements:
        content = re.sub(pattern, repl, content)

    with open(FILE_PATH, 'w', encoding='utf-8') as f:
        f.write(content)
    print("Updated WonderFirstTemplate.tsx correctly.")

if __name__ == "__main__":
    main()
