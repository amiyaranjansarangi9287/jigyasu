import os
import re

# Lab components
lab_home = 'D:/vision_agentic/jigyasu/apps/hub/src/learnos/worlds/lab/LabHome.tsx'
with open(lab_home, 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace("t(`lab.modules.${m.id}.title`, m.title)", "t(m.title as any)")
content = content.replace("t(`lab.modules.${m.id}.desc`, m.realWorldConnection)", "t(m.realWorldConnection as any)")

with open(lab_home, 'w', encoding='utf-8') as f:
    f.write(content)


# Early components
early_modules_dir = 'D:/vision_agentic/jigyasu/apps/hub/src/learnos/worlds/early/modules'
for filename in os.listdir(early_modules_dir):
    if not filename.endswith('.tsx'):
        continue
    filepath = os.path.join(early_modules_dir, filename)
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
        
    if "useTranslation" not in content:
        content = re.sub(r"(import .*? 'react';\n)", r"\1import { useTranslation } from 'react-i18next';\n", content)
        content = re.sub(r"(export default function \w+\(\) {\n)", r"\1  const { t } = useTranslation();\n", content)

    # For StoryBuilder
    content = content.replace("{item.name}", "{t(item.name as any, item.name)}")
    content = content.replace("selectedChar.name", "t(selectedChar.name as any, selectedChar.name)")
    content = content.replace("selectedPlace.name", "t(selectedPlace.name as any, selectedPlace.name)")
    content = content.replace("selectedProblem.name", "t(selectedProblem.name as any, selectedProblem.name)")
    
    # For others
    content = content.replace("{recipe.name}", "{t(recipe.name as any)}")
    content = content.replace("{ing.name}", "{t(ing.name as any)}")
    content = content.replace("{ing.unit}", "{t(ing.unit as any)}")
    content = content.replace("{letter.phonemeSound}", "{t(letter.phonemeSound as any)}")
    content = content.replace("{item.word}", "{t(item.word as any)}")
    content = content.replace("{w}", "{w.startsWith('early.') ? t(w as any) : w}")

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

# EarlyHome.tsx
early_home = 'D:/vision_agentic/jigyasu/apps/hub/src/learnos/worlds/early/EarlyHome.tsx'
with open(early_home, 'r', encoding='utf-8') as f:
    content = f.read()

# Already fine, but just to be sure
# module.titleKey is fine

print("Fixed TSX usages")
