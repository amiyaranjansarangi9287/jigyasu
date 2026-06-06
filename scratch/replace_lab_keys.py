import json

with open('D:/vision_agentic/jigyasu/apps/hub/src/learnos/worlds/lab/data/labContent.ts', 'r', encoding='utf-8') as f:
    content = f.read()

with open('D:/vision_agentic/jigyasu/scratch/lab.json', 'r', encoding='utf-8') as f:
    lab_data = json.load(f)

for m_id, m_data in lab_data['modules'].items():
    title_str = m_data['title'].replace("'", "\\'")
    if f"title: '{title_str}'" in content:
        content = content.replace(f"title: '{title_str}'", f"title: 'lab.modules.{m_id}.title'")
    elif f'title: "{title_str.replace("\\\'", "\'")}"' in content:
        content = content.replace(f'title: "{title_str.replace("\\\'", "\'")}"', f"title: 'lab.modules.{m_id}.title'")
        
    rwc_str = m_data['realWorldConnection'].replace("'", "\\'")
    if f"realWorldConnection: '{rwc_str}'" in content:
        content = content.replace(f"realWorldConnection: '{rwc_str}'", f"realWorldConnection: 'lab.modules.{m_id}.realWorldConnection'")
    elif f'realWorldConnection: "{rwc_str.replace("\\\'", "\'")}"' in content:
        content = content.replace(f'realWorldConnection: "{rwc_str.replace("\\\'", "\'")}"', f"realWorldConnection: 'lab.modules.{m_id}.realWorldConnection'")

    if 'toyboxProject' in m_data:
        tb_str = m_data['toyboxProject'].replace("'", "\\'")
        if f"toyboxProject: '{tb_str}'" in content:
            content = content.replace(f"toyboxProject: '{tb_str}'", f"toyboxProject: 'lab.modules.{m_id}.toyboxProject'")
        elif f'toyboxProject: "{tb_str.replace("\\\'", "\'")}"' in content:
            content = content.replace(f'toyboxProject: "{tb_str.replace("\\\'", "\'")}"', f"toyboxProject: 'lab.modules.{m_id}.toyboxProject'")

with open('D:/vision_agentic/jigyasu/apps/hub/src/learnos/worlds/lab/data/labContent.ts', 'w', encoding='utf-8') as f:
    f.write(content)
