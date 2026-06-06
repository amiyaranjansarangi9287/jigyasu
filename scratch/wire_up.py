import os
import glob
import re

# Get all WonderFirst modules
path = 'D:/vision_agentic/jigyasu/apps/hub/src/learnos/worlds/lab/modules/*WonderFirst.tsx'
files = glob.glob(path)
module_names = [os.path.basename(f).replace('.tsx', '') for f in files]

imports = []
for m in module_names:
    imports.append(f"const {m} = lazy(() => import('./modules/{m}'));")

def get_path(m):
    base = m.replace('WonderFirst', '')
    kebab = re.sub(r'(?<!^)(?=[A-Z])', '-', base).lower()
    return f"{kebab}-wonder"

routes = []
for m in module_names:
    routes.append(f"        <Route path=\"{get_path(m)}\" element={{<{m} />}} />")

index_file = 'D:/vision_agentic/jigyasu/apps/hub/src/learnos/worlds/lab/index.tsx'
with open(index_file, 'r', encoding='utf-8') as f:
    content = f.read()

parts = content.split('export default function LabWorld()')
imports_str = '\n'.join(imports) + '\n\n'
content = parts[0] + imports_str + 'export default function LabWorld()' + parts[1]

parts = content.split('      </Routes>')
routes_str = '\n'.join(routes) + '\n'
content = parts[0] + routes_str + '      </Routes>' + parts[1]

with open(index_file, 'w', encoding='utf-8') as f:
    f.write(content)
