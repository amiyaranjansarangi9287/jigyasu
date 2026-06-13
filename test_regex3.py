import re

test = "useState<Color>{t('auto.worlds_games_games_Chess.w______const__legalmoves__se', '('w');"

# Test step by step
p1 = r"useState<(\w+)>"
m1 = re.search(p1, test)
print('p1:', bool(m1), m1.group(1) if m1 else None)

p2 = r"useState<(\w+)>\{t\("
m2 = re.search(p2, test)
print('p2:', bool(m2))

p3 = r"useState<(\w+)>\{t\('auto\."
m3 = re.search(p3, test)
print('p3:', bool(m3))

p4 = r"useState<(\w+)>\{t\('auto\.[^']+'"
m4 = re.search(p4, test)
print('p4:', bool(m4))

p5 = r"useState<(\w+)>\{t\('auto\.[^']+',\s*"
m5 = re.search(p5, test)
print('p5:', bool(m5))

p6 = r"useState<(\w+)>\{t\('auto\.[^']+',\s*\('"
m6 = re.search(p6, test)
print('p6:', bool(m6))

p7 = r"useState<(\w+)>\{t\('auto\.[^']+',\s*\('(\w+)'"
m7 = re.search(p7, test)
print('p7:', bool(m7), m7.group(1) if m7 else None)

p8 = r"useState<(\w+)>\{t\('auto\.[^']+',\s*\('(\w+)'\);"
m8 = re.search(p8, test)
print('p8:', bool(m8), m8.group(1) if m8 else None)
