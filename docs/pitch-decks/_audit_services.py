"""Audit all backend services across both repos: categorize as full vs stub."""
import os

def scan_services(base_path, label):
    stubs = []
    full = []
    for root, dirs, files in os.walk(base_path):
        for f in files:
            if not f.endswith('.ts'):
                continue
            fp = os.path.join(root, f)
            sz = os.path.getsize(fp)
            rel = os.path.relpath(fp, base_path)
            if sz < 1000:
                stubs.append((rel, sz))
            else:
                full.append((rel, sz))
    
    print(f'\n{"="*70}')
    print(f'{label}')
    print(f'{"="*70}')
    print(f'Full implementations (>1KB): {len(full)}')
    print(f'Stubs (<1KB): {len(stubs)}')
    
    # Group by directory
    dirs_full = {}
    dirs_stub = {}
    for rel, sz in full:
        d = rel.split(os.sep)[0] if os.sep in rel else '(root)'
        if d not in dirs_full:
            dirs_full[d] = []
        dirs_full[d].append((rel, sz))
    for rel, sz in stubs:
        d = rel.split(os.sep)[0] if os.sep in rel else '(root)'
        if d not in dirs_stub:
            dirs_stub[d] = []
        dirs_stub[d].append((rel, sz))
    
    print(f'\n--- Full by directory ---')
    for d in sorted(dirs_full.keys()):
        items = dirs_full[d]
        total_kb = sum(sz for _, sz in items) / 1024
        print(f'  {d}: {len(items)} files, {total_kb:.0f} KB')
    
    print(f'\n--- Stubs by directory ---')
    for d in sorted(dirs_stub.keys()):
        items = dirs_stub[d]
        print(f'  {d}: {len(items)} stubs')
        for rel, sz in sorted(items):
            print(f'    {rel} ({sz}B)')
    
    return full, stubs

# datacendia-core
core_full, core_stubs = scan_services(
    r'C:\Users\Stu\datacendia-core\backend\src\services',
    'DATACENDIA-CORE (Community Edition)'
)

# datacendia-components  
comp_full, comp_stubs = scan_services(
    r'C:\Users\Stu\datacendia-components\backend\src\services',
    'DATACENDIA-COMPONENTS (Full Platform)'
)

# Compare: what's in components but stub/missing in core?
print(f'\n{"="*70}')
print('COMPARISON: Components has full, Core has stub')
print(f'{"="*70}')

core_stub_names = set(os.path.basename(r) for r, _ in core_stubs)
comp_full_names = {os.path.basename(r): sz for r, sz in comp_full}

upgradeable = []
for name in sorted(core_stub_names):
    if name in comp_full_names:
        upgradeable.append((name, comp_full_names[name]))

print(f'Services that are stubs in core but full in components: {len(upgradeable)}')
for name, sz in upgradeable:
    print(f'  {name}: {sz/1024:.0f} KB in components')
