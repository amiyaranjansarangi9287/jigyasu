import json
import re

with open('D:/vision_agentic/jigyasu/apps/hub/src/learnos/worlds/early/data/earlyContent.ts', 'r', encoding='utf-8') as f:
    content = f.read()

with open('D:/vision_agentic/jigyasu/scratch/early.json', 'r', encoding='utf-8') as f:
    early_data = json.load(f)

# Story
for c_id, name in early_data['story']['characters'].items():
    content = content.replace(f"name: '{name}'", f"name: 'early.story.characters.{c_id}'")
for p_id, name in early_data['story']['places'].items():
    content = content.replace(f"name: '{name}'", f"name: 'early.story.places.{p_id}'")
for p_id, name in early_data['story']['problems'].items():
    content = content.replace(f"name: '{name}'", f"name: 'early.story.problems.{p_id}'")

# Recipes
for r_id, r_data in early_data['recipes'].items():
    name = r_data['name']
    content = content.replace(f"name: '{name}'", f"name: 'early.recipes.{r_id}.name'")
    for i, ing in r_data['ingredients'].items():
        ing_name = ing['name']
        ing_unit = ing['unit']
        # This might be tricky if names repeat across recipes, but let's try
        content = re.sub(rf"name: '{ing_name}'(.*?unit: '{ing_unit}')", rf"name: 'early.recipes.{r_id}.ingredients.{i}.name'\1", content)
        # also replace unit: 'unit' -> unit: 'early.recipes.x.ingredients.y.unit'
        # wait, it's safer to just let translation handle it in components instead of replacing unit here if we can't reliably regex it.
        # Actually, let's just do a simple replace since it's on a single line usually
        content = content.replace(f"name: '{ing_name}'", f"name: 'early.recipes.{r_id}.ingredients.{i}.name'")
        content = content.replace(f"unit: '{ing_unit}'", f"unit: 'early.recipes.{r_id}.ingredients.{i}.unit'")

# Alphabet
for letter, a_data in early_data['alphabet'].items():
    sound = a_data['phonemeSound']
    content = content.replace(f"phonemeSound: '{sound}'", f"phonemeSound: 'early.alphabet.{letter}.phonemeSound'")
    for i, word in a_data['items'].items():
        # Because we might replace word globally, let's be careful
        content = content.replace(f"word: '{word}'", f"word: 'early.alphabet.{letter}.items.{i}'")

# Sentences
for s_id, s_data in early_data['sentences'].items():
    # Sentences are words: ['The', 'dog', 'runs', 'fast']
    for i, word in s_data['words'].items():
        # This is very hard to replace safely via text replace.
        pass

with open('D:/vision_agentic/jigyasu/apps/hub/src/learnos/worlds/early/data/earlyContent.ts', 'w', encoding='utf-8') as f:
    f.write(content)
