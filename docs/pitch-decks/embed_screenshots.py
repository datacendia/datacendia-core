"""
Embed platform screenshots into all pitch deck PPTX files.
Matches slide content keywords to appropriate screenshots.
"""
from pptx import Presentation
from pptx.util import Inches, Emu
from pptx.enum.shapes import MSO_SHAPE_TYPE
import os, glob, sys

BASE = r'C:\Users\Stu\datacendia-core\docs\pitch-decks'
SCREENSHOTS = os.path.join(BASE, 'screenshots')

# ─── Screenshot-to-keyword mapping ──────────────────────────────────────────
# Each entry: (screenshot_filename, [keywords that match slide content])
MAPPINGS = [
    ('01-dashboard.png',              ['dashboard', 'helm overview', 'cortex dashboard']),
    ('02-council-deliberation.png',   ['multi-agent', 'decision engine', 'deliberation', 'council deliberat', 'ai agents']),
    ('03-post-deliberation.png',      ['post-deliberation', 'completed deliberation', 'agent contributions']),
    ('04-dcii-dashboard.png',         ['dcii', 'crisis immunization', 'iiss score', 'decision integrity']),
    ('05-decisions.png',              ['decision audit trail', 'decision history', 'tracked with full evidence', 'audit trail']),
    ('06-gateway-dashboard.png',      ['gateway', 'pii detection', 'policy block', 'ai governance gateway']),
    ('07-graph-explorer.png',         ['graph', 'decision graph', 'visualization', 'entity relationship']),
    ('08-executive-summary.png',      ['executive summary', 'board-ready', 'executive brief']),
    ('09-council-analytics.png',      ['council analytics', 'agent performance', 'consensus trend']),
    ('10-evidence-vault.png',         ['evidence vault', 'evidence chain', 'locked decision packet', 'integrity hash']),
    ('11-ledger.png',                 ['ledger', 'blockchain', 'immutable', 'chain verification']),
    ('12-collapse.png',               ['collapse', 'crisis simulation', 'stress test', 'wargam']),
    ('13-pulse.png',                  ['pulse', 'real-time monitor', 'system monitor']),
    ('14-carbon-aware.png',           ['carbon', 'esg', 'sustainability', 'carbon-aware']),
    ('15-chronos.png',                ['chronos', 'time machine', 'timeline', 'temporal']),
    ('16-redteam.png',                ['red team', 'adversarial', 'attack simul']),
    ('17-gnosis.png',                 ['gnosis', 'pattern discovery', 'deep decision intelligence']),
    ('18-echo.png',                   ['echo', 'echo chamber', 'bias detection']),
    ('19-defense-stack.png',          ['defense stack', 'multi-layer', 'threat monitor', 'defense & national']),
    ('20-crisis.png',                 ['crisis management', 'war room']),
    ('21-apotheosis.png',             ['apotheosis', 'autonomous ai governance', 'ascension']),
    ('22-post-quantum.png',           ['post-quantum', 'cryptographic key', 'quantum']),
    ('23-ai-insurance.png',           ['insurance', 'ai liability', 'cendia insure']),
    ('24-persona-forge.png',          ['persona forge', 'synthetic stakeholder', 'persona']),
    ('25-dissent.png',                ['dissent', 'devil.s advocate']),
    ('26-escrow.png',                 ['escrow', 'shamir', 'secret sharing', 'time-lock']),
    ('27-workflow-builder-core.png',  ['workflow', 'orchestration', 'service orchestrat']),
    ('29-gap-scanner.png',            ['gap scan', 'compliance gap', 'framework gap']),
    ('30-compliance-readiness.png',   ['compliance readiness', 'compliance dashboard', 'five rings', 'compliance framework']),
    ('31-sovereign.png',              ['sovereign deploy', 'data residency', 'air-gap', 'sovereign stack']),
    ('32-mesh.png',                   ['mesh', 'api orchestrat', 'integration mesh']),
    ('33-roi-metrics.png',            ['roi', 'return on investment', 'governance roi', 'deliberation throughput']),
]

def get_slide_text(slide):
    """Get all text from a slide as lowercase string."""
    texts = []
    for shape in slide.shapes:
        if shape.has_text_frame:
            for para in shape.text_frame.paragraphs:
                t = para.text.strip()
                if t:
                    texts.append(t.lower())
    return ' '.join(texts)

def find_best_screenshot(slide_text):
    """Find the best matching screenshot for a slide's text content."""
    best_score = 0
    best_img = None
    for img_name, keywords in MAPPINGS:
        score = sum(1 for kw in keywords if kw.lower() in slide_text)
        if score > best_score:
            best_score = score
            best_img = img_name
    return best_img if best_score > 0 else None

def has_image(slide):
    """Check if slide already has an image."""
    for shape in slide.shapes:
        if shape.shape_type == MSO_SHAPE_TYPE.PICTURE:
            return True
    return False

def remove_images(slide):
    """Remove existing images from a slide."""
    to_remove = []
    for shape in slide.shapes:
        if shape.shape_type == MSO_SHAPE_TYPE.PICTURE:
            to_remove.append(shape)
    for shape in to_remove:
        sp = shape._element
        sp.getparent().remove(sp)

def add_screenshot(slide, img_path, prs):
    """Add a screenshot to a slide, positioned on the right half."""
    slide_width = prs.slide_width
    slide_height = prs.slide_height
    
    # Position: right side of slide, vertically centered with some padding
    img_width = Inches(5.5)
    img_height = Inches(3.4)
    left = slide_width - img_width - Inches(0.3)
    top = Inches(1.5)
    
    slide.shapes.add_picture(img_path, left, top, img_width, img_height)

def process_deck(pptx_path, dry_run=False):
    """Process a single PPTX file."""
    prs = Presentation(pptx_path)
    rel = os.path.relpath(pptx_path, BASE)
    changes = 0
    
    for i, slide in enumerate(prs.slides):
        slide_text = get_slide_text(slide)
        
        # Skip cover slides (slide 1), founder slides, ask slides, next steps
        skip_keywords = ['let\'s talk', 'next steps', 'schedule deep dive', 'founder', 'stuart rainey', 'the ask', '$1.5m', 'pre-seed']
        if any(kw in slide_text for kw in skip_keywords):
            continue
        
        best_img = find_best_screenshot(slide_text)
        if best_img:
            img_path = os.path.join(SCREENSHOTS, best_img)
            if os.path.exists(img_path):
                if dry_run:
                    had_img = ' (replacing existing)' if has_image(slide) else ''
                    print(f'  Slide {i+1}{had_img}: + {best_img}')
                else:
                    if has_image(slide):
                        remove_images(slide)
                    add_screenshot(slide, img_path, prs)
                changes += 1
    
    if changes > 0 and not dry_run:
        prs.save(pptx_path)
    
    return changes

# ─── Main ────────────────────────────────────────────────────────────────────
if __name__ == '__main__':
    dry_run = '--dry-run' in sys.argv
    
    if dry_run:
        print('DRY RUN — no files will be modified\n')
    
    folders = ['pptx', 'investor/pptx', 'sales/pptx', 'design-partner/pptx', 
               'gamma/pptx', 'investor-50/pptx', 'investor-100/pptx']
    
    total_files = 0
    total_changes = 0
    
    for folder in folders:
        path = os.path.join(BASE, folder)
        if not os.path.exists(path):
            continue
        files = sorted(glob.glob(os.path.join(path, '*.pptx')))
        
        print(f'\n{"="*60}')
        print(f'{folder}/ — {len(files)} files')
        print(f'{"="*60}')
        
        for f in files:
            name = os.path.basename(f)
            changes = process_deck(f, dry_run)
            if changes > 0:
                status = 'would add' if dry_run else 'added'
                print(f'  {name}: {status} {changes} screenshot(s)')
                total_changes += changes
            total_files += 1
    
    action = 'Would modify' if dry_run else 'Modified'
    print(f'\n{"="*60}')
    print(f'DONE: {total_files} files processed, {total_changes} screenshots {action.lower()}')
    print(f'{"="*60}')
