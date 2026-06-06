import os
import re

concepts_dir = 'D:/vision_agentic/jigyasu/apps/hub/src/learnos/worlds/explorer/concepts'

for filename in os.listdir(concepts_dir):
    if not filename.endswith('.tsx'):
        continue
        
    filepath = os.path.join(concepts_dir, filename)
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
        
    # Check if already processed
    if "useTranslation" in content:
        continue
        
    # Add import
    content = re.sub(r"(import .*? 'react';\n)", r"\1import { useTranslation } from 'react-i18next';\n", content)
    
    # Add hook inside function
    # Match export default function Something() {
    content = re.sub(r"(export default function \w+\(\) {\n)", r"\1  const { t } = useTranslation();\n", content)
    
    # Replace usages
    content = content.replace("lumo.poseQuestion(concept.thinkingPrompt)", "lumo.poseQuestion(t(concept.thinkingPrompt as any, concept.thinkingPrompt))")
    content = content.replace("{concept.title}", "{t(concept.title as any, concept.title)}")
    content = content.replace("{concept.hook}", "{t(concept.hook as any, concept.hook)}")
    content = content.replace("connection={concept.everydayConnection}", "connection={t(concept.everydayConnection as any, concept.everydayConnection)}")
    content = content.replace("indianContext={concept.indianContext}", "indianContext={t(concept.indianContext as any, concept.indianContext)}")
    content = content.replace("question={concept.thinkingPrompt}", "question={t(concept.thinkingPrompt as any, concept.thinkingPrompt)}")
    
    # Also LumOpener just in case
    content = content.replace("lumo.shareInsight(concept.lumoOpener)", "lumo.shareInsight(t(concept.lumoOpener as any, concept.lumoOpener))")
    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
        
print("Injected useTranslation into concept components.")
