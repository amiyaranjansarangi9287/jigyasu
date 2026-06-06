import json

with open('D:/vision_agentic/jigyasu/apps/hub/src/learnos/worlds/explorer/data/explorerContent.ts', 'r', encoding='utf-8') as f:
    content = f.read()

with open('D:/vision_agentic/jigyasu/scratch/explorer.json', 'r', encoding='utf-8') as f:
    explorer_data = json.load(f)

for c_id, c_data in explorer_data['concepts'].items():
    title_str = c_data['title']
    content = content.replace(f"title: '{title_str}'", f"title: 'explorer.concepts.{c_id}.title'")
    
    hook_str = c_data.get('hook', '').replace("'", "\\'")
    if hook_str:
        content = content.replace(f"hook: '{hook_str}'", f"hook: 'explorer.concepts.{c_id}.hook'")
    
    ec_str = c_data.get('everydayConnection', '').replace("'", "\\'")
    if ec_str:
        # Check if the original used double quotes
        if f'everydayConnection: "{ec_str.replace("\\\'", "\'")}"' in content:
            content = content.replace(f'everydayConnection: "{ec_str.replace("\\\'", "\'")}"', f"everydayConnection: 'explorer.concepts.{c_id}.everydayConnection'")
        else:
            content = content.replace(f"everydayConnection: '{ec_str}'", f"everydayConnection: 'explorer.concepts.{c_id}.everydayConnection'")
    
    lo_str = c_data.get('lumoOpener', '').replace("'", "\\'")
    if lo_str:
        if f'lumoOpener: "{lo_str.replace("\\\'", "\'")}"' in content:
            content = content.replace(f'lumoOpener: "{lo_str.replace("\\\'", "\'")}"', f"lumoOpener: 'explorer.concepts.{c_id}.lumoOpener'")
        else:
            content = content.replace(f"lumoOpener: '{lo_str}'", f"lumoOpener: 'explorer.concepts.{c_id}.lumoOpener'")
            
    tp_str = c_data.get('thinkingPrompt', '').replace("'", "\\'")
    if tp_str:
        if f'thinkingPrompt: "{tp_str.replace("\\\'", "\'")}"' in content:
            content = content.replace(f'thinkingPrompt: "{tp_str.replace("\\\'", "\'")}"', f"thinkingPrompt: 'explorer.concepts.{c_id}.thinkingPrompt'")
        else:
            content = content.replace(f"thinkingPrompt: '{tp_str}'", f"thinkingPrompt: 'explorer.concepts.{c_id}.thinkingPrompt'")
            
    ic_str = c_data.get('indianContext', '').replace("'", "\\'")
    if ic_str:
        if f'indianContext: "{ic_str.replace("\\\'", "\'")}"' in content:
            content = content.replace(f'indianContext: "{ic_str.replace("\\\'", "\'")}"', f"indianContext: 'explorer.concepts.{c_id}.indianContext'")
        else:
            content = content.replace(f"indianContext: '{ic_str}'", f"indianContext: 'explorer.concepts.{c_id}.indianContext'")

with open('D:/vision_agentic/jigyasu/apps/hub/src/learnos/worlds/explorer/data/explorerContent.ts', 'w', encoding='utf-8') as f:
    f.write(content)
