import re

test = "useState<Color>{t('auto.worlds_games_games_Chess.w______const__legalmoves__se', '('w');"
pattern = r"useState<([A-Za-z0-9_\s|'|]+)>\{t\('auto\.[^']+',\s*\('([^']+)'\);"

m = re.search(pattern, test)
if m:
    print('MATCH:', m.group(1), m.group(2))
else:
    print('NO MATCH')
    # Try simpler pattern
    p2 = r"useState<(\w+)>\{t\('auto\.[^']+',\s*\('(\w+)'\);"
    m2 = re.search(p2, test)
    if m2:
        print('MATCH p2:', m2.group(1), m2.group(2))
    else:
        print('NO MATCH p2')
