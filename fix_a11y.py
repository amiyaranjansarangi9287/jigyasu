import os
import re

apps_dir = 'D:/vision_agentic/jigyasu/apps'

def fix_a11y_buttons():
    count = 0
    
    # Matches a <button ...> ... </button>
    button_pattern = re.compile(r'(<button[^>]*>)(.*?)(</button>)', re.DOTALL)
    
    # Function to replace each button match
    def replacer(match):
        nonlocal count
        start_tag = match.group(1)
        content = match.group(2)
        end_tag = match.group(3)
        
        # If it already has aria-label, leave it alone
        if 'aria-label=' in start_tag:
            return match.group(0)
            
        # Check if content has text
        has_text = bool(re.search(r'>\s*[a-zA-Z0-9]+\s*<', content)) or (content.strip() and '<' not in content)
        
        if not has_text:
            # Try to extract the icon name
            icon_match = re.search(r'<([A-Z][a-zA-Z0-9]+)', content)
            label = "Action button"
            
            if icon_match:
                icon_name = icon_match.group(1)
                # Convert PascalCase to Spaced words (e.g., ArrowLeft -> Arrow left)
                spaced_name = re.sub(r'(?<!^)(?=[A-Z])', ' ', icon_name).lower()
                label = spaced_name.capitalize()
                
            # Inject aria-label just before the closing >
            new_start_tag = re.sub(r'>$', f' aria-label="{label}">', start_tag)
            count += 1
            return new_start_tag + content + end_tag
            
        return match.group(0)
        
    for root, _, files in os.walk(apps_dir):
        if 'node_modules' in root or 'dist' in root:
            continue
        for file in files:
            if file.endswith('.tsx'):
                path = os.path.join(root, file)
                with open(path, 'r', encoding='utf-8') as f:
                    file_content = f.read()
                
                new_content = button_pattern.sub(replacer, file_content)
                
                if new_content != file_content:
                    with open(path, 'w', encoding='utf-8') as f:
                        f.write(new_content)
                    print(f"Fixed buttons in {path}")

    print(f"Total buttons patched with aria-label: {count}")

if __name__ == '__main__':
    fix_a11y_buttons()
