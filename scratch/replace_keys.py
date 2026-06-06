import json

with open('D:/vision_agentic/jigyasu/apps/hub/src/learnos/worlds/academy/data/academyContent.ts', 'r', encoding='utf-8') as f:
    content = f.read()

with open('D:/vision_agentic/jigyasu/scratch/academy.json', 'r', encoding='utf-8') as f:
    academy_data = json.load(f)

# Replace ACADEMY_MODULES text
for m_id, m_data in academy_data['modules'].items():
    title_str = m_data['title']
    content = content.replace(f"title: '{title_str}'", f"title: 'academy.modules.{m_id}.title'")
    
    hook_str = m_data['hook']
    content = content.replace(f"hook: '{hook_str}'", f"hook: 'academy.modules.{m_id}.hook'")
    
    beauty_str = m_data['beauty'].replace("'", "\\'")
    content = content.replace(f"beauty: '{beauty_str}'", f"beauty: 'academy.modules.{m_id}.beauty'")
    
    rf_str = m_data['realFuture']
    content = content.replace(f"realFuture: '{rf_str}'", f"realFuture: 'academy.modules.{m_id}.realFuture'")
    
    er_str = m_data['examRelevance']
    content = content.replace(f"examRelevance: '{er_str}'", f"examRelevance: 'academy.modules.{m_id}.examRelevance'")

# For BEAUTY_MOMENTS
for m_id, text in academy_data['beautyMoments'].items():
    text_str = text.replace("'", "\\'")
    content = content.replace(f"'{m_id}': '{text_str}'", f"'{m_id}': 'academy.beautyMoments.{m_id}'")

# ELECTROLYSIS_SETUPS
for s_id, s_data in academy_data['electrolysisSetups'].items():
    name_str = s_data['name']
    content = content.replace(f"name: '{name_str}'", f"name: 'academy.electrolysisSetups.{s_id}.name'")
    
    elec_str = s_data['electrolyte']
    content = content.replace(f"electrolyte: '{elec_str}'", f"electrolyte: 'academy.electrolysisSetups.{s_id}.electrolyte'")
    
    cath_str = s_data['cathodeProduct']
    content = content.replace(f"cathodeProduct: '{cath_str}'", f"cathodeProduct: 'academy.electrolysisSetups.{s_id}.cathodeProduct'")
    
    anod_str = s_data['anodeProduct']
    content = content.replace(f"anodeProduct: '{anod_str}'", f"anodeProduct: 'academy.electrolysisSetups.{s_id}.anodeProduct'")
    
    ind_str = s_data['industrialUse']
    content = content.replace(f"industrialUse: '{ind_str}'", f"industrialUse: 'academy.electrolysisSetups.{s_id}.industrialUse'")
    
    indc_str = s_data['indianContext']
    content = content.replace(f"indianContext: '{indc_str}'", f"indianContext: 'academy.electrolysisSetups.{s_id}.indianContext'")

# ENVIRONMENTS
for e_id, e_data in academy_data['environments'].items():
    content = content.replace(f"name: '{e_data['name']}'", f"name: 'academy.environments.{e_id}.name'")
    content = content.replace(f"indian: '{e_data['indian']}'", f"indian: 'academy.environments.{e_id}.indian'")

# ESSAY_PROMPTS
for p_id, p_data in academy_data['essayPrompts'].items():
    content = content.replace(f"title: '{p_data['title']}'", f"title: 'academy.essayPrompts.{p_id}.title'")
    content = content.replace(f"prompt: '{p_data['prompt']}'", f"prompt: 'academy.essayPrompts.{p_id}.prompt'")
    content = content.replace(f"examinerTip: '{p_data['examinerTip']}'", f"examinerTip: 'academy.essayPrompts.{p_id}.examinerTip'")

# INDICATORS
for i_id, i_data in academy_data['indicators'].items():
    content = content.replace(f"name: '{i_data['name']}'", f"name: 'academy.indicators.{i_id}.name'")

# POLICY_DECISIONS
for p_id, p_data in academy_data['policyDecisions'].items():
    content = content.replace(f"name: '{p_data['name']}'", f"name: 'academy.policyDecisions.{p_id}.name'")
    content = content.replace(f"note: '{p_data['note']}'", f"note: 'academy.policyDecisions.{p_id}.note'")

# TRIG_IDENTITIES
for t_id, t_data in academy_data['trigIdentities'].items():
    content = content.replace(f"name: '{t_data['name']}'", f"name: 'academy.trigIdentities.{t_id}.name'")

# FEEDBACK_LOOPS
for f_id, f_data in academy_data['feedbackLoops'].items():
    content = content.replace(f"name: '{f_data['name']}'", f"name: 'academy.feedbackLoops.{f_id}.name'")
    content = content.replace(f"india: '{f_data['india']}'", f"india: 'academy.feedbackLoops.{f_id}.india'")

with open('D:/vision_agentic/jigyasu/apps/hub/src/learnos/worlds/academy/data/academyContent.ts', 'w', encoding='utf-8') as f:
    f.write(content)
