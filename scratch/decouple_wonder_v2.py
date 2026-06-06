import os
import glob
import re

path = 'D:/vision_agentic/jigyasu/apps/hub/src/learnos/worlds/lab/modules/*WonderFirst.tsx'
files = glob.glob(path)

for file_path in files:
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    module_name = os.path.basename(file_path).replace('.tsx', '')
    
    # We want to replace the mystery, exploration, insight, application blocks.
    # We can do this by finding 'const (\w+): WonderFirstModule = \{'
    # and then carefully replacing the block.
    
    def repl(match):
        var_name = match.group(1)
        # Find id
        id_match = re.search(r"id:\s*['\"](.*?)['\"]", match.group(0))
        mod_id = id_match.group(1) if id_match else 'unknown'
        
        # We assume `component: ExplorationComponent` is always there
        return f"""  const {var_name}: WonderFirstModule = {{
    id: '{mod_id}',
    mystery: {{
      question: t('wonderFirst.{module_name}.mystery.question'),
      visual: t('wonderFirst.{module_name}.mystery.visual'),
      hook: t('wonderFirst.{module_name}.mystery.hook'),
    }},
    exploration: {{
      instructions: t('wonderFirst.{module_name}.exploration.instructions'),
      hints: t('wonderFirst.{module_name}.exploration.hints', {{ returnObjects: true }}) as string[],
      component: ExplorationComponent,
    }},
    insight: {{
      revelation: t('wonderFirst.{module_name}.insight.revelation'),
      connection: t('wonderFirst.{module_name}.insight.connection'),
      ahaMoment: t('wonderFirst.{module_name}.insight.ahaMoment'),
    }},
    application: {{
      realWorld: t('wonderFirst.{module_name}.application.realWorld'),
      indianContext: t('wonderFirst.{module_name}.application.indianContext'),
      tryIt: t('wonderFirst.{module_name}.application.tryIt'),
    }},
  }};"""

    # We match from `const X: WonderFirstModule = {` up to `  };` right before `return`
    new_content = re.sub(r'  const (\w+): WonderFirstModule = \{.*?\n  \};', repl, content, flags=re.DOTALL)
    
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(new_content)
