"""Move misplaced PDFs from pptx/ folders to correct pdf/ folders."""
import os, shutil, glob

BASE = r'C:\Users\Stu\datacendia-core\docs\pitch-decks'

moved = 0
for root, dirs, files in os.walk(BASE):
    for f in files:
        if not f.endswith('.pdf'):
            continue
        full = os.path.join(root, f)
        # If this PDF is inside a pptx/ folder, move it to the parallel pdf/ folder
        if '\\pptx\\' in full or '/pptx/' in full:
            pdf_dir = root.replace('\\pptx', '\\pdf').replace('/pptx', '/pdf')
            os.makedirs(pdf_dir, exist_ok=True)
            dest = os.path.join(pdf_dir, f)
            if os.path.exists(dest):
                # PDF already exists in correct location, just delete the misplaced one
                os.remove(full)
                print(f'  REMOVED (already exists): {os.path.relpath(full, BASE)}')
            else:
                shutil.move(full, dest)
                print(f'  MOVED: {os.path.relpath(full, BASE)} -> {os.path.relpath(dest, BASE)}')
            moved += 1

print(f'\nFixed {moved} misplaced PDFs')

# Verify final counts
for folder in ['pptx', 'investor/pptx', 'investor-50/pptx', 'investor-100/pptx', 
               'sales/pptx', 'design-partner/pptx', 'gamma/pptx']:
    path = os.path.join(BASE, folder)
    if os.path.exists(path):
        pptx = len(glob.glob(os.path.join(path, '*.pptx')))
        pdf = len(glob.glob(os.path.join(path, '*.pdf')))
        pdf_folder = folder.replace('/pptx', '/pdf').replace('pptx', 'pdf')
        pdf_path = os.path.join(BASE, pdf_folder)
        pdf_correct = len(glob.glob(os.path.join(pdf_path, '*.pdf'))) if os.path.exists(pdf_path) else 0
        print(f'{folder}: {pptx} PPTX, {pdf} stray PDF | {pdf_folder}: {pdf_correct} PDF')
