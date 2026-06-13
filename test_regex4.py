import re

test = "useState<Color>{t('auto.worlds_games_games_Chess.w______const__legalmoves__se', '('w');"

# The pattern has ''(' before the value
p = r"useState<(\w+)>\{t\('auto\.[^']+',\s*'\('([^']+)'\);"
m = re.search(p, test)
print('p:', bool(m), m.group(1), m.group(2) if m else None)

# Full replacement
test2 = re.sub(
    r"useState<(\w+)>\{t\('auto\.[^']+',\s*'\('([^']+)'\);",
    r"useState<\1>('\2');",
    test
)
print('result:', test2)
