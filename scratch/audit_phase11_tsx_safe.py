import os
import re

TARGET_DIR = "apps/hub/src/learnos/worlds"
WORLDS = ["academy", "discovery", "explorer", "early", "tiny", "lab"]

def escape_str(s):
    return s.replace("'", "\\'")

def process_file(filepath, world):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    original_content = content
    module_name = os.path.basename(filepath).replace('.tsx', '')

    # Inject import if missing
    if 'useTranslation' not in content:
        content = re.sub(
            r"(import React.*?;\n|import \{.*?\} from 'react'.*?;\n)",
            r"\1import { useTranslation } from 'react-i18next';\n",
            content,
            count=1
        )
        if 'useTranslation' not in content:
            content = "import { useTranslation } from 'react-i18next';\n" + content

    # Inject const { t } = useTranslation(); inside component body
    func_pattern = re.compile(r"(export default function\s+\w+\s*\([^)]*\)\s*\{)")
    if not re.search(r"const \{ t \} = useTranslation\(\);", content):
        content = func_pattern.sub(r"\1\n  const { t } = useTranslation();", content, count=1)

    # Replace <button>Text</button>
    def button_repl(m):
        attrs = m.group(1)
        text = m.group(2).strip()
        if not text or '{' in text or '<' in text or '\n' in text or '>' in text: return m.group(0)
        key = f"{world}.modules.{module_name}.btn_{re.sub(r'[^a-zA-Z0-9]', '', text)[:10]}"
        return f"<button{attrs}>{{t('{key}', '{escape_str(text)}')}}</button>"
    content = re.sub(r"<button([^>]*)>([^<]+)</button>", button_repl, content)

    # Replace <p>Text</p>
    def p_repl(m):
        attrs = m.group(1)
        text = m.group(2).strip()
        if not text or '{' in text or '<' in text or '\n' in text or '>' in text: return m.group(0)
        key = f"{world}.modules.{module_name}.txt_{re.sub(r'[^a-zA-Z0-9]', '', text)[:10]}"
        return f"<p{attrs}>{{t('{key}', '{escape_str(text)}')}}</p>"
    content = re.sub(r"<p([^>]*)>([^<]+)</p>", p_repl, content)

    # Replace <span>Text</span>
    def span_repl(m):
        attrs = m.group(1)
        text = m.group(2).strip()
        if not text or '{' in text or '<' in text or '\n' in text or '>' in text: return m.group(0)
        key = f"{world}.modules.{module_name}.spn_{re.sub(r'[^a-zA-Z0-9]', '', text)[:10]}"
        return f"<span{attrs}>{{t('{key}', '{escape_str(text)}')}}</span>"
    content = re.sub(r"<span([^>]*)>([^<]+)</span>", span_repl, content)

    if content != original_content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        return True
    return False

def main():
    updated = 0
    for world in WORLDS:
        modules_dir = os.path.join(TARGET_DIR, world, "modules")
        if not os.path.exists(modules_dir):
            continue
        for filename in os.listdir(modules_dir):
            if filename.endswith(".tsx"):
                filepath = os.path.join(modules_dir, filename)
                if process_file(filepath, world):
                    updated += 1
    print(f"Updated {updated} component files.")

if __name__ == "__main__":
    main()
