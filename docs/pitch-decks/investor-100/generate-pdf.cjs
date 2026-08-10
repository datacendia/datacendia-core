#!/usr/bin/env node
/**
 * Generate PDFs from the investor-100 HTML decks using Puppeteer.
 */
const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const htmlDir = path.join(__dirname, 'html');
const pdfDir = path.join(__dirname, 'pdf');
if (!fs.existsSync(pdfDir)) fs.mkdirSync(pdfDir, { recursive: true });

async function main() {
  const files = fs.readdirSync(htmlDir).filter(f => f.endsWith('.html')).sort();
  console.log(`Generating ${files.length} PDFs from HTML...\n`);

  const browser = await puppeteer.launch({ headless: 'new' });
  let count = 0, errors = 0;

  for (const file of files) {
    const htmlPath = path.join(htmlDir, file);
    const pdfName = file.replace('.html', '.pdf');
    const pdfPath = path.join(pdfDir, pdfName);
    try {
      const page = await browser.newPage();
      await page.goto('file:///' + htmlPath.replace(/\\/g, '/'), { waitUntil: 'networkidle0', timeout: 30000 });
      await page.pdf({
        path: pdfPath,
        width: '13.33in',
        height: '7.5in',
        printBackground: true,
        margin: { top: 0, right: 0, bottom: 0, left: 0 },
      });
      await page.close();
      count++;
      process.stdout.write(`  ✓ ${pdfName}\n`);
    } catch (err) {
      errors++;
      console.error(`  ✗ ${pdfName}: ${err.message}`);
    }
  }

  await browser.close();
  console.log(`\nDone! ${count} PDFs generated, ${errors} errors.`);
}

main().catch(err => { console.error('Fatal:', err); process.exit(1); });
