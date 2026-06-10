import os
import re

directory = r'd:\vision_agentic\jigyasu\apps\hub\src'
pattern = re.compile(r'<Trans i18nKey=".*?eslint_disable_next_line.*?">(.*?)</Trans>')

count = 0
for root, _, files in os.walk(directory):
    for file in files:
        if file.endswith('.tsx') or file.endswith('.ts'):
            filepath = os.path.join(root, file)
            with open(filepath, 'r', encoding='utf-8') as f:
                content = f.read()
            
            if pattern.search(content):
                # Replace with JSX comment
                new_content = pattern.sub(r'{/* \1 */}', content)
                with open(filepath, 'w', encoding='utf-8') as f:
                    f.write(new_content)
                count += 1
                print(f'Fixed {filepath}')

print(f'Total files fixed: {count}')
