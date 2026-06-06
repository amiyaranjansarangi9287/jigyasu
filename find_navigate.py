import os
import re

apps_dir = 'D:/vision_agentic/jigyasu/apps'
links = set()

for root, _, files in os.walk(apps_dir):
    for file in files:
        if file.endswith('.tsx') or file.endswith('.ts'):
            path = os.path.join(root, file)
            with open(path, 'r', encoding='utf-8') as f:
                content = f.read()
                matches = re.findall(r"navigate\(['\"](/.*?)['\"]\)", content)
                for m in matches:
                    links.add(m)

print('Found navigate links:')
for link in sorted(list(links)):
    print(link)
