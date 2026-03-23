"""Extract investor-500 data from Python source files and export as JSON."""
import json, re, os

BASE = os.path.dirname(os.path.abspath(__file__))
investors = []

# 1. Parse _firms_database.py (firms 121-200)
with open(os.path.join(BASE, '_firms_database.py'), encoding='utf-8') as f:
    content = f.read()

# Match dict entries like {'num': 121, 'slug': 'benchmark', 'name': 'Benchmark', ...}
dict_pattern = re.compile(
    r"\{\s*'num'\s*:\s*(\d+)\s*,\s*'slug'\s*:\s*'([^']*)'\s*,\s*'name'\s*:\s*'([^']*)'\s*,"
    r"\s*'type'\s*:\s*'([^']*)'\s*,\s*'loc'\s*:\s*'([^']*)'\s*,\s*'aum'\s*:\s*'([^']*)'\s*,"
    r"\s*'region'\s*:\s*'([^']*)'\s*,\s*'portfolio'\s*:\s*\[([^\]]*)\]\s*,"
    r"\s*'thesis'\s*:\s*'([^']*)'"
)
for m in dict_pattern.finditer(content):
    portfolio = [p.strip().strip("'\"") for p in m.group(8).split("',") if p.strip().strip("'\"")]
    investors.append({
        'num': int(m.group(1)), 'slug': m.group(2), 'name': m.group(3),
        'type': m.group(4), 'loc': m.group(5), 'aum': m.group(6),
        'region': m.group(7), 'portfolio': portfolio, 'thesis': m.group(9)
    })
print(f'From _firms_database.py: {len(investors)} entries')

# 2. Parse _generate_1000.py (firms 201-300)
tuple_pattern = re.compile(
    r"\('(\d+)'\s*,\s*'([^']*)'\s*,\s*'([^']*)'\s*,\s*'([^']*)'\s*,"
    r"\s*'([^']*)'\s*,\s*'([^']*)'\s*,\s*'([^']*)'\s*,\s*\[([^\]]*)\]\s*,"
    r"\s*'([^']*)'\s*\)"
)

with open(os.path.join(BASE, '_generate_1000.py'), encoding='utf-8') as f:
    content = f.read()
count_before = len(investors)
for m in tuple_pattern.finditer(content):
    portfolio = [p.strip().strip("'\"") for p in m.group(8).split("',") if p.strip().strip("'\"")]
    investors.append({
        'num': int(m.group(1)), 'slug': m.group(2), 'name': m.group(3),
        'type': m.group(4), 'loc': m.group(5), 'aum': m.group(6),
        'region': m.group(7), 'portfolio': portfolio, 'thesis': m.group(9)
    })
print(f'From _generate_1000.py: {len(investors) - count_before} entries')

# 3. Parse _generate_remaining.py (firms 301-500)
with open(os.path.join(BASE, '_generate_remaining.py'), encoding='utf-8') as f:
    content = f.read()
count_before = len(investors)
for m in tuple_pattern.finditer(content):
    portfolio = [p.strip().strip("'\"") for p in m.group(8).split("',") if p.strip().strip("'\"")]
    investors.append({
        'num': int(m.group(1)), 'slug': m.group(2), 'name': m.group(3),
        'type': m.group(4), 'loc': m.group(5), 'aum': m.group(6),
        'region': m.group(7), 'portfolio': portfolio, 'thesis': m.group(9)
    })
print(f'From _generate_remaining.py: {len(investors) - count_before} entries')

# Deduplicate by num, sort
seen = set()
unique = []
for inv in sorted(investors, key=lambda x: x['num']):
    if inv['num'] not in seen:
        seen.add(inv['num'])
        unique.append(inv)

output_path = os.path.join(BASE, '_investor_500_data.json')
with open(output_path, 'w', encoding='utf-8') as f:
    json.dump(unique, f, indent=2, ensure_ascii=False)

print(f'\nTotal unique entries: {len(unique)}')
print(f'Range: {unique[0]["num"]}-{unique[-1]["num"]}')
print(f'Written to {output_path}')
