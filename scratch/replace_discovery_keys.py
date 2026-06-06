import json

with open('D:/vision_agentic/jigyasu/apps/hub/src/learnos/worlds/discovery/data/discoveryContent.ts', 'r', encoding='utf-8') as f:
    content = f.read()

with open('D:/vision_agentic/jigyasu/scratch/discovery.json', 'r', encoding='utf-8') as f:
    discovery_data = json.load(f)

for m_id, m_data in discovery_data['modules'].items():
    title_str = m_data['title']
    content = content.replace(f"title: '{title_str}'", f"title: 'discovery.modules.{m_id}.title'")
    
    hook_str = m_data['hook']
    content = content.replace(f"hook: '{hook_str}'", f"hook: 'discovery.modules.{m_id}.hook'")
    
    rwc_str = m_data.get('realWorldConnection', '').replace("'", "\\'")
    if rwc_str:
        content = content.replace(f"realWorldConnection: '{rwc_str}'", f"realWorldConnection: 'discovery.modules.{m_id}.realWorldConnection'")
    
    uq_str = m_data.get('unsolvedQuestion', '').replace("'", "\\'")
    if uq_str:
        content = content.replace(f"unsolvedQuestion: '{uq_str}'", f"unsolvedQuestion: 'discovery.modules.{m_id}.unsolvedQuestion'")

for q_id, q_data in discovery_data['unsolvedQuestions'].items():
    q_str = q_data.get('question', '').replace("'", "\\'")
    if q_str:
        content = content.replace(f"question: '{q_str}'", f"question: 'discovery.unsolvedQuestions.{q_id}.question'")
    
    c_str = q_data.get('context', '').replace("'", "\\'")
    if c_str:
        content = content.replace(f"context: '{c_str}'", f"context: 'discovery.unsolvedQuestions.{q_id}.context'")
    
    fn_str = q_data.get('fieldName', '').replace("'", "\\'")
    if fn_str:
        content = content.replace(f"fieldName: '{fn_str}'", f"fieldName: 'discovery.unsolvedQuestions.{q_id}.fieldName'")

for m_id, connections in discovery_data['goDeeper'].items():
    for i, c in enumerate(connections):
        title_str = c.get('title', '')
        if title_str:
            content = content.replace(f"title: '{title_str}'", f"title: 'discovery.goDeeper.{m_id}.{i}.title'")
        
        desc_str = c.get('description', '').replace("'", "\\'")
        if desc_str:
            content = content.replace(f"description: '{desc_str}'", f"description: 'discovery.goDeeper.{m_id}.{i}.description'")

for cb_id, cb_data in discovery_data['crossBridges'].items():
    title_str = cb_data.get('title', '')
    if title_str:
        content = content.replace(f"title: '{title_str}'", f"title: 'discovery.crossBridges.{cb_id}.title'")
    
    desc_str = cb_data.get('description', '').replace("'", "\\'")
    if desc_str:
        content = content.replace(f"description: '{desc_str}'", f"description: 'discovery.crossBridges.{cb_id}.description'")
    
    # We didn't extract unlocksWhen, but we can if needed. Let's just do title and description.

for cr_id, cr_data in discovery_data['chemicalReactions'].items():
    name_str = cr_data.get('name', '')
    if name_str:
        content = content.replace(f"name: '{name_str}'", f"name: 'discovery.chemicalReactions.{cr_id}.name'")
    
    ec_str = cr_data.get('everydayContext', '').replace("'", "\\'")
    if ec_str:
        content = content.replace(f"everydayContext: '{ec_str}'", f"everydayContext: 'discovery.chemicalReactions.{cr_id}.everydayContext'")

for gt_id, gt_data in discovery_data['geometryTheorems'].items():
    name_str = gt_data.get('name', '')
    if name_str:
        content = content.replace(f"name: '{name_str}'", f"name: 'discovery.geometryTheorems.{gt_id}.name'")
    
    app_str = gt_data.get('application', '').replace("'", "\\'")
    if app_str:
        content = content.replace(f"application: '{app_str}'", f"application: 'discovery.geometryTheorems.{gt_id}.application'")

for gt_id, gt_data in discovery_data['geneticTraits'].items():
    name_str = gt_data.get('name', '')
    if name_str:
        content = content.replace(f"name: '{name_str}'", f"name: 'discovery.geneticTraits.{gt_id}.name'")
    
    dp_str = gt_data.get('dominantPhenotype', '')
    if dp_str:
        content = content.replace(f"dominantPhenotype: '{dp_str}'", f"dominantPhenotype: 'discovery.geneticTraits.{gt_id}.dominantPhenotype'")
    
    rp_str = gt_data.get('recessivePhenotype', '')
    if rp_str:
        content = content.replace(f"recessivePhenotype: '{rp_str}'", f"recessivePhenotype: 'discovery.geneticTraits.{gt_id}.recessivePhenotype'")
    
    ec_str = gt_data.get('exampleContext', '').replace("'", "\\'")
    if ec_str:
        content = content.replace(f"exampleContext: '{ec_str}'", f"exampleContext: 'discovery.geneticTraits.{gt_id}.exampleContext'")

for ac_id, ac_data in discovery_data['algebraChallenges'].items():
    hint_str = ac_data.get('hint', '').replace("'", "\\'")
    if hint_str:
        content = content.replace(f"hint: '{hint_str}'", f"hint: 'discovery.algebraChallenges.{ac_id}.hint'")

with open('D:/vision_agentic/jigyasu/apps/hub/src/learnos/worlds/discovery/data/discoveryContent.ts', 'w', encoding='utf-8') as f:
    f.write(content)
