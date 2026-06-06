import os
import re

apps_dir = 'D:/vision_agentic/jigyasu/apps'

def fix_lazy_imports():
    count = 0
    lazy_pattern = re.compile(r"const\s+([a-zA-Z0-9_]+)\s*=\s*lazy\(\s*\(\)\s*=>\s*import\(\s*['\"]([^'\"]+)['\"]\s*\)\s*\);?")
    
    for root, _, files in os.walk(apps_dir):
        if 'node_modules' in root or 'dist' in root:
            continue
        for file in files:
            if file.endswith('.tsx') or file.endswith('.ts'):
                path = os.path.join(root, file)
                with open(path, 'r', encoding='utf-8') as f:
                    content = f.read()
                
                # Check if it has lazy imports
                if lazy_pattern.search(content):
                    # Check if it uses Suspense
                    if '<Suspense' not in content:
                        # Replace lazy imports
                        def replacer(match):
                            component_name = match.group(1)
                            import_path = match.group(2)
                            return f"import {component_name} from '{import_path}';"
                            
                        new_content = lazy_pattern.sub(replacer, content)
                        
                        with open(path, 'w', encoding='utf-8') as f:
                            f.write(new_content)
                        print(f"Fixed {path}")
                        count += 1

    print(f"Total files fixed: {count}")

if __name__ == '__main__':
    fix_lazy_imports()
