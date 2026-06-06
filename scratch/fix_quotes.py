import os

FILE_PATH = "apps/hub/src/learnos/core/modules/WonderFirstTemplate.tsx"
with open(FILE_PATH, 'r', encoding='utf-8') as f:
    content = f.read()

# Remove literal backslash-escaped single quotes
content = content.replace("\\'", "'")

with open(FILE_PATH, 'w', encoding='utf-8') as f:
    f.write(content)

print("Fixed quotes")
