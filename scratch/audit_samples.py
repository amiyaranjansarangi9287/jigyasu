import json

with open('D:/vision_agentic/jigyasu/apps/hub/src/learnos/i18n/locales/en.json', 'r', encoding='utf-8') as f:
    en_data = json.load(f)

print("=== EARLY ===")
for mod in list(en_data['early']['story']['problems'].values())[:5]:
    print("-", mod)
print("\n=== EXPLORER ===")
for mod_id, mod in list(en_data['explorer']['modules'].items())[:3]:
    print(f"Title: {mod.get('title')}")
    print(f"Goal: {mod.get('mission', {}).get('goal')}")
    print(f"Hook: {mod.get('narrative', {}).get('hook')}")
    print(f"Wonder: {mod.get('narrative', {}).get('wonder')}")
print("\n=== LAB ===")
for mod_id, mod in list(en_data['lab']['modules'].items())[:5]:
    print(f"Title: {mod.get('title')}")
    print(f"Connection: {mod.get('realWorldConnection')}")
