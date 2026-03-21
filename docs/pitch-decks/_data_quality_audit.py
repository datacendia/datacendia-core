"""
Audit the source data quality for ALL investor firms.
Flags:
  - Vague/placeholder portfolio entries (not real company names)
  - Extreme AUM claims that may be inflated
  - Suspicious or potentially fabricated firm entries
  - Missing web domains
"""
import os, sys, io, contextlib
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')

with contextlib.redirect_stdout(io.StringIO()):
    from _generate_1000 import INVESTOR_500_BATCH2
    from _firms_database import INVESTOR_500_NEW

try:
    with contextlib.redirect_stdout(io.StringIO()):
        from _generate_remaining import BATCH3
except ImportError:
    BATCH3 = []

ALL_FIRMS = INVESTOR_500_NEW + INVESTOR_500_BATCH2

# Add batch3 if available
for f in BATCH3:
    ALL_FIRMS.append(f)

# Vague portfolio detection: entries that aren't real company names
VAGUE_PATTERNS = [
    'enterprise', 'startups', 'tech', 'investments', 'ecosystem',
    'portfolio', 'alumni', 'companies', 'initiatives', 'economy',
    'infrastructure', 'network', 'technology', 'digital', 'legacy',
    'sector', 'region', 'market', 'industry', 'investing',
    'lending', 'opportunities', 'focused', 'opportunistic',
]


def is_vague_portfolio(portfolio):
    """Check if portfolio entries look like placeholders rather than real company names."""
    if not portfolio:
        return True
    vague_count = 0
    for entry in portfolio:
        entry_lower = entry.lower()
        # Real company names are usually short and don't contain generic descriptors
        if any(p in entry_lower for p in VAGUE_PATTERNS):
            vague_count += 1
        elif len(entry) > 50:  # Very long entries are likely descriptions
            vague_count += 1
    return vague_count == len(portfolio)


def check_aum(aum_str):
    """Flag extreme AUM claims."""
    if not aum_str or aum_str == 'N/A (Government)' or aum_str == 'N/A (Network)' or aum_str == 'N/A (Accelerator)':
        return None
    # Extract number
    aum_str = aum_str.replace('+', '').replace('$', '').strip()
    try:
        if 'T' in aum_str:
            val = float(aum_str.replace('T', '')) * 1000
        elif 'B' in aum_str:
            val = float(aum_str.replace('B', ''))
        elif 'M' in aum_str:
            val = float(aum_str.replace('M', '')) / 1000
        else:
            return None
        if val > 100:  # >$100B is worth flagging
            return f'HIGH AUM: ${aum_str}+'
    except:
        pass
    return None


# Run audit
print('=' * 80)
print('DATA QUALITY AUDIT — ALL INVESTOR FIRMS')
print('=' * 80)

vague_portfolio_firms = []
high_aum_firms = []
no_web_firms = []
suspicious_types = []

for firm in ALL_FIRMS:
    name = firm.get('name', '?')
    num = firm.get('num', '?')
    slug = firm.get('slug', '?')
    portfolio = firm.get('portfolio', [])
    aum = firm.get('aum', '')
    web = firm.get('web', '')
    ftype = firm.get('type', '')

    # Check vague portfolio
    if is_vague_portfolio(portfolio):
        vague_portfolio_firms.append((num, slug, name, portfolio))

    # Check AUM
    aum_flag = check_aum(aum)
    if aum_flag:
        high_aum_firms.append((num, slug, name, aum))

    # Check web
    if not web:
        no_web_firms.append((num, slug, name))

    # Check suspicious types
    if ftype in ['Government', 'Impact Accelerator', 'Government-aligned Fund']:
        suspicious_types.append((num, slug, name, ftype))


print(f'\nTotal firms audited: {len(ALL_FIRMS)}')
print()

print(f'--- VAGUE/PLACEHOLDER PORTFOLIOS ({len(vague_portfolio_firms)}) ---')
print('These entries have generic descriptions instead of real company names:')
for num, slug, name, port in vague_portfolio_firms:
    print(f'  [{num}] {name}: {port}')

print(f'\n--- HIGH AUM CLAIMS ({len(high_aum_firms)}) ---')
print('AUM >$100B — should be verified:')
for num, slug, name, aum in high_aum_firms:
    print(f'  [{num}] {name}: {aum}')

print(f'\n--- NO WEB DOMAIN ({len(no_web_firms)}) ---')
for num, slug, name in no_web_firms[:20]:
    print(f'  [{num}] {name}')
if len(no_web_firms) > 20:
    print(f'  ... +{len(no_web_firms)-20} more')

print(f'\n--- SUSPICIOUS TYPES ({len(suspicious_types)}) ---')
print('Not traditional investment firms:')
for num, slug, name, ftype in suspicious_types:
    print(f'  [{num}] {name} ({ftype})')

print(f'\n--- SUMMARY ---')
print(f'  Total firms: {len(ALL_FIRMS)}')
print(f'  Vague portfolios: {len(vague_portfolio_firms)}')
print(f'  High AUM claims: {len(high_aum_firms)}')
print(f'  No web domain: {len(no_web_firms)}')
print(f'  Suspicious types: {len(suspicious_types)}')
