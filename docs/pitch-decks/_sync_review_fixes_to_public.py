import glob
import os
import shutil

DOCS_BASE = r'c:\Users\Stu\datacendia-core\docs\pitch-decks'
PUBLIC_BASE = r'c:\Users\Stu\datacendia-core\public\pitch-decks'

FOLDERS = [
    'investor-500',
    'investor-100',
    'investor-50',
    'design-partner',
    'enterprise',
    'regional',
    'gamma',
]


def sync_folder(folder):
    copied = 0
    for fmt in ['pptx', 'pdf']:
        src_dir = os.path.join(DOCS_BASE, folder, fmt)
        dst_dir = os.path.join(PUBLIC_BASE, folder, fmt)
        os.makedirs(dst_dir, exist_ok=True)
        for src in glob.glob(os.path.join(src_dir, f'*.{fmt}')):
            dst = os.path.join(dst_dir, os.path.basename(src))
            shutil.copy2(src, dst)
            copied += 1
    return copied


def sync_investor_50_index():
    copied = 0
    for fmt, ext in [('pptx', 'pptx'), ('pdf', 'pdf')]:
        src = os.path.join(DOCS_BASE, 'investor-50', fmt, f'index.{ext}')
        dst_dir = os.path.join(PUBLIC_BASE, 'investor-50', fmt)
        os.makedirs(dst_dir, exist_ok=True)
        dst = os.path.join(dst_dir, f'index.{ext}')
        shutil.copy2(src, dst)
        copied += 1
    return copied


def main():
    total = 0
    for folder in FOLDERS:
        copied = sync_folder(folder)
        total += copied
        print(f'{folder}: {copied} file(s)')
    copied = sync_investor_50_index()
    total += copied
    print(f'investor-50 index: {copied} file(s)')
    print(f'total copied: {total}')


if __name__ == '__main__':
    main()
