"""
Regenerate PDFs from all updated PPTX files using PowerPoint COM automation.
"""
import os, glob, sys, time

try:
    import comtypes.client
except ImportError:
    print("Installing comtypes...")
    os.system("pip install comtypes")
    import comtypes.client

BASE = r'C:\Users\Stu\datacendia-core\docs\pitch-decks'

def get_pdf_output_path(pptx_path):
    """Normalize PPTX path and compute corresponding PDF output path."""
    pptx_path = os.path.normpath(pptx_path)
    pdf_path = pptx_path.replace('\\pptx\\', '\\pdf\\').replace('/pptx/', '/pdf/')
    pdf_path = pdf_path.replace('.pptx', '.pdf')
    return pdf_path

def pptx_to_pdf(pptx_path, pdf_path):
    """Convert a single PPTX to PDF using PowerPoint."""
    powerpoint = comtypes.client.CreateObject("Powerpoint.Application")
    powerpoint.Visible = 1
    
    try:
        deck = powerpoint.Presentations.Open(os.path.abspath(pptx_path), WithWindow=False)
        deck.SaveAs(os.path.abspath(pdf_path), 32)  # 32 = ppSaveAsPDF
        deck.Close()
    finally:
        powerpoint.Quit()

def batch_convert(pptx_paths, progress_label=""):
    """Convert multiple PPTX files to PDF using a single PowerPoint instance."""
    if not pptx_paths:
        return 0
    
    powerpoint = comtypes.client.CreateObject("Powerpoint.Application")
    powerpoint.Visible = 1
    converted = 0
    
    try:
        for i, pptx_path in enumerate(pptx_paths):
            # Determine PDF output path (same folder structure, pptx/ -> pdf/)
            pdf_path = get_pdf_output_path(pptx_path)
            
            # Ensure pdf directory exists
            pdf_dir = os.path.dirname(pdf_path)
            os.makedirs(pdf_dir, exist_ok=True)
            
            try:
                deck = powerpoint.Presentations.Open(
                    os.path.abspath(pptx_path), 
                    ReadOnly=True, 
                    WithWindow=False
                )
                deck.SaveAs(os.path.abspath(pdf_path), 32)
                deck.Close()
                converted += 1
                name = os.path.basename(pptx_path)
                print(f'  [{i+1}/{len(pptx_paths)}] {name} -> PDF')
            except Exception as e:
                print(f'  ERROR: {os.path.basename(pptx_path)}: {e}')
    finally:
        try:
            powerpoint.Quit()
        except:
            pass
    
    return converted

def main():
    folders = ['pptx', 'investor/pptx', 'sales/pptx', 'design-partner/pptx', 
               'gamma/pptx', 'investor-50/pptx', 'investor-100/pptx',
               'investor-500/pptx', 'enterprise/pptx', 'regional/pptx']
    
    test_mode = '--test' in sys.argv
    
    total_converted = 0
    
    for folder in folders:
        path = os.path.join(BASE, folder)
        if not os.path.exists(path):
            continue
        
        files = sorted(glob.glob(os.path.join(path, '*.pptx')))
        
        if test_mode:
            files = files[:1]  # Just first file per category
        
        if not files:
            continue
        
        print(f'\n{folder}/ -- {len(files)} deck(s)')
        converted = batch_convert(files, folder)
        total_converted += converted
    
    print(f'\nDONE: {total_converted} PDFs generated')

if __name__ == '__main__':
    main()
