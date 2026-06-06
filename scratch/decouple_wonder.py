import os
import glob
import re
import json

# Get all WonderFirst modules
path = 'D:/vision_agentic/jigyasu/apps/hub/src/learnos/worlds/lab/modules/*WonderFirst.tsx'
files = glob.glob(path)

en_json_path = 'D:/vision_agentic/jigyasu/apps/hub/src/learnos/i18n/locales/en.json'
with open(en_json_path, 'r', encoding='utf-8') as f:
    en_data = json.load(f)

if 'wonderFirst' not in en_data:
    en_data['wonderFirst'] = {}

def extract_string(text, key):
    # Try to find: key: "value", or key: 'value', or key: `value`
    # Also support multiline
    match = re.search(rf'{key}:\s*([`\'"])(.*?)\1', text, re.DOTALL)
    if match:
        return match.group(2)
    return ""

def extract_array(text, key):
    # Try to find: key: ["value1", "value2"]
    match = re.search(rf'{key}:\s*\[(.*?)\]', text, re.DOTALL)
    if match:
        array_text = match.group(1)
        items = re.findall(r'([`\'"])(.*?)\1', array_text, re.DOTALL)
        return [item[1] for item in items]
    return []

for file_path in files:
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    module_name = os.path.basename(file_path).replace('.tsx', '')
    
    # Extract the block
    block_match = re.search(r'(const \w+WonderModule: WonderFirstModule = \{.*?\n  \};\n)', content, re.DOTALL)
    if not block_match:
        print(f"Skipping {module_name}, no block found.")
        continue
        
    block = block_match.group(1)
    
    # Extract data
    mystery = {
        "question": extract_string(block, 'question'),
        "visual": extract_string(block, 'visual'),
        "hook": extract_string(block, 'hook')
    }
    exploration = {
        "instructions": extract_string(block, 'instructions'),
        "hints": extract_array(block, 'hints')
    }
    insight = {
        "revelation": extract_string(block, 'revelation'),
        "connection": extract_string(block, 'connection'),
        "ahaMoment": extract_string(block, 'ahaMoment')
    }
    application = {
        "realWorld": extract_string(block, 'realWorld'),
        "indianContext": extract_string(block, 'indianContext'),
        "tryIt": extract_string(block, 'tryIt')
    }
    
    # Save to JSON
    en_data['wonderFirst'][module_name] = {
        "mystery": mystery,
        "exploration": exploration,
        "insight": insight,
        "application": application
    }
    
    # Create the replacement block
    # We replace the hardcoded strings with t('wonderFirst.ModuleName.key')
    new_block = block
    new_block = re.sub(rf'question:\s*[`\'"].*?[`\'"],?', f"question: t('wonderFirst.{module_name}.mystery.question'),", new_block, flags=re.DOTALL)
    new_block = re.sub(rf'visual:\s*[`\'"].*?[`\'"],?', f"visual: t('wonderFirst.{module_name}.mystery.visual'),", new_block, flags=re.DOTALL)
    new_block = re.sub(rf'hook:\s*[`\'"].*?[`\'"],?', f"hook: t('wonderFirst.{module_name}.mystery.hook'),", new_block, flags=re.DOTALL)
    
    new_block = re.sub(rf'instructions:\s*[`\'"].*?[`\'"],?', f"instructions: t('wonderFirst.{module_name}.exploration.instructions'),", new_block, flags=re.DOTALL)
    new_block = re.sub(rf'hints:\s*\[.*?\],?', f"hints: t('wonderFirst.{module_name}.exploration.hints', {{ returnObjects: true }}) as string[],", new_block, flags=re.DOTALL)
    
    new_block = re.sub(rf'revelation:\s*[`\'"].*?[`\'"],?', f"revelation: t('wonderFirst.{module_name}.insight.revelation'),", new_block, flags=re.DOTALL)
    new_block = re.sub(rf'connection:\s*[`\'"].*?[`\'"],?', f"connection: t('wonderFirst.{module_name}.insight.connection'),", new_block, flags=re.DOTALL)
    new_block = re.sub(rf'ahaMoment:\s*[`\'"].*?[`\'"],?', f"ahaMoment: t('wonderFirst.{module_name}.insight.ahaMoment'),", new_block, flags=re.DOTALL)
    
    new_block = re.sub(rf'realWorld:\s*[`\'"].*?[`\'"],?', f"realWorld: t('wonderFirst.{module_name}.application.realWorld'),", new_block, flags=re.DOTALL)
    new_block = re.sub(rf'indianContext:\s*[`\'"].*?[`\'"],?', f"indianContext: t('wonderFirst.{module_name}.application.indianContext'),", new_block, flags=re.DOTALL)
    new_block = re.sub(rf'tryIt:\s*[`\'"].*?[`\'"],?', f"tryIt: t('wonderFirst.{module_name}.application.tryIt'),", new_block, flags=re.DOTALL)
    
    content = content.replace(block, new_block)
    
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)

with open(en_json_path, 'w', encoding='utf-8') as f:
    json.dump(en_data, f, indent=2, ensure_ascii=False)
