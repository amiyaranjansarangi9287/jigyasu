test = "useState<Color>{t('auto.worlds_games_games_Chess.w______const__legalmoves__se', '('w');"

# Print each character with its codepoint
for i, ch in enumerate(test):
    print(f'{i}: {repr(ch)} = U+{ord(ch):04X}')
