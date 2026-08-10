/**
 * Batch convert HTML pitch decks to PDF using Puppeteer.
 * Run: node docs/pitch-decks/html-to-pdf.cjs
 * 
 * Converts all HTML decks in investor-50/html/ to investor-50/pdf/
 * and all other folders to their respective locations.
 */
const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');

const BASE = __dirname;

// Folder mappings: { htmlDir, pdfDir }
const CONVERSIONS = [
  { htmlDir: 'investor-50/html', pdfDir: 'investor-50/pdf' },
  { htmlDir: 'investor', pdfDir: 'investor/pdf' },
  { htmlDir: 'sales', pdfDir: 'sales/pdf' },
  { htmlDir: 'design-partner', pdfDir: 'design-partner/pdf' },
  { htmlDir: 'gamma', pdfDir: 'gamma/pdf' },
];

async function convertHtmlToPdf(browser, htmlPath, pdfPath) {
  const page = await browser.newPage();
  
  // Load the HTML file
  const fileUrl = 'file:///' + htmlPath.replace(/\\/g, '/');
  await page.goto(fileUrl, { waitUntil: 'networkidle0', timeout: 30000 });
  
  // Wait a bit for any CSS animations/transitions
  await new Promise(r => setTimeout(r, 500));
  
  // Generate PDF - landscape, matching slide dimensions
  await page.pdf({
    path: pdfPath,
    width: '1280px',
    height: '720px',
    printBackground: true,
    margin: { top: 0, right: 0, bottom: 0, left: 0 },
    preferCSSPageSize: true,
  });
  
  await page.close();
}

async function main() {
  console.log('Launching browser...');
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  let total = 0;
  let errors = 0;

  for (const { htmlDir, pdfDir } of CONVERSIONS) {
    const htmlFullDir = path.join(BASE, htmlDir);
    const pdfFullDir = path.join(BASE, pdfDir);
    
    if (!fs.existsSync(htmlFullDir)) {
      console.log(`SKIP: ${htmlDir} (not found)`);
      continue;
    }
    
    // Ensure PDF output directory exists
    if (!fs.existsSync(pdfFullDir)) {
      fs.mkdirSync(pdfFullDir, { recursive: true });
      console.log(`Created: ${pdfDir}/`);
    }
    
    const htmlFiles = fs.readdirSync(htmlFullDir).filter(f => f.endsWith('.html'));
    console.log(`\n${htmlDir}/ (${htmlFiles.length} files)`);
    
    for (const file of htmlFiles) {
      const htmlPath = path.join(htmlFullDir, file);
      const pdfName = file.replace('.html', '.pdf');
      const pdfPath = path.join(pdfFullDir, pdfName);
      
      try {
        await convertHtmlToPdf(browser, htmlPath, pdfPath);
        total++;
        process.stdout.write(`  ✓ ${pdfName}\n`);
      } catch (err) {
        errors++;
        console.error(`  ✗ ${pdfName}: ${err.message}`);
      }
    }
  }

  // Also convert standalone HTML files in base directory
  const standaloneFiles = fs.readdirSync(BASE).filter(f => f.endsWith('.html'));
  if (standaloneFiles.length > 0) {
    const standalonePdfDir = path.join(BASE, 'pdf');
    if (!fs.existsSync(standalonePdfDir)) {
      fs.mkdirSync(standalonePdfDir, { recursive: true });
    }
    console.log(`\nstandalone/ (${standaloneFiles.length} files)`);
    for (const file of standaloneFiles) {
      const htmlPath = path.join(BASE, file);
      const pdfName = file.replace('.html', '.pdf');
      const pdfPath = path.join(standalonePdfDir, pdfName);
      try {
        await convertHtmlToPdf(browser, htmlPath, pdfPath);
        total++;
        process.stdout.write(`  ✓ ${pdfName}\n`);
      } catch (err) {
        errors++;
        console.error(`  ✗ ${pdfName}: ${err.message}`);
      }
    }
  }

  await browser.close();
  console.log(`\nDone! ${total} PDFs generated, ${errors} errors.`);
}

main().catch(err => {
  console.error('Fatal:', err);
  process.exit(1);
});
