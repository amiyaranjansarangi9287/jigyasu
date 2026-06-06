import os

apps = ['physics', 'chem', 'bio', 'math', 'cosmos', 'toys', 'camp']
base_dir = 'D:/vision_agentic/jigyasu/apps'

for app in apps:
    # Update vite.config.ts
    vite_path = os.path.join(base_dir, app, 'vite.config.ts')
    if os.path.exists(vite_path):
        with open(vite_path, 'r', encoding='utf-8') as f:
            content = f.read()
        if 'base:' not in content:
            content = content.replace('export default defineConfig({', f"export default defineConfig({{\n  base: '/{app}/',")
            with open(vite_path, 'w', encoding='utf-8') as f:
                f.write(content)
            print(f'Updated {vite_path}')
            
    # Update App.tsx
    app_tsx_path = os.path.join(base_dir, app, 'src', 'App.tsx')
    if os.path.exists(app_tsx_path):
        with open(app_tsx_path, 'r', encoding='utf-8') as f:
            content = f.read()
        if 'basename=' not in content:
            content = content.replace('<Router>', f'<Router basename="/{app}">')
            with open(app_tsx_path, 'w', encoding='utf-8') as f:
                f.write(content)
            print(f'Updated {app_tsx_path}')
